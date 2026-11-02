import type { Metadata } from "next";
import { LearnView } from "@/components/learn/LearnView";

export const metadata: Metadata = { title: "Lessons" };

export default function LearnPage() {
  return <LearnView />;
}
