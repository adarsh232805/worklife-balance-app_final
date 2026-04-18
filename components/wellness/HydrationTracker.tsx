"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Droplets, Plus, Minus } from "lucide-react";
import { api } from "@/lib/api";

interface HydrationTrackerProps {
    current: number; // in ml
    goal: number; // in ml
    onLog: (amount: number) => void;
}

export default function HydrationTracker({ current, goal, onLog }: HydrationTrackerProps) {
    const [adding, setAdding] = useState(false);

    const percentage = Math.min(100, (current / goal) * 100);

    // Wave animation variant
    const waveVariants = {
        animate: {
            x: ["0%", "-50%"],
            transition: {
                x: {
                    repeat: Infinity,
                    repeatType: "loop" as const,
                    duration: 5,
                    ease: "linear" as const,
                },
            },
        },
    };

    const handleAdd = async (amount: number) => {
        setAdding(true);
        await onLog(amount);
        setTimeout(() => setAdding(false), 500);
    }

    return (
        <div className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/60 border border-slate-100/50 relative overflow-hidden h-full flex flex-col justify-between">
            <div className="flex justify-between items-start z-10 relative">
                <div>
                    <h3 className="text-xl font-bold text-slate-700">Hydration</h3>
                    <p className="text-slate-400 text-sm font-medium">Daily Goal: {goal}ml</p>
                </div>
                <div className="p-3 bg-sky-50 text-sky-500 rounded-2xl">
                    <Droplets size={24} fill="currentColor" />
                </div>
            </div>

            {/* Central Water Graphic */}
            <div className="relative flex-1 flex items-center justify-center my-6">
                <div className="w-40 h-56 border-4 border-slate-100 rounded-[2rem] relative overflow-hidden bg-slate-50 shadow-inner">

                    {/* Background Level */}
                    <motion.div
                        className="absolute bottom-0 left-0 w-full bg-sky-200/30"
                        initial={{ height: 0 }}
                        animate={{ height: `${percentage}%` }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                    />

                    {/* Wave Animation */}
                    <motion.div
                        className="absolute bottom-0 left-0 w-[200%] h-full"
                        initial={{ y: "100%" }}
                        animate={{ y: `${100 - percentage}%` }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                    >
                        <div className="relative w-full h-full">
                            <motion.div
                                className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-sky-500 to-cyan-400 opacity-90"
                                style={{
                                    clipPath: "polygon(0% 10%, 15% 12%, 33% 8%, 52% 11%, 70% 9%, 86% 12%, 100% 10%, 100% 100%, 0% 100%)",
                                    marginTop: "-10px" // Slight offset to cover gap
                                }}
                                animate={{ x: ["-50%", "0%"] }}
                                transition={{ repeat: Infinity, duration: 5, ease: "linear" }}
                            />
                            <motion.div
                                className="absolute top-2 left-0 w-full h-full bg-sky-400 opacity-50"
                                style={{
                                    clipPath: "polygon(0% 12%, 18% 9%, 35% 13%, 50% 10%, 68% 12%, 85% 9%, 100% 12%, 100% 100%, 0% 100%)",
                                    marginTop: "-10px"
                                }}
                                animate={{ x: ["0%", "-50%"] }}
                                transition={{ repeat: Infinity, duration: 7, ease: "linear" }}
                            />
                        </div>
                    </motion.div>

                    {/* Bubbles */}
                    <motion.div
                        initial={{ y: 200, opacity: 0 }}
                        animate={{ y: -50, opacity: [0, 1, 0] }}
                        transition={{ repeat: Infinity, duration: 3, ease: "easeIn", delay: 1 }}
                        className="absolute bottom-0 left-8 w-2 h-2 bg-white/50 rounded-full z-10"
                    />
                    <motion.div
                        initial={{ y: 200, opacity: 0 }}
                        animate={{ y: -50, opacity: [0, 1, 0] }}
                        transition={{ repeat: Infinity, duration: 4, ease: "easeIn", delay: 2.5 }}
                        className="absolute bottom-0 right-10 w-3 h-3 bg-white/30 rounded-full z-10"
                    />

                    <div className="absolute inset-0 flex items-center justify-center z-20">
                        <div className="text-center">
                            <span className="text-3xl font-black text-slate-800 mix-blend-overlay">{Math.round(percentage)}%</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex gap-3 relative z-10">
                <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleAdd(250)}
                    className="flex-1 bg-sky-50 hover:bg-sky-100 text-sky-600 font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors"
                >
                    <Plus size={18} /> 250ml
                </motion.button>
                <div className="text-center">
                    <span className="block text-2xl font-black text-slate-800">{current}</span>
                    <span className="text-xs text-slate-400 uppercase font-bold">ml</span>
                </div>
            </div>

            {/* Background Decoration */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-sky-200/20 blur-3xl rounded-full pointer-events-none" />
        </div>
    );
}
