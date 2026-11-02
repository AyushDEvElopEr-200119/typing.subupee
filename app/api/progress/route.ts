import { eq } from "drizzle-orm";
import { ensureDb, db } from "@/db";
import { progress } from "@/db/schema";
import { mergeProgress } from "@/lib/progress/merge";
import { withAchievements } from "@/lib/progress/achievements";
import { normalize, type ProgressDocument } from "@/lib/progress/types";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

async function sessionUser() {
  await ensureDb();
  const session = await auth.api.getSession({ headers: await headers() });
  return session?.user ?? null;
}

export async function GET() {
  const user = await sessionUser();
  if (!user) return Response.json({ document: null }, { status: 401 });
  const rows = await db.select().from(progress).where(eq(progress.userId, user.id)).limit(1);
  if (!rows[0]) return Response.json({ document: null });
  return Response.json({ document: normalize(JSON.parse(rows[0].document)) });
}

export async function POST(request: Request) {
  const user = await sessionUser();
  if (!user) return Response.json({ error: "Sign in to save progress." }, { status: 401 });
  const body = (await request.json()) as { document?: unknown };
  const text = JSON.stringify(body.document ?? {});
  if (text.length > 500_000) return Response.json({ error: "That progress file is too large." }, { status: 413 });
  const incoming = normalize(body.document);
  const rows = await db.select().from(progress).where(eq(progress.userId, user.id)).limit(1);
  const existing = rows[0] ? normalize(JSON.parse(rows[0].document)) : null;
  const merged: ProgressDocument = withAchievements({
    ...mergeProgress(incoming, existing),
    ownerId: user.id,
    updatedAt: Date.now(),
  });
  const payload = JSON.stringify(merged);
  if (rows[0]) {
    await db.update(progress).set({ document: payload, updatedAt: new Date() }).where(eq(progress.userId, user.id));
  } else {
    await db.insert(progress).values({ userId: user.id, document: payload, updatedAt: new Date() });
  }
  return Response.json({ document: merged });
}
