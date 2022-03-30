module.exports = {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
      colors: {
        // primary: rgba(24, 33, 109, 1)
        // active: rgb(255, 130, 92)
        // third: rgb(254, 118, 36)
        primary: "#18216d",
        glass_primary: "rgba(24, 33, 109, 0.2)",
        active: "#ff825c",
        third: "#FE7624",
        secondary: "rgba(255, 130, 92, 0.9)",
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
