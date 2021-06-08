const { ScalarLeafs } = require("graphql/validation/rules/ScalarLeafs");
const colors = require("tailwindcss/colors");

module.exports = {
  purge: [
    "./src/**/*.html",
    "./src/**/*.tsx",
    "./pages/**/*.html",
    "./pages/**/*.tsx",
    "./components/**/*.tsx",
  ],
  darkMode: "class", // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        cyan: colors.cyan,
        teal: colors.teal,
      },
      inset: {
        "3/10": "30%",
        "15/40": "37.5%",
        "18/40": "45%",
        "21/40": "52.5%",
      },
      keyframes: {
        floatup: {
          "0%": { top: "80vh", opacity: "0" },
          "25%": { opacity: "1", transform: "scale(1.1)" },
          "50%": { top: "50vh", opacity: ".3" },
          "75%": { transform: "scale(0.5)" },
          "100%": { top: "0vh", opacity: "0" },
        },
      },
      animation: {
        floatup21: "floatup 2.1s infinite linear",
        floatup17: "floatup 1.7s infinite linear",
        floatup13: "floatup 1.3s infinite linear",
        floatup09: "floatup 0.9s infinite linear",
        floatup07: "floatup 0.7s infinite linear",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
