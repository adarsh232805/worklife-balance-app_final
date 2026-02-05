'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, Check, Coffee, Brain, Zap } from 'lucide-react';
import { api } from '@/lib/api';

const MODES = {
    focus: { label: 'Focus', minutes: 25, color: 'text-primary', bg: 'bg-primary', icon: Brain },
    short: { label: 'Short Break', minutes: 5, color: 'text-teal-500', bg: 'bg-teal-500', icon: Coffee },
    long: { label: 'Long Break', minutes: 15, color: 'text-indigo-500', bg: 'bg-indigo-500', icon: Zap },
};

type ModeKey = keyof typeof MODES;

export default function FocusTimer({ onSessionComplete }: { onSessionComplete?: () => void }) {
    const [mode, setMode] = useState<ModeKey>('focus');
    const [timeLeft, setTimeLeft] = useState(MODES.focus.minutes * 60);
    const [isActive, setIsActive] = useState(false);
    const [sessionCount, setSessionCount] = useState(0);

    // Audio ref (optional enhancement)
    const audioRef = useRef<HTMLAudioElement | null>(null);

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

        // Play sound
        if (audioRef.current) {
            audioRef.current.play().catch(e => console.log('Audio play failed', e));
        }

        if (mode === 'focus') {
            try {
                await api.activity.create({
                    type: 'Focus',
                    duration: MODES.focus.minutes,
                    startTime: new Date(Date.now() - MODES.focus.minutes * 60000).toISOString(),
                });
                setSessionCount(c => c + 1);
                if (onSessionComplete) onSessionComplete();
            } catch (error) {
                console.error('Failed to save session', error);
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
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const progress = ((MODES[mode].minutes * 60 - timeLeft) / (MODES[mode].minutes * 60)) * 100;
    const CurrentIcon = MODES[mode].icon;

    return (
        <div className="flex flex-col items-center justify-center p-6 w-full max-w-md mx-auto">
            {/* Hidden Audio */}
            <audio ref={audioRef} src="/sounds/complete.mp3" />

            {/* Mode Switcher */}
            <div className="flex bg-slate-100 p-1 rounded-2xl mb-8 w-full">
                {(Object.keys(MODES) as ModeKey[]).map((m) => (
                    <button
                        key={m}
                        onClick={() => setMode(m)}
                        className={`flex-1 py-2 px-3 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2
              ${mode === m ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        <span className="hidden sm:inline">{MODES[m].label}</span>
                        <span className="sm:hidden">{MODES[m].label.split(' ')[0]}</span>
                    </button>
                ))}
            </div>

            {/* Timer Circle */}
            <div className="relative w-64 h-64 mb-8">
                {/* SVG Circle for Progress */}
                <svg className="w-full h-full transform -rotate-90">
                    {/* Background Circle */}
                    <circle
                        cx="128"
                        cy="128"
                        r="120"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        className="text-slate-100"
                    />
                    {/* Progress Circle */}
                    <circle
                        cx="128"
                        cy="128"
                        r="120"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={2 * Math.PI * 120}
                        strokeDashoffset={2 * Math.PI * 120 * (1 - progress / 100)}
                        strokeLinecap="round"
                        className={`${MODES[mode].color} transition-all duration-1000 ease-linear`}
                    />
                </svg>

                {/* Center Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <CurrentIcon size={32} className={`${MODES[mode].color} mb-2 opacity-80`} />
                    <span className={`text-6xl font-bold ${MODES[mode].color} font-mono tracking-tight`}>
                        {formatTime(timeLeft)}
                    </span>
                    <p className="text-slate-400 font-medium mt-1 uppercase tracking-widest text-xs">
                        {isActive ? 'Simulating Focus' : 'Ready'}
                    </p>
                </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4">
                <button
                    onClick={resetTimer}
                    className="p-4 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
                >
                    <RotateCcw size={24} />
                </button>

                <button
                    onClick={toggleTimer}
                    className={`p-6 rounded-full text-white shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all
                ${MODES[mode].bg}`}
                >
                    {isActive ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
                </button>

                {/* Skip/Complete (Debugging/Quick testing) */}
                <button
                    onClick={handleComplete}
                    className="p-4 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
                    title="Complete Session (Test)"
                >
                    <Check size={24} />
                </button>
            </div>

            {sessionCount > 0 && (
                <div className="mt-6 px-4 py-2 bg-green-50 text-green-600 rounded-full text-sm font-semibold animate-fade-in">
                    🎉 {sessionCount} session{sessionCount > 1 ? 's' : ''} completed!
                </div>
            )}
        </div>
    );
}
