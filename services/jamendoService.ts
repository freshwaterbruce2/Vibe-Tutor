/**
 * Jamendo API Service - Legal music search and download
 * Free Creative Commons music: 500,000+ tracks
 * API Docs: https://developer.jamendo.com/v3.0/docs
 *
 * Features optimized for neurodivergent learners:
 * - Smart genre categorization (anime, EDM, lo-fi study music, etc.)
 * - Curated playlists for specific activities (homework, breaks, focus)
 * - Simple search with keyword-to-genre mapping
 * - Android-optimized with CapacitorHttp
 */

import { CapacitorHttp } from '@capacitor/core';
import type { JamendoTrack as JamendoTrackType, LocalTrack } from '../types';

// Re-export type from types.ts
export type { JamendoTrackType as JamendoTrack };

export interface JamendoSearchResult {
  results: JamendoTrackType[];
  headers: {
    results_count: number;
    results_fullcount: number;
    status: string;
  };
}

const JAMENDO_API_BASE = 'https://api.jamendo.com/v3.0';

// Genre/Tag mappings for neurodivergent-friendly music discovery
export const JAMENDO_GENRES = {
  anime: ['anime', 'japanese', 'oriental', 'soundtrack', 'instrumental'],
  edm: ['electronic', 'dance', 'techno', 'trance', 'house', 'dubstep'],
  lofi: ['chillout', 'lounge', 'ambient', 'downtempo', 'relaxation'],
  christian: ['world', 'spiritual', 'classical', 'peaceful'], // Note: Limited explicit Christian tagging on Jamendo
  classical: ['classical', 'piano', 'orchestral', 'instrumental'],
  study: ['ambient', 'instrumental', 'classical', 'focus', 'concentration'],
} as const;

export type JamendoGenreCategory = keyof typeof JAMENDO_GENRES;

// Usage tracking for rate limit monitoring (35,000 requests/month)
let requestCount = 0;
let requestResetDate = new Date();

// Load saved usage data from localStorage
try {
  const savedCount = localStorage.getItem('jamendo_request_count');
  const savedResetDate = localStorage.getItem('jamendo_request_reset_date');

  if (savedCount) requestCount = parseInt(savedCount, 10);
  if (savedResetDate) requestResetDate = new Date(savedResetDate);

  // Reset if new month
  const today = new Date();
  if (today.getMonth() !== requestResetDate.getMonth()) {
    requestCount = 0;
    requestResetDate = today;
    localStorage.setItem('jamendo_request_count', '0');
    localStorage.setItem('jamendo_request_reset_date', today.toISOString());
  }
} catch (error) {
  console.warn('[Jamendo] Failed to load usage stats from localStorage');
}

// Track API usage
function incrementRequestCount() {
  requestCount++;
  localStorage.setItem('jamendo_request_count', requestCount.toString());
  localStorage.setItem('jamendo_request_reset_date', requestResetDate.toISOString());
}

export function getUsageStats() {
  return {
    requestsThisMonth: requestCount,
    monthlyLimit: 35000,
    remainingRequests: 35000 - requestCount,
    resetDate: requestResetDate,
  };
}

// Get client ID from environment variable
const getClientId = (): string => {
  const clientId = import.meta.env.VITE_JAMENDO_CLIENT_ID;

  if (!clientId || clientId === 'YOUR_CLIENT_ID') {
    console.error('[Jamendo] No valid API client ID found. Please add VITE_JAMENDO_CLIENT_ID to .env file');
    throw new Error('Jamendo API key not configured. Please add VITE_JAMENDO_CLIENT_ID to .env file');
  }

  console.log('[Jamendo] Using client ID:', clientId.substring(0, 8) + '...');
  return clientId;
};

/**
 * Search for tracks on Jamendo
 * @param query - Search term (e.g., "Christian worship", "anime", "classical piano")
 * @param options - Search options
 * @returns Promise with search results
 */
export const searchTracks = async (
  query: string,
  options: {
    limit?: number;
    offset?: number;
    tags?: string; // e.g., "worship", "piano", "anime"
    genre?: string; // e.g., "christian", "electronic", "classical"
  } = {}
): Promise<JamendoSearchResult> => {
  const clientId = getClientId();

  const params = new URLSearchParams({
    client_id: clientId,
    format: 'json',
    limit: String(options.limit || 20),
    offset: String(options.offset || 0),
    audioformat: 'mp31', // MP3 128kbps format
    include: 'musicinfo licenses', // Include music metadata
    namesearch: query // FIXED: Use namesearch instead of search
  });

  // Add optional filters
  if (options.tags) {
    params.append('tags', options.tags);
  }

  if (options.genre) {
    params.append('fuzzytags', options.genre);
  }

  try {
    const apiUrl = `${JAMENDO_API_BASE}/tracks/?${params.toString()}`;
    console.log('[Jamendo] API Request URL:', apiUrl);

    incrementRequestCount(); // Track API usage

    // Use CapacitorHttp for Android compatibility
    const response = await CapacitorHttp.request({
      url: apiUrl,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (response.status !== 200) {
      throw new Error(`Jamendo API error: ${response.status}`);
    }

    const data: JamendoSearchResult = response.data;

    console.log('[Jamendo] API Response:', data);
    console.log(`[Jamendo] Found ${data.results?.length || 0} tracks for "${query}"`);

    // Check if we got valid results
    if (!data.results || !Array.isArray(data.results)) {
      console.error('[Jamendo] Invalid response format:', data);
      throw new Error('Invalid API response format');
    }

    // If no results and tags were used, try again without tags
    if (data.results.length === 0 && (options.tags || options.genre)) {
      console.log('[Jamendo] No results with tags, retrying without filters...');
      return searchTracks(query, { limit: options.limit, offset: options.offset });
    }

    return data;
  } catch (error: any) {
    console.error('[Jamendo] Search failed:', error);
    throw new Error(`Failed to search music: ${error.message}`);
  }
};

/**
 * Get track details by ID
 * @param trackId - Jamendo track ID
 * @returns Promise with track details
 */
export const getTrackById = async (trackId: string): Promise<JamendoTrackType | null> => {
  const clientId = getClientId();

  const params = new URLSearchParams({
    client_id: clientId,
    format: 'json',
    id: trackId,
    audioformat: 'mp31'
  });

  try {
    incrementRequestCount();
    const response = await CapacitorHttp.request({
      url: `${JAMENDO_API_BASE}/tracks/?${params.toString()}`,
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    });

    if (response.status !== 200) {
      throw new Error(`Jamendo API error: ${response.status}`);
    }

    const data: JamendoSearchResult = response.data;
    return data.results.length > 0 ? data.results[0] : null;
  } catch (error: any) {
    console.error('[Jamendo] Get track failed:', error);
    return null;
  }
};

/**
 * Search tracks by genre/mood
 * @param genre - Genre tag (e.g., "christian", "anime", "classical")
 * @param limit - Number of results (default: 20)
 * @returns Promise with search results
 */
export const searchByGenre = async (
  genre: string,
  limit: number = 20
): Promise<JamendoSearchResult> => {
  return searchTracks('', {
    limit,
    tags: genre
  });
};

/**
 * Get popular tracks
 * @param limit - Number of results (default: 20)
 * @returns Promise with popular tracks
 */
export const getPopularTracks = async (
  limit: number = 20
): Promise<JamendoSearchResult> => {
  const clientId = getClientId();

  const params = new URLSearchParams({
    client_id: clientId,
    format: 'json',
    limit: String(limit),
    order: 'popularity_total', // Most popular
    audioformat: 'mp31'
  });

  try {
    incrementRequestCount();
    const response = await CapacitorHttp.request({
      url: `${JAMENDO_API_BASE}/tracks/?${params.toString()}`,
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    });

    if (response.status !== 200) {
      throw new Error(`Jamendo API error: ${response.status}`);
    }

    return response.data;
  } catch (error: any) {
    console.error('[Jamendo] Get popular tracks failed:', error);
    throw new Error(`Failed to get popular tracks: ${error.message}`);
  }
};

/**
 * Format duration from seconds to MM:SS
 * @param seconds - Duration in seconds
 * @returns Formatted string (e.g., "3:42")
 */
export const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Convert JamendoTrack to LocalTrack format for download
 * @param jamendoTrack - Jamendo track object
 * @returns LocalTrack compatible object
 */
export const convertToLocalTrack = (jamendoTrack: JamendoTrackType): LocalTrack => {
  return {
    id: `jamendo-${jamendoTrack.id}`,
    name: jamendoTrack.name,
    artist: jamendoTrack.artist_name,
    downloadUrl: jamendoTrack.audiodownload,
    downloadStatus: 'pending' as const,
    downloadProgress: 0,
    createdAt: Date.now(),
    albumArt: jamendoTrack.image, // Album art URL
    duration: jamendoTrack.duration,
    metadata: {
      title: jamendoTrack.name,
      artist: jamendoTrack.artist_name,
      album: jamendoTrack.album_name,
      year: parseInt(jamendoTrack.releasedate.split('-')[0]),
      duration: jamendoTrack.duration,
    },
  };
};

/**
 * Browse tracks by neurodivergent-friendly genre category
 * @param category - Genre category (anime, edm, lofi, christian, classical, study)
 * @param limit - Number of results (default: 20)
 * @returns Promise with tracks
 */
export const browseByGenre = async (
  category: JamendoGenreCategory,
  limit: number = 20
): Promise<JamendoSearchResult> => {
  const tags = JAMENDO_GENRES[category];
  const tagsQuery = tags.join('+'); // Join with + for OR logic

  console.log(`[Jamendo] Browsing ${category} genre with tags: ${tagsQuery}`);

  return searchTracks('', {
    tags: tagsQuery,
    limit,
  });
};

/**
 * Smart search with keyword-to-genre mapping for neurodivergent users
 * Handles simple queries like "calm music" or "upbeat studying"
 * @param userQuery - User's search query
 * @param limit - Number of results (default: 20)
 * @returns Promise with search results
 */
export const smartSearch = async (
  userQuery: string,
  limit: number = 20
): Promise<JamendoSearchResult> => {
  const query = userQuery.toLowerCase().trim();

  // Keyword-to-genre mapping
  const keywordMap: Record<string, JamendoGenreCategory> = {
    'anime': 'anime',
    'japanese': 'anime',
    'edm': 'edm',
    'electronic': 'edm',
    'techno': 'edm',
    'dance': 'edm',
    'chill': 'lofi',
    'calm': 'lofi',
    'relax': 'lofi',
    'study': 'study',
    'focus': 'study',
    'concentration': 'study',
    'homework': 'study',
    'classical': 'classical',
    'piano': 'classical',
    'orchestral': 'classical',
    'worship': 'christian',
    'spiritual': 'christian',
    'christian': 'christian',
  };

  // Check if query matches a known keyword
  for (const [keyword, category] of Object.entries(keywordMap)) {
    if (query.includes(keyword)) {
      console.log(`[Jamendo] Smart search: "${query}" → ${category} genre`);
      return browseByGenre(category, limit);
    }
  }

  // Otherwise, do a general search
  console.log(`[Jamendo] Smart search: "${query}" → general search`);
  return searchTracks(userQuery, { limit });
};

/**
 * Get curated playlists for specific activities
 * Optimized for neurodivergent learning contexts
 * @param activity - Activity type (homework, break, morning, evening, focus)
 * @param limit - Number of results (default: 15)
 * @returns Promise with curated tracks
 */
export const getCuratedPlaylist = async (
  activity: 'homework' | 'break' | 'morning' | 'evening' | 'focus',
  limit: number = 15
): Promise<JamendoSearchResult> => {
  const activityMap: Record<typeof activity, JamendoGenreCategory> = {
    homework: 'study',
    break: 'lofi',
    morning: 'classical',
    evening: 'lofi',
    focus: 'study',
  };

  const category = activityMap[activity];
  console.log(`[Jamendo] Getting curated playlist for ${activity} activity (${category} genre)`);

  return browseByGenre(category, limit);
};

/**
 * Validate Jamendo API configuration
 * @returns True if API is properly configured
 */
export const isJamendoConfigured = (): boolean => {
  try {
    const clientId = import.meta.env.VITE_JAMENDO_CLIENT_ID;
    return clientId && clientId !== 'YOUR_CLIENT_ID' && clientId.length > 0;
  } catch {
    return false;
  }
};
