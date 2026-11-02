// On-screen keyboard layouts for non-Latin typing, keyed by KeyboardEvent.code: [plain, shifted].
// Students type their own script on an ordinary English keyboard.
//
// Indic scripts use InScript. Unicode's Indic blocks are laid out in parallel with
// Devanagari, so every Indic layout is the Devanagari one shifted into its own block,
// plus a few per-script extras (Bengali ৎ, Gurmukhi tippi/addak, Malayalam chillus).
// Urdu uses a phonetic layout: each key gives the letter that sounds like it.

export type ScriptId = "deva" | "beng" | "guru" | "gujr" | "taml" | "telu" | "mlym" | "arab";
type Layout = Record<string, [string, string]>;

const DEVANAGARI: Layout = {
  Backquote: ["ॊ", "ऒ"],
  Digit1: ["१", "ऍ"],
  Digit2: ["२", "ॅ"],
  Digit3: ["३", "्र"],
  Digit4: ["४", "र्"],
  Digit5: ["५", "ज्ञ"],
  Digit6: ["६", "त्र"],
  Digit7: ["७", "क्ष"],
  Digit8: ["८", "श्र"],
  Digit9: ["९", "("],
  Digit0: ["०", ")"],
  Minus: ["-", "ः"],
  Equal: ["ृ", "ऋ"],
  KeyQ: ["ौ", "औ"],
  KeyW: ["ै", "ऐ"],
  KeyE: ["ा", "आ"],
  KeyR: ["ी", "ई"],
  KeyT: ["ू", "ऊ"],
  KeyY: ["ब", "भ"],
  KeyU: ["ह", "ङ"],
  KeyI: ["ग", "घ"],
  KeyO: ["द", "ध"],
  KeyP: ["ज", "झ"],
  BracketLeft: ["ड", "ढ"],
  BracketRight: ["़", "ञ"],
  Backslash: ["ॉ", "ऑ"],
  KeyA: ["ो", "ओ"],
  KeyS: ["े", "ए"],
  KeyD: ["्", "अ"],
  KeyF: ["ि", "इ"],
  KeyG: ["ु", "उ"],
  KeyH: ["प", "फ"],
  KeyJ: ["र", "ऱ"],
  KeyK: ["क", "ख"],
  KeyL: ["त", "थ"],
  Semicolon: ["च", "छ"],
  Quote: ["ट", "ठ"],
  KeyZ: ["ॆ", "ऎ"],
  KeyX: ["ं", "ँ"],
  KeyC: ["म", "ण"],
  KeyV: ["न", "ऩ"],
  KeyB: ["व", "ऴ"],
  KeyN: ["ल", "ळ"],
  KeyM: ["स", "श"],
  Comma: [",", "ष"],
  Period: [".", "।"],
  Slash: ["य", "य़"],
};

const URDU: Layout = {
  KeyQ: ["ق", ""],
  KeyW: ["و", "ؤ"],
  KeyE: ["ع", ""],
  KeyR: ["ر", "ڑ"],
  KeyT: ["ت", "ٹ"],
  KeyY: ["ے", ""],
  KeyU: ["ء", "ئ"],
  KeyI: ["ی", ""],
  KeyP: ["پ", ""],
  KeyA: ["ا", "آ"],
  KeyS: ["س", "ص"],
  KeyD: ["د", "ڈ"],
  KeyF: ["ف", ""],
  KeyG: ["گ", "غ"],
  KeyH: ["ہ", "ح"],
  KeyJ: ["ج", "ض"],
  KeyK: ["ک", "خ"],
  KeyL: ["ل", ""],
  Semicolon: ["؛", ""],
  KeyZ: ["ز", "ذ"],
  KeyX: ["ش", "ژ"],
  KeyC: ["چ", "ث"],
  KeyV: ["ط", "ظ"],
  KeyB: ["ب", "ھ"],
  KeyN: ["ن", "ں"],
  KeyM: ["م", ""],
  Comma: ["،", ""],
  Period: ["۔", ""],
  Slash: ["/", "؟"],
};

const INDIC_BASE: Partial<Record<ScriptId, number>> = {
  deva: 0x900,
  beng: 0x980,
  guru: 0xa00,
  gujr: 0xa80,
  taml: 0xb80,
  telu: 0xc00,
  mlym: 0xd00,
};

// Keys whose shifted Devanagari value has no letter in the target script are reused.
const EXTRAS: Partial<Record<ScriptId, Record<string, [string | null, string | null]>>> = {
  beng: { Backquote: ["ৎ", null] },
  guru: { KeyZ: ["ੰ", null], Backquote: ["ੱ", null], Equal: ["ੜ", null] },
  mlym: { Digit1: [null, "ൽ"], Digit2: [null, "ൻ"], Backslash: ["ർ", "ൾ"], KeyV: [null, "ൺ"] },
};

export const SCRIPTS: Record<ScriptId, { lang: string; rtl: boolean }> = {
  deva: { lang: "hi", rtl: false },
  beng: { lang: "bn", rtl: false },
  guru: { lang: "pa", rtl: false },
  gujr: { lang: "gu", rtl: false },
  taml: { lang: "ta", rtl: false },
  telu: { lang: "te", rtl: false },
  mlym: { lang: "ml", rtl: false },
  arab: { lang: "ur", rtl: true },
};

const UNASSIGNED = /\p{Cn}/u;

function shiftInto(value: string, base: number) {
  let out = "";
  for (const char of value) {
    const cp = char.codePointAt(0) ?? 0;
    const shared = cp === 0x964 || cp === 0x965; // danda is shared by all Indic scripts
    out += cp >= 0x900 && cp < 0x980 && !shared ? String.fromCodePoint(cp - 0x900 + base) : char;
  }
  return out;
}

function clean(value: string) {
  // NFC splits nukta letters (য়, ਸ਼, ज़) into letter + nukta, the same form the passages use.
  return value && !UNASSIGNED.test(value) ? value.normalize("NFC") : "";
}

function build(script: ScriptId): Layout {
  if (script === "arab") return URDU;
  const base = INDIC_BASE[script] ?? 0x900;
  const extras = EXTRAS[script] ?? {};
  const layout: Layout = {};
  for (const [code, [plain, shifted]] of Object.entries(DEVANAGARI)) {
    const [extraPlain, extraShift] = extras[code] ?? [null, null];
    layout[code] = [clean(extraPlain ?? shiftInto(plain, base)), clean(extraShift ?? shiftInto(shifted, base))];
  }
  return layout;
}

const LAYOUTS = new Map<ScriptId, Layout>();
function layoutFor(script: ScriptId) {
  let layout = LAYOUTS.get(script);
  if (!layout) {
    layout = build(script);
    LAYOUTS.set(script, layout);
  }
  return layout;
}

// Devanagari is checked last: Bengali and Gurmukhi text also uses its danda (।).
const BLOCKS: [ScriptId, RegExp][] = [
  ["beng", /[ঀ-৿]/],
  ["guru", /[਀-੿]/],
  ["gujr", /[઀-૿]/],
  ["taml", /[஀-௿]/],
  ["telu", /[ఀ-౿]/],
  ["mlym", /[ഀ-ൿ]/],
  ["arab", /[؀-ۿ]/],
  ["deva", /[ऀ-ॿ]/],
];

/** The non-Latin script a passage is written in, or null for Latin text. */
export function detectScript(text: string): ScriptId | null {
  for (const [script, pattern] of BLOCKS) if (pattern.test(text)) return script;
  return null;
}

export function keyOutput(script: ScriptId, code: string, shift: boolean) {
  if (code === "Space") return " ";
  return layoutFor(script)[code]?.[shift ? 1 : 0] || undefined;
}

const KEY_NAME: Record<string, string> = {
  Backquote: "`", Minus: "-", Equal: "=", BracketLeft: "[", BracketRight: "]", Backslash: "\\",
  Semicolon: ";", Quote: "'", Comma: ",", Period: ".", Slash: "/",
};

function keyName(code: string) {
  if (code.startsWith("Key")) return code.slice(3).toLowerCase();
  if (code.startsWith("Digit")) return code.slice(5);
  return KEY_NAME[code] ?? code;
}

const REVERSE = new Map<ScriptId, Map<string, { key: string; shift: boolean }>>();

/** Which physical key (and whether Shift) types a single character. */
export function keyFor(script: ScriptId, char: string) {
  let map = REVERSE.get(script);
  if (!map) {
    map = new Map([[" ", { key: " ", shift: false }]]);
    for (const [code, [plain, shifted]] of Object.entries(layoutFor(script))) {
      if (plain.length === 1 && !map.has(plain)) map.set(plain, { key: keyName(code), shift: false });
      if (shifted.length === 1 && !map.has(shifted)) map.set(shifted, { key: keyName(code), shift: true });
    }
    REVERSE.set(script, map);
  }
  return map.get(char);
}

/** The character printed on a key of the on-screen keyboard. */
export function keyLabel(script: ScriptId, key: string) {
  const code = Object.keys(layoutFor(script)).find((c) => keyName(c) === key);
  return code ? layoutFor(script)[code][0] : "";
}

/** Every character the layout can produce, for auditing passages. */
export function typeableChars(script: ScriptId) {
  const chars = new Set([" "]);
  for (const pair of Object.values(layoutFor(script))) for (const value of pair) for (const char of value) chars.add(char);
  return chars;
}

const ROWS = {
  home: ["KeyA", "KeyS", "KeyD", "KeyF", "KeyG", "KeyH", "KeyJ", "KeyK", "KeyL", "Semicolon", "Quote"],
  top: ["KeyQ", "KeyW", "KeyE", "KeyR", "KeyT", "KeyY", "KeyU", "KeyI", "KeyO", "KeyP", "BracketLeft", "BracketRight"],
};

/** Practice lines for one keyboard row: short syllable groups built only from that row's keys. */
export function rowDrill(script: ScriptId, row: keyof typeof ROWS) {
  const layout = layoutFor(script);
  const letters: string[] = [];
  const signs: string[] = [];
  for (const code of ROWS[row]) {
    const char = layout[code]?.[0];
    if (!char || char.length !== 1) continue;
    const low = (char.codePointAt(0) ?? 0) & 0x7f;
    if (/\p{L}/u.test(char)) letters.push(char);
    else if (/\p{M}/u.test(char) && script !== "arab" && low !== 0x4d && low !== 0x3c) signs.push(char);
  }
  const n = letters.length;
  const words: string[] = [];
  for (let i = 0; i < n; i += 1) {
    const a = letters[i];
    const b = letters[(i + 1) % n];
    const c = letters[(i + 3) % n];
    const s = signs.length ? signs[i % signs.length] : "";
    const t = signs.length ? signs[(i + 2) % signs.length] : "";
    words.push(a + s + b, b + t + c + (signs.length ? "" : a));
  }
  const lines = [0, 1, 2, 3].map((v) => {
    const turned = [...words.slice(v * 3), ...words.slice(0, v * 3)];
    return (v % 2 ? turned.reverse() : turned).join(" ");
  });
  return { lines, focus: [...letters, ...signs].join(" ") };
}
