/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        telegram: {
          bg: '#17212b',
          secondary: '#242f3d',
          text: '#ffffff',
          button: '#3390ec',
          buttonHover: '#2d7fd1',
        }
      }
    },
  },
  plugins: [],
}

