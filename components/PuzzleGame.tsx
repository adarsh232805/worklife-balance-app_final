"use client";
import { useState } from "react";

const symbols = ["🍎", "🍌", "🍇", "🍓", "🍎", "🍌", "🍇", "🍓"];

export default function PuzzleGame() {
  const [open, setOpen] = useState<number[]>([]);

  return (
    <div className="grid grid-cols-4 gap-3 max-w-xs mx-auto">
      {symbols.map((s, i) => (
        <button
          key={i}
          onClick={() => setOpen([...open, i].slice(-2))}
          className="h-16 bg-white shadow rounded text-2xl"
        >
          {open.includes(i) ? s : "❓"}
        </button>
      ))}
    </div>
  );
}
