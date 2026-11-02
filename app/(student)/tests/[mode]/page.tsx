"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { choicesForTest, passageLang } from "@/content/passages";
import { getTestMode } from "@/content/tests";
import { Exercise } from "@/components/typing/Exercise";
import { useFreshPassage } from "@/lib/typing/fresh-passage";
import { useProgress } from "@/lib/progress/store";

export default function TestRunPage() {
  const params = useParams<{ mode: string }>();
  const mode = getTestMode(params.mode);
  const ready = useProgress((state) => state.ready);
  const curriculum = useProgress((state) => state.doc.settings.curriculum);
  const lang = passageLang(curriculum);
  const valid = Boolean(mode) && params.mode !== "certificate";
  const choices = useMemo(() => (valid && mode ? choicesForTest(mode, lang) : []), [valid, mode, lang]);
  const passage = useFreshPassage(valid && ready ? `${mode?.slug}:${lang}` : null, choices);
  if (!valid || !mode) {
    return (
      <div>
        <h1>Test not found</h1>
        <Link href="/tests">Back to tests</Link>
      </div>
    );
  }
  if (!passage) return <div className="canvas-card" />;
  return (
    <Exercise
      title={mode.label}
      caption={passage.title || undefined}
      target={passage.text}
      backHref="/tests"
      durationSeconds={mode.seconds}
      assist={mode.group === "Keys"}
      record={{ kind: "test", key: mode.slug }}
    />
  );
}
