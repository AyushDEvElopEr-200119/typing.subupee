"use client";

import { create } from "zustand";
import { idbGet, idbSet } from "./idb";
import { withAchievements } from "./achievements";
import { applyRecord } from "./reducer";
import { createDocument, normalize, type ProgressDocument, type ProgressSettings, type RecordInput } from "./types";

type Listener = (doc: ProgressDocument) => void;
const listeners = new Set<Listener>();

export function subscribeProgress(listener: Listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

type ProgressState = {
  doc: ProgressDocument;
  ready: boolean;
  hydrate: () => Promise<void>;
  replace: (doc: ProgressDocument, options?: { remote?: boolean }) => void;
  commit: (recipe: (doc: ProgressDocument) => ProgressDocument, options?: { remote?: boolean }) => void;
  setSettings: (partial: Partial<ProgressSettings>) => void;
  record: (input: RecordInput) => { xpGained: number; unlocked: string[] };
};

export const useProgress = create<ProgressState>((set, get) => ({
  doc: withAchievements(createDocument()),
  ready: false,
  async hydrate() {
    if (get().ready) return;
    try {
      const stored = await idbGet("doc");
      set({ doc: withAchievements(stored ? normalize(stored) : createDocument()), ready: true });
    } catch {
      set({ ready: true });
    }
  },
  replace(doc, options) {
    const next = normalize(doc);
    set({ doc: next });
    void idbSet("doc", next);
    if (options?.remote !== false) listeners.forEach((listener) => listener(next));
  },
  commit(recipe, options) {
    const next = recipe(get().doc);
    next.updatedAt = Date.now();
    set({ doc: next });
    void idbSet("doc", next);
    if (options?.remote !== false) listeners.forEach((listener) => listener(next));
  },
  setSettings(partial) {
    get().commit((doc) => ({ ...doc, settings: { ...doc.settings, ...partial } }));
  },
  record(input) {
    let summary = { xpGained: 0, unlocked: [] as string[] };
    get().commit((doc) => {
      const result = applyRecord(doc, input);
      summary = { xpGained: result.xpGained, unlocked: result.unlocked };
      return result.doc;
    });
    return summary;
  },
}));
