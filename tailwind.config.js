/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'angry-red': '#FF4444',
        'calm-blue': '#4488FF',
        'neutral-gray': '#666666',
      }
    },
  },
  plugins: [],
}
