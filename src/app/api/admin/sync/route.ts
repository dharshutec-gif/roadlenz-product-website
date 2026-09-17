import { NextRequest } from "next/server";
import { requireRole, jsonOk } from "@/lib/api";
import { readDb } from "@/lib/db";
import { queueSupabaseSnapshot, flushSupabaseQueue, supabaseSyncStatus } from "@/lib/supabase-sync";

export async function GET(req: NextRequest) {
  const auth = requireRole(req, "admin");
  if (!auth.ok) return auth.res;
  return jsonOk(supabaseSyncStatus(), { headers: { "Cache-Control": "no-store" } });
}
export async function POST(req: NextRequest) {
  const auth = requireRole(req, "admin");
  if (!auth.ok) return auth.res;
  queueSupabaseSnapshot(readDb(true));
  return jsonOk(await flushSupabaseQueue(), { headers: { "Cache-Control": "no-store" } });
}
