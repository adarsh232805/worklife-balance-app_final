"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

/* IMPORT COMPONENTS */
import Sidebar from "@/components/Sidebar";
import BottomNav from "@/components/BottomNav";
import Navbar from "@/components/Navbar";

/* IMPORT SECTIONS */
import TodayView from "@/components/TodayView";
import FocusTab from "@/components/FocusTab";
import CalendarTab from "@/components/CalendarTab";
import RemindersTab from "@/components/RemindersTab";
import GamesTab from "@/components/GamesTab";
import MediaTab from "@/components/MediaTab";
import AnalyticsTab from "@/components/AnalyticsTab";

/* ================= PAGE ================= */

export default function AppPage() {
  const [activeTab, setActiveTab] = useState("today");

  // Map tab IDs to components and labels
  const renderContent = () => {
    switch (activeTab) {
      case "today": return <TodayView />;
      case "focus": return <FocusTab />;
      case "calendar": return <CalendarTab />;
      case "reminders": return <RemindersTab />;
      case "games": return <GamesTab />;
      case "media": return <MediaTab />;
      case "analytics": return <AnalyticsTab />;
      default: return <TodayView />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-slate-800 flex">

      {/* DESKTOP SIDEBAR */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* MAIN LAYOUT */}
      <div className="flex-1 flex flex-col md:ml-[250px] transition-all duration-300 relative pb-24 md:pb-0">

        {/* TOP NAVBAR */}
        <Navbar />

        {/* DYNAMIC CONTENT AREA */}
        <main className="flex-1 p-4 md:p-8 overflow-x-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="max-w-6xl mx-auto"
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* MOBILE BOTTOM NAV */}
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />

    </div>
  );
}
