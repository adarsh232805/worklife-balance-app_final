"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Reminder } from "./types";
import NotificationManager from "./NotificationManager";
import ReminderStats from "./ReminderStats";
import ReminderList from "./ReminderList";
import ReminderModal from "./ReminderModal";

export default function ReminderDashboard() {
    const [reminders, setReminders] = useState<Reminder[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterCategory, setFilterCategory] = useState<string>("all");

    // Load from API
    useEffect(() => {
        fetchReminders();
    }, []);

    async function fetchReminders() {
        try {
            const res = await fetch("/api/reminders");
            if (res.ok) {
                const data = await res.json();
                setReminders(data);
            }
        } catch (error) {
            console.error("Failed to fetch reminders:", error);
        } finally {
            setIsLoading(false);
        }
    }

    const filteredReminders = reminders.filter(r => {
        const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (r.description && r.description.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesCategory = filterCategory === "all" || r.category === filterCategory;
        return matchesSearch && matchesCategory;
    });

    async function handleSave(reminder: Reminder) {
        // Optimistic update
        const isNew = !reminders.find(r => r.id === reminder.id);

        if (isNew) {
            setReminders([...reminders, reminder]);
            try {
                const res = await fetch("/api/reminders", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(reminder),
                });
                if (res.ok) {
                    const saved = await res.json();
                    // Replace temp ID with real DB ID
                    setReminders(prev => prev.map(r => r.id === reminder.id ? saved : r));
                }
            } catch (e) {
                console.error("Error saving reminder", e);
                // Revert on error
                setReminders(reminders);
            }
        } else {
            // Update existing
            setReminders(reminders.map(r => r.id === reminder.id ? reminder : r));
            try {
                await fetch(`/api/reminders/${reminder.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(reminder),
                });
            } catch (e) {
                console.error("Error updating reminder", e);
                setReminders(reminders); // Revert
            }
        }

        setEditingReminder(null);
    }

    async function toggleComplete(id: string) {
        const reminder = reminders.find(r => r.id === id);
        if (!reminder) return;

        const updated = { ...reminder, completed: !reminder.completed };
        setReminders(reminders.map(r => r.id === id ? updated : r));

        try {
            await fetch(`/api/reminders/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updated),
            });
        } catch (e) {
            console.error("Error toggling complete", e);
            setReminders(reminders); // Revert
        }
    }

    async function deleteReminder(id: string) {
        const previous = [...reminders];
        setReminders(reminders.filter(r => r.id !== id));

        try {
            await fetch(`/api/reminders/${id}`, {
                method: "DELETE",
            });
        } catch (e) {
            console.error("Error deleting reminder", e);
            setReminders(previous); // Revert
        }
    }

    function editReminder(reminder: Reminder) {
        setEditingReminder(reminder);
        setIsModalOpen(true);
    }

    if (isLoading) {
        return <div className="flex h-full items-center justify-center text-slate-400">Loading reminders...</div>;
    }

    return (
        <div className="h-full space-y-6">
            <NotificationManager reminders={reminders} />

            {/* HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-4 mb-2">
                <div>
                    <h1 className="text-4xl font-bold text-slate-900 tracking-tight">
                        Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'}
                    </h1>
                    <p className="text-slate-500 mt-2 flex items-center gap-2">
                        {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                        <span className="h-1 w-1 rounded-full bg-slate-300"></span>
                        <span className="text-indigo-600 font-medium">
                            {reminders.filter(r => !r.completed && r.time < Date.now() + 86400000).length} tasks for today
                        </span>
                    </p>
                </div>
                <button
                    onClick={() => { setEditingReminder(null); setIsModalOpen(true); }}
                    className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3.5 rounded-2xl hover:scale-105 transition-all duration-300 shadow-xl shadow-slate-900/20 active:scale-95 group"
                >
                    <Plus size={20} className="group-hover:rotate-90 transition-transform" />
                    <span className="font-medium">New Reminder</span>
                </button>
            </div>

            {/* COMMAND CENTER */}
            <div className="bg-white/50 backdrop-blur-xl p-2 rounded-3xl border border-white/50 shadow-sm mb-8 relative overflow-hidden group/input">
                {/* Smart Add */}
                <div className="relative z-10">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <span className="bg-indigo-100 text-indigo-600 p-1.5 rounded-lg">
                            <div className="relative">
                                <span className="absolute animate-ping inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                <span className="relative inline-flex font-bold">✨</span>
                            </div>
                        </span>
                    </div>
                    <input
                        placeholder="Type naturally... (e.g., 'Meeting with Team tomorrow at 10am !high #work')"
                        className="w-full pl-14 pr-4 py-4 rounded-2xl border-none bg-transparent focus:bg-white transition-all shadow-none focus:ring-0 text-slate-700 placeholder:text-slate-400 font-medium text-lg"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                const val = (e.target as HTMLInputElement).value;
                                if (!val.trim()) return;

                                import("@/lib/utils/smartParser").then(({ parseSmartInput }) => {
                                    const parsed = parseSmartInput(val);
                                    const finalTime = parsed.time || Date.now() + 3600000;
                                    const newReminder: Reminder = {
                                        id: crypto.randomUUID(),
                                        title: parsed.title,
                                        time: finalTime,
                                        priority: parsed.priority || "medium",
                                        category: parsed.category || "personal",
                                        tags: parsed.tags || [],
                                        completed: false,
                                        subtasks: [],
                                        createdAt: Date.now()
                                    };
                                    setEditingReminder(newReminder);
                                    setIsModalOpen(true);
                                    (e.target as HTMLInputElement).value = "";
                                });
                            }
                        }}
                    />
                </div>

                {/* Divider */}
                <div className="h-px bg-slate-100 mx-4 my-2"></div>

                {/* Filters */}
                <div className="flex flex-wrap gap-2 px-2 pb-2">
                    <div className="flex-1 min-w-[200px]">
                        <input
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            placeholder="🔍 Search your tasks..."
                            className="w-full bg-slate-50/50 hover:bg-white focus:bg-white p-2.5 px-4 rounded-xl border-none transition-all text-sm font-medium"
                        />
                    </div>
                    <div>
                        <select
                            value={filterCategory}
                            onChange={e => setFilterCategory(e.target.value)}
                            className="bg-slate-50/50 hover:bg-white focus:bg-white p-2.5 px-4 rounded-xl border-none transition-all text-sm font-semibold text-slate-600 cursor-pointer outline-none"
                        >
                            <option value="all">📂 All Categories</option>
                            <option value="work">💼 Work</option>
                            <option value="personal">👤 Personal</option>
                            <option value="study">📚 Study</option>
                            <option value="family">🏡 Family</option>
                            <option value="health">❤️ Health</option>
                            <option value="finance">💰 Finance</option>
                            <option value="travel">✈️ Travel</option>
                            <option value="meeting">🤝 Meeting</option>
                        </select>
                    </div>
                </div>

                {/* Background Blur Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-50/30 to-purple-50/30 opacity-0 group-hover/input:opacity-100 transition-opacity pointer-events-none" />
            </div>

            <ReminderStats reminders={filteredReminders} />

            <ReminderList
                reminders={filteredReminders}
                onToggle={toggleComplete}
                onDelete={deleteReminder}
                onEdit={editReminder}
            />

            <ReminderModal
                isOpen={isModalOpen}
                onClose={() => { setIsModalOpen(false); setEditingReminder(null); }}
                onSave={handleSave}
                initialData={editingReminder}
            />
        </div>
    );
}
