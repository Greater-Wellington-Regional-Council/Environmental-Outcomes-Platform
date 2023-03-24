const defaultTheme = require('tailwindcss/defaultTheme');
const colors = require('tailwindcss/colors');

module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
      },
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: colors.black,
      white: colors.white,
      gray: colors.gray,
      red: colors.red,
      green: colors.green,
      nui: '#174A5B',
      'nui-20': '#D1DBDE',
      cuba: '#E73C3E',
      castlepoint: '#E1CD00',
      kaitoke: '#A9C23F',
      kapiti: '#00BAB3',
    },
  },
  plugins: [],
};
