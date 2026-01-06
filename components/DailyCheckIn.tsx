"use client";
import { useEffect, useState } from "react";

export default function DailyCheckIn() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const checked = localStorage.getItem("checkedIn");
    if (!checked) {
      setOpen(true);
    }
  }, []);

  function submit() {
    localStorage.setItem("checkedIn", "true");
    setOpen(false);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-2xl w-96">
        <h2 className="text-lg font-semibold mb-4">
          How are you today?
        </h2>

        <button
          onClick={submit}
          className="w-full bg-indigo-600 text-white py-2 rounded"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
