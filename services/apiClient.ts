/**
 * Vibe-Tutor API Client
 *
 * Simple HTTP client for persisting state to the backend unified database.
 * Handles game sessions, progress tracking, and user preferences.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:9001';

interface GameSession {
  gameType: string;
  subject?: string;
  score: number;
  stars: number;
  timeSpent: number;
  data?: any;
}

interface ProgressMetric {
  userId: string;
  category: string;
  metricName: string;
  metricValue: any;
}

interface UserPreferences {
  userId: string;
  preferences: any;
}

// Helper for fetch requests
async function fetchJSON<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('[API Client] Error:', error);
    throw error;
  }
}

// ==================== Game Sessions ====================

export async function saveGameSession(session: GameSession): Promise<{ success: boolean; sessionId: string }> {
  return fetchJSON(`${API_BASE_URL}/api/vibetutor/sessions`, {
    method: 'POST',
    body: JSON.stringify(session),
  });
}

export async function getGameSessions(filters?: {
  gameType?: string;
  subject?: string;
  limit?: number;
  offset?: number;
}): Promise<{ success: boolean; sessions: any[]; count: number }> {
  const params = new URLSearchParams();
  if (filters?.gameType) params.set('gameType', filters.gameType);
  if (filters?.subject) params.set('subject', filters.subject);
  if (filters?.limit) params.set('limit', filters.limit.toString());
  if (filters?.offset) params.set('offset', filters.offset.toString());

  const url = `${API_BASE_URL}/api/vibetutor/sessions?${params.toString()}`;
  return fetchJSON(url);
}

export async function getSessionStats(filters?: {
  gameType?: string;
  subject?: string;
}): Promise<{ success: boolean; stats: any[] }> {
  const params = new URLSearchParams();
  if (filters?.gameType) params.set('gameType', filters.gameType);
  if (filters?.subject) params.set('subject', filters.subject);

  const url = `${API_BASE_URL}/api/vibetutor/sessions/stats?${params.toString()}`;
  return fetchJSON(url);
}

// ==================== Progress Tracking ====================

export async function recordProgress(progress: ProgressMetric): Promise<{ success: boolean }> {
  return fetchJSON(`${API_BASE_URL}/api/vibetutor/progress`, {
    method: 'POST',
    body: JSON.stringify(progress),
  });
}

export async function getProgress(
  userId: string,
  category?: string
): Promise<{ success: boolean; progress: any[] }> {
  const params = new URLSearchParams();
  if (category) params.set('category', category);

  const url = `${API_BASE_URL}/api/vibetutor/progress/${userId}?${params.toString()}`;
  return fetchJSON(url);
}

// ==================== Preferences ====================

export async function savePreferences(prefs: UserPreferences): Promise<{ success: boolean }> {
  return fetchJSON(`${API_BASE_URL}/api/vibetutor/preferences`, {
    method: 'POST',
    body: JSON.stringify(prefs),
  });
}

export async function getPreferences(
  userId: string
): Promise<{ success: boolean; preferences: any; updatedAt: string }> {
  return fetchJSON(`${API_BASE_URL}/api/vibetutor/preferences/${userId}`);
}

// ==================== Health Check ====================

export async function checkHealth(): Promise<{ success: boolean; status: string }> {
  return fetchJSON(`${API_BASE_URL}/api/vibetutor/health`);
}

// ==================== Error Handling ====================

// Wrapper with graceful degradation
export async function safeApiCall<T>(
  apiCall: () => Promise<T>,
  fallback: T
): Promise<T> {
  try {
    return await apiCall();
  } catch (error) {
    console.warn('[API Client] API call failed, using fallback:', error);
    return fallback;
  }
}
