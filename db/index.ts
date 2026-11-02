import fs from "node:fs";
import path from "node:path";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { schema } from "./schema";

const dir = path.join(process.cwd(), "data");
fs.mkdirSync(dir, { recursive: true });
const file = path.join(dir, "subupee.db").replace(/\\/g, "/");

export const sqlite = createClient({ url: `file:${file}` });
export const db = drizzle(sqlite, { schema });

const statements = [
  `CREATE TABLE IF NOT EXISTS user (
    id text PRIMARY KEY,
    name text NOT NULL,
    email text NOT NULL UNIQUE,
    emailVerified integer NOT NULL,
    image text,
    createdAt integer NOT NULL,
    updatedAt integer NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS session (
    id text PRIMARY KEY,
    expiresAt integer NOT NULL,
    token text NOT NULL UNIQUE,
    createdAt integer NOT NULL,
    updatedAt integer NOT NULL,
    ipAddress text,
    userAgent text,
    userId text NOT NULL REFERENCES user(id) ON DELETE CASCADE
  )`,
  `CREATE TABLE IF NOT EXISTS account (
    id text PRIMARY KEY,
    accountId text NOT NULL,
    providerId text NOT NULL,
    userId text NOT NULL REFERENCES user(id) ON DELETE CASCADE,
    accessToken text,
    refreshToken text,
    idToken text,
    accessTokenExpiresAt integer,
    refreshTokenExpiresAt integer,
    scope text,
    password text,
    createdAt integer NOT NULL,
    updatedAt integer NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS verification (
    id text PRIMARY KEY,
    identifier text NOT NULL,
    value text NOT NULL,
    expiresAt integer NOT NULL,
    createdAt integer NOT NULL,
    updatedAt integer NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS progress (
    userId text PRIMARY KEY REFERENCES user(id) ON DELETE CASCADE,
    document text NOT NULL,
    updatedAt integer NOT NULL
  )`,
];

let ready: Promise<void> | null = null;

export function ensureDb() {
  ready ??= (async () => {
    fs.mkdirSync(dir, { recursive: true });
    for (const statement of statements) {
      await sqlite.execute(statement);
    }
  })();
  return ready;
}
