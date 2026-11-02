import type { CurriculumId, GradeId } from "@/content/curriculum/types";

export type { CurriculumId, GradeId };
export type ThemeId = "classic" | "ink" | "dusk" | "grove" | "studio" | "night";

export type LessonRecord = {
  wpm: number;
  accuracy: number;
  seconds: number;
  chars: number;
  at: number;
};

export type TestResult = {
  id: string;
  mode: string;
  wpm: number;
  accuracy: number;
  seconds: number;
  chars: number;
  xp: number;
  at: number;
};

export type GameRecord = {
  best: number;
  plays: number;
};

export type ProgressSettings = {
  sounds: boolean;
  readAloud: boolean;
  theme: ThemeId;
  curriculum: CurriculumId;
  grade: GradeId;
  curriculumChosen: boolean;
  dailyGoalSeconds: number;
};

export type ProgressDocument = {
  version: 1;
  updatedAt: number;
  ownerId: string | null;
  settings: ProgressSettings;
  xp: number;
  lessons: Record<string, LessonRecord>;
  tests: TestResult[];
  games: Record<string, GameRecord>;
  totalSeconds: number;
  totalChars: number;
  secondsByDay: Record<string, number>;
  activeDays: string[];
  achievements: string[];
};

export type RecordInput = {
  kind: "lesson" | "test" | "game";
  key: string;
  wpm: number;
  accuracy: number;
  seconds: number;
  chars: number;
  score?: number;
};

export function createDocument(): ProgressDocument {
  return {
    version: 1,
    updatedAt: 0,
    ownerId: null,
    settings: {
      sounds: false,
      readAloud: false,
      theme: "classic",
      curriculum: "en",
      grade: "5",
      curriculumChosen: false,
      dailyGoalSeconds: 15 * 60,
    },
    xp: 0,
    lessons: {},
    tests: [],
    games: {},
    totalSeconds: 0,
    totalChars: 0,
    secondsByDay: {},
    activeDays: [],
    achievements: [],
  };
}

export function localDay(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function normalize(raw: unknown): ProgressDocument {
  const base = createDocument();
  if (!raw || typeof raw !== "object") return base;
  const doc = raw as Partial<ProgressDocument>;
  return {
    ...base,
    ...doc,
    version: 1,
    ownerId: typeof doc.ownerId === "string" ? doc.ownerId : null,
    updatedAt: typeof doc.updatedAt === "number" ? doc.updatedAt : 0,
    settings: { ...base.settings, ...(doc.settings ?? {}) },
    xp: typeof doc.xp === "number" ? doc.xp : 0,
    lessons: doc.lessons ?? {},
    tests: Array.isArray(doc.tests) ? doc.tests.slice(0, 200) : [],
    games: doc.games ?? {},
    totalSeconds: typeof doc.totalSeconds === "number" ? doc.totalSeconds : 0,
    totalChars: typeof doc.totalChars === "number" ? doc.totalChars : 0,
    secondsByDay: doc.secondsByDay ?? {},
    activeDays: Array.isArray(doc.activeDays) ? doc.activeDays : [],
    achievements: Array.isArray(doc.achievements) ? doc.achievements : [],
  };
}
