"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, RefreshCw, Globe, Flame, Clock } from "lucide-react";

interface NewsItem {
    title: string;
    pubDate: string;
    link: string;
    guid: string;
    author: string;
    thumbnail: string;
    description: string;
    content: string;
    source?: string;
}

type Category = "top" | "tech" | "business" | "health" | "sports" | "entertainment";
type Language = "en" | "hi";

const FEEDS = {
    en: {
        top: "https://news.google.com/rss?hl=en-IN&gl=IN&ceid=IN:en",
        tech: "https://news.google.com/rss/headlines/section/topic/SCIENTIFIC_TECH?hl=en-IN&gl=IN&ceid=IN%3Aen",
        business: "https://news.google.com/rss/headlines/section/topic/BUSINESS?hl=en-IN&gl=IN&ceid=IN%3Aen",
        health: "https://news.google.com/rss/headlines/section/topic/HEALTH?hl=en-IN&gl=IN&ceid=IN%3Aen",
        sports: "https://news.google.com/rss/headlines/section/topic/SPORTS?hl=en-IN&gl=IN&ceid=IN%3Aen",
        entertainment: "https://news.google.com/rss/headlines/section/topic/ENTERTAINMENT?hl=en-IN&gl=IN&ceid=IN%3Aen",
    },
    hi: {
        top: "https://news.google.com/rss?hl=hi&gl=IN&ceid=IN:hi",
        tech: "https://news.google.com/rss/headlines/section/topic/SCIENTIFIC_TECH?hl=hi&gl=IN&ceid=IN%3Ahi",
        business: "https://news.google.com/rss/headlines/section/topic/BUSINESS?hl=hi&gl=IN&ceid=IN%3Ahi",
        health: "https://news.google.com/rss/headlines/section/topic/HEALTH?hl=hi&gl=IN&ceid=IN%3Ahi",
        sports: "https://news.google.com/rss/headlines/section/topic/SPORTS?hl=hi&gl=IN&ceid=IN%3Ahi",
        entertainment: "https://news.google.com/rss/headlines/section/topic/ENTERTAINMENT?hl=hi&gl=IN&ceid=IN%3Ahi",
    }
};

const CATEGORY_LABELS = {
    top: { en: "Top Stories", hi: "मुख्य समाचार" },
    tech: { en: "Technology", hi: "तकनीक" },
    business: { en: "Business", hi: "व्यापार" },
    health: { en: "Health", hi: "सेहत" },
    sports: { en: "Sports", hi: "खेल" },
    entertainment: { en: "Entertainment", hi: "मनोरंजन" },
};

export default function NewsFeed() {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [language, setLanguage] = useState<Language>("en");
    const [category, setCategory] = useState<Category>("top");

    useEffect(() => {
        fetchNews();
    }, [language, category]);

    async function fetchNews() {
        setLoading(true);
        const feedUrl = FEEDS[language][category];
        try {
            const res = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feedUrl)}`);
            if (!res.ok) throw new Error("API responded with an error");
            const data = await res.json();
            if (data.status === "ok" && data.items) {
                // Clean up data
                const cleaned = data.items.map((item: any) => ({
                    ...item,
                    // Try to find an image if default thumbnail is missing or generic
                    thumbnail: item.thumbnail || item.enclosure?.link || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=2070&auto=format&fit=crop",
                    source: data.feed.title
                }));
                setNews(cleaned);
            } else {
                throw new Error("Invalid data format or status not ok");
            }
        } catch (error) {
            console.error("Failed to fetch news", error);
            setNews([]); // Clear news on error
        } finally {
            setLoading(false);
        }
    }

    const heroItem = news[0];
    const gridItems = news.slice(1);

    return (
        <div className="space-y-8">
            {/* Controls */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/50 backdrop-blur-md p-4 rounded-2xl border border-slate-200">

                {/* Categories */}
                <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
                    {(Object.keys(CATEGORY_LABELS) as Category[]).map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setCategory(cat)}
                            className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${category === cat
                                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30"
                                    : "bg-white text-slate-600 hover:bg-indigo-50"
                                }`}
                        >
                            {CATEGORY_LABELS[cat][language]}
                        </button>
                    ))}
                </div>

                {/* Language Toggle */}
                <div className="flex bg-slate-100 p-1 rounded-xl shrink-0">
                    <button
                        onClick={() => setLanguage("en")}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${language === 'en' ? 'bg-white shadow text-indigo-600' : 'text-slate-500'}`}
                    >
                        English
                    </button>
                    <button
                        onClick={() => setLanguage("hi")}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${language === 'hi' ? 'bg-white shadow text-indigo-600' : 'text-slate-500'}`}
                    >
                        हिंदी
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="space-y-8">
                    <div className="h-96 bg-slate-200 animate-pulse rounded-3xl" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="h-64 bg-slate-200 animate-pulse rounded-3xl" />
                        <div className="h-64 bg-slate-200 animate-pulse rounded-3xl" />
                    </div>
                </div>
            ) : (
                <div className="space-y-8">

                    {/* Hero Section - Top Headline */}
                    {heroItem && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="relative h-[400px] md:h-[500px] rounded-3xl overflow-hidden group cursor-pointer shadow-2xl"
                            onClick={() => window.open(heroItem.link, "_blank")}
                        >
                            <img
                                src={heroItem.thumbnail}
                                alt={heroItem.title}
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-90" />

                            <div className="absolute bottom-0 left-0 p-6 md:p-10 w-full md:w-3/4">
                                <div className="flex items-center gap-3 mb-4 text-white/80 text-sm font-medium">
                                    <span className="bg-rose-600 text-white px-3 py-1 rounded-full text-xs font-bold md:test-sm flex items-center gap-1">
                                        <Flame size={12} /> {CATEGORY_LABELS[category][language]} Headline
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Clock size={14} /> {new Date(heroItem.pubDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                                <h2 className="text-2xl md:text-4xl font-bold text-white leading-tight mb-4 group-hover:underline decoration-rose-500 underline-offset-4">
                                    {heroItem.title}
                                </h2>
                                <p className="text-slate-300 line-clamp-2 md:text-lg mb-6 hidden md:block">
                                    {/* Remove HTML tags for cleaner description */}
                                    {heroItem.description ? heroItem.description.replace(/<[^>]*>/g, '').slice(0, 200) : "Click to read the full story on the publisher website..."}...
                                </p>
                                <div className="flex items-center gap-2 text-white/70 text-sm">
                                    <Globe size={14} /> {heroItem.author || "News Source"}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* News Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {gridItems.map((item, index) => (
                            <motion.div
                                key={item.guid || index}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.05 }}
                                className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col h-full"
                            >
                                <div className="h-48 overflow-hidden relative">
                                    <img
                                        src={item.thumbnail}
                                        alt={item.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                </div>

                                <div className="p-5 flex-1 flex flex-col">
                                    <div className="flex items-center gap-2 mb-3 text-xs text-slate-400">
                                        <span>{new Date(item.pubDate).toLocaleDateString()}</span>
                                    </div>

                                    <h3 className="font-bold text-lg leading-snug text-slate-800 mb-3 line-clamp-3 group-hover:text-indigo-600 transition-colors">
                                        {item.title}
                                    </h3>

                                    <a
                                        href={item.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-auto inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-700 hover:gap-2 transition-all"
                                    >
                                        Read Story <ExternalLink size={14} />
                                    </a>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
