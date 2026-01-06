"use client";
import { useState } from "react";

export default function MoodCheck() {
  const [mood, setMood] = useState("");

  return (
    <div className="space-y-3">
      <h3 className="font-semibold">How’s your energy today?</h3>
      <div className="flex gap-3 text-2xl">
        {["😄", "🙂", "😐", "😫"].map((m) => (
          <button
            key={m}
            onClick={() => setMood(m)}
            className={`p-2 rounded ${
              mood === m ? "bg-indigo-100" : ""
            }`}
          >
            {m}
          </button>
        ))}
      </div>
      {mood && (
        <p className="text-sm text-slate-600">
          Energy logged: {mood}
        </p>
      )}
    </div>
  );
}
