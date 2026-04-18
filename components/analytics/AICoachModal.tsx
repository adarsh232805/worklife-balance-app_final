"use client";

import { useState, useRef, useEffect } from "react";
import { X, Send, Bot, User, Sparkles, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from 'react-markdown';

interface Message {
    role: 'user' | 'ai';
    content: string;
}

export function AICoachModal({ isOpen, onClose, context }: { isOpen: boolean; onClose: () => void; context: any }) {
    const [messages, setMessages] = useState<Message[]>([
        { role: 'ai', content: "Hello! I'm Genius, your productivity coach. I see your daily stats. How can I help you optimize your workflow today?" }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = input;
        setInput("");
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setLoading(true);

        try {
            const res = await fetch('/api/ai-coach', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: userMsg,
                    context: context // Pass current dashboard stats
                })
            });

            const data = await res.json();

            if (data.reply) {
                setMessages(prev => [...prev, { role: 'ai', content: data.reply }]);
            } else {
                const errorMsg = data.details || data.error || "I'm having trouble connecting to the neural network.";
                setMessages(prev => [...prev, { role: 'ai', content: `Error: ${errorMsg}` }]);
            }
        } catch (error) {
            console.error("Failed to send message", error);
            setMessages(prev => [...prev, { role: 'ai', content: "Something went wrong. Please check your connection." }]);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-white rounded-3xl w-full max-w-lg h-[600px] shadow-2xl flex flex-col overflow-hidden ring-1 ring-slate-900/5"
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-violet-600 to-indigo-600 p-4 text-white flex justify-between items-center bg-white border-b border-indigo-500/20">
                        <div className="flex items-center gap-3">
                            <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
                                <Bot size={24} className="text-white" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg leading-tight">Genius Coach</h3>
                                <p className="text-xs text-indigo-100 flex items-center gap-1">
                                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" /> Online
                                </p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
                        {messages.map((msg, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                            >
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-slate-200 text-slate-600' : 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white'
                                    }`}>
                                    {msg.role === 'user' ? <User size={16} /> : <Sparkles size={16} />}
                                </div>
                                <div className={`max-w-[80%] p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.role === 'user'
                                    ? 'bg-white text-slate-800 rounded-tr-none'
                                    : 'bg-indigo-600 text-white rounded-tl-none'
                                    }`}>
                                    {/* Simple Markdown Rendering */}
                                    <div className={`prose prose-sm max-w-none ${msg.role === 'user' ? 'prose-invert text-slate-800' : 'prose-p:text-slate-700 prose-headings:text-indigo-800 prose-strong:text-indigo-900'}`}>
                                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                        {loading && (
                            <div className="flex gap-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                                    <Sparkles size={16} className="text-white" />
                                </div>
                                <div className="bg-indigo-600 rounded-2xl rounded-tl-none p-4 flex items-center gap-1">
                                    <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce delay-75" />
                                    <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce delay-150" />
                                    <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce delay-300" />
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-4 bg-white border-t border-slate-100">
                        <div className="relative flex items-center">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Ask about focus, sleep, or goals..."
                                className="w-full bg-slate-100 text-slate-800 placeholder:text-slate-400 rounded-xl py-3.5 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium"
                            />
                            <button
                                onClick={handleSend}
                                disabled={!input.trim() || loading}
                                className="absolute right-2 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 transition-colors shadow-lg shadow-indigo-200"
                            >
                                <Send size={18} />
                            </button>
                        </div>
                    </div>

                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
