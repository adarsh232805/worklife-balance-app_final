"use client";

import { motion } from "framer-motion";
import { Moon, Star } from "lucide-react";

export default function SleepTracker() {
    const data = [
        { day: "Mon", hours: 6.5 },
        { day: "Tue", hours: 7.2 },
        { day: "Wed", hours: 5.8 },
        { day: "Thu", hours: 8.0 },
        { day: "Fri", hours: 7.5 },
        { day: "Sat", hours: 9.0 },
        { day: "Sun", hours: 8.2 },
    ];

    const maxHours = 10;

    return (
        <div className="bg-white rounded-3xl p-6 shadow-xl shadow-indigo-500/10 border border-indigo-100 h-full flex flex-col">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className="text-xl font-bold text-indigo-900">Sleep Quality</h3>
                    <p className="text-indigo-400 text-sm font-medium">Last 7 Days</p>
                </div>
                <div className="p-3 bg-indigo-50 text-indigo-500 rounded-2xl">
                    <Moon size={24} />
                </div>
            </div>

            <div className="flex-1 flex items-end justify-between gap-2">
                {data.map((d, i) => (
                    <div key={i} className="flex flex-col items-center gap-2 group w-full">
                        <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: `${(d.hours / maxHours) * 100}%` }}
                            transition={{ delay: i * 0.1, duration: 0.5 }}
                            className={`w-full max-w-[12px] md:max-w-[16px] rounded-full relative group-hover:opacity-80 transition-opacity ${d.hours >= 8 ? "bg-emerald-400" : d.hours >= 6 ? "bg-indigo-400" : "bg-rose-400"
                                }`}
                        >
                            {/* Tooltip */}
                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                {d.hours} hrs
                            </div>
                        </motion.div>
                        <span className="text-[10px] md:text-xs font-bold text-slate-400 uppercase">{d.day}</span>
                    </div>
                ))}
            </div>

            <div className="mt-6 flex items-center justify-between p-4 bg-indigo-50 rounded-2xl">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-full text-amber-400">
                        <Star size={16} fill="currentColor" />
                    </div>
                    <div>
                        <div className="text-xs font-bold text-indigo-400 uppercase">Avg. Sleep</div>
                        <div className="text-xl font-black text-indigo-900">7.4h</div>
                    </div>
                </div>
                <button className="text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-white px-3 py-1.5 rounded-lg shadow-sm">
                    + Log
                </button>
            </div>
        </div>
    );
}
