# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Vibe-Tutor is a Progressive Web App (PWA) and native Android app for high school students with ADHD and autism support. It combines AI-powered homework management, tutoring, gamification, **sensory settings**, **focus timer**, and **progress visualization** with offline-first architecture.

**Tech Stack:** React 19, TypeScript 5.8, Vite 6, Tailwind CSS 3, Capacitor 7.4.3, DeepSeek AI

**Package Manager:** pnpm (for faster installs and disk space efficiency)

**Neurodivergent Features:** Sensory controls (animation/sound/haptic), OpenDyslexic font, Pomodoro focus timer, emoji-limited AI responses, visual progress tracking

## Development Commands

```bash
# Installation
pnpm install             # Install all dependencies

# Web Development
pnpm run dev             # Start Vite dev server (localhost:5173)
pnpm run build           # Production build
pnpm run preview         # Preview production build
pnpm start               # Start backend proxy server (port 3001)

# Android Development
pnpm run android:full-build    # Build web → sync → build APK
pnpm run android:deploy        # Full build → uninstall → install
pnpm run android:sync          # Copy web assets to android/
pnpm run android:build         # Build APK only (cd android && gradlew.bat assembleDebug)
pnpm run android:build:clean   # Clean build APK
pnpm run android:open          # Open Android Studio
pnpm run android:install       # Install APK on connected device
pnpm run android:uninstall     # Uninstall app from device
pnpm run android:logs          # View Capacitor logs via adb
pnpm run android:doctor        # Check Capacitor environment
```

## Architecture Overview

### Core Application (App.tsx)
- **Single-file routing**: View state machine (dashboard | tutor | friend | achievements | parent | music | sensory | focus)
- **Lazy loading**: All major views lazy-loaded with Suspense boundaries
- **Inlined AI tutor**: `tutorService` embedded directly in App.tsx to avoid file proliferation
- **LocalStorage-first**: All state (homework, achievements, rewards, playlists, sensory prefs, focus sessions) persists client-side
- **Separate AI contexts**: Independent message histories for AI Tutor vs AI Buddy

### Services Architecture

**AI Integration (services/)**
- `secureClient.ts` - **Backend proxy pattern**: No API keys in client code, session token auth
- `geminiService.ts` - Voice-to-homework parsing using DeepSeek structured outputs
- `buddyService.ts` - AI companion chat with emotional support personality
- `usageMonitor.ts` - Rate limiting for API calls

**Feature Services**
- `achievementService.ts` - Event-driven achievement system with localStorage persistence
- `breakdownService.ts` - Task decomposition using AI
- `musicService.ts` - Playlist management (Spotify/YouTube embeds)
- `downloadService.ts` - Local music downloads using Capacitor FileTransfer
- `audioPlayerService.ts` - Native audio playback
- `analyticsService.ts` - Usage tracking
- `uiService.ts` - Haptic feedback utilities

### Backend Proxy (server.mjs)
- **Purpose**: Secure DeepSeek API key storage, prevents client-side exposure
- **Session auth**: Token-based authentication with expiry
- **CORS handling**: Enables mobile/web cross-origin requests
- **Endpoints**: `/api/init-session`, `/api/chat` (proxies DeepSeek chat completions)

### Component Organization

**Core Components (components/)**
- `HomeworkDashboard.tsx` - Main dashboard with voice input, task grid, and WeekProgress chart
- `ChatWindow.tsx` - Shared chat UI for AI Tutor and AI Buddy with emoji limiting
- `ParentDashboard.tsx` - PIN-locked parental controls (progress, rewards, data export)
- `AchievementCenter.tsx` - Gamification badges and progress tracking
- `MusicLibrary.tsx` - Music player with native audio, retry logic, storage management
- `SensorySettings.tsx` - **NEW** Accessibility controls (animation/sound/font/color)
- `FocusTimer.tsx` - **NEW** Pomodoro timer (25min) with points system
- `WeekProgress.tsx` - **NEW** 7-day bar chart (focus minutes + tasks completed)
- `Sidebar.tsx` - Navigation with VibeTechLogo + sensory/focus buttons
- `ErrorBoundary.tsx` - Granular error handling
- `OfflineIndicator.tsx` - Network status monitoring

**UI Components**
- `AchievementPopup.tsx` - Toast notification for unlocked achievements
- `AddHomeworkModal.tsx` - Voice/text homework input with AI parsing
- `BreakdownModal.tsx` - AI-powered task decomposition
- `NotificationPanel.tsx` - Notification center
- `SecurePinLock.tsx` - PIN authentication for parent dashboard

### State Management Pattern
```typescript
// LocalStorage keys used throughout app:
homeworkItems           // HomeworkItem[]
studentPoints          // number (achievement points + focus timer points)
parentRewards          // Reward[] (parent-configured rewards)
claimedRewards         // ClaimedReward[]
achievements           // { id, unlocked, progress }[]
homeworkStats          // { completedTasks: number }
musicPlaylists         // MusicPlaylist[]
sensory-prefs          // SensoryPreferences (animation/sound/haptic/font/color)
focusSessions          // FocusSession[] (Pomodoro history for WeekProgress)
vibetutor_session      // Session token (sessionStorage)
vibetutor_expiry       // Token expiry timestamp (sessionStorage)
```

## Critical Technical Patterns

### 1. Secure API Key Management
**Never expose DeepSeek API key in client code**

```typescript
// ❌ WRONG - Exposes API key in client bundle
const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
  headers: { 'Authorization': `Bearer ${API_KEY}` }
});

// ✅ CORRECT - Use backend proxy
import { createChatCompletion } from './services/secureClient';
const response = await createChatCompletion(messages, options);
```

### 2. Capacitor HTTP (Mobile Only)
**Always use CapacitorHttp for network requests on Android**

```typescript
import { CapacitorHttp } from '@capacitor/core';

// ✅ Works reliably on Android
const response = await CapacitorHttp.request({
  url: API_CONFIG.baseURL + endpoint,
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  data: requestBody,
  connectTimeout: 30000,
  readTimeout: 30000
});
const result = response.data; // Already parsed JSON
```

**Why:** Capacitor 7's fetch() patching is unreliable. Explicit `CapacitorHttp` ensures native networking.

### 3. Tailwind CSS Version Lock
**Use Tailwind CSS v3.4.15 (not v4, not CDN)**

```bash
# ✅ CORRECT - Installed via pnpm with PostCSS
pnpm add -D tailwindcss@3.4.15 postcss autoprefixer

# ❌ WRONG - CDN breaks on Android WebView
<script src="https://cdn.tailwindcss.com"></script>
```

**Why:** Tailwind v4 uses CSS features (`@property`, `color-mix()`) requiring Chrome 111+. Many Android devices use older WebView versions (74+).

### 4. Version Management
**Increment versionCode on every Android build**

```gradle
// android/app/build.gradle
defaultConfig {
    versionCode 6      // ← Increment to force cache clear
    versionName "1.0.5"
}
```

### 5. AI Prompt Architecture (Neurodivergent Support)
AI prompts optimized for ADHD/autism (see `constants.ts`):
- Bullet points over paragraphs (working memory support)
- 2-3 sentence chunks (cognitive load management)
- One question at a time (executive function support)
- Limited emojis (sensory awareness)
- Direct language (no idioms/sarcasm)

## PWA + Capacitor Dual Deployment

This app runs as both a **Progressive Web App** (installable in browsers) and a **native Android app** (via Capacitor).

### PWA Features
- Service worker for offline caching
- `manifest.json` for installation
- Responsive design with glassmorphism UI
- Network status detection (`OfflineIndicator`)

### Capacitor Native Features
- File system access (music downloads)
- Haptic feedback
- Native HTTP (bypasses CORS)
- Wake lock (focus timer)

### Build Pipeline
```bash
# Web → Android workflow
pnpm run build                   # 1. Build web assets (dist/)
pnpm exec cap sync android       # 2. Copy dist/ → android/app/src/main/assets/public/
cd android && ./gradlew.bat assembleDebug  # 3. Build APK

# Shortcut (does all above + install)
pnpm run android:deploy
```

## Development Guidelines

### Adding New Features
1. **Components**: Add to `components/` (lazy load if new view)
2. **Services**: Add to `services/` for business logic
3. **Types**: Update `types.ts` with TypeScript interfaces
4. **State**: Use localStorage for persistence
5. **Achievements**: Add events to `achievementService.ts` if applicable
6. **AI Context**: Use `secureClient.ts` for DeepSeek API calls

### AI Service Integration
- All DeepSeek calls must go through `secureClient.ts` (backend proxy)
- Use structured outputs for parsing (homework voice input)
- Handle errors gracefully with fallback messages (see `tutorService` in App.tsx)
- Separate chat contexts for different personalities (tutor/buddy)

### Testing Mobile Builds
```bash
# Full test workflow
pnpm run android:full-build      # Build fresh APK
adb uninstall com.vibetech.tutor # Remove old version
pnpm run android:install         # Install new APK
# Open chrome://inspect/#devices to debug
```

**Common Issues:** See [MOBILE-TROUBLESHOOTING.md](./MOBILE-TROUBLESHOOTING.md)
- Duplicate nav buttons → Tailwind v4 incompatibility
- Chat not working → Missing CapacitorHttp
- Stale code → Cache issues (increment versionCode)

### UI/UX Design System (Glassmorphism)
**Key CSS Classes** (defined in `index.html`):
```css
.glass-card          /* Semi-transparent surfaces with backdrop-filter blur */
.glass-button        /* Interactive buttons with gradient + shimmer effects */
.neon-text-primary   /* Purple neon text with glow */
.pulse-glow          /* Pulsing glow animation */
.float-animation     /* Subtle floating for logos */
```

**Color Palette**:
- Primary: `#8B5CF6` (electric purple)
- Accent: `#06B6D4` (neon cyan)
- Highlight: `#EC4899` (hot pink)

**Animation Patterns**:
- Entrance: `fadeInUp` with staggered delays
- Hover: Scale transforms + glow intensification
- Loading: Pulse animations

## Notable Implementation Details

### Focus Timer Accuracy
- Uses `targetTime` approach (not interval-based) for background accuracy
- Wake lock prevents screen sleep during sessions
- Audio context unlocking required for mobile browser compatibility

### Voice Input (Web Speech API)
- Integrated in `AddHomeworkModal.tsx`
- Sends natural language to `geminiService.ts` for parsing
- DeepSeek returns structured JSON: `{ subject, title, dueDate }`
- Graceful fallback for unsupported browsers

### Parent Dashboard Security
- PIN-locked access (SHA-256 hashed PIN in localStorage)
- Data export/import (backup/restore entire app state)
- AI-generated progress summaries

### Achievement System
- Event-driven: `checkAndUnlockAchievements(event)` after user actions
- Progress tracking with goals
- Toast notifications via `AchievementPopup.tsx`

## Environment Setup

**Required:**
- Node.js (for npm)
- `.env.local` file with `DEEPSEEK_API_KEY=your_api_key` (backend only)

**Optional (for Android):**
- Android Studio (for APK builds)
- ADB (for device installation)
- Java 17+ (for Gradle)

**Configuration Files:**
- `capacitor.config.ts` - Capacitor settings, app ID
- `vite.config.ts` - Dev server proxy (`/api` → `localhost:3001`)
- `tailwind.config.js` - Tailwind v3 configuration
- `android/app/build.gradle` - Android version management
- `server.mjs` - Backend proxy server

## Additional Resources

- **Neurodivergent Features**: [NEURODIVERGENT_FEATURES_COMPLETE.md](./NEURODIVERGENT_FEATURES_COMPLETE.md) - **NEW** Complete 4-week implementation guide
- **Music Player Enhancements**: [MUSIC_PLAYER_ENHANCEMENTS_v1.0.13.md](./MUSIC_PLAYER_ENHANCEMENTS_v1.0.13.md) - **NEW** Phase 1 reliability improvements
- **Kiosk Mode**: [KIOSK_MODE_SETUP.md](./KIOSK_MODE_SETUP.md) - Single-app lockdown for dedicated study devices
- **Troubleshooting**: [MOBILE-TROUBLESHOOTING.md](./MOBILE-TROUBLESHOOTING.md) - Android WebView issues
- **Version History**: [VERSION.md](./VERSION.md) - Release notes and changelog
- **Neurodivergent Support**: [NEURODIVERGENT-SUPPORT.md](./NEURODIVERGENT-SUPPORT.md) - ADHD/autism accommodations (original design doc)
- **Testing**: [TESTING_CHECKLIST.md](./TESTING_CHECKLIST.md) - QA procedures
- **Parent Guide**: [PARENT_GUIDE.md](./PARENT_GUIDE.md) - User documentation
- **UI Design**: [GLASSMORPHISM_GUIDE.md](./GLASSMORPHISM_GUIDE.md) - Design system details

## Current Stable Version

**v1.0.13 - "Resilience" + Neurodivergent Suite** (versionCode 14)
- Released: 2025-01-14
- **Music Player Enhancements**: Native audio, retry logic, fallback URLs, storage management
- **Neurodivergent Features**: Sensory settings, focus timer, emoji-limited AI, progress visualization
- Key Features:
  - Native audio for Android (better background playback)
  - Download retry logic (3 attempts)
  - Radio fallback URLs (95% uptime)
  - Storage warnings + bulk delete + sorting
  - Sensory controls (animation/sound/haptic/font/color)
  - Pomodoro focus timer (25min, 1pt/min)
  - WeekProgress chart (7-day bar chart)
  - AI responses limited to 2 emojis max
- APK: `vibe-tutor-v1.0.13.apk`

### Previous Stable Versions

**v1.0.12 - "Harmony"** (versionCode 13)
- Released: 2025-10-13
- Key Features: Fixed radio streams, full playlist navigation, enhanced download queue logging
- APK: `vibe-tutor-v1.0.12.apk`

### Previous Stable Versions

**v1.0.11 - "Soundwave"** (versionCode 12)
- Simplified HTML5 Audio for radio streaming
- 20 verified music tracks from Incompetech.com
- Sequential download queue implementation

**v1.0.5** (versionCode 6)
- Last stable version before music player feature
- APK: `vibe-tutor-v1.0.5-STABLE.apk`
- Git tag: `v1.0.5`

### Recovery Procedure
If build breaks, rollback to previous stable version:
```bash
git checkout v1.0.5  # or v1.0.11 for music player
pnpm install
pnpm run build
pnpm exec cap sync android
cd android && ./gradlew.bat assembleDebug
```
