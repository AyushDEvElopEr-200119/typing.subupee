"use client";

import { useEffect, useRef, useState } from "react";
import { CLEAR_GOAL, createGame, focusedWord, gameAccuracy, gameWpm, tick, typeInto, type GameSnapshot } from "@/lib/games/stage";
import type { GameSlug } from "@/lib/games/modes";
import { usePrefersReducedMotion } from "@/lib/motion/use-reduced-motion";
import { useProgress } from "@/lib/progress/store";
import { ResultSheet } from "@/components/typing/ResultSheet";
import { formatClock } from "@/lib/format";

type Hud = {
  elapsed: number;
  cleared: number;
  lives: number;
  score: number;
  buffer: string;
  wrong: boolean;
  hint: boolean;
};

function hudFrom(snapshot: GameSnapshot): Hud {
  return {
    elapsed: Math.floor(snapshot.elapsed),
    cleared: snapshot.cleared,
    lives: snapshot.lives,
    score: snapshot.score,
    buffer: snapshot.buffer,
    wrong: snapshot.wrong,
    hint: snapshot.cleared === 0 && snapshot.buffer.length === 0,
  };
}

export function GameView({ slug, name }: { slug: GameSlug; name: string }) {
  const reduced = usePrefersReducedMotion();
  const theme = useProgress((state) => state.doc.settings.theme);
  const record = useProgress((state) => state.record);
  const [attempt, setAttempt] = useState(0);
  const seed = useState(() => createGame(slug))[0];
  const stateRef = useRef<GameSnapshot>(seed);
  const hudRef = useRef<Hud>(hudFrom(seed));
  const [hud, setHud] = useState<Hud>(hudRef.current);
  const [result, setResult] = useState<{ score: number; wpm: number; accuracy: number; seconds: number; xp: number; unlocked: string[] } | null>(null);
  const reducedRef = useRef(reduced);
  const ended = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const wordEls = useRef(new Map<number, HTMLSpanElement>());
  reducedRef.current = reduced;

  function draw(snapshot: GameSnapshot) {
    const stage = stageRef.current;
    if (!stage) return;
    const focus = focusedWord(snapshot);
    const seen = new Set<number>();
    for (const word of snapshot.words) {
      seen.add(word.id);
      let element = wordEls.current.get(word.id);
      if (!element) {
        element = document.createElement("span");
        element.className = "stage-word";
        element.textContent = word.text;
        stage.appendChild(element);
        wordEls.current.set(word.id, element);
      }
      element.classList.toggle("active", word.id === focus?.id);
      if (word.id === focus?.id) element.dataset.activeWord = word.text;
      else delete element.dataset.activeWord;
      const opacity = reducedRef.current ? Math.max(0.35, Math.min(1, word.ttl / 4)) : 1;
      element.style.transform = `translate3d(calc(${word.x}cqw - 50%), calc(${word.y}cqh - 50%), 0)`;
      element.style.opacity = String(opacity);
    }
    for (const [id, element] of wordEls.current) {
      if (!seen.has(id)) {
        element.remove();
        wordEls.current.delete(id);
      }
    }
  }

  function show(snapshot: GameSnapshot) {
    stateRef.current = snapshot;
    draw(snapshot);
    const next = hudFrom(snapshot);
    const current = hudRef.current;
    if (
      current.elapsed !== next.elapsed ||
      current.cleared !== next.cleared ||
      current.lives !== next.lives ||
      current.score !== next.score ||
      current.buffer !== next.buffer ||
      current.wrong !== next.wrong ||
      current.hint !== next.hint
    ) {
      hudRef.current = next;
      setHud(next);
    }
    if (snapshot.over) finish(snapshot);
  }

  function finish(snapshot: GameSnapshot) {
    if (ended.current) return;
    ended.current = true;
    const saved = record({
      kind: "game",
      key: slug,
      wpm: gameWpm(snapshot),
      accuracy: gameAccuracy(snapshot),
      seconds: Math.round(snapshot.elapsed),
      chars: snapshot.correctKeys,
      score: snapshot.score,
    });
    setResult({
      score: snapshot.score,
      wpm: gameWpm(snapshot),
      accuracy: gameAccuracy(snapshot),
      seconds: Math.round(snapshot.elapsed),
      xp: saved.xpGained,
      unlocked: saved.unlocked,
    });
  }

  useEffect(() => {
    ended.current = false;
    for (const element of wordEls.current.values()) element.remove();
    wordEls.current.clear();
    const fresh = createGame(slug);
    stateRef.current = fresh;
    setResult(null);
    setHud(hudFrom(fresh));
    hudRef.current = hudFrom(fresh);
    draw(fresh);
    inputRef.current?.focus();
  }, [attempt, slug]);

  useEffect(() => {
    let frame = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(0.032, (now - last) / 1000);
      last = now;
      const current = stateRef.current;
      if (!current.over && !document.hidden) show(tick(current, dt, reducedRef.current));
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, [attempt, slug]);

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.metaKey || event.ctrlKey || event.altKey) return;
    if (event.key === "Backspace" || event.key.length === 1) {
      event.preventDefault();
      show(typeInto(stateRef.current, event.key));
    }
  }

  return (
    <div onPointerDown={() => inputRef.current?.focus()}>
      <div className="hud">
        <h1>{name}</h1>
        <span className="nums">{formatClock(Math.max(0, 45 - hud.elapsed))}</span>
        <span className="nums">
          {hud.cleared}/{CLEAR_GOAL}
        </span>
        <span className="lives" aria-label={`${hud.lives} lives`}>
          {[0, 1, 2].map((life) => (
            <i key={life} className={life < hud.lives ? "on" : ""} />
          ))}
        </span>
        <b className="nums">{hud.score}</b>
      </div>
      {hud.hint && <p className="start-hint">Type the highlighted word</p>}
      <div className="stage" data-theme={theme} ref={stageRef} />
      <div className="hud" style={{ marginTop: "0.8rem" }}>
        <div className={`buffer nums ${hud.wrong ? "wrong" : ""}`} data-buffer={hud.buffer}>
          {hud.buffer || " "}
        </div>
        <button className="pressable btn btn-quiet btn-small" onClick={() => setAttempt((value) => value + 1)}>
          Redo
        </button>
      </div>
      <input ref={inputRef} className="capture" aria-label="Game typing input" autoCapitalize="off" autoCorrect="off" spellCheck={false} onKeyDown={onKeyDown} />
      <ResultSheet
        open={Boolean(result)}
        onClose={() => setResult(null)}
        title={name}
        headline={String(result?.score ?? 0)}
        headlineLabel="Score"
        wpm={result?.wpm ?? 0}
        accuracy={result?.accuracy ?? 0}
        seconds={result?.seconds ?? 0}
        xp={result?.xp ?? 0}
        unlocked={result?.unlocked ?? []}
        onAgain={() => setAttempt((value) => value + 1)}
      />
    </div>
  );
}
