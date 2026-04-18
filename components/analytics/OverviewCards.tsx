"use client";

import { motion } from "framer-motion";
import { Clock, CheckCircle2, Trophy, Flame } from "lucide-react";

export function OverviewCards({ data, user }: any) {
    const cards = [
        {
            label: "Today's Focus",
            value: `${data.focusMinutes}m`,
            sub: "Target: 120m",
            icon: Clock,
            color: "bg-indigo-500",
            text: "text-indigo-600",
            bg: "bg-indigo-50"
        },
        {
            label: "Tasks Done",
            value: data.tasksCompleted,
            sub: `${data.tasksPending} Pending`,
            icon: CheckCircle2,
            color: "bg-emerald-500",
            text: "text-emerald-600",
            bg: "bg-emerald-50"
        },
        {
            label: "Current Streak",
            value: `${user.streak} Days`,
            sub: "Keep it up!",
            icon: Flame,
            color: "bg-orange-500",
            text: "text-orange-600",
            bg: "bg-orange-50"
        },
        {
            label: "Total XP",
            value: user.xp.toLocaleString(),
            sub: `Lvl ${user.level}`,
            icon: Trophy,
            color: "bg-purple-500",
            text: "text-purple-600",
            bg: "bg-purple-50"
        },
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {cards.map((card, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 hover:shadow-md transition-shadow"
                >
                    <div className="flex justify-between items-start mb-3">
                        <div className={`p-2.5 rounded-xl ${card.bg} ${card.text}`}>
                            <card.icon size={20} />
                        </div>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900">{card.value}</h3>
                    <p className="text-xs font-medium text-slate-500 mb-1">{card.label}</p>
                    <p className="text-[10px] text-slate-400">{card.sub}</p>
                </motion.div>
            ))}
        </div>
    );
}
