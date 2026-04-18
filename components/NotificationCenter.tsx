"use client";

import { useState, useEffect } from "react";
import { Bell, Check, Info, Trophy, AlertTriangle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/api";

export default function NotificationCenter() {
    const [notifications, setNotifications] = useState<any[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    const fetchNotifications = async () => {
        try {
            console.log("Fetching notifications...");
            const data = await api.notifications.getAll();
            console.log("Notifications received:", data);
            setNotifications(data);
            setUnreadCount(data.filter((n: any) => !n.read).length);
        } catch (e) {
            console.error("Failed to fetch notifications", e);
        }
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 60000); // Poll every minute
        return () => clearInterval(interval);
    }, []);

    const markAsRead = async (id: string) => {
        try {
            await api.notifications.markRead(id);
            setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (e) {
            console.error("Failed to mark read");
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'success': return <Check size={18} />;
            case 'warning': return <AlertTriangle size={18} />;
            case 'achievement': return <Trophy size={18} />;
            default: return <Info size={18} />;
        }
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors relative"
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white animate-pulse" />
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute right-0 mt-4 w-80 md:w-96 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl shadow-indigo-500/20 border border-white/20 z-50 overflow-hidden ring-1 ring-slate-900/5"
                        >
                            <div className="p-4 border-b border-slate-100/50 flex justify-between items-center bg-white/50 backdrop-blur-md">
                                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                    Notifications
                                    {unreadCount > 0 && (
                                        <span className="bg-rose-500 text-white text-[10px] px-2 py-0.5 rounded-full shadow-sm shadow-rose-500/30">
                                            {unreadCount} New
                                        </span>
                                    )}
                                </h3>
                                <button
                                    onClick={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))} // Optimistic clear all
                                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 px-2 py-1 rounded-lg transition-colors"
                                >
                                    Mark all read
                                </button>
                            </div>

                            <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                                {notifications.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center p-8 text-center">
                                        <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                                            <Bell className="text-slate-300" size={20} />
                                        </div>
                                        <p className="text-slate-500 text-sm font-medium">No new notifications</p>
                                        <p className="text-slate-400 text-xs mt-1">Check back later for updates</p>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-slate-100/50">
                                        {notifications.map((n) => (
                                            <div
                                                key={n._id}
                                                className={`p-4 hover:bg-slate-50/80 transition-all cursor-pointer flex gap-3 relative group ${!n.read ? 'bg-gradient-to-r from-indigo-50/40 to-white' : 'bg-transparent'}`}
                                                onClick={() => !n.read && markAsRead(n._id)}
                                            >
                                                {!n.read && (
                                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                )}

                                                <div className={`mt-1 p-2.5 rounded-xl shrink-0 h-fit ${n.type === 'success' ? 'bg-emerald-100/50 text-emerald-600' :
                                                    n.type === 'warning' ? 'bg-amber-100/50 text-amber-600' :
                                                        n.type === 'achievement' ? 'bg-yellow-100/50 text-yellow-600' :
                                                            'bg-indigo-100/50 text-indigo-600'
                                                    }`}>
                                                    {getIcon(n.type)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex justify-between items-start mb-1 gap-2">
                                                        <h4 className={`text-sm font-bold truncate ${!n.read ? 'text-slate-800' : 'text-slate-600'}`}>
                                                            {n.title}
                                                        </h4>
                                                        <span className="text-[10px] text-slate-400 whitespace-nowrap bg-slate-50 px-1.5 py-0.5 rounded-md border border-slate-100/50">
                                                            {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{n.message}</p>
                                                </div>
                                                {!n.read && (
                                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-2 bg-indigo-500 rounded-full shadow-sm shadow-indigo-500/50" />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
