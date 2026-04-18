"use client";

import { useEffect, useState } from "react";
import FocusTimer from "./FocusTimer";
import { api } from "@/lib/api";
import { Brain, Calendar, Clock, Coffee, Zap } from "lucide-react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

export default function FocusTab() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [liveState, setLiveState] = useState<{ mode: string; timeLeft: number; isActive: boolean; totalTime: number } | null>(null);

  const fetchHistory = async () => {
    try {
      // Use local date to avoid UTC date mismatch issues
      const now = new Date();
      const today = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0');

      const data = await api.activity.getHistory(today);
      setHistory(data);
    } catch (error) {
      console.error("Failed to fetch focus history", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleSessionComplete = () => {
    fetchHistory(); // Refresh history when a session is done
    setLiveState(prev => prev ? { ...prev, isActive: false } : null);
  };

  const handleTick = (state: { mode: string; timeLeft: number; isActive: boolean; totalTime: number }) => {
    setLiveState(state);
  };

  // derived state for live card
  const isLive = liveState?.isActive && liveState.mode === 'focus';
  const elapsed = isLive && liveState ? liveState.totalTime - liveState.timeLeft : 0;
  const progress = isLive && liveState ? (elapsed / liveState.totalTime) * 100 : 0;

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* LEFT: TIMER */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="lg:col-span-2"
      >
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl overflow-hidden relative">
          {/* Ambient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/80 via-white to-pink-50/50 -z-10" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-100 rounded-full blur-3xl opacity-30 -translate-y-1/2 translate-x-1/2" />

          <div className="p-8 md:p-12">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-black text-slate-800 tracking-tight mb-2">Deep Focus Flow</h2>
              <p className="text-slate-500 font-medium">Select a mode below to start your session.</p>
            </div>
            <FocusTimer onSessionComplete={handleSessionComplete} onTick={handleTick} />
          </div>
        </div>
      </motion.div>

      {/* RIGHT: HISTORY */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-6"
      >
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-lg shadow-slate-200/50 p-6 h-full max-h-[600px] flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-lg flex items-center gap-2 text-slate-800">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                <Brain size={20} />
              </div>
              Today's Journey
            </h3>
            <span className="text-xs font-bold bg-slate-100 text-slate-500 px-3 py-1 rounded-full">
              {history.length} Sessions
            </span>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
            {/* LIVE SESSION CARD */}
            <AnimatePresence>
              {isLive && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginBottom: 16 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  className="bg-indigo-600 rounded-2xl p-5 text-white shadow-lg shadow-indigo-600/30 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-3 opacity-20">
                    <ActivityIcon size={48} />
                  </div>
                  <div className="flex items-center gap-3 mb-3 relative z-10">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                    </span>
                    <span className="font-bold tracking-wider text-xs uppercase">Live Session</span>
                  </div>
                  <div className="relative z-10">
                    <div className="flex justify-between items-end mb-2">
                      <span className="text-2xl font-mono font-bold">
                        {Math.floor(elapsed / 60)}:{String(elapsed % 60).padStart(2, '0')}
                      </span>
                      <span className="text-xs font-medium text-indigo-200">
                        Target: {Math.floor(liveState?.totalTime! / 60)}m
                      </span>
                    </div>
                    {/* Progress Bar */}
                    <div className="h-1.5 bg-black/20 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-white"
                        animate={{ width: `${progress}%` }}
                        transition={{ ease: "linear", duration: 1 }}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* HISTORY LIST */}
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => <div key={i} className="h-20 bg-slate-50 rounded-2xl animate-pulse" />)}
              </div>
            ) : history.length === 0 && !isLive ? (
              <div className="flex flex-col items-center justify-center py-16 text-slate-400 bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-100">
                <div className="p-4 bg-white rounded-full shadow-sm mb-4">
                  <Clock size={32} className="text-indigo-200" />
                </div>
                <p className="font-semibold text-slate-600">No sessions yet</p>
                <p className="text-sm">Start the timer to track your flow!</p>
              </div>
            ) : (
              <AnimatePresence mode="popLayout">
                {history.map((session: any, index: number) => {
                  const start = new Date(session.startTime);
                  const end = new Date(start.getTime() + session.duration * 60000);

                  return (
                    <motion.div
                      key={session._id}
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="group relative bg-white p-4 rounded-2xl border border-slate-100 hover:border-indigo-100 hover:shadow-lg hover:shadow-indigo-100/50 transition-all duration-300"
                    >
                      <div className="flex items-center gap-4">
                        {/* ICON */}
                        <div className={`
                            w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-105 duration-300
                            ${session.type === 'Focus'
                            ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-indigo-200'
                            : 'bg-gradient-to-br from-teal-400 to-emerald-500 text-white shadow-teal-200'
                          }
                            `}>
                          {session.type === 'Focus' ? <Brain size={20} /> : <Coffee size={20} />}
                        </div>

                        {/* CONTENT */}
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="font-bold text-slate-800 text-sm truncate">
                              {session.type === 'Focus' ? 'Deep Work' : 'Break'}
                            </h4>
                            <span className="text-[10px] font-bold text-slate-300 uppercase">
                              +{session.type === 'Focus' ? Math.min(50, session.duration * 5) : 0} XP
                            </span>
                          </div>

                          <div className="flex items-center gap-3 text-xs font-medium text-slate-400">
                            <span className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-md text-slate-500 group-hover:bg-slate-100 transition-colors">
                              <Clock size={10} />
                              {format(start, 'h:mm a')}
                            </span>
                          </div>
                        </div>

                        {/* DURATION */}
                        <div className="text-right shrink-0 pl-3">
                          <span className="block text-lg font-black text-slate-800 leading-none">
                            {session.duration}
                          </span>
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">
                            MIN
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            )}
          </div>
        </div>

        {/* PRO TIP / STATS CARD */}
        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[2rem] p-6 text-white shadow-xl shadow-indigo-600/20 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-700" />
          <div className="relative z-10">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-3 bg-white/10 rounded-xl backdrop-blur-md">
                <Zap size={24} className="text-yellow-300" fill="currentColor" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Focus Tip</h3>
                <p className="text-indigo-100 text-xs font-medium uppercase tracking-wider">Productivity Hack</p>
              </div>
            </div>
            <p className="text-indigo-50 text-sm leading-relaxed font-medium">
              "The best way to get something done is to begin." <br />
              Start with just <span className="text-white font-bold underline decoration-yellow-400/50 decoration-2">5 minutes</span> and let momentum take over.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// Icon helper
function ActivityIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
    </svg>
  );
}

