"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getLesson } from "@/content/curriculum";
import { choicesForLesson } from "@/content/passages";
import { Exercise } from "@/components/typing/Exercise";
import { useFreshPassage } from "@/lib/typing/fresh-passage";

export default function PracticePage() {
  const params = useParams<{ lessonId: string }>();
  const lesson = getLesson(params.lessonId);
  const choices = useMemo(() => (lesson ? choicesForLesson(lesson) : []), [lesson]);
  const passage = useFreshPassage(lesson?.id ?? null, choices);
  if (!lesson) {
    return (
      <div>
        <h1>Lesson not found</h1>
        <Link href="/learn">Back to lessons</Link>
      </div>
    );
  }
  if (!passage) return <div className="canvas-card" />;
  return (
    <Exercise
      title={lesson.title}
      caption={passage.title && passage.title !== lesson.title ? passage.title : undefined}
      target={passage.text}
      backHref="/learn"
      assist={lesson.assist}
      record={{ kind: "lesson", key: lesson.id }}
    />
  );
}
