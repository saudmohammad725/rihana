/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f5f3f0',
          100: '#e8e4dc',
          200: '#d1c9bb',
          300: '#b8a896',
          400: '#a08972',
          500: '#8b7355',
          600: '#6f5c45',
          700: '#5a4936',
          800: '#493a2c',
          900: '#3d3226',
        },
        luxury: {
          gold: '#C9A961',
          darkGold: '#B8984F',
          navy: '#1a2332',
          darkNavy: '#0f1419',
          cream: '#f8f6f3',
          beige: '#e8e4dc',
        }
      }
    },
  },
  plugins: [],
}

