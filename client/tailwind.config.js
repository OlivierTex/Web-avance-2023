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
    theme: {
    extend: {
      colors: {
          custom1: '#11151D',
          custom2: '#222D41',
          custom3: '#374158',
          custom4: '#7F5056',
          custom5: '#D76C58',
      },
    },
  },
  plugins: [],
}

