import type { CurriculumId, GradeId, Lesson } from "./types";

type Seed = {
  grade: GradeId;
  title: string;
  focus: string;
  assist?: boolean;
  text: string;
};

export function pack(curriculum: CurriculumId, seeds: Seed[]): Lesson[] {
  const seen: Partial<Record<GradeId, number>> = {};
  return seeds.map((seed) => {
    seen[seed.grade] = (seen[seed.grade] ?? 0) + 1;
    return {
      id: `${curriculum}-${seed.grade}-${seen[seed.grade]}`,
      curriculum,
      grade: seed.grade,
      title: seed.title,
      focus: seed.focus,
      assist: seed.assist ?? false,
      text: seed.text.normalize("NFC"),
    };
  });
}
