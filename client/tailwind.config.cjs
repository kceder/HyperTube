/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'travolta': "url('./assets/travolta.gif')",
      },
      fontFamily: {
        'leagueGothic': ['League Gothic', 'sans-serif']
      }
    },
  },
  plugins: [],
}