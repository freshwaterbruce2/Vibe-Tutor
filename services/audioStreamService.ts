/**
 * Audio Stream Service - Hybrid audio streaming for radio
 * Uses native audio on Android/iOS for better background playback
 * Falls back to HTML5 Audio on web for compatibility
 */

import { Capacitor } from '@capacitor/core';
import type { RadioStation } from '../types';

// Import native audio plugin dynamically
let NativeAudio: any = null;

export interface RadioStatus {
  isPlaying: boolean;
  station: RadioStation | null;
  error: string | null;
}

export type RadioStatusCallback = (status: RadioStatus) => void;

class AudioStreamService {
  private audio: HTMLAudioElement | null = null;
  private currentStation: RadioStation | null = null;
  private _isPlaying: boolean = false;
  private statusCallback: RadioStatusCallback | null = null;
  private lastError: string | null = null;
  private isNativeMode: boolean = false;
  private isInitialized: boolean = false;

  constructor() {
    // Initialize HTML5 Audio immediately (synchronous) for A54 compatibility
    this.audio = new Audio();
    this.audio.preload = 'auto';  // Preload for better streaming
    this.audio.crossOrigin = 'anonymous';
    this.setupListeners();
    console.log('[AudioStream] HTML5 Audio initialized synchronously');
    
    // Try native audio async (non-blocking)
    this.init();
  }

  /**
   * Initialize the service with platform detection
   */
  private async init(): Promise<void> {
    if (this.isInitialized) return;

    // Try to load native audio plugin on native platforms
    if (Capacitor.isNativePlatform()) {
      try {
        const module = await import('@mediagrid/capacitor-native-audio');
        NativeAudio = module.NativeAudio;
        this.isNativeMode = true;
        console.log('[AudioStream] Native audio loaded for radio streaming');
      } catch (error) {
        console.warn('[AudioStream] Native audio not available, using HTML5:', error);
        this.isNativeMode = false;
      }
    }

    this.isInitialized = true;
  }

  /**
   * Ensure initialization before operations
   */
  private async ensureInitialized(): Promise<void> {
    if (!this.isInitialized) {
      await this.init();
    }
  }

  /**
   * Setup audio event listeners (HTML5 only)
   */
  private setupListeners(): void {
    if (!this.audio) return;

    this.audio.addEventListener('play', () => {
      this._isPlaying = true;
      this.lastError = null;
      this.notifyStatusChange();
    });

    this.audio.addEventListener('pause', () => {
      this._isPlaying = false;
      this.notifyStatusChange();
    });

    this.audio.addEventListener('ended', () => {
      this._isPlaying = false;
      this.notifyStatusChange();
    });

    this.audio.addEventListener('error', (e) => {
      this._isPlaying = false;

      // Determine error message based on error code
      const error = this.audio?.error;
      let errorMessage = 'Failed to play radio station';

      if (error) {
        switch (error.code) {
          case error.MEDIA_ERR_ABORTED:
            errorMessage = 'Playback aborted. Please try again.';
            break;
          case error.MEDIA_ERR_NETWORK:
            errorMessage = 'Network error. Check your internet connection.';
            break;
          case error.MEDIA_ERR_DECODE:
            errorMessage = 'Stream format not supported. Try another station.';
            break;
          case error.MEDIA_ERR_SRC_NOT_SUPPORTED:
            errorMessage = 'Stream not available. Station may be offline.';
            break;
          default:
            errorMessage = error.message || 'Unknown error occurred';
        }
      }

      this.lastError = errorMessage;
      this.notifyStatusChange();

      console.error('[AudioStream] HTML5 Audio error:', errorMessage, error);
    });

    this.audio.addEventListener('waiting', () => {
      console.log('[AudioStream] Buffering...');
    });

    this.audio.addEventListener('canplay', () => {
      console.log('[AudioStream] Ready to play');
    });
  }

  /**
   * Subscribe to status updates
   */
  public onStatusChange(callback: RadioStatusCallback): void {
    this.statusCallback = callback;
    // Immediately notify with current status
    this.notifyStatusChange();
  }

  /**
   * Notify subscribers of status change
   */
  private notifyStatusChange(): void {
    if (this.statusCallback) {
      this.statusCallback({
        isPlaying: this._isPlaying,
        station: this.currentStation,
        error: this.lastError
      });
    }
  }

  /**
   * Play a radio station (uses native or HTML5 based on platform)
   */
  public async play(station: RadioStation): Promise<void> {
    await this.ensureInitialized();

    try {
      // Stop current playback if any
      await this.stop();

      // Reset error state
      this.lastError = null;

      // Update current station
      this.currentStation = station;
      this.notifyStatusChange();

      // Use appropriate playback method
      if (this.isNativeMode && NativeAudio) {
        await this.playNative(station);
      } else {
        await this.playHTML5Fallback(station, [station.streamUrl, ...(station.fallbackUrls || [])]);
      }

      console.log(`[AudioStream] Playing: ${station.name} (${station.streamUrl})`);
    } catch (error: any) {
      console.error('[AudioStream] Failed to play radio:', error);

      // Handle play() promise rejection
      let errorMessage = 'Failed to start playback';

      if (error.name === 'NotAllowedError') {
        errorMessage = 'Playback blocked. Please interact with the page first.';
      } else if (error.name === 'NotSupportedError') {
        errorMessage = 'Stream format not supported.';
      } else if (error.message) {
        errorMessage = error.message;
      }

      this.lastError = errorMessage;
      this._isPlaying = false;
      this.notifyStatusChange();

      throw new Error(errorMessage);
    }
  }

  /**
   * Play using native audio (Android/iOS)
   */
  private async playNative(station: RadioStation): Promise<void> {
    // Filter to MP3/AAC only for A54 compatibility
    const urlsToTry = [station.streamUrl, ...(station.fallbackUrls || [])].filter(url =>
      url.includes('.mp3') || url.includes('.aac')
    );

    if (urlsToTry.length === 0) {
      throw new Error('No compatible MP3/AAC streams available. Try a different station.');
    }

    let lastError: any = null;
    for (let i = 0; i < urlsToTry.length; i++) {
      const url = urlsToTry[i];
      const assetId = `radio-${station.id}-${i}`;  // Unique per URL to avoid conflicts
      try {
        console.log(`[AudioStream] Native attempt ${i + 1}/${urlsToTry.length}: ${url}`);

        // Preload with native for A54 background support
        await NativeAudio.preload({
          assetId,
          assetPath: url,
          isUrl: true,
          audioChannelNum: 1,  // Mono for streams (battery efficient)
          volume: 0.8  // Conservative default
        });

        // Play
        await NativeAudio.play({ assetId });

        this._isPlaying = true;
        this.notifyStatusChange();
        console.log(`[AudioStream] Native success: ${station.name} via ${url}`);
        return;
      } catch (error: any) {
        lastError = error;
        console.error(`[AudioStream] Native fail ${i + 1}: ${error.message}`);

        // Cleanup
        try {
          await NativeAudio.unload({ assetId });
        } catch (cleanupErr) {
          console.warn('[AudioStream] Cleanup failed:', cleanupErr);
        }

        // Retry delay
        if (i < urlsToTry.length - 1) {
          console.log('[AudioStream] Retrying fallback in 1s...');
          await new Promise(r => setTimeout(r, 1000));
        }
      }
    }

    // All failed - fallback to HTML5 with same filter
    console.warn('[AudioStream] Native failed, trying HTML5 fallback');
    await this.playHTML5Fallback(station, urlsToTry);
  }

  private async playHTML5Fallback(station: RadioStation, urlsToTry: string[]): Promise<void> {
    if (!this.audio) {
      // Reinitialize if somehow null (shouldn't happen but be safe)
      this.audio = new Audio();
      this.audio.preload = 'auto';
      this.audio.crossOrigin = 'anonymous';
      this.setupListeners();
      console.log('[AudioStream] HTML5 Audio reinitialized');
    }

    let lastError: any = null;

    for (let i = 0; i < urlsToTry.length; i++) {
      const url = urlsToTry[i];
      try {
        console.log(`[AudioStream] HTML5 attempt ${i + 1}/${urlsToTry.length}: ${url}`);
        
        this.audio.src = url;
        this.audio.load();
        
        // User interaction required on Android - this should work if called from button click
        await this.audio.play();
        
        this._isPlaying = true;
        this.notifyStatusChange();
        console.log(`[AudioStream] HTML5 success: ${station.name}`);
        return;
      } catch (error: any) {
        // Rename to audioError to avoid shadowing
        const audioError = this.audio?.error;
        let errorMessage = 'Failed to play radio station';

        if (audioError) {
          switch (audioError.code) {
            case audioError.MEDIA_ERR_ABORTED:
              errorMessage = 'Playback aborted. Please try again.';
              break;
            case audioError.MEDIA_ERR_NETWORK:
              errorMessage = 'Network error. Check your internet connection.';
              break;
            case audioError.MEDIA_ERR_DECODE:
              errorMessage = 'Stream format not supported. Try another station.';
              break;
            case audioError.MEDIA_ERR_SRC_NOT_SUPPORTED:
              errorMessage = 'Stream not available. Station may be offline.';
              break;
            default:
              errorMessage = audioError.message || 'Unknown error occurred';
          }
        }

        this.lastError = errorMessage;
        this._isPlaying = false;
        this.notifyStatusChange();

        console.error('[AudioStream] HTML5 Audio error:', errorMessage, audioError);
        lastError = error;
        
        // Try next URL
        if (i < urlsToTry.length - 1) {
          console.log('[AudioStream] Trying next fallback...');
          await new Promise(r => setTimeout(r, 500));
        }
      }
    }

    throw lastError || new Error('All streams failed - check internet and try later.');
  }

  /**
   * Stop playback (hybrid)
   */
  public async stop(): Promise<void> {
    try {
      if (this.isNativeMode && NativeAudio && this.currentStation) {
        await NativeAudio.stop({ assetId: 'radio-stream' });
        await NativeAudio.unload({ assetId: 'radio-stream' });
      } else if (this.audio) {
        this.audio.pause();
        this.audio.src = '';
      }

      this.currentStation = null;
      this._isPlaying = false;
      this.lastError = null;
      this.notifyStatusChange();
    } catch (error) {
      console.error('[AudioStream] Stop failed:', error);
      // Force state update even if stop failed
      this.currentStation = null;
      this._isPlaying = false;
      this.notifyStatusChange();
    }
  }

  /**
   * Pause playback (hybrid)
   */
  public async pause(): Promise<void> {
    try {
      if (this.isNativeMode && NativeAudio) {
        await NativeAudio.pause({ assetId: 'radio-stream' });
      } else if (this.audio) {
        this.audio.pause();
      }
      this._isPlaying = false;
      this.notifyStatusChange();
    } catch (error) {
      console.error('[AudioStream] Pause failed:', error);
    }
  }

  /**
   * Resume playback (hybrid)
   */
  public async resume(): Promise<void> {
    try {
      if (this.isNativeMode && NativeAudio) {
        await NativeAudio.resume({ assetId: 'radio-stream' });
      } else if (this.audio) {
        await this.audio.play();
      }
      this._isPlaying = true;
      this.notifyStatusChange();
    } catch (error: any) {
      console.error('[AudioStream] Resume failed:', error);
      this.lastError = 'Failed to resume playback';
      this._isPlaying = false;
      this.notifyStatusChange();
      throw error;
    }
  }

  /**
   * Set volume (0.0 to 1.0) (hybrid)
   */
  public async setVolume(volume: number): Promise<void> {
    const normalizedVolume = Math.max(0, Math.min(1, volume));

    try {
      if (this.isNativeMode && NativeAudio) {
        await NativeAudio.setVolume({
          assetId: 'radio-stream',
          volume: normalizedVolume
        });
      } else if (this.audio) {
        this.audio.volume = normalizedVolume;
      }
    } catch (error) {
      console.error('[AudioStream] Set volume failed:', error);
    }
  }

  /**
   * Get volume
   */
  public getVolume(): number {
    if (this.audio) {
      return this.audio.volume;
    }
    return 1.0; // Default volume for native audio
  }

  /**
   * Is playing?
   */
  public isPlaying(): boolean {
    return this._isPlaying;
  }

  /**
   * Get current station
   */
  public getCurrentStation(): RadioStation | null {
    return this.currentStation;
  }

  /**
   * Get last error
   */
  public getError(): string | null {
    return this.lastError;
  }

  /**
   * Is using native audio?
   */
  public isNative(): boolean {
    return this.isNativeMode;
  }

  /**
   * Cleanup
   */
  public async destroy(): Promise<void> {
    await this.stop();
    this.statusCallback = null;

    if (this.audio) {
      this.audio.src = '';
      this.audio = null;
    }
  }
}

// Export singleton instance
export const audioStream = new AudioStreamService();
