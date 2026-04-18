"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function CTASection() {
    return (
        <section className="py-24 px-6">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="max-w-7xl mx-auto bg-gradient-to-r from-indigo-600 to-violet-600 rounded-[2.5rem] p-12 md:p-24 text-center text-white relative overflow-hidden"
            >
                {/* Decorative circles */}
                <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />

                <div className="relative z-10 max-w-3xl mx-auto space-y-8">
                    <h2 className="text-4xl md:text-6xl font-bold tracking-tight">
                        Ready to level up your life?
                    </h2>
                    <p className="text-xl text-indigo-100 max-w-2xl mx-auto">
                        Join 10,000+ high performers who are mastering their work-life balance today.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                        <Link
                            href="/dashboard"
                            className="bg-white text-indigo-600 px-10 py-4 rounded-full font-bold text-lg hover:bg-indigo-50 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 flex items-center gap-2"
                        >
                            Get Started Now
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                    <p className="text-sm text-indigo-200 mt-8">No credit card required. Cancel anytime.</p>
                </div>
            </motion.div>
        </section>
    );
}
