import { CURRICULA, GRADES } from "@/content/curriculum/types";
import { lessons } from "@/content/curriculum";
import { GAME_MODES } from "@/lib/games/modes";
import { localDay, type ProgressDocument } from "./types";

export type AchievementCategory =
  | "avatar"
  | "speed"
  | "accuracy"
  | "tests"
  | "time"
  | "characters"
  | "games"
  | "daily"
  | "weekly"
  | "lessons";

export type Achievement = {
  id: string;
  category: AchievementCategory;
  title: string;
  detail: string;
  test: (doc: ProgressDocument) => boolean;
};

export const CATEGORIES: { id: AchievementCategory; label: string }[] = [
  { id: "avatar", label: "Avatar Levels" },
  { id: "speed", label: "Typing Speed" },
  { id: "accuracy", label: "Accuracy Stars" },
  { id: "tests", label: "Typing Tests" },
  { id: "time", label: "Time Spent Typing" },
  { id: "characters", label: "Characters Typed" },
  { id: "games", label: "Games Played" },
  { id: "daily", label: "Daily Streaks" },
  { id: "weekly", label: "Weekly Streaks" },
  { id: "lessons", label: "Lesson Badges" },
];

export const AVATAR_LEVELS = [
  { name: "Seed", xp: 0 },
  { name: "Sprout", xp: 800 },
  { name: "Sapling", xp: 2500 },
  { name: "Grove", xp: 6000 },
  { name: "Canopy", xp: 12000 },
];

export function avatarState(xp: number) {
  let index = 0;
  AVATAR_LEVELS.forEach((level, i) => {
    if (xp >= level.xp) index = i;
  });
  const current = AVATAR_LEVELS[index];
  const next = AVATAR_LEVELS[index + 1];
  return {
    index,
    name: current.name,
    into: next ? next.xp - xp : 0,
    nextName: next?.name ?? null,
  };
}

function sessions(doc: ProgressDocument) {
  const fromLessons = Object.values(doc.lessons).map((lesson) => ({
    wpm: lesson.wpm,
    accuracy: lesson.accuracy,
    chars: lesson.chars,
  }));
  const fromTests = doc.tests.map((test) => ({
    wpm: test.wpm,
    accuracy: test.accuracy,
    chars: test.chars,
  }));
  return [...fromLessons, ...fromTests];
}

export function bestWpm(doc: ProgressDocument) {
  return sessions(doc).reduce((best, session) => Math.max(best, session.wpm), 0);
}

export function bestAccuracy(doc: ProgressDocument) {
  return sessions(doc)
    .filter((session) => session.chars >= 20)
    .reduce((best, session) => Math.max(best, session.accuracy), 0);
}

export function averageWpm(doc: ProgressDocument) {
  const all = sessions(doc).filter((session) => session.chars > 0);
  if (!all.length) return null;
  return Math.round(all.reduce((sum, session) => sum + session.wpm, 0) / all.length);
}

export function averageAccuracy(doc: ProgressDocument) {
  const all = sessions(doc).filter((session) => session.chars > 0);
  if (!all.length) return null;
  return Math.round(all.reduce((sum, session) => sum + session.accuracy, 0) / all.length);
}

function parseDay(iso: string) {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, (month ?? 1) - 1, day ?? 1);
}

function dayIso(date: Date) {
  return localDay(date);
}

export function dailyStreak(days: string[], today = new Date()) {
  const set = new Set(days);
  const cursor = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  if (!set.has(dayIso(cursor))) cursor.setDate(cursor.getDate() - 1);
  let count = 0;
  while (set.has(dayIso(cursor))) {
    count += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return count;
}

function weekKey(date: Date) {
  const copy = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  copy.setDate(copy.getDate() + 3 - ((copy.getDay() + 6) % 7));
  const week1 = new Date(copy.getFullYear(), 0, 4);
  const week =
    1 +
    Math.round(
      ((copy.getTime() - week1.getTime()) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7,
    );
  return `${copy.getFullYear()}-W${String(week).padStart(2, "0")}`;
}

export function weeklyStreak(days: string[], today = new Date()) {
  const weeks = new Set(days.map((iso) => weekKey(parseDay(iso))));
  const cursor = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  if (!weeks.has(weekKey(cursor))) cursor.setDate(cursor.getDate() - 7);
  let count = 0;
  while (weeks.has(weekKey(cursor))) {
    count += 1;
    cursor.setDate(cursor.getDate() - 7);
  }
  return count;
}

function rule(
  id: string,
  category: AchievementCategory,
  title: string,
  detail: string,
  test: (doc: ProgressDocument) => boolean,
): Achievement {
  return { id, category, title, detail, test };
}

const speedMarks = [15, 20, 25, 30, 40, 50, 60, 70, 80, 90, 100, 120];
const accuracyMarks = [80, 85, 90, 94, 96, 98, 99, 100];
const testCounts = [1, 3, 5, 10, 20, 30];
const testModes = ["1-min", "3-min", "5-min", "page-1", "page-2", "page-3"];
const minuteMarks = [1, 5, 15, 30, 60, 120, 300, 600];
const charMarks = [50, 200, 500, 1000, 2500, 5000, 10000, 25000];
const streakMarks = [2, 3, 5, 7, 14, 30];
const weekMarks = [2, 4, 8, 12];
const lessonCounts = [1, 5, 10, 20, 40];

export const ACHIEVEMENTS: Achievement[] = [
  ...AVATAR_LEVELS.map((level, index) =>
    rule(
      `avatar-${index + 1}`,
      "avatar",
      level.name,
      index === 0 ? "Begin with a Seed." : `Reach ${level.xp.toLocaleString()} XP.`,
      (doc) => doc.xp >= level.xp,
    ),
  ),
  ...speedMarks.map((mark) =>
    rule(`speed-${mark}`, "speed", `${mark} WPM`, `Record ${mark} words per minute in a lesson or test.`, (doc) => bestWpm(doc) >= mark),
  ),
  ...accuracyMarks.map((mark) =>
    rule(
      `accuracy-${mark}`,
      "accuracy",
      `${mark}% accuracy`,
      `Finish a passage of at least 20 characters at ${mark}% accuracy.`,
      (doc) => bestAccuracy(doc) >= mark,
    ),
  ),
  ...testCounts.map((mark) =>
    rule(`tests-${mark}`, "tests", `${mark} test${mark === 1 ? "" : "s"}`, `Complete ${mark} timed, page, or key test${mark === 1 ? "" : "s"}.`, (doc) => doc.tests.length >= mark),
  ),
  ...testModes.map((mode) =>
    rule(`tests-mode-${mode}`, "tests", mode, `Finish a ${mode} test.`, (doc) => doc.tests.some((test) => test.mode === mode)),
  ),
  ...minuteMarks.map((mark) =>
    rule(
      `time-${mark}`,
      "time",
      `${mark} minute${mark === 1 ? "" : "s"}`,
      `Spend ${mark} minute${mark === 1 ? "" : "s"} typing.`,
      (doc) => doc.totalSeconds >= mark * 60,
    ),
  ),
  ...charMarks.map((mark) =>
    rule(
      `chars-${mark}`,
      "characters",
      `${mark.toLocaleString()} characters`,
      `Type ${mark.toLocaleString()} correct characters.`,
      (doc) => doc.totalChars >= mark,
    ),
  ),
  ...GAME_MODES.map((mode) =>
    rule(`game-play-${mode.slug}`, "games", `Play ${mode.name}`, `Finish a round of ${mode.name}.`, (doc) => (doc.games[mode.slug]?.plays ?? 0) >= 1),
  ),
  ...GAME_MODES.map((mode) =>
    rule(`game-score-${mode.slug}`, "games", `${mode.name} 100`, `Score 100 in ${mode.name}.`, (doc) => (doc.games[mode.slug]?.best ?? 0) >= 100),
  ),
  ...streakMarks.map((mark) =>
    rule(`daily-${mark}`, "daily", `${mark} day streak`, `Practice on ${mark} days in a row.`, (doc) => dailyStreak(doc.activeDays) >= mark),
  ),
  ...weekMarks.map((mark) =>
    rule(`weekly-${mark}`, "weekly", `${mark} week streak`, `Practice in ${mark} weeks in a row.`, (doc) => weeklyStreak(doc.activeDays) >= mark),
  ),
  ...lessonCounts.map((mark) =>
    rule(`lessons-${mark}`, "lessons", `${mark} lesson${mark === 1 ? "" : "s"}`, `Complete ${mark} lesson${mark === 1 ? "" : "s"}.`, (doc) => Object.keys(doc.lessons).length >= mark),
  ),
  ...GRADES.map((grade) =>
    rule(`grade-${grade.id}`, "lessons", grade.label, `Finish every English lesson in ${grade.label}.`, (doc) => {
      const set = lessons.filter((lesson) => lesson.curriculum === "en" && lesson.grade === grade.id);
      return set.length > 0 && set.every((lesson) => doc.lessons[lesson.id]);
    }),
  ),
  rule("track-es", "lessons", "Español starter", "Finish the Español starter lessons.", (doc) =>
    lessons.filter((lesson) => lesson.curriculum === "es").every((lesson) => doc.lessons[lesson.id]),
  ),
  rule("track-pt", "lessons", "Português starter", "Finish the Português starter lessons.", (doc) =>
    lessons.filter((lesson) => lesson.curriculum === "pt").every((lesson) => doc.lessons[lesson.id]),
  ),
  rule("track-hi", "lessons", "हिन्दी starter", "Finish the Hindi starter lessons.", (doc) =>
    lessons.filter((lesson) => lesson.curriculum === "hi").every((lesson) => doc.lessons[lesson.id]),
  ),
  ...CURRICULA.filter((track) => !["classic", "es", "pt", "hi"].includes(track.id)).map((track) =>
    rule(`track-${track.id}`, "lessons", `${track.label.split(" (")[0]} starter`, `Finish the ${track.label.split(" (")[1]?.replace(")", "") ?? track.label} starter lessons.`, (doc) =>
      lessons.filter((lesson) => lesson.curriculum === track.id).every((lesson) => doc.lessons[lesson.id]),
    ),
  ),
  rule("track-classic", "lessons", "Classic set", "Finish the Subupee Classic passages.", (doc) =>
    lessons.filter((lesson) => lesson.curriculum === "classic").every((lesson) => doc.lessons[lesson.id]),
  ),
];

export function evaluateAchievements(doc: ProgressDocument) {
  return ACHIEVEMENTS.filter((item) => item.test(doc)).map((item) => item.id);
}

export function withAchievements(doc: ProgressDocument): ProgressDocument {
  return { ...doc, achievements: evaluateAchievements(doc) };
}

export function categoryCounts(doc: ProgressDocument) {
  return CATEGORIES.map((category) => {
    const items = ACHIEVEMENTS.filter((item) => item.category === category.id);
    const earned = items.filter((item) => doc.achievements.includes(item.id)).length;
    return { ...category, earned, total: items.length };
  });
}
