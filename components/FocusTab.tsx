"use client";

import { useEffect, useRef, useState } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Music,
  Brain,
  Coffee,
  Volume2,
  Maximize,
  Minimize,
} from "lucide-react";

/* ---------------- CONFIG ---------------- */

const DURATIONS = {
  pomodoro: 25 * 60,
  deep: 50 * 60,
};

const FALLBACK_QUOTES = [
  "Focus on progress, not perfection.",
  "Small steps every day lead to big results.",
  "आज का फोकस, कल की सफलता।",
  "काम पर ध्यान दो, परिणाम अपने आप आएगा।",
];

const DEFAULT_SOUNDS = [
  {
    name: "Rain",
    src: "https://cdn.pixabay.com/audio/2022/03/15/audio_58cfaec0d1.mp3",
  },
  {
    name: "Forest",
    src: "https://cdn.pixabay.com/audio/2022/10/03/audio_63c2b2a93e.mp3",
  },
  {
    name: "Focus Music",
    src: "https://cdn.pixabay.com/audio/2022/01/18/audio_d0c6d8a92d.mp3",
  },
];

type Mode = "pomodoro" | "deep";

/* ---------------- COMPONENT ---------------- */

export default function FocusTab() {
  const [mode, setMode] = useState<Mode>("pomodoro");
  const [seconds, setSeconds] = useState(DURATIONS.pomodoro);
  const [running, setRunning] = useState(false);
  const [sessions, setSessions] = useState<number[]>([]);
  const [quote, setQuote] = useState(FALLBACK_QUOTES[0]);
  const [zen, setZen] = useState(false);

  const [playlist, setPlaylist] = useState(DEFAULT_SOUNDS);
  const [sound, setSound] = useState(DEFAULT_SOUNDS[0]);
  const [volume, setVolume] = useState(0.4);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  /* ---------------- TIMER ---------------- */

  useEffect(() => {
    if (!running) return;

    const i = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          setRunning(false);
          setSessions((prev) => [...prev, Date.now()]);
          fetchQuote();
          return DURATIONS[mode];
        }
        return s - 1;
      });
    }, 1000);

    return () => clearInterval(i);
  }, [running, mode]);

  /* ---------------- AUDIO ---------------- */

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = volume;
    if (running) audioRef.current.play();
    else audioRef.current.pause();
  }, [running, volume, sound]);

  /* ---------------- QUOTES ---------------- */

  async function fetchQuote() {
    try {
      const res = await fetch("/api/quote");
      const data = await res.json();
      setQuote(data.quote);
    } catch {
      setQuote(
        FALLBACK_QUOTES[Math.floor(Math.random() * FALLBACK_QUOTES.length)]
      );
    }
  }

  /* ---------------- HELPERS ---------------- */

  function reset() {
    setRunning(false);
    setSeconds(DURATIONS[mode]);
  }

  function changeMode(m: Mode) {
    setMode(m);
    setRunning(false);
    setSeconds(DURATIONS[m]);
  }

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  const todaySessions = sessions.filter(
    (s) => new Date(s).toDateString() === new Date().toDateString()
  ).length;

  return (
    <div className={zen ? "fixed inset-0 z-50 bg-white p-10" : ""}>
      <div className="grid md:grid-cols-3 gap-6">

        {/* MAIN */}
        <div className="md:col-span-2 bg-white rounded-3xl shadow p-8 text-center">

          <div className="flex justify-between mb-4">
            <div className="flex gap-3">
              <ModeButton active={mode === "pomodoro"} onClick={() => changeMode("pomodoro")} label="Pomodoro" />
              <ModeButton active={mode === "deep"} onClick={() => changeMode("deep")} label="Deep Focus" />
            </div>

            <button onClick={() => setZen(!zen)}>
              {zen ? <Minimize /> : <Maximize />}
            </button>
          </div>

          <div className="text-7xl font-mono font-bold my-6">
            {mm}:{ss}
          </div>

          <div className="flex justify-center gap-6">
            <ControlButton
              icon={running ? <Pause /> : <Play />}
              onClick={() => setRunning(!running)}
            />
            <ControlButton icon={<RotateCcw />} onClick={reset} />
          </div>

          <p className="mt-8 italic text-slate-600 text-lg">
            “{quote}”
          </p>
        </div>

        {/* SIDE */}
        <div className="space-y-6">

          {/* ANALYTICS */}
          <Card title="Focus Analytics" icon={<Brain />}>
            <p className="text-sm text-slate-600">Sessions today</p>
            <p className="text-3xl font-bold text-indigo-600">
              {todaySessions}
            </p>
          </Card>

          {/* BREAK */}
          <Card title="Break Tips" icon={<Coffee />}>
            <ul className="text-sm text-slate-600 space-y-1">
              <li>• Stretch your body</li>
              <li>• Drink water</li>
              <li>• Rest your eyes</li>
            </ul>
          </Card>

          {/* AUDIO */}
          <Card title="Focus Audio" icon={<Music />}>
            <select
              value={sound.name}
              onChange={(e) =>
                setSound(playlist.find((s) => s.name === e.target.value)!)
              }
              className="w-full border rounded-lg p-2 text-sm"
            >
              {playlist.map((s) => (
                <option key={s.name}>{s.name}</option>
              ))}
            </select>

            <audio ref={audioRef} loop>
              <source src={sound.src} />
            </audio>

            <div className="mt-4">
              <label className="text-sm">Volume</label>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="w-full"
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

/* ---------------- UI COMPONENTS ---------------- */

function ModeButton({ active, onClick, label }: any) {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-2 rounded-xl text-sm font-medium ${
        active ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600"
      }`}
    >
      {label}
    </button>
  );
}

function ControlButton({ icon, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className="w-14 h-14 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow hover:scale-105 transition"
    >
      {icon}
    </button>
  );
}

function Card({ title, icon, children }: any) {
  return (
    <div className="bg-white rounded-2xl shadow p-6">
      <h3 className="font-semibold flex items-center gap-2 mb-2">
        {icon} {title}
      </h3>
      {children}
    </div>
  );
}
