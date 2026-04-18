"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

/* DYNAMIC IMPORTS TO OPTIMIZE BUNDLE SIZE */
const TodayView = dynamic(() => import("@/components/TodayView"), {
  loading: () => <TabLoading />,
});
const AICoachTab = dynamic(() => import("@/components/AICoachTab"), {
  loading: () => <TabLoading />,
});
const FocusTab = dynamic(() => import("@/components/FocusTab"), {
  loading: () => <TabLoading />,
});
const CalendarTab = dynamic(() => import("@/components/CalendarTab"), {
  loading: () => <TabLoading />,
});
const RemindersTab = dynamic(() => import("@/components/RemindersTab"), {
  loading: () => <TabLoading />,
});
const GamesTab = dynamic(() => import("@/components/GamesTab"), {
  loading: () => <TabLoading />,
});
const WellnessTab = dynamic(() => import("@/components/WellnessTab"), {
  loading: () => <TabLoading />,
});
const MediaTab = dynamic(() => import("@/components/MediaTab"), {
  loading: () => <TabLoading />,
});
const AnalyticsTab = dynamic(() => import("@/components/AnalyticsTab"), {
  loading: () => <TabLoading />,
});

function TabLoading() {
  return (
    <div className="flex items-center justify-center h-[50vh] text-slate-400">
      <Loader2 className="w-8 h-8 animate-spin" />
    </div>
  );
}

/* ================= PAGE ================= */

export default function AppPage() {
  const [activeTab, setActiveTab] = useState("today");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Map tab IDs to components and labels
  const renderContent = () => {
    switch (activeTab) {
      case "today": return <TodayView />;
      case "coach": return <AICoachTab />;
      case "focus": return <FocusTab />;
      case "calendar": return <CalendarTab />;
      case "reminders": return <RemindersTab />;
      case "games": return <GamesTab />;
      case "wellness": return <WellnessTab />;
      case "media": return <MediaTab />;
      case "analytics": return <AnalyticsTab />;
      default: return <TodayView />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-slate-800 flex">

      {/* SIDEBAR */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />

      {/* MAIN LAYOUT */}
      <div className="flex-1 flex flex-col md:ml-[250px] transition-all duration-300 relative pb-4 md:pb-0">

        {/* TOP NAVBAR */}
        <Navbar setIsMobileMenuOpen={setIsMobileMenuOpen} />

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

    </div>
  );
}
