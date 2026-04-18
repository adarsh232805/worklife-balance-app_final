"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Clock, Flag, Tag, Repeat } from "lucide-react";
import { Reminder, Priority, Category } from "./types";

interface ReminderModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (reminder: Reminder) => void;
    initialData?: Reminder | null;
}

const CATEGORIES: Category[] = ["work", "personal", "study", "family", "health", "finance", "travel", "meeting"];

export default function ReminderModal({ isOpen, onClose, onSave, initialData }: ReminderModalProps) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [priority, setPriority] = useState<Priority>("medium");
    const [category, setCategory] = useState<Category>("personal");
    const [tags, setTags] = useState<string>("");

    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title);
            setDescription(initialData.description || "");
            const d = new Date(initialData.time);
            setDate(d.toISOString().split("T")[0]);
            setTime(d.toTimeString().slice(0, 5));
            setPriority(initialData.priority);
            setCategory(initialData.category);
            setTags(initialData.tags.join(", "));
        } else {
            reset();
        }
    }, [initialData, isOpen]);

    function reset() {
        setTitle("");
        setDescription("");
        // Default to today + 1 hour
        const now = new Date();
        setDate(now.toISOString().split("T")[0]);
        now.setHours(now.getHours() + 1);
        setTime(now.toTimeString().slice(0, 5));
        setPriority("medium");
        setCategory("personal");
        setTags("");
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!title || !date || !time) return;

        const timestamp = new Date(`${date}T${time}`).getTime();

        const newReminder: Reminder = {
            id: initialData?.id || crypto.randomUUID(),
            title,
            description,
            time: timestamp,
            priority,
            category,
            tags: tags.split(",").map(t => t.trim()).filter(Boolean),
            completed: initialData?.completed || false,
            subtasks: initialData?.subtasks || [],
            createdAt: initialData?.createdAt || Date.now(),
        };

        onSave(newReminder);
        onClose();
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-0 m-auto w-full max-w-lg h-fit z-50 p-4"
                    >
                        <div className="bg-white rounded-3xl shadow-2xl p-6 border border-slate-100">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-slate-800">
                                    {initialData ? "Edit Reminder" : "New Reminder"}
                                </h2>
                                <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-500">
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Title */}
                                <div>
                                    <input
                                        value={title}
                                        onChange={e => setTitle(e.target.value)}
                                        placeholder="What needs to be done?"
                                        className="w-full text-lg font-medium p-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none placeholder:text-slate-400"
                                        autoFocus
                                    />
                                </div>

                                {/* Description */}
                                <div>
                                    <textarea
                                        value={description}
                                        onChange={e => setDescription(e.target.value)}
                                        placeholder="Add details (optional)..."
                                        rows={2}
                                        className="w-full text-sm p-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none placeholder:text-slate-400 resize-none"
                                    />
                                </div>

                                {/* Date & Time */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">Date</label>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                            <input
                                                type="date"
                                                value={date}
                                                onChange={e => setDate(e.target.value)}
                                                className="w-full pl-10 pr-3 py-2.5 bg-slate-50 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500/10"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">Time</label>
                                        <div className="relative">
                                            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                            <input
                                                type="time"
                                                value={time}
                                                onChange={e => setTime(e.target.value)}
                                                className="w-full pl-10 pr-3 py-2.5 bg-slate-50 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500/10"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Priority & Category */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">Priority</label>
                                        <div className="relative">
                                            <Flag className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                            <select
                                                value={priority}
                                                onChange={e => setPriority(e.target.value as Priority)}
                                                className="w-full pl-10 pr-3 py-2.5 bg-slate-50 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500/10 appearance-none"
                                            >
                                                <option value="low">Low</option>
                                                <option value="medium">Medium</option>
                                                <option value="high">High</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">Category</label>
                                        <select
                                            value={category}
                                            onChange={e => setCategory(e.target.value as Category)}
                                            className="w-full px-3 py-2.5 bg-slate-50 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500/10"
                                        >
                                            {CATEGORIES.map(c => (
                                                <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Tags */}
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">Tags</label>
                                    <div className="relative">
                                        <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                        <input
                                            value={tags}
                                            onChange={e => setTags(e.target.value)}
                                            placeholder="Comma separated tags..."
                                            className="w-full pl-10 pr-3 py-2.5 bg-slate-50 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500/10 placeholder:text-slate-400"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-indigo-600 text-white font-bold py-3.5 rounded-xl hover:bg-indigo-700 active:scale-[0.98] transition-all shadow-lg shadow-indigo-200 mt-2"
                                >
                                    {initialData ? "Save Changes" : "Create Reminder"}
                                </button>
                            </form>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
