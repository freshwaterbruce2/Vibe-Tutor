# Data Safety - Play Console Answers

**App**: Vibe-Tutor
**Version**: 1.4.0
**Date**: November 14, 2024

This document provides answers for the Google Play Console Data Safety form.

## Overview of Data Collection

**Does your app collect or share any of the required user data types?**
- **Answer**: YES (minimal - only app interactions for AI chat)

## Data Types Collected

### App Activity (Interactions)

**Data Type**: App interactions
**Collected**: YES
**Shared**: YES (with DeepSeek AI for processing only)
**Purpose**: App functionality (AI tutoring and conversation features)
**Required or Optional**: Optional (AI features can be disabled)
**Ephemeral**: YES (not stored by our servers; only transmitted for processing)

**Details**:
- Chat messages sent to AI Tutor and AI Buddy are transmitted to DeepSeek AI API
- No chat history is stored on our backend servers
- Users can opt out by not using AI chat features
- All other app functionality works without AI features

### App Info and Performance

**Data Type**: Crash logs, diagnostics
**Collected**: NO
**Shared**: NO

**Explanation**: No crash reporting or analytics SDKs are integrated. Standard Android system crash reports may be collected by Google Play if user has opted in to Google's data sharing.

### Personal Info

**Data Type**: Name, email address, user IDs, address, phone number, race, ethnicity, religion, sexual orientation, etc.
**Collected**: NO
**Shared**: NO

**Explanation**: Vibe-Tutor does not require account creation, registration, or any personal information.

### Financial Info

**Data Type**: Payment info, purchase history, credit score, etc.
**Collected**: NO
**Shared**: NO

### Health and Fitness

**Data Type**: Health info, fitness info
**Collected**: NO
**Shared**: NO

**Note**: While the app includes neurodivergent support features (ADHD/autism accommodations), no health data is collected or transmitted.

### Location

**Data Type**: Approximate location, precise location
**Collected**: NO
**Shared**: NO

### Contacts

**Data Type**: Contacts
**Collected**: NO
**Shared**: NO

### Messages

**Data Type**: Emails, SMS, other messages
**Collected**: NO
**Shared**: NO

### Photos and Videos

**Data Type**: Photos, videos
**Collected**: NO
**Shared**: NO

### Audio Files

**Data Type**: Voice/sound recordings, music files, other audio
**Collected**: NO
**Shared**: NO

**Note**: Music Library feature streams audio from third-party services (Jamendo, internet radio) but does not record, upload, or share user audio.

### Files and Docs

**Data Type**: User files or documents
**Collected**: NO
**Shared**: NO

**Note**: Data Export feature allows parents to download app data as JSON, but this is user-initiated and stored locally.

### Calendar

**Data Type**: Calendar events
**Collected**: NO
**Shared**: NO

### Device or Other IDs

**Data Type**: Device or other IDs
**Collected**: NO
**Shared**: NO

## Data Security

**Is all user data encrypted in transit?**
- **Answer**: YES
- **Details**: All network requests use HTTPS encryption

**Do you provide a way for users to request that their data is deleted?**
- **Answer**: YES
- **Details**:
  - All data stored locally can be deleted via Settings > Data Management > Clear All Data
  - No data is stored on our servers to delete
  - Parent Dashboard includes data export and deletion controls

## Data Handling Practices

### Is data collected for app functionality or optional features?

**App Interactions (AI Chat)**:
- Collection is **OPTIONAL**
- Users can choose not to use AI Tutor or AI Buddy
- All other features (homework, music, schedules, games) work without AI

### Is data shared with third parties?

**DeepSeek AI (Chat Processing)**:
- **Purpose**: App functionality
- **Data Shared**: Chat message text only
- **User Control**: Optional feature; can be disabled
- **Encryption**: Data transmitted via HTTPS
- **Retention**: Not stored by our backend; DeepSeek retention per their policy

### Is data sold?

**Answer**: NO
Data is not sold to third parties.

### Is data used for advertising or marketing?

**Answer**: NO
No advertising or marketing use.

### Is data used for analytics?

**Answer**: NO
No analytics SDKs or third-party analytics services are integrated.

## Age Requirements

**Target Age Group**: 13-17 (teens)
**Content Rating**: ESRB Everyone 10+ / PEGI 7

The app is designed for students aged 13 and older and does not target children under 13.

## Permissions Requested

The following Android permissions are requested:

1. **INTERNET**: Required for AI chat and music streaming
2. **READ_EXTERNAL_STORAGE** (SDK ≤32): For music file downloads
3. **WRITE_EXTERNAL_STORAGE** (SDK ≤32): For music file downloads
4. **WAKE_LOCK**: For focus timer to prevent screen sleep during sessions
5. **FOREGROUND_SERVICE**: For background music playback

**Note**: No permissions are requested at app startup. Permissions are only prompted when user attempts to use specific features (e.g., downloading music).

## Data Safety Form Summary

For quick reference when filling out the Play Console form:

| Question | Answer |
|----------|--------|
| Does your app collect or share user data? | YES (minimal) |
| App interactions collected? | YES (AI chat only, optional) |
| App interactions shared? | YES (DeepSeek AI, for processing) |
| Personal info collected? | NO |
| Location collected? | NO |
| Photos/videos collected? | NO |
| Audio collected? | NO |
| Files collected? | NO |
| Device IDs collected? | NO |
| Is data encrypted in transit? | YES |
| Can users request data deletion? | YES |
| Is data sold? | NO |
| Is data used for ads? | NO |
| Is data used for analytics? | NO |

---

**Last Updated**: November 14, 2024
**Contact**: (to be added before submission)
