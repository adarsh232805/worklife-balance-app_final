"use client";

import { useEffect, useState } from "react";
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
  high: "bg-red-100 text-red-700",
  medium: "bg-yellow-100 text-yellow-700",
  low: "bg-green-100 text-green-700",
};

const CATEGORY_STYLE: Record<Category, any> = {
  work: {
    label: "Work Time",
    icon: <Briefcase size={14} />,
    color: "bg-indigo-100 text-indigo-700",
  },
  study: {
    label: "Study Time",
    icon: <BookOpen size={14} />,
    color: "bg-blue-100 text-blue-700",
  },
  family: {
    label: "Family Time",
    icon: <Users size={14} />,
    color: "bg-pink-100 text-pink-700",
  },
  meeting: {
    label: "Meeting",
    icon: <Calendar size={14} />,
    color: "bg-purple-100 text-purple-700",
  },
  personal: {
    label: "Personal / Health",
    icon: <HeartPulse size={14} />,
    color: "bg-green-100 text-green-700",
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
    <div className="space-y-8">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Bell /> Reminders & Time Blocks
        </h2>

        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl"
        >
          <Plus size={16} /> Add Reminder
        </button>
      </div>

      {/* CREATE FORM */}
      {showForm && (
        <div className="bg-white rounded-3xl shadow p-6 space-y-4">
          <h3 className="font-semibold">Create Reminder</h3>

          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Reminder title"
            className="w-full border rounded-xl p-2"
          />

          <input
            type="datetime-local"
            value={dateTime}
            onChange={e => setDateTime(e.target.value)}
            className="w-full border rounded-xl p-2"
          />

          <div className="grid md:grid-cols-2 gap-4">
            <select
              value={priority}
              onChange={e => setPriority(e.target.value as Priority)}
              className="border rounded-xl p-2"
            >
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>

            <select
              value={category}
              onChange={e => setCategory(e.target.value as Category)}
              className="border rounded-xl p-2"
            >
              {Object.entries(CATEGORY_STYLE).map(([k, v]) => (
                <option key={k} value={k}>
                  {v.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3">
            <button
              onClick={addReminder}
              className="bg-indigo-600 text-white px-4 py-2 rounded-xl"
            >
              Save Reminder
            </button>

            <button
              onClick={() => setShowForm(false)}
              className="bg-slate-200 px-4 py-2 rounded-xl"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* OVERDUE */}
      {overdue.length > 0 && (
        <Section
          title="Overdue"
          icon={<AlertTriangle className="text-red-600" />}
        >
          {overdue.map(r => (
            <ReminderCard
              key={r.id}
              reminder={r}
              onDone={markDone}
              onSnooze={snooze}
            />
          ))}
        </Section>
      )}

      {/* UPCOMING */}
      <Section
        title="Upcoming"
        icon={<Clock className="text-indigo-600" />}
      >
        {upcoming.length === 0 && (
          <p className="text-slate-500 text-sm">
            No upcoming reminders 🎉
          </p>
        )}

        {upcoming.map(r => (
          <ReminderCard
            key={r.id}
            reminder={r}
            onDone={markDone}
            onSnooze={snooze}
          />
        ))}
      </Section>
    </div>
  );
}

/* ================= UI ================= */

function Section({ title, icon, children }: any) {
  return (
    <div className="bg-white rounded-3xl shadow p-6 space-y-4">
      <div className="flex items-center gap-2 font-semibold">
        {icon} {title}
      </div>
      {children}
    </div>
  );
}

function ReminderCard({
  reminder,
  onDone,
  onSnooze,
}: {
  reminder: Reminder;
  onDone: (id: number) => void;
  onSnooze: (id: number) => void;
}) {
  const category = CATEGORY_STYLE[reminder.category];

  return (
    <div className="flex items-center justify-between border rounded-2xl p-4 hover:shadow transition">

      {/* LEFT */}
      <div className="space-y-1">
        <p className="font-medium">{reminder.title}</p>
        <p className="text-sm text-slate-500">
          {new Date(reminder.time).toLocaleString()}
        </p>

        <div className="flex gap-2 mt-1">
          <span className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${category.color}`}>
            {category.icon}
            {category.label}
          </span>

          <span className={`text-xs px-2 py-1 rounded-full ${PRIORITY_STYLE[reminder.priority]}`}>
            {reminder.priority}
          </span>
        </div>
      </div>

      {/* ACTIONS */}
      <div className="flex gap-2">
        <button
          onClick={() => onSnooze(reminder.id)}
          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200"
          title="Snooze 10 minutes"
        >
          <TimerReset size={16} />
        </button>

        <button
          onClick={() => onDone(reminder.id)}
          className="p-2 rounded-xl bg-green-100 hover:bg-green-200 text-green-700"
          title="Mark done"
        >
          <CheckCircle size={16} />
        </button>
      </div>
    </div>
  );
}
