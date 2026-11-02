export type GameSlug = "fall" | "leap" | "drift" | "lift" | "toss" | "shield";

export type GameMode = {
  slug: GameSlug;
  name: string;
  blurb: string;
};

export const GAME_MODES: GameMode[] = [
  { slug: "fall", name: "Fall", blurb: "Words drift down. Type the lowest one before it lands." },
  { slug: "leap", name: "Leap", blurb: "Words wait on steps. Clear the lowest to move up." },
  { slug: "drift", name: "Drift", blurb: "Words cross in lanes. Type the one farthest along." },
  { slug: "lift", name: "Lift", blurb: "Words rise. Catch them before they leave the frame." },
  { slug: "toss", name: "Toss", blurb: "Type a word cleanly and send it off the stage." },
  { slug: "shield", name: "Shield", blurb: "Words move inward. Type them before they reach the center." },
];

export function getGame(slug: string) {
  return GAME_MODES.find((mode) => mode.slug === slug);
}
