"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Footprints, Timer, Play, Pause, RotateCcw } from "lucide-react";

interface WalkingRunningTrackerProps {
    steps: number;
    dailyTotal: number; // in minutes
    onLog: (type: 'walk' | 'run', duration: number, distance?: number, steps?: number) => void;
}

export default function WalkingRunningTracker({ steps, dailyTotal, onLog }: WalkingRunningTrackerProps) {
    const [mode, setMode] = useState<'walk' | 'run'>('walk');
    const [isActive, setIsActive] = useState(false);
    const [time, setTime] = useState(0);

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;
        if (isActive) {
            interval = setInterval(() => {
                setTime((prevTime) => prevTime + 1);
            }, 1000);
        } else if (!isActive && time !== 0) {
            if (interval) clearInterval(interval);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isActive, time]);

    // Mock timer
    // In a real app, this would use proper interval handling with web workers or context
    const toggleTimer = () => {
        setIsActive(!isActive);
    };

    const resetTimer = () => {
        setIsActive(false);
        setTime(0);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleStop = () => {
        setIsActive(false);
        if (time > 0) {
            // Log the session
            onLog(mode, Math.ceil(time / 60)); // log in minutes
        }
        setTime(0);
    };

    // Manual input state
    const [manualDuration, setManualDuration] = useState(30);

    return (
        <div className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/60 border border-slate-100/50">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-700 flex items-center gap-2">
                    <Footprints size={20} className="text-orange-500" /> Steps & Cardio
                </h3>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-6 p-1 bg-slate-100 rounded-2xl">
                <button
                    onClick={() => setMode('walk')}
                    className={`py-2 rounded-xl text-sm font-bold transition-all ${mode === 'walk' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'}`}
                >
                    Walking
                </button>
                <button
                    onClick={() => setMode('run')}
                    className={`py-2 rounded-xl text-sm font-bold transition-all ${mode === 'run' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-500'}`}
                >
                    Running
                </button>
            </div>

            {/* Timer Display if Active */}
            <div className="text-center py-6 relative">
                <div className="absolute inset-0 flex items-center justify-center opacity-5">
                    <Timer size={120} />
                </div>

                <div className="text-5xl font-black text-slate-800 font-mono tracking-tighter mb-2">
                    {formatTime(time)}
                </div>
                <p className="text-sm font-medium text-slate-400">Duration</p>

                {/* Daily Total Badge */}
                {!isActive && dailyTotal > 0 && (
                    <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-sm font-bold">
                        <Footprints size={14} /> Today: {dailyTotal} min
                    </div>
                )}
            </div>

            <div className="flex gap-4 mb-8">
                {isActive ? (
                    <button
                        onClick={handleStop}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-red-200 transition-all"
                    >
                        <Pause fill="currentColor" size={20} /> Stop & Log
                    </button>
                ) : (
                    <button
                        onClick={toggleTimer} // For demo purpose just starts timer, ideally use setInterval
                        className="flex-1 bg-slate-800 hover:bg-slate-900 text-white font-bold py-3 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-slate-300 transition-all"
                    >
                        <Play fill="currentColor" size={20} /> Start {mode === 'walk' ? 'Walk' : 'Run'}
                    </button>
                )}
            </div>

            {/* Quick Manual Log */}
            <div className="pt-6 border-t border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase mb-3">Quick Manual Log</p>
                <div className="flex gap-2">
                    <input
                        type="number"
                        value={manualDuration}
                        onChange={(e) => setManualDuration(parseInt(e.target.value))}
                        className="w-20 bg-slate-50 border-slate-200 rounded-xl px-3 font-bold text-slate-700"
                    />
                    <span className="self-center font-bold text-slate-400 text-sm">min</span>
                    <button
                        onClick={() => onLog(mode, manualDuration)}
                        className="flex-1 bg-orange-50 hover:bg-orange-100 text-orange-600 font-bold py-2 rounded-xl transition-colors ml-2"
                    >
                        Add Entry
                    </button>
                </div>
            </div>

        </div>
    );
}
