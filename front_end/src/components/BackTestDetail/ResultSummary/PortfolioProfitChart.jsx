import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export function PortfolioProfitChart({ labels }) {
  const options = {
    responsive: true,
    plugins: {},
    scales: {
      "y-right": {
        display: true,
        position: "right",
      },
    },
  };

  const data = {
    labels: labels,
    datasets: [
      {
        label: "초기 자본",
        barPercentage: 0.7,
        yAxisID: "y-right",
        data: [57.6, 46.8, 200.5],
        backgroundColor: ["rgba(255, 205, 86, 0.3)"],
        borderWidth: 1,
      },
      {
        label: "최종 자본",
        barPercentage: 0.7,
        yAxisID: "y-right",
        data: [257.6, 96.8, 600.5],
        backgroundColor: ["rgba(255, 205, 86, 0.9)"],
        borderWidth: 1,
      },
    ],
  };

  return <Bar options={options} data={data} />;
}
