"use client";

import { useState, useEffect, useRef } from "react";
import {
  Gamepad2,
  X,
  Brain,
  Grid3X3,
  Timer,
  Hand,
  Hash,
  Zap,
  Trophy,
  RotateCcw,
  Play
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import DailySpin from "./games/DailySpin";
import LeaderboardWidget from "./games/LeaderboardWidget";

/* ================= HELPER ================= */
async function saveGameSession(gameId: string, score: number, duration: number = 0) {
  try {
    await fetch('/api/games/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ gameId, score, duration }),
    });
  } catch (error) {
    console.error("Failed to save game session", error);
  }
}

/* ================= GAME LIST ================= */

const GAMES = [
  {
    id: "snake",
    title: "Neon Snake",
    icon: <Zap size={24} />,
    color: "from-violet-500 to-purple-600",
    description: "Classic snake with a neon twist",
    component: SnakeGame
  },
  {
    id: "ttt",
    title: "Tic Tac Toe",
    icon: <Grid3X3 size={24} />,
    color: "from-blue-500 to-cyan-500",
    description: "Challenge your logic",
    component: TicTacToe
  },
  {
    id: "memory",
    title: "Memory Match",
    icon: <Brain size={24} />,
    color: "from-emerald-500 to-green-500",
    description: "Test your brain power",
    component: MemoryGame
  },
  {
    id: "reaction",
    title: "Reaction Test",
    icon: <Timer size={24} />,
    color: "from-orange-500 to-red-500",
    description: "How fast are you?",
    component: ReactionGame
  },
  {
    id: "rps",
    title: "Rock Paper Scissors",
    icon: <Hand size={24} />,
    color: "from-pink-500 to-rose-500",
    description: "Classic quick battle",
    component: RPSGame
  },
  {
    id: "guess",
    title: "Number Guess",
    icon: <Hash size={24} />,
    color: "from-amber-400 to-orange-500",
    description: "Guess the lucky number",
    component: GuessGame
  },
];

export default function GamesTab() {
  const [activeGame, setActiveGame] = useState<any>(null);

  /* STATS MODAL STATE */
  const [showStats, setShowStats] = useState(false);

  return (
    <div className="space-y-8 p-4 pb-8">
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="p-3 bg-violet-100 rounded-2xl text-violet-600">
            <Gamepad2 size={32} />
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Arcade Zone</h2>
            <p className="text-slate-500 font-medium">Recharge your mind & earn XP</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <DailySpin />
          <button
            onClick={() => setShowStats(true)}
            className="flex items-center gap-2 bg-white px-4 py-3 rounded-2xl text-slate-600 font-bold shadow-sm hover:shadow-md hover:text-indigo-600 transition-all border border-slate-100"
          >
            <Trophy size={18} />
            <span className="hidden sm:inline">My Stats</span>
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* LEFT: GAMES GRID */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Zap className="text-amber-500" size={20} fill="currentColor" />
            Quick Play
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {GAMES.map((g, i) => (
              <motion.button
                key={g.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveGame(g)}
                className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all p-6 text-left border border-slate-100 group relative overflow-hidden h-full flex flex-col justify-between"
              >
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${g.color} opacity-10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:opacity-20 transition-opacity`} />

                <div>
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${g.color} text-white flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    {g.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-1Group-hover:text-indigo-600 transition-colors">{g.title}</h3>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed">{g.description}</p>
                </div>

                <div className="mt-6 flex items-center text-xs font-bold text-slate-400 uppercase tracking-wider group-hover:text-indigo-500 transition-colors">
                  Play Now <Play size={10} className="ml-1 fill-current" />
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* RIGHT: LEADERBOARD */}
        <div className="lg:col-span-1 space-y-6">
          <LeaderboardWidget />
        </div>
      </div>

      {/* GAME MODAL */}
      <AnimatePresence>
        {activeGame && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-[2rem] p-6 w-full max-w-lg relative shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setActiveGame(null)}
                className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors font-bold text-slate-500 z-10"
              >
                <X size={20} />
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${activeGame.color} text-white flex items-center justify-center shadow-md`}>
                  {activeGame.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-800">{activeGame.title}</h3>
              </div>

              <div className="min-h-[300px] flex items-center justify-center">
                <activeGame.component />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* STATS MODAL */}
      <AnimatePresence>
        {showStats && <StatsModal onClose={() => setShowStats(false)} />}
      </AnimatePresence>
    </div>
  );
}

/* STATS MODAL COMPONENT */
function StatsModal({ onClose }: { onClose: () => void }) {
  const [data, setData] = useState<{ recent: any[], stats: any[] } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/games/stats')
      .then(res => res.json())
      .then(d => {
        setData(d);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-white rounded-[2rem] p-8 w-full max-w-2xl relative shadow-2xl max-h-[85vh] overflow-y-auto"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors font-bold text-slate-500"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <Trophy className="text-yellow-500" />
          Your Game Stats
        </h2>

        {loading ? (
          <div className="flex justify-center p-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : !data ? (
          <p className="text-center text-slate-500">Failed to load stats.</p>
        ) : (
          <div className="space-y-8">
            {/* HIGH SCORES */}
            <div>
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">High Scores</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {data.stats.map((stat: any) => {
                  const game = GAMES.find(g => g.id === stat._id);
                  return (
                    <div key={stat._id} className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <div className="flex items-center gap-2 mb-2 text-slate-600 font-bold">
                        {game?.icon} <span className="text-sm truncate">{game?.title || stat._id}</span>
                      </div>
                      <div className="text-2xl font-black text-slate-800">
                        {stat.bestScore}
                      </div>
                      <div className="text-xs text-slate-400 mt-1">
                        Played {stat.totalPlayed} times
                      </div>
                    </div>
                  )
                })}
                {data.stats.length === 0 && (
                  <p className="col-span-full text-slate-400 text-sm">No games played yet. Go have some fun!</p>
                )}
              </div>
            </div>

            {/* RECENT GAMES */}
            <div>
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Recent Matches</h3>
              <div className="space-y-2">
                {data.recent.map((session: any) => {
                  const game = GAMES.find(g => g.id === session.gameId);
                  return (
                    <div key={session._id} className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-xl hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg bg-slate-100 text-slate-600`}>
                          {game?.icon || <Gamepad2 size={16} />}
                        </div>
                        <div>
                          <p className="font-bold text-slate-700">{game?.title || session.gameId}</p>
                          <p className="text-xs text-slate-400">{new Date(session.playedAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-indigo-600">{session.score} pts</p>
                        {session.duration > 0 && <p className="text-xs text-slate-400">{session.duration}s</p>}
                      </div>
                    </div>
                  )
                })}
                {data.recent.length === 0 && (
                  <div className="text-center p-4 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    <p className="text-slate-400 text-sm">No recent history.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

/* ================= GAMES ================= */

/* 1️⃣ Snake Game */
function SnakeGame() {
  const size = 15;
  const initialSnake = [[7, 7], [7, 6], [7, 5]];
  const [snake, setSnake] = useState(initialSnake);
  const [food, setFood] = useState([3, 10]);
  const [dir, setDir] = useState([0, 1]); // Right
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [startTime, setStartTime] = useState<number>(0);
  const gameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isPlaying || gameOver) return;

    const handleKey = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowUp": if (dir[0] !== 1) setDir([-1, 0]); break;
        case "ArrowDown": if (dir[0] !== -1) setDir([1, 0]); break;
        case "ArrowLeft": if (dir[1] !== 1) setDir([0, -1]); break;
        case "ArrowRight": if (dir[1] !== -1) setDir([0, 1]); break;
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [dir, isPlaying, gameOver]);

  useEffect(() => {
    if (!isPlaying || gameOver) return;

    const interval = setInterval(() => {
      setSnake((prev) => {
        const head = [prev[0][0] + dir[0], prev[0][1] + dir[1]];

        // Collision with walls
        if (head[0] < 0 || head[0] >= size || head[1] < 0 || head[1] >= size) {
          endGame();
          return prev;
        }

        // Collision with self
        if (prev.some(s => s[0] === head[0] && s[1] === head[1])) {
          endGame();
          return prev;
        }

        const newSnake = [head, ...prev];
        if (head[0] === food[0] && head[1] === food[1]) {
          setScore(s => s + 10);
          // New food that isn't on snake
          let newFood;
          do {
            newFood = [Math.floor(Math.random() * size), Math.floor(Math.random() * size)];
          } while (newSnake.some(s => s[0] === newFood[0] && s[1] === newFood[1]));
          setFood(newFood);
        } else {
          newSnake.pop();
        }
        return newSnake;
      });
    }, 150);
    return () => clearInterval(interval);
  }, [dir, food, isPlaying, gameOver]);

  const endGame = () => {
    setGameOver(true);
    const duration = Math.floor((Date.now() - startTime) / 1000);
    saveGameSession("snake", score, duration);
  };

  const startGame = () => {
    setSnake(initialSnake);
    setScore(0);
    setGameOver(false);
    setIsPlaying(true);
    setDir([0, 1]);
    setStartTime(Date.now());
    if (gameRef.current) gameRef.current.focus();
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full" ref={gameRef} tabIndex={0}>
      <div className="flex justify-between w-full px-4 items-center">
        <div className="bg-purple-100 text-purple-700 px-3 py-1 rounded-lg font-bold">
          Score: {score}
        </div>
        {!isPlaying || gameOver ? (
          <button
            onClick={startGame}
            className="bg-purple-600 text-white px-4 py-1 rounded-lg flex items-center gap-2 hover:bg-purple-700 transition"
          >
            {gameOver ? <RotateCcw size={16} /> : <Play size={16} />}
            {gameOver ? "Retry" : "Start"}
          </button>
        ) : (
          <div className="text-slate-400 text-xs">Use Arrow Keys</div>
        )}
      </div>

      <div className="relative bg-slate-900 rounded-xl p-2 border-4 border-slate-700 shadow-inner">
        <div
          className="grid gap-[2px]"
          style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` }}
        >
          {[...Array(size * size)].map((_, i) => {
            const r = Math.floor(i / size);
            const c = i % size;
            const isHead = snake[0][0] === r && snake[0][1] === c;
            const isSnake = snake.some(s => s[0] === r && s[1] === c);
            const isFood = food[0] === r && food[1] === c;

            return (
              <div
                key={i}
                className={`w-5 h-5 md:w-6 md:h-6 rounded-sm transition-all duration-100 ${isHead ? "bg-white z-10" :
                  isSnake ? "bg-purple-500" :
                    isFood ? "bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.8)] animate-pulse" :
                      "bg-slate-800/50"
                  }`}
              />
            );
          })}
        </div>
        {gameOver && (
          <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-white rounded-lg backdrop-blur-sm">
            <Trophy size={48} className="text-yellow-400 mb-2" />
            <h3 className="text-2xl font-bold">Game Over!</h3>
            <p className="mb-4">Score: {score}</p>
            <button
              onClick={startGame}
              className="bg-white text-black px-6 py-2 rounded-full font-bold hover:scale-105 transition"
            >
              Play Again
            </button>
          </div>
        )}
      </div>

      {/* Mobile Controls */}
      <div className="md:hidden grid grid-cols-3 gap-2 mt-4">
        <div />
        <button className="bg-slate-200 p-3 rounded-xl active:bg-slate-300" onClick={() => setDir([-1, 0])}>⬆️</button>
        <div />
        <button className="bg-slate-200 p-3 rounded-xl active:bg-slate-300" onClick={() => setDir([0, -1])}>⬅️</button>
        <button className="bg-slate-200 p-3 rounded-xl active:bg-slate-300" onClick={() => setDir([1, 0])}>⬇️</button>
        <button className="bg-slate-200 p-3 rounded-xl active:bg-slate-300" onClick={() => setDir([0, 1])}>➡️</button>
      </div>
    </div>
  );
}

/* 2️⃣ Tic Tac Toe */
function TicTacToe() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xTurn, setXTurn] = useState(true);
  const [winner, setWinner] = useState<string | null>(null);

  const checkWinner = (squares: any[]) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  function play(i: number) {
    if (board[i] || winner) return;
    const copy = [...board];
    copy[i] = xTurn ? "X" : "O";
    setBoard(copy);
    const win = checkWinner(copy);
    if (win) {
      setWinner(win);
      saveGameSession("ttt", 100); // 100 points for win
    } else if (!copy.includes(null)) {
      setWinner("Draw");
      saveGameSession("ttt", 50); // 50 points for draw
    } else {
      setXTurn(!xTurn);
    }
  }

  const reset = () => {
    setBoard(Array(9).fill(null));
    setWinner(null);
    setXTurn(true);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex items-center gap-4 bg-slate-50 px-4 py-2 rounded-full border border-slate-200">
        <span className={`font-bold ${xTurn ? "text-blue-500" : "text-slate-400"}`}>X's Turn</span>
        <div className="h-4 w-[1px] bg-slate-300" />
        <span className={`font-bold ${!xTurn ? "text-cyan-500" : "text-slate-400"}`}>O's Turn</span>
      </div>

      <div className="grid grid-cols-3 gap-3 bg-slate-200 p-3 rounded-2xl">
        {board.map((v, i) => (
          <button
            key={i}
            onClick={() => play(i)}
            disabled={!!v || !!winner}
            className={`w-20 h-20 bg-white rounded-xl text-4xl font-black flex items-center justify-center shadow-sm transition-all
                            ${!v && !winner ? "hover:bg-blue-50" : ""}
                            ${v === "X" ? "text-blue-500" : "text-cyan-500"}
                        `}
          >
            {v && (
              <motion.span
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              >
                {v}
              </motion.span>
            )}
          </button>
        ))}
      </div>

      <AnimatePresence>
        {winner && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-2"
          >
            <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600">
              {winner === "Draw" ? "It's a Draw!" : `${winner} Wins! 🎉`}
            </h3>
            <button
              onClick={reset}
              className="bg-slate-900 text-white px-6 py-2 rounded-full font-medium hover:bg-slate-800 transition shadow-lg"
            >
              Play Again
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* 3️⃣ Memory Game */
function MemoryGame() {
  const emojis = ["🍎", "🍌", "🍇", "🍓", "🥝", "🍒", "🍍", "🥥"];
  const [cards, setCards] = useState<any[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);

  useEffect(() => {
    shuffleCards();
  }, []);

  const shuffleCards = () => {
    const shuffled = [...emojis, ...emojis]
      .sort(() => Math.random() - 0.5)
      .map((emoji, id) => ({ id, emoji }));
    setCards(shuffled);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
  };

  const handleFlip = (index: number) => {
    if (flipped.length === 2 || flipped.includes(index) || matched.includes(index)) return;

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      if (cards[newFlipped[0]].emoji === cards[newFlipped[1]].emoji) {
        const newMatched = [...matched, ...newFlipped];
        setMatched(newMatched);
        setFlipped([]);

        if (newMatched.length === cards.length) {
          saveGameSession("memory", moves); // Save moves (lower is better, handled by backend or analytics later)
        }
      } else {
        setTimeout(() => setFlipped([]), 1000);
      }
    }
  };

  const isWon = matched.length === cards.length && cards.length > 0;

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex justify-between w-full max-w-sm px-2">
        <span className="font-bold text-slate-600">Moves: {moves}</span>
        <button onClick={shuffleCards} className="text-blue-500 font-bold hover:underline">Restart</button>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {cards.map((card, i) => (
          <motion.div
            key={i}
            className="relative w-16 h-16 md:w-20 md:h-20 cursor-pointer perspective-1000"
            onClick={() => handleFlip(i)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              className={`w-full h-full absolute rounded-xl shadow-md flex items-center justify-center text-3xl select-none backface-hidden transition-all duration-500 transform
                                ${flipped.includes(i) || matched.includes(i) ? "rotate-y-180 bg-white border-2 border-green-100" : "bg-gradient-to-br from-green-400 to-emerald-600"}
                            `}
              style={{
                backfaceVisibility: "hidden",
                transformStyle: "preserve-3d",
                transform: flipped.includes(i) || matched.includes(i) ? "rotateY(180deg)" : "rotateY(0deg)"
              }}
            >
              {/* FRONT (Hidden) */}
              <div className="absolute inset-0 flex items-center justify-center backface-hidden" style={{ transform: "rotateY(180deg)" }}>
                {card.emoji}
              </div>

              {/* BACK (Visible) */}
              <div className="absolute inset-0 flex items-center justify-center backface-hidden">
                <Brain className="text-white/50" />
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>

      {isWon && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute inset-0 bg-white/90 backdrop-blur flex flex-col items-center justify-center z-10 rounded-[2rem]"
        >
          <Trophy className="text-yellow-500 w-16 h-16 mb-4" />
          <h3 className="text-2xl font-bold text-slate-800">Excellent Memory!</h3>
          <p className="text-slate-500 mb-6">You finished in {moves} moves.</p>
          <button
            onClick={shuffleCards}
            className="bg-green-500 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-green-600 transition"
          >
            Play Again
          </button>
        </motion.div>
      )}
    </div>
  );
}

/* 4️⃣ Reaction Test */
function ReactionGame() {
  const [state, setState] = useState<"idle" | "waiting" | "ready" | "early">("idle");
  const [startTime, setStartTime] = useState(0);
  const [result, setResult] = useState<number | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const startTest = () => {
    setState("waiting");
    setResult(null);
    const randomTime = Math.random() * 2000 + 1500; // 1.5 - 3.5s
    timeoutRef.current = setTimeout(() => {
      setState("ready");
      setStartTime(Date.now());
    }, randomTime);
  };

  const handleClick = () => {
    if (state === "waiting") {
      setState("early");
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    } else if (state === "ready") {
      const time = Date.now() - startTime;
      setResult(time);
      setState("idle");
      saveGameSession("reaction", time);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto text-center">
      <div
        onMouseDown={handleClick}
        className={`w-full h-64 rounded-3xl flex flex-col items-center justify-center cursor-pointer transition-all duration-300 shadow-inner select-none
                    ${state === "idle" ? "bg-slate-100 text-slate-800 hover:bg-slate-200" : ""}
                    ${state === "waiting" ? "bg-red-500 text-white" : ""}
                    ${state === "ready" ? "bg-green-500 text-white" : ""}
                    ${state === "early" ? "bg-orange-500 text-white" : ""}
                `}
      >
        {state === "idle" && (
          <>
            <Zap size={48} className="mb-4 text-orange-500" />
            <h3 className="text-2xl font-bold mb-2">Reaction Test</h3>
            {result ? (
              <p className="mt-4 text-3xl font-black text-indigo-600">{result} ms</p>
            ) : (
              <p className="opacity-70">Click to start</p>
            )}
            {/* Only verify clicks outside of box for start? No, design implies box click */}
            {/* But the box onClick handles only checks. We need a start button or box click to start. */}
            {/* Let's make the box click start it if idle */}
            {!result && (
              <button onClick={(e) => { e.stopPropagation(); startTest(); }} className="mt-4 px-4 py-2 bg-white text-slate-800 rounded-full font-bold shadow-sm">
                Start
              </button>
            )}
            {result && (
              <button onClick={(e) => { e.stopPropagation(); startTest(); }} className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-full font-bold shadow-md">
                Try Again
              </button>
            )}
          </>
        )}
        {state === "waiting" && (
          <>
            <h3 className="text-3xl font-bold">Wait for Green...</h3>
          </>
        )}
        {state === "ready" && (
          <>
            <h3 className="text-4xl font-black">CLICK!</h3>
          </>
        )}
        {state === "early" && (
          <>
            <h3 className="text-2xl font-bold mb-2">Too Early!</h3>
            <button onClick={(e) => { e.stopPropagation(); startTest(); }} className="mt-2 px-4 py-2 bg-white text-orange-500 rounded-full font-bold">Try Again</button>
          </>
        )}
      </div>
    </div>
  );
}

/* 5️⃣ Rock Paper Scissors */
function RPSGame() {
  const choices = [
    { id: "Rock", icon: "🗿" },
    { id: "Paper", icon: "📄" },
    { id: "Scissors", icon: "✂️" }
  ];
  const [result, setResult] = useState<{ user: string, cpu: string, outcome: string } | null>(null);
  const [thinking, setThinking] = useState(false);

  function play(choice: string) {
    setThinking(true);
    setResult(null);
    setTimeout(() => {
      const cpu = choices[Math.floor(Math.random() * 3)].id;
      let outcome = "";
      let score = 0;
      if (choice === cpu) {
        outcome = "Draw";
        score = 10;
      }
      else if (
        (choice === "Rock" && cpu === "Scissors") ||
        (choice === "Paper" && cpu === "Rock") ||
        (choice === "Scissors" && cpu === "Paper")
      ) {
        outcome = "You Win! 🎉";
        score = 50;
      }
      else {
        outcome = "CPU Wins 🤖";
        score = 0;
      }

      setResult({ user: choice, cpu, outcome });
      setThinking(false);
      saveGameSession("rps", score);
    }, 600);
  }

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-sm">
      <div className="flex justify-center gap-4 w-full">
        {choices.map((c) => (
          <button
            key={c.id}
            onClick={() => play(c.id)}
            disabled={thinking}
            className="flex-1 aspect-square bg-slate-50 rounded-2xl flex flex-col items-center justify-center gap-2 hover:bg-white hover:shadow-lg hover:-translate-y-1 transition-all border border-slate-200"
          >
            <span className="text-3xl">{c.icon}</span>
            <span className="text-xs font-bold text-slate-600">{c.id}</span>
          </button>
        ))}
      </div>

      <div className="w-full bg-slate-100 rounded-2xl p-6 text-center min-h-[120px] flex flex-col items-center justify-center">
        {thinking ? (
          <div className="animate-bounce text-2xl">🤔 Thinking...</div>
        ) : result ? (
          <>
            <div className="flex items-center gap-4 text-4xl mb-3">
              <span>{choices.find(c => c.id === result.user)?.icon}</span>
              <span className="text-sm text-slate-400">VS</span>
              <span>{choices.find(c => c.id === result.cpu)?.icon}</span>
            </div>
            <h3 className={`text-xl font-bold ${result.outcome.includes("Win") ? "text-green-600" :
              result.outcome.includes("Draw") ? "text-slate-600" : "text-red-500"
              }`}>
              {result.outcome}
            </h3>
          </>
        ) : (
          <p className="text-slate-400">Choose your weapon!</p>
        )}
      </div>
    </div>
  );
}

/* 6️⃣ Number Guess */
function GuessGame() {
  const [target, setTarget] = useState(Math.floor(Math.random() * 20) + 1);
  const [message, setMessage] = useState("Pick a number between 1 and 20");
  const [attempts, setAttempts] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const handleGuess = (num: number) => {
    if (gameOver) return;
    setAttempts(a => a + 1);

    if (num === target) {
      setMessage("🎉 Correct! You found it!");
      setGameOver(true);
      const score = Math.max(0, 100 - (attempts * 10)); // Simple score calc
      saveGameSession("guess", score);
    } else if (num < target) {
      setMessage("📉 Too Low!");
    } else {
      setMessage("📈 Too High!");
    }
  };

  const restart = () => {
    setTarget(Math.floor(Math.random() * 20) + 1);
    setMessage("Pick a number between 1 and 20");
    setAttempts(0);
    setGameOver(false);
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <div className="text-center">
        <h3 className={`text-xl font-bold mb-1 transition-colors ${message.includes("Correct") ? "text-green-600" :
          message.includes("Too") ? "text-orange-500" : "text-slate-700"
          }`}>
          {message}
        </h3>
        <p className="text-sm text-slate-400">Attempts: {attempts}</p>
      </div>

      <div className="flex flex-wrap justify-center gap-2 max-w-sm">
        {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
          <button
            key={num}
            onClick={() => handleGuess(num)}
            disabled={gameOver}
            className="w-10 h-10 rounded-full bg-slate-50 hover:bg-indigo-100 hover:text-indigo-600 font-medium text-slate-600 transition-all border border-slate-200"
          >
            {num}
          </button>
        ))}
      </div>

      {gameOver && (
        <button
          onClick={restart}
          className="bg-indigo-600 text-white px-6 py-2 rounded-full font-bold shadow-lg hover:bg-indigo-700 transition"
        >
          Play Again
        </button>
      )}
    </div>
  );
}
