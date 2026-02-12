import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function InstitutionChart({ dataPoints = [] }) {
  const data = {
    labels: dataPoints.map(item => item.label),
    datasets: [
      {
        data: dataPoints.map(item => item.value),
        backgroundColor: [
          '#991b1b', // red-800
          '#ef4444', // red-500
          '#fca5a5', // red-300
          '#450a0a', // red-950
          '#dc2626', // red-600
        ],
        borderWidth: 2,
        borderColor: '#ffffff',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // We will custom legend below
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    },
  };

  return (
    <div className="flex flex-col items-center h-full">
      <div className="flex-1 w-full min-h-0">
        <Pie data={data} options={options} />
      </div>
      
      {/* Custom Legend */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-6 w-full text-[11px]">
        {dataPoints.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div 
              className="w-2 h-2 rounded-full shrink-0" 
              style={{ backgroundColor: data.datasets[0].backgroundColor[index] }}
            />
            <span className="text-gray-600 truncate font-medium">{item.label}</span>
            <span className="text-gray-400 ml-auto">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
