/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      colors: {
        brown: {
          DEFAULT: '#8b5e3c',
          dark: '#7a4f30',
          light: '#f6f2ee',
        },
      },
    },
  },
  plugins: [],
}
