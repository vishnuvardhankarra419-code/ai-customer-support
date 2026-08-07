/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#f0f4ff',
          100: '#e0e9ff',
          200: '#c7d6ff',
          300: '#a4b9ff',
          400: '#7c93fc',
          500: '#5c6ef8',
          600: '#4a52ed',
          700: '#3d3fd3',
          800: '#3335aa',
          900: '#2e3286',
          950: '#1c1d50',
        },
        dark: {
          50:  '#f8f8fa',
          100: '#f0f0f5',
          200: '#dedee8',
          300: '#c2c2d4',
          400: '#9696b4',
          500: '#757594',
          600: '#5c5c7a',
          700: '#4a4a63',
          800: '#3e3e54',
          900: '#1a1a2e',
          950: '#0f0f1a',
        },
        accent: {
          teal:   '#00d2c8',
          purple: '#a855f7',
          amber:  '#f59e0b',
          rose:   '#f43f5e',
          green:  '#22c55e',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'fade-in':     'fadeIn 0.3s ease-in-out',
        'slide-up':    'slideUp 0.3s ease-out',
        'slide-in':    'slideIn 0.3s ease-out',
        'bounce-dots': 'bounceDots 1.4s infinite ease-in-out both',
        'pulse-slow':  'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow':        'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { transform: 'translateY(16px)', opacity: '0' },
          '100%': { transform: 'translateY(0)',    opacity: '1' },
        },
        slideIn: {
          '0%':   { transform: 'translateX(-16px)', opacity: '0' },
          '100%': { transform: 'translateX(0)',      opacity: '1' },
        },
        bounceDots: {
          '0%, 80%, 100%': { transform: 'scale(0)' },
          '40%':           { transform: 'scale(1)' },
        },
        glow: {
          '0%':   { boxShadow: '0 0 5px rgb(92 110 248 / 0.3)' },
          '100%': { boxShadow: '0 0 20px rgb(92 110 248 / 0.8)' },
        },
      },
      backgroundImage: {
        'gradient-radial':  'radial-gradient(var(--tw-gradient-stops))',
        'mesh-gradient':    'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
