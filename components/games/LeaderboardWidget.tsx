"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Crown, Medal, Loader2, User as UserIcon } from "lucide-react";
import { api } from "@/lib/api";

export default function LeaderboardWidget() {
    const [leaders, setLeaders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.leaderboard.getTop().then((data) => {
            setLeaders(data);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, []);

    if (loading) return (
        <div className="bg-slate-800/50 rounded-3xl p-6 border border-slate-700/50 h-full flex items-center justify-center min-h-[300px]">
            <Loader2 className="animate-spin text-indigo-400" />
        </div>
    );

    return (
        <div className="bg-slate-900 rounded-[2.5rem] p-6 border border-slate-800 relative overflow-hidden group h-full">
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent pointer-events-none" />

            <div className="flex items-center justify-between mb-6 relative z-10">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-yellow-500/10 rounded-xl">
                        <Trophy className="text-yellow-500" size={20} />
                    </div>
                    <h3 className="text-lg font-bold text-white">Top Performers</h3>
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-800 px-2 py-1 rounded-lg border border-slate-700">Weekly</span>
            </div>

            <div className="space-y-3 relative z-10">
                {leaders.map((user, i) => (
                    <motion.div
                        key={user.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className={`flex items-center justify-between p-3 rounded-2xl border transition-all hover:scale-[1.02] ${user.rank === 1 ? "bg-gradient-to-r from-yellow-500/20 to-yellow-600/5 border-yellow-500/30 shadow-lg shadow-yellow-500/5" :
                                user.rank === 2 ? "bg-slate-700/30 border-slate-600/30" :
                                    user.rank === 3 ? "bg-amber-800/20 border-amber-700/30" :
                                        "bg-slate-800/30 border-transparent hover:bg-slate-700/50"
                            } ${user.isCurrentUser ? "ring-2 ring-indigo-500 ring-offset-2 ring-offset-slate-900" : ""}`}
                    >
                        <div className="flex items-center gap-4">
                            <div className={`w-8 h-8 flex items-center justify-center font-black rounded-lg ${user.rank === 1 ? "text-yellow-400 drop-shadow-md" :
                                    user.rank === 2 ? "text-slate-300" :
                                        user.rank === 3 ? "text-amber-600" :
                                            "text-slate-500"
                                }`}>
                                {user.rank <= 3 ? <Medal size={20} /> : user.rank}
                            </div>
                            <div className="flex items-center gap-3">
                                {user.image ? (
                                    <img src={user.image} alt={user.name} className="w-8 h-8 rounded-full border border-slate-600" />
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-slate-400">
                                        <UserIcon size={14} />
                                    </div>
                                )}
                                <div>
                                    <p className={`text-sm font-bold truncate max-w-[100px] ${user.isCurrentUser ? "text-indigo-400" : "text-slate-200"}`}>
                                        {user.name}
                                    </p>
                                    <p className="text-[10px] text-slate-500 font-medium">Lvl {Math.floor(user.xp / 1000) + 1}</p>
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-black text-slate-200">{user.xp.toLocaleString()}</p>
                            <p className="text-[9px] text-slate-500 uppercase font-bold tracking-wider">XP</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
