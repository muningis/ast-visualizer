/** @type {import('tailwindcss').Config} */
export default {
  content: ["index.html", "src/**/*.mts", "src/**/*.tsx"],
  theme: {
    extend: {
      gridTemplateColumns: {
        "editor-collapsed": "0 100%",
        "editor-open": "50% 50%"
      }
    },
  },
  plugins: [],
}

