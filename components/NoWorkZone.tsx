"use client";
import { useEffect } from "react";

export default function NoWorkZone() {
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 21 || hour < 8) {
      alert("🌙 It’s personal time. Avoid work tasks.");
    }
  }, []);

  return (
    <p className="text-xs text-slate-500">
      No-Work Zone active after 9 PM
    </p>
  );
}
