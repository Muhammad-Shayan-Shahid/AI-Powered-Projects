/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#16213E",
        cloud: "#F4F7FB",
        signal: "#2F6FED",
        signalDark: "#2559C9",
        charcoal: "#1F2733",
      },
      fontFamily: {
        display: ['"Fraunces"', "serif"],
        sans: ['"Manrope"', "sans-serif"],
        body: ['"Inter"', "sans-serif"],
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};
