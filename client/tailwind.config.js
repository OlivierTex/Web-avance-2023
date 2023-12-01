/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    //"./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./styles/**/*.{js,ts,jsx,tsx,mdx}",
    // Or if using `src` directory:
    //"./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        light: "#f1f1f1",
        dark: "#243447",
        "custom-blue": "#243c5a",
      },
      fontFamily: {
        custom: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
