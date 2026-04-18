"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function LandingNavbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { name: "Features", href: "#features" },
        { name: "How it Works", href: "#how-it-works" },
        { name: "Testimonials", href: "#testimonials" },
        { name: "Pricing", href: "#pricing" },
        { name: "FAQ", href: "#faq" },
    ];

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled || mobileMenuOpen
                    ? "bg-white/90 backdrop-blur-md border-b border-slate-200 py-3"
                    : "bg-transparent py-5"
                }`}
        >
            <div className="container mx-auto px-6 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="w-10 h-10 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:scale-105 transition-transform">
                        W
                    </div>
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">
                        WorkLife+
                    </span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors"
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>

                <div className="hidden md:flex items-center gap-4">
                    <Link
                        href="/dashboard"
                        className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                    >
                        Log in
                    </Link>
                    <Link
                        href="/dashboard"
                        className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-full transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                    >
                        Get Started
                    </Link>
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className="md:hidden p-2 text-slate-600"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white border-b border-slate-200 overflow-hidden"
                    >
                        <div className="container mx-auto px-6 py-4 flex flex-col gap-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className="text-base font-medium text-slate-600 hover:text-indigo-600 py-2"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <div className="h-px bg-slate-100 my-2" />
                            <Link
                                href="/dashboard"
                                className="text-base font-medium text-slate-600 hover:text-slate-900 py-2"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Log in
                            </Link>
                            <Link
                                href="/dashboard"
                                className="text-center px-4 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Get Started
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
