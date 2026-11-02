"use client";

import { useLayoutEffect, useRef, useState } from "react";
import type { Passage } from "@/content/passages";

type Stamp = { id: string; index: number; at: number };
let stamp: Stamp | null = null;

export function takeNext<T>(id: string, items: T[]): T {
  const now = Date.now();
  if (stamp && stamp.id === id && now - stamp.at < 200) return items[stamp.index % items.length];
  let index = Math.floor(Math.random() * items.length);
  try {
    const key = `subupee-passage:${id}`;
    const previous = sessionStorage.getItem(key);
    if (previous !== null && previous !== "") {
      const parsed = Number(previous);
      if (Number.isInteger(parsed)) index = (parsed + 1) % items.length;
    }
    sessionStorage.setItem(key, String(index));
  } catch {
    // Private browsing can block storage. A random passage still changes the page.
  }
  stamp = { id, index, at: now };
  return items[index];
}

export function useFreshPassage(id: string | null, passages: Passage[]): Passage | null {
  const [picked, setPicked] = useState<{ id: string; passage: Passage } | null>(null);
  const passagesRef = useRef(passages);
  passagesRef.current = passages;
  const key = passages.map((item) => item.text).join("\u0001");

  useLayoutEffect(() => {
    if (!id) return;
    const items = passagesRef.current;
    if (items.length === 0) return;
    setPicked({ id, passage: takeNext(id, items) });
  }, [id, key]);

  if (!id || !picked || picked.id !== id) return null;
  return picked.passage;
}
