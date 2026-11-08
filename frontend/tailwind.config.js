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
        terminal: {
          bg: '#0a0c10',
          card: '#12161f',
          surface: '#181d28',
          border: '#232936',
          muted: '#8b949e',
          text: '#f0f3f6',
        },
        accent: {
          green: '#10b981',
          emerald: '#059669',
          glow: '#00ff87',
          dim: 'rgba(16, 185, 129, 0.15)',
        }
      },
      boxShadow: {
        'glow-sm': '0 0 15px rgba(16, 185, 129, 0.15)',
        'glow-md': '0 0 25px rgba(16, 185, 129, 0.25)',
        'glow-lg': '0 0 40px rgba(0, 255, 135, 0.2)',
      }
    },
  },
  plugins: [],
}

