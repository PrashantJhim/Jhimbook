module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily:{
        Main:['Pattaya'],
        Secondary:['Teko'],
        Third:['Rajdhani']
      },
      colors:{
        primary:'#dc143c',
        Insta:"#458eff"
      }
    },
  },
  variants: {
    variants: {
      extend: {
        backgroundColor: ['active'],
      }
    },
  },
  plugins: [],
}
