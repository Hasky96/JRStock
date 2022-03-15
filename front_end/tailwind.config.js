module.exports = {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
      colors: {
        theme: "#ffc42a",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
