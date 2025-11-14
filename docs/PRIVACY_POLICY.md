# Privacy Policy for Vibe-Tutor

**Effective Date:** November 14, 2024
**Last Updated:** November 14, 2024

## Overview

Vibe-Tutor ("we," "our," or "the app") is an educational homework management and AI tutoring application designed for students aged 13-17 with ADHD and autism support features. We are committed to protecting your privacy and being transparent about data practices.

## Information We Collect

### Data Stored Locally on Your Device

Vibe-Tutor stores the following data locally on your device using browser localStorage:

- **Homework Items**: Tasks you create, including subject, title, due dates, and completion status
- **Achievement Progress**: Your unlocked achievements and progress toward goals
- **Rewards System**: Parent-configured rewards and claimed reward history
- **Music Playlists**: Your saved music playlists and downloaded tracks
- **Sensory Preferences**: Animation speed, sound, haptic feedback, font size, dyslexia font, and color mode settings
- **Focus Session History**: Pomodoro timer session data for the past 7 days
- **Parent PIN**: SHA-256 hashed PIN for parental controls (never stored in plain text)
- **Schedule Data**: Morning and evening routine steps and completion progress
- **Token Economy**: Earned tokens and transaction history
- **Usage Sessions**: Session timestamps for app activity tracking

**This data never leaves your device** unless you explicitly export it using the Parent Dashboard's Data Management feature.

### Data Transmitted to External Services

#### AI Chat Services (Optional Feature)

When you use the AI Tutor or AI Buddy features:

- **What is sent**: Your chat messages are sent to our secure backend server, which forwards them to DeepSeek AI API for processing
- **What is not sent**: No personally identifiable information, account credentials, or device identifiers
- **Retention**: Our backend server does not log or store chat message content. DeepSeek may retain data according to their privacy policy: https://www.deepseek.com/privacy-policy
- **Purpose**: To provide AI-powered tutoring and conversational assistance
- **Opt-out**: You can choose not to use AI chat features; all other app functionality remains available

#### Music Streaming (Optional Feature)

When you use the Music Library feature:

- **What is sent**: Requests to third-party music services (Jamendo API, internet radio streams) for audio content
- **What is not sent**: Your listening history or preferences are not shared
- **Purpose**: To stream music for focus and relaxation
- **Opt-out**: You can choose not to use music features; all other app functionality remains available

## Data Security

- **Local Storage**: All user data stored on device is protected by Android's application sandboxing
- **Data in Transit**: All network requests use HTTPS encryption
- **No User Accounts**: Vibe-Tutor does not require account creation, registration, or login
- **No Cloud Sync**: Data is not synced to cloud servers
- **Parental PIN**: Stored using SHA-256 cryptographic hashing; cannot be reversed to recover original PIN

## Third-Party Services

Vibe-Tutor integrates with the following third-party services:

### DeepSeek AI
- **Purpose**: AI chat completions for tutoring and conversation features
- **Data Shared**: Chat message text only (no personal information)
- **Privacy Policy**: https://www.deepseek.com/privacy-policy

### Jamendo Music API
- **Purpose**: Free, legal music streaming with Creative Commons licenses
- **Data Shared**: Music search queries and stream requests
- **Privacy Policy**: https://www.jamendo.com/legal/privacy

### Google Fonts
- **Purpose**: Loading Inter and OpenDyslexic fonts for accessibility
- **Data Shared**: Font file requests (standard web traffic)
- **Privacy Policy**: https://developers.google.com/fonts/faq/privacy

## Children's Privacy (COPPA Compliance)

Vibe-Tutor is designed for users aged **13 and older**. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child under 13 has provided information to us, please contact us immediately so we can delete it.

## Parental Controls

Parents can:
- Access all app data via PIN-protected Parent Dashboard
- Export complete app data as JSON (backup/review)
- Delete all app data permanently
- Configure app rules (First-Then gates, time limits, calm mode)
- Review usage session history and token transactions

## Your Data Rights

You have the right to:
- **Access**: View all stored data in the app or via Data Export (Parent Dashboard)
- **Delete**: Clear all app data using Settings > Data Management > Clear All Data
- **Export**: Download complete data snapshot as JSON file
- **Opt-Out**: Disable specific features (AI chat, music streaming) without losing core functionality

## Data Retention

- **Local Data**: Retained indefinitely until manually deleted by user
- **AI Chat**: Not stored on our servers; DeepSeek retention governed by their policy
- **Session Tokens**: Expire after 24 hours

## Changes to This Privacy Policy

We may update this Privacy Policy from time to time. Changes will be reflected by updating the "Last Updated" date. Continued use of the app after changes constitutes acceptance of the updated policy.

## Contact Us

If you have questions about this Privacy Policy or Vibe-Tutor's data practices:

- **Developer**: VibeTech
- **Email**: (to be added before Play Store submission)
- **GitHub**: https://github.com/freshwaterbruce2/vibetech

## Consent

By using Vibe-Tutor, you consent to this Privacy Policy.

---

**Summary**: Vibe-Tutor stores all your data locally on your device. AI chat messages are processed via DeepSeek AI (not stored by us). No personal information is collected. You can delete all data at any time.
