# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Vibe-Tutor is a Progressive Web App (PWA) designed as an AI-powered homework manager and tutor for high school students. Built with React, TypeScript, and DeepSeek AI (90% cheaper than competitors), it features offline capabilities, achievements, focus timers, and parental controls.

## Development Commands

```bash
# Development
npm run dev          # Start Vite dev server
npm run build        # Build for production
npm run preview      # Preview production build

# Installation
npm install          # Install dependencies
```

## Environment Setup

**Required Environment Variables:**
- `DEEPSEEK_API_KEY`: DeepSeek API key (set in `.env.local`)

The Vite config automatically maps `DEEPSEEK_API_KEY` to `process.env.API_KEY` for the application.

## Architecture Overview

### Core Application Structure
- **App.tsx**: Main application component with view routing, state management, and AI service integration
- **Lazy Loading**: All major views (HomeworkDashboard, ChatWindow, FocusTimer, etc.) are lazy-loaded for performance
- **PWA Features**: Service worker, manifest.json, and offline capabilities
- **Modern UI System**: Glassmorphism design with Vibe-Tech branding and 2025 design trends

### UI/UX Design System (2025 Update)
- **Vibe-Tech Brand Integration**: Custom SVG logo with neon gradients and glow effects
- **Glassmorphism Architecture**: Semi-transparent surfaces with backdrop blur effects
- **Color Palette**: Electric purple (#8B5CF6), neon cyan (#06B6D4), hot pink (#EC4899)
- **Animation System**: Float, pulse, fade-in-up, and shimmer effects
- **Typography**: Neon text effects with gradient backgrounds and glow states

### Key Services (services/)
- **geminiService.ts**: Voice-to-homework parsing using structured DeepSeek AI responses
- **achievementService.ts**: Achievement system with localStorage persistence and progress tracking
- **buddyService.ts**: AI companion chat functionality
- **focusService.ts**: Pomodoro timer with wake lock and background accuracy
- **uiService.ts**: Haptic feedback and UI utilities

### State Management
- **Local Storage Persistence**: All data (homework, achievements, focus stats, rewards) persists in localStorage
- **Event-Driven Achievements**: Achievement system responds to user actions (task completion, focus sessions)
- **Separate AI Chats**: Independent Chat instances for AI Tutor and AI Buddy to maintain conversation context

### Component Organization
- **Modular Components**: Each major feature is a separate component (HomeworkDashboard, ChatWindow, FocusTimer, etc.)
- **Error Boundaries**: Granular error handling to prevent cascading failures
- **Icons**: Custom SVG icon components in components/icons/ with VibeTechLogo featuring brand gradients
- **Progressive Enhancement**: Features gracefully degrade when offline or when APIs fail
- **Glass Components**: Standardized glassmorphism classes (.glass-card, .glass-button) with consistent styling

## Key Technical Patterns

### AI Integration
- **Tutor Service Inlined**: The tutorService is directly embedded in App.tsx to avoid file proliferation
- **Structured AI Responses**: Uses DeepSeek's structured output for homework parsing with JSON schema validation
- **Context Preservation**: Separate Chat instances maintain conversation history for different AI personalities

### PWA Implementation
- **Service Worker**: Caches assets for offline functionality
- **Manifest**: Configures app installation and theming (Vibe-Tech branding with cyan/black theme)
- **Offline Detection**: Real-time network status monitoring with visual indicators

### Data Architecture
- **Homework Items**: Core data structure with id, subject, title, dueDate, completed fields
- **Achievement Events**: Type-safe event system for triggering achievement checks
- **Rewards System**: Parent-configured rewards with point costs and approval workflow

## Development Guidelines

### Adding New Features
1. Create components in `components/` directory
2. Add services to `services/` directory for business logic
3. Update types in `types.ts` for TypeScript interfaces
4. Add achievement events to `achievementService.ts` if applicable
5. Update App.tsx view routing if adding new views

### AI Service Integration
- All DeepSeek AI calls should handle errors gracefully with user-friendly fallbacks
- Use structured outputs when possible for consistent parsing
- Maintain separate chat contexts for different AI personalities (tutor vs buddy)

### Testing Approach
Reference TESTING_CHECKLIST.md for comprehensive testing scenarios including:
- PWA installation and offline functionality
- Voice input on mobile devices
- Achievement triggering and persistence
- Parent dashboard PIN security
- Cross-browser compatibility

### Build and Deployment
- No bundler complexity - uses Vite with minimal configuration
- API keys must be injected via environment variables (never hardcoded)
- See DEPLOYMENT_GUIDE.md for PWA deployment on Android devices
- All assets should be optimized for mobile performance

## Notable Implementation Details

### Focus Timer
- Uses `targetTime` approach for background accuracy instead of interval-based counting
- Implements wake lock to prevent screen sleep during focus sessions
- Audio context unlocking required for mobile browser compatibility

### Voice Input
- Integrated with Web Speech API for homework voice-to-text
- Graceful fallback messaging for unsupported browsers
- Structured parsing through DeepSeek AI converts natural language to homework data

### Parent Dashboard
- PIN-locked access to progress reports and reward management
- Data export/import functionality for backup and restore
- AI-generated progress summaries for parental insights

## Modern UI Implementation (2025 Enhancement)

### Glassmorphism Design System
The application features a cutting-edge glassmorphism design implementing 2025 UI trends:

**CSS Architecture:**
- Custom CSS variables in `index.html` define the complete design system
- Glass effects using `backdrop-filter: blur()` and semi-transparent backgrounds
- Neon glow effects with CSS `box-shadow` and `text-shadow` properties
- Smooth animations with CSS transitions and keyframe animations

**Key Classes:**
```css
.glass-card       - Semi-transparent surfaces with backdrop blur
.glass-button     - Interactive buttons with gradient backgrounds and shimmer effects
.neon-text-primary - Purple neon text with glow effects
.pulse-glow       - Pulsing glow animation for emphasis
.float-animation  - Subtle floating animation for logos and icons
```

**Component Enhancements:**
- **Sidebar**: Floating logo, glassmorphic nav buttons with scale animations
- **HomeworkDashboard**: Glass header, animated card grid with staggered entrance
- **HomeworkItem**: Glass cards with gradient overlays and hover transformations
- **Buttons**: Shimmer effects, scale transforms, and neon glow states

### Animation System
- **Entrance Animations**: fadeInUp for dashboard cards with staggered delays
- **Hover Effects**: Scale transforms, glow intensification, and color transitions
- **Loading States**: Pulse animations for notifications and status indicators
- **Focus States**: Enhanced accessibility with neon outline effects

### Brand Integration
- **VibeTechLogo**: Custom SVG with multi-stop gradients and filter effects
- **Color Harmony**: Split-complementary purple-cyan scheme with pink accents
- **Typography**: Inter font with variable weights and neon text treatments

This architecture prioritizes user experience, offline functionality, and educational value while maintaining clean separation of concerns and type safety throughout the application. The 2025 UI update brings modern visual appeal that matches current design trends while preserving full functionality.

---

## Mobile Development (Capacitor + Android)

### Capacitor Configuration
This app uses **Capacitor 7.4.3** to deploy as a native Android app alongside the PWA version.

**Key Files**:
- `capacitor.config.ts` - Main Capacitor configuration
- `android/app/build.gradle` - Android version management
- `android/app/src/main/AndroidManifest.xml` - Android permissions

### Android Build Commands
```bash
# Development workflow
npm run build                    # Build web assets
npx cap sync android             # Copy to android/ and update plugins
npx cap open android             # Open in Android Studio

# Direct APK build (faster)
cd android
./gradlew.bat assembleDebug      # Build debug APK
./gradlew.bat clean assembleDebug # Clean build

# Install on connected device
adb install -r android/app/build/outputs/apk/debug/app-debug.apk
adb uninstall com.vibetech.tutor # Uninstall old version
```

### Critical Capacitor Patterns

#### 1. Use CapacitorHttp Explicitly
**DO NOT** rely on automatic fetch() patching. It's unreliable in Capacitor 7.

```typescript
// ❌ WRONG - May not work on Android
const response = await fetch(url, options);

// ✅ CORRECT - Always works
import { CapacitorHttp } from '@capacitor/core';
const response = await CapacitorHttp.request({
  url: url,
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  data: requestBody,
  connectTimeout: 30000,
  readTimeout: 30000
});
const result = response.data; // Already parsed JSON
```

#### 2. Tailwind CSS Compatibility
**DO NOT** use Tailwind CSS from CDN. Android WebView requires v3 with build pipeline.

```bash
# ❌ WRONG - Doesn't work on Android WebView
<script src="https://cdn.tailwindcss.com"></script>

# ✅ CORRECT - Install v3 with PostCSS
npm install -D tailwindcss@3.4.15 postcss autoprefixer
npx tailwindcss init -p
```

**Why**: Tailwind v4 uses `@property` and `color-mix()` which require Chrome 111+. Many Android devices have older WebView versions.

#### 3. Version Management
**Always increment** `versionCode` on each build to force cache clear.

```gradle
// android/app/build.gradle
defaultConfig {
    versionCode 6     // Increment on each release
    versionName "1.0.5" // Semantic version
}
```

### Debugging Tools

#### Chrome Remote Debugging
```bash
# 1. Enable USB debugging on device
# 2. Connect via USB
# 3. Open chrome://inspect/#devices
# 4. Click "Inspect" under Vibe Tutor
```

#### Capacitor Doctor
```bash
npx cap doctor        # Check environment setup
npx cap ls            # List installed plugins
npx cap sync --dry-run # Preview sync changes
```

#### ADB Logcat
```bash
adb logcat | grep -i capacitor   # Filter Capacitor logs
adb logcat | grep -i vibetutor   # Filter app logs
adb logcat -c && adb logcat      # Clear and watch
```

### Common Android Issues

See **[MOBILE-TROUBLESHOOTING.md](./MOBILE-TROUBLESHOOTING.md)** for detailed solutions to:
- Duplicate navigation buttons (Tailwind v4 compatibility)
- Chat not working (CapacitorHttp required)
- Stale code after rebuild (cache issues)
- Media queries not working (WebView compatibility)

### Testing on Real Devices

**Minimum Requirements**:
- Android 10+ (API 29+)
- WebView version 74+
- Samsung Galaxy A54 recommended for testing

**Testing Checklist**:
```bash
# 1. Build fresh APK
npm run build && npx cap sync android
cd android && ./gradlew.bat clean assembleDebug

# 2. Uninstall old version
adb uninstall com.vibetech.tutor

# 3. Install new version
adb install -r android/app/build/outputs/apk/debug/app-debug.apk

# 4. Open Chrome DevTools
# Navigate to chrome://inspect/#devices

# 5. Test all features
# - Navigation (only bottom nav should show)
# - Chat (send/receive messages)
# - Offline mode
# - Responsive design
```

### Version History

Current stable version: **v1.0.5**
- APK: `vibe-tutor-v1.0.5-STABLE.apk`
- Git tag: `v1.0.5`
- See [VERSION.md](./VERSION.md) for full history

### Recovery

If build breaks, rollback to last working version:
```bash
git checkout v1.0.5
npm install
npm run build
npx cap sync android
cd android && ./gradlew.bat assembleDebug
```

---

## Additional Resources

- **Troubleshooting**: See [MOBILE-TROUBLESHOOTING.md](./MOBILE-TROUBLESHOOTING.md)
- **Release Notes**: See [RELEASE-NOTES-v1.0.5.md](./RELEASE-NOTES-v1.0.5.md)
- **Version History**: See [VERSION.md](./VERSION.md)
- **Capacitor Docs**: https://capacitorjs.com/docs
- **Android WebView**: https://developer.android.com/reference/android/webkit/WebView