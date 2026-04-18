"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Plus, Trash2 } from "lucide-react";

export default function GratitudeJournal() {
    const [entries, setEntries] = useState([
        { id: 1, text: "Morning coffee", date: new Date() },
        { id: 2, text: "Finished the big project", date: new Date() },
    ]);
    const [newEntry, setNewEntry] = useState("");

    const addEntry = () => {
        if (!newEntry.trim()) return;
        setEntries([{ id: Date.now(), text: newEntry, date: new Date() }, ...entries]);
        setNewEntry("");
    };

    const removeEntry = (id: number) => {
        setEntries(entries.filter(e => e.id !== id));
    };

    return (
        <div className="bg-white rounded-3xl p-6 shadow-xl shadow-rose-500/10 border border-rose-100 h-full flex flex-col">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className="text-xl font-bold text-rose-900">Gratitude</h3>
                    <p className="text-rose-400 text-sm font-medium">Daily Journal</p>
                </div>
                <div className="p-3 bg-rose-50 text-rose-500 rounded-2xl">
                    <Heart size={24} fill="currentColor" />
                </div>
            </div>

            {/* Input */}
            <div className="flex gap-2 mb-6">
                <input
                    type="text"
                    value={newEntry}
                    onChange={(e) => setNewEntry(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addEntry()}
                    placeholder="I'm thankful for..."
                    className="flex-1 bg-rose-50/50 border border-rose-100 rounded-xl px-4 py-2 text-sm text-rose-900 placeholder-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-200"
                />
                <button onClick={addEntry} className="p-2 bg-rose-500 text-white rounded-xl hover:bg-rose-600 transition-colors">
                    <Plus size={20} />
                </button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                <AnimatePresence initial={false}>
                    {entries.length === 0 ? (
                        <div className="text-center text-rose-300 text-sm py-10 italic">
                            What are you grateful for today?
                        </div>
                    ) : (
                        entries.map(entry => (
                            <motion.div
                                key={entry.id}
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="group flex items-center justify-between p-3 rounded-xl bg-orange-50/30 border border-rose-50 hover:bg-white hover:shadow-sm transition-all"
                            >
                                <span className="text-sm font-medium text-slate-700 truncate">{entry.text}</span>
                                <button
                                    onClick={() => removeEntry(entry.id)}
                                    className="text-rose-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
