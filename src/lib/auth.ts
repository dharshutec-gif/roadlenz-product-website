import "server-only";
import crypto from "node:crypto";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { readDb, mutateDb } from "./db";

const SESSION_COOKIE = "rl_session";
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export function hashPassword(password: string, salt?: string): string {
  const s = salt ?? crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, s, 32).toString("hex");
  return `${s}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  if (typeof stored !== "string" || password.length > 1024) return false;
  const [salt, hash, extra] = stored.split(":");
  if (!salt || salt.length > 256 || !/^[a-f0-9]{64}$/i.test(hash ?? "") || extra !== undefined) return false;
  try { return crypto.timingSafeEqual(Buffer.from(hash, "hex"), crypto.scryptSync(password, salt, 32)); }
  catch { return false; }
}

export interface SessionInfo {
  userId: string;
  role: "admin" | "customer";
  name: string;
  email: string;
  company: string;
  adminRole?: "ADMIN" | "SUPER_ADMIN";
  lastLoginAt?: string;
}

export function createSession(userId: string, role: "admin" | "customer"): string {
  const token = crypto.randomBytes(32).toString("hex");
  const now = Date.now();
  mutateDb((db) => {
    db.sessions = db.sessions.filter((s) => s.expiresAt > new Date(now).toISOString());
    db.sessions.push({
      token,
      userId,
      role,
      createdAt: new Date(now).toISOString(),
      expiresAt: new Date(now + SESSION_TTL_MS).toISOString(),
    });
  });
  return token;
}

function findUser(dbUserId: string) {
  const db = readDb();
  return db.users.find((u) => u.id === dbUserId);
}

export function sessionFromToken(token: string | undefined | null): SessionInfo | null {
  if (!token) return null;
  const db = readDb();
  const session = db.sessions.find((s) => s.token === token);
  if (!session) return null;
  if (!(new Date(session.expiresAt).getTime() > Date.now())) return null;
  const user = db.users.find((u) => u.id === session.userId);
  if (!user || user.active === false || session.role !== user.role) return null;
  return {
    userId: user.id,
    role: user.role,
    name: user.name,
    email: user.email,
    company: user.company,
    adminRole: user.adminRole,
    lastLoginAt: user.lastLoginAt,
  };
}

export async function getCurrentSession(): Promise<SessionInfo | null> {
  const store = await cookies();
  return sessionFromToken(store.get(SESSION_COOKIE)?.value);
}

export function sessionFromRequest(req: NextRequest): SessionInfo | null {
  return sessionFromToken(req.cookies.get(SESSION_COOKIE)?.value);
}

export function setSessionCookie(token: string) {
  return {
    name: SESSION_COOKIE,
    value: token,
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_MS / 1000,
  };
}

export function clearSessionCookie() {
  return {
    name: SESSION_COOKIE,
    value: "",
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
    maxAge: 0,
  };
}
