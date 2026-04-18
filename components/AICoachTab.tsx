"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from 'react-markdown';
import { Bot, Send, User, Sparkles, BrainCircuit, Activity } from "lucide-react";

type Message = {
    id: string;
    role: 'user' | 'assistant';
    text: string;
    timestamp: Date;
};

const INITIAL_MESSAGE: Message = {
    id: 'intro',
    role: 'assistant',
    text: "Hello! I'm your Personal Productivity & Health Coach. I have access to your daily stats. How can I help you optimize your day?",
    timestamp: new Date()
};

export default function AICoachTab() {
    const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const [dailyContext, setDailyContext] = useState<any>(null);

    useEffect(() => {
        loadContext();
    }, []);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const loadContext = async () => {
        try {
            const res = await fetch('/api/analytics?range=week');
            const analyticsData = await res.json();
            setDailyContext(analyticsData);
        } catch (e) {
            console.error("Failed to load context for AI", e);
        }
    };

    const generateResponse = async (userText: string) => {
        setIsTyping(true);
        try {
            const res = await fetch('/api/ai-coach', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: userText,
                    context: dailyContext
                })
            });

            const data = await res.json();
            const responseText = data.reply || `Error: ${data.details || "Connection failed"}`;

            setMessages(prev => [...prev, {
                id: Date.now().toString(),
                role: 'assistant',
                text: responseText,
                timestamp: new Date()
            }]);

        } catch (error) {
            setMessages(prev => [...prev, {
                id: Date.now().toString(),
                role: 'assistant',
                text: "My neural network is temporarily unreachable. Please try again.",
                timestamp: new Date()
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleSend = (text: string = input) => {
        if (!text.trim()) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            role: 'user',
            text: text,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        setInput("");
        generateResponse(text);
    };

    const suggestions = [
        { icon: BrainCircuit, label: "Analyze my Day", prompt: "Analyze my today's performance and give me 3 improvements." },
        { icon: Activity, label: "Workout Plan", prompt: "Based on my activity, suggesting a quick 20-min workout?" },
        { icon: Sparkles, label: "Boost Motivation", prompt: "I'm feeling low energy. Give me a motivation boost based on my streak." },
    ];

    return (
        <div className="flex h-[calc(100vh-140px)] md:h-[calc(100vh-120px)] max-w-7xl mx-auto rounded-[32px] overflow-hidden shadow-2xl border border-white/20 bg-slate-900/5 backdrop-blur-sm">

            {/* SIDEBAR (Desktop) */}
            <div className="hidden md:flex w-80 bg-white/90 backdrop-blur-xl border-r border-white/20 flex-col p-6 gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="bg-gradient-to-br from-violet-600 to-indigo-600 p-2.5 rounded-xl shadow-lg shadow-indigo-500/20">
                            <Bot className="text-white" size={24} />
                        </div>
                        <h2 className="font-bold text-xl text-slate-800 tracking-tight">Genius AI</h2>
                    </div>
                    <p className="text-xs text-slate-500 font-medium ml-1 flex items-center">
                        <span className="inline-block w-2 h-2 bg-emerald-500 rounded-full mr-1.5 animate-pulse"></span>
                        Online & Analyzing Data
                    </p>
                </div>

                <div className="flex-1 space-y-4">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1">Quick Actions</h3>
                    <div className="space-y-2">
                        {suggestions.map((item, i) => (
                            <button
                                key={i}
                                onClick={() => handleSend(item.prompt)}
                                disabled={isTyping}
                                className="w-full flex items-center gap-3 p-3.5 rounded-xl bg-white border border-slate-100 shadow-sm hover:shadow-md hover:border-indigo-200 hover:bg-indigo-50/50 transition-all text-left group"
                            >
                                <div className="bg-slate-50 text-slate-500 p-2 rounded-lg group-hover:bg-white group-hover:text-indigo-600 transition-colors">
                                    <item.icon size={18} />
                                </div>
                                <span className="text-sm font-semibold text-slate-700 group-hover:text-indigo-700">{item.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="p-5 bg-gradient-to-br from-indigo-50 to-violet-50 rounded-2xl border border-indigo-100/50">
                    <p className="text-xs text-indigo-800 font-medium text-center italic leading-relaxed">
                        "Consistency is the playground of success."
                    </p>
                </div>
            </div>

            {/* MAIN CHAT */}
            <div className="flex-1 flex flex-col bg-slate-50/50 relative">
                {/* Background Decor */}
                <div className="absolute inset-0 z-0 opacity-40 pointer-events-none overflow-hidden">
                    <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-purple-400/20 rounded-full blur-[100px] mix-blend-multiply"></div>
                    <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-400/20 rounded-full blur-[100px] mix-blend-multiply"></div>
                </div>

                {/* Mobile Header (Hidden on Desktop) */}
                <div className="md:hidden flex items-center justify-between p-4 bg-white/80 backdrop-blur-md border-b border-slate-100 z-20">
                    <div className="flex items-center gap-2">
                        <div className="bg-gradient-to-br from-violet-600 to-indigo-600 p-1.5 rounded-lg">
                            <Bot className="text-white" size={18} />
                        </div>
                        <h2 className="font-bold text-slate-800">Genius AI</h2>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-500 uppercase">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                        Live
                    </div>
                </div>

                {/* Mobile Suggestions (Hidden on Desktop) */}
                <div className="md:hidden flex overflow-x-auto gap-2 p-3 hide-scrollbar relative z-20 bg-white/40 border-b border-slate-100/50">
                    {suggestions.map((item, i) => (
                        <button
                            key={i}
                            onClick={() => handleSend(item.prompt)}
                            disabled={isTyping}
                            className="whitespace-nowrap flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-100 shadow-sm text-xs font-bold text-slate-600 active:scale-95 transition-all"
                        >
                            <item.icon size={14} className="text-indigo-500" />
                            {item.label}
                        </button>
                    ))}
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 relative z-10 scroll-smooth" ref={scrollRef}>
                    <AnimatePresence initial={false}>
                        {messages.map((msg) => (
                            <motion.div
                                key={msg.id}
                                initial={{ opacity: 0, y: 15, scale: 0.98 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                            >
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg ${msg.role === 'assistant'
                                        ? 'bg-gradient-to-tr from-violet-600 to-indigo-600 text-white'
                                        : 'bg-white text-slate-600 border border-slate-100'
                                    }`}>
                                    {msg.role === 'assistant' ? <Bot size={20} /> : <User size={20} />}
                                </div>

                                <div className={`max-w-[85%] md:max-w-[75%] p-5 rounded-3xl shadow-sm text-sm md:text-[15px] leading-relaxed relative ${msg.role === 'assistant'
                                        ? 'bg-white text-slate-700 rounded-tl-none border border-slate-100/50 shadow-slate-200/50'
                                        : 'bg-gradient-to-br from-indigo-600 to-violet-600 text-white rounded-tr-none shadow-indigo-500/30'
                                    }`}>
                                    {msg.role === 'assistant' ? (
                                        <div className="prose prose-sm max-w-none prose-headings:text-indigo-900 prose-p:text-slate-700 prose-strong:text-indigo-800 prose-ul:my-2 prose-li:my-0.5">
                                            <ReactMarkdown>{msg.text}</ReactMarkdown>
                                        </div>
                                    ) : (
                                        <div className="prose prose-sm max-w-none prose-invert">
                                            <ReactMarkdown>{msg.text}</ReactMarkdown>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {isTyping && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-600 text-white flex items-center justify-center shadow-lg">
                                <Bot size={20} />
                            </div>
                            <div className="bg-white px-5 py-4 rounded-3xl rounded-tl-none border border-slate-100 shadow-sm flex items-center gap-1.5 h-14">
                                <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></span>
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* Input Area */}
                <div className="p-4 md:p-6 pb-6 bg-white/60 backdrop-blur-md border-t border-white/50 z-20">
                    <div className="relative max-w-4xl mx-auto flex items-center gap-2 bg-white p-2 rounded-[24px] border border-slate-200 shadow-xl shadow-indigo-100/50 focus-within:border-indigo-500/30 focus-within:ring-4 focus-within:ring-indigo-500/10 transition-all duration-300">
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Ask Genius for advice, plans, or motivation..."
                            className="flex-1 bg-transparent border-none outline-none px-4 py-2 text-slate-700 font-medium placeholder:text-slate-400 text-base"
                            disabled={isTyping}
                        />
                        <button
                            onClick={() => handleSend()}
                            disabled={!input.trim() || isTyping}
                            className="p-3.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-[20px] shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/40 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:shadow-none disabled:hover:scale-100 transition-all duration-200"
                        >
                            <Send size={20} className={isTyping ? "opacity-0" : "opacity-100"} />
                            {isTyping && <div className="absolute inset-0 flex items-center justify-center"><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div></div>}
                        </button>
                    </div>
                    <p className="text-center text-[10px] text-slate-400 mt-3 font-medium">
                        Genius AI can make mistakes. Check important info.
                    </p>
                </div>
            </div>
        </div>
    );
}
