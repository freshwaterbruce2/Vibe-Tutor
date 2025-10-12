/**
 * Curated Music Library
 * Pre-selected royalty-free music for study sessions
 * All tracks are from legal, free sources (Bensound, Incompetech, FMA)
 */

import type { CuratedTrack, RadioStation } from '../types';

export const CURATED_MUSIC: CuratedTrack[] = [
  // Lo-fi / Chill Beats
  {
    id: 'lofi-1',
    name: 'Sunny',
    artist: 'Bensound',
    category: 'lofi',
    downloadUrl: 'https://www.bensound.com/bensound-music/bensound-sunny.mp3',
    description: 'Upbeat acoustic guitar, perfect for focus',
    estimatedSize: '3.2 MB'
  },
  {
    id: 'lofi-2',
    name: 'Better Days',
    artist: 'Bensound',
    category: 'lofi',
    downloadUrl: 'https://www.bensound.com/bensound-music/bensound-betterdays.mp3',
    description: 'Relaxed beats for studying',
    estimatedSize: '4.1 MB'
  },
  {
    id: 'lofi-3',
    name: 'Cute',
    artist: 'Bensound',
    category: 'lofi',
    downloadUrl: 'https://www.bensound.com/bensound-music/bensound-cute.mp3',
    description: 'Gentle piano and guitar',
    estimatedSize: '2.8 MB'
  },
  {
    id: 'lofi-4',
    name: 'Ukulele',
    artist: 'Bensound',
    category: 'lofi',
    downloadUrl: 'https://www.bensound.com/bensound-music/bensound-ukulele.mp3',
    description: 'Happy and light ukulele melody',
    estimatedSize: '2.5 MB'
  },

  // Classical / Instrumental
  {
    id: 'classical-1',
    name: 'Cipher',
    artist: 'Kevin MacLeod',
    category: 'classical',
    downloadUrl: 'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Cipher.mp3',
    description: 'Mysterious instrumental',
    estimatedSize: '3.6 MB'
  },
  {
    id: 'classical-2',
    name: 'Gymnopedie No 1',
    artist: 'Kevin MacLeod',
    category: 'classical',
    downloadUrl: 'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Gymnopedie%20No%201.mp3',
    description: 'Calm piano piece',
    estimatedSize: '4.2 MB'
  },
  {
    id: 'classical-3',
    name: 'Meditation Impromptu 01',
    artist: 'Kevin MacLeod',
    category: 'classical',
    downloadUrl: 'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Meditation%20Impromptu%2001.mp3',
    description: 'Peaceful meditation music',
    estimatedSize: '3.8 MB'
  },

  // Ambient / Electronic
  {
    id: 'ambient-1',
    name: 'Creative Minds',
    artist: 'Bensound',
    category: 'ambient',
    downloadUrl: 'https://www.bensound.com/bensound-music/bensound-creativeminds.mp3',
    description: 'Inspiring ambient background',
    estimatedSize: '3.4 MB'
  },
  {
    id: 'ambient-2',
    name: 'Acousticbreeze',
    artist: 'Bensound',
    category: 'ambient',
    downloadUrl: 'https://www.bensound.com/bensound-music/bensound-acousticbreeze.mp3',
    description: 'Soft ambient soundscape',
    estimatedSize: '3.9 MB'
  },
  {
    id: 'ambient-3',
    name: 'Relaxing',
    artist: 'Bensound',
    category: 'ambient',
    downloadUrl: 'https://www.bensound.com/bensound-music/bensound-relaxing.mp3',
    description: 'Calm and soothing',
    estimatedSize: '3.2 MB'
  },

  // Nature Sounds (via royalty-free sources)
  {
    id: 'nature-1',
    name: 'Tenderness',
    artist: 'Bensound',
    category: 'nature',
    downloadUrl: 'https://www.bensound.com/bensound-music/bensound-tenderness.mp3',
    description: 'Gentle nature-inspired melody',
    estimatedSize: '2.7 MB'
  },
  {
    id: 'nature-2',
    name: 'A Day To Remember',
    artist: 'Bensound',
    category: 'nature',
    downloadUrl: 'https://www.bensound.com/bensound-music/bensound-adaytoremember.mp3',
    description: 'Peaceful acoustic',
    estimatedSize: '3.5 MB'
  }
];

export const RADIO_STATIONS: RadioStation[] = [
  {
    id: 'radio-1',
    name: 'Lofi Girl Radio',
    genre: 'Lo-fi Hip Hop',
    streamUrl: 'https://streams.fluxfm.de/lofi/mp3-320/streams.fluxfm.de/',
    description: '24/7 chill beats to study/relax to'
  },
  {
    id: 'radio-2',
    name: 'Chillout Radio',
    genre: 'Ambient / Chillout',
    streamUrl: 'https://cast.radiogroup.com.ua:8000/chillout320',
    description: 'Relaxing electronic music'
  },
  {
    id: 'radio-3',
    name: 'Classical Radio',
    genre: 'Classical',
    streamUrl: 'https://stream.zeno.fm/f3wvbbqmdg8uv',
    description: 'Classic compositions for focus'
  },
  {
    id: 'radio-4',
    name: 'Jazz Cafe',
    genre: 'Smooth Jazz',
    streamUrl: 'https://live.amperwave.net/direct/ppm-smooth64-ibc1',
    description: 'Smooth jazz for background study'
  },
  {
    id: 'radio-5',
    name: 'Nature Sounds',
    genre: 'Ambient Nature',
    streamUrl: 'https://streaming.radionomy.com/NatureSounds',
    description: 'Calming nature soundscapes'
  },
  {
    id: 'radio-6',
    name: 'Study Beats',
    genre: 'Instrumental',
    streamUrl: 'https://stream.zeno.fm/y8mb4bmtgg8uv',
    description: 'Instrumental beats perfect for studying'
  }
];

export const MUSIC_CATEGORIES = [
  { id: 'lofi', name: 'Lo-fi / Chill', icon: '🎵' },
  { id: 'classical', name: 'Classical / Instrumental', icon: '🎹' },
  { id: 'ambient', name: 'Ambient / Electronic', icon: '🌊' },
  { id: 'nature', name: 'Nature Sounds', icon: '🌿' }
] as const;
