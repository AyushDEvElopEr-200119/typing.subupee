"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { lessonsFor, trackHasGrade } from "@/content/curriculum";
import { CURRICULA, gradeLabel } from "@/content/curriculum/types";
import { Pressable } from "@/components/ui/Pressable";
import { LanguageTabs } from "@/components/curriculum/LanguagePicker";
import { useProgress } from "@/lib/progress/store";
import { useUI } from "@/lib/ui-store";

export function LearnView() {
  const doc = useProgress((state) => state.doc);
  const ready = useProgress((state) => state.ready);
  const openCurriculum = useUI((state) => state.openCurriculum);
  const opened = useRef(false);
  const { curriculum, grade } = doc.settings;
  const items = lessonsFor(curriculum, grade);
  const exact = trackHasGrade(curriculum, grade);
  const track = CURRICULA.find((item) => item.id === curriculum);

  useEffect(() => {
    if (!ready || opened.current || doc.settings.curriculumChosen) return;
    opened.current = true;
    openCurriculum();
  }, [ready, doc.settings.curriculumChosen, openCurriculum]);

  const title = curriculum === "en" ? gradeLabel(grade) : curriculum === "classic" ? "Subupee Classic" : `${track?.label} · ${gradeLabel(grade)}`;

  return (
    <div>
      <div className="page-head">
        <div>
          <p className="eyebrow">Lessons</p>
          <h1>{title}</h1>
          <p>Pick a lesson and start typing. Refresh a lesson and a different passage comes up.</p>
        </div>
        <Pressable tone="quiet" onClick={openCurriculum}>
          Change curriculum
        </Pressable>
      </div>
      <LanguageTabs />
      {!exact && curriculum !== "classic" && (
        <p className="muted">This language is a starter set, so every current lesson is listed here.</p>
      )}
      <div className="lesson-list">
        {items.map((lesson) => {
          const done = doc.lessons[lesson.id];
          return (
            <Link key={lesson.id} href={`/practice/${lesson.id}`} className="lesson-row pressable">
              <span>
                {lesson.title}
                <small>{lesson.focus}</small>
              </span>
              <span className="nums muted">{done ? `${done.wpm} wpm` : "Start"}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
