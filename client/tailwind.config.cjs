/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'leagueGothic': ['League Gothic', 'sans-serif']
      }
    },
  },
  plugins: [],
}