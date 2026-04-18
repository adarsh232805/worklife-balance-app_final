"use client";


import { Reminder } from "./types";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { CheckCircle2, Clock, ListTodo, TrendingUp, AlertCircle } from "lucide-react";

interface ReminderStatsProps {
    reminders: Reminder[];
}

export default function ReminderStats({ reminders }: ReminderStatsProps) {
    const total = reminders.length;
    const completed = reminders.filter(r => r.completed).length;
    const active = total - completed;
    const overdue = reminders.filter(r => !r.completed && r.time < Date.now()).length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    const data = [
        { name: "Completed", value: completed, color: "#10b981" },
        { name: "Active", value: active, color: "#cbd5e1" },
    ];

    if (total === 0) return null;

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-2">
            {/* STAT 1: Completion Rate (Gradient) */}
            <div className="md:col-span-2 bg-gradient-to-br from-indigo-500 to-purple-600 p-5 rounded-2xl text-white shadow-lg shadow-indigo-500/20 relative overflow-hidden">
                <div className="relative z-10 flex justify-between items-center h-full">
                    <div>
                        <p className="text-indigo-100 text-sm font-medium mb-1">Productivity</p>
                        <h3 className="text-4xl font-bold">{completionRate}%</h3>
                        <p className="text-indigo-100 text-xs mt-2 opacity-80">
                            You've completed {completed} out of {total} tasks
                        </p>
                    </div>
                    <div className="h-24 w-24 opacity-90">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data}
                                    innerRadius={25}
                                    outerRadius={35}
                                    paddingAngle={5}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.name === "Completed" ? "#ffffff" : "rgba(255,255,255,0.2)"} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                {/* Decoration */}
                <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-32 h-32 bg-black/10 rounded-full blur-2xl" />
            </div>

            {/* STAT 2: Overdue (Alert) */}
            <div className={`p-5 rounded-2xl border flex flex-col justify-between ${overdue > 0
                ? "bg-red-50/50 border-red-100"
                : "bg-white/60 backdrop-blur-xl border-slate-100"}`}>
                <div className="flex justify-between items-start">
                    <div className={`p-2 rounded-xl ${overdue > 0 ? "bg-red-100 text-red-600" : "bg-emerald-100 text-emerald-600"}`}>
                        <AlertCircle size={20} />
                    </div>
                    {overdue > 0 && <span className="text-[10px] font-bold bg-red-100 text-red-600 px-2 py-0.5 rounded-full">ACTION NEEDED</span>}
                </div>
                <div>
                    <h3 className={`text-2xl font-bold ${overdue > 0 ? "text-red-600" : "text-slate-800"}`}>{overdue}</h3>
                    <p className={`text-sm font-medium ${overdue > 0 ? "text-red-500" : "text-slate-500"}`}>Overdue Tasks</p>
                </div>
            </div>

            {/* STAT 3: Active (Simple) */}
            <div className="bg-white/60 backdrop-blur-xl p-5 rounded-2xl border border-slate-100 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                    <div className="p-2 rounded-xl bg-blue-100 text-blue-600">
                        <ListTodo size={20} />
                    </div>
                </div>
                <div>
                    <h3 className="text-2xl font-bold text-slate-800">{active}</h3>
                    <p className="text-sm font-medium text-slate-500">Active Tasks</p>
                </div>
            </div>
        </div>
    );
}
