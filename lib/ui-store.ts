import { create } from "zustand";

type UIState = {
  authOpen: boolean;
  authMode: "signup" | "login";
  curriculumOpen: boolean;
  themesOpen: boolean;
  openAuth: (mode?: "signup" | "login") => void;
  closeAuth: () => void;
  openCurriculum: () => void;
  closeCurriculum: () => void;
  openThemes: () => void;
  closeThemes: () => void;
};

export const useUI = create<UIState>((set) => ({
  authOpen: false,
  authMode: "signup",
  curriculumOpen: false,
  themesOpen: false,
  openAuth: (mode = "signup") =>
    set({ authOpen: true, authMode: mode, curriculumOpen: false, themesOpen: false }),
  closeAuth: () => set({ authOpen: false }),
  openCurriculum: () => set({ curriculumOpen: true, authOpen: false, themesOpen: false }),
  closeCurriculum: () => set({ curriculumOpen: false }),
  openThemes: () => set({ themesOpen: true, authOpen: false, curriculumOpen: false }),
  closeThemes: () => set({ themesOpen: false }),
}));
