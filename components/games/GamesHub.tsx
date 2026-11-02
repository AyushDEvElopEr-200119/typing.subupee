"use client";

import Link from "next/link";
import { GAME_MODES } from "@/lib/games/modes";
import { useProgress } from "@/lib/progress/store";

export function GamesHub() {
  const games = useProgress((state) => state.doc.games);
  return (
    <div>
      <div className="page-head">
        <div>
          <p className="eyebrow">Games</p>
          <h1>Play while you practice</h1>
          <p>Six ways to keep typing. Same keys, different pressure. A round ends when you clear eight words, lose three lives, or the clock hits 45 seconds.</p>
        </div>
      </div>
      <div className="game-grid">
        {GAME_MODES.map((mode) => (
          <Link key={mode.slug} href={`/games/${mode.slug}`} className="card pressable" style={{ textDecoration: "none", color: "inherit" }}>
            <h2>{mode.name}</h2>
            <p>{mode.blurb}</p>
            <p className="nums" style={{ marginTop: "0.8rem" }}>
              Best {games[mode.slug]?.best ?? 0}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
