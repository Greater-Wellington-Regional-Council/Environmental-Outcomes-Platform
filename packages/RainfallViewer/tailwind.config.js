const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
    './.storybook/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'davy-gray': '#4f4f4f',
        'indigo-dye': '#00526e',
      },
    },
    fontFamily: {
      sans: ['var(--font-inter)', ...defaultTheme.fontFamily.sans],
    },
  },
  plugins: [
    require('postcss-nesting'),
    require('tailwindcss'),
    require('autoprefixer'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
  ],
};
