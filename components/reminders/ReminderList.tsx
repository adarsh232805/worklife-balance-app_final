"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Reminder } from "./types";
import ReminderCard from "./ReminderCard";
import { format, isToday, isTomorrow, isPast, isFuture } from "date-fns";

interface ReminderListProps {
    reminders: Reminder[];
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
    onEdit: (reminder: Reminder) => void;
}

export default function ReminderList({ reminders, onToggle, onDelete, onEdit }: ReminderListProps) {
    // Sort by time
    const sorted = [...reminders].sort((a, b) => a.time - b.time);

    const overdue = sorted.filter(r => !r.completed && isPast(r.time) && !isToday(r.time));
    const today = sorted.filter(r => !r.completed && isToday(r.time));
    const tomorrow = sorted.filter(r => !r.completed && isTomorrow(r.time));
    const upcoming = sorted.filter(r => !r.completed && isFuture(r.time) && !isToday(r.time) && !isTomorrow(r.time));
    const completed = sorted.filter(r => r.completed);

    return (
        <div className="space-y-8 pb-8">
            <Section title="Overdue" items={overdue} onToggle={onToggle} onDelete={onDelete} onEdit={onEdit} color="text-red-600" />
            <Section title="Today" items={today} onToggle={onToggle} onDelete={onDelete} onEdit={onEdit} color="text-indigo-600" />
            <Section title="Tomorrow" items={tomorrow} onToggle={onToggle} onDelete={onDelete} onEdit={onEdit} color="text-slate-600" />
            <Section title="Upcoming" items={upcoming} onToggle={onToggle} onDelete={onDelete} onEdit={onEdit} color="text-slate-500" />

            {completed.length > 0 && (
                <div className="pt-8 border-t border-dashed border-slate-200">
                    <h3 className="font-bold text-slate-400 mb-4 text-sm uppercase tracking-wider">Completed</h3>
                    <div className="grid gap-4 opacity-60 hover:opacity-100 transition-opacity">
                        {completed.map(r => (
                            <ReminderCard key={r.id} reminder={r} onToggle={onToggle} onDelete={onDelete} onEdit={onEdit} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

function Section({ title, items, color, ...props }: any) {
    if (items.length === 0) return null;

    return (
        <section>
            <h3 className={`font-bold text-lg mb-4 flex items-center gap-2 ${color}`}>
                {title} <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">{items.length}</span>
            </h3>
            <div className="grid gap-3">
                <AnimatePresence>
                    {items.map((r: Reminder) => (
                        <ReminderCard key={r.id} reminder={r} {...props} />
                    ))}
                </AnimatePresence>
            </div>
        </section>
    );
}
