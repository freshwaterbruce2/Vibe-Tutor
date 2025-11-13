/**
 * Audio Player Service - HTML5 Audio wrapper for local file playback
 * Handles play/pause/seek/volume with playlist queue management
 */

import type { LocalTrack } from '../types';
import { getPlayableUri } from './downloadService';

export type PlaybackState = 'idle' | 'loading' | 'playing' | 'paused' | 'ended' | 'error';

export interface PlaybackStatus {
  state: PlaybackState;
  currentTrack: LocalTrack | null;
  currentTime: number;
  duration: number;
  volume: number;
  isLoading: boolean;
  error: string | null;
}

export type PlaybackStatusCallback = (status: PlaybackStatus) => void;

class AudioPlayerService {
  private audio: HTMLAudioElement;
  private currentTrack: LocalTrack | null = null;
  private playlist: LocalTrack[] = [];
  private currentIndex: number = -1;
  private statusCallback: PlaybackStatusCallback | null = null;
  private repeatMode: 'none' | 'one' | 'all' = 'none';
  private shuffleEnabled: boolean = false;

  constructor() {
    this.audio = new Audio();
    this.setupEventListeners();
    this.initMediaSession();
  }

  /**
   * Setup HTML5 Audio event listeners
   */
  private setupEventListeners(): void {
    this.audio.addEventListener('loadstart', () => this.notifyStatus());
    this.audio.addEventListener('loadedmetadata', () => this.notifyStatus());
    this.audio.addEventListener('canplay', () => this.notifyStatus());
    this.audio.addEventListener('play', () => this.notifyStatus());
    this.audio.addEventListener('pause', () => this.notifyStatus());
    this.audio.addEventListener('ended', () => this.handleTrackEnded());
    this.audio.addEventListener('timeupdate', () => this.notifyStatus());
    this.audio.addEventListener('volumechange', () => this.notifyStatus());
    this.audio.addEventListener('error', (e) => this.handleError(e));
  }

  private initMediaSession(): void {
    if (!('mediaSession' in navigator)) return;

    // Reset
    navigator.mediaSession.metadata = null;
    navigator.mediaSession.playbackState = 'none';

    // Metadata on load
    this.audio.addEventListener('loadedmetadata', () => {
      if (this.currentTrack && 'mediaSession' in navigator) {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: this.currentTrack.metadata?.title || this.currentTrack.name || 'Unknown Track',
          artist: this.currentTrack.metadata?.artist || 'Vibe-Tutor Library',
          album: this.currentTrack.metadata?.album || 'Local Music',
          artwork: this.currentTrack.albumArt ? [
            { src: this.currentTrack.albumArt, sizes: '512x512', type: 'image/png' }
          ] : [
            { src: '/default-album.png', sizes: '512x512', type: 'image/png' }  // Add default image if needed
          ]
        });
      }
    });

    // Action handlers
    navigator.mediaSession.setActionHandler('play', () => this.togglePlayPause());
    navigator.mediaSession.setActionHandler('pause', () => this.pause());
    navigator.mediaSession.setActionHandler('nexttrack', () => this.playNext());
    navigator.mediaSession.setActionHandler('previoustrack', () => this.playPrevious());
    navigator.mediaSession.setActionHandler('seekforward', () => this.skipForward(10));
    navigator.mediaSession.setActionHandler('seekbackward', () => this.skipBackward(10));
    navigator.mediaSession.setActionHandler('stop', () => this.stop());

    // Position updates (throttled to ~1s)
    let lastUpdate = 0;
    this.audio.addEventListener('timeupdate', () => {
      if ('mediaSession' in navigator && 'setPositionState' in navigator.mediaSession && this.audio.duration > 0) {
        const now = Date.now();
        if (now - lastUpdate > 1000) {
          navigator.mediaSession.setPositionState({
            duration: this.audio.duration,
            position: this.audio.currentTime,
            playbackRate: this.audio.playbackRate
          });
          lastUpdate = now;
        }
      }
    });

    // State updates
    this.audio.addEventListener('play', () => {
      if ('mediaSession' in navigator) navigator.mediaSession.playbackState = 'playing';
    });
    this.audio.addEventListener('pause', () => {
      if ('mediaSession' in navigator) navigator.mediaSession.playbackState = 'paused';
    });
  }

  /**
   * Subscribe to playback status updates
   */
  public onStatusChange(callback: PlaybackStatusCallback): void {
    this.statusCallback = callback;
  }

  /**
   * Get current playback status
   */
  private getStatus(): PlaybackStatus {
    return {
      state: this.getPlaybackState(),
      currentTrack: this.currentTrack,
      currentTime: this.audio.currentTime,
      duration: this.audio.duration || 0,
      volume: this.audio.volume,
      isLoading: this.audio.readyState < 3,
      error: this.audio.error ? this.audio.error.message : null
    };
  }

  /**
   * Notify subscribers of status change
   */
  private notifyStatus(): void {
    if (this.statusCallback) {
      this.statusCallback(this.getStatus());
    }
  }

  /**
   * Get current playback state
   */
  private getPlaybackState(): PlaybackState {
    if (this.audio.error) return 'error';
    if (this.audio.ended) return 'ended';
    if (this.audio.readyState < 3) return 'loading';
    if (!this.audio.paused) return 'playing';
    if (this.audio.currentTime > 0) return 'paused';
    return 'idle';
  }

  /**
   * Load and play a track
   */
  public async loadTrack(track: LocalTrack): Promise<void> {
    try {
      if (!track.localPath) {
        throw new Error('Track file not found. Please download it again.');
      }

      // Get playable URI for the local file
      const playableUri = await getPlayableUri(track.localPath);

      // Stop current playback
      this.audio.pause();
      this.audio.currentTime = 0;

      // Load new track
      this.audio.src = playableUri;
      this.currentTrack = track;

      // Start loading
      this.audio.load();

      this.notifyStatus();
    } catch (error: any) {
      console.error('Failed to load track:', error);

      let errorMessage = 'Failed to load track';
      if (error.message?.includes('not found')) {
        errorMessage = 'Track file not found. It may have been deleted. Please download it again.';
      } else if (error.message?.includes('format')) {
        errorMessage = 'Unsupported audio format. Please try a different file.';
      } else if (error.message) {
        errorMessage = error.message;
      }

      this.handleError(new Error(errorMessage));
    }
  }

  /**
   * Play current track
   */
  public async play(): Promise<void> {
    try {
      await this.audio.play();
    } catch (error: any) {
      console.error('Playback failed:', error);

      let errorMessage = 'Playback failed';
      if (error.name === 'NotAllowedError') {
        errorMessage = 'Playback blocked. Please enable audio permissions for this app.';
      } else if (error.name === 'NotSupportedError') {
        errorMessage = 'This audio format is not supported on your device.';
      } else if (error.message) {
        errorMessage = `Playback error: ${error.message}`;
      }

      this.handleError(new Error(errorMessage));
    }
  }

  /**
   * Pause playback
   */
  public pause(): void {
    this.audio.pause();
  }

  /**
   * Toggle play/pause
   */
  public async togglePlayPause(): Promise<void> {
    if (this.audio.paused) {
      await this.play();
    } else {
      this.pause();
    }
  }

  /**
   * Stop playback and reset
   */
  public stop(): void {
    this.audio.pause();
    this.audio.currentTime = 0;
    this.currentTrack = null;
    this.notifyStatus();
  }

  /**
   * Seek to specific time (in seconds)
   */
  public seek(time: number): void {
    this.audio.currentTime = Math.max(0, Math.min(time, this.audio.duration));
  }

  /**
   * Set volume (0.0 to 1.0)
   */
  public setVolume(volume: number): void {
    this.audio.volume = Math.max(0, Math.min(1, volume));
  }

  /**
   * Set playback rate/speed (0.5 to 2.0)
   */
  public setPlaybackRate(rate: number): void {
    this.audio.playbackRate = Math.max(0.5, Math.min(2, rate));
  }

  /**
   * Skip forward by seconds
   */
  public skipForward(seconds: number = 10): void {
    this.seek(this.audio.currentTime + seconds);
  }

  /**
   * Skip backward by seconds
   */
  public skipBackward(seconds: number = 10): void {
    this.seek(this.audio.currentTime - seconds);
  }

  /**
   * Set repeat mode
   */
  public setRepeatMode(mode: 'none' | 'one' | 'all'): void {
    this.repeatMode = mode;
  }

  /**
   * Toggle shuffle
   */
  public toggleShuffle(): void {
    this.shuffleEnabled = !this.shuffleEnabled;
  }

  /**
   * Load playlist
   */
  public loadPlaylist(tracks: LocalTrack[], startIndex: number = 0): void {
    this.playlist = tracks;
    this.currentIndex = startIndex;

    if (tracks.length > 0 && startIndex >= 0 && startIndex < tracks.length) {
      this.loadTrack(tracks[startIndex]);
    }
  }

  /**
   * Play next track in playlist
   */
  public async playNext(): Promise<void> {
    if (this.playlist.length === 0) return;

    if (this.shuffleEnabled) {
      // Random next track (excluding current)
      const availableIndices = this.playlist
        .map((_, i) => i)
        .filter(i => i !== this.currentIndex);

      if (availableIndices.length > 0) {
        this.currentIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
      }
    } else {
      // Sequential next
      this.currentIndex = (this.currentIndex + 1) % this.playlist.length;
    }

    await this.loadTrack(this.playlist[this.currentIndex]);
    await this.play();
  }

  /**
   * Play previous track in playlist
   */
  public async playPrevious(): Promise<void> {
    if (this.playlist.length === 0) return;

    // If we're more than 3 seconds in, restart current track
    if (this.audio.currentTime > 3) {
      this.seek(0);
      return;
    }

    // Otherwise go to previous track
    this.currentIndex = (this.currentIndex - 1 + this.playlist.length) % this.playlist.length;
    await this.loadTrack(this.playlist[this.currentIndex]);
    await this.play();
  }

  /**
   * Handle track ended event
   */
  private async handleTrackEnded(): Promise<void> {
    if (this.repeatMode === 'one') {
      // Repeat current track
      this.seek(0);
      await this.play();
    } else if (this.repeatMode === 'all' || (this.playlist.length > 1 && this.currentIndex < this.playlist.length - 1)) {
      // Play next track
      await this.playNext();
    } else {
      // Stop at end
      this.notifyStatus();
    }
  }

  /**
   * Handle playback errors
   */
  private handleError(error: Event | Error): void {
    console.error('Audio playback error:', error);
    this.notifyStatus();
  }

  /**
   * Get current track
   */
  public getCurrentTrack(): LocalTrack | null {
    return this.currentTrack;
  }

  /**
   * Get current time
   */
  public getCurrentTime(): number {
    return this.audio.currentTime;
  }

  /**
   * Get duration
   */
  public getDuration(): number {
    return this.audio.duration || 0;
  }

  /**
   * Get volume
   */
  public getVolume(): number {
    return this.audio.volume;
  }

  /**
   * Is playing?
   */
  public isPlaying(): boolean {
    return !this.audio.paused && !this.audio.ended;
  }

  /**
   * Cleanup
   */
  public destroy(): void {
    this.audio.pause();
    this.audio.src = '';
    this.currentTrack = null;
    this.playlist = [];
    this.statusCallback = null;
    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = null;
      navigator.mediaSession.playbackState = 'none';
      // Clear handlers if needed (optional, as page unload clears)
    }
  }
}

// Export singleton instance
export const audioPlayer = new AudioPlayerService();
