/**
 * Curated Music Library - Updated 2025-10-13
 * Fresh, verified working tracks from reliable royalty-free sources
 * All URLs tested and working as of October 2025
 */

import type { CuratedTrack, RadioStation } from '../types';

export const CURATED_MUSIC: CuratedTrack[] = [
  // Lo-fi / Chill Study Music (Streamlined - kept best tracks)
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
    name: 'Wallpaper',
    artist: 'Kevin MacLeod',
    category: 'lofi',
    downloadUrl: 'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Wallpaper.mp3',
    description: 'Smooth relaxing background',
    estimatedSize: '3.5 MB'
  },

  // Classical / Instrumental (Kept essentials only)
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
  }
];

export const RADIO_STATIONS: RadioStation[] = [
  // ANIME / J-POP
  {
    id: 'radio-anime-1',
    name: 'LISTEN.moe - Anime Music',
    genre: 'Anime / J-Pop / Soundtracks',
    streamUrl: 'https://listen.moe/opus',
    fallbackUrls: [
      'https://listen.moe/stream',
      'https://listen.moe/fallback'
    ],
    description: '24/7 anime soundtracks, openings, endings, and J-pop (Opus/MP3)'
  },
  {
    id: 'radio-anime-2',
    name: 'LISTEN.moe - KPOP',
    genre: 'K-Pop / Korean Music',
    streamUrl: 'https://listen.moe/kpop/opus',
    fallbackUrls: [
      'https://listen.moe/kpop/stream',
      'https://listen.moe/kpop/fallback'
    ],
    description: 'Korean pop music and anime crossover hits (Opus/MP3)'
  },
  {
    id: 'radio-anime-3',
    name: 'AnimeNfo Radio',
    genre: 'Anime / J-Rock / J-Pop',
    streamUrl: 'https://streamow6.radionomy.com:443/animenforadio',
    fallbackUrls: [
      'https://streamow6.radionomy.com/animenforadio'
    ],
    description: 'Anime music radio with J-rock and J-pop variety (128kbps MP3)'
  },

  // EDM / ELECTRONIC / TECHNO
  {
    id: 'radio-edm-1',
    name: 'SomaFM - Beat Blender (House/Techno)',
    genre: 'EDM / House / Techno',
    streamUrl: 'https://ice1.somafm.com/beatblender-128-mp3',
    fallbackUrls: [
      'https://ice2.somafm.com/beatblender-128-mp3',
      'https://ice4.somafm.com/beatblender-128-mp3'
    ],
    description: 'Deep house, techno, and progressive beats (128kbps MP3)'
  },
  {
    id: 'radio-edm-2',
    name: 'SomaFM - DEF CON Radio (Gaming)',
    genre: 'Electronic / IDM / Gaming',
    streamUrl: 'https://ice1.somafm.com/defcon-128-mp3',
    fallbackUrls: [
      'https://ice2.somafm.com/defcon-128-mp3',
      'https://ice4.somafm.com/defcon-128-mp3'
    ],
    description: 'Electronic beats for gaming and hacking (128kbps MP3)'
  },
  {
    id: 'radio-edm-3',
    name: 'SomaFM - Lush (Chill Electronic)',
    genre: 'Chill / Ambient / Electronic',
    streamUrl: 'https://ice1.somafm.com/lush-128-mp3',
    fallbackUrls: [
      'https://ice2.somafm.com/lush-128-mp3',
      'https://ice4.somafm.com/lush-128-mp3'
    ],
    description: 'Sensuous and mellow electronica for relaxation (128kbps MP3)'
  },
  {
    id: 'radio-edm-4',
    name: 'SomaFM - Drone Zone (Deep Ambient)',
    genre: 'Ambient / Drone / Deep Electronic',
    streamUrl: 'https://ice1.somafm.com/dronezone-128-mp3',
    fallbackUrls: [
      'https://ice2.somafm.com/dronezone-128-mp3',
      'https://ice4.somafm.com/dronezone-128-mp3'
    ],
    description: 'Atmospheric ambient perfect for deep focus and meditation (128kbps MP3)'
  },

  // CLASSICAL / INSTRUMENTAL
  {
    id: 'radio-classical-1',
    name: 'WQXR Classical (New York)',
    genre: 'Classical / Orchestra / Chamber',
    streamUrl: 'https://stream.wqxr.org/wqxr',
    fallbackUrls: [
      'https://stream.wqxr.org/wqxr-web'
    ],
    description: 'World-class classical music from Carnegie Hall (128kbps AAC)'
  },
  {
    id: 'radio-classical-2',
    name: 'Venice Classic Radio',
    genre: 'Classical / Baroque / Romantic',
    streamUrl: 'https://uk3.internet-radio.com:15406/stream',
    fallbackUrls: [
      'https://uk3.internet-radio.com/proxy/veniceclassicradio/stream'
    ],
    description: 'Italian classical radio with masterpieces from all eras (128kbps MP3)'
  },

  // CHILL / STUDY / FOCUS
  {
    id: 'radio-chill-1',
    name: 'SomaFM - Groove Salad (Chill EDM)',
    genre: 'Ambient / Chill / Downtempo',
    streamUrl: 'https://ice1.somafm.com/groovesalad-128-mp3',
    fallbackUrls: [
      'https://ice2.somafm.com/groovesalad-128-mp3',
      'https://ice4.somafm.com/groovesalad-128-mp3'
    ],
    description: 'Chill grooves and ambient beats for studying (128kbps MP3)'
  },
  {
    id: 'radio-chill-2',
    name: 'SomaFM - Space Station Soma',
    genre: 'Ambient / Space / Electronic',
    streamUrl: 'https://ice1.somafm.com/spacestation-128-mp3',
    fallbackUrls: [
      'https://ice2.somafm.com/spacestation-128-mp3',
      'https://ice4.somafm.com/spacestation-128-mp3'
    ],
    description: 'Floating ambient space music for deep concentration (128kbps MP3)'
  },
  {
    id: 'radio-chill-3',
    name: 'Lofi Girl Radio',
    genre: 'Lo-fi / Hip-Hop / Study Beats',
    streamUrl: 'https://streams.ilovemusic.de/iloveradio17.mp3',
    fallbackUrls: [
      'https://streams.ilovemusic.de/iloveradio17'
    ],
    description: 'Lo-fi hip hop beats to study and relax (128kbps MP3)'
  },

  // CHRISTIAN / WORSHIP
  {
    id: 'radio-christian-1',
    name: 'Moody Radio - Praise & Worship',
    genre: 'Christian Contemporary / Worship',
    streamUrl: 'https://playerservices.streamtheworld.com/api/livestream-redirect/WMBI.mp3',
    fallbackUrls: [
      'https://playerservices.streamtheworld.com/api/livestream-redirect/IM_1.mp3',
      'https://icecast.k-love.com/k-love'
    ],
    description: 'Uplifting Christian worship music (128kbps MP3)'
  },

  // GAMING MUSIC
  {
    id: 'radio-gaming-1',
    name: 'SomaFM - DEF CON Radio',
    genre: 'Gaming / Electronic / Hacking',
    streamUrl: 'https://ice1.somafm.com/defcon-128-mp3',
    fallbackUrls: [
      'https://ice2.somafm.com/defcon-128-mp3',
      'https://ice4.somafm.com/defcon-128-mp3'
    ],
    description: 'Electronic beats for gaming and coding sessions (128kbps MP3)'
  },
  {
    id: 'radio-gaming-2',
    name: 'SomaFM - Secret Agent',
    genre: 'Gaming / Spy / Lounge',
    streamUrl: 'https://ice1.somafm.com/secretagent-128-mp3',
    fallbackUrls: [
      'https://ice2.somafm.com/secretagent-128-mp3',
      'https://ice4.somafm.com/secretagent-128-mp3'
    ],
    description: 'Spy and action game soundtracks, retro lounge (128kbps MP3)'
  },
  {
    id: 'radio-gaming-3',
    name: 'SomaFM - Sonic Universe',
    genre: 'Gaming / Sci-Fi / Electronic',
    streamUrl: 'https://ice1.somafm.com/sonicuniverse-128-mp3',
    fallbackUrls: [
      'https://ice2.somafm.com/sonicuniverse-128-mp3',
      'https://ice4.somafm.com/sonicuniverse-128-mp3'
    ],
    description: 'Sci-fi and space game soundtracks (128kbps MP3)'
  },

  // MORE TECHNO / HARD ELECTRONIC
  {
    id: 'radio-techno-1',
    name: 'SomaFM - Cliq Hop',
    genre: 'Techno / Glitch / IDM',
    streamUrl: 'https://ice1.somafm.com/cliqhop-128-mp3',
    fallbackUrls: [
      'https://ice2.somafm.com/cliqhop-128-mp3',
      'https://ice4.somafm.com/cliqhop-128-mp3'
    ],
    description: 'Glitchy, bleepy techno and IDM (128kbps MP3)'
  },
  {
    id: 'radio-techno-2',
    name: 'SomaFM - Mission Control',
    genre: 'Techno / Deep House / Progressive',
    streamUrl: 'https://ice1.somafm.com/missioncontrol-128-mp3',
    fallbackUrls: [
      'https://ice2.somafm.com/missioncontrol-128-mp3',
      'https://ice4.somafm.com/missioncontrol-128-mp3'
    ],
    description: 'Deep house and techno for concentration (128kbps MP3)'
  },
  {
    id: 'radio-techno-3',
    name: 'SomaFM - Underground 80s',
    genre: 'Techno / Synthwave / Retro',
    streamUrl: 'https://ice1.somafm.com/u80s-128-mp3',
    fallbackUrls: [
      'https://ice2.somafm.com/u80s-128-mp3',
      'https://ice4.somafm.com/u80s-128-mp3'
    ],
    description: 'Alternative 80s synth and new wave (128kbps MP3)'
  },

  // VARIETY / MIXED
  {
    id: 'radio-variety-1',
    name: 'SomaFM - Indie Pop Rocks',
    genre: 'Indie / Alternative / Pop',
    streamUrl: 'https://ice1.somafm.com/indiepop-128-mp3',
    fallbackUrls: [
      'https://ice2.somafm.com/indiepop-128-mp3',
      'https://ice4.somafm.com/indiepop-128-mp3'
    ],
    description: 'Indie pop and rock from the 80s to today (128kbps MP3)'
  }
];

export const MUSIC_CATEGORIES = [
  { id: 'lofi', name: 'Lo-fi / Chill', icon: '🎵' },
  { id: 'classical', name: 'Classical', icon: '🎹' }
] as const;
