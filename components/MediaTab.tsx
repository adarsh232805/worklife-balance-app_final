"use client";

import { useState } from "react";
import { Music, Video, PlayCircle } from "lucide-react";

/* ================= MUSIC DATA ================= */

const MUSIC_CATEGORIES = [
  {
    title: "Hindi Motivation Songs",
    tracks: [
      { name: "Kar Har Maidan Fateh", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
      { name: "Zinda", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
      { name: "Apna Time Aayega", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
      { name: "Chak De India", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3" },
    ],
  },
  {
    title: "Bhojpuri Energy Songs",
    tracks: [
      { name: "Bhojpuri Power Track 1", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3" },
      { name: "Bhojpuri Power Track 2", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3" },
      { name: "Bhojpuri Power Track 3", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3" },
    ],
  },
  {
    title: "Calm / Focus / Lofi",
    tracks: [
      { name: "Lofi Focus 1", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3" },
      { name: "Lofi Focus 2", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3" },
      { name: "Lofi Focus 3", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3" },
    ],
  },
];

/* ================= VIDEO DATA ================= */

const VIDEOS = [
  { title: "Motivation Hindi", id: "wnHW6o8WMas" },
  { title: "Study Motivation", id: "ZXsQAXx_ao0" },
  { title: "Focus Music", id: "lTRiuFIWV54" },
  { title: "Success Motivation", id: "mgmVOuLgFB0" },
  { title: "Calm Mind", id: "2OEL4P1Rz04" },
  { title: "Work Focus Music", id: "jfKfPfyJRdk" },
];

/* ================= COMPONENT ================= */

export default function MediaTab() {
  const [tab, setTab] = useState<"music" | "video">("music");
  const [currentTrack, setCurrentTrack] = useState<any>(null);

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Media & Relax</h2>

        <div className="flex gap-2">
          <button
            onClick={() => setTab("music")}
            className={`px-4 py-2 rounded-xl ${tab === "music" ? "bg-indigo-600 text-white" : "bg-slate-100"}`}
          >
            <Music size={16} /> Music
          </button>
          <button
            onClick={() => setTab("video")}
            className={`px-4 py-2 rounded-xl ${tab === "video" ? "bg-indigo-600 text-white" : "bg-slate-100"}`}
          >
            <Video size={16} /> Video
          </button>
        </div>
      </div>

      {/* MUSIC TAB */}
      {tab === "music" && (
        <div className="space-y-6">
          {MUSIC_CATEGORIES.map((cat, i) => (
            <div key={i} className="bg-white rounded-3xl shadow p-6">
              <h3 className="font-semibold mb-3">{cat.title}</h3>

              <div className="space-y-2">
                {cat.tracks.map((t, j) => (
                  <button
                    key={j}
                    onClick={() => setCurrentTrack(t)}
                    className="flex items-center gap-3 w-full text-left bg-slate-100 hover:bg-slate-200 p-3 rounded-xl"
                  >
                    <PlayCircle />
                    {t.name}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {currentTrack && (
            <div className="bg-white rounded-3xl shadow p-6">
              <h4 className="font-semibold mb-2">{currentTrack.name}</h4>
              <audio src={currentTrack.url} controls autoPlay className="w-full" />
            </div>
          )}
        </div>
      )}

      {/* VIDEO TAB */}
      {tab === "video" && (
        <div className="grid md:grid-cols-3 gap-6">
          {VIDEOS.map((v, i) => (
            <div key={i} className="bg-white rounded-3xl shadow overflow-hidden">
              <iframe
                className="w-full h-48"
                src={`https://www.youtube.com/embed/${v.id}`}
                title={v.title}
                allowFullScreen
              />
              <div className="p-3 font-medium">{v.title}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
