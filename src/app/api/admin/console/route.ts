import type { NextRequest } from "next/server";
import { requireRole, jsonOk, jsonErr } from "@/lib/api";
import { readDb } from "@/lib/db";
import { adminSnapshot } from "@/lib/admin-snapshot";
import { flushSupabaseQueue } from "@/lib/supabase-sync";
export const dynamic = "force-dynamic";
export async function GET(req: NextRequest) {
  const auth = requireRole(req, "admin");
  if (!auth.ok) return auth.res;
  try {
    await flushSupabaseQueue();
    return jsonOk(adminSnapshot(readDb(), auth.session), { headers: { "Cache-Control": "no-store, private" } });
  } catch { return jsonErr(500, "Could not load administration data. Please retry."); }
}
