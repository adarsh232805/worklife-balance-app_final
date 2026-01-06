"use client";

import {
  Home,
  Timer,
  BarChart3,
  CalendarDays,
  Bell,
  Gamepad2,
  Music,
} from "lucide-react";

type Tab =
  | "home"
  | "focus"
  | "analytics"
  | "calendar"
  | "reminders"
  | "games"
  | "media";

export default function MainTabs({
  active,
  onChange,
}: {
  active: Tab;
  onChange: (tab: Tab) => void;
}) {
  const tabs = [
    { id: "home", label: "Today", icon: Home },
    { id: "focus", label: "Focus", icon: Timer },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "calendar", label: "Calendar", icon: CalendarDays },
    { id: "reminders", label: "Reminders", icon: Bell },
    { id: "games", label: "Games", icon: Gamepad2 },
    { id: "media", label: "Music & Video", icon: Music },
  ];

  return (
    <nav className="flex flex-wrap gap-2 bg-white/80 backdrop-blur-xl p-2 rounded-2xl shadow">
      {tabs.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => onChange(id as Tab)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition
            ${
              active === id
                ? "bg-indigo-600 text-white shadow"
                : "hover:bg-indigo-100"
            }`}
        >
          <Icon size={16} />
          {label}
        </button>
      ))}
    </nav>
  );
}
