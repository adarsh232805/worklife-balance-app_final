"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Clock, Flag } from "lucide-react";

interface TaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAddTask: (task: any) => Promise<void>;
}

export default function TaskModal({ isOpen, onClose, onAddTask, onAddEvent, onAddReminder }: any) {
    const [type, setType] = useState<'task' | 'event' | 'reminder'>('task');
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    // Task specific
    const [priority, setPriority] = useState("Medium");
    const [time, setTime] = useState("");
    const [category, setCategory] = useState("Work");

    // Event specific
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [eventType, setEventType] = useState("work");

    // Shared State
    const [date, setDate] = useState(() => {
        const d = new Date();
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title) return;

        setIsSubmitting(true);
        try {
            if (type === 'task') {
                if (!time || !date) return;
                const d = new Date(`${date}T${time}`);
                await onAddTask({
                    title,
                    priority,
                    time: d.toISOString(),
                    category,
                    completed: false
                });
            } else if (type === 'reminder') {
                if (!time || !date) return;
                const d = new Date(`${date}T${time}`);
                await onAddReminder({
                    title,
                    priority,
                    time: d.toISOString(),
                    category,
                    completed: false,
                    repeat: 'none' // Default to none for now
                });
            } else {
                if (!startTime || !endTime || !date) return;
                const start = new Date(`${date}T${startTime}`);
                const end = new Date(`${date}T${endTime}`);

                await onAddEvent({
                    title,
                    description,
                    startTime: start.toISOString(),
                    endTime: end.toISOString(),
                    type: eventType
                });
            }

            // Reset
            setTitle("");
            setDescription("");
            setTime("");
            setCategory("Work");
            setStartTime("");
            setEndTime("");
            const d = new Date();
            setDate(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`);
            onClose();
        } catch (error) {
            console.error("Failed to add item", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-0 m-auto w-full max-w-md h-fit z-50 p-4"
                    >
                        <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-100">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-slate-900">Add New</h2>
                                <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-500">
                                    <X size={20} />
                                </button>
                            </div>

                            {/* TABS */}
                            <div className="flex bg-slate-100 p-1 rounded-xl mb-6">
                                <button
                                    onClick={() => setType('task')}
                                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${type === 'task' ? 'bg-white shadow text-primary' : 'text-slate-500 hover:text-slate-700'}`}
                                >
                                    To-Do
                                </button>
                                <button
                                    onClick={() => setType('reminder')}
                                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${type === 'reminder' ? 'bg-white shadow text-purple-600' : 'text-slate-500 hover:text-slate-700'}`}
                                >
                                    Reminder
                                </button>
                                <button
                                    onClick={() => setType('event')}
                                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${type === 'event' ? 'bg-white shadow text-orange-600' : 'text-slate-500 hover:text-slate-700'}`}
                                >
                                    Event
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1 ml-1">
                                        {type === 'task' ? 'Task Title' : type === 'reminder' ? 'Reminder Details' : 'Event Title'}
                                    </label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder={type === 'task' ? "What needs to be done?" : type === 'reminder' ? "Don't forget to..." : "Meeting name..."}
                                        className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all placeholder:text-slate-400 font-medium"
                                        autoFocus
                                    />
                                </div>

                                {type === 'task' || type === 'reminder' ? (
                                    <>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1 ml-1">Date</label>
                                                <div className="relative">
                                                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                                    <input
                                                        type="date"
                                                        value={date}
                                                        onChange={(e) => setDate(e.target.value)}
                                                        className="w-full p-4 pl-12 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500/20 outline-none font-medium"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1 ml-1">{type === 'task' ? 'Due Time' : 'Remind me at'}</label>
                                                <div className="relative">
                                                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                                    <input
                                                        type="time"
                                                        value={time}
                                                        onChange={(e) => setTime(e.target.value)}
                                                        className="w-full p-4 pl-12 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500/20 outline-none font-medium"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="w-full">
                                                <label className="block text-sm font-medium text-slate-700 mb-1 ml-1">Priority</label>
                                                <div className="relative">
                                                    <Flag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                                    <select
                                                        value={priority}
                                                        onChange={(e) => setPriority(e.target.value)}
                                                        className="w-full p-4 pl-12 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500/20 outline-none font-medium appearance-none"
                                                    >
                                                        <option value="Low">Low</option>
                                                        <option value="Medium">Medium</option>
                                                        <option value="High">High</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1 ml-1">Category</label>
                                            <div className="flex gap-2">
                                                {['Work', 'Personal', 'Health', 'Learning'].map(c => (
                                                    <button
                                                        key={c}
                                                        type="button"
                                                        onClick={() => setCategory(c)}
                                                        className={`px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${category === c
                                                            ? (type === 'reminder' ? 'bg-purple-600 text-white shadow-lg shadow-purple-200' : 'bg-indigo-600 text-white shadow-lg shadow-indigo-200')
                                                            : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
                                                    >
                                                        {c}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1 ml-1">Event Date</label>
                                            <div className="relative">
                                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                                <input
                                                    type="date"
                                                    value={date}
                                                    onChange={(e) => setDate(e.target.value)}
                                                    className="w-full p-4 pl-12 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-orange-500/20 outline-none font-medium"
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 mt-4">
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1 ml-1">Start Time</label>
                                                <input
                                                    type="time"
                                                    value={startTime}
                                                    onChange={(e) => setStartTime(e.target.value)}
                                                    className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-orange-500/20 outline-none font-medium"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1 ml-1">End Time</label>
                                                <input
                                                    type="time"
                                                    value={endTime}
                                                    onChange={(e) => setEndTime(e.target.value)}
                                                    className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-orange-500/20 outline-none font-medium"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1 ml-1">Category</label>
                                            <div className="flex gap-2">
                                                {['work', 'meeting', 'break'].map(t => (
                                                    <button
                                                        key={t}
                                                        type="button"
                                                        onClick={() => setEventType(t)}
                                                        className={`px-4 py-2 rounded-xl text-sm font-bold capitalize transition-all ${eventType === t ? 'bg-orange-100 text-orange-700 ring-2 ring-orange-500/20' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
                                                    >
                                                        {t}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </>
                                )}

                                <button
                                    type="submit"
                                    disabled={isSubmitting || !title || ((type === 'task' || type === 'reminder') ? (!time || !date) : (!startTime || !endTime || !date))}
                                    className={`w-full py-4 text-white rounded-2xl font-bold text-lg hover:shadow-lg active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-4 ${type === 'task'
                                        ? 'bg-primary hover:shadow-primary/30'
                                        : type === 'reminder'
                                            ? 'bg-purple-600 hover:shadow-purple-600/30'
                                            : 'bg-orange-600 hover:shadow-orange-600/30'
                                        }`}
                                >
                                    {isSubmitting ? "Saving..." : (type === 'task' ? "Create Task" : type === 'reminder' ? "Set Reminder" : "Schedule Event")}
                                </button>
                            </form>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
