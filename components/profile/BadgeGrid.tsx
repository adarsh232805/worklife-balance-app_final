"use client";

import { motion } from "framer-motion";
import { Award, Zap, Flame, Crown, Target, Droplet, Moon, Sun } from "lucide-react";

interface Badge {
    id: string;
    name: string;
    description: string;
    icon: any;
    color: string;
    unlocked: boolean;
    dateUnlocked?: string;
}

const BADGES: Badge[] = [
    { id: '1', name: "Early Bird", description: "Completed a task before 8 AM", icon: Sun, color: "amber", unlocked: true, dateUnlocked: "2024-01-15" },
    { id: '2', name: "On Fire", description: "Reached a 7-day streak", icon: Flame, color: "orange", unlocked: true, dateUnlocked: "2024-01-20" },
    { id: '3', name: "Focus Master", description: "Accumulated 10 hours of focus", icon: Zap, color: "indigo", unlocked: true, dateUnlocked: "2024-02-01" },
    { id: '4', name: "Hydrated", description: "Hit water goal 5 days in a row", icon: Droplet, color: "cyan", unlocked: false },
    { id: '5', name: "Night Owl", description: "Completed a task after 10 PM", icon: Moon, color: "purple", unlocked: false },
    { id: '6', name: "Task Slayer", description: "Completed 100 tasks", icon: Target, color: "emerald", unlocked: false },
    { id: '7', name: "Zen Mode", description: "Meditated for 7 days straight", icon: Crown, color: "rose", unlocked: false },
    { id: '8', name: "Legend", description: "Reached Level 10", icon: Award, color: "yellow", unlocked: false },
];

export default function BadgeGrid() {
    const container = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const item = {
        hidden: { opacity: 0, scale: 0.8 },
        show: { opacity: 1, scale: 1 }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-800">Achievements</h3>
                <span className="text-xs font-bold bg-slate-100 text-slate-500 px-3 py-1 rounded-full uppercase tracking-wide">
                    {BADGES.filter(b => b.unlocked).length} / {BADGES.length} Unlocked
                </span>
            </div>

            <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {BADGES.map((badge) => {
                    const ColorIcon = badge.icon;
                    const colorStyles = {
                        amber: "bg-amber-100 text-amber-600 border-amber-200",
                        orange: "bg-orange-100 text-orange-600 border-orange-200",
                        indigo: "bg-indigo-100 text-indigo-600 border-indigo-200",
                        cyan: "bg-cyan-100 text-cyan-600 border-cyan-200",
                        purple: "bg-purple-100 text-purple-600 border-purple-200",
                        emerald: "bg-emerald-100 text-emerald-600 border-emerald-200",
                        rose: "bg-rose-100 text-rose-600 border-rose-200",
                        yellow: "bg-yellow-100 text-yellow-600 border-yellow-200",
                    }[badge.color] || "bg-slate-100 text-slate-600 border-slate-200";

                    return (
                        <motion.div
                            key={badge.id}
                            variants={item}
                            className={`relative p-4 rounded-3xl border text-center flex flex-col items-center gap-3 transition-all duration-300 group hover:scale-[1.02] ${badge.unlocked
                                ? "bg-white border-slate-100 shadow-sm hover:shadow-md"
                                : "bg-slate-50 border-slate-100 opacity-60 grayscale"
                                }`}
                        >
                            <div className={`p-4 rounded-2xl ${badge.unlocked ? colorStyles : "bg-slate-200 text-slate-400"}`}>
                                <ColorIcon size={24} fill={badge.unlocked ? "currentColor" : "none"} />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-800 text-sm leading-tight mb-1">{badge.name}</h4>
                                <p className="text-[10px] text-slate-400 font-medium leading-snug">{badge.description}</p>
                            </div>

                            {badge.unlocked && (
                                <div className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full ring-4 ring-white" />
                            )}
                        </motion.div>
                    );
                })}
            </motion.div>
        </div>
    );
}
