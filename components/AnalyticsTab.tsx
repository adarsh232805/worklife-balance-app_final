"use client";

import {
  BarChart3,
  Brain,
  Flame,
  Clock,
  TrendingUp,
} from "lucide-react";

const WEEK_DATA = [
  { day: "Mon", focus: 3 },
  { day: "Tue", focus: 4 },
  { day: "Wed", focus: 2 },
  { day: "Thu", focus: 5 },
  { day: "Fri", focus: 4 },
  { day: "Sat", focus: 1 },
  { day: "Sun", focus: 2 },
];

export default function AnalyticsTab() {
  return (
    <div className="space-y-8">

      {/* ================= TOP METRICS ================= */}
      <div className="grid md:grid-cols-4 gap-6">

        <MetricCard
          icon={<Clock />}
          title="Focus Hours"
          value="21h"
          subtitle="This week"
        />

        <MetricCard
          icon={<Flame />}
          title="Streak"
          value="5 days"
          subtitle="Consistent focus"
        />

        <MetricCard
          icon={<Brain />}
          title="Balance Score"
          value="78%"
          subtitle="Healthy range"
        />

        <MetricCard
          icon={<TrendingUp />}
          title="Productivity"
          value="+18%"
          subtitle="vs last week"
        />
      </div>

      {/* ================= WEEKLY FOCUS CHART ================= */}
      <div className="bg-white rounded-3xl shadow p-6">
        <h2 className="font-semibold mb-4 flex items-center gap-2">
          <BarChart3 size={18} /> Weekly Focus Time
        </h2>

        <div className="flex items-end gap-4 h-40">
          {WEEK_DATA.map((d) => (
            <div key={d.day} className="flex flex-col items-center w-full">
              <div
                className="w-8 rounded-xl bg-indigo-600 transition-all"
                style={{ height: `${d.focus * 24}px` }}
              />
              <span className="text-xs mt-2 text-slate-600">
                {d.day}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ================= INSIGHTS ================= */}
      <div className="grid md:grid-cols-2 gap-6">

        <InsightCard
          title="Burnout Risk"
          status="Low"
          description="You are maintaining a healthy balance between work and rest."
        />

        <InsightCard
          title="Focus Pattern"
          status="Best on Thu & Fri"
          description="You perform deep work better later in the week."
        />
      </div>

      {/* ================= SESSION HISTORY ================= */}
      <div className="bg-white rounded-3xl shadow p-6">
        <h2 className="font-semibold mb-4">Recent Focus Sessions</h2>

        <ul className="text-sm text-slate-600 space-y-3">
          <li className="flex justify-between">
            <span>Deep Focus</span>
            <span>50 min • Today</span>
          </li>
          <li className="flex justify-between">
            <span>Pomodoro</span>
            <span>25 min • Yesterday</span>
          </li>
          <li className="flex justify-between">
            <span>Pomodoro</span>
            <span>25 min • Yesterday</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function MetricCard({
  icon,
  title,
  value,
  subtitle,
}: any) {
  return (
    <div className="bg-white rounded-2xl shadow p-6">
      <div className="text-indigo-600 mb-2">{icon}</div>
      <p className="text-sm text-slate-500">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs text-slate-400 mt-1">{subtitle}</p>
    </div>
  );
}

function InsightCard({
  title,
  status,
  description,
}: any) {
  return (
    <div className="bg-white rounded-2xl shadow p-6">
      <p className="font-semibold mb-1">{title}</p>
      <p className="text-indigo-600 font-medium">{status}</p>
      <p className="text-sm text-slate-600 mt-2">
        {description}
      </p>
    </div>
  );
}
