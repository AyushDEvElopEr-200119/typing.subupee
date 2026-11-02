import { auth } from "@/lib/auth";
import { ensureDb } from "@/db";
import { toNextJsHandler } from "better-auth/next-js";

const handlers = toNextJsHandler(auth);

export async function GET(request: Request) {
  await ensureDb();
  return handlers.GET(request);
}

export async function POST(request: Request) {
  await ensureDb();
  return handlers.POST(request);
}
