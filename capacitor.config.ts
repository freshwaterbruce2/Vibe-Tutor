import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.vibetech.tutor',
  appName: 'Vibe Tutor',
  webDir: 'dist',
  server: {
    androidScheme: 'https',  // Use HTTPS for better security and PWA features
    cleartext: false
  },
  plugins: {
    // CRITICAL FIX: Enable CapacitorHttp plugin to bypass CORS issues
    // This routes fetch/XMLHttpRequest through native code instead of WebView
    CapacitorHttp: {
      enabled: true
    }
  },
  android: {
    allowMixedContent: false,  // Disabled mixed content for security
    backgroundColor: '#0F0F23',  // Match app background
    webContentsDebuggingEnabled: true,  // Enable for debugging (disable in production)
    appendUserAgent: 'VibeTutor/1.0.1'
  }
};

export default config;
