/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#10B981',
        secondary: '#059669',
        accent: '#34D399',
      }
    },
  },
  plugins: [],
}