/**
 * Download Service - Handle file downloads using Capacitor 7 APIs
 * Uses @capacitor/file-transfer (recommended for Cap 7.1+) and @capacitor/filesystem
 */

import { FileTransfer } from '@capacitor/file-transfer';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { parseBlob } from 'music-metadata-browser';
import type { LocalTrack, DownloadStatus } from '../types';

export interface DownloadProgress {
  trackId: string;
  bytesDownloaded: number;
  totalBytes: number;
  percentage: number;
}

export type DownloadProgressCallback = (progress: DownloadProgress) => void;

const MUSIC_DIR = 'VibeTutor/Music';

// Global singleton progress listener to prevent multiple active listeners
let globalProgressListener: any = null;

/**
 * Initialize music directory
 */
export const initMusicDirectory = async (): Promise<void> => {
  try {
    await Filesystem.mkdir({
      path: MUSIC_DIR,
      directory: Directory.Documents,
      recursive: true
    });
  } catch (error: any) {
    // Directory might already exist, that's ok
    if (error.message?.includes('exists')) {
      return;
    }
    throw error;
  }
};

/**
 * Download a music file from URL and extract metadata
 * Returns object with filePath, fileSize, metadata, and albumArt
 */
export const downloadMusicFile = async (
  track: LocalTrack,
  onProgress?: DownloadProgressCallback
): Promise<{ filePath: string; fileSize: number; metadata: LocalTrack['metadata']; albumArt?: string }> => {
  try {
    await initMusicDirectory();

    // Extract filename from URL or use track name
    const filename = extractFilename(track.downloadUrl) || `${track.id}.mp3`;
    const filePath = `${MUSIC_DIR}/${filename}`;

    // Get full URI for the destination
    const destUri = await Filesystem.getUri({
      path: filePath,
      directory: Directory.Documents
    });

    // Remove existing listener if any (singleton pattern)
    if (globalProgressListener) {
      try {
        await globalProgressListener.remove();
      } catch (error) {
        console.warn('Failed to remove previous listener:', error);
      }
      globalProgressListener = null;
    }

    // Setup new progress listener (only ONE active at a time)
    globalProgressListener = await FileTransfer.addListener('progress', (progress) => {
      if (onProgress) {
        onProgress({
          trackId: track.id,
          bytesDownloaded: progress.bytes,
          totalBytes: progress.contentLength,
          percentage: (progress.bytes / progress.contentLength) * 100
        });
      }
    });

    // Download the file
    await FileTransfer.downloadFile({
      url: track.downloadUrl,
      path: destUri.uri,
      progress: true
    });

    // Cleanup listener after download completes
    if (globalProgressListener) {
      try {
        await globalProgressListener.remove();
      } catch (error) {
        console.warn('Failed to remove listener:', error);
      }
      globalProgressListener = null;
    }

    // Get file size
    const stat = await Filesystem.stat({
      path: filePath,
      directory: Directory.Documents
    });

    // Extract metadata and album art from the downloaded file
    const { metadata, albumArt } = await extractMetadata(filePath);

    return {
      filePath,
      fileSize: stat.size,
      metadata,
      albumArt
    };
  } catch (error: any) {
    console.error('Download failed:', error);

    // Cleanup listener on error
    if (globalProgressListener) {
      try {
        await globalProgressListener.remove();
      } catch (cleanupError) {
        console.warn('Failed to remove listener after error:', cleanupError);
      }
      globalProgressListener = null;
    }

    // Provide user-friendly error messages
    let errorMessage = 'Download failed';

    if (error.message?.includes('network')) {
      errorMessage = 'Network error. Please check your internet connection and try again.';
    } else if (error.message?.includes('timeout')) {
      errorMessage = 'Download timed out. The file may be too large or your connection is slow.';
    } else if (error.message?.includes('404')) {
      errorMessage = 'File not found. Please check the URL and try again.';
    } else if (error.message?.includes('403') || error.message?.includes('401')) {
      errorMessage = 'Access denied. The file may require authentication.';
    } else if (error.message?.includes('storage') || error.message?.includes('space')) {
      errorMessage = 'Not enough storage space. Please free up space and try again.';
    } else if (error.message) {
      errorMessage = `Download failed: ${error.message}`;
    }

    throw new Error(errorMessage);
  }
};

/**
 * Cleanup global progress listener (call on app shutdown)
 */
export const cleanupDownloadService = async (): Promise<void> => {
  if (globalProgressListener) {
    try {
      await globalProgressListener.remove();
    } catch (error) {
      console.warn('Failed to cleanup download service:', error);
    }
    globalProgressListener = null;
  }
};

/**
 * Check if a track is already downloaded
 */
export const isTrackDownloaded = async (localPath: string): Promise<boolean> => {
  try {
    const stat = await Filesystem.stat({
      path: localPath,
      directory: Directory.Documents
    });
    return stat.type === 'file';
  } catch {
    return false;
  }
};

/**
 * Get local file URI for playback (converts to web-accessible URL)
 */
export const getPlayableUri = async (localPath: string): Promise<string> => {
  const uri = await Filesystem.getUri({
    path: localPath,
    directory: Directory.Documents
  });

  // Import Capacitor at runtime to avoid issues in web environment
  const { Capacitor } = await import('@capacitor/core');
  
  // Convert file:// path to capacitor:// or http:// for web view
  return Capacitor.convertFileSrc(uri.uri);
};

/**
 * Delete a downloaded track
 */
export const deleteTrack = async (localPath: string): Promise<void> => {
  try {
    await Filesystem.deleteFile({
      path: localPath,
      directory: Directory.Documents
    });
  } catch (error: any) {
    console.error('Delete failed:', error);
    throw new Error(`Delete failed: ${error.message}`);
  }
};

/**
 * Get all downloaded tracks
 */
export const getDownloadedTracks = async (): Promise<string[]> => {
  try {
    const result = await Filesystem.readdir({
      path: MUSIC_DIR,
      directory: Directory.Documents
    });
    return result.files.map(f => `${MUSIC_DIR}/${f.name}`);
  } catch {
    return [];
  }
};

/**
 * Get total storage used by downloaded music
 */
export const getStorageUsed = async (): Promise<number> => {
  try {
    const tracks = await getDownloadedTracks();
    let totalSize = 0;

    for (const trackPath of tracks) {
      const stat = await Filesystem.stat({
        path: trackPath,
        directory: Directory.Documents
      });
      totalSize += stat.size;
    }

    return totalSize;
  } catch {
    return 0;
  }
};

/**
 * Clear all downloaded music
 */
export const clearAllDownloads = async (): Promise<void> => {
  try {
    const tracks = await getDownloadedTracks();
    
    for (const trackPath of tracks) {
      await deleteTrack(trackPath);
    }
  } catch (error: any) {
    console.error('Clear all failed:', error);
    throw new Error(`Clear all failed: ${error.message}`);
  }
};

/**
 * Format bytes to human-readable size
 */
export const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
};

/**
 * Extract filename from URL
 */
const extractFilename = (url: string): string | null => {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    const filename = pathname.substring(pathname.lastIndexOf('/') + 1);
    return filename || null;
  } catch {
    return null;
  }
};

/**
 * Extract metadata from audio file (MP3, WAV, OGG, etc.)
 * Returns metadata and album art as base64
 */
export const extractMetadata = async (localPath: string): Promise<{ metadata: LocalTrack['metadata']; albumArt?: string }> => {
  try {
    // Read the file as a blob
    const fileData = await Filesystem.readFile({
      path: localPath,
      directory: Directory.Documents
    });

    // Convert base64 to blob
    const base64Data = fileData.data;
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'audio/mpeg' });

    // Parse metadata
    const metadata = await parseBlob(blob);

    // Extract album art if available
    let albumArt: string | undefined;
    if (metadata.common.picture && metadata.common.picture.length > 0) {
      const picture = metadata.common.picture[0];
      // Convert picture data to base64
      const imageBase64 = btoa(
        new Uint8Array(picture.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
      );
      albumArt = `data:${picture.format};base64,${imageBase64}`;
    }

    return {
      metadata: {
        title: metadata.common.title,
        artist: metadata.common.artist,
        album: metadata.common.album,
        year: metadata.common.year,
        genre: metadata.common.genre,
        duration: metadata.format.duration
      },
      albumArt
    };
  } catch (error: any) {
    console.error('Metadata extraction failed:', error);
    // Return empty metadata on failure (graceful degradation)
    return { metadata: {} };
  }
};
