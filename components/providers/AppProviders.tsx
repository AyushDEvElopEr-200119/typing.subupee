"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { authClient } from "@/lib/auth-client";
import { idbGet, idbSet } from "@/lib/progress/idb";
import { mergeProgress } from "@/lib/progress/merge";
import { withAchievements } from "@/lib/progress/achievements";
import { createDocument, normalize, type ProgressDocument } from "@/lib/progress/types";
import { subscribeProgress, useProgress } from "@/lib/progress/store";
import { AuthSheet } from "@/components/auth/AuthSheet";
import { CurriculumSheet } from "@/components/curriculum/CurriculumSheet";
import { ThemeSheet } from "@/components/themes/ThemeSheet";

async function push(doc: ProgressDocument) {
  const response = await fetch("/api/progress", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ document: doc }),
  });
  if (!response.ok) return null;
  const body = (await response.json()) as { document: ProgressDocument };
  return normalize(body.document);
}

export async function syncAccount(userId: string) {
  const { doc, replace } = useProgress.getState();
  if (doc.ownerId && doc.ownerId !== userId) {
    await idbSet(`doc:${doc.ownerId}`, doc);
  }
  const stash = await idbGet(`doc:${userId}`);
  const local = !doc.ownerId || doc.ownerId === userId ? doc : createDocument();
  const response = await fetch("/api/progress");
  if (response.status === 401) return;
  const remote = response.ok ? normalize(((await response.json()) as { document: ProgressDocument | null }).document) : null;
  const merged = withAchievements({
    ...mergeProgress(mergeProgress(local, stash ? normalize(stash) : null), remote),
    ownerId: userId,
  });
  const saved = (await push(merged)) ?? merged;
  replace(saved, { remote: false });
  await idbSet("doc", saved);
}

export function AppProviders({ children }: { children: React.ReactNode }) {
  const hydrate = useProgress((state) => state.hydrate);
  const ready = useProgress((state) => state.ready);
  const theme = useProgress((state) => state.doc.settings.theme);
  const session = authClient.useSession();
  const userId = session.data?.user.id;
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sentAt = useRef(0);

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  useLayoutEffect(() => {
    const root = document.documentElement;
    if (!ready) {
      delete root.dataset.theme;
      return;
    }
    root.dataset.theme = theme;
  }, [ready, theme]);

  useEffect(() => {
    if (!ready || !userId) return;
    void syncAccount(userId);
  }, [ready, userId]);

  useEffect(() => {
    return subscribeProgress((doc) => {
      if (!userId || doc.ownerId !== userId) return;
      if (timer.current) clearTimeout(timer.current);
      const stamp = doc.updatedAt;
      timer.current = setTimeout(() => {
        sentAt.current = stamp;
        void push(doc).then((saved) => {
          if (!saved) return;
          const current = useProgress.getState().doc;
          if (current.updatedAt <= sentAt.current) {
            useProgress.getState().replace(saved, { remote: false });
          }
        });
      }, 400);
    });
  }, [userId]);

  return (
    <>
      <a className="skip" href="#content">
        Skip to content
      </a>
      {children}
      <AuthSheet onAuthed={syncAccount} />
      <CurriculumSheet />
      <ThemeSheet />
    </>
  );
}
