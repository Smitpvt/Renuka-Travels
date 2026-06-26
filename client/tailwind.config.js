/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#F97316",
        cream: "#FFF7ED",
        "light-gray": "#F8FAFC",
        "text-dark": "#1E293B",
        white: "#FFFFFF",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        headings: ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [],
}
