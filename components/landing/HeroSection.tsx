"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";

export default function HeroSection() {
    return (
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full z-0 pointer-events-none">
                <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-indigo-200/30 rounded-full blur-[100px] animate-pulse" />
                <div className="absolute top-40 right-1/4 w-[400px] h-[400px] bg-purple-200/30 rounded-full blur-[100px] animate-pulse delay-700" />
                <div className="absolute bottom-0 left-1/3 w-[600px] h-[400px] bg-blue-100/20 rounded-full blur-[80px]" />
            </div>

            <div className="container mx-auto px-4 relative z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-4xl mx-auto space-y-8"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 backdrop-blur-sm border border-slate-200 text-slate-600 text-sm font-medium shadow-sm hover:bg-white/80 transition-colors cursor-default">
                        <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
                        v2.0 is now live w/ AI Coach
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 leading-[1.1]">
                        Master Your <br className="hidden md:block" />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
                            Work-Life Balance
                        </span>
                    </h1>

                    <p className="text-xl md:text-2xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                        The all-in-one platform to boost productivity, track wellness, and achieve your goals with AI-powered insights.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                        <Link
                            href="/dashboard"
                            className="w-full sm:w-auto px-8 py-4 bg-slate-900 text-white font-semibold rounded-full hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center justify-center gap-2"
                        >
                            Get Started Free
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                        <button className="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 font-semibold rounded-full hover:bg-slate-50 border border-slate-200 transition-all shadow-sm hover:shadow-md hover:-translate-y-1 flex items-center justify-center gap-2">
                            <Play className="w-5 h-5 fill-current" />
                            Watch Demo
                        </button>
                    </div>

                    {/* Social Proof */}
                    <div className="pt-12">
                        <p className="text-sm text-slate-500 font-medium mb-6">TRUSTED BY HIGH PERFORMERS AT</p>
                        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                            <span className="text-xl font-bold font-serif">Acme Corp</span>
                            <span className="text-xl font-bold font-sans">GlobalTech</span>
                            <span className="text-xl font-bold font-mono">Infinite</span>
                            <span className="text-xl font-bold">Starlight</span>
                        </div>
                    </div>
                </motion.div>

                {/* Dashboard Preview - Floating UI */}
                {/* Dashboard Preview - Floating UI */}
                <motion.div
                    initial={{ opacity: 0, y: 100, rotateX: 20 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    transition={{ duration: 1, delay: 0.4, type: "spring" }}
                    className="mt-20 max-w-6xl mx-auto relative perspective-1000"
                >
                    <div className="relative rounded-xl overflow-hidden shadow-2xl bg-white border border-slate-200">
                        {/* Browser Chrome */}
                        <div className="h-8 bg-slate-50 border-b border-slate-200 flex items-center px-4 gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-400" />
                            <div className="w-3 h-3 rounded-full bg-yellow-400" />
                            <div className="w-3 h-3 rounded-full bg-green-400" />
                            <div className="ml-auto w-48 h-4 bg-slate-200 rounded-full opacity-50" />
                        </div>
                        {/* Fake UI Content */}
                        <div className="aspect-[16/9] bg-slate-50 p-6 grid grid-cols-12 gap-6 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-tr from-white/40 via-transparent to-transparent z-10 pointer-events-none" />

                            {/* Sidebar */}
                            <div className="hidden md:flex col-span-2 bg-white rounded-lg shadow-sm h-full flex-col p-4 gap-4">
                                <div className="w-8 h-8 rounded-lg bg-indigo-600 mb-4" />
                                <div className="h-2 w-20 bg-slate-200 rounded-full" />
                                <div className="h-2 w-16 bg-slate-200 rounded-full" />
                                <div className="h-2 w-12 bg-slate-200 rounded-full" />
                                <div className="h-2 w-24 bg-slate-200 rounded-full mt-auto" />
                            </div>

                            {/* Main Content */}
                            <div className="col-span-12 md:col-span-10 grid grid-rows-3 gap-6 h-full">
                                {/* Header / Stats */}
                                <div className="row-span-1 bg-white rounded-lg shadow-sm p-6 flex items-center justify-between border border-slate-100">
                                    <div className="space-y-4">
                                        <div className="h-6 bg-slate-900/10 rounded-md w-48" />
                                        <div className="h-3 bg-slate-200 rounded w-64" />
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 rounded-full bg-indigo-50 border border-indigo-100" />
                                        <div className="w-12 h-12 rounded-full bg-purple-50 border border-purple-100" />
                                    </div>
                                </div>
                                {/* Main Columns */}
                                <div className="row-span-2 grid grid-cols-3 gap-6">
                                    {/* Big Chart Area */}
                                    <div className="bg-white rounded-lg shadow-sm col-span-2 border border-slate-100 p-6 relative overflow-hidden">
                                        <div className="flex justify-between items-center mb-8">
                                            <div className="h-4 w-32 bg-slate-200 rounded" />
                                            <div className="h-8 w-24 bg-indigo-600 rounded-md opacity-10" />
                                        </div>
                                        <div className="flex items-end gap-4 h-32 pl-4 pb-4">
                                            {[40, 70, 45, 90, 65, 85, 50].map((h, i) => (
                                                <div key={i} className="flex-1 bg-indigo-500 rounded-t-sm opacity-80" style={{ height: `${h}%` }} />
                                            ))}
                                        </div>
                                    </div>
                                    {/* Side Widget */}
                                    <div className="bg-white rounded-lg shadow-sm col-span-1 border border-slate-100 p-4 space-y-4">
                                        <div className="h-4 w-20 bg-slate-200 rounded" />
                                        {[1, 2, 3].map((_, i) => (
                                            <div key={i} className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-orange-100" />
                                                <div className="h-2 w-16 bg-slate-100 rounded" />
                                            </div>
                                        ))}
                                        <div className="mt-8 bg-green-50 rounded-lg p-3 h-24 border border-green-100" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Overlay CTA */}
                        <div className="absolute inset-0 flex items-center justify-center bg-white/10 backdrop-blur-[1px] hover:backdrop-blur-none transition-all duration-500 group cursor-pointer">
                            <Link href="/dashboard" className="bg-slate-900/90 hover:bg-slate-900 text-white shadow-2xl px-8 py-4 rounded-full font-bold text-lg opacity-90 hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 ring-4 ring-white/30">
                                Explore Live Dashboard
                            </Link>
                        </div>
                    </div>
                    {/* Decorative Elements around preview */}
                    <div className="absolute -top-12 -right-12 w-32 h-32 bg-yellow-400 rounded-full blur-3xl opacity-30 animate-pulse" />
                    <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-indigo-600 rounded-full blur-3xl opacity-30 animate-pulse delay-1000" />
                </motion.div>
            </div>
        </section>
    );
}

