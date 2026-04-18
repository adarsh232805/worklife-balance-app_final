"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Play,
    Pause,
    RotateCcw,
    Maximize2,
    Minimize2,
    Volume2,
    VolumeX,
    Brain,
    Coffee,
    Zap,
    CheckCircle2,
    Music,
    Trees,
    CloudRain,
    CupSoda
} from "lucide-react";
import { api } from "@/lib/api";

/* ================= TYPES & CONFIG ================= */

const MODES = {
    focus: { label: "Deep Focus", minutes: 25, color: "text-indigo-600", bg: "bg-indigo-600", ring: "stroke-indigo-600", icon: Brain },
    short: { label: "Short Break", minutes: 5, color: "text-teal-600", bg: "bg-teal-600", ring: "stroke-teal-600", icon: Coffee },
    long: { label: "Long Break", minutes: 15, color: "text-blue-600", bg: "bg-blue-600", ring: "stroke-blue-600", icon: Zap },
};

type ModeKey = keyof typeof MODES;

// Synthetic Soundscapes (No network required)
const SOUNDSCAPES = [
    { id: "none", label: "Silent", icon: VolumeX },
    { id: "brown", label: "Rain (Brown)", icon: CloudRain },
    { id: "pink", label: "Forest (Pink)", icon: Trees },
    { id: "white", label: "Stream (White)", icon: Volume2 },
];

/* ================= COMPONENT ================= */

export default function FocusTimer({
    onSessionComplete,
    onTick
}: {
    onSessionComplete?: () => void;
    onTick?: (state: { mode: string; timeLeft: number; isActive: boolean; totalTime: number }) => void;
}) {
    const [mode, setMode] = useState<ModeKey>("focus");
    const [timeLeft, setTimeLeft] = useState(MODES.focus.minutes * 60);
    const [isActive, setIsActive] = useState(false);
    const [isImmersive, setIsImmersive] = useState(false);
    const [soundscape, setSoundscape] = useState(SOUNDSCAPES[0]);
    const [volume, setVolume] = useState(0.5);

    // Web Audio Refs
    const ctxRef = useRef<AudioContext | null>(null);
    const gainRef = useRef<GainNode | null>(null);
    const sourceRef = useRef<AudioBufferSourceNode | null>(null);

    // Initialize Audio Context on user interaction (handled in toggle or volume)
    const initAudio = () => {
        if (!ctxRef.current) {
            const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
            ctxRef.current = new AudioCtx();
            gainRef.current = ctxRef.current.createGain();
            gainRef.current.connect(ctxRef.current.destination);
        }
    };

    const stopNoise = () => {
        if (sourceRef.current) {
            try { sourceRef.current.stop(); } catch (e) { }
            sourceRef.current = null;
        }
    };

    const playNoise = (type: string) => {
        if (!ctxRef.current || !gainRef.current) return;

        stopNoise(); // Stop existing

        const bufferSize = 2 * ctxRef.current.sampleRate;
        const buffer = ctxRef.current.createBuffer(1, bufferSize, ctxRef.current.sampleRate);
        const output = buffer.getChannelData(0);

        let lastOut = 0; // For brown noise
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0; // For pink noise (simplified)

        for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            if (type === 'white') {
                output[i] = white;
            } else if (type === 'pink') {
                // Simplified pink noise approximation (more complex algorithms exist)
                b0 = 0.99886 * b0 + white * 0.055179;
                b1 = 0.99332 * b1 + white * 0.14528;
                b2 = 0.96900 * b2 + white * 0.057700;
                b3 = 0.86650 * b3 + white * 0.017000;
                b4 = 0.55000 * b4 + white * 0.002100;
                b5 = 0.27600 * b5 + white * 0.000100;
                output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11; // Scale for volume
                b6 = white * 0.115926;
            } else { // Brown
                output[i] = (lastOut + (0.02 * white)) / 1.02;
                output[i] *= 3.5; // Gain compensation
                if (!isFinite(output[i])) output[i] = 0;
                lastOut = output[i];
            }
        }

        const noiseSrc = ctxRef.current.createBufferSource();
        noiseSrc.buffer = buffer;
        noiseSrc.loop = true;
        noiseSrc.connect(gainRef.current);
        noiseSrc.start();
        sourceRef.current = noiseSrc;
    };

    // Sync Audio with State
    useEffect(() => {
        if (isActive && soundscape.id !== 'none') {
            initAudio();
            // Resume if suspended
            if (ctxRef.current?.state === 'suspended') ctxRef.current.resume();
            playNoise(soundscape.id);
        } else {
            stopNoise();
        }

        return () => stopNoise();
    }, [isActive, soundscape]);

    // Volume
    useEffect(() => {
        if (gainRef.current && ctxRef.current) {
            gainRef.current.gain.setTargetAtTime(volume * 0.2, ctxRef.current.currentTime, 0.1);
        }
    }, [volume]);

    // Timer Logic
    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                const newTime = timeLeft - 1;
                setTimeLeft(newTime);
                if (onTick) {
                    // We are in an event handler (setInterval), so this is safe and batched.
                    onTick({ mode, timeLeft: newTime, isActive: true, totalTime: MODES[mode].minutes * 60 });
                }
            }, 1000);
        } else if (timeLeft === 0 && isActive) {
            handleComplete();
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isActive, timeLeft, mode]);

    // Reset when mode changes
    useEffect(() => {
        setTimeLeft(MODES[mode].minutes * 60);
        setIsActive(false);
    }, [mode]);

    const handleComplete = async () => {
        setIsActive(false);
        stopNoise();

        // 1. Play Sound (Try Oscillator first as it always works)
        try {
            const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.type = 'sine';
            osc.frequency.setValueAtTime(500, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(1000, ctx.currentTime + 0.1);
            gain.gain.setValueAtTime(0.3, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
            osc.start();
            osc.stop(ctx.currentTime + 0.5);
        } catch (e) {
            console.error("Audio Context failed", e);
        }

        // 2. Save Session
        if (mode === "focus") {
            const elapsedSeconds = (MODES.focus.minutes * 60 - timeLeft);
            const durationVal = Math.ceil(elapsedSeconds / 60);

            // Minimum 1 minute to save
            if (durationVal < 1) {
                console.log("Session too short to save");
                resetTimer();
                return;
            }

            console.log("Saving Focus Session:", { duration: durationVal });

            try {
                const res = await api.activity.create({
                    type: "Focus",
                    duration: durationVal,
                    startTime: new Date().toISOString(),
                });
                console.log("Session Saved:", res);
                if (onSessionComplete) onSessionComplete();
            } catch (e) {
                console.error("Save failed", e);
            }
        }

        // Reset timer after save
        setTimeLeft(MODES[mode].minutes * 60);
    };
    const toggleTimer = () => setIsActive(!isActive);
    const resetTimer = () => {
        setIsActive(false);
        setTimeLeft(MODES[mode].minutes * 60);
    };

    const formatTime = (seconds: number) => {
        const min = Math.floor(seconds / 60);
        const sec = seconds % 60;
        return `${min}:${sec.toString().padStart(2, "0")}`;
    };

    const progress = ((MODES[mode].minutes * 60 - timeLeft) / (MODES[mode].minutes * 60)) * 100;
    const CurrentIcon = MODES[mode].icon;

    return (
        <div className={`transition-all duration-700 ${isImmersive ? "fixed inset-0 z-50 bg-slate-900 text-white flex flex-col items-center justify-center" : "relative w-full max-w-lg mx-auto"}`}>

            {/* IMMERSIVE BACKGROUND ANIMATION */}
            {isImmersive && (
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] bg-indigo-500/20 rounded-full blur-[100px] animate-pulse -translate-x-1/2 -translate-y-1/2" />
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[80px]" />
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[80px]" />
                </div>
            )}

            {/* HEADER CONTROLS */}
            <div className={`flex justify-between items-center w-full px-6 py-4 absolute top-0 left-0 z-20 ${!isImmersive && "hidden"}`}>
                <div className="flex items-center gap-2 opacity-70">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                    <span className="text-sm font-bold tracking-widest uppercase">Deep Work Mode</span>
                </div>
                <button onClick={() => setIsImmersive(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                    <Minimize2 />
                </button>
            </div>

            <div className="relative z-10 w-full flex flex-col items-center">

                {/* MODE SWITCHER (Hidden in Immersive if active) */}
                {!isActive && (
                    <div className={`flex p-1.5 rounded-2xl mb-10 transition-all ${isImmersive ? "bg-white/10" : "bg-slate-100"}`}>
                        {(Object.keys(MODES) as ModeKey[]).map((m) => (
                            <button
                                key={m}
                                onClick={() => setMode(m)}
                                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${mode === m
                                    ? isImmersive ? "bg-white text-slate-900 shadow-lg" : "bg-white text-slate-800 shadow-sm"
                                    : isImmersive ? "text-white/60 hover:text-white" : "text-slate-500 hover:text-slate-800"
                                    }`}
                            >
                                {MODES[m].label}
                            </button>
                        ))}
                    </div>
                )}

                {/* TIMER DISPLAY */}
                <div className="relative group mb-12">
                    {/* Progress Ring */}
                    <svg className="w-80 h-80 transform -rotate-90">
                        <circle
                            cx="160" cy="160" r="150"
                            stroke="currentColor" strokeWidth="6" fill="transparent"
                            className={isImmersive ? "text-white/10" : "text-slate-100"}
                        />
                        <circle
                            cx="160" cy="160" r="150"
                            stroke="currentColor" strokeWidth="6" fill="transparent"
                            strokeDasharray={2 * Math.PI * 150}
                            strokeDashoffset={2 * Math.PI * 150 * (1 - progress / 100)}
                            strokeLinecap="round"
                            className={`${isImmersive ? "text-white shadow-[0_0_30px_rgba(255,255,255,0.5)]" : MODES[mode].color} transition-all duration-1000 ease-linear`}
                        />
                    </svg>

                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <CurrentIcon size={40} className={`mb-4 transition-all duration-500 ${isActive ? "scale-110 opacity-100" : "scale-90 opacity-70"} ${isImmersive ? "text-white" : MODES[mode].color}`} />
                        <div className={`text-7xl font-mono font-black tracking-tighter tabular-nums ${isImmersive ? "text-white" : "text-slate-800"}`}>
                            {formatTime(timeLeft)}
                        </div>

                        {isActive && mode === 'focus' && (
                            <motion.div
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-4 flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-400/20 border border-yellow-400/30 text-yellow-600 font-bold text-xs"
                            >
                                <Zap size={12} fill="currentColor" />
                                +{Math.floor((MODES.focus.minutes * 60 - timeLeft) / 60 * 5)} XP Gained
                            </motion.div>
                        )}
                    </div>
                </div>

                {/* CONTROLS */}
                <div className="flex items-center gap-6">
                    <button onClick={resetTimer} className={`p-4 rounded-full transition-all ${isImmersive ? "bg-white/10 hover:bg-white/20 text-white" : "bg-slate-100 hover:bg-slate-200 text-slate-500"}`}>
                        <RotateCcw size={24} />
                    </button>

                    <button
                        onClick={toggleTimer}
                        className={`p-8 rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center ${isImmersive
                            ? "bg-white text-slate-900 shadow-white/20"
                            : `${MODES[mode].bg} text-white shadow-indigo-200`
                            }`}
                    >
                        {isActive ? <Pause size={40} fill="currentColor" /> : <Play size={40} fill="currentColor" className="ml-2" />}
                    </button>

                    {/* FINISH EARLY BUTTON */}
                    {(isActive || timeLeft < MODES[mode].minutes * 60) && (
                        <button
                            onClick={handleComplete}
                            className={`p-4 rounded-full transition-all ${isImmersive ? "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30" : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"}`}
                            title="Finish Session"
                        >
                            <CheckCircle2 size={24} />
                        </button>
                    )}

                    <button
                        onClick={() => setIsImmersive(!isImmersive)}
                        className={`p-4 rounded-full transition-all ${isImmersive ? "bg-white/10 hover:bg-white/20 text-white" : "bg-slate-100 hover:bg-slate-200 text-slate-500"}`}
                    >
                        {isImmersive ? <Minimize2 size={24} /> : <Maximize2 size={24} />}
                    </button>
                </div>

                {/* SOUNDSCAPE CONTROLS */}
                <div className={`mt-12 w-full max-w-sm transition-all duration-500 ${isActive || isImmersive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`}>
                    <div className={`flex items-center justify-between px-4 py-3 rounded-2xl border ${isImmersive ? "bg-white/10 border-white/10 backdrop-blur-md" : "bg-white border-slate-100 shadow-lg"}`}>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setVolume(v => v === 0 ? 0.5 : 0)}
                                className={isImmersive ? "text-white/70 hover:text-white" : "text-slate-400 hover:text-indigo-600"}
                            >
                                {volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
                            </button>
                            <input
                                type="range" min="0" max="1" step="0.1"
                                value={volume} onChange={(e) => setVolume(parseFloat(e.target.value))}
                                className="w-20 accent-indigo-500 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                            />
                        </div>

                        <div className="flex items-center gap-1 bg-black/5 p-1 rounded-lg">
                            {SOUNDSCAPES.map(sound => (
                                <button
                                    key={sound.id}
                                    onClick={() => setSoundscape(sound)}
                                    className={`p-2 rounded-lg transition-all ${soundscape.id === sound.id
                                        ? isImmersive ? "bg-white/20 text-white" : "bg-indigo-100 text-indigo-700"
                                        : isImmersive ? "text-white/40 hover:text-white/80" : "text-slate-400 hover:text-slate-600"
                                        }`}
                                    title={sound.label}
                                >
                                    <sound.icon size={18} />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
