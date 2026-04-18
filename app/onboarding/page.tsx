"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Check, Moon, Sun, Clock, Brain, Coffee } from "lucide-react";

export default function OnboardingPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const totalSteps = 4;
    const [data, setData] = useState({
        workHours: { start: "09:00", end: "17:00" },
        sleepGoal: 8,
        wellnessGoal: 30,
        focusPreference: "pomodoro"
    });
    const [loading, setLoading] = useState(false);

    const handleNext = () => {
        if (step < totalSteps) setStep(s => s + 1);
        else handleSubmit();
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/user/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (res.ok) {
                router.push("/");
            } else {
                console.error("Failed to save profile");
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
            <div className="w-full max-w-2xl bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl border border-slate-100 relative overflow-hidden">
                {/* Progress Bar */}
                <div className="absolute top-0 left-0 h-2 bg-indigo-600 transition-all duration-500" style={{ width: `${(step / totalSteps) * 100}%` }} />

                <AnimatePresence mode="wait">
                    {/* STEP 1: WELCOME & WORK HOURS */}
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-8"
                        >
                            <div className="text-center space-y-4">
                                <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                    <Clock size={32} />
                                </div>
                                <h1 className="text-3xl font-bold text-slate-900">Let's set your Schedule</h1>
                                <p className="text-slate-500 text-lg">When do you usually work?</p>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Start Time</label>
                                    <input
                                        type="time"
                                        value={data.workHours.start}
                                        onChange={(e) => setData({ ...data, workHours: { ...data.workHours, start: e.target.value } })}
                                        className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200 text-xl font-bold focus:ring-2 ring-indigo-500 outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">End Time</label>
                                    <input
                                        type="time"
                                        value={data.workHours.end}
                                        onChange={(e) => setData({ ...data, workHours: { ...data.workHours, end: e.target.value } })}
                                        className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200 text-xl font-bold focus:ring-2 ring-indigo-500 outline-none"
                                    />
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 2: SLEEP GOAL */}
                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-8"
                        >
                            <div className="text-center space-y-4">
                                <div className="w-16 h-16 bg-indigo-900 text-white rounded-2xl flex items-center justify-center mx-auto mb-6">
                                    <Moon size={32} />
                                </div>
                                <h1 className="text-3xl font-bold text-slate-900">Sleep Goal</h1>
                                <p className="text-slate-500 text-lg">How many hours of sleep do you aim for?</p>
                            </div>

                            <div className="flex items-center justify-center gap-6">
                                <button
                                    onClick={() => setData({ ...data, sleepGoal: Math.max(4, data.sleepGoal - 1) })}
                                    className="w-12 h-12 bg-slate-100 rounded-full font-bold text-2xl hover:bg-slate-200"
                                >-</button>
                                <span className="text-6xl font-black text-indigo-900">{data.sleepGoal}<span className="text-2xl text-slate-400 font-medium">h</span></span>
                                <button
                                    onClick={() => setData({ ...data, sleepGoal: Math.min(12, data.sleepGoal + 1) })}
                                    className="w-12 h-12 bg-slate-100 rounded-full font-bold text-2xl hover:bg-slate-200"
                                >+</button>
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 3: WELLNESS GOAL */}
                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-8"
                        >
                            <div className="text-center space-y-4">
                                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                    <Coffee size={32} />
                                </div>
                                <h1 className="text-3xl font-bold text-slate-900">Wellness Time</h1>
                                <p className="text-slate-500 text-lg">Minutes per day for self-care (meditation, walks)?</p>
                            </div>

                            <div className="space-y-4">
                                {[15, 30, 45, 60].map((min) => (
                                    <button
                                        key={min}
                                        onClick={() => setData({ ...data, wellnessGoal: min })}
                                        className={`w-full p-4 rounded-xl border-2 flex items-center justify-between transition-all ${data.wellnessGoal === min
                                            ? "border-green-500 bg-green-50 text-green-700 shadow-md"
                                            : "border-slate-100 hover:border-slate-200 text-slate-600"
                                            }`}
                                    >
                                        <span className="font-bold text-lg">{min} Minutes</span>
                                        {data.wellnessGoal === min && <Check size={20} />}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 4: FOCUS STYLE */}
                    {step === 4 && (
                        <motion.div
                            key="step4"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-8"
                        >
                            <div className="text-center space-y-4">
                                <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                    <Brain size={32} />
                                </div>
                                <h1 className="text-3xl font-bold text-slate-900">Work Style</h1>
                                <p className="text-slate-500 text-lg">How do you prefer to focus?</p>
                            </div>

                            <div className="grid gap-4">
                                <div
                                    onClick={() => setData({ ...data, focusPreference: 'pomodoro' })}
                                    className={`cursor-pointer p-5 rounded-2xl border-2 transition-all ${data.focusPreference === 'pomodoro'
                                        ? "border-orange-500 bg-orange-50 shadow-md"
                                        : "border-slate-100 hover:border-slate-200"
                                        }`}
                                >
                                    <h3 className={`font-bold text-lg mb-1 ${data.focusPreference === 'pomodoro' ? 'text-orange-700' : 'text-slate-800'}`}>🍅 Pomodoro (25m / 5m)</h3>
                                    <p className="text-slate-500 text-sm">Classic interval training for your brain.</p>
                                </div>

                                <div
                                    onClick={() => setData({ ...data, focusPreference: '90min' })}
                                    className={`cursor-pointer p-5 rounded-2xl border-2 transition-all ${data.focusPreference === '90min'
                                        ? "border-blue-500 bg-blue-50 shadow-md"
                                        : "border-slate-100 hover:border-slate-200"
                                        }`}
                                >
                                    <h3 className={`font-bold text-lg mb-1 ${data.focusPreference === '90min' ? 'text-blue-700' : 'text-slate-800'}`}>🌊 Deep Work (90m)</h3>
                                    <p className="text-slate-500 text-sm">Long uninterrupted blocks for complex tasks.</p>
                                </div>

                                <div
                                    onClick={() => setData({ ...data, focusPreference: 'flow' })}
                                    className={`cursor-pointer p-5 rounded-2xl border-2 transition-all ${data.focusPreference === 'flow'
                                        ? "border-purple-500 bg-purple-50 shadow-md"
                                        : "border-slate-100 hover:border-slate-200"
                                        }`}
                                >
                                    <h3 className={`font-bold text-lg mb-1 ${data.focusPreference === 'flow' ? 'text-purple-700' : 'text-slate-800'}`}>♾️ Flow State</h3>
                                    <p className="text-slate-500 text-sm">Timer counts UP. Stop when you're done.</p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* FOOTER NAV */}
                <div className="mt-12 flex justify-between items-center">
                    {step > 1 && (
                        <button
                            onClick={() => setStep(s => s - 1)}
                            className="text-slate-400 font-bold hover:text-slate-600 transition"
                        >
                            Back
                        </button>
                    )}
                    <div className="flex-1"></div>
                    <button
                        onClick={handleNext}
                        disabled={loading}
                        className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition flex items-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                    >
                        {loading ? "Saving..." : step === totalSteps ? "Finish Setup" : "Continue"}
                        {!loading && step !== totalSteps && <ArrowRight size={18} />}
                    </button>
                </div>
            </div>
        </div>
    );
}
