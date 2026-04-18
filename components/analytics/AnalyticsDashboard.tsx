"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { OverviewCards } from "./OverviewCards";
import { FocusInsights } from "./FocusInsights";
import { TaskBreakdown } from "./TaskBreakdown";
import { WellnessReport } from "./WellnessReport";
import { AIReport } from "./AIReport";
import { AICoachModal } from "./AICoachModal";
import { Loader2, Calendar, Sparkles } from "lucide-react";

type TimeRange = 'day' | 'week' | 'month';

export default function AnalyticsDashboard() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [range, setRange] = useState<TimeRange>('week');
    const [isCoachOpen, setIsCoachOpen] = useState(false);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                const res = await fetch(`/api/analytics?range=${range}`);
                const json = await res.json();
                setData(json);
            } catch (e) {
                console.error("Failed to fetch analytics", e);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [range]);

    if (!data && loading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <Loader2 className="animate-spin text-indigo-600" size={32} />
            </div>
        );
    }

    if (!data) return <div>Failed to load data</div>;

    return (
        <div className="space-y-6 pb-24">

            {/* CONTROLS */}
            <div className="flex justify-between items-center">
                <div className="flex bg-white p-1 rounded-xl shadow-sm border border-slate-200">
                    {(['day', 'week', 'month'] as TimeRange[]).map((r) => (
                        <button
                            key={r}
                            onClick={() => setRange(r)}
                            className={`px-4 py-1.5 rounded-lg text-sm font-bold capitalize transition-all ${range === r
                                ? 'bg-indigo-600 text-white shadow-md'
                                : 'text-slate-500 hover:text-slate-900'
                                }`}
                        >
                            {r}
                        </button>
                    ))}
                </div>
                <div className="flex items-center gap-2 text-slate-500 text-sm font-medium bg-slate-100 px-3 py-1.5 rounded-lg">
                    <Calendar size={14} />
                    {range === 'day' ? 'Today' : range === 'week' ? 'Last 7 Days' : 'Last 30 Days'}
                </div>
            </div>

            {loading ? (
                <div className="h-96 w-full flex items-center justify-center bg-white/50 backdrop-blur rounded-3xl">
                    <Loader2 className="animate-spin text-indigo-500" size={32} />
                </div>
            ) : (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-6"
                >
                    {/* 1. KEY METRICS (Top Row) */}
                    <OverviewCards
                        data={data.today}
                        user={data.user}
                    />

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* 2. FOCUS CHART (Main Area) */}
                        <div className="lg:col-span-2">
                            <FocusInsights data={data.charts.focusTrend} range={range} />
                        </div>

                        {/* 3. AI REPORT (Side Panel) */}
                        <div>
                            <AIReport report={data.report} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* 4. TASK BREAKDOWN */}
                        <TaskBreakdown data={data.charts.taskPieData} />

                        {/* 5. WELLNESS RADAR */}
                        <WellnessReport wellness={data.wellness} />
                    </div>

                    {/* AI COACH FLOATING BUTTON & MODAL */}
                    <div className="fixed bottom-24 right-6 md:bottom-8 md:right-8 z-50">
                        <button
                            onClick={() => setIsCoachOpen(true)}
                            className="group relative flex items-center gap-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-5 py-3.5 rounded-full shadow-lg shadow-indigo-500/30 hover:scale-105 hover:shadow-indigo-500/50 transition-all"
                        >
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full animate-ping" />
                            <Sparkles size={20} className="animate-pulse" />
                            <span className="font-bold pr-1">Ask Genius</span>
                        </button>
                    </div>

                    <AICoachModal
                        isOpen={isCoachOpen}
                        onClose={() => setIsCoachOpen(false)}
                        context={data}
                    />
                </motion.div>
            )}
        </div>
    );
}
