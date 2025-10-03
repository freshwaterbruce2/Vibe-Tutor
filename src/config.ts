// Configuration for API endpoints
// PRODUCTION: Update PRODUCTION_BACKEND_URL with your Render.com deployment URL

const isDevelopment = import.meta.env.DEV;

// FIXED: Detect Capacitor by checking for multiple protocols and Capacitor global object
// Capacitor can use 'capacitor:', 'ionic:', or 'https:' (when androidScheme is set)
const isCapacitor =
  window.location.protocol === 'capacitor:' ||
  window.location.protocol === 'ionic:' ||
  (typeof window !== 'undefined' && 'Capacitor' in window);

// STEP 1: Deploy backend to Render.com
// STEP 2: Copy your Render URL here (e.g., https://vibe-tutor-backend.onrender.com)
const PRODUCTION_BACKEND_URL = 'https://vibe-tutor-backend.onrender.com';

// For local development with phone, use your computer's IP
// Find IP: Run 'ipconfig' in Command Prompt, look for "IPv4 Address"
const LOCAL_NETWORK_URL = 'http://172.23.64.1:3001';

// FIXED: Always use production backend for Capacitor/mobile builds
// Only use localhost when running in actual browser dev mode
export const API_CONFIG = {
  baseURL: isCapacitor
    ? PRODUCTION_BACKEND_URL
    : (isDevelopment ? 'http://localhost:3001' : PRODUCTION_BACKEND_URL),

  endpoints: {
    initSession: '/api/session/init',
    chat: '/api/chat',
    health: '/api/health'
  }
};

// Debug logging
console.log('[CONFIG] Environment:', {
  isDevelopment,
  isCapacitor,
  protocol: window.location.protocol,
  hasCapacitorGlobal: 'Capacitor' in window,
  baseURL: API_CONFIG.baseURL
});

export default API_CONFIG;
