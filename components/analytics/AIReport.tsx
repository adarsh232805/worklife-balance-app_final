"use client";

import { Sparkles, Lightbulb } from "lucide-react";

export function AIReport({ report }: any) {
    return (
        <div className="bg-gradient-to-br from-violet-600 to-indigo-600 rounded-3xl p-6 text-white shadow-xl shadow-indigo-200 h-full relative overflow-hidden flex flex-col justify-between">
            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="text-yellow-300" size={20} />
                    <h3 className="font-bold text-lg opacity-90">AI Insight</h3>
                </div>

                <div className="mb-4">
                    <span className="bg-white/20 backdrop-blur px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                        {report.status}
                    </span>
                </div>

                <p className="text-lg leading-relaxed font-medium text-indigo-50">
                    "{report.text}"
                </p>
            </div>

            <div className="relative z-10 mt-6 pt-6 border-t border-white/20">
                <div className="flex items-center gap-2 mb-2 text-indigo-200 uppercase tracking-widest text-xs font-bold">
                    <Lightbulb size={12} /> Recommendation
                </div>
                <p className="text-sm opacity-95 font-medium bg-white/10 p-3 rounded-xl border border-white/5">
                    {report.recommendation}
                </p>
            </div>

            {/* Decorative */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-10 translate-x-10" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-500/30 rounded-full blur-xl translate-y-5 -translate-x-5" />
        </div>
    );
}
