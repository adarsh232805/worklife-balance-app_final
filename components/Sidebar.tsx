"use client";

import { motion } from "framer-motion";
import {
    Home,
    Sparkles,
    Focus,
    Calendar,
    Bell,
    Gamepad2,
    Music,
    BarChart3,
    Settings,
    LogOut,
    Menu,
    Heart,
    X
} from "lucide-react";
import { useState } from "react";

const NAV_ITEMS = [
    { id: "today", label: "Today", icon: Home },
    { id: "coach", label: "AI Coach", icon: Sparkles },
    { id: "focus", label: "Focus", icon: Focus },
    { id: "calendar", label: "Calendar", icon: Calendar },
    { id: "reminders", label: "Reminders", icon: Bell },
    { id: "games", label: "Games", icon: Gamepad2 },
    { id: "wellness", label: "Wellness", icon: Heart },
    { id: "media", label: "Media", icon: Music },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
];

interface SidebarProps {
    activeTab: string;
    setActiveTab: (id: string) => void;
    isMobileMenuOpen: boolean;
    setIsMobileMenuOpen: (val: boolean) => void;
}

export default function Sidebar({ activeTab, setActiveTab, isMobileMenuOpen, setIsMobileMenuOpen }: SidebarProps) {
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <>
        {/* Mobile Overlay */}
        {isMobileMenuOpen && (
            <div 
                className="fixed inset-0 bg-black/50 z-[90] md:hidden backdrop-blur-sm"
                onClick={() => setIsMobileMenuOpen(false)}
            />
        )}

        <motion.aside
            initial={{ width: 250 }}
            animate={{ width: isCollapsed ? 80 : 250 }}
            className={`flex flex-col h-screen glass border-r z-[100] fixed left-0 top-0 transition-transform duration-300 md:translate-x-0 ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
            {/* HEADER */}
            <div className="p-6 flex items-center justify-between">
                {!isCollapsed && (
                    <motion.h1
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent"
                    >
                        WorkLife+
                    </motion.h1>
                )}
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="hidden md:block p-2 hover:bg-white/50 rounded-lg transition-colors"
                    >
                        <Menu size={20} className="text-slate-600" />
                    </button>
                    <button
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="md:hidden p-2 hover:bg-white/50 rounded-lg transition-colors"
                    >
                        <X size={20} className="text-slate-600" />
                    </button>
                </div>
            </div>

            {/* NAV LINKS */}
            <nav className="flex-1 px-4 space-y-2 overflow-y-auto py-4">
                {NAV_ITEMS.map((item) => {
                    const isActive = activeTab === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => {
                                setActiveTab(item.id);
                                setIsMobileMenuOpen(false); // Close on mobile when selecting
                            }}
                            className={`w-full flex items-center gap-4 px-3 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden ${isActive
                                ? "bg-primary text-white shadow-lg shadow-primary/30"
                                : "hover:bg-white/50 text-slate-600 hover:text-slate-900"
                                }`}
                        >
                            <item.icon size={22} className={isActive ? "text-white" : "text-slate-500 group-hover:text-primary transition-colors"} />

                            {!isCollapsed && (
                                <motion.span
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="font-medium truncate"
                                >
                                    {item.label}
                                </motion.span>
                            )}

                            {isActive && !isCollapsed && (
                                <motion.div
                                    layoutId="active-pill"
                                    className="absolute right-2 w-1.5 h-1.5 rounded-full bg-white"
                                />
                            )}
                        </button>
                    );
                })}
            </nav>

            {/* FOOTER ACTIONS */}
            <div className="p-4 border-t border-white/20 space-y-2">
                <button className={`w-full flex items-center gap-4 px-3 py-3 rounded-xl hover:bg-red-50 text-slate-600 hover:text-red-500 transition-colors ${isCollapsed ? "justify-center" : ""}`}>
                    <LogOut size={20} />
                    {!isCollapsed && <span className="font-medium">Logout</span>}
                </button>
            </div>
        </motion.aside>
        </>
    );
}
