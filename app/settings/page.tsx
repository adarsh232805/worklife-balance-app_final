"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    User, Mail, Phone, Calendar, Ruler, Weight, Activity,
    Camera, CheckCircle2, AlertCircle, Save, ArrowLeft,
    ShieldCheck, Smartphone, Edit2, Lock, ChevronRight, Sparkles
} from "lucide-react";

/* ================= TYPES ================= */
interface UserProfile {
    name: string;
    email: string;
    mobile: string;
    bio: string;
    dob: string;
    gender: string;
    weight: number;
    height: number;
    isEmailVerified: boolean;
    isMobileVerified: boolean;

    // App Preferences
    workHours: { start: string; end: string };
    sleepGoal: number;
    wellnessGoal: number;
    focusPreference: 'pomodoro' | '90min' | 'flow';
}

export default function SettingsPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState("personal");
    const [profile, setProfile] = useState<Partial<UserProfile>>({});

    // OTP State
    const [otpModal, setOtpModal] = useState<{ open: boolean; type: 'email' | 'mobile' | null }>({ open: false, type: null });
    const [otpCode, setOtpCode] = useState("");
    const [otpStatus, setOtpStatus] = useState<'idle' | 'sending' | 'verifying' | 'success' | 'error'>('idle');

    // Load Data
    useEffect(() => {
        fetch("/api/user/profile")
            .then(res => res.json())
            .then(data => {
                if (data && !data.error) {
                    if (data.dob) data.dob = new Date(data.dob).toISOString().split('T')[0];
                    const flattened = { ...data, ...data.profile };
                    setProfile(flattened);
                }
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    // Save Data
    const handleSave = async () => {
        setSaving(true);
        try {
            await fetch("/api/user/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(profile)
            });
            alert("Settings Saved! ✨");
        } catch (error) {
            console.error(error);
            alert("Failed to save.");
        } finally {
            setSaving(false);
        }
    };

    // OTP Logic
    const requestOtp = async (type: 'email' | 'mobile') => {
        setOtpStatus('sending');
        setOtpModal({ open: true, type });
        setOtpCode("");

        try {
            await fetch('/api/auth/otp', {
                method: 'POST',
                body: JSON.stringify({ action: 'send', type })
            });
            setOtpStatus('idle');
        } catch (e) {
            setOtpStatus('error');
        }
    };

    const verifyOtp = async () => {
        setOtpStatus('verifying');
        try {
            const res = await fetch('/api/auth/otp', {
                method: 'POST',
                body: JSON.stringify({ action: 'verify', type: otpModal.type, code: otpCode })
            });

            if (res.ok) {
                setOtpStatus('success');
                setProfile(prev => ({
                    ...prev,
                    [otpModal.type === 'email' ? 'isEmailVerified' : 'isMobileVerified']: true
                }));
                setTimeout(() => setOtpModal({ open: false, type: null }), 1500);
            } else {
                setOtpStatus('error');
            }
        } catch (e) {
            setOtpStatus('error');
        }
    };


    if (loading) return <div className="min-h-screen bg-slate-50 flex items-center justify-center font-outfit text-slate-400 animate-pulse">Loading Profile...</div>;

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-outfit text-slate-900 pb-20 relative overflow-x-hidden selection:bg-indigo-100 selection:text-indigo-900">

            {/* DECORATIVE BACKGROUND ELEMENTS */}
            <div className="fixed top-0 left-0 w-full h-[500px] bg-gradient-to-b from-indigo-50/50 to-transparent pointer-events-none" />
            <div className="fixed top-[-10%] right-[-5%] w-[500px] h-[500px] bg-purple-200/20 blur-[100px] rounded-full pointer-events-none" />
            <div className="fixed top-[20%] left-[-10%] w-[300px] h-[300px] bg-blue-200/20 blur-[80px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 pt-12 relative z-10">

                {/* TOP NAVIGATION */}
                <motion.button
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    onClick={() => router.back()}
                    className="group flex items-center gap-2 text-slate-500 hover:text-indigo-600 mb-8 transition-colors text-sm font-semibold tracking-wide uppercase"
                >
                    <div className="p-2 bg-white rounded-full shadow-sm border border-slate-100 group-hover:border-indigo-200 transition-colors">
                        <ArrowLeft size={16} />
                    </div>
                    Back to Dashboard
                </motion.button>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12"
                >
                    <div>
                        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-3">
                            Settings <span className="text-indigo-600">.</span>
                        </h1>
                        <p className="text-lg text-slate-500 max-w-xl leading-relaxed">
                            Customize your workspace, manage your personal data, and secure your account.
                        </p>
                    </div>

                    {/* GLOBAL SAVE BUTTON (Desktop) */}
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="hidden md:flex items-center gap-3 bg-slate-900 hover:bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-slate-200 hover:shadow-indigo-500/30 hover:-translate-y-1 active:translate-y-0 transition-all disabled:opacity-70 disabled:pointer-events-none"
                    >
                        {saving ? "Saving..." : "Save Changes"}
                        {!saving && <Save size={18} />}
                    </button>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                    {/* SIDEBAR NAVIGATION */}
                    <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="lg:col-span-3 space-y-8"
                    >
                        {/* User Mini Profile */}
                        <div className="flex items-center gap-4 p-4 bg-white/60 backdrop-blur-xl border border-white/50 rounded-2xl shadow-sm">
                            <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-100 ring-2 ring-white shadow-md">
                                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.name || "User"}`} alt="Avatar" />
                            </div>
                            <div className="overflow-hidden">
                                <h3 className="font-bold text-slate-800 truncate">{profile.name}</h3>
                                <p className="text-xs text-slate-500 font-medium truncate">{profile.email}</p>
                            </div>
                        </div>

                        {/* Tabs */}
                        <nav className="space-y-2">
                            {[
                                { id: "personal", label: "Personal Info", icon: User, desc: "Name, Bio & Contact" },
                                { id: "preferences", label: "Preferences", icon: Sparkles, desc: "Work Hours & Goals" },
                                { id: "health", label: "Health Stats", icon: Activity, desc: "Body Metrics" },
                                { id: "account", label: "Security", icon: ShieldCheck, desc: "Verify & Password" },
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full text-left p-4 rounded-2xl transition-all duration-300 group relative overflow-hidden ${activeTab === tab.id
                                            ? "bg-white shadow-lg shadow-indigo-100 ring-1 ring-indigo-50"
                                            : "hover:bg-white/50 hover:shadow-sm"
                                        }`}
                                >
                                    <div className={`absolute left-0 top-0 w-1 h-full bg-indigo-500 transition-all duration-300 ${activeTab === tab.id ? 'opacity-100' : 'opacity-0'}`} />
                                    <div className="flex items-center gap-4 relative z-10">
                                        <div className={`p-2.5 rounded-xl transition-colors ${activeTab === tab.id ? "bg-indigo-600 text-white shadow-md shadow-indigo-200" : "bg-slate-100 text-slate-500 group-hover:text-indigo-600 group-hover:bg-indigo-50"
                                            }`}>
                                            <tab.icon size={20} className={activeTab === tab.id ? "" : "stroke-[2px]"} />
                                        </div>
                                        <div>
                                            <span className={`block text-base font-bold ${activeTab === tab.id ? "text-slate-900" : "text-slate-600 group-hover:text-indigo-900"}`}>{tab.label}</span>
                                            <span className="text-xs font-medium text-slate-400 group-hover:text-slate-500">{tab.desc}</span>
                                        </div>
                                        {activeTab === tab.id && <ChevronRight className="ml-auto text-indigo-400" size={16} />}
                                    </div>
                                </button>
                            ))}
                        </nav>
                    </motion.div>

                    {/* MAIN CONTENT AREA */}
                    <div className="lg:col-span-9">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                                className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-12 shadow-xl shadow-slate-200/60 border border-white/60 relative overflow-hidden"
                            >
                                {/* Content Background Blob */}
                                <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-indigo-50/50 rounded-full blur-3xl pointer-events-none -mt-20 -mr-20" />

                                {/* SECTION: PERSONAL INFO */}
                                {activeTab === "personal" && (
                                    <div className="space-y-10 relative">
                                        <SectionHeader title="Basic Information" subtitle="This is how others will see you on the platform." icon={<User />} />

                                        <div className="flex flex-col md:flex-row gap-8 items-start">
                                            {/* Avatar Upload */}
                                            <div className="flex-shrink-0 group relative cursor-pointer">
                                                <div className="w-32 h-32 rounded-3xl overflow-hidden shadow-2xl shadow-slate-200 ring-4 ring-white transition-transform group-hover:scale-[1.02]">
                                                    {profile.gender === 'Female' ? (
                                                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.name}&gender=female`} alt="Avatar" className="w-full h-full object-cover bg-indigo-50" />
                                                    ) : (
                                                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.name || "User"}`} alt="Avatar" className="w-full h-full object-cover bg-indigo-50" />
                                                    )}
                                                </div>
                                                <div className="absolute -bottom-2 -right-2 bg-indigo-600 text-white p-2.5 rounded-xl shadow-lg hover:bg-indigo-700 transition-colors">
                                                    <Camera size={18} />
                                                </div>
                                            </div>

                                            <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                                                <Input
                                                    label="Full Name"
                                                    value={profile.name || ""}
                                                    onChange={(e: any) => setProfile({ ...profile, name: e.target.value })}
                                                    placeholder="e.g. Adarsh Singh"
                                                />
                                                <Input
                                                    label="Bio / Status"
                                                    value={profile.bio || ""}
                                                    onChange={(e: any) => setProfile({ ...profile, bio: e.target.value })}
                                                    placeholder="What's on your mind?"
                                                    icon={<Edit2 size={16} />}
                                                />
                                                <Input
                                                    label="Date of Birth"
                                                    type="date"
                                                    value={profile.dob || ""}
                                                    onChange={(e: any) => setProfile({ ...profile, dob: e.target.value })}
                                                />

                                                {/* Gender Select */}
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Gender</label>
                                                    <div className="grid grid-cols-3 gap-2 p-1 bg-slate-50/50 rounded-2xl border border-slate-200/60">
                                                        {["Male", "Female", "Other"].map(g => (
                                                            <button
                                                                key={g}
                                                                onClick={() => setProfile({ ...profile, gender: g })}
                                                                className={`py-2.5 rounded-xl text-sm font-bold transition-all ${profile.gender === g
                                                                        ? "bg-white text-indigo-600 shadow-sm ring-1 ring-slate-100"
                                                                        : "text-slate-400 hover:text-slate-600"
                                                                    }`}
                                                            >
                                                                {g}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="w-full h-px bg-slate-100" />

                                        <SectionHeader title="Contact Details" subtitle="Manage verify phone and email." icon={<Phone />} />
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <Input
                                                label="Email Address"
                                                value={profile.email || ""}
                                                disabled
                                                icon={<Mail size={16} />}
                                                action={
                                                    profile.isEmailVerified
                                                        ? <span className="text-emerald-500 bg-emerald-50 px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 border border-emerald-100"><ShieldCheck size={12} /> Verified</span>
                                                        : <button onClick={() => requestOtp('email')} className="text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg text-xs font-bold hover:bg-indigo-100 border border-indigo-100 transition-colors">Verify Now</button>
                                                }
                                            />
                                            <Input
                                                label="Mobile Number"
                                                value={profile.mobile || ""}
                                                onChange={(e: any) => setProfile({ ...profile, mobile: e.target.value })}
                                                placeholder="+91 00000 00000"
                                                icon={<Smartphone size={16} />}
                                                action={
                                                    profile.isMobileVerified
                                                        ? <span className="text-emerald-500 bg-emerald-50 px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 border border-emerald-100"><ShieldCheck size={12} /> Verified</span>
                                                        : <button onClick={() => requestOtp('mobile')} className="text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg text-xs font-bold hover:bg-indigo-100 border border-indigo-100 transition-colors">Verify Now</button>
                                                }
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* SECTION: PREFERENCES */}
                                {activeTab === "preferences" && (
                                    <div className="space-y-10">
                                        <SectionHeader title="Work & Focus" subtitle="Customize your workday schedule and goals." icon={<Sparkles />} />

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-3">
                                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Working Hours</label>
                                                <div className="flex items-center gap-3 p-1">
                                                    <input
                                                        type="time"
                                                        value={profile.workHours?.start || "09:00"}
                                                        onChange={(e) => setProfile({ ...profile, workHours: { ...profile.workHours!, start: e.target.value } })}
                                                        className="flex-1 p-4 bg-slate-50 border border-slate-200/60 rounded-2xl font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-center"
                                                    />
                                                    <span className="text-slate-300 font-bold">to</span>
                                                    <input
                                                        type="time"
                                                        value={profile.workHours?.end || "17:00"}
                                                        onChange={(e) => setProfile({ ...profile, workHours: { ...profile.workHours!, end: e.target.value } })}
                                                        className="flex-1 p-4 bg-slate-50 border border-slate-200/60 rounded-2xl font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-center"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Focus Method</label>
                                                <div className="grid grid-cols-1 gap-3">
                                                    {['pomodoro', '90min', 'flow'].map((mode) => (
                                                        <button
                                                            key={mode}
                                                            onClick={() => setProfile({ ...profile, focusPreference: mode as any })}
                                                            className={`flex items-center gap-4 p-4 rounded-2xl border text-left transition-all ${profile.focusPreference === mode
                                                                    ? "border-indigo-500 bg-indigo-50/50 ring-1 ring-indigo-500/20"
                                                                    : "border-slate-200/60 hover:bg-slate-50 hover:border-slate-300"
                                                                }`}
                                                        >
                                                            <div className={`p-2 rounded-full ${profile.focusPreference === mode ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-400"}`}>
                                                                {mode === 'pomodoro' && <Activity size={16} />}
                                                                {mode === '90min' && <Activity size={16} className="rotate-90" />}
                                                                {mode === 'flow' && <Sparkles size={16} />}
                                                            </div>
                                                            <div>
                                                                <p className={`text-sm font-bold capitalize ${profile.focusPreference === mode ? "text-indigo-900" : "text-slate-700"}`}>{mode}</p>
                                                                <p className="text-xs text-slate-400">
                                                                    {mode === 'pomodoro' && "25m Focus / 5m Break"}
                                                                    {mode === '90min' && "90m Work / 20m Break"}
                                                                    {mode === 'flow' && "No rigid timers"}
                                                                </p>
                                                            </div>
                                                            {profile.focusPreference === mode && <CheckCircle2 className="ml-auto text-indigo-600" size={18} />}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            <Input
                                                label="Daily Sleep Goal (Hrs)"
                                                type="number"
                                                value={profile.sleepGoal || 8}
                                                onChange={(e: any) => setProfile({ ...profile, sleepGoal: parseFloat(e.target.value) })}
                                                icon={<Activity size={16} />}
                                            />
                                            <Input
                                                label="Wellness Activity (Mins)"
                                                type="number"
                                                value={profile.wellnessGoal || 30}
                                                onChange={(e: any) => setProfile({ ...profile, wellnessGoal: parseFloat(e.target.value) })}
                                                icon={<Activity size={16} />}
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* SECTION: HEALTH */}
                                {activeTab === "health" && (
                                    <div className="space-y-10">
                                        <SectionHeader title="Physical Stats" subtitle="Used for calculating Health Score and break recommendations." icon={<Activity />} />

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <StatsCard
                                                title="Height"
                                                value={profile.height}
                                                unit="cm"
                                                onChange={(val: any) => setProfile({ ...profile, height: val })}
                                                icon={<Ruler className="text-blue-500" />}
                                                color="blue"
                                            />
                                            <StatsCard
                                                title="Weight"
                                                value={profile.weight}
                                                unit="kg"
                                                onChange={(val: any) => setProfile({ ...profile, weight: val })}
                                                icon={<Weight className="text-rose-500" />}
                                                color="rose"
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* SECTION: ACCOUNT (Placeholder) */}
                                {activeTab === "account" && (
                                    <div className="space-y-10">
                                        <SectionHeader title="Account Security" subtitle="Manage your password and active sessions." icon={<ShieldCheck />} />
                                        <div className="p-8 bg-slate-50 border border-slate-200 rounded-3xl text-center">
                                            <Lock className="mx-auto text-slate-400 mb-4" size={32} />
                                            <h3 className="text-lg font-bold text-slate-700">Password & Security</h3>
                                            <p className="text-slate-400 text-sm mb-6">Change your password or enable 2FA here.</p>
                                            <button className="bg-white border border-slate-200 font-bold text-slate-700 px-6 py-2 rounded-xl hover:bg-slate-50 transition">Change Password</button>
                                        </div>
                                    </div>
                                )}

                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

                {/* MOBILE SAVE BUTTON */}
                <div className="fixed bottom-6 left-6 right-6 md:hidden z-40">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold shadow-xl flex items-center justify-center gap-3 disabled:opacity-70"
                    >
                        {saving ? "Saving..." : "Save Changes"}
                        {!saving && <Save size={18} />}
                    </button>
                </div>

                {/* OTP MODAL */}
                <AnimatePresence>
                    {otpModal.open && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-6">
                            <motion.div initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 30 }} className="bg-white rounded-[2.5rem] p-8 max-w-sm w-full relative shadow-2xl border border-white/20">
                                <button onClick={() => setOtpModal({ open: false, type: null })} className="absolute top-6 right-6 p-2 hover:bg-slate-50 rounded-full text-slate-400 hover:text-slate-600 transition"><AlertCircle className="rotate-45" /></button>

                                <div className="text-center mb-8 pt-4">
                                    <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-indigo-100">
                                        <ShieldCheck size={36} />
                                    </div>
                                    <h3 className="text-2xl font-black text-slate-900">Verification</h3>
                                    <p className="text-slate-500 font-medium text-sm mt-3 leading-relaxed">
                                        Enter the code sent to your {otpModal.type}. <br />
                                        <span className="inline-block mt-2 font-mono bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs border border-slate-200">Dev Mode: Try '1234'</span>
                                    </p>
                                </div>

                                <div className="space-y-6">
                                    <input
                                        type="text"
                                        value={otpCode}
                                        onChange={(e) => setOtpCode(e.target.value)}
                                        placeholder="0000"
                                        maxLength={4}
                                        className="w-full text-center text-4xl tracking-[1rem] font-black p-6 rounded-3xl border-2 border-slate-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all placeholder:text-slate-200 text-slate-800"
                                    />

                                    <div className="h-6 text-center">
                                        {otpStatus === 'error' && <p className="text-rose-500 text-sm font-bold animate-pulse">Invalid Code.</p>}
                                        {otpStatus === 'success' && <p className="text-emerald-500 text-sm font-bold">Verified! 🎉</p>}
                                    </div>

                                    <button
                                        onClick={verifyOtp}
                                        disabled={otpCode.length !== 4 || otpStatus === 'success'}
                                        className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-500/30 transition-all disabled:opacity-50 disabled:shadow-none"
                                    >
                                        {otpStatus === 'verifying' ? 'Verifying...' : 'Verify Now'}
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        </div>
    );
}

/* --- SUBCOMPONENTS --- */

function SectionHeader({ title, subtitle, icon }: any) {
    return (
        <div className="flex items-start gap-4 mb-8">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl shadow-sm border border-indigo-100">
                {icon}
            </div>
            <div>
                <h2 className="text-xl font-bold text-slate-800 tracking-tight">{title}</h2>
                <p className="text-sm text-slate-400 font-medium mt-1">{subtitle}</p>
            </div>
        </div>
    );
}

function Input({ label, icon, action, ...props }: any) {
    return (
        <div className="space-y-2 group">
            <div className="flex justify-between items-center px-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</label>
                {action}
            </div>
            <div className="relative transition-all duration-300 transform group-hover:-translate-y-0.5 group-focus-within:-translate-y-0.5">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                    {icon}
                </div>
                <input
                    {...props}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200/60 rounded-2xl font-bold text-slate-700 outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:font-medium placeholder:text-slate-300 disabled:opacity-60 disabled:cursor-not-allowed"
                />
            </div>
        </div>
    );
}

function StatsCard({ title, value, unit, onChange, icon, color }: any) {
    return (
        <div className="p-6 bg-slate-50/50 rounded-[2rem] border border-slate-200/60 flex items-center justify-between hover:bg-white hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300 group">
            <div className="flex items-center gap-5">
                <div className={`p-4 bg-white rounded-2xl shadow-sm ring-1 ring-slate-100 text-${color}-500 group-hover:scale-110 transition-transform`}>
                    {icon}
                </div>
                <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{title}</p>
                    <div className="flex items-baseline gap-1">
                        <input
                            type="number"
                            value={value || ''}
                            onChange={(e) => onChange(parseFloat(e.target.value))}
                            className="bg-transparent text-3xl font-black text-slate-800 w-24 outline-none border-b-2 border-transparent focus:border-indigo-500 transition-colors placeholder:text-slate-200"
                            placeholder="0"
                        />
                        <span className="text-sm font-bold text-slate-400">{unit}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
