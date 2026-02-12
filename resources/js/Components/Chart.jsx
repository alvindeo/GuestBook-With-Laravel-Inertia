import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function MyChart({ dataPoints = [] }) {
  const data = {
    labels: dataPoints.map(item => item.label),
    datasets: [
      {
        label: 'Jumlah Kunjungan',
        data: dataPoints.map(item => item.value),
        backgroundColor: '#ef4444', // Tailwind red-500
        borderRadius: 8, // Rounded corners for bars
        borderSkipped: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false, // Clean look
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
    },
  };

  return <Bar data={data} options={options} />;
}

