"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Plus,
  ChevronLeft,
  ChevronRight,
  Briefcase,
  Cake,
  Heart,
  Plane,
  Sun,
  X
} from "lucide-react";

/* ================= TYPES ================= */

type EventType =
  | "meeting"
  | "birthday"
  | "anniversary"
  | "holiday"
  | "trip";

type CalendarEvent = {
  id: number;
  title: string;
  date: string; // yyyy-mm-dd
  type: EventType;
};

/* ================= CONFIG ================= */

const EVENT_TYPES: Record<EventType, any> = {
  meeting: {
    label: "Meeting",
    icon: <Briefcase size={14} />,
    color: "bg-indigo-500",
    text: "text-indigo-50",
    bg: "bg-indigo-500"
  },
  birthday: {
    label: "Birthday",
    icon: <Cake size={14} />,
    color: "bg-pink-500",
    text: "text-pink-50",
    bg: "bg-pink-500"
  },
  anniversary: {
    label: "Anniversary",
    icon: <Heart size={14} />,
    color: "bg-red-500",
    text: "text-red-50",
    bg: "bg-red-500"
  },
  holiday: {
    label: "Holiday",
    icon: <Sun size={14} />,
    color: "bg-green-500",
    text: "text-green-50",
    bg: "bg-green-500"
  },
  trip: {
    label: "Trip",
    icon: <Plane size={14} />,
    color: "bg-amber-500",
    text: "text-amber-50",
    bg: "bg-amber-500"
  },
};

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/* ================= COMPONENT ================= */

export default function CalendarTab() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [type, setType] = useState<EventType>("meeting");

  /* LOAD EVENTS */
  useEffect(() => {
    const stored = localStorage.getItem("calendarEvents");
    if (stored) setEvents(JSON.parse(stored));
  }, []);

  function saveEvents(list: CalendarEvent[]) {
    setEvents(list);
    localStorage.setItem("calendarEvents", JSON.stringify(list));
  }

  function addEvent() {
    if (!title || !date) return;

    saveEvents([
      ...events,
      {
        id: Date.now(),
        title,
        date,
        type,
      },
    ]);

    setTitle("");
    setDate("");
    setType("meeting");
    setShowForm(false);
  }

  /* CALENDAR LOGIC */
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const today = new Date().toISOString().split("T")[0];

  const dates: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  function eventsForDay(day: number) {
    const d = `${year}-${String(month + 1).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;
    return events.filter((e) => e.date === d);
  }

  return (
    <div className="space-y-8 h-full flex flex-col pb-20 md:pb-0">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-2 text-slate-800">
            Calendar
          </h2>
          <p className="text-slate-500">Plan your month efficiently</p>
        </div>

        <div className="flex items-center gap-4 bg-white p-1 rounded-xl shadow-sm border border-slate-100">
          <button onClick={() => setCurrentMonth(new Date(year, month - 1, 1))} className="p-2 hover:bg-slate-100 rounded-lg">
            <ChevronLeft size={20} className="text-slate-600" />
          </button>
          <span className="font-bold text-lg w-32 text-center text-slate-800">
            {currentMonth.toLocaleString("default", { month: "long" })} {year}
          </span>
          <button onClick={() => setCurrentMonth(new Date(year, month + 1, 1))} className="p-2 hover:bg-slate-100 rounded-lg">
            <ChevronRight size={20} className="text-slate-600" />
          </button>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20"
        >
          <Plus size={18} /> Add Event
        </button>
      </div>

      {/* MODERN GRID */}
      <div className="flex-1 bg-white rounded-3xl border border-slate-100 shadow-sm p-6 overflow-hidden flex flex-col">
        {/* DAY HEADERS */}
        <div className="grid grid-cols-7 mb-4">
          {DAYS.map((d) => (
            <div key={d} className="text-center font-medium text-slate-400 text-sm uppercase tracking-wider">
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2 md:gap-4 flex-1">
          {dates.map((day, i) => {
            if (!day) return <div key={i} className="bg-slate-50/50 rounded-2xl" />;

            const fullDate = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            const isToday = fullDate === today;
            const dayEvents = eventsForDay(day);

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.01 }}
                className={`group relative rounded-2xl p-2 md:p-3 min-h-[100px] border transition-all duration-200 hover:shadow-md ${isToday
                    ? "bg-white border-primary ring-1 ring-primary shadow-sm"
                    : "bg-white border-slate-100 hover:border-slate-200"
                  }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className={`w-7 h-7 flex items-center justify-center rounded-full text-sm font-semibold ${isToday ? "bg-primary text-white" : "text-slate-700 group-hover:bg-slate-100"
                    }`}>
                    {day}
                  </span>
                </div>

                <div className="space-y-1.5 overflow-y-auto max-h-[80px] custom-scrollbar">
                  {dayEvents.map((e) => (
                    <div
                      key={e.id}
                      className={`text-xs px-2 py-1 rounded-md flex items-center gap-1.5 ${EVENT_TYPES[e.type].bg} ${EVENT_TYPES[e.type].text} bg-opacity-90`}
                      title={e.title}
                    >
                      {EVENT_TYPES[e.type].icon}
                      <span className="truncate font-medium">{e.title}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ADD EVENT MODAL */}
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
                <h3 className="text-xl font-bold text-slate-800">New Event</h3>
                <button onClick={() => setShowForm(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-500">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-600 mb-1 block">Event Title</label>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Project Meeting"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-600 mb-1 block">Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-600 mb-1 block">Category</label>
                  <div className="grid grid-cols-3 gap-2">
                    {Object.entries(EVENT_TYPES).map(([k, v]) => (
                      <button
                        key={k}
                        onClick={() => setType(k as EventType)}
                        className={`flex flex-col items-center gap-1 p-2 rounded-xl border transition-all ${type === k ? `border-primary bg-primary/5 text-primary` : "border-slate-200 hover:bg-slate-50 text-slate-500"
                          }`}
                      >
                        {v.icon}
                        <span className="text-xs font-medium">{v.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={addEvent}
                  className="w-full bg-primary text-white font-medium py-3 rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25 mt-2"
                >
                  Create Event
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
