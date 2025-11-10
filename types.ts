import type { FC, SVGProps } from 'react';

export interface HomeworkItem {
  id: string;
  subject: string;
  title: string;
  dueDate: string; // YYYY-MM-DD
  completed: boolean;
  completedDate?: number; // Timestamp when task was completed
}

export interface ParsedHomework {
  subject: string;
  title: string;
  dueDate: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
  timestamp: number;
}

export type View = 'dashboard' | 'tutor' | 'friend' | 'achievements' | 'parent' | 'music' | 'sensory' | 'focus' | 'cards' | 'obbies';

export interface Achievement {
    id: string;
    name: string;
    description: string;
    unlocked: boolean;
    icon: FC<SVGProps<SVGSVGElement>>;
    goal?: number;
    progress?: number;
}

export interface Reward {
  id: string;
  name: string;
  cost: number;
}

export interface ClaimedReward extends Reward {
    claimedDate: number;
}

export type Mood = 'awful' | 'bad' | 'okay' | 'good' | 'great';

export interface MoodEntry {
    mood: Mood;
    note: string;
    timestamp: number;
}

// Music Library Types
export type DownloadStatus = 'pending' | 'downloading' | 'completed' | 'failed' | 'paused';

export interface MusicPlaylist {
  id: string;
  name: string;
  platform: 'spotify' | 'youtube' | 'local';
  url?: string; // For Spotify/YouTube embeds
  embedCode?: string;
  createdAt: number;
}

export interface LocalTrack {
  id: string;
  name: string;
  artist?: string;
  downloadUrl: string; // Original URL for download
  localPath?: string; // Local file path after download
  fileSize?: number; // Size in bytes
  duration?: number; // Duration in seconds
  downloadStatus: DownloadStatus;
  downloadProgress?: number; // 0-100
  createdAt: number;
  lastPlayedAt?: number;
  // Metadata extracted from MP3 tags
  metadata?: {
    title?: string;
    artist?: string;
    album?: string;
    year?: number;
    genre?: string[];
    duration?: number;
  };
  albumArt?: string; // Base64 encoded album art image
}

// Curated music library
export interface CuratedTrack {
  id: string;
  name: string;
  artist: string;
  category: 'anime' | 'christian' | 'lofi' | 'classical';
  downloadUrl: string;
  description?: string;
  estimatedSize?: string; // Human-readable (e.g., "3.5 MB")
}

// Internet radio streaming
export interface RadioStation {
  id: string;
  name: string;
  genre: string;
  streamUrl: string;
  fallbackUrls?: string[]; // Alternative stream URLs to try if primary fails
  description?: string;
  isPlaying?: boolean;
}

// Sensory preferences for neurodivergent support
export interface SensoryPreferences {
  animationSpeed: 'none' | 'reduced' | 'normal';
  soundEnabled: boolean;
  hapticEnabled: boolean;
  fontSize: 'small' | 'medium' | 'large';
  dyslexiaFont: boolean;
  colorMode: 'default' | 'high-contrast' | 'warm' | 'cool';
}

// Focus Timer / Pomodoro
export interface FocusSession {
  id: string;
  startTime: number;
  endTime?: number;
  duration: number; // minutes
  completed: boolean;
}

// Daily/Weekly Goals
export interface Goal {
  id: string;
  type: 'daily' | 'weekly';
  category: 'focus' | 'tasks' | 'points';
  target: number;
  current: number;
  startDate: number;
  endDate: number;
  completed: boolean;
}

// Subject Cards (Gamification) - Enhanced with Worksheet System
export type SubjectType = 'Math' | 'Science' | 'History' | 'Bible' | 'Language Arts';
export type CardLevel = 'Basic' | 'Advanced' | 'Master';
export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert' | 'Master';
export type QuestionType = 'multiple-choice' | 'fill-blank' | 'true-false' | 'matching';

export interface SubjectCard {
  id: string;
  subject: SubjectType;
  level: CardLevel;
  xp: number;
  xpToNextLevel: number;
  homeworkCompleted: number;
  shiny: boolean;
  unlockedAt: number;
  lastEvolved?: number;
}

// Interactive Worksheet System
export interface WorksheetQuestion {
  id: string;
  subject: SubjectType;
  difficulty: DifficultyLevel;
  type: QuestionType;
  question: string;
  options?: string[]; // For multiple-choice
  correctAnswer: string | number; // Index for multiple-choice, string for fill-blank
  explanation?: string;
  points?: number; // Optional: points for this question
}

export interface WorksheetSession {
  id: string;
  subject: SubjectType;
  difficulty: DifficultyLevel;
  questions: WorksheetQuestion[];
  answers: (string | number | null)[]; // Student's answers
  score?: number; // Percentage (0-100)
  starsEarned?: number; // 0-5 stars
  completedAt?: number; // Timestamp
  timeSpent?: number; // Seconds
}

export interface SubjectProgress {
  subject: SubjectType;
  currentDifficulty: DifficultyLevel;
  starsCollected: number; // 0-4 (5th star triggers level up)
  totalWorksheetsCompleted: number;
  averageScore: number;
  bestScore: number;
  currentStreak: number; // Consecutive worksheets with 3+ stars
  history: WorksheetSession[];
  unlockedAt: number;
}

// Roblox-style Obbies (Daily Challenges)
export type ObbyType = 'math' | 'science' | 'word' | 'history';

export interface ObbyChallenge {
  id: string;
  type: ObbyType;
  question: string;
  options: string[];
  correctAnswer: number; // Index of correct option
  difficulty: 'easy' | 'medium' | 'hard';
  pointsReward: number;
}

export interface ObbySession {
  challenges: ObbyChallenge[];
  currentIndex: number;
  score: number;
  lives: number;
  completedToday: boolean;
  startedAt?: number;
  completedAt?: number;
}