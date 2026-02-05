"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  Clock,
  AlertTriangle,
  CheckCircle,
  TimerReset,
  Plus,
  Briefcase,
  BookOpen,
  Users,
  Calendar,
  HeartPulse,
  X,
  Trash2
} from "lucide-react";

/* ================= TYPES ================= */

type Priority = "high" | "medium" | "low";

type Category =
  | "work"
  | "study"
  | "family"
  | "meeting"
  | "personal";

type Reminder = {
  id: number;
  title: string;
  time: number;
  priority: Priority;
  category: Category;
  completed: boolean;
};

/* ================= STYLES ================= */

const PRIORITY_STYLE: Record<Priority, string> = {
  high: "bg-red-50 text-red-600 border-red-100",
  medium: "bg-amber-50 text-amber-600 border-amber-100",
  low: "bg-emerald-50 text-emerald-600 border-emerald-100",
};

const CATEGORY_STYLE: Record<Category, any> = {
  work: {
    label: "Work",
    icon: <Briefcase size={14} />,
    color: "bg-indigo-50 text-indigo-600 border-indigo-100",
  },
  study: {
    label: "Study",
    icon: <BookOpen size={14} />,
    color: "bg-blue-50 text-blue-600 border-blue-100",
  },
  family: {
    label: "Family",
    icon: <Users size={14} />,
    color: "bg-pink-50 text-pink-600 border-pink-100",
  },
  meeting: {
    label: "Meeting",
    icon: <Calendar size={14} />,
    color: "bg-purple-50 text-purple-600 border-purple-100",
  },
  personal: {
    label: "Personal",
    icon: <HeartPulse size={14} />,
    color: "bg-emerald-50 text-emerald-600 border-emerald-100",
  },
};

/* ================= COMPONENT ================= */

export default function RemindersTab() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [showForm, setShowForm] = useState(false);

  const [title, setTitle] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [category, setCategory] = useState<Category>("work");

  const now = Date.now();

  /* LOAD REMINDERS */
  useEffect(() => {
    const stored = localStorage.getItem("reminders");
    if (stored) setReminders(JSON.parse(stored));
  }, []);

  function save(list: Reminder[]) {
    setReminders(list);
    localStorage.setItem("reminders", JSON.stringify(list));
  }

  function addReminder() {
    if (!title || !dateTime) return;

    save([
      ...reminders,
      {
        id: Date.now(),
        title,
        time: new Date(dateTime).getTime(),
        priority,
        category,
        completed: false,
      },
    ]);

    setTitle("");
    setDateTime("");
    setPriority("medium");
    setCategory("work");
    setShowForm(false);
  }

  function markDone(id: number) {
    save(reminders.map(r =>
      r.id === id ? { ...r, completed: true } : r
    ));
  }

  function deleteReminder(id: number) {
    save(reminders.filter(r => r.id !== id));
  }

  function snooze(id: number) {
    save(reminders.map(r =>
      r.id === id
        ? { ...r, time: r.time + 10 * 60 * 1000 }
        : r
    ));
  }

  const overdue = reminders.filter(
    r => !r.completed && r.time <= now
  );

  const upcoming = reminders.filter(
    r => !r.completed && r.time > now
  );

  return (
    <div className="space-y-8 pb-20 md:pb-0 h-full">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-2 text-slate-800">
            Reminders
          </h2>
          <p className="text-slate-500">Stay on top of your tasks</p>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20"
        >
          <Plus size={18} /> Add Task
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* OVERDUE */}
        <AnimatePresence>
          {overdue.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:col-span-2"
            >
              <div className="bg-red-50/50 border border-red-100 rounded-3xl p-6">
                <div className="flex items-center gap-2 font-bold text-red-600 mb-4">
                  <AlertTriangle size={20} /> Overdue Tasks
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {overdue.map(r => (
                    <ReminderCard
                      key={r.id}
                      reminder={r}
                      onDone={markDone}
                      onSnooze={snooze}
                      onDelete={deleteReminder}
                      isOverdue={true}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* UPCOMING */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="font-semibold text-lg flex items-center gap-2 text-slate-700">
            <Clock size={20} className="text-primary" /> Upcoming
          </h3>

          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {upcoming.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center p-12 bg-white rounded-3xl border border-dashed border-slate-200"
                >
                  <Bell size={48} className="mx-auto text-slate-200 mb-4" />
                  <p className="text-slate-500 font-medium">No upcoming reminders 🎉</p>
                  <p className="text-sm text-slate-400">Enjoy your free time!</p>
                </motion.div>
              ) : (
                upcoming.map(r => (
                  <ReminderCard
                    key={r.id}
                    reminder={r}
                    onDone={markDone}
                    onSnooze={snooze}
                    onDelete={deleteReminder}
                  />
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* CREATE FORM MODAL */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl p-6 w-full max-w-md"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-800">New Reminder</h3>
                <button onClick={() => setShowForm(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-500">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <input
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="What needs to be done?"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  autoFocus
                />

                <input
                  type="datetime-local"
                  value={dateTime}
                  onChange={e => setDateTime(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-primary/50"
                />

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Priority</label>
                    <select
                      value={priority}
                      onChange={e => setPriority(e.target.value as Priority)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3"
                    >
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Category</label>
                    <select
                      value={category}
                      onChange={e => setCategory(e.target.value as Category)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3"
                    >
                      {Object.entries(CATEGORY_STYLE).map(([k, v]) => (
                        <option key={k} value={k}>
                          {v.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={addReminder}
                    className="flex-1 bg-primary text-white font-medium py-3 rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25"
                  >
                    Set Reminder
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ================= UI ================= */

function ReminderCard({
  reminder,
  onDone,
  onSnooze,
  onDelete,
  isOverdue = false
}: {
  reminder: Reminder;
  onDone: (id: number) => void;
  onSnooze: (id: number) => void;
  onDelete: (id: number) => void;
  isOverdue?: boolean;
}) {
  const category = CATEGORY_STYLE[reminder.category];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`group flex items-center justify-between border rounded-2xl p-4 transition-all hover:shadow-md ${isOverdue ? "bg-white border-red-200 shadow-sm" : "bg-white border-slate-100"
        }`}
    >
      <div className="flex items-center gap-4">
        <button
          onClick={() => onDone(reminder.id)}
          className="w-6 h-6 rounded-full border-2 border-slate-300 hover:border-primary hover:bg-primary/10 transition-colors"
        />

        <div className="space-y-0.5">
          <p className={`font-medium ${isOverdue ? "text-red-700" : "text-slate-800"}`}>
            {reminder.title}
          </p>

          <div className="flex items-center gap-2">
            <span className={`text-[10px] uppercase tracking-wider font-semibold ${isOverdue ? "text-red-500" : "text-slate-400"}`}>
              {new Date(reminder.time).toLocaleString([], { weekday: 'short', hour: '2-digit', minute: '2-digit' })}
            </span>
            <span className="text-slate-300">•</span>

            <span className={`text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 border ${category.color}`}>
              {category.icon}
              {category.label}
            </span>

            {reminder.priority === 'high' && (
              <span className={`text-[10px] px-2 py-0.5 rounded-full border ${PRIORITY_STYLE[reminder.priority]}`}>
                High
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ACTIONS */}
      <div className="flex gap-1 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onSnooze(reminder.id)}
          className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          title="Snooze 10 minutes"
        >
          <TimerReset size={18} />
        </button>

        <button
          onClick={() => onDelete(reminder.id)}
          className="p-2 rounded-lg hover:bg-red-50 text-slate-300 hover:text-red-500 transition-colors"
          title="Delete"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </motion.div>
  );
}
