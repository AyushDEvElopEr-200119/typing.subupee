const bank = [
  "The reading room stayed cool even in July. High windows cut the sun into bars that moved across the tables through the afternoon. People spoke softly, not because of a sign, but because the room made loudness feel out of place. A student copied a diagram, erased one line, and drew it again with a steadier hand.",
  "Down at the harbor the water kept a patient color, somewhere between slate and green. A ferry touched the dock and the ramp came down with a small metallic sigh. Commuters stepped off counting bags and children. Gulls argued over a crust and then lost interest, as if the argument had been the point.",
  "In the workshop the cedar smelled sweet when the saw started and sharper when it stopped. Measure twice was not a poster. It was the pause before the pencil moved. Offcuts gathered in a bin by the door, pale curls that still held the shape of the cut. Someone swept, and the floor looked newly decided.",
  "The night class let out into a street that had already chosen evening. Shop lights were warmer than the sky. A baker slid a tray onto a rack and the window fogged for a moment. Two friends compared a sentence they had both been trying to finish, then laughed when they found they had written the same verb.",
];

export type TestMode = {
  slug: string;
  label: string;
  group: "Timed" | "Page" | "Keys";
  seconds?: number;
  pages?: number;
};

export const TEST_MODES: TestMode[] = [
  { slug: "1-min", label: "1:00 Test", group: "Timed", seconds: 60 },
  { slug: "3-min", label: "3:00 Test", group: "Timed", seconds: 180 },
  { slug: "5-min", label: "5:00 Test", group: "Timed", seconds: 300 },
  { slug: "page-1", label: "1 Page", group: "Page", pages: 1 },
  { slug: "page-2", label: "2 Pages", group: "Page", pages: 2 },
  { slug: "page-3", label: "3 Pages", group: "Page", pages: 3 },
  { slug: "keys-home", label: "Home row", group: "Keys" },
  { slug: "keys-top", label: "Top row", group: "Keys" },
  { slug: "keys-bottom", label: "Bottom row", group: "Keys" },
  { slug: "keys-common", label: "Common pairs", group: "Keys" },
];

const drills: Record<string, string> = {
  "keys-home": "fff jjj ddd kkk sss lll aaa ;;; fjf jfj dk dk sl sl a; a; a sad lad asks; a flask falls; all lads fall as dad asks a lass",
  "keys-top": "qqq www eee rrr ttt yyy uuu iii ooo ppp qw er ty ui op we write quite well; you type a quiet quote; we try to type true",
  "keys-bottom": "zzz xxx ccc vvv bbb nnn mmm zx cv bn m, can you mix a calm verb; move the box; zoom in on the number",
  "keys-common": "the thin theme then there their other ether three fresh shirts shrink when the weather shifts; she sees these sheets",
};

export function getTestMode(slug: string) {
  return TEST_MODES.find((mode) => mode.slug === slug);
}

export function getTestTarget(slug: string) {
  const mode = getTestMode(slug);
  if (!mode) return "";
  if (mode.group === "Keys") return drills[slug] ?? "";
  if (mode.pages) return bank.slice(0, mode.pages).join(" ");
  return `${bank.join(" ")} ${bank.join(" ")}`;
}

export const FAQS = [
  {
    q: "How do I increase my typing speed?",
    a: "Stay on the home row and type short honest sessions. When a finger misses, backspace and repair the letter. Speed shows up after the repair becomes small.",
  },
  {
    q: "How fast should I type?",
    a: "A calm 40 words per minute with high accuracy is already useful for schoolwork. Many adults land between 50 and 70. Chasing a number before accuracy settles usually slows the real gain.",
  },
  {
    q: "How is typing speed measured?",
    a: "A word counts as five characters. Words per minute uses the characters you typed correctly, divided by five, divided by the minutes you spent. Accuracy is correct keystrokes divided by correct plus mistaken keystrokes.",
  },
  {
    q: "Why take a timed test?",
    a: "A timer shows the pace you can hold, not just the pace you can touch for one sentence. The history chart keeps those results so a single lucky line does not pretend to be a trend.",
  },
];
