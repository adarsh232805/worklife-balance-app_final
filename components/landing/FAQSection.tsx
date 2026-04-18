"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function FAQSection() {
    const faqs = [
        {
            question: "Is WorkLife+ free to use?",
            answer: "Yes, we offer a generous Free Starter plan that includes all essential task management and tracking features. You can upgrade to Pro anytime for advanced AI insights.",
        },
        {
            question: "How does the AI Coach work?",
            answer: "Our AI Coach analyzes your activity patterns, completed tasks, and wellness logs to provide personalized recommendations. It's like having a productivity expert and a wellness counselor in your pocket.",
        },
        {
            question: "Can I use this for my team?",
            answer: "Absolutely. The Team plan allows you to create shared workspaces, set team goals, and view aggregated wellness insights (while keeping individual data private).",
        },
        {
            question: "Is my data secure?",
            answer: "We take privacy seriously. All your personal data is encrypted and we never sell your information to third parties. You have full control over your data export and deletion.",
        },
    ];

    return (
        <section id="faq" className="py-24 bg-slate-50">
            <div className="container mx-auto px-6 max-w-4xl">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-slate-900 mb-4">Frequently Asked Questions</h2>
                    <p className="text-slate-600">Got questions? We've got answers.</p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <AccordionItem key={index} question={faq.question} answer={faq.answer} />
                    ))}
                </div>
            </div>
        </section>
    );
}

function AccordionItem({ question, answer }: { question: string, answer: string }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-6 py-4 flex items-center justify-between text-left focus:outline-none"
            >
                <span className="font-semibold text-slate-900">{question}</span>
                {isOpen ? <ChevronUp className="w-5 h-5 text-indigo-600" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="px-6 pb-6 text-slate-600 leading-relaxed border-t border-slate-50 pt-4">
                            {answer}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
