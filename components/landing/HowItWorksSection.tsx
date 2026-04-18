"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Zap, BarChart3 } from "lucide-react";

export default function HowItWorksSection() {
    const steps = [
        {
            number: "01",
            title: "Set Your Pulse",
            description: "Start your day by defining your key objectives and wellness targets in under 2 minutes.",
            icon: <CheckCircle2 className="w-6 h-6 text-indigo-600" />,
        },
        {
            number: "02",
            title: "Deep Work & Flow",
            description: "Activate focus modes with AI-generated soundscapes to block distractions and execute.",
            icon: <Zap className="w-6 h-6 text-amber-600" />,
        },
        {
            number: "03",
            title: "Review & Evolve",
            description: "Get end-of-day insights and XP rewards. Watch your productivity score grow over time.",
            icon: <BarChart3 className="w-6 h-6 text-emerald-600" />,
        },
    ];

    return (
        <section id="how-it-works" className="py-24 bg-white relative">
            <div className="container mx-auto px-6">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">Efficiency in 3 Steps</h2>
                    <p className="text-lg text-slate-600">Simple enough to start today. Powerful enough to change your career.</p>
                </div>

                <div className="relative grid md:grid-cols-3 gap-12">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-slate-100 -z-10" />

                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2, duration: 0.6 }}
                            className="relative flex flex-col items-center text-center space-y-6"
                        >
                            <div className="w-24 h-24 rounded-full bg-white border-4 border-slate-50 shadow-xl flex items-center justify-center relative z-10 font-bold text-3xl text-indigo-600">
                                {step.number}
                                <div className="absolute -bottom-2 -right-2 bg-slate-900 rounded-full p-2 text-white">
                                    {step.icon}
                                </div>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
                                <p className="text-slate-600 leading-relaxed max-w-xs mx-auto">
                                    {step.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
