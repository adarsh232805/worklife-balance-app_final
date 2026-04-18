"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
    Home,
    Focus,
    Calendar,
    Bell,
    Gamepad2,
    Music,
    BarChart3,
    Sparkles,
    Heart,
    MoreHorizontal,
    X,
    LogOut,
    Settings
} from "lucide-react";
import Link from "next/link";
import { logOut } from "@/lib/actions";

interface BottomNavProps {
    activeTab: string;
    setActiveTab: (id: string) => void;
}

const PRIMARY_ITEMS = [
    { id: "today", icon: Home, label: "Home" },
    { id: "coach", icon: Sparkles, label: "Coach" },
    { id: "focus", icon: Focus, label: "Focus" },
    { id: "games", icon: Gamepad2, label: "Play" },
];

const SECONDARY_ITEMS = [
    { id: "calendar", label: "Calendar", icon: Calendar },
    { id: "reminders", label: "Reminders", icon: Bell },
    { id: "wellness", label: "Wellness", icon: Heart },
    { id: "media", label: "Media", icon: Music },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
];

export default function BottomNav({ activeTab, setActiveTab }: BottomNavProps) {
    const [showMore, setShowMore] = useState(false);

    return (
        <>
            {/* BOTTOM NAV BAR */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 glass border-t z-[100] pb-safe">
                <div className="flex items-center justify-around p-2">
                    {PRIMARY_ITEMS.map((item) => {
                        const isActive = activeTab === item.id && !showMore;
                        return (
                            <button
                                key={item.id}
                                onClick={() => { setActiveTab(item.id); setShowMore(false); }}
                                className="relative flex flex-col items-center justify-center p-2 w-16"
                            >
                                <div
                                    className={`p-2 rounded-2xl transition-all duration-300 ${isActive ? "bg-primary text-white shadow-lg shadow-primary/25 -translate-y-2" : "text-slate-500"
                                        }`}
                                >
                                    <item.icon size={24} />
                                </div>

                                <span className={`text-[10px] font-medium transition-all duration-300 mt-1 ${isActive ? "text-primary opacity-100" : "text-slate-400 opacity-0 h-0"
                                    }`}>
                                    {item.label}
                                </span>

                                {isActive && (
                                    <motion.div
                                        layoutId="bottom-indicator"
                                        className="absolute -bottom-2 w-1 h-1 bg-primary rounded-full mb-3"
                                    />
                                )}
                            </button>
                        );
                    })}

                    {/* MORE BUTTON */}
                    <button
                        onClick={() => setShowMore(!showMore)}
                        className="relative flex flex-col items-center justify-center p-2 w-16"
                    >
                        <div
                            className={`p-2 rounded-2xl transition-all duration-300 ${showMore ? "bg-primary text-white shadow-lg shadow-primary/25 -translate-y-2" : "text-slate-500 hover:text-slate-700"
                                }`}
                        >
                            <MoreHorizontal size={24} />
                        </div>
                        <span className={`text-[10px] font-medium transition-all duration-300 mt-1 ${showMore ? "text-primary opacity-100" : "text-slate-400 opacity-0 h-0"
                            }`}>
                            More
                        </span>
                        {showMore && (
                            <motion.div
                                layoutId="bottom-indicator"
                                className="absolute -bottom-2 w-1 h-1 bg-primary rounded-full mb-3"
                            />
                        )}
                    </button>
                </div>
            </div>

            {/* FULL SCREEN MORE DRAWER */}
            <AnimatePresence>
                {showMore && (
                    <motion.div
                        initial={{ opacity: 0, y: "100%" }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: "100%" }}
                        transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                        className="md:hidden fixed inset-0 z-[90] bg-white pt-20 px-6 pb-24 overflow-y-auto"
                    >
                        <div className="flex justify-between items-center mb-8 hidden">
                            <h2 className="text-3xl font-black text-slate-800">Menu</h2>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            {SECONDARY_ITEMS.map((item) => {
                                const isActive = activeTab === item.id;
                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => {
                                            setActiveTab(item.id);
                                            setShowMore(false);
                                        }}
                                        className={`flex flex-col items-center justify-center p-6 rounded-[2rem] border transition-all ${
                                            isActive 
                                            ? "bg-indigo-50 border-indigo-200 text-indigo-600 shadow-md shadow-indigo-100" 
                                            : "bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100"
                                        }`}
                                    >
                                        <item.icon size={32} className={`mb-3 ${isActive ? "text-indigo-500" : "text-slate-400"}`} />
                                        <span className="font-bold text-sm">{item.label}</span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* ACTIONS IN MORE MENU */}
                        <div className="mt-8 space-y-3">
                            <Link 
                                href="/settings"
                                onClick={() => setShowMore(false)}
                                className="w-full flex justify-between items-center bg-slate-50 p-4 rounded-2xl border border-slate-100 text-slate-700 font-bold"
                            >
                                <div className="flex items-center gap-3">
                                    <Settings size={20} className="text-slate-400" /> Settings
                                </div>
                            </Link>
                            <button 
                                onClick={() => logOut()}
                                className="w-full flex justify-between items-center bg-red-50 p-4 rounded-2xl border border-red-100 text-red-600 font-bold"
                            >
                                <div className="flex items-center gap-3">
                                    <LogOut size={20} className="text-red-400" /> Sign Out
                                </div>
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
