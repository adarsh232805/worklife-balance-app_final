"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Wind, Play, Pause, RotateCcw } from "lucide-react";

export default function BreathingWidget() {
    const [isActive, setIsActive] = useState(false);
    const [phase, setPhase] = useState<"inhale" | "hold" | "exhale">("inhale");
    const [timeLeft, setTimeLeft] = useState(0);

    // 4-7-8 Breathing Technique
    const PHASE_DURATION = {
        inhale: 4,
        hold: 7,
        exhale: 8,
    };

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isActive) {
            interval = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev > 0) return prev - 1;

                    // Switch Phase
                    if (phase === "inhale") {
                        setPhase("hold");
                        return PHASE_DURATION.hold;
                    } else if (phase === "hold") {
                        setPhase("exhale");
                        return PHASE_DURATION.exhale;
                    } else {
                        setPhase("inhale");
                        return PHASE_DURATION.inhale;
                    }
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isActive, phase]);

    const toggle = () => {
        if (!isActive) {
            setIsActive(true);
            setPhase("inhale");
            setTimeLeft(PHASE_DURATION.inhale);
        } else {
            setIsActive(false);
            setPhase("inhale");
            setTimeLeft(0);
        }
    };

    const variants: Variants = {
        inhale: { scale: 1.5, opacity: 1, transition: { duration: 4, ease: "easeInOut" } },
        hold: { scale: 1.5, opacity: 0.9, transition: { duration: 7, ease: "linear" } },
        exhale: { scale: 1, opacity: 0.6, transition: { duration: 8, ease: "easeInOut" } },
    };

    const textVariants = {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -10 }
    };

    return (
        <div className="bg-white rounded-3xl p-6 shadow-xl shadow-teal-500/10 border border-teal-100 flex flex-col items-center justify-between h-full relative overflow-hidden">
            <div className="w-full flex justify-between items-start z-10">
                <div>
                    <h3 className="text-xl font-bold text-teal-800">Breathe</h3>
                    <p className="text-teal-600/60 text-sm font-medium">4-7-8 Technique</p>
                </div>
                <div className="p-3 bg-teal-50 text-teal-600 rounded-2xl">
                    <Wind size={24} />
                </div>
            </div>

            <div className="relative py-8 z-10">
                {/* Rings */}
                <motion.div
                    variants={variants}
                    animate={isActive ? phase : "exhale"}
                    className="w-48 h-48 rounded-full bg-gradient-to-tr from-teal-200 to-emerald-200 blur-2xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                />
                <motion.div
                    variants={variants}
                    animate={isActive ? phase : "exhale"}
                    className="w-40 h-40 rounded-full border-4 border-teal-100 flex items-center justify-center relative bg-white/30 backdrop-blur-sm"
                >
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={isActive ? phase : "idle"}
                            variants={textVariants}
                            initial="initial" animate="animate" exit="exit"
                            className="text-center"
                        >
                            {isActive ? (
                                <>
                                    <div className="text-2xl font-black text-teal-700 uppercase tracking-widest">{phase}</div>
                                    <div className="text-4xl font-light text-teal-600/50">{timeLeft}</div>
                                </>
                            ) : (
                                <button onClick={toggle} className="w-16 h-16 bg-teal-500 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform">
                                    <Play size={32} fill="currentColor" className="ml-1" />
                                </button>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </motion.div>
            </div>

            <div className="w-full z-10">
                {isActive && (
                    <button onClick={toggle} className="w-full py-3 bg-teal-50 hover:bg-teal-100 text-teal-700 rounded-xl font-bold transition-colors">
                        Stop Session
                    </button>
                )}
            </div>
        </div>
    );
}
