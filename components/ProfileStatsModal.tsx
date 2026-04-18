"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Flame, Star, X, Target, Clock, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function ProfileStatsModal({
    isOpen,
    onClose
}: {
    isOpen: boolean;
    onClose: () => void
}) {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isOpen) {
            fetchStats();
        }
    }, [isOpen]);

    const fetchStats = async () => {
        setLoading(true);
        try {
            // Fetch both gamification progress and analytics
            const [progress, analytics] = await Promise.all([
                api.user.getProgress(),
                api.analytics.get()
            ]);

            setStats({ ...progress, ...analytics });
        } catch (error) {
            console.error("Failed to fetch profile stats", error);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    const progressPercent = stats ? Math.min(100, (stats.xp / stats.nextLevelXp) * 100) : 0;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    onClick={onClose}
                />

                {/* Modal */}
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="relative bg-white w-full max-w-md max-h-[90vh] overflow-y-auto hide-scrollbar rounded-3xl shadow-2xl flex flex-col"
                >
                    {/* Header with Gradient */}
                    <div className="relative shrink-0 h-32 bg-gradient-to-br from-indigo-600 to-purple-700 p-6 flex justify-end">
                        <button
                            onClick={onClose}
                            className="relative z-20 p-2 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors backdrop-blur-md"
                        >
                            <X size={20} />
                        </button>

                        {/* Decorative Circles */}
                        <div className="absolute top-0 left-0 w-48 h-48 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl" />
                        <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-500/30 rounded-full translate-x-1/3 translate-y-1/3 blur-xl" />
                    </div>

                    {/* Profile Content */}
                    <div className="px-8 pb-8 -mt-16 relative z-10">
                        {/* Avatar/Badge */}
                        <div className="flex justify-center mb-6">
                            <div className="w-24 h-24 bg-white p-1 rounded-full shadow-xl relative">
                                <div className="w-full h-full rounded-full bg-gradient-to-tr from-yellow-400 to-orange-500 flex items-center justify-center text-white text-3xl font-black shadow-inner">
                                    {stats?.level || 1}
                                </div>
                                <div className="absolute bottom-0 right-0 bg-indigo-600 text-white text-xs font-bold px-2 py-0.5 rounded-full border-2 border-white shadow-sm">
                                    LVL
                                </div>
                            </div>
                        </div>

                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-slate-800">
                                {stats?.level <= 5 ? "Novice Achiever" : stats?.level <= 10 ? "Productivity Pro" : "Zen Master"}
                            </h2>
                            <p className="text-slate-500 font-medium">Keep pushing your limits!</p>
                        </div>

                        {loading ? (
                            <div className="py-12 flex justify-center text-indigo-500">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-current"></div>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {/* XP Progress */}
                                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                                    <div className="flex justify-between items-end mb-2">
                                        <span className="text-sm font-bold text-slate-600 flex items-center gap-2">
                                            <Star size={16} className="text-yellow-500 fill-yellow-500" />
                                            XP Progress
                                        </span>
                                        <span className="text-xs font-bold text-slate-400">
                                            {stats.xp} / <span className="text-slate-600">{stats.nextLevelXp}</span> XP
                                        </span>
                                    </div>
                                    <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${progressPercent}%` }}
                                            className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"
                                        />
                                    </div>
                                </div>

                                {/* Stats Grid */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100 flex flex-col items-center justify-center text-center">
                                        <Flame className="text-orange-500 mb-2 fill-orange-500" size={24} />
                                        <span className="text-2xl font-black text-slate-800 mb-1">{stats.streak}</span>
                                        <span className="text-xs font-bold text-orange-600 uppercase tracking-wide">Day Streak</span>
                                    </div>

                                    <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-100 flex flex-col items-center justify-center text-center">
                                        <Clock className="text-indigo-600 mb-2" size={24} />
                                        <span className="text-2xl font-black text-slate-800 mb-1">{Math.floor((stats.focusMinutes || 0) / 60)}h {(stats.focusMinutes || 0) % 60}m</span>
                                        <span className="text-xs font-bold text-indigo-600 uppercase tracking-wide">Total Focus</span>
                                    </div>

                                    <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 flex flex-col items-center justify-center text-center">
                                        <Target className="text-emerald-600 mb-2" size={24} />
                                        <span className="text-2xl font-black text-slate-800 mb-1">{stats.tasksCompleted || 0}</span>
                                        <span className="text-xs font-bold text-emerald-600 uppercase tracking-wide">Tasks Done</span>
                                    </div>

                                    <div className="bg-purple-50 p-4 rounded-2xl border border-purple-100 flex flex-col items-center justify-center text-center">
                                        <Trophy className="text-purple-600 mb-2" size={24} />
                                        <span className="text-2xl font-black text-slate-800 mb-1 leading-none">{Math.floor(stats.xp / 1000)}k</span>
                                        <span className="text-[10px] font-bold text-purple-600 uppercase tracking-wide">Total XP</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
