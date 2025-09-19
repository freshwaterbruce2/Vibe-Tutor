# Vibe-Tutor: Deployment Guide

This guide provides instructions for building, deploying, and installing the Vibe-Tutor application as a Progressive Web App (PWA) on an Android device.

## 1. Prerequisites
- A web server or static hosting service (e.g., Netlify, Vercel, Firebase Hosting, GitHub Pages).
- An Android device with the latest version of Google Chrome.
- The Vibe-Tutor project files.

## 2. Production Build
Since this project is set up without a traditional bundler like Webpack or Vite, the "build" process is manual. Ensure all files are optimized and ready for deployment.

1.  **Minify Assets**: Before uploading, use an online tool to minify your JavaScript (`.tsx`) and any custom CSS to reduce file sizes and improve load times.
2.  **Clean Up**: Remove any temporary or test files.
3.  **Remove Logs**: Ensure all `console.log` statements (except for `console.error`) have been removed from the code for a cleaner production console.
4.  **API Key**: The application relies on the `process.env.API_KEY` environment variable. Your hosting provider must be configured to supply this variable to the application environment.
    > **SECURITY WARNING**: Do not hard-code your API key in the client-side JavaScript files. It must be injected by the environment. For purely static hosting, a serverless function is required to proxy API calls securely.

## 3. Deployment
Deploy the application by uploading the entire project folder to your chosen static hosting provider.

- `index.html`
- `index.tsx`
- `manifest.json`
- `service-worker.js`
- All files in `components/`
- All files in `services/`
- All other project files (`.json`, `.ts`, etc.)

Most hosting providers have a simple drag-and-drop interface or a CLI tool for deployment.

## 4. PWA Installation on Android

Once deployed and accessible via a public URL:

1.  Open **Google Chrome** on your son's Android phone.
2.  Navigate to the public URL of the Vibe-Tutor app.
3.  Chrome should automatically show a prompt at the bottom of the screen saying **"Add VibeTutor to Home screen"**.
4.  Tap on the prompt. A confirmation dialog will appear. Tap **"Install"** or **"Add"**.
5.  The app will be "installed" on the device. An icon for Vibe-Tutor will appear on the home screen, just like a native app.
6.  Launching the app from this icon will open it in its own window, without the browser's address bar, providing a native app experience.

## 5. Data Backup and Restore

Data can be managed from the Parent Dashboard.

### To Backup Data:
1.  Navigate to the "Parent Zone".
2.  Enter the PIN to unlock the dashboard.
3.  Scroll down to the "Data Management" section.
4.  Tap **"Export Data"**.
5.  A file named `vibe-tutor-backup-YYYY-MM-DD.json` will be downloaded to the phone's "Downloads" folder. Keep this file safe.

### To Restore Data:
1.  Navigate to the "Parent Zone" and unlock it.
2.  In the "Data Management" section, tap **"Import Data"**.
3.  The phone's file explorer will open. Navigate to the saved `.json` backup file and select it.
4.  A confirmation prompt will appear. Tap **"OK"**.
5.  The app will restore the data and automatically reload.

## 6. Troubleshooting

-   **App doesn't load offline**: The service worker might not have installed correctly. Try clearing the browser cache for the site and reloading the page while online.
-   **"Add to Home Screen" prompt doesn't appear**: Ensure the site is served over HTTPS, as it is a requirement for PWAs. Also, check that the `manifest.json` and `service-worker.js` files are correctly linked in `index.html` and are accessible.
-   **Voice Input not working**: Ensure Google Chrome has permission to access the microphone. This can be checked in the phone's Settings -> Apps -> Chrome -> Permissions.
-   **AI features not working**: This is likely an issue with the API key. Check the hosting environment to ensure the `API_KEY` is configured correctly and is not being blocked.---
