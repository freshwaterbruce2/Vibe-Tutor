/**
 * Usage Tracker Service
 * Tracks session starts/stops and provides transparency for parents
 */

import type { UsageSession, DailyUsageSummary } from '../types';

const USAGE_SESSIONS_KEY = 'vibetutor_usage_sessions';
const ACTIVE_SESSION_KEY = 'vibetutor_active_session';

// LocalStorage helpers
function getSessionsFromStorage(): UsageSession[] {
  try {
    const stored = localStorage.getItem(USAGE_SESSIONS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load usage sessions:', error);
    return [];
  }
}

function saveSessionsToStorage(sessions: UsageSession[]): void {
  try {
    localStorage.setItem(USAGE_SESSIONS_KEY, JSON.stringify(sessions));
  } catch (error) {
    console.error('Failed to save usage sessions:', error);
  }
}

function getActiveSession(): string | null {
  return localStorage.getItem(ACTIVE_SESSION_KEY);
}

function setActiveSession(sessionId: string | null): void {
  if (sessionId) {
    localStorage.setItem(ACTIVE_SESSION_KEY, sessionId);
  } else {
    localStorage.removeItem(ACTIVE_SESSION_KEY);
  }
}

// Session management
export function startSession(
  sessionType: UsageSession['sessionType'],
  activityData?: Record<string, any>
): string {
  // End any active session first
  const activeId = getActiveSession();
  if (activeId) {
    endSession(activeId);
  }

  const sessions = getSessionsFromStorage();

  const newSession: UsageSession = {
    id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    sessionType,
    startTime: Date.now(),
    activityData,
  };

  sessions.push(newSession);
  saveSessionsToStorage(sessions);
  setActiveSession(newSession.id);

  return newSession.id;
}

export function endSession(sessionId: string, activityData?: Record<string, any>): boolean {
  const sessions = getSessionsFromStorage();
  const session = sessions.find(s => s.id === sessionId);

  if (!session) return false;

  const endTime = Date.now();
  session.endTime = endTime;
  session.durationSeconds = Math.floor((endTime - session.startTime) / 1000);

  if (activityData) {
    session.activityData = { ...session.activityData, ...activityData };
  }

  saveSessionsToStorage(sessions);

  // Clear active session if it matches
  if (getActiveSession() === sessionId) {
    setActiveSession(null);
  }

  return true;
}

export function getCurrentSession(): UsageSession | null {
  const activeId = getActiveSession();
  if (!activeId) return null;

  const sessions = getSessionsFromStorage();
  return sessions.find(s => s.id === activeId) || null;
}

export function endCurrentSession(activityData?: Record<string, any>): boolean {
  const activeId = getActiveSession();
  if (!activeId) return false;

  return endSession(activeId, activityData);
}

// Query functions
export function getTodaySessions(): UsageSession[] {
  const sessions = getSessionsFromStorage();
  const today = new Date().toDateString();

  return sessions.filter(s => {
    const sessionDate = new Date(s.startTime).toDateString();
    return sessionDate === today;
  });
}

export function getSessionsByDateRange(startDate: Date, endDate: Date): UsageSession[] {
  const sessions = getSessionsFromStorage();

  return sessions.filter(s => {
    const sessionTime = s.startTime;
    return sessionTime >= startDate.getTime() && sessionTime <= endDate.getTime();
  });
}

export function getDailySummary(date?: Date): DailyUsageSummary {
  const targetDate = date || new Date();
  const targetDateStr = targetDate.toDateString();
  const sessions = getSessionsFromStorage();

  const daySessions = sessions.filter(s => {
    const sessionDate = new Date(s.startTime).toDateString();
    return sessionDate === targetDateStr && s.endTime; // Only completed sessions
  });

  const totalSeconds = daySessions.reduce((sum, s) => sum + (s.durationSeconds || 0), 0);
  const totalMinutes = Math.floor(totalSeconds / 60);

  const gameSeconds = daySessions
    .filter(s => s.sessionType === 'game')
    .reduce((sum, s) => sum + (s.durationSeconds || 0), 0);

  const homeworkSeconds = daySessions
    .filter(s => s.sessionType === 'homework')
    .reduce((sum, s) => sum + (s.durationSeconds || 0), 0);

  const scheduleSeconds = daySessions
    .filter(s => s.sessionType === 'schedule')
    .reduce((sum, s) => sum + (s.durationSeconds || 0), 0);

  return {
    date: targetDate.toISOString().split('T')[0],
    totalMinutes,
    gameMinutes: Math.floor(gameSeconds / 60),
    homeworkMinutes: Math.floor(homeworkSeconds / 60),
    scheduleMinutes: Math.floor(scheduleSeconds / 60),
    sessionsCompleted: daySessions.length,
  };
}

export function getWeeklySummary(): DailyUsageSummary[] {
  const summaries: DailyUsageSummary[] = [];
  const today = new Date();

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    summaries.push(getDailySummary(date));
  }

  return summaries;
}

export function getSessionsByType(sessionType: UsageSession['sessionType']): UsageSession[] {
  const sessions = getSessionsFromStorage();
  return sessions.filter(s => s.sessionType === sessionType);
}

export function getTotalTimeByType(sessionType: UsageSession['sessionType'], days = 7): number {
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - days);

  const sessions = getSessionsByDateRange(weekAgo, new Date());
  const typeSessions = sessions.filter(s => s.sessionType === sessionType && s.endTime);

  const totalSeconds = typeSessions.reduce((sum, s) => sum + (s.durationSeconds || 0), 0);
  return Math.floor(totalSeconds / 60); // Return minutes
}

// Cleanup
export function cleanupOldSessions(daysToKeep = 30): void {
  const sessions = getSessionsFromStorage();
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
  const cutoffTime = cutoffDate.getTime();

  const filtered = sessions.filter(s => s.startTime >= cutoffTime);
  saveSessionsToStorage(filtered);
}

// Auto-cleanup on init
cleanupOldSessions(30);
