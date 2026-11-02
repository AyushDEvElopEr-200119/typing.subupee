import type { Metadata } from "next";
import { GamesHub } from "@/components/games/GamesHub";

export const metadata: Metadata = { title: "Games" };

export default function GamesPage() {
  return <GamesHub />;
}
