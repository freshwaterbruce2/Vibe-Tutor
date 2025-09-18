import type { FC, SVGProps } from 'react';

export interface HomeworkItem {
  id: string;
  subject: string;
  title: string;
  dueDate: string; // YYYY-MM-DD
  completed: boolean;
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

export type View = 'dashboard' | 'tutor' | 'friend' | 'focus' | 'achievements' | 'parent';

export interface Achievement {
    id: string;
    name: string;
    description: string;
    unlocked: boolean;
    icon: FC<SVGProps<SVGSVGElement>>;
    goal?: number;
    progress?: number;
}

export type Mood = 'awful' | 'bad' | 'okay' | 'good' | 'great';

export interface MoodEntry {
    mood: Mood;
    note: string;
    timestamp: number;
}
