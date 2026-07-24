/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        accent: {
          50: '#f2f1ff',
          100: '#e6e4ff',
          200: '#cdc9ff',
          300: '#aea7ff',
          400: '#8f83ff',
          500: '#7c6df2',
          600: '#6656d1',
          700: '#5344a8',
          800: '#403483',
          900: '#2d2560',
          950: '#1c1740',
        },
      },
      fontFamily: {
        sans: ['"Inter"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['"Source Serif 4"', 'ui-serif', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}
