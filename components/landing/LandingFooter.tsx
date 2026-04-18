"use client";

import Link from "next/link";
import { Twitter, Instagram, Linkedin, Github } from "lucide-react";

export default function LandingFooter() {
    return (
        <footer className="bg-slate-900 text-slate-300 py-16 px-6">
            <div className="container mx-auto max-w-7xl">
                <div className="grid md:grid-cols-4 gap-12 mb-12 border-b border-slate-800 pb-12">
                    <div className="col-span-1 md:col-span-1">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">W</div>
                            <span className="text-xl font-bold text-white">WorkLife+</span>
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed mb-6">
                            Empowering you to achieve peak performance while maintaining your mental and physical health.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-indigo-600 transition-colors text-white">
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-pink-600 transition-colors text-white">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-700 transition-colors text-white">
                                <Linkedin className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-6">Product</h4>
                        <ul className="space-y-4 text-sm">
                            <li><Link href="#features" className="hover:text-indigo-400 transition-colors">Features</Link></li>
                            <li><Link href="#pricing" className="hover:text-indigo-400 transition-colors">Pricing</Link></li>
                            <li><Link href="#testimonials" className="hover:text-indigo-400 transition-colors">Case Studies</Link></li>
                            <li><Link href="/dashboard" className="hover:text-indigo-400 transition-colors">Login</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-6">Company</h4>
                        <ul className="space-y-4 text-sm">
                            <li><a href="#" className="hover:text-indigo-400 transition-colors">About Us</a></li>
                            <li><a href="#" className="hover:text-indigo-400 transition-colors">Careers</a></li>
                            <li><a href="#" className="hover:text-indigo-400 transition-colors">Blog</a></li>
                            <li><a href="#" className="hover:text-indigo-400 transition-colors">Contact</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-6">Legal</h4>
                        <ul className="space-y-4 text-sm">
                            <li><a href="#" className="hover:text-indigo-400 transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-indigo-400 transition-colors">Terms of Service</a></li>
                            <li><a href="#" className="hover:text-indigo-400 transition-colors">Cookie Policy</a></li>
                        </ul>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
                    <div>&copy; {new Date().getFullYear()} WorkLife+. All rights reserved.</div>
                    <div className="flex gap-6 mt-4 md:mt-0">
                        <span>Designed with ❤️ by Adarsh Singh</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
