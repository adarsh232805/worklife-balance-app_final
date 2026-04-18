"use client";

import { useEffect, useState } from "react";
import { Sparkles, Loader2, Moon, Brain, Droplets, Info } from "lucide-react";
import { api } from "@/lib/api";

export default function AICoachWidget() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.ai.getTip().then((res) => {
            setData(res);
            setLoading(false);
        }).catch((err) => {
            console.error(err);
            setLoading(false);
        });
    }, []);

    const getIcon = () => {
        switch (data?.type) {
            case 'sleep': return <Moon size={20} className="text-indigo-200" />;
            case 'focus': return <Brain size={20} className="text-pink-200" />;
            case 'hydration': return <Droplets size={20} className="text-blue-200" />;
            default: return <Sparkles size={20} className="text-amber-300" />;
        }
    };

    const getContextStat = () => {
        if (!data?.stats) return null;
        switch (data.type) {
            case 'sleep': return `Sleep: ${data.stats.sleepHours}h`;
            case 'focus': return `Focus: ${data.stats.focusMinutes}m`;
            case 'hydration': return `Water: ${data.stats.waterIntake || 0}ml`; // API might not send water yet if we didn't add it to query
            default: return null;
        }
    };

    return (
        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-lg group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 group-hover:scale-110 transition-transform duration-700" />

            <div className="relative z-10 h-full flex flex-col justify-between">
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
                            {getIcon()}
                        </div>
                        <span className="text-xs font-bold uppercase tracking-widest text-indigo-200">Daily AI Coach</span>
                    </div>

                    {loading ? (
                        <div className="h-20 flex items-center justify-center">
                            <Loader2 size={24} className="animate-spin text-indigo-300" />
                        </div>
                    ) : (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <p className="text-lg md:text-xl font-medium leading-relaxed mb-4">
                                "{data?.tip || "Stay consistent! Small daily habits lead to big changes."}"
                            </p>
                        </div>
                    )}
                </div>

                {!loading && (
                    <div className="flex items-center justify-between mt-2">
                        <div className="inline-flex px-3 py-1 rounded-full bg-white/10 border border-white/10 text-[10px] font-bold uppercase tracking-wide">
                            {data?.type || "General"} Tip
                        </div>
                        {getContextStat() && (
                            <span className="text-xs font-medium text-white/60">
                                {getContextStat()}
                            </span>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

