"use client";
import { PieChart, Pie, Tooltip } from "recharts";

export default function WorkLifeChart() {
  const data = [
    { name: "Work", value: 6 },
    { name: "Life", value: 4 }
  ];

  return (
    <PieChart width={300} height={300}>
      <Pie data={data} dataKey="value" fill="#6366F1" />
      <Tooltip />
    </PieChart>
  );
}
