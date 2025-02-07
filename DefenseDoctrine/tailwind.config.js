/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  define: {
    module: {}, // Prevents "ReferenceError: module is not defined"
  },
  theme: {
    extend: {
      transformStyle: {
        'preserve-3d': 'preserve-3d',
      },
      backfaceVisibility: {
        hidden: 'hidden',
      },
      rotate: {
        'y-180': 'rotateY(180deg)',
      },
      colors: {
        olive: {
          300: '#B5B68C',
          700: '#6B8E23',
          800: '#556B2F',
        },
        khaki: {
          300: '#F0E68C',
          700: '#C3B091',
        },
      },
    },
  },
  plugins: [],
}

