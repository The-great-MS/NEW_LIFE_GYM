/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gymDark: '#0b130e',      // Ultra dark forest background
        gymCard: '#121e16',      // Dark card surface
        gymGreen: '#39b54a',     // Vibrant artificial grass green
        gymTextLight: '#e2e8f0', // Off-white text
      },
    },
  },
  plugins: [],
}
