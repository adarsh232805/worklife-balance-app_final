"use client";

import { useState } from "react";
import { Newspaper, Youtube, Music, Sparkles } from "lucide-react";
import NewsFeed from "./NewsFeed";
import VideoGallery from "./VideoGallery";

export default function MediaDashboard() {
    const [activeTab, setActiveTab] = useState<"news" | "videos">("news");

    return (
        <div className="space-y-8 pb-32">
            {/* HERO HEADER */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-violet-600 to-indigo-600 p-8 md:p-12 text-white shadow-2xl">
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                            <Sparkles size={12} /> Content Hub
                        </span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
                        Discover & <br /><span className="text-indigo-200">Recharge.</span>
                    </h1>
                    <p className="text-indigo-100 max-w-lg text-lg">
                        Stay updated with the latest tech news or unwind with our curated focus music and meditation videos.
                    </p>
                </div>

                {/* BACKGROUND DECORATION */}
                <div className="absolute right-0 top-0 h-full w-1/2 bg-white/5 skew-x-12 transform translate-x-20" />
                <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-indigo-500/30 rounded-full blur-3xl" />
            </div>

            {/* TABS */}
            <div className="flex justify-center">
                <div className="bg-white/80 backdrop-blur-xl p-1.5 rounded-2xl shadow-sm border border-slate-200 inline-flex gap-2">
                    <button
                        onClick={() => setActiveTab("news")}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${activeTab === "news"
                                ? "bg-slate-900 text-white shadow-lg"
                                : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                            }`}
                    >
                        <Newspaper size={18} /> Tech News
                    </button>
                    <button
                        onClick={() => setActiveTab("videos")}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${activeTab === "videos"
                                ? "bg-rose-500 text-white shadow-lg"
                                : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                            }`}
                    >
                        <Youtube size={18} /> Videos & Music
                    </button>
                </div>
            </div>

            {/* CONTENT AREA */}
            <div className="min-h-[500px]">
                {activeTab === "news" ? (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-slate-800">Trending Updates</h2>
                        </div>
                        <NewsFeed />
                    </div>
                ) : (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-slate-800">Watch & Listen</h2>
                        </div>
                        <VideoGallery />
                    </div>
                )}
            </div>
        </div>
    );
}
