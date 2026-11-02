import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { db } from "@/db";
import { authSchema } from "@/db/schema";

const googleReady = Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
const microsoftReady = Boolean(process.env.MICROSOFT_CLIENT_ID && process.env.MICROSOFT_CLIENT_SECRET);

export const auth = betterAuth({
  appName: "Subupee Typing",
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  secret: process.env.BETTER_AUTH_SECRET || "subupee-local-dev-secret-change-before-deploy",
  trustedOrigins: ["http://localhost:3000", "https://our.subupee.com"],
  database: drizzleAdapter(db, { provider: "sqlite", schema: authSchema }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    autoSignIn: true,
  },
  socialProviders: {
    ...(googleReady
      ? {
          google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
          },
        }
      : {}),
    ...(microsoftReady
      ? {
          microsoft: {
            clientId: process.env.MICROSOFT_CLIENT_ID as string,
            clientSecret: process.env.MICROSOFT_CLIENT_SECRET as string,
            tenantId: process.env.MICROSOFT_TENANT_ID || "common",
          },
        }
      : {}),
  },
  plugins: [nextCookies()],
});

export const providerFlags = { google: googleReady, microsoft: microsoftReady };
