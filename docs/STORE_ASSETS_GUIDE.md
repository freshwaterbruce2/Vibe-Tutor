# Store Assets Preparation Guide

**App**: Vibe-Tutor v1.4.0
**Date**: November 14, 2024

## Required Assets for Google Play Store

### 1. App Icon (REQUIRED)

**Specifications:**
- Size: 1024 x 1024 pixels
- Format: PNG (32-bit)
- Color space: sRGB
- No transparency/alpha channel
- Square design (will be masked to various shapes by Android)
- Must work at small sizes (48x48dp on device)

**Design Recommendations:**
- Use Vibe-Tutor brand colors (purple/cyan gradient)
- Simple, recognizable icon
- Avoid text (unreadable at small sizes)
- Consider: Lightbulb + graduation cap combo
- Neon glow effect matches brand
- High contrast for visibility

**Current Icon**: Located at `Vibe-Tutor/public/icon-1024.png` (if exists)
**Action**: Create or verify icon meets specifications

---

### 2. Feature Graphic (REQUIRED)

**Specifications:**
- Size: 1024 x 500 pixels
- Format: PNG or JPEG
- No transparency
- Used in Play Store listing header

**Design Recommendations:**
- Showcase key features visually
- Include app name "Vibe-Tutor"
- Use brand colors (purple/cyan gradient background)
- Show UI screenshots or feature icons
- Include tagline: "AI Homework Manager for Teens"
- Highlight ADHD/autism support

**Sample Layout:**
```
[Left side: App icon/logo]
[Center: "Vibe-Tutor" title with neon effect]
[Right side: Screenshot montage or feature icons]
[Bottom: "ADHD & Autism Support • AI Tutoring • Focus Tools"]
```

**Tools**:
- Figma (recommended, free): https://figma.com
- Canva: https://canva.com
- Adobe Express: https://express.adobe.com

---

### 3. Phone Screenshots (REQUIRED - minimum 3)

**Specifications:**
- Minimum size: 320 pixels
- Maximum size: 3840 pixels
- Recommended: 1080 x 1920 (9:16 aspect ratio) or 1440 x 2560
- Format: PNG or JPEG
- Maximum: 8 screenshots
- Order matters (1st screenshot most important)

**Recommended Screenshots (in order):**

1. **Homework Dashboard**
   - Shows main interface with task list
   - Highlights voice input button
   - Shows progress chart
   - Caption: "Never forget an assignment again"

2. **AI Tutor Chat**
   - Shows conversation with AI tutor
   - Displays helpful, friendly responses
   - Caption: "24/7 homework help powered by AI"

3. **Visual Schedule**
   - Shows morning/evening routine with steps
   - Highlights token rewards
   - Caption: "Structured routines that actually work"

4. **Brain Games** (Word Search)
   - Shows engaging game interface
   - Difficulty selection visible
   - Caption: "Learn through play with brain games"

5. **Sensory Settings**
   - Shows neurodivergent-friendly controls
   - Animation, font, color options visible
   - Caption: "Customized for ADHD & autism support"

6. **Token Wallet**
   - Shows earned tokens and transactions
   - Roblox-style rewards visible
   - Caption: "Earn rewards for completing tasks"

7. **Parent Dashboard**
   - Shows progress reports (blur sensitive data)
   - Highlights transparency
   - Caption: "Parent controls with complete transparency"

**How to Capture Screenshots:**

Option 1 - Real Device (Best Quality):
```bash
# Connect Android device via USB
adb shell screencap -p /sdcard/screenshot.png
adb pull /sdcard/screenshot.png ./screenshots/
```

Option 2 - Chrome DevTools:
1. Open app in browser: http://localhost:5173
2. F12 → Toggle Device Toolbar
3. Set device: Pixel 5 (1080 x 2340)
4. Capture screenshot (Ctrl+Shift+P → "Capture screenshot")

Option 3 - Android Studio Emulator:
1. Launch emulator with Pixel 5 profile
2. Install APK: `adb install app-debug.apk`
3. Use Camera button in emulator toolbar

**Post-Processing:**
- Remove status bar if desired (consistent look)
- Add device frame (optional, use screenshot.rocks)
- Ensure text is legible at thumbnail size
- Consistent background color or remove entirely

---

### 4. Tablet Screenshots (OPTIONAL - Recommended)

**7-inch Tablet:**
- Size: 1200 x 1920 pixels (or similar 10:16 ratio)
- Minimum: 3 screenshots
- Shows how app adapts to larger screens

**10-inch Tablet:**
- Size: 1600 x 2560 pixels (or similar)
- Minimum: 3 screenshots
- Highlights two-pane layouts if applicable

**Note**: Vibe-Tutor is primarily phone-focused, so tablet screenshots are low priority unless you optimize UI for tablets.

---

### 5. Video (OPTIONAL)

**Specifications:**
- Length: 30 seconds to 2 minutes
- Format: MP4, MOV, or AVI
- Max size: 100 MB
- Aspect ratio: 16:9 or 9:16
- Resolution: Minimum 720p, recommended 1080p

**Video Structure (if created):**
1. **Hook (0-5 sec)**: "Struggling with homework organization?"
2. **Problem (5-10 sec)**: Show cluttered desk, missed assignments
3. **Solution (10-30 sec)**: Quick app tour (dashboard, AI tutor, schedules)
4. **Benefits (30-45 sec)**: Show rewards, focus timer, parent dashboard
5. **Call-to-Action (45-60 sec)**: "Download Vibe-Tutor today - 100% free!"

**Tools:**
- CapCut (free, mobile-friendly)
- DaVinci Resolve (free, professional)
- Screen recording: OBS Studio or ADB screenrecord

**Priority**: LOW (video is optional and time-intensive)

---

## Asset Checklist

- [ ] App icon 1024x1024 PNG ready
- [ ] Feature graphic 1024x500 created
- [ ] Screenshot 1: Homework Dashboard captured
- [ ] Screenshot 2: AI Tutor Chat captured
- [ ] Screenshot 3: Visual Schedule captured
- [ ] Screenshot 4: Brain Games captured (optional)
- [ ] Screenshot 5: Sensory Settings captured (optional)
- [ ] Screenshot 6: Token Wallet captured (optional)
- [ ] Screenshot 7: Parent Dashboard captured (optional)
- [ ] All screenshots cropped to 1080x1920
- [ ] All screenshots optimized (< 1 MB each)
- [ ] All assets stored in `Vibe-Tutor/store-assets/` folder

## File Organization

Create folder structure:
```
Vibe-Tutor/store-assets/
├── icon-1024x1024.png
├── feature-graphic-1024x500.png
├── screenshots/
│   ├── 01-homework-dashboard.png
│   ├── 02-ai-tutor-chat.png
│   ├── 03-visual-schedule.png
│   ├── 04-brain-games.png
│   ├── 05-sensory-settings.png
│   ├── 06-token-wallet.png
│   └── 07-parent-dashboard.png
├── tablet-7inch/ (optional)
│   ├── 01-dashboard-tablet.png
│   └── ...
└── video/ (optional)
    └── promo-video.mp4
```

## Quick Asset Generation Script

```powershell
# Create asset folders
mkdir -p Vibe-Tutor/store-assets/screenshots
mkdir -p Vibe-Tutor/store-assets/tablet-7inch
mkdir -p Vibe-Tutor/store-assets/video

# Capture screenshots from connected device
cd Vibe-Tutor/store-assets/screenshots
adb shell screencap -p /sdcard/screen.png && adb pull /sdcard/screen.png 01-homework-dashboard.png
# Repeat for each view, navigating in app between captures
```

## Design Resources

**Color Palette** (from brand):
- Primary: #D946EF (Hot Magenta)
- Secondary: #06FFF0 (Electric Cyan)
- Tertiary: #FF6B00 (Blazing Orange)
- Background: #0F0F23 (Dark Purple)

**Fonts**:
- Primary: Inter (Google Fonts)
- Accessibility: OpenDyslexic

**Logo Elements**:
- Lightbulb (AI/learning)
- Graduation cap (education)
- Star (achievement)
- Brain (neurodivergent support)

## Quality Standards

✓ All text legible at thumbnail size (120px wide)
✓ Consistent visual style across all assets
✓ No placeholder text ("Lorem ipsum", "TODO")
✓ No personal/sensitive information visible
✓ Professional quality (no pixelation, artifacts)
✓ Accurately represents app functionality
✓ Complies with Play Store asset policies

## Next Steps After Asset Creation

1. Upload assets to Play Console (Store Presence → Main Store Listing)
2. Preview listing in different locales
3. Test on various Android devices (Play Console preview tool)
4. Get feedback from beta testers
5. Iterate based on feedback

---

**Last Updated**: November 14, 2024
**Status**: Assets pending creation
**Priority**: HIGH (required for submission)
