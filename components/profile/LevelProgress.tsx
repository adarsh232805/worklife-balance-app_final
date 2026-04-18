"use client";

import { motion } from "framer-motion";
import { Star, Trophy, Zap } from "lucide-react";

interface LevelProgressProps {
    level: number;
    xp: number;
    nextLevelXp: number;
}

export default function LevelProgress({ level, xp, nextLevelXp }: LevelProgressProps) {
    const progressPercent = Math.min(100, Math.max(0, (xp / nextLevelXp) * 100));
    const xpRemaining = nextLevelXp - xp;

    return (
        <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-indigo-500/20">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 blur-[80px] rounded-full -mr-20 -mt-20 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/20 blur-[60px] rounded-full -ml-10 -mb-10 pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                {/* Level Badge */}
                <div className="relative flex-shrink-0">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-yellow-400 to-orange-500 p-1 shadow-lg shadow-orange-500/30 flex items-center justify-center">
                        <div className="w-full h-full rounded-full bg-indigo-950 flex flex-col items-center justify-center border-4 border-indigo-900">
                            <span className="text-xs font-bold text-orange-400 uppercase tracking-widest">Level</span>
                            <span className="text-4xl font-black text-white leading-none">{level}</span>
                        </div>
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-indigo-600 text-white p-2 rounded-full border-4 border-indigo-900 shadow-sm">
                        <Trophy size={16} fill="currentColor" />
                    </div>
                </div>

                {/* Progress Info */}
                <div className="flex-1 w-full space-y-4">
                    <div className="flex justify-between items-end">
                        <div>
                            <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                                {level <= 5 ? "Novice Achiever" : level <= 10 ? "Productivity Pro" : "Zen Master"}
                            </h3>
                            <p className="text-indigo-200 text-sm font-medium flex items-center gap-2 mt-1">
                                <Zap size={14} className="text-yellow-400 fill-yellow-400" />
                                {xpRemaining} XP to Level {level + 1}
                            </p>
                        </div>
                        <div className="text-right">
                            <div className="text-2xl font-black text-white">{xp} <span className="text-sm font-bold text-slate-400">/ {nextLevelXp} XP</span></div>
                        </div>
                    </div>

                    {/* Bar */}
                    <div className="h-4 bg-slate-800 rounded-full overflow-hidden shadow-inner border border-white/5">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progressPercent}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 relative"
                        >
                            <div className="absolute top-0 right-0 bottom-0 w-1 bg-white/50 blur-[2px]" />
                            <div className="absolute inset-0 bg-white/10" />
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
