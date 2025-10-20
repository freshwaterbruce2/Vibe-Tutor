/**
 * Native Audio Service - Handle radio streaming using Capacitor native audio
 * Provides better Android WebView compatibility than HTML5 Audio
 * Uses @mediagrid/capacitor-native-audio for reliable streaming
 */

import { Capacitor } from '@capacitor/core';
import type { RadioStation } from '../types';

// Import plugin at runtime to avoid web build issues
let NativeAudio: any = null;

// Initialize plugin only on native platforms
const initPlugin = async () => {
  if (!NativeAudio && Capacitor.isNativePlatform()) {
    try {
      const module = await import('@mediagrid/capacitor-native-audio');
      NativeAudio = module.NativeAudio;
    } catch (error) {
      console.error('Failed to load native audio plugin:', error);
    }
  }
};

export type RadioStreamState = 'idle' | 'loading' | 'playing' | 'paused' | 'error';

export interface RadioStatus {
  state: RadioStreamState;
  station: RadioStation | null;
  error: string | null;
  isNative: boolean;
}

export type RadioStatusCallback = (status: RadioStatus) => void;

class NativeAudioService {
  private currentStation: RadioStation | null = null;
  private state: RadioStreamState = 'idle';
  private error: string | null = null;
  private statusCallback: RadioStatusCallback | null = null;
  private fallbackAudio: HTMLAudioElement | null = null;
  private isNativeMode: boolean = false;

  constructor() {
    this.init();
  }

  /**
   * Initialize the service
   */
  private async init(): Promise<void> {
    await initPlugin();
    this.isNativeMode = Capacitor.isNativePlatform() && NativeAudio !== null;

    // Setup fallback HTML5 audio for web
    if (!this.isNativeMode) {
      this.fallbackAudio = new Audio();
      this.setupFallbackListeners();
    }
  }

  /**
   * Setup HTML5 Audio fallback listeners (web only)
   */
  private setupFallbackListeners(): void {
    if (!this.fallbackAudio) return;

    this.fallbackAudio.addEventListener('loadstart', () => {
      this.updateState('loading');
    });

    this.fallbackAudio.addEventListener('canplay', () => {
      this.updateState('playing');
    });

    this.fallbackAudio.addEventListener('playing', () => {
      this.updateState('playing');
    });

    this.fallbackAudio.addEventListener('pause', () => {
      this.updateState('paused');
    });

    this.fallbackAudio.addEventListener('error', (e) => {
      const errorMsg = this.fallbackAudio?.error?.message || 'Stream playback failed';
      this.updateState('error', errorMsg);
    });
  }

  /**
   * Subscribe to status updates
   */
  public onStatusChange(callback: RadioStatusCallback): void {
    this.statusCallback = callback;
  }

  /**
   * Update state and notify subscribers
   */
  private updateState(state: RadioStreamState, error: string | null = null): void {
    this.state = state;
    this.error = error;

    if (this.statusCallback) {
      this.statusCallback({
        state: this.state,
        station: this.currentStation,
        error: this.error,
        isNative: this.isNativeMode
      });
    }
  }

  /**
   * Play a radio station
   */
  public async play(station: RadioStation): Promise<void> {
    try {
      // Stop current stream if any
      await this.stop();

      this.currentStation = station;
      this.updateState('loading');

      if (this.isNativeMode && NativeAudio) {
        await this.playNative(station);
      } else {
        await this.playFallback(station);
      }
    } catch (error: any) {
      console.error('Radio playback failed:', error);

      let errorMessage = 'Failed to play radio station';
      if (error.message?.includes('network')) {
        errorMessage = 'Network error. Check your internet connection.';
      } else if (error.message?.includes('404')) {
        errorMessage = 'Stream not found. This station may be offline.';
      } else if (error.message?.includes('timeout')) {
        errorMessage = 'Connection timed out. Try another station.';
      } else if (error.message) {
        errorMessage = error.message;
      }

      this.updateState('error', errorMessage);
    }
  }

  /**
   * Play using native audio plugin (Android/iOS)
   */
  private async playNative(station: RadioStation): Promise<void> {
    try {
      // Preload the stream
      await NativeAudio.preload({
        assetId: 'radio-stream',
        assetPath: station.streamUrl,
        isUrl: true
      });

      // Start playback
      await NativeAudio.play({
        assetId: 'radio-stream'
      });

      this.updateState('playing');
    } catch (error: any) {
      console.error('Native audio playback failed:', error);
      throw error;
    }
  }

  /**
   * Play using HTML5 Audio fallback (web)
   */
  private async playFallback(station: RadioStation): Promise<void> {
    if (!this.fallbackAudio) {
      throw new Error('Fallback audio not initialized');
    }

    this.fallbackAudio.src = station.streamUrl;
    this.fallbackAudio.load();

    try {
      await this.fallbackAudio.play();
      this.updateState('playing');
    } catch (error: any) {
      console.error('Fallback audio playback failed:', error);
      throw error;
    }
  }

  /**
   * Pause playback
   */
  public async pause(): Promise<void> {
    try {
      if (this.isNativeMode && NativeAudio) {
        await NativeAudio.pause({
          assetId: 'radio-stream'
        });
      } else if (this.fallbackAudio) {
        this.fallbackAudio.pause();
      }

      this.updateState('paused');
    } catch (error: any) {
      console.error('Pause failed:', error);
    }
  }

  /**
   * Resume playback
   */
  public async resume(): Promise<void> {
    try {
      if (this.isNativeMode && NativeAudio) {
        await NativeAudio.resume({
          assetId: 'radio-stream'
        });
      } else if (this.fallbackAudio) {
        await this.fallbackAudio.play();
      }

      this.updateState('playing');
    } catch (error: any) {
      console.error('Resume failed:', error);
      this.updateState('error', 'Failed to resume playback');
    }
  }

  /**
   * Stop playback and cleanup
   */
  public async stop(): Promise<void> {
    try {
      if (this.isNativeMode && NativeAudio && this.currentStation) {
        await NativeAudio.stop({
          assetId: 'radio-stream'
        });

        await NativeAudio.unload({
          assetId: 'radio-stream'
        });
      } else if (this.fallbackAudio) {
        this.fallbackAudio.pause();
        this.fallbackAudio.src = '';
      }

      this.currentStation = null;
      this.updateState('idle');
    } catch (error: any) {
      console.error('Stop failed:', error);
      // Still update state even if stop failed
      this.currentStation = null;
      this.updateState('idle');
    }
  }

  /**
   * Set volume (0.0 to 1.0)
   */
  public async setVolume(volume: number): Promise<void> {
    const normalizedVolume = Math.max(0, Math.min(1, volume));

    try {
      if (this.isNativeMode && NativeAudio) {
        await NativeAudio.setVolume({
          assetId: 'radio-stream',
          volume: normalizedVolume
        });
      } else if (this.fallbackAudio) {
        this.fallbackAudio.volume = normalizedVolume;
      }
    } catch (error: any) {
      console.error('Set volume failed:', error);
    }
  }

  /**
   * Get current station
   */
  public getCurrentStation(): RadioStation | null {
    return this.currentStation;
  }

  /**
   * Get current state
   */
  public getState(): RadioStreamState {
    return this.state;
  }

  /**
   * Is playing?
   */
  public isPlaying(): boolean {
    return this.state === 'playing';
  }

  /**
   * Is using native audio?
   */
  public isNative(): boolean {
    return this.isNativeMode;
  }

  /**
   * Cleanup and destroy
   */
  public async destroy(): Promise<void> {
    await this.stop();
    this.statusCallback = null;

    if (this.fallbackAudio) {
      this.fallbackAudio.src = '';
      this.fallbackAudio = null;
    }
  }
}

// Export singleton instance
export const nativeAudio = new NativeAudioService();
