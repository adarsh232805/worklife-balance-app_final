import { motion } from "framer-motion";
import {
    CheckCircle,
    Circle,
    Clock,
    Tag,
    MoreVertical,
    Flag,
    Calendar,
    CheckSquare
} from "lucide-react";
import { Reminder, Priority, Category } from "./types";
import { format, formatDistanceToNow, isPast, isToday, isTomorrow } from "date-fns";

interface ReminderCardProps {
    reminder: Reminder;
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
    onEdit: (reminder: Reminder) => void;
}

const priorityColors: Record<Priority, string> = {
    high: "text-red-600 bg-red-50 border-red-100",
    medium: "text-amber-600 bg-amber-50 border-amber-100",
    low: "text-emerald-600 bg-emerald-50 border-emerald-100",
};

const categoryColors: Record<Category, string> = {
    work: "bg-blue-50 text-blue-600 border-blue-100",
    personal: "bg-purple-50 text-purple-600 border-purple-100",
    study: "bg-indigo-50 text-indigo-600 border-indigo-100",
    meeting: "bg-orange-50 text-orange-600 border-orange-100",
    family: "bg-pink-50 text-pink-600 border-pink-100",
    health: "bg-teal-50 text-teal-600 border-teal-100",
    finance: "bg-emerald-50 text-emerald-600 border-emerald-100",
    travel: "bg-sky-50 text-sky-600 border-sky-100"
};

export default function ReminderCard({ reminder, onToggle, onDelete, onEdit }: ReminderCardProps) {
    const isOverdue = !reminder.completed && isPast(reminder.time);

    // Time formatting
    let timeDisplay = format(reminder.time, "h:mm a");
    let dayDisplay = "";

    if (isToday(reminder.time)) dayDisplay = "Today";
    else if (isTomorrow(reminder.time)) dayDisplay = "Tomorrow";
    else dayDisplay = format(reminder.time, "MMM d");

    const relativeTime = formatDistanceToNow(reminder.time, { addSuffix: true });

    // Subtasks progress
    const totalSub = reminder.subtasks?.length || 0;
    const completedSub = reminder.subtasks?.filter(s => s.completed).length || 0;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            whileHover={{ scale: 1.01, y: -2 }}
            className={`group relative p-5 rounded-2xl border transition-all duration-300 hover:shadow-xl ${isOverdue
                    ? "border-red-200 shadow-red-100 bg-red-50/30"
                    : "border-slate-100 shadow-sm bg-white/70 backdrop-blur-xl hover:border-indigo-100/50 hover:shadow-indigo-500/10"
                } ${reminder.completed ? "opacity-60 grayscale-[0.5]" : ""}`}
        >
            <div className="flex items-start gap-4">
                <button
                    onClick={() => onToggle(reminder.id)}
                    className={`mt-1 rounded-full p-0.5 transition-all duration-300 ${reminder.completed
                            ? "text-green-500 bg-green-50 scale-110"
                            : "text-slate-300 hover:text-green-500 hover:scale-110"
                        }`}
                >
                    {reminder.completed ? (
                        <CheckCircle size={26} className="fill-green-100" />
                    ) : (
                        <Circle size={26} strokeWidth={1.5} />
                    )}
                </button>

                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1.5">
                        <h3 className={`font-semibold text-lg leading-tight truncate pr-2 ${reminder.completed ? "text-slate-400 line-through decoration-slate-300" : "text-slate-800"
                            }`}>
                            {reminder.title}
                        </h3>

                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={(e) => { e.stopPropagation(); onEdit(reminder); }}
                                className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                <MoreVertical size={18} />
                            </button>
                        </div>
                    </div>

                    {reminder.description && (
                        <p className="text-sm text-slate-500 line-clamp-2 mb-3 leading-relaxed">
                            {reminder.description}
                        </p>
                    )}

                    <div className="flex flex-wrap items-center gap-2.5 mt-auto">
                        {/* Priority Badge */}
                        <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${priorityColors[reminder.priority]}`}>
                            <Flag size={10} className="fill-current" />
                            {reminder.priority}
                        </span>

                        {/* Category Badge */}
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${categoryColors[reminder.category] || "bg-slate-100 text-slate-600 border-slate-200"}`}>
                            {reminder.category}
                        </span>

                        {/* Date/Time Badge */}
                        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${isOverdue ? "bg-red-100 text-red-600 border-red-200" : "bg-slate-100 text-slate-600 border-slate-200"
                            }`}>
                            <Calendar size={12} />
                            <span>{dayDisplay}</span>
                            <span className="w-px h-3 bg-current opacity-20 mx-0.5"></span>
                            <Clock size={12} />
                            <span>{timeDisplay}</span>
                        </div>

                        {/* Relative Time for active tasks */}
                        {!reminder.completed && (
                            <span className={`text-[10px] font-medium ${isOverdue ? "text-red-500" : "text-slate-400"}`}>
                                {isOverdue ? "Overdue " : "Due "}{relativeTime}
                            </span>
                        )}

                        {/* Subtasks Indicator */}
                        {totalSub > 0 && (
                            <span className="flex items-center gap-1 text-[10px] font-medium text-slate-400 bg-slate-50 px-2 py-1 rounded-lg border border-slate-200 ml-auto">
                                <CheckSquare size={10} />
                                {completedSub}/{totalSub}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Hover visual cue */}
            <div className={`absolute left-0 top-8 bottom-8 w-1rounded-r-full transition-opacity duration-300 opacity-0 group-hover:opacity-100 ${priorityColors[reminder.priority].split(" ")[0]
                }`}></div>
        </motion.div>
    );
}
