"use client";

import { motion } from "framer-motion";
import { Brain, Activity, Zap, Trophy, Moon, LayoutDashboard, Calendar, Users } from "lucide-react";

export default function FeaturesSection() {
    const features = [
        {
            icon: <Brain className="w-6 h-6 text-purple-600" />,
            title: "AI Coach",
            description: "Get personalized advice, motivation, and strategies from our intelligent AI assistant tailored to your goals.",
            colSpan: "col-span-1 md:col-span-2",
            bg: "bg-purple-50",
        },
        {
            icon: <Activity className="w-6 h-6 text-emerald-600" />,
            title: "Wellness Tracking",
            description: "Monitor hydration, mood, and daily habits effortlessly.",
            colSpan: "col-span-1",
            bg: "bg-emerald-50",
        },
        {
            icon: <Zap className="w-6 h-6 text-amber-600" />,
            title: "Focus Zones",
            description: "Customizable Pomodoro timers and deep work sessions.",
            colSpan: "col-span-1",
            bg: "bg-amber-50",
        },
        {
            icon: <Trophy className="w-6 h-6 text-yellow-600" />,
            title: "Gamification",
            description: "Earn XP, level up your avatar, and maintain streaks to make productivity addictive and fun.",
            colSpan: "col-span-1 md:col-span-2",
            bg: "bg-yellow-50",
        },
        {
            icon: <Moon className="w-6 h-6 text-indigo-600" />,
            title: "Sleep Analysis",
            description: "Track sleep quality and get insights for better rest.",
            colSpan: "col-span-1",
            bg: "bg-indigo-50",
        },
        {
            icon: <LayoutDashboard className="w-6 h-6 text-blue-600" />,
            title: "Analytics",
            description: "Visualize your progress with beautiful, interactive charts.",
            colSpan: "col-span-1",
            bg: "bg-blue-50",
        },
    ];

    return (
        <section id="features" className="py-24 bg-slate-50 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-slate-100 rounded-full blur-[100px] -z-10 opacity-60" />

            <div className="container mx-auto px-6">
                <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
                    <h2 className="text-3xl md:text-5xl font-bold text-slate-900">
                        Everything you need to <span className="text-indigo-600">thrive</span>
                    </h2>
                    <p className="text-lg text-slate-600">
                        We've combined the best productivity frameworks with advanced wellness tracking to create a holistic platform for your life.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            className={`${feature.colSpan} p-8 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group`}
                        >
                            <div className={`w-12 h-12 ${feature.bg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                            <p className="text-slate-600 leading-relaxed">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
