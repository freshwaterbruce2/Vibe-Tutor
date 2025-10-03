# Version History

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
