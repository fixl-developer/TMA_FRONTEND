/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./shared/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: { display: ["var(--font-playfair)", "Georgia", "serif"] },
    },
  },
  plugins: [],
}
