/**
 * Download Queue Manager - Handle multiple downloads sequentially
 * Ensures only ONE FileTransfer listener is active at a time
 * Prevents Android storage write conflicts by processing downloads one at a time
 * Includes automatic retry logic (3 attempts) for failed downloads
 */

import type { LocalTrack } from '../types';
import type { DownloadProgressCallback } from './downloadService';
import { downloadMusicFile } from './downloadService';

export interface QueuedDownload {
  track: LocalTrack;
  retryCount?: number;
  onProgress?: DownloadProgressCallback;
  onComplete?: (result: {
    filePath: string;
    fileSize: number;
    metadata: LocalTrack['metadata'];
    albumArt?: string;
  }) => void;
  onError?: (error: Error) => void;
}

export interface QueueStatus {
  queueLength: number;
  activeDownload: LocalTrack | null;
  isPaused: boolean;
  totalCompleted: number;
  totalFailed: number;
}

export type QueueStatusCallback = (status: QueueStatus) => void;

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000; // 1 second between retries

class DownloadQueueManager {
  private queue: QueuedDownload[] = [];
  private activeDownload: QueuedDownload | null = null;
  private isProcessing: boolean = false;
  private isPaused: boolean = false;
  private totalCompleted: number = 0;
  private totalFailed: number = 0;
  private statusCallback: QueueStatusCallback | null = null;

  /**
   * Subscribe to queue status updates
   */
  public onStatusChange(callback: QueueStatusCallback): void {
    this.statusCallback = callback;
  }

  /**
   * Add a download to the queue
   */
  public async addToQueue(
    track: LocalTrack,
    onProgress?: DownloadProgressCallback,
    onComplete?: QueuedDownload['onComplete'],
    onError?: QueuedDownload['onError']
  ): Promise<void> {
    console.log(`[DownloadQueue] ===== ADD TO QUEUE =====`);
    console.log(`[DownloadQueue] Track: ${track.name}`);
    console.log(`[DownloadQueue] URL: ${track.downloadUrl}`);
    console.log(`[DownloadQueue] Current queue length: ${this.queue.length}`);

    // Check if track is already in queue or downloading
    const isDuplicate =
      this.queue.some((d) => d.track.downloadUrl === track.downloadUrl) ||
      (this.activeDownload && this.activeDownload.track.downloadUrl === track.downloadUrl);

    if (isDuplicate) {
      console.warn(`[DownloadQueue] DUPLICATE REJECTED: ${track.name}`);
      const error = new Error('This track is already in the download queue');
      if (onError) {
        onError(error);
      }
      return;
    }

    // Add to queue with retry count initialized to 0
    this.queue.push({
      track,
      retryCount: 0,
      onProgress,
      onComplete,
      onError
    });

    console.log(`[DownloadQueue] ✅ Track added successfully`);
    console.log(`[DownloadQueue] New queue length: ${this.queue.length}`);
    console.log(`[DownloadQueue] Queue tracks: ${this.queue.map(d => d.track.name).join(', ')}`);
    console.log(`[DownloadQueue] Processing state: ${this.isProcessing}, Paused: ${this.isPaused}`);
    this.notifyStatusChange();

    // Start processing if not already running
    if (!this.isProcessing && !this.isPaused) {
      console.log('[DownloadQueue] 🚀 STARTING QUEUE PROCESSING');
      await this.processQueue();
    } else {
      console.log(`[DownloadQueue] ⏸️ Not starting: isProcessing=${this.isProcessing}, isPaused=${this.isPaused}`);
    }
  }

  /**
   * Process the download queue sequentially
   */
  private async processQueue(): Promise<void> {
    if (this.isProcessing || this.isPaused || this.queue.length === 0) {
      console.log(`[DownloadQueue] ⛔ CANNOT PROCESS`);
      console.log(`[DownloadQueue] - isProcessing: ${this.isProcessing}`);
      console.log(`[DownloadQueue] - isPaused: ${this.isPaused}`);
      console.log(`[DownloadQueue] - queueLength: ${this.queue.length}`);
      return;
    }

    console.log(`[DownloadQueue] ===== STARTING QUEUE PROCESSING =====`);
    console.log(`[DownloadQueue] Queue length: ${this.queue.length}`);
    console.log(`[DownloadQueue] Tracks in queue: ${this.queue.map(d => d.track.name).join(', ')}`);
    this.isProcessing = true;

    let downloadNumber = 0;
    while (this.queue.length > 0 && !this.isPaused) {
      downloadNumber++;
      const download = this.queue.shift();
      if (!download) break;

      console.log(`[DownloadQueue] ===== DOWNLOAD ${downloadNumber} =====`);
      console.log(`[DownloadQueue] Track: ${download.track.name}`);
      console.log(`[DownloadQueue] Remaining in queue: ${this.queue.length}`);
      this.activeDownload = download;
      this.notifyStatusChange();

      try {
        // Download the file with progress callback
        console.log(`[DownloadQueue] 📥 Starting download: ${download.track.name}`);
        if (download.retryCount && download.retryCount > 0) {
          console.log(`[DownloadQueue] 🔄 Retry attempt ${download.retryCount}/${MAX_RETRIES}`);
        }
        const startTime = Date.now();
        const result = await downloadMusicFile(download.track, download.onProgress);
        const duration = ((Date.now() - startTime) / 1000).toFixed(2);

        console.log(`[DownloadQueue] ✅ DOWNLOAD SUCCESS`);
        console.log(`[DownloadQueue] - Track: ${download.track.name}`);
        console.log(`[DownloadQueue] - Size: ${(result.fileSize / 1024 / 1024).toFixed(2)} MB`);
        console.log(`[DownloadQueue] - Duration: ${duration}s`);
        console.log(`[DownloadQueue] - Path: ${result.filePath}`);

        // Call completion callback
        if (download.onComplete) {
          download.onComplete(result);
        }

        this.totalCompleted++;
        console.log(`[DownloadQueue] 📊 Stats - Completed: ${this.totalCompleted}, Failed: ${this.totalFailed}`);
      } catch (error: any) {
        console.error(`[DownloadQueue] ❌ DOWNLOAD FAILED`);
        console.error(`[DownloadQueue] - Track: ${download.track.name}`);
        console.error(`[DownloadQueue] - Error: ${error.message}`);
        console.error(`[DownloadQueue] - Stack:`, error.stack);

        // Implement retry logic
        const retryCount = (download.retryCount || 0) + 1;

        if (retryCount < MAX_RETRIES) {
          console.log(`[DownloadQueue] 🔄 Retry ${retryCount}/${MAX_RETRIES} for ${download.track.name}`);
          console.log(`[DownloadQueue] ⏳ Waiting ${RETRY_DELAY_MS}ms before retry...`);

          // Wait before retrying
          await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));

          // Re-add to queue with incremented retry count
          this.queue.unshift({
            ...download,
            retryCount
          });

          console.log(`[DownloadQueue] ↩️ Re-queued ${download.track.name} for retry`);
        } else {
          // Max retries exceeded - permanent failure
          console.error(`[DownloadQueue] ❌ MAX RETRIES EXCEEDED for ${download.track.name}`);

          // Call error callback
          if (download.onError) {
            const retryError = new Error(
              `Download failed after ${MAX_RETRIES} attempts: ${error.message}`
            );
            download.onError(retryError);
          }

          this.totalFailed++;
          console.log(`[DownloadQueue] 📊 Stats - Completed: ${this.totalCompleted}, Failed: ${this.totalFailed}`);
        }
      }

      this.activeDownload = null;
      this.notifyStatusChange();

      // Small delay between downloads to avoid overwhelming the system
      if (this.queue.length > 0) {
        console.log(`[DownloadQueue] ⏳ Waiting 500ms before next download (${this.queue.length} remaining)...`);
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    }

    console.log(`[DownloadQueue] ===== QUEUE PROCESSING COMPLETE =====`);
    console.log(`[DownloadQueue] Final stats - Completed: ${this.totalCompleted}, Failed: ${this.totalFailed}`);
    console.log(`[DownloadQueue] Remaining in queue: ${this.queue.length}`);
    this.isProcessing = false;
    this.notifyStatusChange();
  }

  /**
   * Pause the queue
   */
  public pause(): void {
    this.isPaused = true;
    this.notifyStatusChange();
  }

  /**
   * Resume the queue
   */
  public async resume(): Promise<void> {
    this.isPaused = false;
    this.notifyStatusChange();

    if (!this.isProcessing && this.queue.length > 0) {
      await this.processQueue();
    }
  }

  /**
   * Cancel a specific download in the queue
   */
  public cancel(trackId: string): boolean {
    const index = this.queue.findIndex((d) => d.track.id === trackId);

    if (index !== -1) {
      const download = this.queue.splice(index, 1)[0];

      // Call error callback with cancellation error
      if (download.onError) {
        download.onError(new Error('Download cancelled by user'));
      }

      this.notifyStatusChange();
      return true;
    }

    return false;
  }

  /**
   * Clear all pending downloads (not the active one)
   */
  public clearQueue(): void {
    // Call error callbacks for all queued downloads
    for (const download of this.queue) {
      if (download.onError) {
        download.onError(new Error('Queue cleared'));
      }
    }

    this.queue = [];
    this.notifyStatusChange();
  }

  /**
   * Get current queue status
   */
  public getStatus(): QueueStatus {
    return {
      queueLength: this.queue.length,
      activeDownload: this.activeDownload?.track || null,
      isPaused: this.isPaused,
      totalCompleted: this.totalCompleted,
      totalFailed: this.totalFailed
    };
  }

  /**
   * Notify subscribers of status change
   */
  private notifyStatusChange(): void {
    if (this.statusCallback) {
      this.statusCallback(this.getStatus());
    }
  }

  /**
   * Get queue length
   */
  public getQueueLength(): number {
    return this.queue.length;
  }

  /**
   * Is queue processing?
   */
  public isActive(): boolean {
    return this.isProcessing || this.queue.length > 0;
  }

  /**
   * Get active download
   */
  public getActiveDownload(): LocalTrack | null {
    return this.activeDownload?.track || null;
  }

  /**
   * Manual retry for a failed download
   * Useful for user-triggered retries after permanent failure
   */
  public async retryDownload(
    track: LocalTrack,
    onProgress?: DownloadProgressCallback,
    onComplete?: QueuedDownload['onComplete'],
    onError?: QueuedDownload['onError']
  ): Promise<void> {
    console.log(`[DownloadQueue] 🔄 Manual retry requested for: ${track.name}`);

    // Remove from queue if already present (prevents duplicates)
    this.queue = this.queue.filter((d) => d.track.id !== track.id);

    // Add to front of queue with retry count reset
    this.queue.unshift({
      track,
      retryCount: 0,
      onProgress,
      onComplete,
      onError
    });

    console.log(`[DownloadQueue] ✅ Manual retry queued for: ${track.name}`);
    this.notifyStatusChange();

    // Start processing if not already running
    if (!this.isProcessing && !this.isPaused) {
      await this.processQueue();
    }
  }

  /**
   * Reset statistics
   */
  public resetStats(): void {
    this.totalCompleted = 0;
    this.totalFailed = 0;
    this.notifyStatusChange();
  }

  /**
   * Cleanup
   */
  public destroy(): void {
    this.clearQueue();
    this.activeDownload = null;
    this.isProcessing = false;
    this.isPaused = false;
    this.statusCallback = null;
  }
}

// Export singleton instance
export const downloadQueue = new DownloadQueueManager();
