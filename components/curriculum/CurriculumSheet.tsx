"use client";

import { CURRICULA, GRADES, gradeLabel } from "@/content/curriculum/types";
import { Sheet } from "@/components/ui/Sheet";
import { useProgress } from "@/lib/progress/store";
import { useUI } from "@/lib/ui-store";
import type { CurriculumId, GradeId } from "@/content/curriculum/types";

export function CurriculumSheet() {
  const open = useUI((state) => state.curriculumOpen);
  const close = useUI((state) => state.closeCurriculum);
  const settings = useProgress((state) => state.doc.settings);
  const setSettings = useProgress((state) => state.setSettings);

  function chooseGrade(grade: GradeId) {
    const keepLanguage = settings.curriculum !== "en" && settings.curriculum !== "classic";
    setSettings({
      grade,
      curriculum: keepLanguage ? settings.curriculum : "en",
      curriculumChosen: true,
    });
    close();
  }

  function chooseTrack(curriculum: CurriculumId) {
    setSettings({ curriculum, curriculumChosen: true });
    close();
  }

  return (
    <Sheet open={open} onClose={close} title="Choose a curriculum" placement="bottom">
      <p className="section-label">Grades</p>
      <div className="grade-grid">
        {GRADES.map((grade) => {
          const pressed = settings.curriculum === "en" && settings.grade === grade.id;
          return (
            <button key={grade.id} className="chip pressable" aria-pressed={pressed} onClick={() => chooseGrade(grade.id)}>
              <span className="badge">{grade.short}</span>
              <span>{grade.label}</span>
            </button>
          );
        })}
      </div>
      <p className="section-label">Other curricula</p>
      <div className="grid-3">
        {CURRICULA.map((item) => (
          <button
            key={item.id}
            className="chip pressable"
            aria-pressed={settings.curriculum === item.id}
            onClick={() => chooseTrack(item.id)}
          >
            <span className="badge">{item.short}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </div>
      <p className="muted" style={{ marginTop: "0.9rem" }}>
        Current: {settings.curriculum === "en" ? gradeLabel(settings.grade) : CURRICULA.find((item) => item.id === settings.curriculum)?.label}
      </p>
    </Sheet>
  );
}
