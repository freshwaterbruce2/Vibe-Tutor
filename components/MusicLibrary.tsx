import {
  AlertCircle,
  Download,
  HardDrive,
  HelpCircle,
  Info,
  Library,
  Loader,
  Music,
  Music2,
  Pause,
  Play,
  Radio,
  SkipBack,
  SkipForward,
  Trash2,
  Volume2,
  X
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { audioPlayer, type PlaybackStatus } from '../services/audioPlayerService';
import { audioStream, type RadioStatus } from '../services/audioStreamService';
import { CURATED_MUSIC, MUSIC_CATEGORIES, RADIO_STATIONS } from '../services/curatedMusicData';
import { downloadQueue, type QueueStatus } from '../services/downloadQueueManager';
import {
  deleteTrack,
  formatBytes,
  getStorageUsed,
  type DownloadProgress
} from '../services/downloadService';
import {
  detectPlatform,
  extractPlaylistName,
  generateSpotifyEmbed,
  generateYouTubeEmbed,
  validateMusicUrl
} from '../services/musicService';
import type { CuratedTrack, LocalTrack, MusicPlaylist, RadioStation } from '../types';
import { JamendoMusicSearch } from './JamendoMusicSearch';

interface MusicLibraryProps {
  playlists: MusicPlaylist[];
  onAddPlaylist: (playlist: MusicPlaylist) => void;
  onRemovePlaylist: (id: string) => void;
}

export const MusicLibrary: React.FC<MusicLibraryProps> = ({
  playlists,
  onAddPlaylist,
  onRemovePlaylist
}) => {
  // Embedded Playlists State
  const [urlInput, setUrlInput] = useState('');
  const [playlistName, setPlaylistName] = useState('');
  const [error, setError] = useState('');

  // UI State
  const [showUserGuide, setShowUserGuide] = useState(false);

  // Local Music State
  const [localTracks, setLocalTracks] = useState<LocalTrack[]>([]);
  const [downloadUrl, setDownloadUrl] = useState('');
  const [trackName, setTrackName] = useState('');
  const [downloadError, setDownloadError] = useState('');
  const [storageUsed, setStorageUsed] = useState(0);
  const [playbackStatus, setPlaybackStatus] = useState<PlaybackStatus | null>(null);
  const [trackSortBy, setTrackSortBy] = useState<'name' | 'size' | 'lastPlayed' | 'date'>('date');
  const [selectedTracks, setSelectedTracks] = useState<Set<string>>(new Set());

  // Curated Music State
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Radio Streaming State (using native audio)
  const [radioStatus, setRadioStatus] = useState<RadioStatus>({
    isPlaying: false,
    station: null,
    error: null
  });

  // Download Queue State
  const [queueStatus, setQueueStatus] = useState<QueueStatus>({
    queueLength: 0,
    activeDownload: null,
    isPaused: false,
    totalCompleted: 0,
    totalFailed: 0
  });

  // Load local tracks from localStorage (DB temporarily disabled - causing crash on A54)
  useEffect(() => {
    const saved = localStorage.getItem('localTracks');
    if (saved) {
      setLocalTracks(JSON.parse(saved));
    }
  }, []);

  // Save local tracks to localStorage (DB temporarily disabled)
  useEffect(() => {
    localStorage.setItem('localTracks', JSON.stringify(localTracks));
  }, [localTracks]);

  // Subscribe to playback status
  useEffect(() => {
    audioPlayer.onStatusChange(setPlaybackStatus);

    // Load downloaded tracks into playlist
    const downloadedTracks = localTracks.filter(t => t.downloadStatus === 'completed');
    if (downloadedTracks.length > 0) {
      audioPlayer.loadPlaylist(downloadedTracks);
    }

    // Update storage used
    updateStorageUsed();
  }, [localTracks]);

  // Subscribe to radio status
  useEffect(() => {
    audioStream.onStatusChange(setRadioStatus);
  }, []);

  // Subscribe to download queue status
  useEffect(() => {
    downloadQueue.onStatusChange(setQueueStatus);
  }, []);

  const updateStorageUsed = async () => {
    const used = await getStorageUsed();
    setStorageUsed(used);
  };

  // ===== EMBEDDED PLAYLISTS HANDLERS =====
  const handleAddPlaylist = () => {
    setError('');

    if (!urlInput.trim()) {
      setError('Please enter a playlist URL');
      return;
    }

    if (!validateMusicUrl(urlInput)) {
      setError('Invalid URL. Please use Spotify or YouTube playlist/video links.');
      return;
    }

    const platform = detectPlatform(urlInput);
    let embedCode: string | null = null;

    if (platform === 'spotify') {
      embedCode = generateSpotifyEmbed(urlInput);
    } else if (platform === 'youtube') {
      embedCode = generateYouTubeEmbed(urlInput);
    }

    if (!embedCode) {
      setError('Could not generate embed code. Please check the URL format.');
      return;
    }

    const newPlaylist: MusicPlaylist = {
      id: `playlist-${Date.now()}`,
      name: playlistName.trim() || extractPlaylistName(urlInput),
      platform,
      url: urlInput,
      embedCode,
      createdAt: Date.now()
    };

    onAddPlaylist(newPlaylist);
    setUrlInput('');
    setPlaylistName('');
    setError('');
  };

  // ===== LOCAL MUSIC HANDLERS (using download queue) =====
  const handleDownloadTrack = async () => {
    setDownloadError('');

    if (!downloadUrl.trim()) {
      setDownloadError('Please enter a music file URL');
      return;
    }

    if (!trackName.trim()) {
      setDownloadError('Please enter a track name');
      return;
    }

    // Create new track
    const newTrack: LocalTrack = {
      id: `track-${Date.now()}`,
      name: trackName.trim(),
      downloadUrl: downloadUrl.trim(),
      downloadStatus: 'pending',
      downloadProgress: 0,
      createdAt: Date.now()
    };

    setLocalTracks(prev => [...prev, newTrack]);
    setDownloadUrl('');
    setTrackName('');

    // Add to download queue
    await downloadQueue.addToQueue(
      newTrack,
      // Progress callback
      (progress: DownloadProgress) => {
        updateTrackStatus(progress.trackId, 'downloading', progress.percentage);
      },
      // Complete callback
      (result) => {
        setLocalTracks(prev =>
          prev.map(t =>
            t.id === newTrack.id
              ? {
                ...t,
                downloadStatus: 'completed',
                downloadProgress: 100,
                localPath: result.filePath,
                fileSize: result.fileSize,
                metadata: result.metadata,
                duration: result.metadata?.duration,
                albumArt: result.albumArt
              }
              : t
          )
        );
        updateStorageUsed();
      },
      // Error callback
      (error) => {
        updateTrackStatus(newTrack.id, 'failed', 0);
        setDownloadError(error.message || 'Download failed');
      }
    );
  };

  const updateTrackStatus = (
    trackId: string,
    status: LocalTrack['downloadStatus'],
    progress: number,
    localPath?: string
  ) => {
    setLocalTracks(prev =>
      prev.map(t =>
        t.id === trackId
          ? { ...t, downloadStatus: status, downloadProgress: progress, localPath }
          : t
      )
    );
  };

  const handleDeleteTrack = async (track: LocalTrack) => {
    try {
      if (track.localPath) {
        await deleteTrack(track.localPath);
      }
      setLocalTracks(prev => prev.filter(t => t.id !== track.id));
      await updateStorageUsed();
    } catch (err: any) {
      setDownloadError(err.message || 'Delete failed');
    }
  };

  const handleRetryDownload = async (track: LocalTrack) => {
    setDownloadError('');

    // Reset track status to pending
    setLocalTracks(prev =>
      prev.map(t =>
        t.id === track.id
          ? { ...t, downloadStatus: 'pending', downloadProgress: 0 }
          : t
      )
    );

    // Retry download using queue manager
    await downloadQueue.retryDownload(
      track,
      // Progress callback
      (progress) => {
        updateTrackStatus(progress.trackId, 'downloading', progress.percentage);
      },
      // Complete callback
      (result) => {
        setLocalTracks(prev =>
          prev.map(t =>
            t.id === track.id
              ? {
                ...t,
                downloadStatus: 'completed',
                downloadProgress: 100,
                localPath: result.filePath,
                fileSize: result.fileSize,
                metadata: result.metadata,
                duration: result.metadata?.duration,
                albumArt: result.albumArt
              }
              : t
          )
        );
        updateStorageUsed();
      },
      // Error callback
      (error) => {
        updateTrackStatus(track.id, 'failed', 0);
        setDownloadError(error.message || 'Retry failed');
      }
    );
  };

  // Toggle track selection for bulk delete
  const toggleTrackSelection = (trackId: string) => {
    setSelectedTracks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(trackId)) {
        newSet.delete(trackId);
      } else {
        newSet.add(trackId);
      }
      return newSet;
    });
  };

  // Delete selected tracks in bulk
  const handleBulkDelete = async () => {
    if (selectedTracks.size === 0) return;

    try {
      const tracksToDelete = localTracks.filter(t => selectedTracks.has(t.id));

      for (const track of tracksToDelete) {
        if (track.localPath) {
          await deleteTrack(track.localPath);
        }
      }

      setLocalTracks(prev => prev.filter(t => !selectedTracks.has(t.id)));
      setSelectedTracks(new Set());
      await updateStorageUsed();
    } catch (err: any) {
      setDownloadError(err.message || 'Bulk delete failed');
    }
  };

  // Sort tracks based on selected criteria
  const getSortedTracks = (): LocalTrack[] => {
    const tracks = [...localTracks];

    switch (trackSortBy) {
      case 'name':
        return tracks.sort((a, b) =>
          getTrackDisplayTitle(a).localeCompare(getTrackDisplayTitle(b))
        );
      case 'size':
        return tracks.sort((a, b) => (b.fileSize || 0) - (a.fileSize || 0));
      case 'lastPlayed':
        return tracks.sort((a, b) => (b.lastPlayedAt || 0) - (a.lastPlayedAt || 0));
      case 'date':
      default:
        return tracks.sort((a, b) => b.createdAt - a.createdAt);
    }
  };

  const handlePlayTrack = async (track: LocalTrack) => {
    if (track.downloadStatus !== 'completed' || !track.localPath) {
      return;
    }

    const currentTrack = audioPlayer.getCurrentTrack();

    if (currentTrack?.id === track.id && audioPlayer.isPlaying()) {
      audioPlayer.pause();
    } else {
      // Load full playlist with correct start index for seamless track navigation
      const downloadedTracks = localTracks.filter(t => t.downloadStatus === 'completed');
      const trackIndex = downloadedTracks.findIndex(t => t.id === track.id);

      if (trackIndex !== -1) {
        audioPlayer.loadPlaylist(downloadedTracks, trackIndex);
        await audioPlayer.play();

        // Update lastPlayedAt
        setLocalTracks(prev =>
          prev.map(t =>
            t.id === track.id ? { ...t, lastPlayedAt: Date.now() } : t
          )
        );
      }
    }
  };

  const formatTime = (seconds: number): string => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (timestamp: number): string => {
    const now = Date.now();
    const diff = now - timestamp;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  // Get display title (prefer metadata over track name)
  const getTrackDisplayTitle = (track: LocalTrack): string => {
    return track.metadata?.title || track.name;
  };

  // Get display artist
  const getTrackDisplayArtist = (track: LocalTrack): string | null => {
    return track.metadata?.artist || track.artist || null;
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddPlaylist();
    }
  };

  // ===== RADIO STREAMING HANDLERS (using HTML5 Audio) =====
  const handlePlayRadio = async (station: RadioStation) => {
    try {
      // Stop local track if playing
      if (audioPlayer.isPlaying()) {
        audioPlayer.stop();
      }

      // If same station is playing, stop it
      if (radioStatus.station?.id === station.id && radioStatus.isPlaying) {
        audioStream.stop();
      } else {
        // Play new station
        await audioStream.play(station);
      }
    } catch (err: any) {
      console.error('Radio playback failed:', err);
      setDownloadError(err.message || `Failed to start ${station.name}. Try another station.`);
    }
  };

  const handleStopRadio = async () => {
    try {
      await audioStream.stop();
    } catch (err: any) {
      console.error('Radio stop failed:', err);
    }
  };

  // ===== CURATED MUSIC HANDLERS (using download queue) =====
  const handleDownloadCuratedTrack = async (curatedTrack: CuratedTrack) => {
    setDownloadError('');

    // Check if already downloaded
    const existingTrack = localTracks.find(t => t.downloadUrl === curatedTrack.downloadUrl);
    if (existingTrack) {
      setDownloadError('This track is already in your library!');
      return;
    }

    const newTrack: LocalTrack = {
      id: `track-${Date.now()}`,
      name: curatedTrack.name,
      artist: curatedTrack.artist,
      downloadUrl: curatedTrack.downloadUrl,
      downloadStatus: 'pending',
      downloadProgress: 0,
      createdAt: Date.now()
    };

    setLocalTracks(prev => [...prev, newTrack]);

    // Add to download queue
    await downloadQueue.addToQueue(
      newTrack,
      // Progress callback
      (progress: DownloadProgress) => {
        updateTrackStatus(progress.trackId, 'downloading', progress.percentage);
      },
      // Complete callback
      (result) => {
        setLocalTracks(prev =>
          prev.map(t =>
            t.id === newTrack.id
              ? {
                ...t,
                localPath: result.filePath,
                fileSize: result.fileSize,
                duration: result.metadata?.duration,
                metadata: result.metadata,
                albumArt: result.albumArt,
                downloadStatus: 'completed',
                downloadProgress: 100
              }
              : t
          )
        );
        updateStorageUsed();
      },
      // Error callback
      (error) => {
        setDownloadError(error.message || 'Download failed');
        updateTrackStatus(newTrack.id, 'failed', 0);
      }
    );
  };

  // Handle Jamendo track download
  const handleJamendoDownload = async (track: LocalTrack) => {
    setDownloadError('');

    // Check if already exists
    const existingTrack = localTracks.find(t => t.downloadUrl === track.downloadUrl);
    if (existingTrack) {
      setDownloadError('This track is already in your library!');
      return;
    }

    // Add track to local library
    setLocalTracks(prev => [...prev, track]);

    // Add to download queue
    await downloadQueue.addToQueue(
      track,
      // Progress callback
      (progress: DownloadProgress) => {
        updateTrackStatus(progress.trackId, 'downloading', progress.percentage);
      },
      // Complete callback
      (result) => {
        setLocalTracks(prev =>
          prev.map(t =>
            t.id === track.id
              ? {
                ...t,
                localPath: result.filePath,
                fileSize: result.fileSize,
                duration: result.metadata?.duration,
                metadata: result.metadata,
                albumArt: result.albumArt,
                downloadStatus: 'completed',
                downloadProgress: 100
              }
              : t
          )
        );
        updateStorageUsed();
      },
      // Error callback
      (error) => {
        setDownloadError(error.message || 'Download failed');
        updateTrackStatus(track.id, 'failed', 0);
      }
    );
  };

  // Filter curated music by category
  const filteredCuratedMusic = selectedCategory === 'all'
    ? CURATED_MUSIC
    : CURATED_MUSIC.filter(track => track.category === selectedCategory);

  const currentlyPlayingTrack = playbackStatus?.currentTrack;

  return (
    <div className="space-y-6 p-6 max-w-4xl mx-auto pb-32">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-3">
          <Music2 className="w-8 h-8 text-purple-400" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            My Music Library
          </h1>
          <button
            onClick={() => setShowUserGuide(!showUserGuide)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            title="Show user guide"
          >
            <HelpCircle className="w-6 h-6 text-gray-400 hover:text-purple-400" />
          </button>
        </div>
        <p className="text-gray-400">
          Add Spotify/YouTube playlists or download music files for offline playback
        </p>
      </div>

      {/* USER GUIDE (Collapsible) */}
      {showUserGuide && (
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-6 space-y-4">
          <div className="flex items-start gap-3">
            <Info className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-blue-300">How to Use Music Library</h3>

              <div className="space-y-2 text-sm text-gray-300">
                <div>
                  <strong className="text-white">Local Music (Offline Playback):</strong>
                  <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                    <li>Download MP3, WAV, or OGG files for offline playback</li>
                    <li>Enter a direct link to an audio file (not streaming services)</li>
                    <li>Files are saved to your device storage</li>
                    <li>Metadata (title, artist, album) extracted automatically</li>
                    <li>Album art displayed from MP3 tags</li>
                    <li>Works completely offline after download</li>
                    <li>Continues playing in background when you minimize the app</li>
                  </ul>
                </div>

                <div>
                  <strong className="text-white">Streaming Playlists:</strong>
                  <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                    <li>Embed Spotify or YouTube playlists/videos</li>
                    <li>Requires internet connection to play</li>
                    <li>No storage space needed</li>
                  </ul>
                </div>

                <div>
                  <strong className="text-white">Supported Audio Formats:</strong>
                  <p className="ml-4 mt-1">MP3, WAV, OGG, M4A, AAC, FLAC</p>
                </div>

                <div>
                  <strong className="text-white">Where to Find MP3 URLs:</strong>
                  <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                    <li>Free music sites (freemusicarchive.org, incompetech.com)</li>
                    <li>Direct links from file hosting services</li>
                    <li>Your own hosted audio files</li>
                  </ul>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 mt-3">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-yellow-300">Important Notes:</strong>
                      <ul className="list-disc list-inside ml-2 mt-1 text-xs space-y-1">
                        <li>Large files (&gt;50MB) may take several minutes to download</li>
                        <li>Ensure you have sufficient storage space</li>
                        <li>Downloaded files count toward your device storage</li>
                        <li>Only use URLs you have permission to download</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SEARCH MUSIC SECTION (Jamendo API - 500,000+ tracks) */}
      <div className="space-y-4 pb-6 border-b border-white/10">
        <h2 className="text-xl font-semibold text-gray-200 flex items-center gap-2">
          <Music className="w-5 h-5 text-cyan-400" />
          Search Music
        </h2>
        <p className="text-sm text-gray-400">
          Browse and search 500,000+ Creative Commons tracks
        </p>

        <JamendoMusicSearch
          onDownloadTrack={handleJamendoDownload}
          downloadedTrackUrls={localTracks.map(t => t.downloadUrl)}
        />
      </div>

      {/* BROWSE MUSIC SECTION (Curated Library) */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-200 flex items-center gap-2">
          <Library className="w-5 h-5 text-purple-400" />
          Browse Music
        </h2>
        <p className="text-sm text-gray-400">
          Hand-picked study music - tap to download
        </p>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-xl font-medium transition-all ${selectedCategory === 'all'
              ? 'bg-purple-500 text-white'
              : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
          >
            All
          </button>
          {MUSIC_CATEGORIES.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-xl font-medium transition-all ${selectedCategory === category.id
                ? 'bg-purple-500 text-white'
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
            >
              {category.icon} {category.name}
            </button>
          ))}
        </div>

        {/* Curated Music Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredCuratedMusic.map(track => {
            const isDownloaded = localTracks.some(t => t.downloadUrl === track.downloadUrl);
            return (
              <div
                key={track.id}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 hover:border-purple-500/30 transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h3 className="text-white font-medium">{track.name}</h3>
                    <p className="text-gray-400 text-sm">{track.artist}</p>
                    {track.description && (
                      <p className="text-gray-500 text-xs mt-1">{track.description}</p>
                    )}
                    <p className="text-gray-500 text-xs mt-1">
                      {track.estimatedSize}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDownloadCuratedTrack(track)}
                    disabled={isDownloaded}
                    className={`p-3 rounded-xl transition-all ${isDownloaded
                      ? 'bg-green-500/20 text-green-400 cursor-not-allowed'
                      : 'bg-purple-500 hover:bg-purple-600 text-white'
                      }`}
                    title={isDownloaded ? 'Already downloaded' : 'Download'}
                  >
                    {isDownloaded ? (
                      <span className="text-xs">✓</span>
                    ) : (
                      <Download className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* RADIO STREAMS SECTION */}
      <div className="space-y-4 pt-6 border-t border-white/10">
        <h2 className="text-xl font-semibold text-gray-200 flex items-center gap-2">
          <Radio className="w-5 h-5 text-blue-400" />
          Radio Streams
        </h2>
        <p className="text-sm text-gray-400">
          24/7 live streams - no download needed
        </p>

        {/* Radio Station List */}
        <div className="space-y-3">
          {RADIO_STATIONS.map(station => {
            const isActive = radioStatus.station?.id === station.id && radioStatus.isPlaying;
            return (
              <div
                key={station.id}
                className={`bg-white/5 backdrop-blur-xl border rounded-2xl p-4 transition-all ${isActive
                  ? 'border-blue-500/50 bg-blue-500/10'
                  : 'border-white/10 hover:border-blue-500/30'
                  }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1">
                    <h3 className="text-white font-medium">{station.name}</h3>
                    <p className="text-gray-400 text-sm">{station.genre}</p>
                    {station.description && (
                      <p className="text-gray-500 text-xs mt-1">{station.description}</p>
                    )}
                  </div>
                  <button
                    onClick={() => handlePlayRadio(station)}
                    className={`p-3 rounded-xl transition-all ${isActive
                      ? 'bg-blue-500 hover:bg-blue-600 text-white'
                      : 'bg-white/10 hover:bg-white/20 text-gray-300'
                      }`}
                  >
                    {isActive ? (
                      <Pause className="w-5 h-5" />
                    ) : (
                      <Play className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Radio Mini Player */}
        {radioStatus.station && radioStatus.isPlaying && (
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <Radio className="w-5 h-5 text-white animate-pulse" />
                </div>
                <div>
                  <p className="text-white font-medium">Now Playing</p>
                  <p className="text-gray-400 text-sm">{radioStatus.station.name}</p>
                </div>
              </div>
              <button
                onClick={handleStopRadio}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>
        )}

        {/* Radio Error Display */}
        {radioStatus.error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
            {radioStatus.error}
          </div>
        )}
      </div>

      {/* LOCAL MUSIC SECTION */}
      <div className="space-y-4 pt-6 border-t border-white/10">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h2 className="text-xl font-semibold text-gray-200 flex items-center gap-2">
            <HardDrive className="w-5 h-5 text-green-400" />
            Downloaded Music ({localTracks.filter(t => t.downloadStatus === 'completed').length})
          </h2>
          <div className="flex items-center gap-3">
            {selectedTracks.size > 0 && (
              <button
                onClick={handleBulkDelete}
                className="px-3 py-1.5 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm hover:bg-red-500/20 transition-colors"
              >
                Delete {selectedTracks.size} tracks
              </button>
            )}
            <span className={`text-sm ${storageUsed > 80 * 1024 * 1024 ? 'text-orange-400' : 'text-gray-400'}`}>
              Storage: {formatBytes(storageUsed)}
            </span>
          </div>
        </div>

        {/* Storage Warning (>80MB) */}
        {storageUsed > 80 * 1024 * 1024 && (
          <div className="p-4 bg-orange-500/10 border border-orange-500/30 rounded-2xl">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-orange-300 font-medium mb-1">Storage Alert</h4>
                <p className="text-sm text-gray-300 mb-2">
                  You've used {formatBytes(storageUsed)} of storage. Consider deleting old tracks to free up space.
                </p>
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => setTrackSortBy('lastPlayed')}
                    className="px-3 py-1 bg-orange-500/20 border border-orange-500/40 rounded-lg text-orange-300 text-xs hover:bg-orange-500/30 transition-colors"
                  >
                    Sort by Last Played
                  </button>
                  <button
                    onClick={() => setTrackSortBy('size')}
                    className="px-3 py-1 bg-orange-500/20 border border-orange-500/40 rounded-lg text-orange-300 text-xs hover:bg-orange-500/30 transition-colors"
                  >
                    Sort by Size
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Download Queue Status */}
        {queueStatus.queueLength > 0 && (
          <div className="bg-purple-500/10 border border-purple-500/30 rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Loader className="w-5 h-5 text-purple-400 animate-spin" />
                <div>
                  <p className="text-white font-medium">
                    {queueStatus.activeDownload
                      ? `Downloading: ${queueStatus.activeDownload.name}`
                      : 'Processing queue...'}
                  </p>
                  <p className="text-gray-400 text-sm">
                    {queueStatus.queueLength} {queueStatus.queueLength === 1 ? 'track' : 'tracks'} in queue
                  </p>
                </div>
              </div>
              <div className="text-right text-sm text-gray-400">
                <p>Completed: {queueStatus.totalCompleted}</p>
                {queueStatus.totalFailed > 0 && (
                  <p className="text-red-400">Failed: {queueStatus.totalFailed}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Download Form */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-200">Download Music File</h3>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <Info className="w-4 h-4" />
              <span>Supported: MP3, WAV, OGG, M4A, AAC, FLAC</span>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Track Name *
                <span className="text-xs text-gray-500 ml-2">(Used if metadata not found)</span>
              </label>
              <input
                type="text"
                value={trackName}
                onChange={(e) => setTrackName(e.target.value)}
                placeholder="e.g., Chill Beats, Study Music..."
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Direct Audio File URL *
                <span className="text-xs text-gray-500 ml-2">(Must end in .mp3, .wav, etc.)</span>
              </label>
              <input
                type="text"
                value={downloadUrl}
                onChange={(e) => setDownloadUrl(e.target.value)}
                placeholder="https://example.com/music.mp3"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-transparent transition-all"
              />
              <p className="text-xs text-gray-500 mt-2">
                💡 Tip: Use sites like freemusicarchive.org or incompetech.com for royalty-free music
              </p>
            </div>

            {storageUsed > 100 * 1024 * 1024 && (
              <div className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg text-orange-400 text-sm flex items-start gap-2">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>You&apos;ve used {formatBytes(storageUsed)} of storage. Consider deleting old tracks if space is low.</span>
              </div>
            )}

            {downloadError && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                {downloadError}
              </div>
            )}

            <button
              onClick={handleDownloadTrack}
              disabled={!trackName.trim() || !downloadUrl.trim()}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-green-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-5 h-5" />
              Download Track
            </button>
          </div>
        </div>

        {/* Downloaded Tracks List */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-200">
              Downloaded Tracks
            </h3>
            {localTracks.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">Sort by:</span>
                <select
                  value={trackSortBy}
                  onChange={(e) => setTrackSortBy(e.target.value as any)}
                  className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                >
                  <option value="date">Newest First</option>
                  <option value="name">Name A-Z</option>
                  <option value="size">Largest First</option>
                  <option value="lastPlayed">Recently Played</option>
                </select>
              </div>
            )}
          </div>

          {localTracks.length === 0 ? (
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-12 text-center">
              <Music className="w-16 h-16 mx-auto mb-4 text-gray-500" />
              <p className="text-gray-400 text-lg mb-2">No local tracks yet</p>
              <p className="text-gray-500 text-sm">
                Download your first music file to enable offline playback!
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {getSortedTracks().map((track) => (
                <div
                  key={track.id}
                  className={`bg-white/5 backdrop-blur-xl border ${currentlyPlayingTrack?.id === track.id
                    ? 'border-purple-500/50'
                    : selectedTracks.has(track.id)
                      ? 'border-blue-500/50'
                      : 'border-white/10'
                    } rounded-xl p-4 hover:border-purple-500/30 transition-all duration-200`}
                >
                  <div className="flex items-center gap-4">
                    {/* Selection Checkbox (only for completed tracks) */}
                    {track.downloadStatus === 'completed' && (
                      <input
                        type="checkbox"
                        checked={selectedTracks.has(track.id)}
                        onChange={() => toggleTrackSelection(track.id)}
                        className="w-5 h-5 rounded border-2 border-white/20 bg-white/5 checked:bg-purple-500 checked:border-purple-500 cursor-pointer"
                      />
                    )}

                    {/* Album Art / Play Button / Status Icon */}
                    {track.downloadStatus === 'completed' && track.localPath ? (
                      <div className="relative flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden group">
                        {track.albumArt ? (
                          <img
                            src={track.albumArt}
                            alt={getTrackDisplayTitle(track)}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500" />
                        )}
                        <button
                          onClick={() => handlePlayTrack(track)}
                          className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          {currentlyPlayingTrack?.id === track.id && playbackStatus?.state === 'playing' ? (
                            <Pause className="w-6 h-6 text-white" />
                          ) : (
                            <Play className="w-6 h-6 text-white ml-0.5" />
                          )}
                        </button>
                      </div>
                    ) : track.downloadStatus === 'downloading' ? (
                      <div className="flex-shrink-0 w-14 h-14 flex items-center justify-center bg-white/5 rounded-lg">
                        <Loader className="w-6 h-6 text-purple-400 animate-spin" />
                      </div>
                    ) : track.downloadStatus === 'failed' ? (
                      <div className="flex-shrink-0 w-14 h-14 flex items-center justify-center bg-red-500/10 rounded-lg border border-red-500/30">
                        <AlertCircle className="w-6 h-6 text-red-400" />
                      </div>
                    ) : (
                      <div className="flex-shrink-0 w-14 h-14 flex items-center justify-center bg-white/5 rounded-lg">
                        <Music className="w-6 h-6 text-gray-500" />
                      </div>
                    )}

                    {/* Track Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-medium truncate">
                        {getTrackDisplayTitle(track)}
                        {currentlyPlayingTrack?.id === track.id && (
                          <span className="ml-2 text-xs text-purple-400">● Now Playing</span>
                        )}
                      </h4>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        {getTrackDisplayArtist(track) && (
                          <>
                            <span className="truncate">{getTrackDisplayArtist(track)}</span>
                            <span>•</span>
                          </>
                        )}
                        {track.metadata?.album && (
                          <>
                            <span className="truncate">{track.metadata.album}</span>
                            <span>•</span>
                          </>
                        )}
                        <span>{track.downloadStatus}</span>
                        {track.fileSize && <span>• {formatBytes(track.fileSize)}</span>}
                        {track.duration && <span>• {formatTime(track.duration)}</span>}
                        {track.lastPlayedAt && (
                          <span>• Last played {formatDate(track.lastPlayedAt)}</span>
                        )}
                      </div>

                      {/* Download Progress */}
                      {track.downloadStatus === 'downloading' && (
                        <div className="mt-2">
                          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-300"
                              style={{ width: `${track.downloadProgress || 0}%` }}
                            />
                          </div>
                          <p className="text-xs text-gray-400 mt-1">
                            {Math.round(track.downloadProgress || 0)}%
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {/* Retry Button (only for failed downloads) */}
                      {track.downloadStatus === 'failed' && (
                        <button
                          onClick={() => handleRetryDownload(track)}
                          className="p-2 hover:bg-green-500/10 rounded-lg transition-colors group"
                          title="Retry download"
                        >
                          <Download className="w-5 h-5 text-gray-400 group-hover:text-green-400" />
                        </button>
                      )}

                      {/* Delete Button */}
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
              ))}
            </div>
          )}
        </div>
      </div>

      {/* STREAMING PLAYLISTS SECTION - HIDDEN (YouTube/Spotify embeds don't work in Android WebView) */}
      {/* Keeping playlists props for backward compatibility but not displaying section */}

      {/* MINI PLAYER (Bottom Fixed) */}
      {playbackStatus && currentlyPlayingTrack && (
        <div className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-xl border-t border-white/10 p-4 shadow-2xl z-50">
          <div className="max-w-4xl mx-auto space-y-3">
            {/* Track Info */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {/* Album Art */}
                {currentlyPlayingTrack.albumArt ? (
                  <img
                    src={currentlyPlayingTrack.albumArt}
                    alt={getTrackDisplayTitle(currentlyPlayingTrack)}
                    className="w-14 h-14 rounded-lg object-cover flex-shrink-0 shadow-lg"
                  />
                ) : (
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg">
                    <Music2 className="w-7 h-7 text-white" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="text-white font-medium truncate">
                    {getTrackDisplayTitle(currentlyPlayingTrack)}
                  </h4>
                  <p className="text-gray-400 text-sm truncate">
                    {getTrackDisplayArtist(currentlyPlayingTrack) || formatTime(playbackStatus.currentTime) + ' / ' + formatTime(playbackStatus.duration)}
                  </p>
                  {getTrackDisplayArtist(currentlyPlayingTrack) && (
                    <p className="text-gray-500 text-xs">
                      {formatTime(playbackStatus.currentTime)} / {formatTime(playbackStatus.duration)}
                    </p>
                  )}
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={() => audioPlayer.stop()}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <input
                type="range"
                min="0"
                max={playbackStatus.duration || 0}
                value={playbackStatus.currentTime || 0}
                onChange={(e) => audioPlayer.seek(Number(e.target.value))}
                className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-500"
              />
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => audioPlayer.playPrevious()}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <SkipBack className="w-5 h-5 text-gray-300" />
                </button>

                <button
                  onClick={() => audioPlayer.togglePlayPause()}
                  className="p-3 bg-purple-500 hover:bg-purple-600 rounded-full transition-all"
                >
                  {playbackStatus.state === 'playing' ? (
                    <Pause className="w-6 h-6 text-white" />
                  ) : (
                    <Play className="w-6 h-6 text-white ml-0.5" />
                  )}
                </button>

                <button
                  onClick={() => audioPlayer.playNext()}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <SkipForward className="w-5 h-5 text-gray-300" />
                </button>
              </div>

              {/* Volume Control */}
              <div className="flex items-center gap-2">
                <Volume2 className="w-5 h-5 text-gray-400" />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={playbackStatus.volume}
                  onChange={(e) => audioPlayer.setVolume(Number(e.target.value))}
                  className="w-24 h-2 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-500"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
