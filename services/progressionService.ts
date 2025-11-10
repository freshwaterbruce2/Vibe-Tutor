/**
 * Progression Service
 * Manages subject progress, star accumulation, and difficulty level progression
 * Inspired by ABC Mouse step-by-step learning and ABCya grade-level organization
 */

import type { SubjectType, DifficultyLevel, SubjectProgress, WorksheetSession } from '../types';

const STORAGE_KEY = 'subject-progress';
const STARS_TO_LEVEL_UP = 5;

// Difficulty progression order
const DIFFICULTY_ORDER: DifficultyLevel[] = ['Beginner', 'Intermediate', 'Advanced', 'Expert', 'Master'];

// Initialize default progress for all subjects
function createDefaultProgress(): Record<SubjectType, SubjectProgress> {
  const subjects: SubjectType[] = ['Math', 'Science', 'History', 'Bible', 'Language Arts'];
  const now = Date.now();

  return subjects.reduce((acc, subject) => {
    acc[subject] = {
      subject,
      currentDifficulty: 'Beginner',
      starsCollected: 0,
      totalWorksheetsCompleted: 0,
      averageScore: 0,
      bestScore: 0,
      currentStreak: 0,
      history: [],
      unlockedAt: now,
    };
    return acc;
  }, {} as Record<SubjectType, SubjectProgress>);
}

// Load progress from localStorage
export function loadProgress(): Record<SubjectType, SubjectProgress> {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Merge with defaults to handle new subjects
      return { ...createDefaultProgress(), ...parsed };
    }
  } catch (error) {
    console.error('Failed to load progress:', error);
  }
  return createDefaultProgress();
}

// Save progress to localStorage
export function saveProgress(progress: Record<SubjectType, SubjectProgress>): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (error) {
    console.error('Failed to save progress:', error);
  }
}

// Get progress for a specific subject
export function getSubjectProgress(subject: SubjectType): SubjectProgress {
  const allProgress = loadProgress();
  return allProgress[subject];
}

// Record a completed worksheet session
export function recordWorksheetCompletion(
  subject: SubjectType,
  session: WorksheetSession
): {
  progress: SubjectProgress;
  leveledUp: boolean;
  newDifficulty?: DifficultyLevel;
  starsEarned: number;
} {
  const allProgress = loadProgress();
  const subjectProgress = allProgress[subject];

  // Add session to history
  subjectProgress.history.push(session);
  if (subjectProgress.history.length > 50) {
    // Keep only last 50 sessions
    subjectProgress.history = subjectProgress.history.slice(-50);
  }

  // Update statistics
  subjectProgress.totalWorksheetsCompleted += 1;

  const scores = subjectProgress.history.map(s => s.score || 0);
  subjectProgress.averageScore = scores.reduce((a, b) => a + b, 0) / scores.length;
  subjectProgress.bestScore = Math.max(subjectProgress.bestScore, session.score || 0);

  // Update streak (3+ stars)
  const starsEarned = session.starsEarned || 0;
  if (starsEarned >= 3) {
    subjectProgress.currentStreak += 1;
  } else {
    subjectProgress.currentStreak = 0;
  }

  // Add stars
  subjectProgress.starsCollected += starsEarned;

  // Check for level up
  let leveledUp = false;
  let newDifficulty: DifficultyLevel | undefined;

  if (subjectProgress.starsCollected >= STARS_TO_LEVEL_UP) {
    const currentIndex = DIFFICULTY_ORDER.indexOf(subjectProgress.currentDifficulty);
    if (currentIndex < DIFFICULTY_ORDER.length - 1) {
      newDifficulty = DIFFICULTY_ORDER[currentIndex + 1];
      subjectProgress.currentDifficulty = newDifficulty;
      subjectProgress.starsCollected = 0; // Reset stars for new level
      leveledUp = true;
    } else {
      // Already at max level, keep collecting stars
      subjectProgress.starsCollected = STARS_TO_LEVEL_UP;
    }
  }

  // Save progress
  allProgress[subject] = subjectProgress;
  saveProgress(allProgress);

  return {
    progress: subjectProgress,
    leveledUp,
    newDifficulty,
    starsEarned,
  };
}

// Get next difficulty level
export function getNextDifficulty(current: DifficultyLevel): DifficultyLevel | null {
  const currentIndex = DIFFICULTY_ORDER.indexOf(current);
  if (currentIndex >= 0 && currentIndex < DIFFICULTY_ORDER.length - 1) {
    return DIFFICULTY_ORDER[currentIndex + 1];
  }
  return null;
}

// Get progress toward next level (0-1)
export function getProgressToNextLevel(subject: SubjectType): number {
  const progress = getSubjectProgress(subject);
  return progress.starsCollected / STARS_TO_LEVEL_UP;
}

// Reset progress for a subject (for testing or admin use)
export function resetSubjectProgress(subject: SubjectType): void {
  const allProgress = loadProgress();
  allProgress[subject] = createDefaultProgress()[subject];
  saveProgress(allProgress);
}

// Get all progress (for parent dashboard)
export function getAllProgress(): Record<SubjectType, SubjectProgress> {
  return loadProgress();
}

// Get total stars across all subjects
export function getTotalStars(): number {
  const allProgress = loadProgress();
  return Object.values(allProgress).reduce((total, prog) => {
    return total + prog.history.reduce((sum, session) => sum + (session.starsEarned || 0), 0);
  }, 0);
}

// Get total worksheets completed across all subjects
export function getTotalWorksheetsCompleted(): number {
  const allProgress = loadProgress();
  return Object.values(allProgress).reduce((total, prog) => total + prog.totalWorksheetsCompleted, 0);
}

// Complete a worksheet session (convenience function that combines recording and returns UI data)
export function completeWorksheet(session: WorksheetSession): {
  leveledUp: boolean;
  newDifficulty?: DifficultyLevel;
  starsToNextLevel: number;
} {
  const result = recordWorksheetCompletion(session.subject, session);
  const starsToNextLevel = STARS_TO_LEVEL_UP - result.progress.starsCollected;

  return {
    leveledUp: result.leveledUp,
    newDifficulty: result.newDifficulty,
    starsToNextLevel: Math.max(0, starsToNextLevel),
  };
}
