/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      boxShadow: {
        soft: "0 18px 50px rgba(24, 24, 27, 0.08)",
      },
    },
  },
  plugins: [],
};
