"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Save, Target, Droplets, Footprints, Flame, Flower2, Brain, Dumbbell } from "lucide-react";

interface GoalSettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentGoals: any;
    onSave: (goals: any) => void;
}

export default function GoalSettingsModal({ isOpen, onClose, currentGoals, onSave }: GoalSettingsModalProps) {
    const [goals, setGoals] = useState(currentGoals || {});

    const handleChange = (key: string, value: string) => {
        setGoals((prev: any) => ({ ...prev, [key]: parseInt(value) || 0 }));
    };

    const handleSave = () => {
        onSave(goals);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-2xl relative max-h-[90vh] overflow-y-auto"
                >
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors"
                    >
                        <X size={20} className="text-slate-500" />
                    </button>

                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-indigo-100 rounded-xl text-indigo-600">
                            <Target size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-slate-800">Customize Goals</h3>
                            <p className="text-sm text-slate-500 font-medium">Set your daily targets</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {/* Water Goal */}
                        <div className="bg-slate-50 p-4 rounded-2xl flex items-center gap-4">
                            <div className="p-2 bg-blue-100 text-blue-500 rounded-lg">
                                <Droplets size={20} />
                            </div>
                            <div className="flex-1">
                                <label className="text-xs font-bold text-slate-500 uppercase">Water Intake (ml)</label>
                                <input
                                    type="number"
                                    value={goals.waterGoal || 2500}
                                    onChange={(e) => handleChange('waterGoal', e.target.value)}
                                    className="w-full bg-transparent font-bold text-slate-800 text-lg border-none focus:ring-0 p-0"
                                />
                            </div>
                        </div>

                        {/* Steps Goal */}
                        <div className="bg-slate-50 p-4 rounded-2xl flex items-center gap-4">
                            <div className="p-2 bg-emerald-100 text-emerald-500 rounded-lg">
                                <Footprints size={20} />
                            </div>
                            <div className="flex-1">
                                <label className="text-xs font-bold text-slate-500 uppercase">Daily Steps</label>
                                <input
                                    type="number"
                                    value={goals.stepGoal || 10000}
                                    onChange={(e) => handleChange('stepGoal', e.target.value)}
                                    className="w-full bg-transparent font-bold text-slate-800 text-lg border-none focus:ring-0 p-0"
                                />
                            </div>
                        </div>

                        {/* Calories Goal */}
                        <div className="bg-slate-50 p-4 rounded-2xl flex items-center gap-4">
                            <div className="p-2 bg-orange-100 text-orange-500 rounded-lg">
                                <Flame size={20} />
                            </div>
                            <div className="flex-1">
                                <label className="text-xs font-bold text-slate-500 uppercase">Calories Burned</label>
                                <input
                                    type="number"
                                    value={goals.caloricGoal || 2200}
                                    onChange={(e) => handleChange('caloricGoal', e.target.value)}
                                    className="w-full bg-transparent font-bold text-slate-800 text-lg border-none focus:ring-0 p-0"
                                />
                            </div>
                        </div>

                        {/* Yoga Goal */}
                        <div className="bg-slate-50 p-4 rounded-2xl flex items-center gap-4">
                            <div className="p-2 bg-fuchsia-100 text-fuchsia-500 rounded-lg">
                                <Flower2 size={20} />
                            </div>
                            <div className="flex-1">
                                <label className="text-xs font-bold text-slate-500 uppercase">Yoga (min)</label>
                                <input
                                    type="number"
                                    value={goals.yogaGoal || 30}
                                    onChange={(e) => handleChange('yogaGoal', e.target.value)}
                                    className="w-full bg-transparent font-bold text-slate-800 text-lg border-none focus:ring-0 p-0"
                                />
                            </div>
                        </div>

                        {/* Meditation Goal */}
                        <div className="bg-slate-50 p-4 rounded-2xl flex items-center gap-4">
                            <div className="p-2 bg-violet-100 text-violet-500 rounded-lg">
                                <Brain size={20} />
                            </div>
                            <div className="flex-1">
                                <label className="text-xs font-bold text-slate-500 uppercase">Meditation (min)</label>
                                <input
                                    type="number"
                                    value={goals.meditationGoal || 15}
                                    onChange={(e) => handleChange('meditationGoal', e.target.value)}
                                    className="w-full bg-transparent font-bold text-slate-800 text-lg border-none focus:ring-0 p-0"
                                />
                            </div>
                        </div>

                        {/* Workout Goal */}
                        <div className="bg-slate-50 p-4 rounded-2xl flex items-center gap-4">
                            <div className="p-2 bg-red-100 text-red-500 rounded-lg">
                                <Dumbbell size={20} />
                            </div>
                            <div className="flex-1">
                                <label className="text-xs font-bold text-slate-500 uppercase">Gym/Workout (min)</label>
                                <input
                                    type="number"
                                    value={goals.workoutGoal || 60}
                                    onChange={(e) => handleChange('workoutGoal', e.target.value)}
                                    className="w-full bg-transparent font-bold text-slate-800 text-lg border-none focus:ring-0 p-0"
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleSave}
                        className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 transition-all"
                    >
                        <Save size={20} /> Save New Goals
                    </button>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
