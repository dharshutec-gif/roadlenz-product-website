import "server-only";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import type { Db } from "./types";
import type { SupabaseSyncStatus } from "./admin-types";

interface MirrorRecord { collection: string; id: string; data: unknown }
interface Outbox { revision: number; records: MirrorRecord[]; queuedAt: string }
interface SyncState { revision: number; lastSyncedAt: string | null; error: string | null }
const paths = () => ({ outbox: path.join(process.cwd(), "data", "supabase-outbox.json"), state: path.join(process.cwd(), "data", "supabase-sync-state.json") });
function read<T>(file: string, fallback: T): T { if (!fs.existsSync(file)) return fallback; return JSON.parse(fs.readFileSync(file, "utf8")) as T; }
function atomic(file: string, value: unknown) { fs.mkdirSync(path.dirname(file), { recursive: true }); const temp = `${file}.${process.pid}.${crypto.randomBytes(4).toString("hex")}.tmp`; fs.writeFileSync(temp, JSON.stringify(value)); fs.renameSync(temp, file); }
const credentials = () => ({ url: process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL,
  key: process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY });

export function mirrorRecords(db: Db): MirrorRecord[] {
  const records: MirrorRecord[] = [];
  for (const [collection, value] of Object.entries(db)) {
    if (["users", "sessions", "admin", "version", "updatedAt"].includes(collection)) continue;
    if (Array.isArray(value)) value.forEach((data: unknown, index) => {
      const record = data && typeof data === "object" ? data as Record<string, unknown> : {};
      records.push({ collection, id: typeof record.id === "string" ? record.id : String(index), data });
    });
    else if (collection === "customers") Object.entries(db.customers).forEach(([id, data]) => records.push({ collection, id, data }));
    else if (value && typeof value === "object") records.push({ collection, id: "default", data: value });
  }
  for (const user of db.users) records.push({ collection: "users", id: user.id, data: {
    id: user.id, name: user.name, company: user.company, email: user.email, phone: user.phone,
    role: user.role, adminRole: user.adminRole, active: user.active !== false, createdAt: user.createdAt,
    lastLoginAt: user.lastLoginAt, fleetSize: user.fleetSize,
  } });
  if (db.admin) for (const [key, value] of Object.entries(db.admin)) {
    if (key === "notificationReads") continue;
    if (Array.isArray(value)) value.forEach(data => records.push({ collection: `admin_${key}`, id: data.id, data }));
    else records.push({ collection: `admin_${key}`, id: "default", data: value });
  }
  return records;
}

export function queueSupabaseSnapshot(db: Db): void {
  const { outbox, state } = paths();
  const previous = read<Outbox | null>(outbox, null), last = read<SyncState>(state, { revision: 0, lastSyncedAt: null, error: null });
  atomic(outbox, { revision: Math.max(Date.now(), (previous?.revision || 0) + 1, last.revision + 1), records: mirrorRecords(db), queuedAt: new Date().toISOString() } satisfies Outbox);
}

export function supabaseSyncStatus(): SupabaseSyncStatus {
  const { outbox, state } = paths(), config = credentials();
  const pending = read<Outbox | null>(outbox, null), last = read<SyncState>(state, { revision: 0, lastSyncedAt: null, error: null });
  return { configured: Boolean(config.url && config.key), pending: Boolean(pending && pending.revision > last.revision),
    lastSyncedAt: last.lastSyncedAt, error: last.error };
}

let running: Promise<SupabaseSyncStatus> | null = null;
export function flushSupabaseQueue(): Promise<SupabaseSyncStatus> {
  if (running) return running;
  running = flush().finally(() => { running = null; });
  return running;
}
async function flush(): Promise<SupabaseSyncStatus> {
  const { outbox, state } = paths(), config = credentials();
  if (!config.url || !config.key) return supabaseSyncStatus();
  const current = read<Outbox | null>(outbox, null), last = read<SyncState>(state, { revision: 0, lastSyncedAt: null, error: null });
  if (!current || current.revision <= last.revision) return supabaseSyncStatus();
  try {
    const url = new URL("/rest/v1/rpc/roadlenz_apply_snapshot", config.url);
    if (url.protocol !== "https:" && url.hostname !== "localhost" && url.hostname !== "127.0.0.1") throw new Error("Supabase requires HTTPS.");
    const response = await fetch(url, {
      method: "POST", headers: { apikey: config.key, ...(config.key.startsWith("eyJ") ? { Authorization: `Bearer ${config.key}` } : {}), "Content-Type": "application/json" },
      body: JSON.stringify({ p_source: process.env.ROADLENZ_SUPABASE_SOURCE || "roadlenz", p_revision: current.revision, p_records: current.records }),
      signal: AbortSignal.timeout(10000), cache: "no-store",
    });
    if (!response.ok) {
      // Never echo remote headers, credentials or arbitrary remote error bodies into the admin UI.
      throw new Error(response.status === 401 || response.status === 403 ? "Supabase rejected the server credential. Verify the server-only secret key." :
        response.status === 404 ? "Supabase sync schema is missing. Apply supabase/migrations/20260915_roadlenz_admin_sync.sql." : `Supabase sync failed (HTTP ${response.status}). Changes remain queued.`);
    }
    const receipt: unknown = await response.json();
    if (receipt && typeof receipt === "object" && "revision" in receipt && Number(receipt.revision) > current.revision) throw new Error("Supabase has a newer snapshot from another writer. Use a distinct ROADLENZ_SUPABASE_SOURCE for each canonical database.");
    const latest = read<SyncState>(state, last);
    if (current.revision >= latest.revision) atomic(state, { revision: current.revision, lastSyncedAt: new Date().toISOString(), error: null });
  } catch (error) {
    const latest = read<SyncState>(state, last);
    if (current.revision >= latest.revision) atomic(state, { ...latest, error: error instanceof Error && !/fetch|abort/i.test(error.message) ? error.message : "Supabase is unreachable. Changes remain queued and will retry." });
  }
  return supabaseSyncStatus();
}
