/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./services/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        'vibe-purple': '#8B5CF6',
        'vibe-cyan': '#06B6D4',
        'vibe-pink': '#EC4899',
        'vibe-dark': '#0F0F23',
        'vibe-surface': '#1A1627'
      },
      screens: {
        'xs': '375px',  // Small phones
        'sm': '640px',  // Larger phones
        'md': '768px',  // Tablets
        'lg': '1024px', // Desktop
        'xl': '1280px', // Large desktop
      },
      fontSize: {
        // Mobile-optimized font sizes
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        // Mobile-specific sizes
        'mobile-xs': ['0.875rem', { lineHeight: '1.25rem' }],
        'mobile-sm': ['1rem', { lineHeight: '1.5rem' }],
        'mobile-base': ['1.125rem', { lineHeight: '1.75rem' }],
        'mobile-lg': ['1.25rem', { lineHeight: '1.875rem' }],
      },
      spacing: {
        // Touch-friendly spacing
        'touch': '44px', // Minimum touch target size
        'touch-sm': '36px',
        'touch-lg': '52px',
      },
      minHeight: {
        'touch': '44px',
        'touch-sm': '36px',
        'touch-lg': '52px',
      },
      minWidth: {
        'touch': '44px',
        'touch-sm': '36px',
        'touch-lg': '52px',
      },
      keyframes: {
        'fade-in-up': {
          '0%': {
            opacity: '0',
            transform: 'translateY(10px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          }
        }
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.3s ease-out'
      }
    },
  },
  plugins: [],
}