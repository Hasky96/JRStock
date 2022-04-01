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

// z-index 대략 정리
/**
 * Header.jsx = 150
 * OnOffToggle = 10
 * Pagenation, Pagenation2 = 10
 * StockSelectModal = 20000
 * StrategyConfig = 100
 * ProfitLineChart = 10
 * Dialog = 500
 * Loading = 30
 * Tooltip = 아이콘-80, 내용 - 140
 * Tooltip2 = 60
 * Landing = 10
 * CandleChart = 20
 * interested = 50
 * MyStock Modal = 500
 * passwordHide = 20
 * Sidebar = 200
 * Dialog2 = 500
 * CandleChart = 20
 * StockItemList Modal = 500
 */
