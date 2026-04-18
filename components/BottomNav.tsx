"use client";

import { motion } from "framer-motion";
import {
    Home,
    Focus,
    Calendar,
    Bell,
    Gamepad2,
    Music,
    BarChart3,
    Sparkles
} from "lucide-react";

interface BottomNavProps {
    activeTab: string;
    setActiveTab: (id: string) => void;
}

const NAV_ITEMS = [
    { id: "today", icon: Home, label: "Home" },
    { id: "coach", icon: Sparkles, label: "Coach" },
    { id: "focus", icon: Focus, label: "Focus" },
    { id: "games", icon: Gamepad2, label: "Play" },
    { id: "analytics", icon: BarChart3, label: "Stats" },
];

export default function BottomNav({ activeTab, setActiveTab }: BottomNavProps) {
    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 glass border-t z-50 pb-safe">
            <div className="flex items-center justify-around p-2">
                {NAV_ITEMS.map((item) => {
                    const isActive = activeTab === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
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
                {/* Helper for other tabs not in main bottom view can go in a 'More' menu if needed, 
            but for now we stick to core actions or rely on the user scrolling top nav bubbles on mobile if we kept them.
            Actually, let's keep it simple for now and maybe assume these are the core mobile tabs. 
            Or we can add a 'Menu' item that opens a drawer for others. 
            For this iteration, I'll stick to 4 core items + a simplified approach. 
        */}
            </div>
        </div>
    );
}
