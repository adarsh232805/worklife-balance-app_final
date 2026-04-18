"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Salad, Activity, Droplets } from "lucide-react";
import { api } from "@/lib/api";
import HydrationTracker from "./wellness/HydrationTracker";
import ActivityHub from "./wellness/ActivityHub";
import BMICalculator from "./wellness/BMICalculator";
import AICoachWidget from "./AICoachWidget";
import WellnessChart from "./wellness/WellnessChart";
import GoalSettingsModal from "./wellness/GoalSettingsModal";
import BreathingWidget from "./wellness/BreathingWidget";
import SleepTracker from "./wellness/SleepTracker";
import GratitudeJournal from "./wellness/GratitudeJournal";

export default function WellnessTab() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showGoalModal, setShowGoalModal] = useState(false);
    const [data, setData] = useState<{
        stats: { calories: number; water: number; exercise: number; yoga: number; meditation: number; workout: number };
        logs: any[];
        userProfile: { weight: number; height: number; goals: any };
        trends: any[];
    } | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setError(null);
            const [dailyRes, weeklyRes] = await Promise.all([
                api.health.getDaily(),
                api.health.getWeekly()
            ]);

            setData({
                stats: dailyRes.totals,
                logs: dailyRes.logs,
                userProfile: dailyRes.userProfile,
                trends: weeklyRes.trends
            });
        } catch (e: any) {
            console.error("Wellness Fetch Error:", e);
            setError(e.message || "Failed to load data");
        } finally {
            setLoading(false);
        }
    };

    const handleLog = async (type: string, value: number, title: string = '') => {
        try {
            await api.health.log({ type, value, title });
            fetchData();
        } catch (e) {
            console.error(e);
        }
    };

    const handleUpdateStats = async (weight: number, height: number) => {
        try {
            await api.health.updateUserStats({ weight, height });
            fetchData();
        } catch (e) {
            console.error(e);
        }
    };

    const handleUpdateGoals = async (goals: any) => {
        try {
            await api.health.updateUserStats(goals);
            fetchData();
        } catch (e) {
            console.error(e);
        }
    };

    // Derived Goals
    const GOALS = data?.userProfile?.goals || {
        caloricGoal: 2200,
        waterGoal: 2500,
        stepGoal: 10000,
        wellnessGoal: 60,
        yogaGoal: 30,
        meditationGoal: 15,
        workoutGoal: 60
    };

    // Calculate overall score
    const healthScore = data ? Math.min(100, Math.round(
        ((data.stats.calories / GOALS.caloricGoal) * 30) +
        ((data.stats.water / GOALS.waterGoal) * 30) +
        ((data.stats.exercise / GOALS.wellnessGoal) * 40)
    )) : 0;

    if (loading) {
        return <div className="p-10 text-center text-slate-400 animate-pulse">Loading Wellness Data...</div>;
    }

    if (error || !data) {
        return (
            <div className="p-10 text-center">
                <div className="text-red-500 mb-4">⚠️ {error || "Failed to load data"}</div>
                <button
                    onClick={() => { setLoading(true); fetchData(); }}
                    className="px-4 py-2 bg-slate-200 rounded-lg hover:bg-slate-300 font-bold text-slate-700"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-8">

            {/* HERDER & SCORE */}
            <section className="relative overflow-hidden bg-slate-900 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 text-white shadow-2xl shadow-indigo-500/20">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
                <div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-l from-indigo-900/50 to-transparent" />
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
                    <div className="text-center md:text-left">
                        <h2 className="text-2xl md:text-3xl font-black mb-1">Wellness Dashboard</h2>
                        <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
                            <p className="text-indigo-200 text-sm font-medium">Tracking your daily journey</p>
                            <button
                                onClick={() => setShowGoalModal(true)}
                                className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-full text-[10px] font-bold text-white transition-colors"
                            >
                                🎯 Edit Goals
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="relative w-32 h-32">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle cx="64" cy="64" r="56" className="stroke-slate-800" strokeWidth="8" fill="none" />
                                <motion.circle
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: healthScore / 100 }}
                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                    cx="64" cy="64" r="56"
                                    className="stroke-emerald-400"
                                    strokeWidth="8"
                                    fill="none"
                                    strokeLinecap="round"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-4xl font-black">{healthScore}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* AI COACH WIDGET */}
            <AICoachWidget />

            {/* MAIN TRACKERS GRID */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

                {/* row 1 */}
                <div className="lg:col-span-1 h-full">
                    <ActivityHub
                        stats={{
                            exercise: data.stats.exercise,
                            yoga: data.stats.yoga || 0,
                            meditation: data.stats.meditation || 0,
                            workout: data.stats.workout || 0
                        }}
                        goals={GOALS}
                        onLog={(type, duration) => handleLog(type, duration)}
                    />
                </div>

                <div className="lg:col-span-1 h-full">
                    <HydrationTracker
                        current={data.stats.water}
                        goal={GOALS.waterGoal || 2500}
                        onLog={(amount) => handleLog('water', amount)}
                    />
                </div>

                <div className="lg:col-span-1 h-full">
                    <BMICalculator
                        initialHeight={data.userProfile.height}
                        initialWeight={data.userProfile.weight}
                        onUpdate={handleUpdateStats}
                    />
                </div>

                {/* row 2: New Widgets */}
                <div className="lg:col-span-1 h-full">
                    <BreathingWidget />
                </div>

                <div className="lg:col-span-1 h-full">
                    <SleepTracker />
                </div>

                <div className="lg:col-span-1 h-full">
                    <GratitudeJournal />
                </div>
            </div>

            {/* CHART & ANALYSIS */}
            <WellnessChart data={data.trends} />

            {/* RECENT LOGS */}
            <section className="bg-white rounded-3xl p-6 border border-slate-100/50 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-6 px-2">Today's Activity Log</h3>
                <div className="space-y-3">
                    {data.logs.length === 0 ? (
                        <div className="text-center py-10 text-slate-400">No activity yet today. Let's get moving! 🚀</div>
                    ) : (
                        data.logs.map((log: any, i) => (
                            <motion.div
                                key={log._id || i}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="bg-slate-50 p-4 rounded-2xl flex items-center justify-between group hover:bg-slate-100 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`p-3 rounded-xl ${log.type === 'food' ? 'bg-orange-100 text-orange-600' :
                                        log.type === 'water' ? 'bg-sky-100 text-sky-600' :
                                            'bg-emerald-100 text-emerald-600'
                                        }`}>
                                        {log.type === 'food' ? <Salad size={20} /> :
                                            log.type === 'water' ? <Droplets size={20} /> :
                                                <Activity size={20} />}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-800 capitalize">{log.title || log.type}</h4>
                                        <p className="text-xs text-slate-500 font-medium">
                                            {new Date(log.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>
                                <span className="font-bold text-slate-700 bg-white px-3 py-1 rounded-lg text-sm shadow-sm">
                                    {log.value} {log.type === 'food' ? 'cal' : log.type === 'water' ? 'ml' : 'min'}
                                </span>
                            </motion.div>
                        ))
                    )}
                </div>
            </section>

            <GoalSettingsModal
                isOpen={showGoalModal}
                onClose={() => setShowGoalModal(false)}
                currentGoals={GOALS}
                onSave={handleUpdateGoals}
            />
        </div>
    );
}
