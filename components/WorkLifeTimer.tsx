"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, Check, Coffee, Brain, Zap } from "lucide-react";
import { api } from "@/lib/api";

const MODES = {
  focus: { label: "Focus", minutes: 25, color: "text-primary", bg: "bg-primary", icon: Brain },
  short: { label: "Short Break", minutes: 5, color: "text-teal-500", bg: "bg-teal-500", icon: Coffee },
  long: { label: "Long Break", minutes: 15, color: "text-indigo-500", bg: "bg-indigo-500", icon: Zap },
};

type ModeKey = keyof typeof MODES;

export default function WorkLifeTimer({ onSessionComplete }: { onSessionComplete?: () => void }) {
  const [mode, setMode] = useState<ModeKey>("focus");
  const [timeLeft, setTimeLeft] = useState(MODES.focus.minutes * 60);
  const [isActive, setIsActive] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);

  // Audio ref (removed in favor of Web Audio API)

  const playNotificationSound = () => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;

      const ctx = new AudioContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(880, ctx.currentTime); // A5
      oscillator.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.5); // Drop to A4

      gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);

      oscillator.start();
      oscillator.stop(ctx.currentTime + 0.5);
    } catch (e) {
      console.error("Audio play failed", e);
    }
  };

  useEffect(() => {
    // Reset timer when mode changes
    setTimeLeft(MODES[mode].minutes * 60);
    setIsActive(false);
  }, [mode]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      handleComplete();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  const handleComplete = async () => {
    setIsActive(false);
    playNotificationSound();

    // Only log "Focus" sessions to the backend
    if (mode === "focus") {
      try {
        await api.activity.create({
          type: "Focus",
          duration: MODES.focus.minutes,
          startTime: new Date(Date.now() - MODES.focus.minutes * 60000).toISOString(),
        });
        setSessionCount(c => c + 1);
        if (onSessionComplete) onSessionComplete();
      } catch (error) {
        console.error("Failed to save session", error);
      }
    }
  };

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(MODES[mode].minutes * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const progress = ((MODES[mode].minutes * 60 - timeLeft) / (MODES[mode].minutes * 60)) * 100;
  const CurrentIcon = MODES[mode].icon;

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto">
      {/* Mode Switcher */}
      <div className="flex bg-slate-100 p-1 rounded-2xl mb-8 w-full shadow-inner">
        {(Object.keys(MODES) as ModeKey[]).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`flex-1 py-3 px-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2
              ${mode === m ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
          >
            <span className="hidden sm:inline">{MODES[m].label}</span>
            <span className="sm:hidden">{MODES[m].label.split(" ")[0]}</span>
          </button>
        ))}
      </div>

      {/* Timer Circle */}
      <div className="relative w-72 h-72 mb-10">
        {/* SVG Circle for Progress */}
        <svg className="w-full h-full transform -rotate-90 text-slate-100">
          <circle
            cx="144"
            cy="144"
            r="136"
            stroke="currentColor"
            strokeWidth="12"
            fill="transparent"
          />
          <circle
            cx="144"
            cy="144"
            r="136"
            stroke="currentColor"
            strokeWidth="12"
            fill="transparent"
            strokeDasharray={2 * Math.PI * 136}
            strokeDashoffset={2 * Math.PI * 136 * (1 - progress / 100)}
            strokeLinecap="round"
            className={`${MODES[mode].color} transition-all duration-1000 ease-linear`}
          />
        </svg>

        {/* Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <CurrentIcon size={40} className={`${MODES[mode].color} mb-4 opacity-80`} />
          <span className={`text-7xl font-bold ${MODES[mode].color} font-mono tracking-tighter`}>
            {formatTime(timeLeft)}
          </span>
          <p className="text-slate-400 font-bold mt-2 uppercase tracking-widest text-xs">
            {isActive ? "Running..." : "Paused"}
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-6">
        <button
          onClick={resetTimer}
          className="p-5 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors shadow-sm hover:shadow-md"
          title="Reset"
        >
          <RotateCcw size={24} />
        </button>

        <button
          onClick={toggleTimer}
          className={`p-8 rounded-full text-white shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all
                ${MODES[mode].bg} ring-4 ring-offset-4 ring-slate-50`}
        >
          {isActive ? <Pause size={40} fill="currentColor" /> : <Play size={40} fill="currentColor" className="ml-2" />}
        </button>

        <button
          onClick={handleComplete}
          className="p-5 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors shadow-sm hover:shadow-md"
          title="Finish (Debug)"
        >
          <Check size={24} />
        </button>
      </div>

      {sessionCount > 0 && (
        <div className="mt-8 px-6 py-3 bg-green-50 text-green-700 rounded-full text-sm font-bold animate-fade-in border border-green-100 shadow-sm flex items-center gap-2">
          <Zap size={16} className="fill-current" />
          {sessionCount} Focus Session{sessionCount > 1 ? "s" : ""} Completed
        </div>
      )}
    </div>
  );
}
