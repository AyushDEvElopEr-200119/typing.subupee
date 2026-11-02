"use client";

import { Sheet } from "@/components/ui/Sheet";
import { useProgress } from "@/lib/progress/store";
import { useUI } from "@/lib/ui-store";
import type { ThemeId } from "@/lib/progress/types";

const themes: { id: ThemeId; name: string; note: string }[] = [
  { id: "classic", name: "Classic", note: "Ink on paper" },
  { id: "ink", name: "Ink", note: "Warm page" },
  { id: "dusk", name: "Dusk", note: "Blue evening" },
  { id: "grove", name: "Grove", note: "Soft green" },
  { id: "studio", name: "Studio", note: "Warm dark" },
  { id: "night", name: "Night", note: "High contrast" },
];

export function ThemeSheet() {
  const open = useUI((state) => state.themesOpen);
  const close = useUI((state) => state.closeThemes);
  const theme = useProgress((state) => state.doc.settings.theme);
  const setSettings = useProgress((state) => state.setSettings);

  return (
    <Sheet open={open} onClose={close} title="Themes" placement="bottom">
      <p className="muted">Pick a theme. It changes the whole app, including the page you type on.</p>
      <div className="theme-grid" style={{ marginTop: "0.9rem" }}>
        {themes.map((item) => (
          <button
            key={item.id}
            className="theme-card pressable"
            aria-pressed={theme === item.id}
            onClick={() => setSettings({ theme: item.id })}
          >
            <div className="theme-swatch" data-theme={item.id} style={{ background: "var(--paper)", color: "var(--passage)" }}>
              Aa
            </div>
            <span>
              {item.name}
              <small className="muted" style={{ display: "block" }}>
                {item.note}
              </small>
            </span>
          </button>
        ))}
      </div>
    </Sheet>
  );
}
