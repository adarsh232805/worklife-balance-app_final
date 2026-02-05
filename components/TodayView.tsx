"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
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
  ArrowRight,
  CheckCircle2,
  Circle
} from "lucide-react";
import { api } from "@/lib/api";
import TaskModal from "@/components/TaskModal";

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

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

/* ================= COMPONENT ================= */

export default function TodayView() {
  const [quote, setQuote] = useState("");
  const [mood, setMood] = useState<string | null>(null);
  const [reminders, setReminders] = useState<any[]>([]);
  const [focusStats, setFocusStats] = useState({ minutes: 0, score: "N/A" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchTasks = useCallback(async () => {
    try {
      // Fetch tasks for today
      const today = new Date().toISOString().split("T")[0];
      const data = await api.tasks.getAll(today);
      setReminders(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAnalytics = useCallback(async () => {
    try {
      const data = await api.analytics.get();
      const mins = data.focusMinutes || 0;
      let score = "Needs Attention";
      if (mins >= 120) score = "Excellent";
      else if (mins >= 60) score = "Good";

      setFocusStats({ minutes: mins, score });
    } catch (error) {
      console.error("Error fetching analytics:", error);
    }
  }, []);

  /* LOAD DATA */
  useEffect(() => {
    setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
    fetchTasks();
    fetchAnalytics();

    // Simple polling for "real-time" feel (every 30s)
    const interval = setInterval(() => {
      fetchTasks();
      fetchAnalytics();
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchTasks, fetchAnalytics]);

  const handleAddTask = async (task: any) => {
    try {
      await api.tasks.create(task);
      fetchTasks(); // Refresh list immediately
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const toggleTask = async (id: string, currentStatus: boolean) => {
    try {
      // Optimistic update
      setReminders(prev => prev.map(r => r._id === id ? { ...r, completed: !currentStatus } : r));
      await api.tasks.update(id, { completed: !currentStatus });
      fetchTasks();
    } catch (error) {
      console.error("Error updating task:", error);
      fetchTasks(); // Revert on error
    }
  };

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
    <>
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-8 pb-20 md:pb-0"
      >

        {/* HEADER */}
        <motion.div variants={item} className="flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              {getGreeting()} 👋
            </h1>
            <p className="text-muted-foreground mt-2 font-medium">{todayString()}</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="md:hidden p-3 bg-primary text-white rounded-full shadow-lg shadow-primary/30"
          >
            <Plus />
          </button>
        </motion.div>

        {/* OVERVIEW CARDS */}
        <motion.div variants={item} className="grid md:grid-cols-3 gap-6">

          <Card
            icon={<Flame className="text-orange-500" />}
            title="Focus Today"
            value={`${focusStats.minutes} min`}
            subtitle={focusStats.score}
            trend="+12% from yesterday"
          />

          <Card
            icon={<Bell className="text-indigo-600" />}
            title="Tasks"
            value={reminders.filter(r => !r.completed).length}
            subtitle="Pending today"
            trend="You're on track"
          />

          <Card
            icon={<Calendar className="text-green-600" />}
            title="Balance"
            value={focusStats.score}
            subtitle="Work-Life Status"
            trend="Looking healthy"
          />

        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">

          {/* LEFT COLUMN */}
          <div className="lg:col-span-2 space-y-6">
            {/* TODAY TASKS */}
            <motion.div variants={item}>
              <Section
                title="Your Tasks"
                icon={<Clock className="text-primary" />}
                action={
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 text-sm font-semibold text-primary bg-primary/10 px-4 py-2 rounded-full hover:bg-primary/20 transition-colors"
                  >
                    <Plus size={16} /> Add New
                  </button>
                }
              >
                {loading ? (
                  <div className="p-8 text-center text-muted-foreground">Loading tasks...</div>
                ) : reminders.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground bg-slate-50/50 rounded-xl border border-dashed">
                    <p>No tasks for today. Enjoy your day! 🎉</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {reminders.map((r: any) => (
                      <div
                        key={r._id}
                        onClick={() => toggleTask(r._id, r.completed)}
                        className={`flex justify-between items-center border rounded-xl p-4 transition-all cursor-pointer group ${r.completed
                            ? 'bg-slate-50 border-slate-100 opacity-60'
                            : 'bg-white border-slate-100 hover:shadow-md hover:border-slate-200'
                          }`}
                      >
                        <div className="flex items-center gap-4">
                          <button className={`transition-colors ${r.completed ? 'text-green-500' : 'text-slate-300 group-hover:text-primary'}`}>
                            {r.completed ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                          </button>
                          <div>
                            <p className={`font-medium ${r.completed ? 'text-slate-500 line-through' : 'text-slate-900'}`}>
                              {r.title}
                            </p>
                            <div className="flex items-center gap-3 mt-1">
                              <p className="text-xs text-muted-foreground flex items-center gap-1">
                                <Clock size={12} />
                                {new Date(r.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </p>
                              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${r.priority === 'High' ? 'bg-red-50 text-red-600' :
                                  r.priority === 'Medium' ? 'bg-blue-50 text-blue-600' :
                                    'bg-green-50 text-green-600'
                                }`}>
                                {r.priority}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Section>
            </motion.div>

            {/* QUICK ACTIONS */}
            <motion.div variants={item}>
              <Section title="Quick Actions" icon={<Play className="text-primary" />}>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div onClick={() => { }}><QuickAction icon={<Play />} label="Start Focus" color="bg-indigo-50 text-indigo-600" /></div>
                  <div onClick={() => setIsModalOpen(true)}><QuickAction icon={<Plus />} label="Add Task" color="bg-pink-50 text-pink-600" /></div>
                  <QuickAction icon={<Calendar />} label="Calendar" color="bg-orange-50 text-orange-600" />
                  <QuickAction icon={<Coffee />} label="Take Break" color="bg-teal-50 text-teal-600" />
                </div>
              </Section>
            </motion.div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-6">
            {/* WELLBEING */}
            <motion.div variants={item}>
              <Section title="Mood Check" icon={<Smile className="text-primary" />}>
                <div className="flex justify-between gap-2">
                  <Mood icon={<Smile size={28} />} label="Good" active={mood === "good"} onClick={() => setMood("good")} />
                  <Mood icon={<Meh size={28} />} label="Okay" active={mood === "ok"} onClick={() => setMood("ok")} />
                  <Mood icon={<Frown size={28} />} label="Stressed" active={mood === "bad"} onClick={() => setMood("bad")} />
                </div>

                {mood && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-4 p-4 rounded-xl bg-primary/5 text-primary text-sm font-medium"
                  >
                    {mood === "bad"
                      ? "Take a short break and breathe. You got this! 🌿"
                      : "Great to hear! Keep that momentum going! 💪"}
                  </motion.div>
                )}
              </Section>
            </motion.div>

            {/* MOTIVATION */}
            <motion.div variants={item}>
              <div className="relative overflow-hidden rounded-3xl p-8 text-center bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-xl shadow-indigo-200">
                <div className="relative z-10">
                  <p className="text-lg font-medium leading-relaxed">“{quote}”</p>
                  <div className="mt-4 w-12 h-1 bg-white/30 mx-auto rounded-full" />
                </div>

                {/* Decorative circles */}
                <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
              </div>
            </motion.div>
          </div>

        </div>
      </motion.div>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddTask={handleAddTask}
      />
    </>
  );
}

/* ================= UI HELPERS ================= */

function Card({ icon, title, value, subtitle, trend }: any) {
  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 rounded-2xl bg-slate-50">{icon}</div>
        <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">{trend}</span>
      </div>
      <div>
        <p className="text-slate-500 font-medium mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-slate-800 tracking-tight">{value}</h3>
        <p className="text-sm text-slate-400 mt-1">{subtitle}</p>
      </div>
    </div>
  );
}

function Section({ title, icon, action, children }: any) {
  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 md:p-8 h-full">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-xl">
            {icon}
          </div>
          <h3 className="text-lg font-bold text-slate-800">
            {title}
          </h3>
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

function QuickAction({ icon, label, color }: any) {
  return (
    <button className={`${color} bg-opacity-50 hover:bg-opacity-100 transition-all duration-300 rounded-2xl p-4 flex flex-col items-center justify-center gap-3 h-32 w-full group`}>
      <div className="p-3 bg-white rounded-xl shadow-sm group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <span className="text-sm font-semibold">{label}</span>
    </button>
  );
}

function Mood({ icon, label, onClick, active }: any) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 flex flex-col items-center gap-3 p-4 rounded-2xl transition-all duration-300 ${active
        ? "bg-primary text-white shadow-lg shadow-primary/30 scale-105"
        : "bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
        }`}
    >
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}

