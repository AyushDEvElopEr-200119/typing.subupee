export type CurriculumId = "en" | "classic" | "es" | "pt" | "hi" | "bn" | "te" | "gu" | "ml" | "ta" | "mr" | "pa" | "ur";
export type GradeId =
  | "k"
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "10"
  | "11"
  | "12"
  | "adult";

export type Lesson = {
  id: string;
  curriculum: CurriculumId;
  grade: GradeId;
  title: string;
  focus: string;
  assist: boolean;
  text: string;
};

export const GRADES: { id: GradeId; short: string; label: string }[] = [
  { id: "k", short: "K", label: "Kindergarten" },
  { id: "1", short: "1st", label: "1st Grade" },
  { id: "2", short: "2nd", label: "2nd Grade" },
  { id: "3", short: "3rd", label: "3rd Grade" },
  { id: "4", short: "4th", label: "4th Grade" },
  { id: "5", short: "5th", label: "5th Grade" },
  { id: "6", short: "6th", label: "6th Grade" },
  { id: "7", short: "7th", label: "7th Grade" },
  { id: "8", short: "8th", label: "8th Grade" },
  { id: "9", short: "9th", label: "9th Grade" },
  { id: "10", short: "10th", label: "10th Grade" },
  { id: "11", short: "11th", label: "11th Grade" },
  { id: "12", short: "12th", label: "12th Grade" },
  { id: "adult", short: "Adult", label: "Adult Learner" },
];

export const CURRICULA: { id: CurriculumId; short: string; label: string }[] = [
  { id: "classic", short: "EN", label: "Subupee Classic" },
  { id: "es", short: "ES", label: "Español" },
  { id: "pt", short: "PT", label: "Português" },
  { id: "hi", short: "HI", label: "हिन्दी (Hindi)" },
  { id: "bn", short: "BN", label: "বাংলা (Bengali)" },
  { id: "te", short: "TE", label: "తెలుగు (Telugu)" },
  { id: "gu", short: "GU", label: "ગુજરાતી (Gujarati)" },
  { id: "ml", short: "ML", label: "മലയാളം (Malayalam)" },
  { id: "ta", short: "TA", label: "தமிழ் (Tamil)" },
  { id: "mr", short: "MR", label: "मराठी (Marathi)" },
  { id: "pa", short: "PA", label: "ਪੰਜਾਬੀ (Punjabi)" },
  { id: "ur", short: "UR", label: "اردو (Urdu)" },
];

export function gradeLabel(id: GradeId) {
  return GRADES.find((grade) => grade.id === id)?.label ?? id;
}
