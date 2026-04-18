"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sun,
  Moon,
  CloudRain,
  CheckCircle2,
  Clock,
  Target,
  Flame,
  Zap,
  Plus,
  Calendar,
  Bell,
  Trophy,
  Activity,
  Droplet,
  Heart,
  Coffee,
  Crown,
  Footprints,
  Utensils,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/api";
import TaskModal from "@/components/TaskModal";
import { useSession } from "next-auth/react";
import AICoachWidget from "@/components/AICoachWidget";
import NotificationCenter from "@/components/NotificationCenter";
import LeaderboardWidget from "@/components/games/LeaderboardWidget";
import WeeklySummary from "@/components/WeeklySummary";

/* ================= HELPERS ================= */

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 5) return "Good Night";
  if (hour < 12) return "Good Morning";
  if (hour < 18) return "Good Afternoon";
  return "Good Evening";
};

const todayString = () => {
  return new Date().toLocaleDateString("en-US", { weekday: 'long', month: 'long', day: 'numeric' });
};

const QUOTES = [
  "Small steps every day.",
  "Focus on the process.",
  "You are doing great.",
  "Keep moving forward.",
  "Make today count."
];

/* ================= COMPONENTS ================= */

function StatCard({ icon, label, value, subLabel, color, trend }: any) {
  const colorStyles = {
    indigo: "bg-indigo-50 text-indigo-600 border-indigo-100",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
    amber: "bg-amber-50 text-amber-600 border-amber-100",
    rose: "bg-rose-50 text-rose-600 border-rose-100",
    cyan: "bg-cyan-50 text-cyan-600 border-cyan-100",
    purple: "bg-purple-50 text-purple-600 border-purple-100",
  }[color as string] || "bg-slate-50 text-slate-600 border-slate-100";

  return (
    <div className={`p-4 rounded-[1.5rem] md:rounded-[2rem] border ${colorStyles} flex flex-col justify-between h-28 md:h-32 hover:scale-[1.02] transition-transform shadow-sm`}>
      <div className="flex justify-between items-start">
        <div className="p-2 bg-white rounded-xl shadow-sm bg-opacity-60 backdrop-blur-sm">
          {icon}
        </div>
        {trend === 'up' && <span className="text-[10px] font-bold bg-white/50 px-2 py-1 rounded-full">↑</span>}
      </div>
      <div>
        <div className="text-2xl font-black leading-none mb-1">{value}</div>
        <div className="text-[10px] font-bold uppercase opacity-60 tracking-wider text-slate-900">{label}</div>
        <div className="text-[10px] font-medium opacity-50">{subLabel}</div>
      </div>
    </div>
  );
}

export default function TodayView() {
  const { data: session } = useSession();
  const [quote, setQuote] = useState("");
  const [mood, setMood] = useState<string | null>(null);
  const [streak, setStreak] = useState(0);
  const [level, setLevel] = useState(1);
  const [xp, setXp] = useState(0);
  const [tasks, setTasks] = useState<any[]>([]); // Renamed from reminders to tasks for clarity
  const [reminders, setReminders] = useState<any[]>([]); // Actual reminders
  const [events, setEvents] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [healthData, setHealthData] = useState<any>(null);
  const [focusStats, setFocusStats] = useState({ minutes: 0, score: "N/A" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('day');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      let start = new Date(currentDate);
      let end = new Date(currentDate);

      if (viewMode === 'day') {
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
      } else if (viewMode === 'week') {
        const day = start.getDay();
        const diff = start.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
        start.setDate(diff);
        start.setHours(0, 0, 0, 0);
        end = new Date(start);
        end.setDate(start.getDate() + 6);
        end.setHours(23, 59, 59, 999);
      } else if (viewMode === 'month') {
        start.setDate(1);
        start.setHours(0, 0, 0, 0);
        end = new Date(start);
        end.setMonth(start.getMonth() + 1);
        end.setDate(0);
        end.setHours(23, 59, 59, 999);
      }

      const startStr = start.toISOString();
      const endStr = end.toISOString();

      // Parallel Fetch
      const [tasksRes, eventsRes, analyticsRes, progressRes, activityRes, healthRes, remindersRes] = await Promise.all([
        api.tasks.getAll(undefined, startStr, endStr),
        api.calendar.getEvents(undefined, startStr, endStr),
        api.analytics.get(),
        api.user.getProgress(),
        api.activity.getHistory(undefined, startStr, endStr),
        api.health.getDaily(undefined, startStr, endStr).catch(() => null),
        api.reminders.getAll(startStr, endStr) // Fetch actual reminders
      ]);

      setTasks(tasksRes);
      setEvents(eventsRes);
      setActivities(activityRes);
      setReminders(remindersRes || []);
      setStreak(progressRes.streak || 0);
      setLevel(progressRes.level || 1);
      setXp(progressRes.xp || 0);

      // Fix: Map API response structure to component state
      setHealthData({
        waterIntake: healthRes?.totals?.water || 0,
        sleepHours: healthRes?.logs?.find((l: any) => l.type === 'sleep')?.value || 0,
        steps: healthRes?.logs?.filter((l: any) => l.type === 'walk' || l.type === 'run')
          .reduce((acc: number, curr: any) => acc + ((curr.value || 0) * (curr.type === 'run' ? 160 : 100)), 0) || 0,
        logs: healthRes?.logs || [] // Store full logs for timeline
      });

      // Analytics
      const mins = analyticsRes?.today?.focusMinutes || 0;
      let score = "Needs Attention";
      if (mins >= 120) score = "Excellent";
      else if (mins >= 60) score = "Good";
      setFocusStats({ minutes: mins, score });

    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, [currentDate, viewMode]);

  /* LOAD DATA */
  useEffect(() => {
    setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
    fetchData();

    // Polling
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const handleAddTask = async (task: any) => {
    try {
      await api.tasks.create(task);
      fetchData();
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const toggleTask = async (id: string, currentStatus: boolean) => {
    // Optimistic
    setTasks(prev => prev.map(r => r._id === id ? { ...r, completed: !currentStatus } : r));
    try {
      await api.tasks.update(id, { completed: !currentStatus });
    } catch (e) {
      fetchData(); // revert
    }
  };

  const handleAddEvent = async (event: any) => {
    try {
      await api.calendar.createEvent(event);
      fetchData();
    } catch (error) {
      console.error("Error adding event:", error);
    }
  };

  // MERGE ITEMS FOR TIMELINE
  const handleAddReminder = async (reminder: any) => {
    try {
      await api.reminders.create(reminder);
      fetchData();
    } catch (error) {
      console.error("Error adding reminder:", error);
    }
  };

  const toggleReminder = async (id: string, currentStatus: boolean) => {
    // Optimistic
    setReminders(prev => prev.map(r => r._id === id || r.id === id ? { ...r, completed: !currentStatus } : r));
    try {
      await api.reminders.update(id, { completed: !currentStatus });
    } catch (e) {
      fetchData(); // revert
    }
  };

  const timelineItems = [
    ...tasks.map(t => ({
      ...t,
      type: 'task',
    })),
    ...reminders.map(r => ({
      ...r,
      type: 'reminder',
      time: r.time // Reminder timestamp, no UTC conversion to preserve local time
    })),
    ...events.map(e => ({
      ...e,
      type: 'event',
    })),
    ...activities.map(a => ({
      ...a,
      type: 'focus', // Activity type
      title: `${a.type} Session`,
      description: `${a.duration} minutes completed`,
    })),
    ...(healthData?.logs || []).filter((h: any) => ['workout', 'yoga', 'exercise', 'run', 'walk'].includes(h.type)).map((h: any) => ({
      ...h,
      type: 'workout',
      title: h.type.charAt(0).toUpperCase() + h.type.slice(1),
      value: h.value,
      unit: h.unit || 'mins',
      time: h.date // Health logs use 'date' field
    }))
  ].sort((a, b) => new Date(a.time || a.startTime || a.date).getTime() - new Date(b.time || b.startTime || b.date).getTime());

  // Group by Local Date for Week/Month views
  const groupedItems = timelineItems.reduce((groups: any, item: any) => {
    const d = new Date(item.time || item.startTime || item.date);
    const date = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(item);
    return groups;
  }, {});


  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const pendingTasks = tasks.filter(r => !r.completed).length;
  const nextEvent = events.find(e => new Date(e.startTime) > new Date());

  return (
    <>
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 pb-8 p-1 font-sans">

        {/* HEADER AREA */}
        <div className="flex justify-between items-center px-2 md:px-0">
          <div>
            <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                {isMounted ? todayString() : "Loading..."}
            </p>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 leading-none">
              {isMounted ? getGreeting() : "Hello"}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">{session?.user?.name?.split(' ')[0] || "User"}</span>
            </h1>
          </div>
        </div>

        {/* HERO / INSIGHTS ROW */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <motion.div variants={item} className="lg:col-span-2">
            <AICoachWidget />
          </motion.div>

          <motion.div variants={item} className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-[2rem] p-5 border border-slate-100 shadow-sm flex flex-col justify-center items-center text-center">
              <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center mb-3">
                <Flame size={20} fill="currentColor" />
              </div>
              <span className="text-3xl font-black text-slate-800 leading-none">{streak}</span>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Day Streak</span>
            </div>
            <div className="bg-white rounded-[2rem] p-5 border border-slate-100 shadow-sm flex flex-col justify-center items-center text-center">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-500 flex items-center justify-center mb-3">
                <Crown size={20} />
              </div>
              <span className="text-3xl font-black text-slate-800 leading-none">{level}</span>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Level</span>
            </div>
            <button className="col-span-2 py-4 rounded-[2rem] bg-slate-900 text-white font-black shadow-lg hover:scale-[1.02] transition-transform active:scale-95 flex items-center justify-center gap-2"
              onClick={() => setIsModalOpen(true)}
            >
              <Plus size={20} /> New Activity
            </button>
          </motion.div>
        </div>

        {/* BENTO GRID LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LEFT COLUMN: ACTIVITY & HEALTH */}
          <div className="lg:col-span-2 space-y-6">

            {/* STATS ROW */}
            <motion.div variants={item} className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard
                icon={<Target />}
                label="Tasks"
                value={pendingTasks}
                subLabel="Remaining"
                color="indigo"
                trend="neutral"
              />
              <StatCard
                icon={<Clock />}
                label="Focus"
                value={`${focusStats.minutes}m`}
                subLabel={focusStats.score}
                color="amber"
                trend="up"
              />
              <StatCard
                icon={<Droplet />}
                label="Hydration"
                value={healthData?.waterIntake || 0}
                subLabel="mL Drunk"
                color="cyan"
                trend="up"
              />
              <StatCard
                icon={<Moon />}
                label="Sleep"
                value={healthData?.sleepHours || 0}
                subLabel="Hours"
                color="purple"
                trend="neutral"
              />
            </motion.div>

            {/* TIMELINE */}
            <motion.div variants={item} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 min-h-[500px] relative overflow-hidden">
              {/* Background Decoration */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-bl-[10rem] -z-0" />

              <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 relative z-10 gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-lg shadow-slate-900/20 shrink-0">
                    <Calendar size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-800">Your Activity</h3>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                      {viewMode === 'day' ? currentDate.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' }) :
                        viewMode === 'week' ? `Week of ${currentDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}` :
                          currentDate.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-xl self-start md:self-auto">
                  <button onClick={() => setViewMode('day')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === 'day' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}>Day</button>
                  <button onClick={() => setViewMode('week')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === 'week' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}>Week</button>
                  <button onClick={() => setViewMode('month')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === 'month' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}>Month</button>
                </div>

                <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl self-start md:self-auto">
                  <button onClick={() => {
                    const newDate = new Date(currentDate);
                    if (viewMode === 'day') newDate.setDate(newDate.getDate() - 1);
                    if (viewMode === 'week') newDate.setDate(newDate.getDate() - 7);
                    if (viewMode === 'month') newDate.setMonth(newDate.getMonth() - 1);
                    setCurrentDate(newDate);
                  }} className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all text-slate-500"><ChevronLeft size={16} /></button>
                  <button onClick={() => setCurrentDate(new Date())} className="px-3 py-1 hover:bg-white hover:shadow-sm rounded-lg transition-all text-xs font-bold uppercase text-slate-500">Today</button>
                  <button onClick={() => {
                    const newDate = new Date(currentDate);
                    if (viewMode === 'day') newDate.setDate(newDate.getDate() + 1);
                    if (viewMode === 'week') newDate.setDate(newDate.getDate() + 7);
                    if (viewMode === 'month') newDate.setMonth(newDate.getMonth() + 1);
                    setCurrentDate(newDate);
                  }} className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all text-slate-500"><ChevronRight size={16} /></button>
                </div>
              </div>

              {loading ? (
                <div className="space-y-6 animate-pulse relative z-10 w-full">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex gap-4">
                      <div className="w-16 h-4 bg-slate-100 rounded-full mt-2" />
                      <div className="flex-1 h-24 bg-slate-50 rounded-3xl" />
                    </div>
                  ))}
                </div>
              ) : timelineItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-80 text-center border-2 border-dashed border-slate-100 rounded-[2rem] bg-slate-50/30 relative z-10">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm mb-6">
                    <CheckCircle2 size={40} className="text-emerald-500" />
                  </div>
                  <h4 className="text-xl font-bold text-slate-800">Clear Schedule</h4>
                  <p className="text-slate-400 max-w-xs mt-2 leading-relaxed">No activities found for this period.</p>
                  <button onClick={() => setIsModalOpen(true)} className="mt-8 px-6 py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm">
                    Add Activity
                  </button>
                </div>
              ) : (
                <div className="relative space-y-8 py-2 z-10 pl-4 md:pl-0">
                  {/* Timeline Render Logic */}
                  {Object.entries(groupedItems).map(([dateKey, items]: [string, any[]], groupIdx) => (
                    <div key={dateKey} className="relative">
                      {/* Date Header for Week/Month View */}
                      {viewMode !== 'day' && (
                        <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md py-2 mb-4 border-b border-slate-100">
                          <h4 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                            {(() => {
                              const [y, m, d] = dateKey.split('-');
                              return new Date(Number(y), Number(m) - 1, Number(d)).toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' });
                            })()}
                            <span className="text-xs font-normal text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{items.length} items</span>
                          </h4>
                        </div>
                      )}

                      <div className="space-y-6">
                        {items.map((item: any, idx: number) => {
                          const isPast = new Date(item.time || item.startTime) < new Date();
                          const timeStr = new Date(item.time || item.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                          return (
                            <div key={`${dateKey}-${idx}`} className="relative flex gap-4 md:gap-10 group">
                              {/* Time Column */}
                              <div className="hidden md:flex w-16 flex-col items-end pt-5 shrink-0">
                                <span className={`text-sm font-bold ${isPast ? "text-slate-300" : "text-slate-600"}`}>
                                  {timeStr.split(' ')[0]}
                                </span>
                                <span className="text-[10px] font-bold uppercase text-slate-300">
                                  {timeStr.split(' ')[1]}
                                </span>
                              </div>

                              {/* Timeline Line */}
                              <div className="absolute left-[7px] md:left-[87px] top-10 bottom-[-24px] w-[2px] bg-slate-100 last:bottom-0" />

                              {/* Timeline Dot */}
                              <div className={`absolute left-[0px] md:left-[80px] top-6 w-4 h-4 rounded-full border-[3px] border-white shadow-sm transition-all z-20 ${item.type === 'event' ? 'bg-rose-500 ring-4 ring-rose-50' :
                                item.completed ? 'bg-emerald-500 ring-4 ring-emerald-50' :
                                  item.type === 'focus' ? 'bg-amber-500 ring-4 ring-amber-50' :
                                    item.type === 'workout' ? 'bg-cyan-500 ring-4 ring-cyan-50' :
                                      item.type === 'workout' ? 'bg-cyan-500 ring-4 ring-cyan-50' :
                                        item.type === 'reminder' ? 'bg-purple-500 ring-4 ring-purple-50' :
                                          'bg-indigo-500 ring-4 ring-indigo-50'
                                }`} />

                              {/* Card */}
                              <div className={`flex-1 relative p-6 rounded-[2rem] transition-all duration-300 border group-hover:-translate-y-1 ${item.completed
                                ? "bg-slate-50/50 border-transparent opacity-60 grayscale-[0.5]"
                                : "bg-white border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 hover:border-indigo-100"
                                }`}>
                                <div className="flex justify-between items-start">
                                  <div className="space-y-1 w-full">
                                    {/* Mobile Time */}
                                    <div className="flex items-center gap-2 mb-2 md:hidden">
                                      <span className="text-xs font-bold text-slate-400">{timeStr}</span>
                                    </div>

                                    {/* Badges */}
                                    <div className="flex flex-wrap gap-2 mb-3">
                                      {item.type === 'event' && <span className="px-2.5 py-1 bg-rose-50 text-rose-600 text-[10px] font-black uppercase rounded-lg tracking-wide border border-rose-100">Event</span>}
                                      {item.type === 'focus' && <span className="px-2.5 py-1 bg-amber-50 text-amber-600 text-[10px] font-black uppercase rounded-lg tracking-wide border border-amber-100">Focus</span>}
                                      {item.type === 'workout' && <span className="px-2.5 py-1 bg-cyan-50 text-cyan-600 text-[10px] font-black uppercase rounded-lg tracking-wide border border-cyan-100">Workout</span>}
                                      {item.type === 'reminder' && <span className="px-2.5 py-1 bg-purple-50 text-purple-600 text-[10px] font-black uppercase rounded-lg tracking-wide border border-purple-100 mt-1">Reminder</span>}
                                      {item.category && <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-[10px] font-black uppercase rounded-lg tracking-wide border border-slate-200">{item.category}</span>}
                                    </div>

                                    <div className="flex justify-between w-full">
                                      <div>
                                        <h4 className={`text-lg font-bold leading-snug ${item.completed ? "line-through decoration-2 decoration-slate-300" : "text-slate-800"}`}>
                                          {item.title}
                                        </h4>
                                        {item.description && <p className="text-sm text-slate-500 leading-relaxed max-w-md mt-1">{item.description}</p>}
                                        {item.value && <p className="text-sm font-bold text-slate-600 mt-1">{item.value} {item.unit || ''}</p>}
                                      </div>

                                      {/* Action/Icon */}
                                      <div className="shrink-0 ml-4">
                                        {item.type === 'task' ? (
                                          <button
                                            onClick={() => toggleTask(item._id, item.completed)}
                                            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${item.completed
                                              ? "text-emerald-500 bg-emerald-50"
                                              : "text-slate-300 bg-slate-50 hover:bg-indigo-600 hover:text-white hover:shadow-lg hover:shadow-indigo-500/20"
                                              }`}
                                          >
                                            {item.completed ? <CheckCircle2 size={24} className="fill-emerald-500 text-white" /> : <div className="w-6 h-6 rounded-full border-2 border-current" />}
                                          </button>
                                        ) : item.type === 'focus' ? (
                                          <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center">
                                            <Zap size={24} fill="currentColor" />
                                          </div>
                                        ) : item.type === 'workout' ? (
                                          <div className="w-12 h-12 bg-cyan-50 text-cyan-500 rounded-2xl flex items-center justify-center">
                                            <Activity size={24} />
                                          </div>
                                        ) : item.type === 'reminder' ? (
                                          <div className="w-12 h-12 bg-purple-50 text-purple-500 rounded-2xl flex items-center justify-center">
                                            <Bell size={24} />
                                          </div>
                                        ) : (
                                          <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center">
                                            <Calendar size={24} />
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}

                </div>
              )}
            </motion.div>
          </div>

          {/* RIGHT COLUMN: WIDGETS */}
          <div className="space-y-6">

            {/* LEADERBOARD WIDGET */}
            <div className="h-[400px]">
              <LeaderboardWidget />
            </div>

            {/* WEEKLY TRENDS */}
            <div className="bg-white rounded-[2.5rem] p-6 border border-slate-100 shadow-sm">
              <h4 className="font-bold text-slate-800 text-sm uppercase tracking-wide mb-2 flex items-center gap-2">
                <Activity size={16} className="text-indigo-500" /> Weekly Focus
              </h4>
              <WeeklySummary />
            </div>

            {/* UP NEXT WIDGET (Compact) */}
            <motion.div variants={item} className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-xl shadow-slate-900/10 group">
              <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/20 blur-[60px] rounded-full -mr-10 -mt-10 group-hover:bg-indigo-500/30 transition-colors" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-rose-500/10 blur-[50px] rounded-full -ml-10 -mb-10 group-hover:bg-rose-500/20 transition-colors" />

              <div className="relative z-10 flex flex-col h-full justify-between">
                <div className="flex items-center gap-3 opacity-80 backdrop-blur-sm bg-white/5 w-fit px-3 py-1 rounded-full border border-white/5">
                  <Bell size={16} className="text-indigo-300" />
                  <span className="text-xs font-bold uppercase tracking-wider">Up Next</span>
                </div>

                {nextEvent ? (
                  <div className="mt-6">
                    <div className="text-4xl font-black mb-1 tacking-tighter">{new Date(nextEvent.startTime).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</div>
                    <h3 className="text-lg font-bold leading-tight mb-4 line-clamp-2">{nextEvent.title}</h3>
                  </div>
                ) : (
                  <div className="mt-8">
                    <div className="text-2xl font-bold mb-2">Free Time</div>
                    <p className="text-indigo-200 text-sm leading-relaxed">No immediate events scheduled.</p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* WELLNESS SNAPSHOT */}
            <motion.div variants={item} className="bg-white rounded-[2.5rem] border border-emerald-100 shadow-lg shadow-emerald-500/5 p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full -mr-16 -mt-16" />
              <div className="relative z-10">
                <h4 className="font-black text-slate-800 text-lg mb-6 flex items-center gap-2">
                  <Heart className="text-emerald-500 fill-emerald-500" size={20} /> Wellness
                </h4>

                <div className="space-y-4">
                  {/* Hydration Bar */}
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-slate-500 flex items-center gap-1"><Droplet size={12} /> Water</span>
                      <span className="text-sky-600">{healthData?.waterIntake || 0} / 2500ml</span>
                    </div>
                    <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-sky-400 rounded-full" style={{ width: `${Math.min(((healthData?.waterIntake || 0) / 2500) * 100, 100)}%` }} />
                    </div>
                  </div>

                  {/* Steps Bar */}
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-slate-500 flex items-center gap-1"><Footprints size={12} /> Steps</span>
                      <span className="text-orange-500">{healthData?.steps || 0} / 10k</span>
                    </div>
                    <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-orange-400 rounded-full" style={{ width: `${Math.min(((healthData?.steps || 0) / 10000) * 100, 100)}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* MOOD & QUICK ACTIONS */}
            <div className="grid grid-cols-2 gap-4">
              {/* Mood */}
              <motion.div variants={item} className="bg-white rounded-[2rem] p-5 border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-3">Daily Mood</p>
                <div className="flex justify-center gap-1">
                  <button onClick={() => setMood("good")} className={`text-2xl p-2 rounded-xl transition-all ${mood === "good" ? "bg-emerald-100 scale-110" : "grayscale opacity-50 hover:grayscale-0 hover:opacity-100 hover:bg-slate-50"}`}>😊</button>
                  <button onClick={() => setMood("ok")} className={`text-2xl p-2 rounded-xl transition-all ${mood === "ok" ? "bg-amber-100 scale-110" : "grayscale opacity-50 hover:grayscale-0 hover:opacity-100 hover:bg-slate-50"}`}>😐</button>
                  <button onClick={() => setMood("bad")} className={`text-2xl p-2 rounded-xl transition-all ${mood === "bad" ? "bg-rose-100 scale-110" : "grayscale opacity-50 hover:grayscale-0 hover:opacity-100 hover:bg-slate-50"}`}>😫</button>
                </div>
              </motion.div>

              {/* Quick Action */}
              <motion.div variants={item} className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[2rem] p-5 shadow-lg text-white flex flex-col items-center justify-center text-center cursor-pointer hover:scale-[1.03] transition-transform active:scale-95" onClick={() => setIsModalOpen(true)}>
                <Zap size={24} className="mb-2" fill="currentColor" />
                <span className="text-xs font-black uppercase tracking-wide">Quick Log</span>
              </motion.div>
            </div>

          </div>
        </div>

      </motion.div>

      <TaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAddTask={handleAddTask} onAddEvent={handleAddEvent} onAddReminder={handleAddReminder} />
    </>
  );

}
