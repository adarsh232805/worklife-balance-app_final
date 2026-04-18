"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';

interface WellnessChartProps {
    data: any[];
}

export default function WellnessChart({ data }: WellnessChartProps) {
    if (!data || data.length === 0) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="col-span-full bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 relative overflow-hidden"
        >
            <div className="absolute top-0 right-0 p-32 bg-indigo-50/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 relative z-10">
                <div>
                    <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
                        <Activity className="text-indigo-500" size={24} />
                        Activity Trends
                    </h3>
                    <p className="text-slate-400 text-sm font-medium mt-1">Last 7 Days Performance</p>
                </div>
                <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-500 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
                        <span className="w-2 h-2 rounded-full bg-indigo-500"></span> Steps
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-500 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
                        <span className="w-2 h-2 rounded-full bg-cyan-400"></span> Water
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-500 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
                        <span className="w-2 h-2 rounded-full bg-fuchsia-400"></span> Yoga
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-500 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
                        <span className="w-2 h-2 rounded-full bg-violet-400"></span> Meditate
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-500 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
                        <span className="w-2 h-2 rounded-full bg-red-400"></span> Gym
                    </div>
                </div>
            </div>

            <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} barGap={4} barCategoryGap="20%">
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#94a3b8', fontSize: 12 }}
                            dy={10}
                        />
                        <Tooltip
                            cursor={{ fill: '#f8fafc' }}
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Bar dataKey="steps" fill="#6366f1" radius={[2, 2, 0, 0]} maxBarSize={20} />
                        <Bar dataKey="water" fill="#22d3ee" radius={[2, 2, 0, 0]} maxBarSize={20} />
                        <Bar dataKey="yoga" fill="#e879f9" radius={[2, 2, 0, 0]} maxBarSize={20} />
                        <Bar dataKey="meditation" fill="#a78bfa" radius={[2, 2, 0, 0]} maxBarSize={20} />
                        <Bar dataKey="workout" fill="#f87171" radius={[2, 2, 0, 0]} maxBarSize={20} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
}
