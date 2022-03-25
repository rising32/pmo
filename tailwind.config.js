module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'rouge-blue': '#DD0000',
        black: '#000000',
        link: '#488BCF',
        blue: '#1F6C98',
        yellow: '#FFFF00',
      },
    },
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
      '3xl': '1600px',
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      white: '#FFFFFF',
      black: '#000000',
      'light-gray': '#F2F2F2',
      'dark-gray': '#C4C4C4',
      input: 'rgba(250, 250, 250, 0.5)',
      submit: '#EC1C24',
      'main-back': '#14477E',
      'card-gray': '#6A798D',
      yellow: '#FFFF00',
      'rouge-blue': '#DD0000',
      'menu-back': '#365B9D',
    },
  },
  plugins: [],
};