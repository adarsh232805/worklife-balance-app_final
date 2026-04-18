"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, MonitorPlay, Maximize2, Minimize2, X } from "lucide-react";

const CATEGORIES = [
    { id: "focus", label: "Focus & Flow 🧠" },
    { id: "motivation", label: "Motivation 🚀" },
    { id: "meditation", label: "Meditation 🧘" },
    { id: "yoga", label: "Yoga & Stretch 🤸" },
    { id: "hiit", label: "HIIT Workout 💪" },
    { id: "nature", label: "Nature Sounds 🌿" },
    { id: "lofi", label: "Lofi Beats 🎧" },
];

const VIDEOS = {
    focus: [
        { id: "jfKfPfyJRdk", title: "lofi hip hop radio - beats to relax/study to" },
        { id: "wpP6s_xYwW4", title: "Deep Focus Music for Work" },
        { id: "lTRiuFIWV54", title: "Ambient Music for Deep Focus" },
        { id: "94xQ8bJ2X2o", title: "Brain Power - Focus Music" },
    ],
    motivation: [
        { id: "wnHW6o8WMas", title: "Best Motivational Video Speeches" },
        { id: "mgmVOuLgFB0", title: "Why You're Not Successful - David Goggins" },
        { id: "ZXsQAXx_ao0", title: "Study Hard - Motivation" },
        { id: "pxBQLFLei70", title: "Discipline Yourself - Psychology" },
    ],
    meditation: [
        { id: "inpok4MKVLM", title: "5 Minute Meditation You Can Do Anywhere" },
        { id: "zSkFFW--Ma0", title: "Guided Mindfulness Meditation" },
        { id: "2OEL4P1Rz04", title: "Calm Your Mind - 10 Min" },
        { id: "O-6f5wQXSu8", title: "10-Minute Meditation for Anxiety" },
    ],
    yoga: [
        { id: "sTANio_2E0Q", title: "10 Min Morning Yoga for Beginners" },
        { id: "4pKly2JojMw", title: "Yoga For Complete Beginners - 20 Minute" },
        { id: "v7SN-d4qXx0", title: "Total Body Yoga - Deep Stretch" },
    ],
    hiit: [
        { id: "M0uO8X3_tEA", title: "20 Minute Full Body Workout - No Equipment" },
        { id: "ml6cT4AZdqI", title: "30 Min HIIT Workout for Fat Loss" },
        { id: "CBWQGb4LyAM", title: "15 Min HIIT Workout - No Equipment" },
    ],
    nature: [
        { id: "eKFTSSKCzWA", title: "Relaxing Rain Sounds for Sleep & Focus" },
        { id: "ipf7ifVSeDU", title: "Forest Sounds - Birds Singing" },
        { id: "q76bMs-NwRk", title: "Ocean Waves for Relaxation" },
    ],
    lofi: [
        { id: "5qap5aO4i9A", title: "lofi hip hop radio - beats to sleep/chill to" },
        { id: "n61ULEU7CO0", title: "Lofi Study Session" },
        { id: "-5KAN9_CzSA", title: "Coffee Shop Ambience + Lofi" },
    ],
};

export default function VideoGallery() {
    const [activeCat, setActiveCat] = useState("focus");
    const [activeVideo, setActiveVideo] = useState<string | null>(null);
    const [isTheaterMode, setIsTheaterMode] = useState(false);

    return (
        <div className="space-y-8">
            {/* Categories */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {CATEGORIES.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => { setActiveCat(cat.id); setActiveVideo(null); }}
                        className={`px-5 py-2.5 rounded-2xl text-sm font-bold whitespace-nowrap transition-all ${activeCat === cat.id
                                ? "bg-rose-500 text-white shadow-lg shadow-rose-500/30 transform scale-105"
                                : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-100"
                            }`}
                    >
                        {cat.label}
                    </button>
                ))}
            </div>

            {/* Main Player Area */}
            <AnimatePresence>
                {activeVideo && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className={`relative rounded-3xl overflow-hidden bg-black shadow-2xl transition-all duration-500 ${isTheaterMode ? "fixed inset-0 z-50 rounded-none" : "aspect-video ring-4 ring-rose-100"
                            }`}
                    >
                        {isTheaterMode && (
                            <button
                                onClick={() => setIsTheaterMode(false)}
                                className="absolute top-4 right-4 z-50 bg-black/50 text-white p-2 rounded-full hover:bg-black/80"
                            >
                                <Minimize2 size={24} />
                            </button>
                        )}

                        {!isTheaterMode && (
                            <div className="absolute top-4 right-4 z-10 flex gap-2">
                                <button
                                    onClick={() => setIsTheaterMode(true)}
                                    className="bg-black/50 backdrop-blur text-white p-2 rounded-xl hover:scale-110 transition-transform"
                                    title="Theater Mode"
                                >
                                    <Maximize2 size={18} />
                                </button>
                                <button
                                    onClick={() => setActiveVideo(null)}
                                    className="bg-red-500/80 backdrop-blur text-white p-2 rounded-xl hover:bg-red-600 transition-colors"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                        )}

                        <iframe
                            src={`https://www.youtube.com/embed/${activeVideo}?autoplay=1&rel=0`}
                            title="YouTube video player"
                            className="w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Video Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {VIDEOS[activeCat as keyof typeof VIDEOS]?.map((video) => (
                    <motion.div
                        layoutId={video.id}
                        key={video.id}
                        onClick={() => setActiveVideo(video.id)}
                        className={`group cursor-pointer rounded-2xl overflow-hidden bg-white shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 ${activeVideo === video.id ? 'ring-2 ring-rose-500' : ''}`}
                    >
                        <div className="relative aspect-video overflow-hidden">
                            <img
                                src={`https://img.youtube.com/vi/${video.id}/mqdefault.jpg`}
                                alt={video.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                <div className="bg-white/20 backdrop-blur-md p-4 rounded-full group-hover:scale-110 transition-transform shadow-xl">
                                    <Play className="fill-white text-white" size={28} />
                                </div>
                            </div>
                            <div className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] font-bold px-2 py-1 rounded-md">
                                Youtube
                            </div>
                        </div>
                        <div className="p-4">
                            <h4 className="font-bold text-slate-800 line-clamp-2 group-hover:text-rose-600 transition-colors leading-snug">
                                {video.title}
                            </h4>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
