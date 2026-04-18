"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Briefcase, User, Heart, Activity, Plane, CreditCard, Users, Calendar as CalendarIcon, Clock, Type } from "lucide-react";

type EventType = 'work' | 'meeting' | 'break' | 'personal' | 'health' | 'travel' | 'finance' | 'social';

interface EventModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (eventData: any) => Promise<void>;
    initialDate?: Date;
    initialEvent?: any;
}

const EVENT_TYPES: Record<EventType, { label: string; icon: any; color: string }> = {
    work: { label: "Work", icon: Briefcase, color: "#4F46E5" }, // Indigo
    meeting: { label: "Meeting", icon: Users, color: "#0EA5E9" }, // Sky
    break: { label: "Break", icon: CoffeeIcon, color: "#F59E0B" }, // Amber
    personal: { label: "Personal", icon: User, color: "#8B5CF6" }, // Violet
    health: { label: "Health", icon: Activity, color: "#10B981" }, // Emerald
    travel: { label: "Travel", icon: Plane, color: "#EC4899" }, // Pink
    finance: { label: "Finance", icon: CreditCard, color: "#6366F1" }, // Indigo
    social: { label: "Social", icon: Heart, color: "#EF4444" }, // Red
};

// Helper for icon since we can't define component in object easily above without React import scope issues sometimes
function CoffeeIcon({ size }: { size: number }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
            <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
            <line x1="6" y1="1" x2="6" y2="4" />
            <line x1="10" y1="1" x2="10" y2="4" />
            <line x1="14" y1="1" x2="14" y2="4" />
        </svg>
    );
}

export default function EventModal({ isOpen, onClose, onSave, initialDate, initialEvent }: EventModalProps) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [startDate, setStartDate] = useState("");
    const [startTime, setStartTime] = useState("09:00");
    const [endDate, setEndDate] = useState("");
    const [endTime, setEndTime] = useState("10:00");
    const [type, setType] = useState<EventType>("work");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            if (initialEvent) {
                setTitle(initialEvent.title);
                setDescription(initialEvent.description || "");

                const start = new Date(initialEvent.start);
                const end = new Date(initialEvent.end);

                setStartDate(start.toISOString().split('T')[0]);
                setStartTime(start.toTimeString().slice(0, 5));
                setEndDate(end.toISOString().split('T')[0]);
                setEndTime(end.toTimeString().slice(0, 5));
                setType(initialEvent.resource?.type || "work");
            } else {
                // Reset or set to initial date
                setTitle("");
                setDescription("");
                const d = initialDate || new Date();
                const dateStr = d.toISOString().split('T')[0];
                setStartDate(dateStr);
                setEndDate(dateStr);

                // Round to nearest hour
                const now = new Date();
                now.setMinutes(0, 0, 0);
                now.setHours(now.getHours() + 1);
                setStartTime(now.toTimeString().slice(0, 5));

                const next = new Date(now);
                next.setHours(next.getHours() + 1);
                setEndTime(next.toTimeString().slice(0, 5));

                setType("work");
            }
        }
    }, [isOpen, initialEvent, initialDate]);

    const handleSubmit = async () => {
        if (!title || !startDate || !startTime || !endDate || !endTime) return;

        setLoading(true);
        try {
            const startDateTime = new Date(`${startDate}T${startTime}`);
            const endDateTime = new Date(`${endDate}T${endTime}`);

            const payload = {
                title,
                description,
                startTime: startDateTime,
                endTime: endDateTime,
                type,
                color: EVENT_TYPES[type].color
            };

            // If we have an initialEvent with an ID (not just a date slot), it's an update
            if (initialEvent?.id) {
                await onSave({ ...payload, id: initialEvent.id, isUpdate: true });
            } else {
                await onSave(payload);
            }
            onClose();
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!initialEvent?.id) return;
        if (!confirm("Are you sure you want to delete this event?")) return;

        setLoading(true);
        try {
            await onSave({ id: initialEvent.id, isDelete: true });
            onClose();
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-white/20"
                    >
                        {/* Header */}
                        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                {initialEvent ? "Edit Event" : "New Event"}
                            </h3>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-slate-200/50 rounded-full transition-colors text-slate-500"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto custom-scrollbar">
                            {/* Title input */}
                            <div className="space-y-1">
                                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 ml-1">Title</label>
                                <div className="relative">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                        <Type size={18} />
                                    </div>
                                    <input
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="Add title"
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-slate-700"
                                        autoFocus
                                    />
                                </div>
                            </div>

                            {/* Date & Time Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 ml-1">Start</label>
                                    <div className="space-y-2">
                                        <div className="relative">
                                            <input
                                                type="date"
                                                value={startDate}
                                                onChange={(e) => setStartDate(e.target.value)}
                                                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600 focus:outline-none focus:border-indigo-500"
                                            />
                                        </div>
                                        <div className="relative">
                                            <input
                                                type="time"
                                                value={startTime}
                                                onChange={(e) => setStartTime(e.target.value)}
                                                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600 focus:outline-none focus:border-indigo-500"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 ml-1">End</label>
                                    <div className="space-y-2">
                                        <div className="relative">
                                            <input
                                                type="date"
                                                value={endDate}
                                                onChange={(e) => setEndDate(e.target.value)}
                                                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600 focus:outline-none focus:border-indigo-500"
                                            />
                                        </div>
                                        <div className="relative">
                                            <input
                                                type="time"
                                                value={endTime}
                                                onChange={(e) => setEndTime(e.target.value)}
                                                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600 focus:outline-none focus:border-indigo-500"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Type Selection */}
                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 ml-1">Category</label>
                                <div className="grid grid-cols-4 gap-2">
                                    {Object.entries(EVENT_TYPES).map(([key, config]) => {
                                        const isSelected = type === key;
                                        const Icon = config.icon;
                                        return (
                                            <button
                                                key={key}
                                                onClick={() => setType(key as EventType)}
                                                className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all duration-200 ${isSelected
                                                    ? "bg-indigo-50 border-indigo-500 text-indigo-700 shadow-sm transform scale-105"
                                                    : "bg-white border-slate-100 text-slate-500 hover:border-slate-300 hover:bg-slate-50"
                                                    }`}
                                            >
                                                <Icon size={20} className={isSelected ? "mb-1" : "mb-1 opacity-70"} />
                                                <span className="text-[10px] font-bold">{config.label}</span>
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>

                            {/* Description */}
                            <div className="space-y-1">
                                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 ml-1">Description</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={3}
                                    placeholder="Add notes..."
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm text-slate-700 resize-none"
                                />
                            </div>

                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex gap-3">
                            {initialEvent?.id && (
                                <button
                                    onClick={handleDelete}
                                    disabled={loading}
                                    className="px-5 py-3.5 rounded-xl border border-red-100 text-red-500 hover:bg-red-50 font-bold transition-colors disabled:opacity-70"
                                >
                                    Delete
                                </button>
                            )}
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-slate-900/20 transition-all active:scale-[0.98] disabled:opacity-70 flex justify-center items-center gap-2"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <CalendarIcon size={18} />
                                        {initialEvent?.id ? "Save Changes" : "Create Event"}
                                    </>
                                )}
                            </button>
                        </div>

                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
