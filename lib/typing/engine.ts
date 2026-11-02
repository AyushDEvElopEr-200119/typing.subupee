export type TypingSnapshot = {
  target: string;
  typed: string;
  startedAt: number | null;
  correctKeys: number;
  errorKeys: number;
};

export function createSession(target: string): TypingSnapshot {
  return {
    target,
    typed: "",
    startedAt: null,
    correctKeys: 0,
    errorKeys: 0,
  };
}

export function applyKey(state: TypingSnapshot, key: string, now: number): TypingSnapshot {
  if (state.typed.length >= state.target.length) return state;
  const expected = state.target[state.typed.length];
  const startedAt = state.startedAt ?? now;
  if (key === expected) {
    return {
      ...state,
      typed: state.typed + key,
      startedAt,
      correctKeys: state.correctKeys + 1,
    };
  }
  return {
    ...state,
    typed: state.typed + key,
    startedAt,
    errorKeys: state.errorKeys + 1,
  };
}

export function applyBackspace(state: TypingSnapshot): TypingSnapshot {
  if (!state.typed) return state;
  return { ...state, typed: state.typed.slice(0, -1) };
}

export function correctCount(state: TypingSnapshot) {
  let count = 0;
  for (let i = 0; i < state.typed.length; i += 1) {
    if (state.typed[i] === state.target[i]) count += 1;
  }
  return count;
}

export function incorrectCount(state: TypingSnapshot) {
  return state.typed.length - correctCount(state);
}

export function isComplete(state: TypingSnapshot) {
  return state.target.length > 0 && state.typed.length >= state.target.length;
}

export function liveWpm(state: TypingSnapshot, now: number) {
  if (!state.startedAt) return 0;
  const elapsed = now - state.startedAt;
  if (elapsed < 1000) return 0;
  const minutes = elapsed / 60000;
  return Math.round(correctCount(state) / 5 / minutes);
}

export function liveAccuracy(state: TypingSnapshot) {
  const total = state.correctKeys + state.errorKeys;
  if (total === 0) return null;
  return Math.round((state.correctKeys / total) * 100);
}

export function elapsedSeconds(state: TypingSnapshot, now: number) {
  if (!state.startedAt) return 0;
  return Math.max(0, Math.round((now - state.startedAt) / 1000));
}
