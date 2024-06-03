/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  variants: {
    extend: {
      backgroundColor: ['disabled'],
    }
  },
  theme: {
    extend: {
      backgroundImage: {
        'chessboard': "url('/chessboard.jpeg')",
        'backboard' : "url('/woodboard.jpeg')"
      }
    },
  },
  plugins: [],
}
