import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export function PortfolioChart({ labels }) {
  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "최종 자산 비율",
      },
    },
  };

  const data = {
    labels: labels,
    datasets: [
      {
        label: "My First Dataset",
        data: [300, 50, 100],
        backgroundColor: [
          "rgba(14, 24, 95, 0.7)",
          "rgba(192, 59, 102, 0.7)",
          "rgba(255, 179, 82, 0.7)",
        ],
        borderColor: [
          "rgba(14, 24, 95)",
          "rgba(192, 59, 102)",
          "rgba(255, 179, 82)",
        ],
        offset: 10,
        hoverOffset: 4,
      },
    ],
  };

  return <Doughnut options={options} data={data} />;
}
