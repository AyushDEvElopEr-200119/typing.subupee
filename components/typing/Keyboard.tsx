"use client";

import { SCRIPTS, keyLabel, type ScriptId } from "@/lib/typing/layouts";

const rows = ["qwertyuiop", "asdfghjkl;", "zxcvbnm"];
const scriptRows = ["qwertyuiop[]", "asdfghjkl;'", "zxcvbnm,./"];

/** Physical keyboard hint. For a non-Latin passage each key shows what it types. */
export function Keyboard({ script = null }: { script?: ScriptId | null }) {
  return (
    <div className="keyboard" aria-hidden lang={script ? SCRIPTS[script].lang : undefined}>
      {(script ? scriptRows : rows).map((row) => (
        <div className="keyboard-row" key={row}>
          {row.split("").map((key) => (
            <span key={key} data-key={key} className="key">
              {script ? keyLabel(script, key) : key}
            </span>
          ))}
        </div>
      ))}
      <div className="keyboard-row">
        <span data-key="shift" className="key">
          shift
        </span>
        <span data-key=" " className="key space">
          space
        </span>
      </div>
    </div>
  );
}
