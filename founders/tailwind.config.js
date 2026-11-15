/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        horizon: {
          DEFAULT: '#79addc',
          50: '#f0f6fc',
          100: '#e1edfa',
          200: '#bddaf4',
          300: '#9ec6ee',
          400: '#79addc',
          500: '#5893cb',
          600: '#3e76ad',
          700: '#2f5b87',
          800: '#234465',
          900: '#193047',
        },
        peach: {
          DEFAULT: '#ffc09f',
          light: '#fff1ea',
          dark: '#e08f65',
        },
        gold: {
          DEFAULT: '#ffee93',
          light: '#fffbe3',
          dark: '#d6be38',
        },
        chiffon: {
          DEFAULT: '#fcf5c7',
          light: '#fefcee',
          dark: '#cfc470',
        },
        celadon: {
          DEFAULT: '#adf7b6',
          light: '#eafdeb',
          dark: '#2c8f43',
        },
      },
      fontFamily: {
        ubuntu: ['var(--font-ubuntu)', 'Ubuntu', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
