"use client";

import { useEffect, useState } from "react";
import {
  Calendar,
  Clock,
  Flame,
  Bell,
  Plus,
  Play,
  Coffee,
  Smile,
  Meh,
  Frown,
} from "lucide-react";

/* ================= HELPERS ================= */

const QUOTES = [
  "Focus on progress, not perfection.",
  "Small steps every day lead to big results.",
  "आज का फोकस, कल की सफलता।",
  "मेहनत इतनी करो कि किस्मत भी साथ दे।",
];

function todayString() {
  return new Date().toLocaleDateString(undefined, {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

/* ================= COMPONENT ================= */

export default function TodayView() {
  const [quote, setQuote] = useState("");
  const [mood, setMood] = useState<string | null>(null);

  const today = new Date().toISOString().split("T")[0];
  const now = Date.now();

  /* LOAD DATA */
  const reminders = JSON.parse(
    localStorage.getItem("reminders") || "[]"
  );

  const focusSessions = JSON.parse(
    localStorage.getItem("focusSessions") || "[]"
  );

  /* FILTER TODAY DATA */
  const todayReminders = reminders.filter(
    (r: any) =>
      !r.completed &&
      new Date(r.time).toISOString().split("T")[0] === today
  );

  const todayFocus = focusSessions.filter(
    (s: any) =>
      new Date(s.time).toISOString().split("T")[0] === today
  );

  const focusMinutes = todayFocus.reduce(
    (a: number, b: any) => a + b.duration,
    0
  );

  const focusScore =
    focusMinutes >= 120
      ? "Excellent"
      : focusMinutes >= 60
      ? "Good"
      : "Needs Attention";

  useEffect(() => {
    setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
  }, []);

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold">
          Good day 👋
        </h1>
        <p className="text-slate-500">{todayString()}</p>
      </div>

      {/* OVERVIEW CARDS */}
      <div className="grid md:grid-cols-3 gap-6">

        <Card
          icon={<Flame className="text-orange-500" />}
          title="Focus Today"
          value={`${focusMinutes} min`}
          subtitle={focusScore}
        />

        <Card
          icon={<Bell className="text-indigo-600" />}
          title="Reminders"
          value={todayReminders.length}
          subtitle="Due today"
        />

        <Card
          icon={<Calendar className="text-green-600" />}
          title="Balance"
          value={focusScore}
          subtitle="Work-Life Status"
        />

      </div>

      {/* TODAY REMINDERS */}
      <Section title="Upcoming Today" icon={<Clock />}>
        {todayReminders.length === 0 && (
          <p className="text-slate-500 text-sm">
            No pending reminders for today 🎉
          </p>
        )}

        {todayReminders.slice(0, 3).map((r: any) => (
          <div
            key={r.id}
            className="flex justify-between items-center bg-slate-50 rounded-xl p-3"
          >
            <div>
              <p className="font-medium">{r.title}</p>
              <p className="text-xs text-slate-500">
                {new Date(r.time).toLocaleTimeString()}
              </p>
            </div>

            <span className="text-xs px-2 py-1 rounded-full bg-slate-200">
              {r.priority}
            </span>
          </div>
        ))}
      </Section>

      {/* QUICK ACTIONS */}
      <Section title="Quick Actions">
        <div className="grid md:grid-cols-4 gap-4">

          <QuickAction
            icon={<Play />}
            label="Start Focus"
          />

          <QuickAction
            icon={<Plus />}
            label="Add Reminder"
          />

          <QuickAction
            icon={<Calendar />}
            label="Open Calendar"
          />

          <QuickAction
            icon={<Coffee />}
            label="Take Break"
          />

        </div>
      </Section>

      {/* WELLBEING */}
      <Section title="How are you feeling today?">
        <div className="flex gap-6">
          <Mood icon={<Smile />} label="Good" onClick={() => setMood("good")} />
          <Mood icon={<Meh />} label="Okay" onClick={() => setMood("ok")} />
          <Mood icon={<Frown />} label="Stressed" onClick={() => setMood("bad")} />
        </div>

        {mood && (
          <p className="text-slate-600 mt-3">
            {mood === "bad"
              ? "Take a short break and breathe 🌿"
              : "Keep going, you’re doing well 💪"}
          </p>
        )}
      </Section>

      {/* MOTIVATION */}
      <div className="bg-indigo-50 rounded-3xl p-6 text-center">
        <p className="italic text-indigo-700">“{quote}”</p>
      </div>

    </div>
  );
}

/* ================= UI HELPERS ================= */

function Card({ icon, title, value, subtitle }: any) {
  return (
    <div className="bg-white rounded-3xl shadow p-6">
      <div className="mb-2">{icon}</div>
      <p className="text-sm text-slate-500">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs text-slate-400">{subtitle}</p>
    </div>
  );
}

function Section({ title, icon, children }: any) {
  return (
    <div className="bg-white rounded-3xl shadow p-6 space-y-4">
      <h3 className="font-semibold flex items-center gap-2">
        {icon} {title}
      </h3>
      {children}
    </div>
  );
}

function QuickAction({ icon, label }: any) {
  return (
    <button className="bg-slate-100 hover:bg-slate-200 rounded-2xl p-4 flex flex-col items-center gap-2">
      {icon}
      <span className="text-sm">{label}</span>
    </button>
  );
}

function Mood({ icon, label, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-1 text-slate-600 hover:text-indigo-600"
    >
      {icon}
      <span className="text-xs">{label}</span>
    </button>
  );
}
