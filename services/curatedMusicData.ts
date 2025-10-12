/**
 * Curated Music Library
 * Pre-selected royalty-free music for study sessions
 * Anime-themed music and Christian worship songs
 * All tracks are from legal, free sources (Incompetech, Bensound, Public Domain)
 */

import type { CuratedTrack, RadioStation } from '../types';

export const CURATED_MUSIC: CuratedTrack[] = [
  // Anime-Themed Music
  {
    id: 'anime-1',
    name: 'Sakura Girl',
    artist: 'Kevin MacLeod',
    category: 'anime',
    downloadUrl: 'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Sakura%20Girl.mp3',
    description: 'Upbeat Japanese-style instrumental',
    estimatedSize: '3.8 MB'
  },
  {
    id: 'anime-2',
    name: 'Destiny Day',
    artist: 'Kevin MacLeod',
    category: 'anime',
    downloadUrl: 'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Destiny%20Day.mp3',
    description: 'Epic anime-style orchestral',
    estimatedSize: '4.2 MB'
  },
  {
    id: 'anime-3',
    name: 'Senbazuru',
    artist: 'Kevin MacLeod',
    category: 'anime',
    downloadUrl: 'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Senbazuru.mp3',
    description: 'Traditional Japanese melody',
    estimatedSize: '3.5 MB'
  },
  {
    id: 'anime-4',
    name: 'Koto',
    artist: 'Kevin MacLeod',
    category: 'anime',
    downloadUrl: 'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Koto.mp3',
    description: 'Peaceful koto instrumental',
    estimatedSize: '2.9 MB'
  },
  {
    id: 'anime-5',
    name: 'Carefree',
    artist: 'Kevin MacLeod',
    category: 'anime',
    downloadUrl: 'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Carefree.mp3',
    description: 'Light and cheerful anime vibe',
    estimatedSize: '3.1 MB'
  },
  {
    id: 'anime-6',
    name: 'Enchanted Journey',
    artist: 'Kevin MacLeod',
    category: 'anime',
    downloadUrl: 'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Enchanted%20Journey.mp3',
    description: 'Fantasy adventure theme',
    estimatedSize: '4.5 MB'
  },

  // Christian Worship Songs
  {
    id: 'christian-1',
    name: 'Amazing Grace',
    artist: 'Traditional Hymn',
    category: 'christian',
    downloadUrl: 'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Amazing%20Grace.mp3',
    description: 'Classic worship hymn',
    estimatedSize: '3.2 MB'
  },
  {
    id: 'christian-2',
    name: 'Prelude and Action',
    artist: 'Kevin MacLeod',
    category: 'christian',
    downloadUrl: 'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Prelude%20and%20Action.mp3',
    description: 'Inspiring worship instrumental',
    estimatedSize: '4.8 MB'
  },
  {
    id: 'christian-3',
    name: 'Meditation',
    artist: 'Kevin MacLeod',
    category: 'christian',
    downloadUrl: 'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Meditation.mp3',
    description: 'Peaceful prayer music',
    estimatedSize: '3.6 MB'
  },
  {
    id: 'christian-4',
    name: 'Peaceful',
    artist: 'Kevin MacLeod',
    category: 'christian',
    downloadUrl: 'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Peaceful.mp3',
    description: 'Calm worship atmosphere',
    estimatedSize: '3.9 MB'
  },
  {
    id: 'christian-5',
    name: 'Heartwarming',
    artist: 'Kevin MacLeod',
    category: 'christian',
    downloadUrl: 'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Heartwarming.mp3',
    description: 'Uplifting praise music',
    estimatedSize: '3.4 MB'
  },
  {
    id: 'christian-6',
    name: 'Hope',
    artist: 'Kevin MacLeod',
    category: 'christian',
    downloadUrl: 'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Gregorian%20Chant.mp3',
    description: 'Sacred choral arrangement',
    estimatedSize: '4.1 MB'
  },

  // Lo-fi Study Music (keeping a few)
  {
    id: 'lofi-1',
    name: 'Cute',
    artist: 'Bensound',
    category: 'lofi',
    downloadUrl: 'https://www.bensound.com/bensound-music/bensound-cute.mp3',
    description: 'Gentle piano and guitar',
    estimatedSize: '2.8 MB'
  },
  {
    id: 'lofi-2',
    name: 'Ukulele',
    artist: 'Bensound',
    category: 'lofi',
    downloadUrl: 'https://www.bensound.com/bensound-music/bensound-ukulele.mp3',
    description: 'Happy and light melody',
    estimatedSize: '2.5 MB'
  },

  // Classical / Instrumental (keeping a few)
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
    name: 'Meditation Impromptu',
    artist: 'Kevin MacLeod',
    category: 'classical',
    downloadUrl: 'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Meditation%20Impromptu%2001.mp3',
    description: 'Peaceful meditation music',
    estimatedSize: '3.8 MB'
  }
];

export const RADIO_STATIONS: RadioStation[] = [
  {
    id: 'radio-1',
    name: 'Anime Music Radio',
    genre: 'Anime / J-Pop',
    streamUrl: 'https://stream.zeno.fm/f6d6hnm6k18uv',
    description: '24/7 anime soundtracks and J-pop'
  },
  {
    id: 'radio-2',
    name: 'Christian Radio',
    genre: 'Christian Worship',
    streamUrl: 'https://stream.zeno.fm/3akvtnb9gg8uv',
    description: 'Contemporary Christian music and worship'
  },
  {
    id: 'radio-3',
    name: 'K-Love Radio',
    genre: 'Christian Contemporary',
    streamUrl: 'https://emf.streamguys1.com/klove_aac',
    description: 'Positive, encouraging Christian hits'
  },
  {
    id: 'radio-4',
    name: 'Anime Lounge',
    genre: 'Anime Instrumental',
    streamUrl: 'https://stream.zeno.fm/7aq3nbdwg18uv',
    description: 'Chill anime OST instrumentals'
  },
  {
    id: 'radio-5',
    name: 'Praise & Worship',
    genre: 'Christian Worship',
    streamUrl: 'https://stream.zeno.fm/t54v2rfvgg8uv',
    description: 'Uplifting worship songs'
  },
  {
    id: 'radio-6',
    name: 'Classical Piano',
    genre: 'Classical',
    streamUrl: 'https://stream.zeno.fm/f3wvbbqmdg8uv',
    description: 'Peaceful piano for studying'
  }
];

export const MUSIC_CATEGORIES = [
  { id: 'anime', name: 'Anime Music', icon: '🎌' },
  { id: 'christian', name: 'Christian Worship', icon: '✝️' },
  { id: 'lofi', name: 'Lo-fi / Chill', icon: '🎵' },
  { id: 'classical', name: 'Classical / Instrumental', icon: '🎹' }
] as const;
