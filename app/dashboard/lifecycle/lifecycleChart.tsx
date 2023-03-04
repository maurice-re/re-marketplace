"use client";

import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function LifecycleChart({
  data,
  id,
  options,
  type,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
  id: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  options?: any;
  type: string;
}) {
  const _type = type ?? "bar";
  if (_type == "bar") {
    return <Bar id={id} data={data} options={options} />;
  } else if (_type == "doughnut") {
    return <Doughnut id={id} data={data} options={options} />;
  }
  return <div />;
}
