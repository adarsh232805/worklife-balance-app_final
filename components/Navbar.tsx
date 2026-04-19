"use client";

import { useEffect, useState } from "react";
import { Bell, Search, User, LogOut, Settings, Menu } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
// import { logOut } from "@/lib/actions"; // No longer using server action for sign-out
import Image from "next/image";
import Link from "next/link";
import LevelProgress from "./LevelProgress";

import NotificationCenter from "./NotificationCenter";

interface NavbarProps {
    setIsMobileMenuOpen: (val: boolean) => void;
}

export default function Navbar({ setIsMobileMenuOpen }: NavbarProps) {
    const { data: session } = useSession();
    const user = session?.user;
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    return (
        <header className="sticky top-0 z-30 w-full glass border-b md:bg-transparent md:border-b-0 md:backdrop-filter-none md:static px-6 py-4 flex items-center justify-between">
            {/* Mobile Brand & Menu Toggle */}
            <div className="md:hidden flex items-center gap-3">
                <button 
                    onClick={() => setIsMobileMenuOpen(true)}
                    className="p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                    <Menu size={24} />
                </button>
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                    WorkLife+
                </h1>
            </div>

            {/* Desktop Helper / Spacer */}
            <div className="hidden md:block">
                <h2 className="text-2xl font-semibold text-slate-800">
                    Welcome back, {isMounted ? (user?.name?.split(' ')[0] || 'Guest') : '...'}
                </h2>
                <p className="text-slate-500 text-sm">Let's be productive today.</p>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
                <button className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors">
                    <Search size={20} />
                </button>

                <NotificationCenter />

                {user && <LevelProgress />}

                {user ? (
                    <div className="group relative">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-purple-400 p-[2px] cursor-pointer">
                            <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                                {user.image ? (
                                    <Image src={user.image} alt={user.name || "User"} width={40} height={40} />
                                ) : (
                                    <User className="text-slate-400" />
                                )}
                            </div>
                        </div>
                        {/* DROPDOWN */}
                        <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-100 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform origin-top-right z-50">
                            <div className="px-4 py-3 border-b border-slate-50">
                                <p className="text-sm font-semibold truncate">{user.name}</p>
                                <p className="text-xs text-slate-500 truncate">{user.email}</p>
                            </div>
                            <Link
                                href="/settings"
                                className="w-full flex items-center gap-2 px-4 py-3 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                            >
                                <Settings size={16} />
                                Settings
                            </Link>
                            <button
                                onClick={() => signOut({ callbackUrl: '/login' })}
                                className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors rounded-b-xl"
                            >
                                <LogOut size={16} />
                                Sign Out
                            </button>
                        </div>
                    </div>
                ) : (
                    <Link href="/login" className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity">
                        Log In
                    </Link>
                )}
            </div>
        </header>
    );
}
