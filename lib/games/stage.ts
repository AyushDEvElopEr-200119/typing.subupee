import { GAME_WORDS } from "@/content/words";
import type { GameSlug } from "./modes";

export const ROUND_SECONDS = 45;
export const CLEAR_GOAL = 8;

export type StageWord = {
  id: number;
  text: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  slot: number;
  ttl: number;
};

export type GameSnapshot = {
  slug: GameSlug;
  words: StageWord[];
  buffer: string;
  score: number;
  lives: number;
  elapsed: number;
  over: boolean;
  cleared: number;
  nextId: number;
  cursor: number;
  spawnIn: number;
  combo: number;
  correctKeys: number;
  errorKeys: number;
  wrong: boolean;
};

function takeText(snapshot: GameSnapshot) {
  let cursor = snapshot.cursor;
  let text = GAME_WORDS[cursor % GAME_WORDS.length];
  let guard = 0;
  while (snapshot.words.some((word) => word.text === text) && guard < GAME_WORDS.length) {
    cursor += 1;
    text = GAME_WORDS[cursor % GAME_WORDS.length];
    guard += 1;
  }
  return { text, cursor: cursor + 1 };
}

function place(snapshot: GameSnapshot, text: string, index: number): StageWord {
  const id = snapshot.nextId;
  if (snapshot.slug === "fall") {
    return { id, text, x: 16 + ((index * 26) % 62), y: 8 + index * 7, vx: 0, vy: 8, slot: 0, ttl: 12 };
  }
  if (snapshot.slug === "lift") {
    return { id, text, x: 16 + ((index * 26) % 62), y: 84 - index * 7, vx: 0, vy: -8, slot: 0, ttl: 12 };
  }
  if (snapshot.slug === "drift") {
    const lane = index % 4;
    return { id, text, x: 8 + index * 12, y: 16 + lane * 20, vx: 10, vy: 0, slot: lane, ttl: 12 };
  }
  if (snapshot.slug === "shield") {
    const angle = (index / 6) * Math.PI * 2;
    return {
      id,
      text,
      x: 50 + Math.cos(angle) * 46,
      y: 50 + Math.sin(angle) * 42,
      vx: -Math.cos(angle) * 6,
      vy: -Math.sin(angle) * 6,
      slot: 0,
      ttl: 12,
    };
  }
  if (snapshot.slug === "leap") {
    return { id, text, x: 50, y: 18 + index * 16, vx: 0, vy: 0, slot: index, ttl: 12 };
  }
  return { id, text, x: 50, y: 42, vx: 0, vy: 0, slot: 0, ttl: 12 };
}

function spawn(snapshot: GameSnapshot, index: number): GameSnapshot {
  const picked = takeText(snapshot);
  const word = place({ ...snapshot, cursor: picked.cursor }, picked.text, index);
  return {
    ...snapshot,
    cursor: picked.cursor,
    nextId: snapshot.nextId + 1,
    words: [...snapshot.words, word],
  };
}

export function createGame(slug: GameSlug): GameSnapshot {
  let snapshot: GameSnapshot = {
    slug,
    words: [],
    buffer: "",
    score: 0,
    lives: 3,
    elapsed: 0,
    over: false,
    cleared: 0,
    nextId: 1,
    cursor: 0,
    spawnIn: 2.2,
    combo: 0,
    correctKeys: 0,
    errorKeys: 0,
    wrong: false,
  };
  const initial = slug === "leap" ? 4 : slug === "toss" ? 1 : slug === "shield" ? 2 : 3;
  for (let index = 0; index < initial; index += 1) snapshot = spawn(snapshot, index);
  return snapshot;
}

export function focusedWord(snapshot: GameSnapshot) {
  if (!snapshot.words.length) return null;
  if (snapshot.slug === "leap") {
    return [...snapshot.words].sort((a, b) => b.slot - a.slot)[0];
  }
  if (snapshot.slug === "toss") return snapshot.words[0];
  if (snapshot.slug === "fall") return [...snapshot.words].sort((a, b) => b.y - a.y)[0];
  if (snapshot.slug === "lift") return [...snapshot.words].sort((a, b) => a.y - b.y)[0];
  if (snapshot.slug === "drift") return [...snapshot.words].sort((a, b) => b.x - a.x)[0];
  return [...snapshot.words].sort((a, b) => distance(a) - distance(b))[0];
}

function distance(word: StageWord) {
  return Math.hypot(word.x - 50, word.y - 50);
}

function finishIfNeeded(snapshot: GameSnapshot): GameSnapshot {
  if (snapshot.lives <= 0 || snapshot.elapsed >= ROUND_SECONDS || snapshot.cleared >= CLEAR_GOAL) {
    return { ...snapshot, over: true, buffer: "" };
  }
  return snapshot;
}

function clearWord(snapshot: GameSnapshot, id: number): GameSnapshot {
  const word = snapshot.words.find((item) => item.id === id);
  if (!word) return snapshot;
  const score = snapshot.score + Math.round(10 * word.text.length * (1 + snapshot.combo * 0.08));
  let words = snapshot.words.filter((item) => item.id !== id);
  if (snapshot.slug === "leap") {
    words = words
      .sort((a, b) => a.slot - b.slot)
      .map((item, index) => ({ ...item, slot: index, y: 18 + index * 16 }));
  }
  return finishIfNeeded({
    ...snapshot,
    words,
    buffer: "",
    score,
    combo: snapshot.combo + 1,
    cleared: snapshot.cleared + 1,
    wrong: false,
    correctKeys: snapshot.correctKeys + word.text.length,
  });
}

export function typeInto(snapshot: GameSnapshot, key: string): GameSnapshot {
  if (snapshot.over) return snapshot;
  if (key === "Backspace") return { ...snapshot, buffer: snapshot.buffer.slice(0, -1), wrong: false };
  if (key.length !== 1 || key === " ") return snapshot;
  const focus = focusedWord(snapshot);
  if (!focus) return snapshot;
  const next = snapshot.buffer + key.toLowerCase();
  if (!focus.text.startsWith(next)) {
    return { ...snapshot, wrong: true, errorKeys: snapshot.errorKeys + 1 };
  }
  if (next === focus.text) return clearWord(snapshot, focus.id);
  return { ...snapshot, buffer: next, wrong: false };
}

function endangered(snapshot: GameSnapshot, word: StageWord) {
  if (snapshot.slug === "fall") return word.y > 96;
  if (snapshot.slug === "lift") return word.y < 4;
  if (snapshot.slug === "drift") return word.x > 96;
  if (snapshot.slug === "shield") return distance(word) < 10;
  return false;
}

export function tick(snapshot: GameSnapshot, dt: number, reduced: boolean): GameSnapshot {
  if (snapshot.over) return snapshot;
  let next: GameSnapshot = { ...snapshot, elapsed: snapshot.elapsed + dt, spawnIn: snapshot.spawnIn - dt };
  if (snapshot.slug === "leap" || snapshot.slug === "toss") {
    next = { ...next, words: next.words.map((word) => ({ ...word, ttl: word.ttl })) };
  } else if (reduced) {
    next = {
      ...next,
      words: next.words.map((word) => ({ ...word, ttl: word.ttl - dt, vx: 0, vy: 0 })),
    };
  } else {
    next = {
      ...next,
      words: next.words.map((word) => ({
        ...word,
        x: word.x + word.vx * dt,
        y: word.y + word.vy * dt,
      })),
    };
  }

  const missed = next.words.filter((word) => (reduced && snapshot.slug !== "leap" && snapshot.slug !== "toss" ? word.ttl <= 0 : endangered(next, word)));
  if (missed.length) {
    const ids = new Set(missed.map((word) => word.id));
    next = {
      ...next,
      words: next.words.filter((word) => !ids.has(word.id)),
      lives: next.lives - missed.length,
      combo: 0,
      buffer: "",
    };
  }

  const moving = next.slug !== "leap" && next.slug !== "toss";
  if (moving && next.spawnIn <= 0 && next.words.length < 5) {
    next = spawn(next, next.words.length);
    next = { ...next, spawnIn: 2.8 };
  }
  if (next.slug === "leap" && next.words.length < 4 && next.cleared + next.words.length < CLEAR_GOAL + 3) {
    next = spawn(next, next.words.length);
    next = {
      ...next,
      words: next.words
        .sort((a, b) => a.slot - b.slot)
        .map((word, index) => ({ ...word, slot: index, y: 18 + index * 16 })),
    };
  }
  if (next.slug === "toss" && next.words.length === 0 && next.cleared < CLEAR_GOAL) {
    next = spawn(next, 0);
  }
  return finishIfNeeded(next);
}

export function gameAccuracy(snapshot: GameSnapshot) {
  const total = snapshot.correctKeys + snapshot.errorKeys;
  if (!total) return 0;
  return Math.round((snapshot.correctKeys / total) * 100);
}

export function gameWpm(snapshot: GameSnapshot) {
  if (snapshot.elapsed < 1) return 0;
  return Math.round(snapshot.correctKeys / 5 / (snapshot.elapsed / 60));
}
