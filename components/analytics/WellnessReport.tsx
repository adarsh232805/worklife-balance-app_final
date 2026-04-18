"use client";

import { Moon, Activity, Droplets } from "lucide-react";

export function WellnessReport({ wellness }: any) {
    return (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 min-h-[300px]">
            <h3 className="font-bold text-lg text-slate-800 mb-6">Wellness Snapshot</h3>

            <div className="space-y-6">

                {/* SLEEP */}
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-indigo-50/50">
                    <div className="bg-indigo-100 p-3 rounded-full text-indigo-600">
                        <Moon size={20} />
                    </div>
                    <div>
                        <p className="text-sm text-slate-500 font-medium">Avg Sleep</p>
                        <p className="text-xl font-bold text-slate-800">{wellness.avgSleep || 0} hrs</p>
                    </div>
                </div>

                {/* WORKOUTS */}
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-rose-50/50">
                    <div className="bg-rose-100 p-3 rounded-full text-rose-600">
                        <Activity size={20} />
                    </div>
                    <div>
                        <p className="text-sm text-slate-500 font-medium">Active Sessions</p>
                        <p className="text-xl font-bold text-slate-800">{wellness.workouts || 0} this week</p>
                    </div>
                </div>

                {/* WATER - Placeholder if no data yet */}
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-cyan-50/50">
                    <div className="bg-cyan-100 p-3 rounded-full text-cyan-600">
                        <Droplets size={20} />
                    </div>
                    <div>
                        <p className="text-sm text-slate-500 font-medium">Hydration</p>
                        <p className="text-xl font-bold text-slate-800">Tracking...</p>
                    </div>
                </div>

            </div>
        </div>
    );
}
