import type { AvatarCharacter } from '../types';
import aiBuddy from '../assets/avatar-ai-buddy.png';
import boyHeadphones from '../assets/avatar-boy-headphones.png';
import calmReader from '../assets/avatar-calm-reader.png';
import girlGlasses from '../assets/avatar-girl-glasses.png';
import teenCap from '../assets/avatar-teen-cap.png';
import teenNeonHair from '../assets/avatar-teen-neon-hair.png';

export const DEFAULT_AVATAR_IMAGE = boyHeadphones;

export const AVATAR_CHARACTERS: AvatarCharacter[] = [
  {
    id: 'avatar-boy-headphones',
    name: 'Focus Gamer',
    imagePath: boyHeadphones,
    fallbackEmoji: '🎧',
    rarity: 'common',
    unlockLevel: 1,
    description: 'A focused gamer ready to learn.',
  },
  {
    id: 'avatar-girl-glasses',
    name: 'Science Star',
    imagePath: girlGlasses,
    fallbackEmoji: '👓',
    rarity: 'common',
    unlockLevel: 1,
    description: 'Sharp eyes, sharper mind.',
  },
  {
    id: 'avatar-teen-cap',
    name: 'Street Scholar',
    imagePath: teenCap,
    fallbackEmoji: '🧢',
    rarity: 'rare',
    unlockLevel: 5,
    description: 'Cool, calm, and knowledgeable.',
  },
  {
    id: 'avatar-teen-neon-hair',
    name: 'Neon Thinker',
    imagePath: teenNeonHair,
    fallbackEmoji: '💡',
    rarity: 'rare',
    unlockLevel: 5,
    description: 'Bright ideas, brighter style.',
  },
  {
    id: 'avatar-ai-buddy',
    name: 'AI Buddy',
    imagePath: aiBuddy,
    fallbackEmoji: '🤖',
    rarity: 'epic',
    unlockLevel: 10,
    description: 'A digital companion for deep learning.',
  },
  {
    id: 'avatar-calm-reader',
    name: 'Calm Reader',
    imagePath: calmReader,
    fallbackEmoji: '📖',
    rarity: 'common',
    unlockLevel: 1,
    description: 'Patient, thoughtful, always learning.',
  },
];
