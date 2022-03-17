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
          "rgb(254, 138, 125, 0.5)",
          "rgb(147, 197, 253, 0.5)",
          "rgb(255, 196, 42, 0.5)",
        ],
        borderColor: [
          "rgb(254, 138, 125)",
          "rgb(147, 197, 253)",
          "rgb(255, 196, 42)",
        ],
        offset: 10,
        hoverOffset: 4,
      },
    ],
  };

  return <Doughnut options={options} data={data} />;
}
