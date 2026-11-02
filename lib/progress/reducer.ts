import { withAchievements } from "./achievements";
import { localDay, type ProgressDocument, type RecordInput } from "./types";

export function xpFor(input: RecordInput) {
  if (input.kind === "lesson") return 40 + Math.round((input.accuracy / 100) * 20);
  if (input.kind === "test") return Math.max(10, Math.min(80, Math.round(input.wpm * 0.8 + input.accuracy * 0.15)));
  return Math.max(8, Math.min(60, Math.round((input.score ?? 0) / 8)));
}

export function applyRecord(doc: ProgressDocument, input: RecordInput, now = Date.now()) {
  const before = new Set(doc.achievements);
  const day = localDay(new Date(now));
  let xpGained = 0;
  const next: ProgressDocument = {
    ...doc,
    lessons: { ...doc.lessons },
    tests: [...doc.tests],
    games: { ...doc.games },
    secondsByDay: { ...doc.secondsByDay },
    activeDays: doc.activeDays.includes(day) ? doc.activeDays : [...doc.activeDays, day],
    totalSeconds: doc.totalSeconds + Math.max(0, input.seconds),
    totalChars: doc.totalChars + Math.max(0, input.chars),
    updatedAt: now,
  };
  next.secondsByDay[day] = (next.secondsByDay[day] ?? 0) + Math.max(0, input.seconds);

  if (input.kind === "lesson") {
    const prev = doc.lessons[input.key];
    xpGained = prev ? 0 : xpFor(input);
    if (!prev || input.wpm >= prev.wpm) {
      next.lessons[input.key] = {
        wpm: input.wpm,
        accuracy: input.accuracy,
        seconds: input.seconds,
        chars: input.chars,
        at: now,
      };
    }
  } else if (input.kind === "test") {
    xpGained = xpFor(input);
    next.tests = [
      {
        id: `test-${input.key}-${now}`,
        mode: input.key,
        wpm: input.wpm,
        accuracy: input.accuracy,
        seconds: input.seconds,
        chars: input.chars,
        xp: xpGained,
        at: now,
      },
      ...next.tests,
    ].slice(0, 200);
  } else {
    xpGained = xpFor(input);
    const prev = doc.games[input.key] ?? { best: 0, plays: 0 };
    next.games[input.key] = {
      best: Math.max(prev.best, input.score ?? 0),
      plays: prev.plays + 1,
    };
  }

  next.xp = doc.xp + xpGained;
  const stamped = withAchievements(next);
  return {
    doc: stamped,
    xpGained,
    unlocked: stamped.achievements.filter((id) => !before.has(id)),
  };
}
