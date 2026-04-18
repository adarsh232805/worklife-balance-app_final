"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Star, X } from "lucide-react";
import { useEffect, useState } from "react";
// import Confetti from "react-confetti";

export default function LevelUpModal({
    newLevel,
    isOpen,
    onClose
}: {
    newLevel: number;
    isOpen: boolean;
    onClose: () => void
}) {
    // Auto-close after 5 seconds
    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(onClose, 5000);
            return () => clearTimeout(timer);
        }
    }, [isOpen, onClose]);

    return (
        <AnimatePresence>
            {isOpen && (
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
                        initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
                        animate={{ scale: 1, opacity: 1, rotate: 0 }}
                        exit={{ scale: 0.5, opacity: 0, rotate: 10 }}
                        transition={{ type: "spring", damping: 15 }}
                        className="relative bg-white w-full max-w-[calc(100vw-2rem)] sm:max-w-sm rounded-3xl p-6 sm:p-8 text-center shadow-2xl overflow-hidden"
                    >
                        {/* Background Gradients */}
                        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-yellow-400 to-transparent -z-10 opacity-20" />
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-yellow-300 rounded-full blur-3xl opacity-40" />
                        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-purple-400 rounded-full blur-3xl opacity-30" />

                        {/* Icon */}
                        <div className="mx-auto w-24 h-24 bg-gradient-to-tr from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg mb-6 relative">
                            <motion.div
                                animate={{ rotate: [0, 10, -10, 0] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                            >
                                <Trophy size={48} className="text-white" fill="currentColor" />
                            </motion.div>
                            {/* Stars */}
                            <motion.div
                                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                                className="absolute -top-2 -right-2 text-yellow-500"
                            >
                                <Star size={24} fill="currentColor" />
                            </motion.div>
                            <motion.div
                                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                                transition={{ duration: 1.5, delay: 0.5, repeat: Infinity }}
                                className="absolute -bottom-2 -left-2 text-yellow-500"
                            >
                                <Star size={20} fill="currentColor" />
                            </motion.div>
                        </div>

                        {/* Text */}
                        <h2 className="text-3xl font-black text-slate-800 mb-2">LEVEL UP!</h2>
                        <p className="text-slate-500 mb-6">You've reached <span className="text-primary font-bold">Level {newLevel}</span></p>

                        <div className="bg-slate-50 rounded-xl p-4 mb-6 border border-slate-100">
                            <p className="text-sm font-semibold text-slate-700">New Title:</p>
                            <p className="text-lg font-bold text-indigo-600">
                                {newLevel <= 5 ? "Apprentice" : newLevel <= 10 ? "Productivity Ninja" : "Zen Master"}
                            </p>
                        </div>

                        <button
                            onClick={onClose}
                            className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-lg active:scale-95 transition-transform"
                        >
                            Awesome!
                        </button>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
