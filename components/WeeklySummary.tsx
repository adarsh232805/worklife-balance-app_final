"use client";
import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { api } from "@/lib/api";

export default function WeeklySummary() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.analytics.get().then((res) => {
      if (res.charts && res.charts.focusTrend) {
        setData(res.charts.focusTrend);
      }
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="h-40 flex items-center justify-center text-slate-400 text-xs">Loading stats...</div>;

  return (
    <div className="h-48 w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis
            dataKey="day"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#94a3b8', fontSize: 10 }}
            dy={10}
          />
          <Tooltip
            cursor={{ fill: '#f1f5f9', radius: 4 }}
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            formatter={(value: number) => [`${value} mins`, 'Focus']}
          />
          <Bar dataKey="minutes" radius={[4, 4, 4, 4]}>
            {data.map((entry: any, index: number) => (
              <Cell key={`cell-${index}`} fill={entry.minutes > 60 ? '#4f46e5' : '#c7d2fe'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
