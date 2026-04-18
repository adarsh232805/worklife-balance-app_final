"use client";

import { Check } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

export default function PricingSection() {
    const [isYearly, setIsYearly] = useState(false);

    const plans = [
        {
            name: "Starter",
            price: "Free",
            period: "forever",
            description: "Essential tools for personal productivity.",
            features: ["Task Management", "Basic Pomodoro Timer", "Daily Wellness Check-in", "7-day History"],
            cta: "Get Started",
            popular: false,
        },
        {
            name: "Pro",
            price: isYearly ? "$10" : "$12",
            period: "per month",
            description: "Advanced AI insights for serious performers.",
            features: ["Everything in Starter", "Unlimited AI Coach Chat", "Advanced Analytics", "Custom Focus Soundscapes", "Priority Support"],
            cta: "Try Pro Free",
            popular: true,
        },
        {
            name: "Team",
            price: isYearly ? "$39" : "$49",
            period: "per member",
            description: "Collaborate and track team wellness.",
            features: ["Everything in Pro", "Team Goals & Challenges", "Admin Dashboard", "SSO Integration", "Dedicated Success Manager"],
            cta: "Contact Sales",
            popular: false,
        },
    ];

    return (
        <section id="pricing" className="py-24 bg-white relative">
            <div className="container mx-auto px-6">
                <div className="text-center max-w-2xl mx-auto mb-12">
                    <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">Simple, Transparent Pricing</h2>
                    <p className="text-lg text-slate-600 mb-8">Choose the plan that fits your ambition.</p>

                    {/* Toggle */}
                    <div className="flex items-center justify-center gap-4">
                        <span className={`text-sm font-medium ${!isYearly ? "text-slate-900" : "text-slate-500"}`}>Monthly</span>
                        <button
                            onClick={() => setIsYearly(!isYearly)}
                            className="w-14 h-8 bg-indigo-600 rounded-full p-1 relative transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            <div className={`w-6 h-6 bg-white rounded-full shadow-sm transform transition-transform ${isYearly ? "translate-x-6" : "translate-x-0"}`} />
                        </button>
                        <span className={`text-sm font-medium ${isYearly ? "text-slate-900" : "text-slate-500"}`}>
                            Yearly <span className="text-green-600 text-xs font-bold ml-1">(Save 20%)</span>
                        </span>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {plans.map((plan, index) => (
                        <motion.div
                            key={index}
                            whileHover={{ y: -8 }}
                            className={`relative p-8 rounded-2xl border ${plan.popular
                                    ? "border-indigo-600 bg-slate-900 text-white shadow-2xl scale-105 z-10"
                                    : "border-slate-200 bg-white text-slate-900 shadow-lg"
                                } flex flex-col`}
                        >
                            {plan.popular && (
                                <div className="absolute top-0 right-0 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
                                    MOST POPULAR
                                </div>
                            )}
                            <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                            <div className="mb-4">
                                <span className="text-4xl font-bold">{plan.price}</span>
                                <span className={`text-sm ${plan.popular ? "text-slate-400" : "text-slate-500"} ml-2`}>/ {plan.period}</span>
                            </div>
                            <p className={`text-sm ${plan.popular ? "text-slate-400" : "text-slate-500"} mb-8`}>{plan.description}</p>

                            <ul className="space-y-4 mb-8 flex-1">
                                {plan.features.map((feature, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm">
                                        <Check className={`w-5 h-5 ${plan.popular ? "text-indigo-400" : "text-indigo-600"}`} />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <button
                                className={`w-full py-4 rounded-xl font-bold transition-all ${plan.popular
                                        ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/30"
                                        : "bg-slate-100 hover:bg-slate-200 text-slate-900"
                                    }`}
                            >
                                {plan.cta}
                            </button>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
