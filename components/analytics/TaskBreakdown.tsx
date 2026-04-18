"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export function TaskBreakdown({ data }: { data: any[] }) {
    // Handle empty state
    if (!data || data.length === 0) {
        return (
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex items-center justify-center min-h-[300px]">
                <p className="text-slate-400">No task data available yet.</p>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 min-h-[300px]">
            <h3 className="font-bold text-lg text-slate-800 mb-6">Task Distribution</h3>

            <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
                        <Legend verticalAlign="bottom" height={36} iconType="circle" />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
