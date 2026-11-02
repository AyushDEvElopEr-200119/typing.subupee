"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { GameView } from "@/components/games/GameView";
import { getGame } from "@/lib/games/modes";

export default function GamePage() {
  const params = useParams<{ slug: string }>();
  const game = getGame(params.slug);
  if (!game) {
    return (
      <div>
        <h1>Game not found</h1>
        <Link href="/games">Back to games</Link>
      </div>
    );
  }
  return <GameView slug={game.slug} name={game.name} />;
}
