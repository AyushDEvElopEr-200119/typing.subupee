"use client";

import { useEffect, useState } from "react";

const LINES = [
  "the quick brown fox jumps over the lazy dog",
  "small steps on the home row make fast hands",
  "every key you learn stays with you for good",
];

const ROWS = ["qwertyuiop", "asdfghjkl;", "zxcvbnm,./"];

export function HeroDemo() {
  const [line, setLine] = useState(0);
  const [typed, setTyped] = useState(0);

  useEffect(() => {
    const text = LINES[line];
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setTyped(text.length);
      return;
    }
    const done = typed >= text.length;
    const delay = done ? 1600 : 70 + Math.random() * 90;
    const id = window.setTimeout(() => {
      if (done) {
        setLine((l) => (l + 1) % LINES.length);
        setTyped(0);
      } else {
        setTyped((t) => t + 1);
      }
    }, delay);
    return () => window.clearTimeout(id);
  }, [line, typed]);

  const text = LINES[line];
  const next = text[typed] ?? "";
  const wpm = Math.round(38 + (typed / text.length) * 14);
  const accuracy = 100;

  return (
    <div className="home-demo" aria-hidden>
      <div className="home-demo-bar">
        <span className="home-dot" />
        <span className="home-dot" />
        <span className="home-dot" />
        <span className="home-demo-title">Lesson 4 · Home row</span>
      </div>
      <p className="home-demo-text">
        <span className="ch-correct">{text.slice(0, typed)}</span>
        <span className="home-caret" />
        <span className="home-pending">{text.slice(typed)}</span>
      </p>
      <div className="home-demo-stats">
        <span><b>{wpm}</b> wpm</span>
        <span><b>{accuracy}%</b> accuracy</span>
        <span><b>{Math.round((typed / text.length) * 100)}%</b> done</span>
      </div>
      <div className="home-kb">
        {ROWS.map((row, r) => (
          <div key={row} className="home-kb-row" style={{ paddingLeft: `${r * 0.9}rem` }}>
            {row.split("").map((k) => (
              <i key={k} className={[k === next ? "hit" : "", k === "f" || k === "j" ? "bump" : ""].join(" ")}>
                {k}
              </i>
            ))}
          </div>
        ))}
        <div className="home-kb-row">
          <i className={`space ${next === " " ? "hit" : ""}`} />
        </div>
      </div>
    </div>
  );
}
