"use client";

import { useState } from "react";
import {
  Home,
  Focus,
  Calendar,
  Bell,
  Gamepad2,
  Music,
  BarChart3,
} from "lucide-react";

/* IMPORT ALL SECTIONS */
import TodayView from "@/components/TodayView";
import FocusTab from "@/components/FocusTab";
import CalendarTab from "@/components/CalendarTab";
import RemindersTab from "@/components/RemindersTab";
import GamesTab from "@/components/GamesTab";
import MediaTab from "@/components/MediaTab";
import AnalyticsTab from "@/components/AnalyticsTab";

/* ================= TABS CONFIG ================= */

const TABS = [
  { id: "today", label: "Today", icon: <Home size={18} /> },
  { id: "focus", label: "Focus", icon: <Focus size={18} /> },
  { id: "calendar", label: "Calendar", icon: <Calendar size={18} /> },
  { id: "reminders", label: "Reminders", icon: <Bell size={18} /> },
  { id: "games", label: "Games", icon: <Gamepad2 size={18} /> },
  { id: "media", label: "Media", icon: <Music size={18} /> },
  { id: "analytics", label: "Analytics", icon: <BarChart3 size={18} /> },
];

/* ================= PAGE ================= */

export default function AppPage() {
  const [activeTab, setActiveTab] = useState("today");

  return (
    <div className="min-h-screen bg-slate-100">

      {/* TOP NAVBAR */}
      <header className="sticky top-0 z-40 bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-indigo-600">
            WorkLife+
          </h1>

          <nav className="flex gap-2">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition ${
                  activeTab === tab.id
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-100 hover:bg-slate-200"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto p-6 space-y-6">
        {activeTab === "today" && <TodayView />}
        {activeTab === "focus" && <FocusTab />}
        {activeTab === "calendar" && <CalendarTab />}
        {activeTab === "reminders" && <RemindersTab />}
        {activeTab === "games" && <GamesTab />}
        {activeTab === "media" && <MediaTab />}
        {activeTab === "analytics" && <AnalyticsTab />}
      </main>

      {/* FOOTER */}
      <footer className="mt-12 bg-white border-t">
        <div className="max-w-7xl mx-auto px-6 py-6 text-sm text-slate-500 flex justify-between">
          <p>© {new Date().getFullYear()} WorkLife+ — Balance your life.</p>
          <p>Made for productivity & wellbeing</p>
        </div>
      </footer>
    </div>
  );
}
