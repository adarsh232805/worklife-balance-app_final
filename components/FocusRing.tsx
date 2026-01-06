"use client";
import { useEffect, useState } from "react";

export default function FocusRing() {
  const [seconds, setSeconds] = useState(1500); // 25 min
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    const timer = setInterval(() => {
      setSeconds((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [running]);

  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="w-56 h-56 rounded-full border-[10px] border-indigo-500 flex items-center justify-center">
        <span className="text-3xl font-bold">
          {min}:{sec.toString().padStart(2, "0")}
        </span>
      </div>

      <button
        onClick={() => setRunning(!running)}
        className="bg-indigo-600 text-white px-6 py-2 rounded"
      >
        {running ? "Pause" : "Start"}
      </button>
    </div>
  );
}
