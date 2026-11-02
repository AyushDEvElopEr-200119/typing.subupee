import { classicLessons } from "./classic";
import { englishLessons } from "./en";
import { spanishLessons } from "./es";
import { portugueseLessons } from "./pt";
import { hindiLessons } from "./hi";
import { regionalLessons } from "./indic";
import type { CurriculumId, GradeId, Lesson } from "./types";

export const lessons: Lesson[] = [
  ...englishLessons,
  ...classicLessons,
  ...spanishLessons,
  ...portugueseLessons,
  ...hindiLessons,
  ...regionalLessons,
];

export function getLesson(id: string) {
  return lessons.find((lesson) => lesson.id === id);
}

export function lessonsFor(curriculum: CurriculumId, grade: GradeId) {
  if (curriculum === "classic") return classicLessons;
  const track = lessons.filter((lesson) => lesson.curriculum === curriculum);
  const graded = track.filter((lesson) => lesson.grade === grade);
  return graded.length > 0 ? graded : track;
}

export function trackHasGrade(curriculum: CurriculumId, grade: GradeId) {
  if (curriculum === "classic") return true;
  return lessons.some((lesson) => lesson.curriculum === curriculum && lesson.grade === grade);
}
