"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { animate, motion, useDragControls, useMotionValue, type PanInfo } from "motion/react";
import { project } from "@/lib/motion/gestures";
import { springCalm, springFlick } from "@/lib/motion/springs";
import { usePrefersReducedMotion } from "@/lib/motion/use-reduced-motion";

type SheetProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  modal?: boolean;
  placement?: "bottom" | "center";
  children: React.ReactNode;
};

export function Sheet({ open, onClose, title, modal = false, placement = "bottom", children }: SheetProps) {
  const reduced = usePrefersReducedMotion();
  const titleId = useId();
  const [present, setPresent] = useState(false);
  const y = useMotionValue(0);
  const controls = useDragControls();
  const closing = useRef(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (open) {
      closing.current = false;
      setPresent(true);
      return;
    }
    if (!present || closing.current) return;
    closing.current = true;
    const done = () => {
      closing.current = false;
      setPresent(false);
    };
    if (reduced) done();
    else animate(y, 560, { ...springCalm, onComplete: done });
  }, [open, present, reduced, y]);

  useLayoutEffect(() => {
    if (!present || !open) return;
    if (reduced) {
      y.set(0);
      return;
    }
    y.set(placement === "center" ? 24 : 64);
    animate(y, 0, springCalm);
    dialogRef.current?.focus();
  }, [present, open, reduced, placement, y]);

  useEffect(() => {
    if (!present) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [present, onClose]);

  function dismiss(velocity = 0) {
    if (closing.current) return;
    closing.current = true;
    const done = () => {
      closing.current = false;
      setPresent(false);
      onClose();
    };
    if (reduced) done();
    else animate(y, placement === "center" ? 180 : 640, { ...springFlick, velocity, onComplete: done });
  }

  function onDragEnd(_: unknown, info: PanInfo) {
    const current = y.get();
    const projected = current + project(info.velocity.y);
    const shouldClose = projected > 140 || info.velocity.y > 800;
    if (shouldClose) {
      if (reduced) dismiss(0);
      else dismiss(info.velocity.y);
      return;
    }
    if (reduced) y.set(0);
    else animate(y, 0, { ...springFlick, velocity: info.velocity.y });
  }

  if (!present && !open) return null;

  const dialog = (
    <motion.div
      ref={dialogRef}
      role="dialog"
      aria-modal={modal}
      aria-labelledby={titleId}
      tabIndex={-1}
      className={`sheet material-strong ${placement === "center" ? "sheet-center" : ""}`}
      style={{ y }}
      drag={reduced ? false : "y"}
      dragControls={controls}
      dragListener={false}
      dragConstraints={{ top: 0, bottom: 480 }}
      dragElastic={{ top: 0.35, bottom: 0.12 }}
      dragMomentum={false}
      onDragEnd={onDragEnd}
    >
      <div className="sheet-grab" onPointerDown={(event) => controls.start(event)}>
        <span className="grabber" />
        <h2 id={titleId}>{title}</h2>
      </div>
      <div className="sheet-body">{children}</div>
    </motion.div>
  );

  if (placement === "center") {
    return (
      <div className="sheet-root">
        <div className="sheet-center-layer" onPointerDown={() => dismiss()}>
          <div onPointerDown={(event) => event.stopPropagation()}>{dialog}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="sheet-root">
      <button className={modal ? "scrim" : "scrim scrim-clear"} aria-label="Close" onClick={() => dismiss()} />
      {dialog}
    </div>
  );
}
