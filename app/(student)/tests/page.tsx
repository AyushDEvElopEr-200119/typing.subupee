import type { Metadata } from "next";
import { TestsHub } from "@/components/tests/TestsHub";

export const metadata: Metadata = { title: "Tests" };

export default function TestsPage() {
  return <TestsHub />;
}
