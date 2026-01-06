"use client";
import { useEffect, useState } from "react";

const size = 10;

export default function SnakeGame() {
  const [snake, setSnake] = useState([[5, 5]]);
  const [food, setFood] = useState([2, 2]);
  const [dir, setDir] = useState([0, 1]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp") setDir([-1, 0]);
      if (e.key === "ArrowDown") setDir([1, 0]);
      if (e.key === "ArrowLeft") setDir([0, -1]);
      if (e.key === "ArrowRight") setDir([0, 1]);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setSnake((prev) => {
        const head = [
          prev[0][0] + dir[0],
          prev[0][1] + dir[1],
        ];
        if (
          head[0] < 0 ||
          head[1] < 0 ||
          head[0] >= size ||
          head[1] >= size
        )
          return [[5, 5]];

        const newSnake = [head, ...prev];
        if (head[0] === food[0] && head[1] === food[1]) {
          setFood([
            Math.floor(Math.random() * size),
            Math.floor(Math.random() * size),
          ]);
        } else {
          newSnake.pop();
        }
        return newSnake;
      });
    }, 300);
    return () => clearInterval(interval);
  }, [dir, food]);

  return (
    <div className="grid grid-cols-10 gap-1 w-fit mx-auto">
      {[...Array(size * size)].map((_, i) => {
        const r = Math.floor(i / size);
        const c = i % size;
        const isSnake = snake.some(
          (s) => s[0] === r && s[1] === c
        );
        const isFood = food[0] === r && food[1] === c;

        return (
          <div
            key={i}
            className={`w-5 h-5 ${
              isSnake
                ? "bg-indigo-600"
                : isFood
                ? "bg-green-500"
                : "bg-slate-200"
            }`}
          />
        );
      })}
    </div>
  );
}
