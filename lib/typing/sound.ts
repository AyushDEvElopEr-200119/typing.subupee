import { SCRIPTS, detectScript } from "./layouts";
let audio: AudioContext | null = null;

function context() {
  if (typeof window === "undefined") return null;
  const Ctx = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctx) return null;
  if (!audio) audio = new Ctx();
  return audio;
}

export function playTick(kind: "ok" | "bad" | "done") {
  const ctx = context();
  if (!ctx) return;
  if (ctx.state === "suspended") void ctx.resume();
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = kind === "bad" ? "triangle" : "sine";
  osc.frequency.value = kind === "ok" ? 660 : kind === "bad" ? 196 : 880;
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(kind === "done" ? 0.08 : 0.045, now + 0.008);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + (kind === "done" ? 0.18 : 0.06));
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.2);
}

export function speak(text: string) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.95;
  const script = detectScript(text);
  if (script) utterance.lang = script === "arab" ? "ur-PK" : `${SCRIPTS[script].lang}-IN`;
  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking() {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
}
