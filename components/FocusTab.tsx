"use client";

import { useEffect, useState } from "react";
import FocusTimer from "./FocusTimer";
import { api } from "@/lib/api";
import { Brain, Calendar, Clock } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";

export default function FocusTab() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    try {
      const today = new Date().toISOString().split("T")[0];
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
  };

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* LEFT: TIMER */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="lg:col-span-2"
      >
        <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-purple-50/50 to-pink-50/50 -z-10" />

          <div className="p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-slate-800">Deep Focus</h2>
              <p className="text-slate-500">Pick a mode and start your flow.</p>
            </div>
            <FocusTimer onSessionComplete={handleSessionComplete} />
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
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 max-h-[600px] overflow-y-auto">
          <h3 className="font-semibold flex items-center gap-2 mb-6 text-slate-800">
            <div className="p-2 bg-primary/10 rounded-lg"><Brain size={18} className="text-primary" /></div>
            Today's Sessions
          </h3>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => <div key={i} className="h-16 bg-slate-50 rounded-xl animate-pulse" />)}
            </div>
          ) : history.length === 0 ? (
            <div className="text-center py-10 text-slate-400">
              <Clock size={40} className="mx-auto mb-3 opacity-20" />
              <p>No focus sessions yet.</p>
              <p className="text-sm">Start the timer to track your work!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((session: any) => (
                <div key={session._id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${session.type === 'Focus' ? 'bg-primary' : 'bg-teal-500'}`} />
                    <div>
                      <p className="font-semibold text-slate-800">{session.type}</p>
                      <p className="text-xs text-slate-400 flex items-center gap-1">
                        <Calendar size={10} />
                        {format(new Date(session.startTime), 'h:mm a')}
                      </p>
                    </div>
                  </div>
                  <span className="font-mono font-medium text-slate-600 bg-white px-2 py-1 rounded text-sm shadow-sm">
                    {session.duration}m
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-6 text-white shadow-lg">
          <h3 className="font-bold text-lg mb-2">Pro Tip</h3>
          <p className="text-indigo-100 text-sm leading-relaxed">
            The Pomodoro technique suggests 25 minutes of work followed by a 5-minute break. This keeps your mind fresh and reduces fatigue.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
