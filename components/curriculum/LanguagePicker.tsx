"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useProgress } from "@/lib/progress/store";
import type { CurriculumId } from "@/content/curriculum/types";

const LANGUAGES: { id: CurriculumId; code: string; label: string; native: string }[] = [
  { id: "en", code: "EN", label: "English", native: "English" },
  { id: "es", code: "ES", label: "Spanish", native: "Español" },
  { id: "pt", code: "PT", label: "Portuguese", native: "Português" },
  { id: "hi", code: "HI", label: "Hindi", native: "हिन्दी" },
  { id: "bn", code: "BN", label: "Bengali", native: "বাংলা" },
  { id: "te", code: "TE", label: "Telugu", native: "తెలుగు" },
  { id: "gu", code: "GU", label: "Gujarati", native: "ગુજરાતી" },
  { id: "ml", code: "ML", label: "Malayalam", native: "മലയാളം" },
  { id: "ta", code: "TA", label: "Tamil", native: "தமிழ்" },
  { id: "mr", code: "MR", label: "Marathi", native: "मराठी" },
  { id: "pa", code: "PA", label: "Punjabi", native: "ਪੰਜਾਬੀ" },
  { id: "ur", code: "UR", label: "Urdu", native: "اردو" },
];

// "classic" is an English track, so it counts as English here.
function languageOf(curriculum: CurriculumId): CurriculumId {
  return curriculum === "classic" ? "en" : curriculum;
}

function useLanguage() {
  const ready = useProgress((state) => state.ready);
  const curriculum = useProgress((state) => state.doc.settings.curriculum);
  const setSettings = useProgress((state) => state.setSettings);
  const pathname = usePathname();
  const router = useRouter();
  const current = languageOf(curriculum);

  function choose(id: CurriculumId) {
    if (id !== current) setSettings({ curriculum: id, curriculumChosen: true });
    // A running lesson belongs to the old language, so go back to the lesson list.
    if (pathname.startsWith("/practice/")) router.push("/learn");
  }

  return { ready, current, choose };
}

const globe = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
  </svg>
);

/** Compact dropdown for the site header. */
export function LanguageMenu() {
  const { ready, current, choose } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const active = LANGUAGES.find((item) => item.id === current) ?? LANGUAGES[0];

  useEffect(() => {
    function onPointer(event: PointerEvent) {
      if (!ref.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("pointerdown", onPointer);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("pointerdown", onPointer);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div className="lang-menu" ref={ref}>
      <button
        className="pressable btn btn-quiet btn-small lang-trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Typing language: ${active.label}`}
        title="Typing language"
        disabled={!ready}
        onClick={() => setOpen((value) => !value)}
      >
        {globe}
        <span>{active.code}</span>
      </button>
      {open && (
        <div className="lang-popover material-strong" role="listbox" aria-label="Typing language">
          <p className="lang-popover-title">Typing language</p>
          {LANGUAGES.map((item) => (
            <button
              key={item.id}
              role="option"
              aria-selected={item.id === current}
              className="lang-option"
              onClick={() => {
                choose(item.id);
                setOpen(false);
              }}
            >
              <span className="badge">{item.code}</span>
              <span>
                <b lang={item.id}>{item.native}</b>
                <small>{item.label}</small>
              </span>
              {item.id === current && <span className="lang-check" aria-hidden>✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/** Segmented control for page headers (Lessons, Tests). */
export function LanguageTabs() {
  const { ready, current, choose } = useLanguage();
  return (
    <div className="lang-tabs" role="radiogroup" aria-label="Typing language">
      <span className="lang-tabs-label">{globe} Language</span>
      {LANGUAGES.map((item) => (
        <button
          key={item.id}
          role="radio"
          aria-checked={item.id === current}
          className="pressable lang-tab"
          disabled={!ready}
          onClick={() => choose(item.id)}
          lang={item.id}
        >
          {item.native}
        </button>
      ))}
    </div>
  );
}
