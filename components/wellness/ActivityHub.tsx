"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Footprints, Timer, Play, Pause, Flower2, Brain, Dumbbell } from "lucide-react";

interface ActivityHubProps {
    stats: {
        exercise: number; // Walk/Run handled by generic exercise for now, or use specific if passed
        yoga: number;
        meditation: number;
        workout: number;
    };
    goals: {
        stepGoal: number; // For walk/run approximation
        yogaGoal: number;
        meditationGoal: number;
        workoutGoal: number;
    };
    onLog: (type: 'walk' | 'run' | 'yoga' | 'meditation' | 'workout', duration: number) => void;
}

export default function ActivityHub({ stats, goals, onLog }: ActivityHubProps) {
    const [activeTab, setActiveTab] = useState<'cardio' | 'mindfulness' | 'gym'>('cardio');
    const [activityType, setActivityType] = useState<'walk' | 'run' | 'yoga' | 'meditation' | 'workout'>('walk');

    // Timer State
    const [isActive, setIsActive] = useState(false);
    const [time, setTime] = useState(0);

    // Initial sub-type selection based on tab
    useEffect(() => {
        if (activeTab === 'cardio') setActivityType('walk');
        if (activeTab === 'mindfulness') setActivityType('yoga');
        if (activeTab === 'gym') setActivityType('workout');
    }, [activeTab]);

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

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleStop = () => {
        setIsActive(false);
        if (time > 0) {
            onLog(activityType, Math.ceil(time / 60));
        }
        setTime(0);
    };

    const getProgress = () => {
        if (activeTab === 'cardio') return Math.min(100, (stats.exercise / (goals.stepGoal / 100)) * 100); // Rough approximation: 100 steps/min? No, let's just use 60 mins as base if stepGoal is high
        if (activeTab === 'mindfulness') {
            const totalMind = stats.yoga + stats.meditation;
            const goalMind = goals.yogaGoal + goals.meditationGoal;
            return Math.min(100, (totalMind / goalMind) * 100);
        }
        if (activeTab === 'gym') return Math.min(100, (stats.workout / goals.workoutGoal) * 100);
        return 0;
    };

    const getDailyTotal = () => {
        if (activeTab === 'cardio') return stats.exercise;
        if (activeTab === 'mindfulness') return stats.yoga + stats.meditation;
        if (activeTab === 'gym') return stats.workout;
        return 0;
    };

    return (
        <div className="bg-white rounded-[2.5rem] p-6 shadow-xl shadow-slate-200/60 border border-slate-100/50 relative overflow-hidden">
            {/* Header / Tabs */}
            <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
                <button
                    onClick={() => setActiveTab('cardio')}
                    className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${activeTab === 'cardio' ? 'bg-orange-500 text-white shadow-lg shadow-orange-200' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
                >
                    🏃 Cardio
                </button>
                <button
                    onClick={() => setActiveTab('mindfulness')}
                    className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${activeTab === 'mindfulness' ? 'bg-violet-500 text-white shadow-lg shadow-violet-200' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
                >
                    🧘 Mindfulness
                </button>
                <button
                    onClick={() => setActiveTab('gym')}
                    className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${activeTab === 'gym' ? 'bg-red-500 text-white shadow-lg shadow-red-200' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
                >
                    💪 Gym
                </button>
            </div>

            {/* Content Area */}
            <div className="text-center py-4 relative min-h-[160px] flex flex-col items-center justify-center">
                {/* Timer Display */}
                <div className="text-6xl font-black text-slate-800 font-mono tracking-tighter mb-2">
                    {formatTime(time)}
                </div>

                {/* Activity Selector */}
                <div className="flex gap-2 mb-4">
                    {activeTab === 'cardio' && (
                        <>
                            <button onClick={() => setActivityType('walk')} className={`px-3 py-1 rounded-lg text-xs font-bold ${activityType === 'walk' ? 'bg-orange-100 text-orange-600' : 'text-slate-400'}`}>Walk</button>
                            <button onClick={() => setActivityType('run')} className={`px-3 py-1 rounded-lg text-xs font-bold ${activityType === 'run' ? 'bg-orange-100 text-orange-600' : 'text-slate-400'}`}>Run</button>
                        </>
                    )}
                    {activeTab === 'mindfulness' && (
                        <>
                            <button onClick={() => setActivityType('yoga')} className={`px-3 py-1 rounded-lg text-xs font-bold ${activityType === 'yoga' ? 'bg-violet-100 text-violet-600' : 'text-slate-400'}`}>Yoga</button>
                            <button onClick={() => setActivityType('meditation')} className={`px-3 py-1 rounded-lg text-xs font-bold ${activityType === 'meditation' ? 'bg-violet-100 text-violet-600' : 'text-slate-400'}`}>Meditate</button>
                        </>
                    )}
                </div>

                {/* Progress Badge */}
                {!isActive && getDailyTotal() > 0 && (
                    <div className="absolute top-0 right-0 inline-flex items-center gap-2 px-3 py-1 bg-slate-50 text-slate-600 rounded-full text-xs font-bold border border-slate-100">
                        Today: {getDailyTotal()} min
                    </div>
                )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
                {isActive ? (
                    <button
                        onClick={handleStop}
                        className="flex-1 bg-slate-800 hover:bg-slate-900 text-white font-bold py-4 rounded-3xl flex items-center justify-center gap-2 shadow-xl shadow-slate-200 transition-all"
                    >
                        <Pause fill="currentColor" size={20} /> Stop & Log
                    </button>
                ) : (
                    <button
                        onClick={() => setIsActive(true)}
                        className={`flex-1 text-white font-bold py-4 rounded-3xl flex items-center justify-center gap-2 shadow-xl transition-all
                            ${activeTab === 'cardio' ? 'bg-orange-500 hover:bg-orange-600 shadow-orange-200' :
                                activeTab === 'mindfulness' ? 'bg-violet-500 hover:bg-violet-600 shadow-violet-200' :
                                    'bg-red-500 hover:bg-red-600 shadow-red-200'}
                        `}
                    >
                        <Play fill="currentColor" size={20} /> Start Session
                    </button>
                )}
            </div>
        </div>
    );
}
