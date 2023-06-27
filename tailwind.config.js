/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,html}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'marquee': 'marquee 40s linear infinite',
        'marquee2': 'marquee2 40s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        marquee2: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0%)' },
        }
      },
      borderRadius: {
        '10': '10px',
      },
      borderWidth: {
        '1/2': '0.5px',
        '3': '3px'
      },
      colors: {
        'aquamarine-800': '#58B294',
        'aquamarine-700': '#65CCA9',
        'aquamarine-600': '#72E5BE',
        'aquamarine-500': '#7FFFD4',
        'aquamarine-400': '#99FFDD',
        'aquamarine-300': '#ADFFE4',
        're-black': '#001012',
        're-blue-300': '#755EFF',
        're-blue-400': '#644AFF',
        're-blue-500': '#5336FF',
        're-gray-text': '#767676',
        're-green-800': '#3DB189',
        're-green-700': '#46CB9C',
        're-green-600': '#4FE4B0',
        're-green-500': '#58FEC4',
        're-green-400': '#68FEC9',
        're-green-300': '#79FECF',
        're-green-200': '#8AFED5',
        're-green-100': '#9AFEDB',
        're-purple-700': '#432BCC',
        're-purple-600': '#4B30E6',
        're-purple-500': '#5336FF',
        're-purple-400': '#654AFF',
        're-purple-300': '#765EFF',
        're-gray-100': '#5D5D5D',
        're-gray-200': '#505050',
        're-gray-300': '#434343',
        're-gray-400': '#353535',
        're-gray-500': '#2B2B2B',
        're-dark-green-100': '#1d2a2c',
        're-dark-green-200': '#142325',
        're-dark-green-300': '#0a1e20',
        're-dark-green-400': '#081719',
        're-dark-green-500': '#001517',
        're-dark-green-600': '#0C2224',
        're-product-gray': '#586168',
        're-product-green': '#00474F',
        're-table-even': '#0D2527',
        're-table-hover': '#23393B',
        're-table-odd': '#0D2A2D',
        'stripe-gray': '#30313d',
        're-gray-active': '#677475',
        're-gray-button': '#1E3032',
        're-graph-green': '#00DEA3',
        're-graph-blue': '#5459EA',
        're-graph-pink': '#D40C98'
      },
      fontFamily: {
        'theinhardt': ["Theinhardt", "sans-serif"],
        'theinhardt-300': ["Theinhardt-300", "sans-serif"],
        'theinhardt-italics': ["Theinhardt-italics", "sans-serif"]
      },
      fontSize: {
        'sm-25': ['25px', '28px'],
        '25': ['25px', '38px'],
        '28': ['28px', '38px'],
        '35': ['35px', '40px']
      },
      height: {
        '100': '25rem',
        '104': '26rem',
        '120': '30rem',
        '124': '31rem',
        '128': '32rem',
        '148': '37rem'
      },
      width: {
        '68': '17rem',
        '120': '30rem',
        '124': '31rem',
        '128': '32rem',
        '140': '35rem',
        '144': '36rem',
        '148': '37rem',
        '7/10': '70%'
      }
    },
  },
  plugins: [require("daisyui")],
};
