/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
            "./app.{js,jsx,ts,tsx}", 
            "./app/**/*.{js,jsx,ts,tsx}",
            "./(tabs)/**/*.{js,jsx,ts,tsx}",
            "./(userTabs)/**/*.{js,jsx,ts,tsx}",
            "./auth/**/*.{js,jsx,ts,tsx}",
            "./src/components/**/*.{js,jsx,ts,tsx}",
          ],
  theme: {
    extend: {},
  },
  plugins: [],
}

