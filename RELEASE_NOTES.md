# Vibe-Tutor Release Notes

## Version 1.0.0 - "Phoenix" (Production Launch)

This is the first official production release of Vibe-Tutor! This release focuses on stability, mobile readiness, and a comprehensive feature set for students and parents.

### ✨ New Features

-   **Parent Dashboard**: A comprehensive, PIN-protected "Parent Zone" has been added.
    -   View high-level statistics on completed assignments and focus sessions.
    -   Get a privacy-conscious, AI-generated summary of student progress.
-   **Progressive Web App (PWA)**: Vibe-Tutor can now be installed directly to an Android phone's home screen for a native app-like experience, including offline access for core features.
-   **Data Management**: Parents can now export all app data for backup and import it from a file. A full app reset option is also available.
-   **AI Task Breakdown**: Students can now use an AI-powered feature to break down any homework assignment into small, manageable steps.
-   **Achievement System**: A new system to reward student progress by unlocking achievements for completing tasks and finishing focus sessions.
-   **Mood Tracker**: A simple, emoji-based mood tracker on the dashboard allows students to check in with their feelings.

### 🚀 Improvements & Optimizations

-   **Performance Boost (Lazy Loading)**: Major components are now lazy-loaded, dramatically improving the app's initial startup time.
-   **Resilient Focus Timer**: The timer logic remains accurate even when the app is running in the background, a critical fix for mobile usability.
-   **Screen Wake Lock**: The device screen is now prevented from sleeping while the Focus Timer is active.
-   **Haptic Feedback**: Key interactions, like completing a task or starting the timer, now provide tactile vibration feedback on supported mobile devices.
-   **Improved Error Handling**: The app now features granular error boundaries, preventing a crash in one component from taking down the entire application.
-   **Offline Support**: An offline indicator now appears when connectivity is lost. AI Task Breakdowns are also cached to be viewable offline after first use.
-   **Mobile Audio Reliability**: The audio chime for the Focus Timer has been optimized to play more reliably on mobile browsers.
-   **Accessibility Enhancements**: Added ARIA labels and roles to improve navigation and usability for users with screen readers.
-   **Graceful Degradation**: The voice input feature now detects if the browser supports it and displays a helpful message if it doesn't.

### 🐞 Bug Fixes

-   **Fixed**: Focus Timer would become inaccurate if the browser tab was inactive.
-   **Fixed**: "Add with Voice" button was present but non-functional on unsupported browsers.
-   **Mitigated**: Audio chimes could be blocked by mobile browsers.
-   **Fixed**: App would crash completely on certain rendering errors.