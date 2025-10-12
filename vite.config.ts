import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    return {
      plugins: [react()],
      define: {
        // NO API KEYS IN CLIENT CODE - Security fix
        'process.env.NODE_ENV': JSON.stringify(mode),
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      server: {
        proxy: {
          // Proxy API calls to backend during development
          '/api': {
            target: 'http://localhost:3001',
            changeOrigin: true
          }
        }
      }
    };
});
