/**
 * Jamendo API Service - Legal music search and download
 * Free Creative Commons music: 500,000+ tracks
 * API Docs: https://developer.jamendo.com/v3.0/docs
 */

export interface JamendoTrack {
  id: string;
  name: string;
  artist_name: string;
  artist_id: string;
  album_name: string;
  album_id: string;
  duration: number; // in seconds
  image: string; // album art URL
  audio: string; // stream URL (preview)
  audiodownload: string; // MP3 download URL
  license_ccurl: string; // Creative Commons license URL
  releasedate: string;
}

export interface JamendoSearchResult {
  results: JamendoTrack[];
  headers: {
    results_count: number;
    results_fullcount: number;
    status: string;
  };
}

const JAMENDO_API_BASE = 'https://api.jamendo.com/v3.0';

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

    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`Jamendo API error: ${response.status} ${response.statusText}`);
    }

    const data: JamendoSearchResult = await response.json();

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
export const getTrackById = async (trackId: string): Promise<JamendoTrack | null> => {
  const clientId = getClientId();

  const params = new URLSearchParams({
    client_id: clientId,
    format: 'json',
    id: trackId,
    audioformat: 'mp31'
  });

  try {
    const response = await fetch(`${JAMENDO_API_BASE}/tracks/?${params.toString()}`);

    if (!response.ok) {
      throw new Error(`Jamendo API error: ${response.status}`);
    }

    const data: JamendoSearchResult = await response.json();

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
    const response = await fetch(`${JAMENDO_API_BASE}/tracks/?${params.toString()}`);

    if (!response.ok) {
      throw new Error(`Jamendo API error: ${response.status}`);
    }

    return await response.json();
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
export const convertToLocalTrack = (jamendoTrack: JamendoTrack) => {
  return {
    id: `jamendo-${jamendoTrack.id}`,
    name: jamendoTrack.name,
    artist: jamendoTrack.artist_name,
    url: jamendoTrack.audiodownload,
    downloadStatus: 'pending' as const,
    downloadProgress: 0,
    createdAt: Date.now(),
    source: 'jamendo',
    albumArt: jamendoTrack.image,
    duration: jamendoTrack.duration,
    license: jamendoTrack.license_ccurl
  };
};
