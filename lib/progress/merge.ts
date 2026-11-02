import type { ProgressDocument } from "./types";

/** Idempotent merge: counters take the higher snapshot, lists union by identity. */
export function mergeProgress(a: ProgressDocument, b: ProgressDocument | null): ProgressDocument {
  if (!b) return a;
  const newer = a.updatedAt >= b.updatedAt ? a : b;
  const tests = new Map<string, ProgressDocument["tests"][number]>();
  for (const test of [...b.tests, ...a.tests]) tests.set(test.id, test);
  const lessons = { ...b.lessons };
  for (const [id, lesson] of Object.entries(a.lessons)) {
    const prev = lessons[id];
    if (!prev || lesson.wpm > prev.wpm || (lesson.wpm === prev.wpm && lesson.accuracy >= prev.accuracy)) {
      lessons[id] = lesson;
    }
  }
  const games = { ...b.games };
  for (const [id, game] of Object.entries(a.games)) {
    const prev = games[id];
    games[id] = prev
      ? { best: Math.max(prev.best, game.best), plays: Math.max(prev.plays, game.plays) }
      : game;
  }
  const secondsByDay = { ...b.secondsByDay };
  for (const [day, seconds] of Object.entries(a.secondsByDay)) {
    secondsByDay[day] = Math.max(secondsByDay[day] ?? 0, seconds);
  }
  return {
    ...newer,
    settings: newer.settings,
    ownerId: a.ownerId ?? b.ownerId,
    xp: Math.max(a.xp, b.xp),
    lessons,
    tests: [...tests.values()].sort((left, right) => right.at - left.at).slice(0, 200),
    games,
    totalSeconds: Math.max(a.totalSeconds, b.totalSeconds),
    totalChars: Math.max(a.totalChars, b.totalChars),
    secondsByDay,
    activeDays: [...new Set([...a.activeDays, ...b.activeDays])],
    achievements: [...new Set([...a.achievements, ...b.achievements])],
    updatedAt: Math.max(a.updatedAt, b.updatedAt),
  };
}
