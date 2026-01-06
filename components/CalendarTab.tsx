"use client";

import { useEffect, useState } from "react";
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
  },
  birthday: {
    label: "Birthday",
    icon: <Cake size={14} />,
    color: "bg-pink-500",
  },
  anniversary: {
    label: "Anniversary",
    icon: <Heart size={14} />,
    color: "bg-red-500",
  },
  holiday: {
    label: "Holiday",
    icon: <Sun size={14} />,
    color: "bg-green-500",
  },
  trip: {
    label: "Trip",
    icon: <Plane size={14} />,
    color: "bg-yellow-500",
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
    <div className="space-y-8">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Calendar /> Calendar
        </h2>

        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl"
        >
          <Plus size={16} /> Add Event
        </button>
      </div>

      {/* ADD EVENT FORM */}
      {showForm && (
        <div className="bg-white rounded-3xl shadow p-6 space-y-4">
          <h3 className="font-semibold">Add New Event</h3>

          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Event title"
            className="w-full border rounded-xl p-2"
          />

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border rounded-xl p-2"
          />

          <select
            value={type}
            onChange={(e) => setType(e.target.value as EventType)}
            className="w-full border rounded-xl p-2"
          >
            {Object.entries(EVENT_TYPES).map(([k, v]) => (
              <option key={k} value={k}>
                {v.label}
              </option>
            ))}
          </select>

          <div className="flex gap-3">
            <button
              onClick={addEvent}
              className="bg-indigo-600 text-white px-4 py-2 rounded-xl"
            >
              Save
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

      {/* MONTH NAV */}
      <div className="flex justify-between items-center">
        <button onClick={() => setCurrentMonth(new Date(year, month - 1, 1))}>
          <ChevronLeft />
        </button>

        <h3 className="font-semibold text-lg">
          {currentMonth.toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </h3>

        <button onClick={() => setCurrentMonth(new Date(year, month + 1, 1))}>
          <ChevronRight />
        </button>
      </div>

      {/* DAY HEADERS */}
      <div className="grid grid-cols-7 text-sm text-slate-500">
        {DAYS.map((d) => (
          <div key={d} className="text-center">
            {d}
          </div>
        ))}
      </div>

      {/* MODERN GRID */}
      <div className="grid grid-cols-7 gap-4">
        {dates.map((day, i) => {
          if (!day)
            return <div key={i} />;

          const fullDate = `${year}-${String(month + 1).padStart(2, "0")}-${String(
            day
          ).padStart(2, "0")}`;

          const isToday = fullDate === today;

          return (
            <div
              key={i}
              className={`rounded-2xl p-3 min-h-[120px] shadow-sm bg-white border ${
                isToday ? "border-indigo-500 ring-2 ring-indigo-200" : ""
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-sm">{day}</span>
                {isToday && (
                  <span className="text-xs bg-indigo-600 text-white px-2 py-0.5 rounded-full">
                    Today
                  </span>
                )}
              </div>

              <div className="space-y-1">
                {eventsForDay(day).map((e) => (
                  <div
                    key={e.id}
                    className={`text-white text-xs px-2 py-1 rounded-lg flex items-center gap-1 ${EVENT_TYPES[e.type].color}`}
                    title={e.title}
                  >
                    {EVENT_TYPES[e.type].icon}
                    <span className="truncate">{e.title}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
