/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#18231d",
        paper: "#f4f0e7",
        sage: "#5d745e",
        amber: "#d89b54",
      },
      boxShadow: {
        card: "0 24px 70px rgba(24, 35, 29, 0.12)",
      },
    },
  },
  plugins: [],
};
