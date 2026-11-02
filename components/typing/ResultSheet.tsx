"use client";

import Link from "next/link";
import { Sheet } from "@/components/ui/Sheet";
import { Pressable } from "@/components/ui/Pressable";
import { formatClock } from "@/lib/format";
import { ACHIEVEMENTS } from "@/lib/progress/achievements";

type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
  headline: string;
  headlineLabel: string;
  wpm: number;
  accuracy: number;
  seconds: number;
  xp: number;
  unlocked: string[];
  onAgain: () => void;
};

export function ResultSheet({
  open,
  onClose,
  title,
  headline,
  headlineLabel,
  wpm,
  accuracy,
  seconds,
  xp,
  unlocked,
  onAgain,
}: Props) {
  const names = unlocked
    .map((id) => ACHIEVEMENTS.find((item) => item.id === id)?.title)
    .filter(Boolean)
    .slice(0, 3);
  return (
    <Sheet open={open} onClose={onClose} title={title} modal placement="center">
      <p className="eyebrow">{headlineLabel}</p>
      <p className="display nums" style={{ fontSize: "clamp(3rem, 8vw, 4.5rem)" }}>
        {headline}
      </p>
      <div className="grid-3" style={{ margin: "1rem 0" }}>
        <div>
          <b className="nums">{wpm}</b>
          <div className="muted">WPM</div>
        </div>
        <div>
          <b className="nums">{accuracy}%</b>
          <div className="muted">Accuracy</div>
        </div>
        <div>
          <b className="nums">{formatClock(seconds)}</b>
          <div className="muted">Time</div>
        </div>
      </div>
      <p>{xp > 0 ? `+${xp} XP` : "Best saved. No extra XP for a repeat."}</p>
      {names.length > 0 && <p className="muted">New: {names.join(", ")}</p>}
      <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
        <Pressable tone="primary" onClick={onAgain}>
          Again
        </Pressable>
        <Link className="pressable btn btn-quiet" href="/progress">
          Progress
        </Link>
      </div>
    </Sheet>
  );
}
