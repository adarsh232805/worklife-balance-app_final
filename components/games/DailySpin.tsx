"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gift, Sparkles, X } from "lucide-react";

export default function DailySpin() {
    const [spinning, setSpinning] = useState(false);
    const [reward, setReward] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);

    // Rewards list
    const REWARDS = [
        { label: "50 XP", color: "#6366f1", probability: 0.3 },
        { label: "100 XP", color: "#8b5cf6", probability: 0.2 },
        { label: "10 min Focus", color: "#10b981", probability: 0.2 },
        { label: "2x XP Buff", color: "#f59e0b", probability: 0.1 },
        { label: "Rare Badge", color: "#ec4899", probability: 0.05 },
        { label: "Try Again", color: "#64748b", probability: 0.15 },
    ];

    const handleSpin = () => {
        if (spinning) return;
        setSpinning(true);
        setReward(null);

        // Simulate spin duration
        setTimeout(() => {
            const random = Math.random();
            let cumulativeProbability = 0;
            let selected = REWARDS[REWARDS.length - 1];

            for (const r of REWARDS) {
                cumulativeProbability += r.probability;
                if (random <= cumulativeProbability) {
                    selected = r;
                    break;
                }
            }

            setReward(selected.label);
            setSpinning(false);
            setShowModal(true);
            // TODO: Call API to award reward
        }, 2000);
    };

    return (
        <>
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => !spinning && handleSpin()}
                className="relative group overflow-hidden bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-[2px] rounded-2xl"
            >
                <div className="bg-slate-900 rounded-2xl p-4 flex items-center gap-3 relative z-10">
                    <div className="p-3 bg-white/10 rounded-xl text-yellow-300">
                        <Gift size={24} className={spinning ? "animate-bounce" : ""} />
                    </div>
                    <div className="text-left">
                        <div className="font-bold text-white text-sm">Daily Luck</div>
                        <div className="text-indigo-200 text-xs">Spin & Win XP</div>
                    </div>
                </div>

                {/* Glow effect */}
                <div className="absolute inset-0 bg-white/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.button>

            {/* REWARD MODAL */}
            <AnimatePresence>
                {showModal && reward && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.5, rotate: -10 }}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            className="bg-slate-900 border border-slate-700 p-8 rounded-[2rem] text-center relative max-w-sm w-full shadow-2xl shadow-indigo-500/20"
                        >
                            <button
                                onClick={() => setShowModal(false)}
                                className="absolute top-4 right-4 p-2 bg-white/10 rounded-full text-white/50 hover:text-white"
                            >
                                <X size={20} />
                            </button>

                            <div className="mb-6 inline-block p-4 bg-indigo-500/20 rounded-full text-indigo-400">
                                <Sparkles size={40} />
                            </div>

                            <h3 className="text-3xl font-black text-white mb-2">
                                {reward === "Try Again" ? "Better Luck Next Time!" : "Congratulations!"}
                            </h3>

                            <div className="my-6">
                                <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-500">
                                    {reward}
                                </span>
                            </div>

                            <button
                                onClick={() => setShowModal(false)}
                                className="w-full py-3 bg-white text-slate-900 font-bold rounded-xl hover:bg-indigo-50 transition-colors"
                            >
                                Collect Reward
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
