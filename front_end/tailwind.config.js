module.exports = {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#18216d",
        active: "#ff825c",
        third: "#FE7624",
      },

      grayscale: {
        25: "25%",
        50: "50%",
        75: "75%",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
