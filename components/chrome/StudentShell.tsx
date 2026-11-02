"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Header } from "./Header";
import { SiteFooter } from "./SiteFooter";
import { avatarState, averageAccuracy, averageWpm, dailyStreak } from "@/lib/progress/achievements";
import { useProgress } from "@/lib/progress/store";
import { formatClock } from "@/lib/format";
import { localDay } from "@/lib/progress/types";

function GoalRing({ value }: { value: number }) {
  const radius = 16;
  const circ = 2 * Math.PI * radius;
  const dash = circ * Math.max(0, Math.min(1, value));
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" aria-hidden>
      <circle cx="20" cy="20" r={radius} fill="none" stroke="var(--line)" strokeWidth="3" />
      <circle
        cx="20"
        cy="20"
        r={radius}
        fill="none"
        stroke="var(--accent)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray={`${dash} ${circ}`}
        transform="rotate(-90 20 20)"
      />
    </svg>
  );
}

export function StudentShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const doc = useProgress((state) => state.doc);
  const focus = /^\/practice\/|^\/tests\/(?!$)[^/]+|^\/games\/[^/]+/.test(pathname);
  const avatar = avatarState(doc.xp);
  const speed = averageWpm(doc);
  const accuracy = averageAccuracy(doc);
  const today = doc.secondsByDay[localDay()] ?? 0;
  const goal = doc.settings.dailyGoalSeconds || 1;

  return (
    <>
      <Header />
      {!focus && (
        <div className="stats no-print">
          <Link href="/progress" className="stat" style={{ textDecoration: "none", color: "inherit" }}>
            <span className="avatar" aria-hidden>
              <i style={{ transform: `scale(${0.7 + avatar.index * 0.18})` }} />
            </span>
            <span>
              <b>
                {avatar.name} · {avatar.index + 1}/5
              </b>
              <span>{avatar.nextName ? `${avatar.into.toLocaleString()} xp to ${avatar.nextName}` : "Canopy reached"}</span>
            </span>
          </Link>
          <div className="stat">
            <span>
              <b className="nums">{speed === null ? "—" : speed}</b>
              <span>Avg. speed</span>
            </span>
          </div>
          <div className="stat">
            <span>
              <b className="nums">{accuracy === null ? "—" : `${accuracy}%`}</b>
              <span>Avg. accuracy</span>
            </span>
          </div>
          <div className="stat">
            <span>
              <b className="nums">{formatClock(doc.totalSeconds)}</b>
              <span>Typing time · {dailyStreak(doc.activeDays)} day streak</span>
            </span>
          </div>
          <Link href="/progress" className="stat" style={{ textDecoration: "none", color: "inherit" }}>
            <GoalRing value={today / goal} />
            <span>
              <b className="nums">
                {formatClock(today)} / {formatClock(goal)}
              </b>
              <span>Daily goal</span>
            </span>
          </Link>
        </div>
      )}
      <main id="content" className="page">
        {children}
      </main>
      <SiteFooter />
    </>
  );
}
