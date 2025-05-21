import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface SystemData {
  cpu: number;
  memory: {
    total: number;
    used: number;
    percent: number;
  };
  network: {
    rx: number;
    tx: number;
  };
}

interface NetworkChartProps {
  data: SystemData[] | null | undefined;
}

export default function NetworkChart({ data }: NetworkChartProps) {
  // Ensure data is an array and has valid entries
  const validData = Array.isArray(data) ? data : [];
  const rx = validData.map((d) => d?.network?.rx ?? 0);
  const tx = validData.map((d) => d?.network?.tx ?? 0);

  return (
    <Line
      data={{
        labels: rx.map((_, i) => i),
        datasets: [
          {
            label: "Received",
            data: rx,
            borderColor: "var(--color-chart-3)",
            backgroundColor: "var(--color-chart-3)",
            tension: 0.1,
            fill: false,
            pointRadius: 0,
            borderWidth: 2,
          },
          {
            label: "Transmitted",
            data: tx,
            borderColor: "var(--color-chart-4)",
            backgroundColor: "var(--color-chart-4)",
            tension: 0.1,
            fill: false,
            pointRadius: 0,
            borderWidth: 2,
          },
        ],
      }}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: "top",
            labels: {
              color: "var(--color-foreground)",
              usePointStyle: true,
              pointStyle: "line",
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: "var(--color-border)",
            },
            ticks: {
              color: "var(--color-foreground)",
            },
          },
          x: {
            grid: {
              display: false,
            },
            ticks: {
              display: false,
            },
          },
        },
      }}
    />
  );
}
