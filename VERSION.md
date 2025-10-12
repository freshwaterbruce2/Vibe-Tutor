# Version History

## v1.0.7 - SCREEN TIME CONTROLS (2025-10-04) ✅
**Status**: Parent Dashboard Enhanced

### Parent Dashboard Enhancements
- ✅ **Screen Time Settings Component**: Full UI for managing screen time limits and usage monitoring
  - Real-time usage display (screen time, AI requests, focus sessions, homework)
  - Visual progress bars with color-coded warnings (green/yellow/red)
  - Adjustable limits via sliders:
    * Daily screen time (15 min - 8 hours, default: 2 hours)
    * Consecutive time before break (15 min - 2 hours, default: 30 min)
    * Break duration (5-30 min, default: 10 min)
    * Max daily AI requests (10-200, default: 50)
    * Quiet hours start/end (configurable time range)
  - **Admin Mode Toggle**: Disables all limits for testing/parent use
  - Detailed usage report viewer
  - Reset daily statistics button
  - Persistent settings saved to localStorage

### Use Cases
- Parents can now view and control all screen time limits from Parent Dashboard
- Admin mode allows unrestricted testing without triggering limits
- Real-time progress bars help parents monitor usage patterns
- Quiet hours enforcement for bedtime/focus time

### Technical Changes
- Created `components/ScreenTimeSettings.tsx`
- Updated `components/ParentDashboard.tsx` to include ScreenTimeSettings
- Leverages existing `usageMonitor` service (no backend changes needed)
- Android versionCode: 8, versionName: 1.0.7

### Files
- APK: `vibe-tutor-v1.0.7-SCREEN-TIME-CONTROLS.apk` (to be generated)
- Git Tag: `v1.0.7`
- Build Date: October 4, 2025

---

## v1.0.6 - NEURODIVERGENT-FRIENDLY (2025-10-04) ✅
**Status**: Enhanced for ADHD & High-Functioning Autism

### Neurodivergent Learning Enhancements
- ✅ **AI Tutor Prompt Redesign**: Optimized communication style for students with ADHD and autism
  - Bullet points and numbered lists (working memory support)
  - 2-3 sentence chunks (prevents cognitive overload)
  - Clear step-by-step instructions (executive function support)
  - Reduced emoji usage (sensory overload prevention)
  - Patient, non-judgmental tone allowing repetition
  - Direct, unambiguous language (no idioms or unclear phrases)

- ✅ **AI Buddy Prompt Enhancement**: Emotional regulation and social communication support
  - Short responses (2-4 sentences max)
  - Predictable, consistent structure
  - Sensory-aware communication (limited emojis)
  - Validation of executive function challenges
  - Clear boundaries and role definition

### Research-Based Design (October 2025)
- Evidence-based practices from autism/ADHD education research
- Chunking strategies for improved retention
- Visual/structured formatting preferences
- Executive function accommodations
- Sensory processing considerations

### Technical Changes
- Updated `constants.ts` AI prompts with neurodivergent-specific instructions
- Android versionCode: 7, versionName: 1.0.6
- No code changes - prompt optimization only (requires cache bust)

### Target Audience
- High school students with ADHD
- High-functioning autistic students
- All students benefit from clear, structured communication

### Deployment Notes
**CRITICAL**: WebView cache busting required for prompt changes to take effect
- Must increment versionCode (done: 6 → 7)
- Clean rebuild required: `gradlew clean assembleDebug`
- Uninstall old version before installing: `adb uninstall com.vibetech.tutor`
- Without these steps, old AI behavior will persist from cache

### Files
- APK: `vibe-tutor-v1.0.6-NEURODIVERGENT-FRIENDLY.apk`
- Git Tag: `v1.0.6`
- Build Date: October 4, 2025

---

## v1.0.5 - STABLE (2025-10-03) ✅
**Status**: Production Ready - Tested and Verified

### Critical Fixes
- ✅ **Duplicate Navigation Buttons**: Fixed Tailwind CSS v4 incompatibility with Android WebView
- ✅ **Chat Functionality**: Replaced fetch() with CapacitorHttp for native networking

### Technical Changes
- Migrated from Tailwind CSS v4 CDN to v3.4.15 with PostCSS
- Implemented CapacitorHttp.request() for all network calls
- Updated cache version to v6
- Android versionCode: 6, versionName: 1.0.5

### Testing Results
- ✅ No duplicate buttons on Galaxy A54
- ✅ Chat working with backend
- ✅ Responsive design functioning correctly
- ✅ All mobile optimizations intact

### Documentation Enhancements (2025-10-03)
- ✅ **Kiosk Mode Support**: Added comprehensive documentation for single-app lockdown deployment
  - `KIOSK_MODE_SETUP.md` - Setup guide for Fully Single App Kiosk and native app pinning
  - `KIOSK_UNLOCK_GUIDE.md` - Parent guide for device management and troubleshooting
  - Updated `README.md` with kiosk mode feature section
  - Updated `CLAUDE.md` with deployment details and security best practices
  - Created `SESSION_NOTES.md` documenting research and implementation insights
- Target use case: Transform Samsung Galaxy A54 into dedicated study device with parental controls

### Files
- APK: `vibe-tutor-v1.0.5-STABLE.apk` (4.0MB)
- Git Tag: `v1.0.5`
- Commit: `2372825`

---

## v1.0.4 (2025-10-03) ⚠️
**Status**: Deprecated - Bold colors but issues remained

### Changes
- Bold neon color scheme (Hot Magenta, Electric Cyan, Orange)
- Cache version v4
- Still had duplicate button issue

---

## v1.0.3 (2025-10-03) ⚠️
**Status**: Deprecated - UI polish attempt

### Changes
- Added animated icons (pulse, bounce, spin)
- Memory badge showing saved messages
- Chat input padding fix attempt
- Still using Tailwind CDN (v4)

---

## v1.0.2 (2025-10-02) ⚠️
**Status**: Deprecated - Initial AI chat fix

### Changes
- Fixed Capacitor detection in config.ts
- Enabled CapacitorHttp plugin
- Backend connection working in browser
- Android issues not yet addressed

---

## Upgrade Instructions

### From any previous version to v1.0.5:
1. **Completely uninstall** old app from device
2. **Clear app data** if prompted
3. **Install** `vibe-tutor-v1.0.5-STABLE.apk`
4. First launch may take 30s if backend is sleeping

### Rolling Back (if needed):
```bash
git checkout v1.0.5
npm install
npm run build
npx cap sync android
cd android && ./gradlew.bat assembleDebug
```

---

## Known Issues
None currently reported for v1.0.5

## Upcoming Features
- Consider for future releases based on user feedback
