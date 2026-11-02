"use client";

import { memo, useEffect, useLayoutEffect, useMemo, useRef } from "react";
import {
  applyBackspace,
  applyKey,
  createSession,
  isComplete,
  type TypingSnapshot,
} from "@/lib/typing/engine";
import { SCRIPTS, detectScript, keyFor, keyOutput } from "@/lib/typing/layouts";
import { playTick, speak, stopSpeaking } from "@/lib/typing/sound";
import { Keyboard } from "./Keyboard";

type Props = {
  target: string;
  durationSeconds?: number;
  assist?: boolean;
  sounds: boolean;
  readAloud: boolean;
  onChange: (snapshot: TypingSnapshot) => void;
  onComplete: (snapshot: TypingSnapshot) => void;
};

function TypingCanvasInner({ target, durationSeconds, assist, sounds, readAloud, onChange, onComplete }: Props) {
  const snapshotRef = useRef(createSession(target));
  const done = useRef(false);
  const windowRef = useRef<HTMLDivElement>(null);
  const passageRef = useRef<HTMLParagraphElement>(null);
  const shiftRef = useRef(0);
  const charRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const caretRef = useRef<HTMLSpanElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const keyboardRef = useRef<HTMLDivElement>(null);
  const composing = useRef(false);
  const skip = useRef(false);
  const onChangeRef = useRef(onChange);
  const onCompleteRef = useRef(onComplete);
  const soundsRef = useRef(sounds);
  onChangeRef.current = onChange;
  onCompleteRef.current = onComplete;
  soundsRef.current = sounds;
  const script = useMemo(() => detectScript(target), [target]);
  const rtl = script ? SCRIPTS[script].rtl : false;
  // Grapheme clusters, so Devanagari conjuncts and matras render as one shaped glyph.
  const clusters = useMemo(() => {
    const out: { start: number; text: string }[] = [];
    const segmenter = new Intl.Segmenter(undefined, { granularity: "grapheme" });
    for (const part of segmenter.segment(target)) out.push({ start: part.index, text: part.segment });
    return out;
  }, [target]);
  const clusterAt = useMemo(() => {
    const map: number[] = [];
    clusters.forEach((cluster, i) => {
      for (let j = 0; j < cluster.text.length; j += 1) map[cluster.start + j] = i;
    });
    return map;
  }, [clusters]);

  function placeCaret(index: number) {
    const glyph = charRefs.current[index];
    const passage = passageRef.current;
    const caret = caretRef.current;
    if (!glyph || !passage || !caret) return;
    const parent = passage.getBoundingClientRect();
    const rect = glyph.getBoundingClientRect();
    const x = rtl && index < target.length ? rect.right : rect.left;
    caret.style.transform = `translate3d(${x - parent.left - passage.clientLeft}px, ${rect.top - parent.top - passage.clientTop}px, 0)`;
  }

  function paintRange(snapshot: TypingSnapshot, from: number, to: number) {
    const end = Math.min(target.length, Math.max(from, to));
    const start = Math.max(0, Math.min(from, to));
    for (let index = start; index <= end; index += 1) {
      const node = charRefs.current[index];
      if (!node) continue;
      const cluster = clusters[clusterAt[index]];
      const from = cluster ? cluster.start : index;
      const to = cluster ? cluster.start + cluster.text.length : index + 1;
      const typedLength = snapshot.typed.length;
      let wrong = false;
      for (let j = from; j < Math.min(to, typedLength); j += 1) if (snapshot.typed[j] !== target[j]) wrong = true;
      if (wrong) node.className = "ch-incorrect";
      else if (typedLength >= to) node.className = "ch-correct";
      else if (typedLength >= from) node.className = "ch-current";
      else node.className = "ch-pending";
    }
    const caretIndex = Math.min(snapshot.typed.length, target.length);
    placeCaret(caretIndex);
    followCaret(caretIndex);
    if (hintRef.current) hintRef.current.style.display = snapshot.typed.length > 0 ? "none" : "";
    paintKeys(snapshot);
  }

  function followCaret(index: number) {
    const frame = windowRef.current;
    const passage = passageRef.current;
    const glyph = charRefs.current[Math.min(index, Math.max(0, target.length - 1))];
    if (!frame || !passage || !glyph) return;
    const lineTop = glyph.offsetTop;
    const lineBottom = lineTop + glyph.offsetHeight;
    let shift = shiftRef.current;
    if (lineBottom > shift + frame.clientHeight + 0.5 || lineTop < shift - 0.5) shift = lineTop;
    if (shift === shiftRef.current) return;
    shiftRef.current = shift;
    passage.style.transform = `translate3d(0, ${-shift}px, 0)`;
  }

  function paintKeys(snapshot: TypingSnapshot) {
    const root = keyboardRef.current;
    if (!root) return;
    const next = target[snapshot.typed.length] ?? "";
    const mapped = script ? keyFor(script, next) : undefined;
    const wanted = mapped ? mapped.key : next.toLowerCase();
    const shift = mapped ? mapped.shift : next !== "" && next !== wanted;
    root.querySelectorAll<HTMLElement>("[data-key]").forEach((key) => {
      const name = key.dataset.key ?? "";
      key.classList.toggle("on", name === wanted || (name === "shift" && shift));
    });
  }

  function flashKey(name: string) {
    const root = keyboardRef.current;
    if (!root) return;
    root.querySelectorAll<HTMLElement>("[data-key]").forEach((key) => {
      key.classList.toggle("down", key.dataset.key === name);
    });
  }

  function finish(current: TypingSnapshot) {
    if (done.current) return;
    done.current = true;
    if (soundsRef.current) playTick("done");
    onChangeRef.current(current);
    onCompleteRef.current(current);
  }

  function publish(next: TypingSnapshot, previousLength: number) {
    snapshotRef.current = next;
    paintRange(next, previousLength, next.typed.length);
    onChangeRef.current(next);
    if (isComplete(next)) finish(next);
  }

  function commit(text: string) {
    let current = snapshotRef.current;
    const previousLength = current.typed.length;
    for (const key of text) {
      if (!key || current.typed.length >= current.target.length) break;
      const expected = current.target[current.typed.length];
      if (soundsRef.current) playTick(key === expected ? "ok" : "bad");
      current = applyKey(current, key, Date.now());
    }
    publish(current, previousLength);
  }

  useLayoutEffect(() => {
    snapshotRef.current = createSession(target);
    done.current = false;
    shiftRef.current = 0;
    const passage = passageRef.current;
    if (passage) {
      passage.style.transition = "none";
      passage.style.transform = "translate3d(0, 0, 0)";
    }
    paintRange(snapshotRef.current, 0, 0);
    inputRef.current?.focus();
    const frame = requestAnimationFrame(() => {
      if (passage) passage.style.transition = "";
    });
    return () => cancelAnimationFrame(frame);
  }, [target]);

  useEffect(() => {
    const passage = passageRef.current;
    if (!passage) return;
    const observer = new ResizeObserver(() => {
      const index = Math.min(snapshotRef.current.typed.length, target.length);
      placeCaret(index);
      followCaret(index);
    });
    observer.observe(passage);
    if (windowRef.current) observer.observe(windowRef.current);
    return () => observer.disconnect();
  }, [target]);

  useEffect(() => {
    if (!readAloud) {
      stopSpeaking();
      return;
    }
    const clip = target.length > 320 ? target.slice(0, 320).replace(/\s+\S*$/, "") : target;
    speak(clip);
    return () => stopSpeaking();
  }, [readAloud, target]);

  useEffect(() => {
    if (!durationSeconds) return;
    let timer = 0;
    const watch = window.setInterval(() => {
      const current = snapshotRef.current;
      if (!current.startedAt || done.current || timer) return;
      const remaining = durationSeconds * 1000 - (Date.now() - current.startedAt);
      timer = window.setTimeout(() => finish(snapshotRef.current), Math.max(0, remaining));
    }, 40);
    return () => {
      window.clearInterval(watch);
      if (timer) window.clearTimeout(timer);
    };
  }, [durationSeconds, target]);

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (composing.current || event.nativeEvent.isComposing || skip.current || done.current) return;
    if (event.key === "Backspace") {
      event.preventDefault();
      const previous = snapshotRef.current.typed.length;
      const next = applyBackspace(snapshotRef.current);
      flashKey("backspace");
      publish(next, previous);
      return;
    }
    if (event.metaKey || event.ctrlKey || event.altKey) return;
    if (script && /^[ -~]$/.test(event.key)) {
      const mapped = keyOutput(script, event.code, event.shiftKey);
      if (mapped) {
        event.preventDefault();
        flashKey(event.key === " " ? " " : event.key.toLowerCase());
        commit(mapped);
        return;
      }
    }
    if (event.key.length === 1) {
      event.preventDefault();
      flashKey(event.key === " " ? " " : event.key.toLowerCase());
      commit(event.key);
    }
  }

  return (
    <div onPointerDown={() => inputRef.current?.focus()}>
      <div className="start-hint" ref={hintRef}>
        Start typing
      </div>
      <div className="passage-window" ref={windowRef}>
      <p className="passage" ref={passageRef} lang={script ? SCRIPTS[script].lang : undefined} dir={rtl ? "rtl" : undefined}>
        <span className="caret" ref={caretRef} />
        {clusters.map((cluster, index) => (
          <span
            key={`${cluster.start}-${cluster.text}`}
            ref={(node) => {
              for (let j = 0; j < cluster.text.length; j += 1) charRefs.current[cluster.start + j] = node;
            }}
            className={index === 0 ? "ch-current" : "ch-pending"}
          >
            {cluster.text}
          </span>
        ))}
        <span
          ref={(node) => {
            charRefs.current[target.length] = node;
          }}
        />
      </p>
      </div>
      <input
        ref={inputRef}
        className="capture"
        aria-label="Typing input"
        autoCapitalize="off"
        autoCorrect="off"
        autoComplete="off"
        spellCheck={false}
        onKeyDown={onKeyDown}
        onKeyUp={() => flashKey("")}
        onCompositionStart={() => {
          composing.current = true;
        }}
        onCompositionEnd={(event) => {
          composing.current = false;
          skip.current = true;
          commit(event.data);
          event.currentTarget.value = "";
          requestAnimationFrame(() => {
            skip.current = false;
          });
        }}
      />
      {assist && (
        <div ref={keyboardRef}>
          <Keyboard script={script} />
        </div>
      )}
    </div>
  );
}

export const TypingCanvas = memo(TypingCanvasInner);
