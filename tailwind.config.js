/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'aquamarine-800' : '#58B294',
        'aquamarine-700' : '#65CCA9',
        'aquamarine-600' : '#72E5BE',
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
