"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  Brain,
  Flame,
  Clock,
  TrendingUp,
  MoreHorizontal
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts";
import { api } from "@/lib/api";

/* ================= DATA ================= */

// Placeholder for chart data until we have real weekly history from backend
const WEEK_DATA = [
  { day: "Mon", focus: 0 },
  { day: "Tue", focus: 0 },
  { day: "Wed", focus: 0 },
  { day: "Thu", focus: 0 },
  { day: "Fri", focus: 0 },
  { day: "Sat", focus: 0 },
  { day: "Sun", focus: 0 },
];


/* ================= COMPONENT ================= */

export default function AnalyticsTab() {
  const [metrics, setMetrics] = useState({
    focusMinutes: 0,
    completedTasks: 0,
    pendingTasks: 0
  });

  const fetchData = useCallback(async () => {
    try {
      const data = await api.analytics.get();
      setMetrics(data);
    } catch (error) {
      console.error("Failed to fetch analytics", error);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8 pb-20 md:pb-0"
    >

      {/* HEADER */}
      <motion.div variants={item}>
        <h1 className="text-3xl font-bold text-slate-900">Today's Insights</h1>
        <p className="text-slate-500">Track your productivity trends and balance.</p>
      </motion.div>


      {/* ================= TOP METRICS ================= */}
      <motion.div variants={item} className="grid md:grid-cols-4 gap-6">

        <MetricCard
          icon={<Clock />}
          title="Focus Time"
          value={`${metrics.focusMinutes}m`}
          subtitle="Today"
          trend="Tracked"
          color="text-indigo-600 bg-indigo-50"
        />

        <MetricCard
          icon={<Flame />}
          title="Tasks Done"
          value={`${metrics.completedTasks}`}
          subtitle="Completed today"
          trend="Keep it up!"
          color="text-orange-600 bg-orange-50"
        />

        <MetricCard
          icon={<Brain />}
          title="Pending"
          value={`${metrics.pendingTasks}`}
          subtitle="Tasks remaining"
          trend="Action required"
          color="text-emerald-600 bg-emerald-50"
        />

        <MetricCard
          icon={<TrendingUp />}
          title="Productivity"
          value={`${metrics.completedTasks > 0 ? 'Active' : 'Start now'}`}
          subtitle="Status"
          trend="Rising"
          color="text-blue-600 bg-blue-50"
        />
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* ================= WEEKLY FOCUS CHART ================= */}
        <motion.div variants={item} className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm p-6 md:p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="font-bold text-lg flex items-center gap-2 text-slate-800">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                <BarChart3 size={20} />
              </div>
              Weekly Focus (Coming Soon)
            </h2>
            <button className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-50 rounded-full transition-colors">
              <MoreHorizontal size={20} />
            </button>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={WEEK_DATA} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 12 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 12 }}
                />
                <Tooltip
                  cursor={{ fill: '#f1f5f9', radius: 4 }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="focus" radius={[6, 6, 6, 6]}>
                  {WEEK_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.focus > 4 ? '#7c3aed' : '#c4b5fd'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* ================= INSIGHTS & HISTORY ================= */}
        <div className="space-y-6">
          <motion.div variants={item}>
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-6 text-white shadow-lg shadow-indigo-200">
              <h3 className="font-semibold mb-1 opacity-90">Burnout Risk</h3>
              <div className="flex items-end gap-2 mb-4">
                <span className="text-3xl font-bold">Low</span>
                <span className="text-indigo-100 text-sm mb-1">Score: 12/100</span>
              </div>
              <p className="text-sm text-indigo-100 leading-relaxed">
                You are maintaining a healthy balance between work and rest. Keep taking regular breaks!
              </p>
            </div>
          </motion.div>

          {/* SESSION HISTORY */}
          <motion.div variants={item} className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
            <h2 className="font-bold text-slate-800 mb-4">Recent Sessions</h2>
            <div className="space-y-4">
              <HistoryItem type="Deep Focus" duration="50 min" time="Today, 2:30 PM" />
              <HistoryItem type="Pomodoro" duration="25 min" time="Today, 10:15 AM" />
              <HistoryItem type="Pomodoro" duration="25 min" time="Yesterday, 4:45 PM" />
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

/* ================= COMPONENTS ================= */

function MetricCard({
  icon,
  title,
  value,
  subtitle,
  trend,
  color
}: any) {
  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-2xl ${color}`}>{icon}</div>
        <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">{trend}</span>
      </div>
      <div>
        <p className="text-slate-500 font-medium text-sm">{title}</p>
        <p className="text-3xl font-bold text-slate-900 mt-1">{value}</p>
        <p className="text-xs text-slate-400 mt-1">{subtitle}</p>
      </div>
    </div>
  );
}

function HistoryItem({ type, duration, time }: any) {
  return (
    <div className="flex justify-between items-center p-3 rounded-xl hover:bg-slate-50 transition-colors">
      <div className="flex items-center gap-3">
        <div className={`w-2 h-2 rounded-full ${type === 'Deep Focus' ? 'bg-indigo-500' : 'bg-pink-500'}`} />
        <div>
          <p className="font-medium text-slate-800 text-sm">{type}</p>
          <p className="text-xs text-slate-400">{time}</p>
        </div>
      </div>
      <span className="text-sm font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded-lg">
        {duration}
      </span>
    </div>
  );
}
