/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts,js}",
  ],
  theme: {
    extend: {
      fontFamily: {
        work: ['"Work Sans"', 'sans-serif'], // <- Ajout ici
       inter: ['Inter', 'sans-serif'],
      'open-sans': ['"Open Sans"', 'sans-serif'],
    },
    },
  },
  plugins: [],
}