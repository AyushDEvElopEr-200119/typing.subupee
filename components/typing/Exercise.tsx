"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { TypingCanvas } from "./TypingCanvas";
import { ResultSheet } from "./ResultSheet";
import { correctCount, elapsedSeconds, liveAccuracy, liveWpm, type TypingSnapshot } from "@/lib/typing/engine";
import { formatClock } from "@/lib/format";
import { useProgress } from "@/lib/progress/store";
import type { RecordInput } from "@/lib/progress/types";

type Props = {
  title: string;
  caption?: string;
  target: string;
  backHref: string;
  durationSeconds?: number;
  assist?: boolean;
  record: Omit<RecordInput, "wpm" | "accuracy" | "seconds" | "chars">;
  headlineLabel?: string;
};

export function Exercise({ title, caption, target, backHref, durationSeconds, assist, record, headlineLabel = "Words per minute" }: Props) {
  const settings = useProgress((state) => state.doc.settings);
  const setSettings = useProgress((state) => state.setSettings);
  const recordResult = useProgress((state) => state.record);
  const [attempt, setAttempt] = useState(0);
  const live = useRef<TypingSnapshot | null>(null);
  const [stats, setStats] = useState({ wpm: 0, accuracy: null as number | null, seconds: 0 });
  const [result, setResult] = useState<{
    wpm: number;
    accuracy: number;
    seconds: number;
    xp: number;
    unlocked: string[];
  } | null>(null);
  const recordRef = useRef(record);
  recordRef.current = record;

  const onChange = useCallback((snapshot: TypingSnapshot) => {
    live.current = snapshot;
  }, []);

  useEffect(() => {
    live.current = null;
    setStats({ wpm: 0, accuracy: null, seconds: 0 });
  }, [attempt, target]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      const snapshot = live.current;
      if (!snapshot?.startedAt || result) return;
      const now = Date.now();
      setStats({
        wpm: liveWpm(snapshot, now),
        accuracy: liveAccuracy(snapshot),
        seconds: elapsedSeconds(snapshot, now),
      });
    }, 200);
    return () => window.clearInterval(timer);
  }, [result, attempt, target]);

  const remaining = durationSeconds ? Math.max(0, durationSeconds - stats.seconds) : null;

  const onComplete = useCallback((finalSnapshot: TypingSnapshot) => {
    const finalNow = Date.now();
    const finalWpm = liveWpm(finalSnapshot, finalNow);
    const finalAccuracy = liveAccuracy(finalSnapshot) ?? 0;
    const finalSeconds = elapsedSeconds(finalSnapshot, finalNow);
    const saved = recordResult({
      ...recordRef.current,
      wpm: finalWpm,
      accuracy: finalAccuracy,
      seconds: finalSeconds,
      chars: correctCount(finalSnapshot),
    });
    setResult({
      wpm: finalWpm,
      accuracy: finalAccuracy,
      seconds: finalSeconds,
      xp: saved.xpGained,
      unlocked: saved.unlocked,
    });
  }, [recordResult]);

  return (
    <div className="exercise">
      <div className="exercise-bar">
        <Link href={backHref} className="pressable btn btn-quiet btn-small">
          Back
        </Link>
        <h1>
          {title}
          {caption ? <small>{caption}</small> : null}
        </h1>
        <span className="metric nums">
          <b>{remaining !== null ? formatClock(remaining) : formatClock(stats.seconds)}</b>
        </span>
        <span className="metric nums">
          <b>{stats.wpm}</b> wpm
        </span>
        <span className="metric nums">
          <b>{stats.accuracy === null ? "—" : `${stats.accuracy}%`}</b>
        </span>
        <button className="pressable btn btn-quiet btn-small" onClick={() => { setResult(null); setAttempt((value) => value + 1); }}>
          Redo
        </button>
        <button
          className="pressable btn btn-quiet btn-small"
          aria-pressed={settings.sounds}
          onClick={() => setSettings({ sounds: !settings.sounds })}
        >
          Sounds {settings.sounds ? "on" : "off"}
        </button>
        <button
          className="pressable btn btn-quiet btn-small"
          aria-pressed={settings.readAloud}
          onClick={() => setSettings({ readAloud: !settings.readAloud })}
        >
          Read aloud {settings.readAloud ? "on" : "off"}
        </button>
      </div>
      <div className="canvas-card" data-theme={settings.theme}>
        <TypingCanvas
          key={attempt}
          target={target}
          durationSeconds={durationSeconds}
          assist={assist}
          sounds={settings.sounds}
          readAloud={settings.readAloud}
          onChange={onChange}
          onComplete={onComplete}
        />
      </div>
      <ResultSheet
        open={Boolean(result)}
        onClose={() => setResult(null)}
        title={title}
        headline={String(result?.wpm ?? 0)}
        headlineLabel={headlineLabel}
        wpm={result?.wpm ?? 0}
        accuracy={result?.accuracy ?? 0}
        seconds={result?.seconds ?? 0}
        xp={result?.xp ?? 0}
        unlocked={result?.unlocked ?? []}
        onAgain={() => {
          setResult(null);
          setAttempt((value) => value + 1);
        }}
      />
    </div>
  );
}
