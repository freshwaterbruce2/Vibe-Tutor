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

export type View = 'dashboard' | 'tutor' | 'friend' | 'achievements' | 'parent' | 'music';

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
  description?: string;
  isPlaying?: boolean;
}