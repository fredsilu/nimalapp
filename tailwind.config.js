/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}", // Notez l'extension du fichier
    //"./<custom directory>/**/*.{js,jsx,ts,tsx}", // Si vous avez des composants dans un dossier spécifique
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
