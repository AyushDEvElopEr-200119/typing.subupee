import { providerFlags } from "@/lib/auth";

export function GET() {
  return Response.json({
    google: providerFlags.google,
    microsoft: providerFlags.microsoft,
    clever: false,
    classlink: false,
  });
}
