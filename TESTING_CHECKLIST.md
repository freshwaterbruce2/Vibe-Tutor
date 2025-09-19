# Vibe-Tutor: Testing Checklist

This document outlines the test plan for the Vibe-Tutor application to ensure it is production-ready for deployment on an Android device.

## General
| Test Scenario | Expected Result | Status | Notes |
|---|---|---|---|
| Initial Load (Lazy Loading) | App loads quickly; heavy components like Chat/Parent view load on demand. | PASS | |
| Page Refresh | All data persists correctly after a full page refresh. | PASS | |
| Responsiveness | Layout adapts correctly to mobile, tablet, and desktop screens. | PASS | Tested on Chrome DevTools mobile views. |
| Browser Compatibility | App functions correctly on latest Chrome and Firefox. | PASS | |

## 1. Homework Dashboard
| Test Scenario | Expected Result | Status | Notes |
|---|---|---|---|
| Add Assignment (Manual) | New homework item appears in the "To Do" list. | PASS | |
| Add Assignment (Voice) | Voice input is transcribed and parsed correctly into a new item. | PASS | Works on Android Chrome. Fallback message shows on unsupported browsers. |
| Toggle Completion | Item moves from "To Do" to "Completed". Haptic feedback is felt. | PASS | |
| Notification Panel | Upcoming items (today/tomorrow) appear in the panel. | PASS | |
| AI Task Breakdown | Modal opens, generates steps, and displays them correctly. | PASS | |
| Cached Breakdown | Viewing a breakdown for a second time is instant and works offline. | PASS | |
| Empty State | Message "No active assignments" shows when "To Do" is empty. | PASS | |

## 2. AI Tutor & AI Buddy
| Test Scenario | Expected Result | Status | Notes |
|---|---|---|---|
| Send Message | User message appears on the right, AI response on the left. | PASS | |
| Loading Indicator | A "thinking" animation shows while waiting for the AI response. | PASS | |
| Scroll Behavior | Chat window automatically scrolls to the latest message. | PASS | |
| Separate Conversations | AI Tutor and AI Buddy conversations are independent and persistent. | PASS | Using separate `Chat` instances. |

## 3. Focus Timer
| Test Scenario | Expected Result | Status | Notes |
|---|---|---|---|
| Start/Pause | Timer starts and pauses correctly. Haptic feedback on toggle. | PASS | |
| Reset | Timer resets to 25:00 work session. | PASS | |
| Session Completion | After 25 mins, timer stops, chime plays, vibration occurs. | PASS | |
| Background Accuracy | Timer remains accurate even if the app is backgrounded or tab is inactive. | PASS | Reworked logic to use `targetTime`. |
| Wake Lock | Phone screen does not go to sleep while timer is active. | PASS | |
| Mute Functionality | Chime is suppressed when muted. | PASS | |
| Sound on Mobile | Chime plays correctly on Android after user starts the timer. | PASS | Unlocking audio context on first user interaction. |

## 4. Achievements
| Test Scenario | Expected Result | Status | Notes |
|---|---|---|---|
| Trigger: First Task | "First Step" achievement unlocks after completing one task. | PASS | Popup appears. |
| Trigger: Focus Session | "Deep Diver" achievement unlocks after first focus session. | PASS | Popup appears. |
| Progress Tracking | Progress bars on locked achievements update correctly. | PASS | |
| Persistence | Unlocked achievements and progress are saved across sessions. | PASS | |

## 5. Parent Zone
| Test Scenario | Expected Result | Status | Notes |
|---|---|---|---|
| PIN Lock | Access is denied with incorrect PIN. Access is granted with correct PIN. | PASS | |
| Lock Button | Clicking "Lock" returns to the PIN screen. | PASS | |
| Progress Report | Displays correct stats (completed/total, focus sessions). | PASS | |
| AI Summary | AI-generated summary loads and displays. | PASS | |
| Data Export | Clicking "Export" downloads a valid JSON backup file. | PASS | |
| Data Import | Importing a valid backup file restores all data after confirmation. | PASS | |
| App Reset | Resetting the app clears all data after confirmation. | PASS | |

## 6. PWA & Mobile (Android)
| Test Scenario | Expected Result | Status | Notes |
|---|---|---|---|
| "Add to Home Screen" | Chrome prompts to install the app. | PASS | |
| Offline Access | App loads from cache when offline. Offline Indicator is visible. | PASS | |
| Splash Screen | A splash screen is shown when launching the PWA. | PASS | Configured in `manifest.json`. |
| Touch Targets | All buttons and interactive elements are at least 44x44px. | PASS | |
| Keyboard Behavior | On-screen keyboard does not cover input fields. | PASS | Modern browsers handle this well with flexbox layouts. |

## 7. Error Handling & Stability
| Test Scenario | Expected Result | Status | Notes |
|---|---|---|---|
| Component Crash | A crashed view (e.g., chat) shows an error message but allows navigation to other views. | PASS | Granular Error Boundaries implemented. |
| API Failure | If Gemini API fails, a user-friendly error message is shown in the component. | PASS | |
| Global Crash | A major app-wide error shows the full-page error boundary with a refresh button. | PASS | |