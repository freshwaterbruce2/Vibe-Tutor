import React, { useState, useEffect } from 'react';
import type { LocalTrack, DownloadStatus } from '../types';
import { 
  Plus, 
  Music2, 
  Trash2, 
  Download, 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack,
  Volume2,
  Loader,
  AlertCircle,
  Check
} from 'lucide-react';
import {
  downloadMusicFile,
  deleteTrack,
  formatBytes,
  getStorageUsed,
  clearAllDownloads
} from '../services/downloadService';
import {
  audioPlayer,
  type PlaybackStatus,
  type PlaybackState
} from '../services/audioPlayerService';

interface MusicLibraryLocalProps {
  tracks: LocalTrack[];
  onAddTrack: (track: LocalTrack) => void;
  onRemoveTrack: (id: string) => void;
  onUpdateTrack: (track: LocalTrack) => void;
}

export const MusicLibraryLocal: React.FC<MusicLibraryLocalProps> = ({
  tracks,
  onAddTrack,
  onRemoveTrack,
  onUpdateTrack
}) => {
  const [urlInput, setUrlInput] = useState('');
  const [trackName, setTrackName] = useState('');
  const [error, setError] = useState('');
  const [storageUsed, setStorageUsed] = useState(0);
  const [playbackStatus, setPlaybackStatus] = useState<PlaybackStatus | null>(null);

  // Subscribe to playback updates
  useEffect(() => {
    audioPlayer.onStatusChange(setPlaybackStatus);
    updateStorageInfo();

    return () => {
      // Cleanup on unmount
    };
  }, []);

  // Update storage info
  const updateStorageInfo = async () => {
    const used = await getStorageUsed();
    setStorageUsed(used);
  };

  const handleAddTrack = async () => {
    setError('');

    if (!urlInput.trim()) {
      setError('Please enter a download URL');
      return;
    }

    if (!trackName.trim()) {
      setError('Please enter a track name');
      return;
    }

    // Create new track object
    const newTrack: LocalTrack = {
      id: `track-${Date.now()}`,
      name: trackName.trim(),
      artist: 'Unknown Artist',
      downloadUrl: urlInput.trim(),
      downloadStatus: 'pending',
      downloadProgress: 0,
      createdAt: Date.now()
    };

    onAddTrack(newTrack);

    // Reset form
    setUrlInput('');
    setTrackName('');

    // Start download in background
    downloadTrackInBackground(newTrack);
  };

  const downloadTrackInBackground = async (track: LocalTrack) => {
    try {
      // Update status to downloading
      onUpdateTrack({ ...track, downloadStatus: 'downloading', downloadProgress: 0 });

      // Download with progress tracking
      const localPath = await downloadMusicFile(track, (progress) => {
        onUpdateTrack({
          ...track,
          downloadStatus: 'downloading',
          downloadProgress: Math.floor(progress.percentage)
        });
      });

      // Update to completed
      onUpdateTrack({
        ...track,
        localPath,
        downloadStatus: 'completed',
        downloadProgress: 100
      });

      await updateStorageInfo();
    } catch (err: any) {
      console.error('Download error:', err);
      onUpdateTrack({
        ...track,
        downloadStatus: 'failed',
        downloadProgress: 0
      });
    }
  };

  const handleDeleteTrack = async (track: LocalTrack) => {
    try {
      if (track.localPath) {
        await deleteTrack(track.localPath);
      }
      onRemoveTrack(track.id);
      await updateStorageInfo();
    } catch (err: any) {
      console.error('Delete error:', err);
      setError(`Failed to delete: ${err.message}`);
    }
  };

  const handlePlayTrack = async (track: LocalTrack) => {
    if (track.downloadStatus !== 'completed' || !track.localPath) {
      setError('Track not downloaded yet');
      return;
    }

    try {
      // If this track is already playing, toggle pause
      if (playbackStatus?.currentTrack?.id === track.id && playbackStatus.state === 'playing') {
        audioPlayer.pause();
      } else if (playbackStatus?.currentTrack?.id === track.id) {
        await audioPlayer.play();
      } else {
        // Load and play new track
        await audioPlayer.loadTrack(track);
        await audioPlayer.play();
      }
    } catch (err: any) {
      console.error('Playback error:', err);
      setError(`Playback failed: ${err.message}`);
    }
  };

  const handleClearAll = async () => {
    if (window.confirm('Delete all downloaded music? This cannot be undone.')) {
      try {
        await clearAllDownloads();
        tracks.forEach(track => onRemoveTrack(track.id));
        await updateStorageInfo();
      } catch (err: any) {
        setError(`Failed to clear: ${err.message}`);
      }
    }
  };

  const getStatusIcon = (status: DownloadStatus) => {
    switch (status) {
      case 'downloading':
        return <Loader className="w-5 h-5 animate-spin text-blue-400" />;
      case 'completed':
        return <Check className="w-5 h-5 text-green-400" />;
      case 'failed':
        return <AlertCircle className="w-5 h-5 text-red-400" />;
      default:
        return <Download className="w-5 h-5 text-gray-400" />;
    }
  };

  const isTrackPlaying = (track: LocalTrack): boolean => {
    return playbackStatus?.currentTrack?.id === track.id && playbackStatus.state === 'playing';
  };

  return (
    <div className="space-y-6 p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-3">
          <Music2 className="w-8 h-8 text-purple-400" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            My Music Library
          </h1>
        </div>
        <p className="text-gray-400">
          Download and play music offline
        </p>
        <div className="text-sm text-gray-500">
          Storage used: {formatBytes(storageUsed)}
        </div>
      </div>

      {/* Download Form */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
        <h2 className="text-xl font-semibold mb-4 text-gray-200">Download Music</h2>
        
        <div className="space-y-4">
          {/* Track Name Input */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Track Name *
            </label>
            <input
              type="text"
              value={trackName}
              onChange={(e) => setTrackName(e.target.value)}
              placeholder="e.g., Study Music, Focus Beats..."
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all"
            />
          </div>

          {/* URL Input */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Direct MP3 URL *
            </label>
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://example.com/song.mp3"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all"
            />
            <p className="mt-2 text-xs text-gray-500">
              Tip: Use direct links to MP3 files. Free music: 
              <a 
                href="https://freemusicarchive.org" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-purple-400 hover:underline ml-1"
              >
                Free Music Archive
              </a>
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          {/* Download Button */}
          <button
            onClick={handleAddTrack}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-purple-500/50"
          >
            <Download className="w-5 h-5" />
            Download Track
          </button>

          {tracks.length > 0 && (
            <button
              onClick={handleClearAll}
              className="w-full px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-all text-sm"
            >
              Clear All Downloads
            </button>
          )}
        </div>
      </div>

      {/* Tracks List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-200">
          🎵 Downloaded Tracks ({tracks.filter(t => t.downloadStatus === 'completed').length}/{tracks.length})
        </h2>

        {tracks.length === 0 ? (
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-12 text-center">
            <Music2 className="w-16 h-16 mx-auto mb-4 text-gray-500" />
            <p className="text-gray-400 text-lg mb-2">No tracks yet</p>
            <p className="text-gray-500 text-sm">
              Download your first track to start listening offline!
            </p>
          </div>
        ) : (
          tracks.map((track) => (
            <div
              key={track.id}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl hover:border-purple-500/30 transition-all duration-300"
            >
              <div className="flex items-center gap-4">
                {/* Play Button */}
                <button
                  onClick={() => handlePlayTrack(track)}
                  disabled={track.downloadStatus !== 'completed'}
                  className={`p-3 rounded-full transition-all ${
                    track.downloadStatus === 'completed'
                      ? 'bg-purple-500 hover:bg-purple-600 text-white'
                      : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isTrackPlaying(track) ? (
                    <Pause className="w-5 h-5" />
                  ) : (
                    <Play className="w-5 h-5" />
                  )}
                </button>

                {/* Track Info */}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white">
                    {track.name}
                  </h3>
                  <div className="flex items-center gap-3 text-sm text-gray-400">
                    {track.artist && <span>{track.artist}</span>}
                    {track.duration && (
                      <>
                        <span>•</span>
                        <span>{Math.floor(track.duration / 60)}:{String(Math.floor(track.duration % 60)).padStart(2, '0')}</span>
                      </>
                    )}
                  </div>

                  {/* Download Progress */}
                  {track.downloadStatus === 'downloading' && (
                    <div className="mt-2">
                      <div className="flex justify-between text-xs text-gray-400 mb-1">
                        <span>Downloading...</span>
                        <span>{track.downloadProgress}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${track.downloadProgress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Status & Actions */}
                <div className="flex items-center gap-2">
                  {getStatusIcon(track.downloadStatus)}
                  <button
                    onClick={() => handleDeleteTrack(track)}
                    className="p-2 hover:bg-red-500/10 rounded-lg transition-colors group"
                    title="Delete track"
                  >
                    <Trash2 className="w-5 h-5 text-gray-400 group-hover:text-red-400" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Mini Player - Shows at bottom when playing */}
      {playbackStatus?.currentTrack && playbackStatus.state !== 'idle' && (
        <div className="fixed bottom-20 left-4 right-4 md:bottom-4 bg-gradient-to-r from-purple-900/95 to-pink-900/95 backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-2xl z-40">
          <div className="flex items-center gap-4">
            <button
              onClick={async () => await audioPlayer.playPrevious()}
              className="p-2 hover:bg-white/10 rounded-lg transition-all"
            >
              <SkipBack className="w-5 h-5 text-white" />
            </button>

            <button
              onClick={async () => await audioPlayer.togglePlayPause()}
              className="p-3 bg-white rounded-full hover:scale-110 transition-all"
            >
              {playbackStatus.state === 'playing' ? (
                <Pause className="w-6 h-6 text-purple-900" />
              ) : (
                <Play className="w-6 h-6 text-purple-900" />
              )}
            </button>

            <button
              onClick={async () => await audioPlayer.playNext()}
              className="p-2 hover:bg-white/10 rounded-lg transition-all"
            >
              <SkipForward className="w-5 h-5 text-white" />
            </button>

            <div className="flex-1 min-w-0">
              <div className="text-white font-semibold truncate">
                {playbackStatus.currentTrack.name}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-gray-300">
                  {Math.floor(playbackStatus.currentTime / 60)}:{String(Math.floor(playbackStatus.currentTime % 60)).padStart(2, '0')}
                </span>
                <div className="flex-1 bg-white/20 rounded-full h-1">
                  <div
                    className="bg-white h-1 rounded-full transition-all"
                    style={{ width: `${(playbackStatus.currentTime / playbackStatus.duration) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-gray-300">
                  {Math.floor(playbackStatus.duration / 60)}:{String(Math.floor(playbackStatus.duration % 60)).padStart(2, '0')}
                </span>
              </div>
            </div>

            <Volume2 className="w-5 h-5 text-white hidden md:block" />
          </div>
        </div>
      )}
    </div>
  );
};
