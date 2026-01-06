"use client";
import { useState } from "react";

export default function WorkLifeTimer() {
  const [mode, setMode] = useState<"work" | "life">("work");
  const [minutes, setMinutes] = useState(0);

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          onClick={() => setMode("work")}
          className={`px-4 py-2 rounded ${
            mode === "work" ? "bg-indigo-600 text-white" : "bg-indigo-100"
          }`}
        >
          Work
        </button>
        <button
          onClick={() => setMode("life")}
          className={`px-4 py-2 rounded ${
            mode === "life" ? "bg-green-600 text-white" : "bg-green-100"
          }`}
        >
          Life
        </button>
      </div>

      <button
        onClick={() => setMinutes(minutes + 25)}
        className="w-full bg-slate-800 text-white py-2 rounded"
      >
        Add 25 min to {mode}
      </button>

      <p className="text-sm text-slate-600">
        {mode === "work" ? "Working hard 💼" : "Living life 🌱"} — {minutes} min
      </p>
    </div>
  );
}
