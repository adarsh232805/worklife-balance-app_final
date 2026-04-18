"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

export default function TestimonialsSection() {
    const testimonials = [
        {
            name: "Sarah Jenkins",
            role: "Product Manager @ Google",
            content: "I used to burn out constantly. WorkLife+ helped me find the rhythm between deep work and necessary rest. The AI coach is scarily good.",
            image: "https://i.pravatar.cc/150?u=sarah",
        },
        {
            name: "Michael Chen",
            role: "Founder, StartUp.io",
            content: "The gamification aspect is what hooked me. I actually look forward to clearing my tasks to level up my avatar.",
            image: "https://i.pravatar.cc/150?u=michael",
        },
        {
            name: "Jessica Lee",
            role: "Freelance Designer",
            content: "Finally, an app that doesn't just list tasks but cares about my energy levels. The focus timer + soundscapes are a game changer.",
            image: "https://i.pravatar.cc/150?u=jessica",
        },
    ];

    return (
        <section id="testimonials" className="py-24 bg-slate-50 border-t border-slate-100 overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">Loved by Builders</h2>
                    <p className="text-lg text-slate-600">Join thousands of professionals who have reclaimed their time.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {testimonials.map((t, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-all border border-slate-100"
                        >
                            <div className="flex gap-1 text-yellow-500 mb-4">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="w-4 h-4 fill-current" />
                                ))}
                            </div>
                            <p className="text-slate-700 leading-relaxed mb-6 italic">"{t.content}"</p>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden">
                                    {/* Placeholder avatar if image fails */}
                                    <div className="w-full h-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                                        {t.name[0]}
                                    </div>
                                </div>
                                <div>
                                    <div className="font-bold text-slate-900">{t.name}</div>
                                    <div className="text-xs font-medium text-slate-500">{t.role}</div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
