"use client";
import { useEffect } from "react";

export default function BreakReminder() {
  useEffect(() => {
    const timer = setTimeout(() => {
      alert("☕ Take a 5-minute break");
    }, 60 * 60 * 1000); // 1 hour

    return () => clearTimeout(timer);
  }, []);

  return (
    <p className="text-xs text-slate-500">
      Smart break reminders enabled
    </p>
  );
}
