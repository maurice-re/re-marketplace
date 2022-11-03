'use client'

import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from 'chart.js'
import { Bar, Doughnut } from 'react-chartjs-2'

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
)

export default function LifecycleChart({
  data,
  id,
  options,
  type,
}: {
  data: any
  id: string
  options?: any
  type: string
}) {
  if (type == 'bar') {
    return <Bar id={id} data={data} options={options} />
  } else if (type == 'doughnut') {
    return <Doughnut id={id} data={data} options={options} />
  }
  return <div />
}
