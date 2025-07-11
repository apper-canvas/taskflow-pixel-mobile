/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'display': ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        'body': ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#F0EEFF',
          100: '#E5DEFF',
          200: '#D1C1FF',
          300: '#B8A0FF',
          400: '#9D7AFF',
          500: '#5B4FE9',
          600: '#4A3FCE',
          700: '#3831B0',
          800: '#2A268A',
          900: '#1F1E63',
        },
        secondary: {
          50: '#F1EFFF',
          100: '#E7E3FF',
          200: '#D3CDFF',
          300: '#BEB4FF',
          400: '#A69AFF',
          500: '#7C71F5',
          600: '#6B5FDB',
          700: '#594FBE',
          800: '#463E9A',
          900: '#363074',
        },
        accent: {
          50: '#FFF1F1',
          100: '#FFE1E1',
          200: '#FFC8C8',
          300: '#FFA3A3',
          400: '#FF7070',
          500: '#FF6B6B',
          600: '#FF4747',
          700: '#FF2424',
          800: '#E01010',
          900: '#B80808',
        },
        surface: '#FFFFFF',
        background: '#F7F9FC',
        success: '#4ECDC4',
        warning: '#FFD93D',
        error: '#FF6B6B',
        info: '#4DABF7',
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'hover': '0 4px 16px rgba(0, 0, 0, 0.12)',
        'lifted': '0 8px 24px rgba(0, 0, 0, 0.16)',
      },
    },
  },
  plugins: [],
}