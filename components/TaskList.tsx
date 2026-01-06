"use client";
import { useState } from "react";

export default function TaskList() {
  const [tasks, setTasks] = useState<string[]>([]);
  const [input, setInput] = useState("");

  function addTask() {
    if (!input.trim()) return;
    setTasks([...tasks, input]);
    setInput("");
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="New task..."
          className="flex-1 border rounded p-2"
        />
        <button
          onClick={addTask}
          className="bg-indigo-600 text-white px-4 rounded"
        >
          Add
        </button>
      </div>

      {tasks.map((task, i) => (
        <div key={i} className="bg-white p-2 rounded shadow">
          {task}
        </div>
      ))}
    </div>
  );
}
