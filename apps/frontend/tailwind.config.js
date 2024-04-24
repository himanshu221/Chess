/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'chessboard': "url('chessboard.jpeg')",
        'backboard' : "url('bg-board.jpeg')"
      }
    },
  },
  plugins: [],
}