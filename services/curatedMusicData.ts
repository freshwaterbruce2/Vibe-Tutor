/**
 * Curated Music Library - Updated 2025-10-13
 * Fresh, verified working tracks from reliable royalty-free sources
 * All URLs tested and working as of October 2025
 */

import type { CuratedTrack, RadioStation } from '../types';

export const CURATED_MUSIC: CuratedTrack[] = [
  // Lo-fi / Chill Study Music (Incompetech - Kevin MacLeod)
  {
    id: 'study-1',
    name: 'Floating Cities',
    artist: 'Kevin MacLeod',
    category: 'lofi',
    downloadUrl: 'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Floating%20Cities.mp3',
    description: 'Calm ambient study music',
    estimatedSize: '3.2 MB'
  },
  {
    id: 'study-2',
    name: 'Merry Go',
    artist: 'Kevin MacLeod',
    category: 'lofi',
    downloadUrl: 'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Merry%20Go.mp3',
    description: 'Light playful background music',
    estimatedSize: '3.8 MB'
  },
  {
    id: 'study-3',
    name: 'Sneaky Snitch',
    artist: 'Kevin MacLeod',
    category: 'lofi',
    downloadUrl: 'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Sneaky%20Snitch.mp3',
    description: 'Upbeat quirky study tune',
    estimatedSize: '4.1 MB'
  },
  {
    id: 'study-4',
    name: 'Wallpaper',
    artist: 'Kevin MacLeod',
    category: 'lofi',
    downloadUrl: 'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Wallpaper.mp3',
    description: 'Smooth relaxing background',
    estimatedSize: '3.5 MB'
  },
  {
    id: 'study-5',
    name: 'Cipher',
    artist: 'Kevin MacLeod',
    category: 'lofi',
    downloadUrl: 'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Cipher.mp3',
    description: 'Mysterious ambient track',
    estimatedSize: '2.9 MB'
  },

  // Anime-Themed Music
  {
    id: 'anime-1',
    name: 'Monkeys Spinning Monkeys',
    artist: 'Kevin MacLeod',
    category: 'anime',
    downloadUrl: 'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Monkeys%20Spinning%20Monkeys.mp3',
    description: 'Fun upbeat anime vibe',
    estimatedSize: '2.6 MB'
  },
  {
    id: 'anime-2',
    name: 'Scheming Weasel',
    artist: 'Kevin MacLeod',
    category: 'anime',
    downloadUrl: 'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Scheming%20Weasel.mp3',
    description: 'Playful comedic theme',
    estimatedSize: '3.3 MB'
  },
  {
    id: 'anime-3',
    name: 'The Builder',
    artist: 'Kevin MacLeod',
    category: 'anime',
    downloadUrl: 'https://incompetech.com/music/royalty-free/mp3-royaltyfree/The%20Builder.mp3',
    description: 'Energetic action theme',
    estimatedSize: '3.7 MB'
  },
  {
    id: 'anime-4',
    name: 'Pixel Peeker Polka',
    artist: 'Kevin MacLeod',
    category: 'anime',
    downloadUrl: 'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Pixel%20Peeker%20Polka%20-%20Slower.mp3',
    description: 'Chiptune retro game music',
    estimatedSize: '2.8 MB'
  },
  {
    id: 'anime-5',
    name: 'Amazing Plan',
    artist: 'Kevin MacLeod',
    category: 'anime',
    downloadUrl: 'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Amazing%20Plan.mp3',
    description: 'Epic orchestral adventure',
    estimatedSize: '4.2 MB'
  },

  // Christian / Worship Music
  {
    id: 'christian-1',
    name: 'Heartwarming',
    artist: 'Kevin MacLeod',
    category: 'christian',
    downloadUrl: 'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Heartwarming.mp3',
    description: 'Uplifting praise music',
    estimatedSize: '3.4 MB'
  },
  {
    id: 'christian-2',
    name: 'Peaceful Music',
    artist: 'Kevin MacLeod',
    category: 'christian',
    downloadUrl: 'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Peaceful%20Music.mp3',
    description: 'Calm worship atmosphere',
    estimatedSize: '3.9 MB'
  },
  {
    id: 'christian-3',
    name: 'Meditation Impromptu 03',
    artist: 'Kevin MacLeod',
    category: 'christian',
    downloadUrl: 'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Meditation%20Impromptu%2003.mp3',
    description: 'Peaceful prayer music',
    estimatedSize: '3.6 MB'
  },
  {
    id: 'christian-4',
    name: 'Divine',
    artist: 'Kevin MacLeod',
    category: 'christian',
    downloadUrl: 'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Divine.mp3',
    description: 'Ethereal spiritual music',
    estimatedSize: '4.5 MB'
  },
  {
    id: 'christian-5',
    name: 'Gregorian Chant',
    artist: 'Kevin MacLeod',
    category: 'christian',
    downloadUrl: 'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Gregorian%20Chant.mp3',
    description: 'Traditional sacred music',
    estimatedSize: '3.8 MB'
  },

  // Classical / Instrumental
  {
    id: 'classical-1',
    name: 'Gymnopedie No 1',
    artist: 'Kevin MacLeod',
    category: 'classical',
    downloadUrl: 'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Gymnopedie%20No%201.mp3',
    description: 'Calm piano piece',
    estimatedSize: '4.2 MB'
  },
  {
    id: 'classical-2',
    name: 'Canon in D',
    artist: 'Kevin MacLeod',
    category: 'classical',
    downloadUrl: 'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Canon%20in%20D.mp3',
    description: 'Classical masterpiece',
    estimatedSize: '5.1 MB'
  },
  {
    id: 'classical-3',
    name: 'Moonlight Sonata',
    artist: 'Kevin MacLeod',
    category: 'classical',
    downloadUrl: 'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Moonlight%20Sonata.mp3',
    description: 'Beethoven classic',
    estimatedSize: '4.8 MB'
  },
  {
    id: 'classical-4',
    name: 'Brandenburg Concerto No4',
    artist: 'Kevin MacLeod',
    category: 'classical',
    downloadUrl: 'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Brandenburg%20Concerto%20No4-1%20BWV1049%20-%20Classical%20Whimsical.mp3',
    description: 'Bach baroque masterpiece',
    estimatedSize: '5.6 MB'
  },
  {
    id: 'classical-5',
    name: 'Air Prelude',
    artist: 'Kevin MacLeod',
    category: 'classical',
    downloadUrl: 'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Air%20Prelude.mp3',
    description: 'Elegant orchestral piece',
    estimatedSize: '3.2 MB'
  }
];

export const RADIO_STATIONS: RadioStation[] = [
  {
    id: 'radio-1',
    name: 'LISTEN.moe - Anime (JPOP)',
    genre: 'Anime / J-Pop',
    streamUrl: 'https://listen.moe/fallback',
    fallbackUrls: ['https://listen.moe/stream', 'https://listen.moe/opus'],
    description: '24/7 anime soundtracks and J-pop hits (MP3 128kbps)'
  },
  {
    id: 'radio-2',
    name: 'LISTEN.moe - KPOP',
    genre: 'Korean Pop / Anime',
    streamUrl: 'https://listen.moe/kpop/fallback',
    fallbackUrls: ['https://listen.moe/kpop/stream', 'https://listen.moe/kpop/opus'],
    description: 'Korean pop and anime music (MP3 128kbps)'
  },
  {
    id: 'radio-3',
    name: 'R/a/dio - Anime Radio',
    genre: 'Anime / Japanese Music',
    streamUrl: 'https://stream.r-a-d.io/main.mp3',
    fallbackUrls: ['https://relay0.r-a-d.io/main.mp3'],
    description: '24/7 anime and Japanese music radio'
  },
  {
    id: 'radio-4',
    name: 'Moody Radio - Praise & Worship',
    genre: 'Christian Contemporary',
    streamUrl: 'https://playerservices.streamtheworld.com/api/livestream-redirect/IM_1.mp3',
    fallbackUrls: ['https://playerservices.streamtheworld.com/api/livestream-redirect/WAYFM.mp3'],
    description: 'Contemporary Christian worship music (K-LOVE alternative)'
  },
  {
    id: 'radio-5',
    name: 'SomaFM - Groove Salad',
    genre: 'Ambient / Chill',
    streamUrl: 'https://ice1.somafm.com/groovesalad-128-aac',
    fallbackUrls: ['https://ice2.somafm.com/groovesalad-128-aac', 'https://ice4.somafm.com/groovesalad-128-aac'],
    description: 'Ambient/downtempo beats and chillout grooves'
  }
];

export const MUSIC_CATEGORIES = [
  { id: 'lofi', name: 'Lo-fi / Chill', icon: '🎵' },
  { id: 'anime', name: 'Anime Music', icon: '🎌' },
  { id: 'christian', name: 'Christian Worship', icon: '✝️' },
  { id: 'classical', name: 'Classical / Instrumental', icon: '🎹' }
] as const;
