/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#effaf6", 100: "#d7f2e7", 200: "#b0e6d2",
          300: "#7fd4b8", 400: "#4cbd9b", 500: "#2aa583",
          600: "#1d856a", 700: "#1a6a56", 800: "#185445", 900: "#16463a",
        },
        sky2: { 100: "#e4f1fb", 300: "#9fcdf2", 500: "#3b94e0" },
        sun: { 100: "#fdf0d5", 300: "#f6cf7a", 500: "#eaa92e" },
        rose2: { 100: "#fde4ec", 300: "#f3a6c2", 500: "#e25c8a" },
        ink: "#1f2937",
      },
      boxShadow: {
        soft: "0 8px 30px -12px rgba(26,106,86,0.18)",
        card: "0 4px 20px -8px rgba(31,41,55,0.12)",
      },
      borderRadius: { xl2: "1.25rem", xl3: "1.75rem" },
      fontFamily: {
        sans: ["Tajawal", "ui-sans-serif", "system-ui", "Arial", "sans-serif"],
      },
    },
  },
  plugins: [],
};
