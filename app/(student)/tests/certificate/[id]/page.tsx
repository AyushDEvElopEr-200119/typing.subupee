"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { formatClock, formatDate } from "@/lib/format";
import { useProgress } from "@/lib/progress/store";
import { Pressable } from "@/components/ui/Pressable";
import { BrandLogo } from "@/components/chrome/BrandLogo";

export default function CertificatePage() {
  const params = useParams<{ id: string }>();
  const test = useProgress((state) => state.doc.tests.find((item) => item.id === params.id));
  if (!test) {
    return (
      <div>
        <h1>Certificate not found</h1>
        <p className="muted">This result is not on this device.</p>
        <Link href="/tests">Back to tests</Link>
      </div>
    );
  }
  return (
    <article className="certificate">
      <BrandLogo tone="light" className="certificate-logo" />
      <h1 className="nums">{test.wpm}</h1>
      <p>words per minute</p>
      <p className="nums">
        {test.accuracy}% accuracy · {formatClock(test.seconds)} · {test.chars} correct characters
      </p>
      <p>
        {test.mode} · {formatDate(test.at)}
      </p>
      <p className="muted">This note records a practice test on Subupee. It is not a proctored exam.</p>
      <Pressable className="no-print" tone="primary" onClick={() => window.print()} style={{ marginTop: "1rem" }}>
        Print
      </Pressable>
    </article>
  );
}
