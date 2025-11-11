/**
 * Jamendo Music Search Component
 * MODULAR: Self-contained music discovery interface
 * Can be imported and used in MusicLibrary or standalone
 *
 * Features:
 * - Genre browsing (anime, EDM, lo-fi, etc.)
 * - Text search with smart keyword mapping
 * - Curated activity playlists
 * - Track preview and download
 */

import React, { useState, useEffect } from 'react';
import { Search, Music, Download, Play, Loader, TrendingUp, X } from 'lucide-react';
import {
  searchTracks,
  browseByGenre,
  smartSearch,
  getCuratedPlaylist,
  getPopularTracks,
  convertToLocalTrack,
  formatDuration,
  JAMENDO_GENRES,
  type JamendoGenreCategory,
  type JamendoTrack
} from '../services/jamendoService';
import type { LocalTrack } from '../types';

interface JamendoMusicSearchProps {
  /** Callback when user wants to download a track */
  onDownloadTrack: (track: LocalTrack) => void;

  /** Callback when user wants to preview a track */
  onPreviewTrack?: (track: JamendoTrack) => void;

  /** List of already downloaded track URLs (to show "Downloaded" badge) */
  downloadedTrackUrls?: string[];
}

export const JamendoMusicSearch: React.FC<JamendoMusicSearchProps> = ({
  onDownloadTrack,
  onPreviewTrack,
  downloadedTrackUrls = [],
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<JamendoTrack[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'browse' | 'search' | 'trending' | 'activities'>('browse');
  const [selectedGenre, setSelectedGenre] = useState<JamendoGenreCategory>('anime');
  const [previewingTrack, setPreviewingTrack] = useState<string | null>(null);

  // Load genre tracks on mount or genre change
  useEffect(() => {
    if (activeTab === 'browse') {
      handleBrowseGenre(selectedGenre);
    }
  }, [selectedGenre, activeTab]);

  // Browse by genre
  const handleBrowseGenre = async (genre: JamendoGenreCategory) => {
    setIsLoading(true);
    setError('');

    try {
      const result = await browseByGenre(genre, 20);
      setSearchResults(result.results);
    } catch (err: any) {
      setError(err.message || 'Failed to browse genre');
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Search tracks
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setError('');

    try {
      const result = await smartSearch(searchQuery, 20);
      setSearchResults(result.results);
      setActiveTab('search');
    } catch (err: any) {
      setError(err.message || 'Search failed');
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Load trending tracks
  const handleLoadTrending = async () => {
    setIsLoading(true);
    setError('');

    try {
      const result = await getPopularTracks(20);
      setSearchResults(result.results);
    } catch (err: any) {
      setError(err.message || 'Failed to load trending tracks');
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Load curated playlist
  const handleLoadActivity = async (activity: 'homework' | 'break' | 'focus' | 'morning' | 'evening') => {
    setIsLoading(true);
    setError('');

    try {
      const result = await getCuratedPlaylist(activity, 15);
      setSearchResults(result.results);
    } catch (err: any) {
      setError(err.message || 'Failed to load playlist');
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Check if track is already downloaded
  const isTrackDownloaded = (track: JamendoTrack): boolean => {
    return downloadedTrackUrls.includes(track.audiodownload);
  };

  // Handle download
  const handleDownload = (track: JamendoTrack) => {
    if (isTrackDownloaded(track)) {
      return; // Already downloaded
    }

    const localTrack = convertToLocalTrack(track);
    onDownloadTrack(localTrack);
  };

  // Handle preview
  const handlePreview = (track: JamendoTrack) => {
    if (onPreviewTrack) {
      onPreviewTrack(track);
      setPreviewingTrack(track.id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search music... (try: 'calm study', 'anime', 'worship')"
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={isLoading || !searchQuery.trim()}
            className="px-6 py-3 bg-purple-500 hover:bg-purple-600 disabled:opacity-50 text-white font-semibold rounded-xl transition-all"
          >
            {isLoading ? <Loader className="w-5 h-5 animate-spin" /> : 'Search'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setActiveTab('browse')}
          className={`px-4 py-2 rounded-xl font-medium transition-all ${
            activeTab === 'browse'
              ? 'bg-purple-500 text-white'
              : 'bg-white/5 text-gray-400 hover:bg-white/10'
          }`}
        >
          Browse Genres
        </button>
        <button
          onClick={() => { setActiveTab('trending'); handleLoadTrending(); }}
          className={`px-4 py-2 rounded-xl font-medium transition-all flex items-center gap-2 ${
            activeTab === 'trending'
              ? 'bg-purple-500 text-white'
              : 'bg-white/5 text-gray-400 hover:bg-white/10'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          Trending
        </button>
        <button
          onClick={() => setActiveTab('activities')}
          className={`px-4 py-2 rounded-xl font-medium transition-all ${
            activeTab === 'activities'
              ? 'bg-purple-500 text-white'
              : 'bg-white/5 text-gray-400 hover:bg-white/10'
          }`}
        >
          Activity Playlists
        </button>
      </div>

      {/* Genre Filter (Browse tab) */}
      {activeTab === 'browse' && (
        <div className="flex gap-2 flex-wrap">
          {(Object.keys(JAMENDO_GENRES) as JamendoGenreCategory[]).map(genre => (
            <button
              key={genre}
              onClick={() => setSelectedGenre(genre)}
              className={`px-4 py-2 rounded-xl font-medium transition-all capitalize ${
                selectedGenre === genre
                  ? 'bg-blue-500 text-white'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              {genre}
            </button>
          ))}
        </div>
      )}

      {/* Activity Playlists (Activities tab) */}
      {activeTab === 'activities' && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { id: 'homework', name: 'Homework Focus', emoji: '📚', activity: 'homework' as const },
            { id: 'break', name: 'Break Time', emoji: '☕', activity: 'break' as const },
            { id: 'focus', name: 'Deep Focus', emoji: '🎯', activity: 'focus' as const },
            { id: 'morning', name: 'Morning Energy', emoji: '☀️', activity: 'morning' as const },
            { id: 'evening', name: 'Evening Chill', emoji: '🌙', activity: 'evening' as const },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => handleLoadActivity(item.activity)}
              className="p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all text-center"
            >
              <div className="text-3xl mb-2">{item.emoji}</div>
              <div className="text-white font-medium">{item.name}</div>
            </button>
          ))}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-300 text-sm">
          {error}
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader className="w-8 h-8 text-purple-400 animate-spin" />
        </div>
      )}

      {/* Results */}
      {!isLoading && searchResults.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-200">
              {searchResults.length} {searchResults.length === 1 ? 'track' : 'tracks'} found
            </h3>
          </div>

          <div className="space-y-2">
            {searchResults.map(track => (
              <div
                key={track.id}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4 hover:border-purple-500/30 transition-all"
              >
                <div className="flex items-start gap-4">
                  {/* Album Art */}
                  {track.image && (
                    <img
                      src={track.image}
                      alt={track.album_name}
                      className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                    />
                  )}

                  {/* Track Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-medium truncate">{track.name}</h4>
                    <p className="text-gray-400 text-sm truncate">{track.artist_name}</p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                      <span>{track.album_name}</span>
                      <span>•</span>
                      <span>{formatDuration(track.duration)}</span>
                      <span>•</span>
                      <span>{track.releasedate.split('-')[0]}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {/* Preview Button */}
                    {onPreviewTrack && (
                      <button
                        onClick={() => handlePreview(track)}
                        className={`p-3 rounded-xl transition-all ${
                          previewingTrack === track.id
                            ? 'bg-blue-500 text-white'
                            : 'bg-white/10 hover:bg-white/20 text-gray-300'
                        }`}
                        title="Preview (30 seconds)"
                      >
                        <Play className="w-5 h-5" />
                      </button>
                    )}

                    {/* Download Button */}
                    <button
                      onClick={() => handleDownload(track)}
                      disabled={isTrackDownloaded(track)}
                      className={`p-3 rounded-xl transition-all ${
                        isTrackDownloaded(track)
                          ? 'bg-green-500/20 text-green-400 cursor-not-allowed'
                          : 'bg-purple-500 hover:bg-purple-600 text-white'
                      }`}
                      title={isTrackDownloaded(track) ? 'Already downloaded' : 'Download'}
                    >
                      {isTrackDownloaded(track) ? (
                        <span className="text-xs">✓</span>
                      ) : (
                        <Download className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Results */}
      {!isLoading && searchResults.length === 0 && (activeTab === 'search' || activeTab === 'trending') && (
        <div className="text-center py-12">
          <Music className="w-16 h-16 mx-auto mb-4 text-gray-500" />
          <p className="text-gray-400 text-lg mb-2">No tracks found</p>
          <p className="text-gray-500 text-sm">Try a different search or browse genres</p>
        </div>
      )}
    </div>
  );
};

export default JamendoMusicSearch;
