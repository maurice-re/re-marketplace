/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'aquamarine-500' : '#7FFFD4',
        'aquamarine-400' : '#99FFDD',
        'aquamarine-300' : '#ADFFE4',
      },
      height: {
        '148': '37rem'
      }
    },
  },
  plugins: [],
}
