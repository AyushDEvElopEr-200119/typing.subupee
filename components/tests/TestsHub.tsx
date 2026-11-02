"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { FAQS, TEST_MODES } from "@/content/tests";
import { Pressable } from "@/components/ui/Pressable";
import { LanguageTabs } from "@/components/curriculum/LanguagePicker";
import { ACCOUNTS_ENABLED } from "@/lib/features";
import { formatDate } from "@/lib/format";
import { useProgress } from "@/lib/progress/store";
import { useUI } from "@/lib/ui-store";

export function TestsHub() {
  const tests = useProgress((state) => state.doc.tests);
  const owner = useProgress((state) => state.doc.ownerId);
  const openAuth = useUI((state) => state.openAuth);
  const [sort, setSort] = useState<"date" | "speed" | "accuracy">("date");
  const [series, setSeries] = useState<"speed" | "accuracy">("speed");

  const ordered = useMemo(() => {
    const copy = [...tests];
    if (sort === "speed") copy.sort((a, b) => b.wpm - a.wpm);
    else if (sort === "accuracy") copy.sort((a, b) => b.accuracy - a.accuracy);
    else copy.sort((a, b) => b.at - a.at);
    return copy;
  }, [tests, sort]);

  const chartTests = [...tests].sort((a, b) => a.at - b.at).slice(-30);
  const values = chartTests.map((test) => (series === "speed" ? test.wpm : test.accuracy));
  const max = Math.max(10, ...values, 0);
  const points = values
    .map((value, index) => {
      const x = chartTests.length === 1 ? 300 : (index / (chartTests.length - 1)) * 560 + 20;
      const y = 180 - (value / max) * 150;
      return `${x},${y}`;
    })
    .join(" ");

  const groups = ["Timed", "Page", "Keys"] as const;

  return (
    <div>
      <div className="page-head">
        <div>
          <p className="eyebrow">Tests</p>
          <h1>Typing tests</h1>
          <p>Timed tests, page tests, and key drills. Refresh a test and the passage is a new one.</p>
        </div>
      </div>
      <LanguageTabs />
      {ACCOUNTS_ENABLED && !owner && (
        <p className="muted">
          These results stay on this device.{" "}
          <button className="pressable btn btn-plain btn-small" onClick={() => openAuth("signup")}>
            Create an account
          </button>{" "}
          if you want them kept.
        </p>
      )}
      <div className="split" style={{ marginTop: "1rem" }}>
        <div className="stack">
          {groups.map((group) => (
            <div key={group} className="card">
              <p className="group-title">{group === "Timed" ? "Timed tests" : group === "Page" ? "Page tests" : "Key drills"}</p>
              <div className="stack">
                {TEST_MODES.filter((mode) => mode.group === group).map((mode) => (
                  <Link key={mode.slug} href={`/tests/${mode.slug}`} className="lesson-row pressable">
                    <span>{mode.label}</span>
                    <span className="muted">Start</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="stack">
          <div className="card">
            <div className="exercise-bar">
              <h2>Last 30 tests</h2>
              <Pressable size="small" tone={series === "speed" ? "primary" : "quiet"} onClick={() => setSeries("speed")}>
                Speed
              </Pressable>
              <Pressable size="small" tone={series === "accuracy" ? "primary" : "quiet"} onClick={() => setSeries("accuracy")}>
                Accuracy
              </Pressable>
            </div>
            {chartTests.length === 0 ? (
              <p className="muted">Your tests will gather here.</p>
            ) : (
              <svg className="chart" viewBox="0 0 600 210" role="img" aria-label={`${series} over recent tests`}>
                <polyline fill="none" stroke="var(--accent)" strokeWidth="3" points={points} />
              </svg>
            )}
          </div>
          <div className="exercise-bar">
            <h2>History</h2>
            {(["date", "speed", "accuracy"] as const).map((key) => (
              <Pressable key={key} size="small" tone={sort === key ? "primary" : "quiet"} onClick={() => setSort(key)}>
                {key[0].toUpperCase() + key.slice(1)}
              </Pressable>
            ))}
          </div>
          {ordered.length === 0 && <p className="muted">No tests yet.</p>}
          {ordered.map((test) => (
            <div key={test.id} className="history-row">
              <span className="muted">{formatDate(test.at)}</span>
              <b className="nums">{test.wpm} wpm</b>
              <span className="nums">{test.accuracy}%</span>
              <Link href={`/tests/certificate/${test.id}`}>Print certificate</Link>
            </div>
          ))}
        </div>
      </div>
      <section className="section faq">
        <h2>FAQs</h2>
        {FAQS.map((item) => (
          <details key={item.q}>
            <summary>{item.q}</summary>
            <p>{item.a}</p>
          </details>
        ))}
      </section>
    </div>
  );
}
