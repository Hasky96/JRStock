module.exports = {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
      colors: {
        theme: "#0E185F",
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
