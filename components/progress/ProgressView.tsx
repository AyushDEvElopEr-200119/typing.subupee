"use client";

import { useState } from "react";
import { ACHIEVEMENTS, CATEGORIES, avatarState, categoryCounts, dailyStreak, weeklyStreak, type AchievementCategory } from "@/lib/progress/achievements";
import { useProgress } from "@/lib/progress/store";
import { formatClock } from "@/lib/format";
import { localDay } from "@/lib/progress/types";
import { Pressable } from "@/components/ui/Pressable";

const goals = [5, 10, 15, 20, 30];

export function ProgressView() {
  const doc = useProgress((state) => state.doc);
  const setSettings = useProgress((state) => state.setSettings);
  const [category, setCategory] = useState<AchievementCategory | "summary">("summary");
  const counts = categoryCounts(doc);
  const avatar = avatarState(doc.xp);
  const today = doc.secondsByDay[localDay()] ?? 0;
  const items = ACHIEVEMENTS.filter((item) => item.category === category);

  return (
    <div>
      <div className="page-head">
        <div>
          <p className="eyebrow">Progress</p>
          <h1>Your progress</h1>
          <p>
            {avatar.name} · {doc.xp.toLocaleString()} xp · {dailyStreak(doc.activeDays)} day streak · {weeklyStreak(doc.activeDays)} week streak
          </p>
        </div>
      </div>
      <section className="card">
        <h2>Daily goal</h2>
        <p className="nums">
          {formatClock(today)} / {formatClock(doc.settings.dailyGoalSeconds)}
        </p>
        <div className="goal-picks">
          {goals.map((minutes) => (
            <Pressable
              key={minutes}
              size="small"
              tone={doc.settings.dailyGoalSeconds === minutes * 60 ? "primary" : "quiet"}
              onClick={() => setSettings({ dailyGoalSeconds: minutes * 60 })}
            >
              {minutes} min
            </Pressable>
          ))}
        </div>
      </section>
      <div className="progress-layout" style={{ marginTop: "1rem" }}>
        <div className="side-list">
          <Pressable tone={category === "summary" ? "primary" : "quiet"} onClick={() => setCategory("summary")}>
            Summary · {doc.achievements.length}/{ACHIEVEMENTS.length}
          </Pressable>
          {CATEGORIES.map((item) => {
            const count = counts.find((entry) => entry.id === item.id);
            return (
              <Pressable key={item.id} tone={category === item.id ? "primary" : "quiet"} onClick={() => setCategory(item.id)}>
                {item.label} · {count?.earned}/{count?.total}
              </Pressable>
            );
          })}
        </div>
        {category === "summary" ? (
          <div className="achieve-grid">
            {counts.map((item) => (
              <button key={item.id} className="card pressable" onClick={() => setCategory(item.id)} style={{ textAlign: "left" }}>
                <h2>{item.label}</h2>
                <p className="nums">
                  {item.earned} / {item.total} earned
                </p>
              </button>
            ))}
          </div>
        ) : (
          <div className="stack">
            <Pressable size="small" tone="quiet" onClick={() => setCategory("summary")}>
              All categories
            </Pressable>
            {items.map((item) => {
              const earned = doc.achievements.includes(item.id);
              return (
                <div key={item.id} className="lesson-row" style={{ cursor: "default" }}>
                  <span>
                    {item.title}
                    <small>{item.detail}</small>
                  </span>
                  <span className={earned ? "" : "muted"}>{earned ? "Earned" : "Locked"}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
