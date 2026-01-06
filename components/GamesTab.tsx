"use client";

import { useState } from "react";
import {
  Gamepad2,
  X,
  Brain,
  Grid3X3,
  Timer,
  Hand,
  Hash,
  Zap,          // ✅ used instead of Snake
} from "lucide-react";

/* ================= GAME LIST ================= */

const GAMES = [
  { id: "snake", title: "Snake Game", icon: <Zap />, component: SnakeGame },
  { id: "ttt", title: "Tic Tac Toe", icon: <Grid3X3 />, component: TicTacToe },
  { id: "memory", title: "Memory Match", icon: <Brain />, component: MemoryGame },
  { id: "reaction", title: "Reaction Test", icon: <Timer />, component: ReactionGame },
  { id: "rps", title: "Rock Paper Scissors", icon: <Hand />, component: RPSGame },
  { id: "guess", title: "Number Guess", icon: <Hash />, component: GuessGame },
];

export default function GamesTab() {
  const [activeGame, setActiveGame] = useState<any>(null);

  return (
    <div className="space-y-6">

      <h2 className="text-xl font-semibold flex items-center gap-2">
        <Gamepad2 /> Break Games
      </h2>

      {/* GAME GRID */}
      <div className="grid md:grid-cols-3 gap-6">
        {GAMES.map((g) => (
          <button
            key={g.id}
            onClick={() => setActiveGame(g)}
            className="bg-white rounded-3xl shadow p-6 hover:scale-[1.02] transition text-left"
          >
            <div className="text-indigo-600 mb-2">{g.icon}</div>
            <h3 className="font-semibold">{g.title}</h3>
            <p className="text-sm text-slate-500 mt-1">
              Short break stress relief game
            </p>
          </button>
        ))}
      </div>

      {/* GAME MODAL */}
      {activeGame && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-6 w-[90%] max-w-md relative">
            <button
              onClick={() => setActiveGame(null)}
              className="absolute top-4 right-4"
            >
              <X />
            </button>

            <h3 className="font-semibold mb-4">{activeGame.title}</h3>
            <activeGame.component />
          </div>
        </div>
      )}
    </div>
  );
}

/* ================= GAMES ================= */

/* 1️⃣ Snake (Simple Demo) */
function SnakeGame() {
  return (
    <p className="text-slate-500 text-sm">
      Classic Snake game can be added using Canvas.
      <br />
      (Lightweight demo placeholder for break mode)
    </p>
  );
}

/* 2️⃣ Tic Tac Toe */
function TicTacToe() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xTurn, setXTurn] = useState(true);

  function play(i: number) {
    if (board[i]) return;
    const copy = [...board];
    copy[i] = xTurn ? "X" : "O";
    setBoard(copy);
    setXTurn(!xTurn);
  }

  return (
    <div className="grid grid-cols-3 gap-2">
      {board.map((v, i) => (
        <button
          key={i}
          onClick={() => play(i)}
          className="h-16 bg-slate-100 rounded-xl text-xl font-bold"
        >
          {v}
        </button>
      ))}
    </div>
  );
}

/* 3️⃣ Memory Game */
function MemoryGame() {
  const cards = ["🍎", "🍌", "🍎", "🍌"].sort(() => Math.random() - 0.5);
  const [open, setOpen] = useState<number[]>([]);

  return (
    <div className="grid grid-cols-2 gap-2">
      {cards.map((c, i) => (
        <button
          key={i}
          onClick={() => setOpen([...open, i])}
          className="h-16 bg-slate-100 rounded-xl text-2xl"
        >
          {open.includes(i) ? c : "❓"}
        </button>
      ))}
    </div>
  );
}

/* 4️⃣ Reaction Test */
function ReactionGame() {
  const [result, setResult] = useState<number | null>(null);

  function start() {
    const start = Date.now();
    setTimeout(() => {
      setResult(Date.now() - start);
    }, Math.random() * 2000 + 1000);
  }

  return (
    <div className="space-y-3">
      <button
        onClick={start}
        className="bg-indigo-600 text-white px-4 py-2 rounded-xl"
      >
        Start Test
      </button>
      {result && <p>Your reaction time: {result} ms</p>}
    </div>
  );
}

/* 5️⃣ Rock Paper Scissors */
function RPSGame() {
  const choices = ["Rock", "Paper", "Scissors"];
  const [result, setResult] = useState("");

  function play(c: string) {
    const cpu = choices[Math.floor(Math.random() * 3)];
    setResult(`You: ${c} | CPU: ${cpu}`);
  }

  return (
    <div className="space-y-2">
      {choices.map((c) => (
        <button
          key={c}
          onClick={() => play(c)}
          className="block w-full bg-slate-100 p-2 rounded-xl"
        >
          {c}
        </button>
      ))}
      <p className="text-sm">{result}</p>
    </div>
  );
}

/* 6️⃣ Number Guess */
function GuessGame() {
  const [num] = useState(Math.floor(Math.random() * 10));
  const [msg, setMsg] = useState("");

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {[...Array(10)].map((_, i) => (
          <button
            key={i}
            onClick={() =>
              setMsg(i === num ? "Correct 🎉" : "Try again")
            }
            className="bg-slate-100 px-3 py-1 rounded-xl"
          >
            {i}
          </button>
        ))}
      </div>
      <p>{msg}</p>
    </div>
  );
}
