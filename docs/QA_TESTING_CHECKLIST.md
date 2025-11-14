# QA Testing Checklist - Vibe-Tutor v1.4.0

**Version**: 1.4.0 "ASD Companion" (versionCode 25)
**Test Date**: ___________
**Tester**: ___________
**Device**: ___________
**Android Version**: ___________

## Pre-Test Setup

- [ ] Install fresh APK/AAB (uninstall old version first)
- [ ] Clear app data if testing upgrade scenario
- [ ] Ensure device has stable internet connection
- [ ] Disable battery optimization for app (Settings → Battery)
- [ ] Enable USB debugging for logcat monitoring

---

## Core Functionality Tests

### 1. Cold Start & First Launch

- [ ] **App launches without crashes**
- [ ] **Splash screen displays correctly**
- [ ] **Main dashboard loads with sample homework**
- [ ] **No errors in logcat**
- [ ] **Launch time < 3 seconds**

**Notes**: ___________

---

### 2. Homework Dashboard

- [ ] **View existing homework items**
- [ ] **Tap to complete/uncomplete tasks**
  - [ ] Checkmark animates
  - [ ] Points +10 awarded
  - [ ] Achievement check fires
- [ ] **Add new homework (text input)**
  - [ ] Subject field works
  - [ ] Title field works
  - [ ] Due date picker works
  - [ ] Task appears in list
- [ ] **Add homework (voice input)**
  - [ ] Microphone button works
  - [ ] Voice recognition captures speech
  - [ ] AI parses to structured homework
  - [ ] Task appears correctly
- [ ] **Delete homework item**
- [ ] **View week progress chart**
  - [ ] Shows last 7 days
  - [ ] Displays focus minutes + tasks

**Notes**: ___________

---

### 3. AI Tutor

- [ ] **Navigate to AI Tutor view**
- [ ] **Send message: "Help me with algebra"**
  - [ ] Message appears in chat
  - [ ] Loading indicator shows
  - [ ] AI response within 5 seconds
  - [ ] Response is relevant and helpful
- [ ] **Send followup question**
  - [ ] Context maintained from previous message
  - [ ] Conversation flows naturally
- [ ] **Test emoji limiting**
  - [ ] Response has ≤2 emojis
- [ ] **Test ADHD-friendly formatting**
  - [ ] Bullet points used
  - [ ] Short paragraphs
  - [ ] Clear language

**Notes**: ___________

---

### 4. AI Buddy (Conversation Buddy)

- [ ] **Navigate to Buddy Chat view**
- [ ] **Send message: "I'm stressed about homework"**
  - [ ] Response is supportive
  - [ ] Roblox-friendly tone (if applicable)
- [ ] **Test separate context from Tutor**
  - [ ] Conversation independent
  - [ ] No mixing of chat histories

**Notes**: ___________

---

### 5. Visual Schedules

- [ ] **Navigate to Schedules view**
- [ ] **View morning routine** (if configured)
  - [ ] Steps display in order
  - [ ] Timer buttons work
  - [ ] Mark step complete
  - [ ] Tokens awarded (+5 per step)
- [ ] **View evening routine** (if configured)
- [ ] **Edit schedule button** (navigates correctly)
- [ ] **Complete full routine**
  - [ ] Bonus tokens awarded (+20)
  - [ ] Completion tracked

**Notes**: ___________

---

### 6. First-Then Gate

- [ ] **Navigate to Brain Games**
- [ ] **If <3 routine steps completed:**
  - [ ] Gate message displays
  - [ ] Games locked
  - [ ] Shows steps remaining
- [ ] **Complete 3 routine steps**
- [ ] **Return to Brain Games**
  - [ ] Gate unlocked
  - [ ] Games accessible

**Notes**: ___________

---

### 7. Token Wallet

- [ ] **Navigate to Tokens view**
- [ ] **View current token balance**
- [ ] **View transaction history**
  - [ ] Routine completions show
  - [ ] Game rewards show
  - [ ] Timestamps correct
- [ ] **Close button returns to dashboard**

**Notes**: ___________

---

### 8. Brain Games (Word Search)

- [ ] **Navigate to Brain Games**
- [ ] **Select Word Hunt**
- [ ] **Choose difficulty: Easy**
  - [ ] Game loads
  - [ ] Words display
  - [ ] Grid interactive
- [ ] **Find a word**
  - [ ] Word highlights
  - [ ] Success animation
  - [ ] Score increases
- [ ] **Use hint button**
  - [ ] Hint reveals letter
  - [ ] Points deducted
- [ ] **Complete game**
  - [ ] Stars awarded (0-5)
  - [ ] Tokens earned
  - [ ] Results screen shows
  - [ ] Points added to total

**Notes**: ___________

---

### 9. Subject Cards & Worksheets

- [ ] **Navigate to Subject Cards**
- [ ] **Tap Math card**
- [ ] **View current difficulty level**
- [ ] **Start worksheet**
  - [ ] Questions load
  - [ ] Multiple choice works
  - [ ] Fill-in-blank works
  - [ ] True/False works
- [ ] **Submit worksheet**
  - [ ] Score calculated (0-100%)
  - [ ] Stars awarded based on score
  - [ ] Results screen shows
  - [ ] Level up if 5 stars earned

**Notes**: ___________

---

### 10. Music Library

- [ ] **Navigate to Music**
- [ ] **View curated tracks**
- [ ] **Play internet radio**
  - [ ] Stream loads
  - [ ] Audio plays
  - [ ] Pause/play works
  - [ ] Background playback works
- [ ] **Download a track**
  - [ ] Download starts
  - [ ] Progress shows
  - [ ] File saves locally
- [ ] **Play downloaded track**
  - [ ] Offline playback works
- [ ] **Delete track**
  - [ ] Confirmation prompt
  - [ ] File removed
  - [ ] Storage freed

**Notes**: ___________

---

### 11. Sensory Settings

- [ ] **Navigate to Sensory Settings**
- [ ] **Change animation speed: None**
  - [ ] Animations stop
  - [ ] App still usable
- [ ] **Change animation speed: Reduced**
  - [ ] Animations slower
- [ ] **Toggle sound: Off**
  - [ ] No sound effects
- [ ] **Toggle haptic: Off**
  - [ ] No vibrations
- [ ] **Change font size: Large**
  - [ ] Text increases
  - [ ] Layout adjusts
- [ ] **Enable dyslexia font**
  - [ ] OpenDyslexic loads
  - [ ] Readability improved
- [ ] **Change color mode: High Contrast**
  - [ ] Colors change
  - [ ] Contrast improves

**Notes**: ___________

---

### 12. Focus Timer (Pomodoro)

- [ ] **Navigate to Focus Timer**
- [ ] **Start 25-minute session**
  - [ ] Timer counts down
  - [ ] Screen stays on (wake lock)
  - [ ] Progress circle animates
- [ ] **Minimize app**
  - [ ] Timer continues in background
- [ ] **Return to app**
  - [ ] Timer shows correct time
- [ ] **Complete session**
  - [ ] Completion alert
  - [ ] Points awarded (25 pts = 25 min)
  - [ ] Achievement check fires
- [ ] **Cancel early**
  - [ ] No points awarded

**Notes**: ___________

---

### 13. Achievement Center

- [ ] **Navigate to Achievements**
- [ ] **View locked achievements**
  - [ ] Grayed out
  - [ ] Progress shows if applicable
- [ ] **View unlocked achievements**
  - [ ] Full color
  - [ ] Unlock date shows
- [ ] **View available rewards**
- [ ] **Claim reward** (if enough points)
  - [ ] Points deducted
  - [ ] Reward moves to claimed section

**Notes**: ___________

---

### 14. Parent Dashboard

- [ ] **Navigate to Parent Zone**
- [ ] **Enter PIN**
  - [ ] Keypad displays
  - [ ] Correct PIN unlocks
  - [ ] Wrong PIN rejected
- [ ] **View Progress Reports**
  - [ ] Completed tasks count correct
  - [ ] Points total correct
  - [ ] Chart displays
- [ ] **Navigate to Manage Rules**
  - [ ] Parent Rules page loads
- [ ] **Export data**
  - [ ] JSON file downloads
  - [ ] Contains all app data
- [ ] **Import data**
  - [ ] File selector opens
  - [ ] Data restores correctly
- [ ] **Clear all data**
  - [ ] Confirmation prompt
  - [ ] All data deleted
  - [ ] App resets

**Notes**: ___________

---

### 15. Parent Rules Configuration

- [ ] **Navigate from Parent Dashboard → Manage Rules**
- [ ] **View First-Then settings**
- [ ] **Change steps required: 5**
  - [ ] Setting saves
  - [ ] Brain Games gate updates
- [ ] **Change daily time limit**
- [ ] **Toggle calm mode**
  - [ ] Animations adjust app-wide
- [ ] **Close and verify settings persist**

**Notes**: ___________

---

## Edge Cases & Error Handling

### Network Errors

- [ ] **Disable WiFi/data before AI chat**
  - [ ] Error message displays
  - [ ] Fallback response shown
  - [ ] App doesn't crash
- [ ] **Enable network mid-chat**
  - [ ] Next message works
- [ ] **Disable network before music stream**
  - [ ] Error message displays
  - [ ] Graceful fallback

**Notes**: ___________

---

### Offline Mode

- [ ] **Enable Airplane Mode**
- [ ] **Launch app**
  - [ ] Dashboard works
  - [ ] Homework add/complete works
  - [ ] Brain games work
  - [ ] Subject cards work
  - [ ] Focus timer works
  - [ ] Schedules work
  - [ ] Token wallet shows cached data
- [ ] **Features correctly disabled:**
  - [ ] AI Tutor shows offline message
  - [ ] AI Buddy shows offline message
  - [ ] Music streaming shows offline message

**Notes**: ___________

---

### Background/Foreground

- [ ] **Start Focus Timer → Home button**
  - [ ] Timer continues
- [ ] **Play music → Lock screen**
  - [ ] Music continues
- [ ] **Return to app after 5 minutes**
  - [ ] State preserved
  - [ ] No crashes
- [ ] **Return after 24 hours**
  - [ ] Session token refreshed
  - [ ] Data intact

**Notes**: ___________

---

### Low Storage

- [ ] **Download multiple music tracks until storage warning**
  - [ ] Warning displays
  - [ ] Option to delete tracks shown
  - [ ] Download stops gracefully

**Notes**: ___________

---

### Memory Leaks

- [ ] **Use app for 30 minutes continuously**
- [ ] **Navigate between all views multiple times**
- [ ] **Monitor memory usage** (Android Studio Profiler or adb)
  - [ ] No excessive growth
  - [ ] Memory stabilizes

**Notes**: ___________

---

## Performance Tests

### Launch Time

- [ ] **Cold start**: ________ seconds (target: <3s)
- [ ] **Warm start**: ________ seconds (target: <1s)

### Navigation Responsiveness

- [ ] **Sidebar tap → View change**: ________ ms (target: <200ms)
- [ ] **Dashboard → AI Tutor**: ________ ms
- [ ] **Back navigation**: ________ ms

### AI Response Time

- [ ] **First message**: ________ seconds (network dependent)
- [ ] **Followup message**: ________ seconds

### Animation Smoothness

- [ ] **60fps during navigation**: YES / NO
- [ ] **No dropped frames during scrolling**: YES / NO

**Notes**: ___________

---

## Battery Impact

- [ ] **Use app for 1 hour with screen on**
  - [ ] Battery drain: ________% (target: <10%)
- [ ] **Background music for 30 minutes**
  - [ ] Battery drain: ________% (target: <5%)

**Notes**: ___________

---

## Accessibility

### Screen Reader (TalkBack)

- [ ] **Enable TalkBack**
- [ ] **Navigate dashboard**
  - [ ] All buttons labeled
  - [ ] Homework items readable
- [ ] **Complete a task**
  - [ ] Audio feedback correct

### Font Scaling

- [ ] **Set device font to Largest**
  - [ ] Text doesn't overflow
  - [ ] Buttons still tappable
  - [ ] Layouts adjust

**Notes**: ___________

---

## Security & Privacy

- [ ] **No sensitive data in logcat**
- [ ] **PIN hashed, not plain text** (check localStorage)
- [ ] **All network requests use HTTPS**
- [ ] **No cleartext traffic** (verify in logcat)
- [ ] **No unexpected permissions requested**

**Notes**: ___________

---

## Regression Tests (After Bug Fixes)

- [ ] **Previous bug #1**: (describe) - FIXED / NOT FIXED
- [ ] **Previous bug #2**: (describe) - FIXED / NOT FIXED

**Notes**: ___________

---

## Critical Issues Found

**P0 (Blocker - Cannot ship):**
1. ___________
2. ___________

**P1 (Major - Should fix before launch):**
1. ___________
2. ___________

**P2 (Minor - Can fix post-launch):**
1. ___________
2. ___________

---

## Test Summary

**Total Tests**: ________ / 150+
**Passed**: ________
**Failed**: ________
**Blocked**: ________

**Overall Status**: PASS / FAIL / CONDITIONAL PASS

**Tester Sign-off**: ___________
**Date**: ___________

**Ready for Play Store Submission**: YES / NO

---

**Notes**: Use this checklist for every release. Archive completed checklists in `Vibe-Tutor/qa-reports/`.
