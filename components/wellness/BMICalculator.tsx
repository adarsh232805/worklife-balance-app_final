"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Scale, ChevronRight } from "lucide-react";

interface BMICalculatorProps {
    initialHeight?: number;
    initialWeight?: number;
    onUpdate: (weight: number, height: number) => void;
}

export default function BMICalculator({ initialHeight = 170, initialWeight = 70, onUpdate }: BMICalculatorProps) {
    const [weight, setWeight] = useState(initialWeight);
    const [height, setHeight] = useState(initialHeight);
    const [isEditing, setIsEditing] = useState(false);

    const bmi = (weight / ((height / 100) ** 2)).toFixed(1);
    const bmiNum = parseFloat(bmi);

    const getBMIStatus = (val: number) => {
        if (val < 18.5) return { label: "Underweight", color: "text-blue-500", bg: "bg-blue-500", range: "0-18.5" };
        if (val < 25) return { label: "Healthy", color: "text-emerald-500", bg: "bg-emerald-500", range: "18.5-25" };
        if (val < 30) return { label: "Overweight", color: "text-orange-500", bg: "bg-orange-500", range: "25-30" };
        return { label: "Obese", color: "text-red-500", bg: "bg-red-500", range: "30+" };
    };

    const status = getBMIStatus(bmiNum);

    const handleSave = () => {
        onUpdate(weight, height);
        setIsEditing(false);
    };

    return (
        <div className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/60 border border-slate-100/50 h-full">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-700 flex items-center gap-2">
                    <Scale size={20} className="text-indigo-500" /> BMI Index
                </h3>
                {!isEditing && (
                    <button onClick={() => setIsEditing(true)} className="text-sm font-bold text-indigo-600 hover:text-indigo-700">
                        Update Stats
                    </button>
                )}
            </div>

            <div className="flex flex-col items-center">
                {/* Gauge Visualization */}
                <div className="relative w-full h-6 mb-8 bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
                    <div className="flex-1 bg-gradient-to-r from-blue-300 to-blue-400 opacity-80" />
                    <div className="flex-1 bg-gradient-to-r from-emerald-400 to-emerald-500" />
                    <div className="flex-1 bg-gradient-to-r from-orange-300 to-orange-400 opacity-80" />
                    <div className="flex-1 bg-gradient-to-r from-red-300 to-red-400 opacity-80" />

                    {/* Marker */}
                    <motion.div
                        initial={{ left: 0 }}
                        animate={{ left: `${Math.min(100, Math.max(0, ((bmiNum - 15) / 20) * 100))}%` }}
                        className="absolute top-0 bottom-0 w-1 bg-slate-800 shadow-lg z-10"
                    />
                </div>

                <div className="text-center mb-6">
                    <motion.div
                        key={bmi}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-5xl font-black text-slate-800"
                    >
                        {bmi}
                    </motion.div>
                    <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${status.color} bg-opacity-10 mt-2`}>
                        {status.label}
                    </div>
                </div>

                {isEditing ? (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="w-full space-y-4 bg-slate-50 p-4 rounded-2xl"
                    >
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase">Weight (kg)</label>
                            <input
                                type="number"
                                value={weight}
                                onChange={(e) => setWeight(parseFloat(e.target.value))}
                                className="w-full bg-white border border-slate-200 rounded-xl p-2 font-bold text-slate-700"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase">Height (cm)</label>
                            <input
                                type="number"
                                value={height}
                                onChange={(e) => setHeight(parseFloat(e.target.value))}
                                className="w-full bg-white border border-slate-200 rounded-xl p-2 font-bold text-slate-700"
                            />
                        </div>
                        <button
                            onClick={handleSave}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 rounded-xl transition-colors"
                        >
                            Save & Recalculate
                        </button>
                    </motion.div>
                ) : (
                    <div className="flex gap-8 text-center w-full justify-center">
                        <div>
                            <div className="text-xl font-bold text-slate-600">{weight}</div>
                            <div className="text-xs text-slate-400 font-bold uppercase">kg</div>
                        </div>
                        <div className="w-px bg-slate-100" />
                        <div>
                            <div className="text-xl font-bold text-slate-600">{height}</div>
                            <div className="text-xs text-slate-400 font-bold uppercase">cm</div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
