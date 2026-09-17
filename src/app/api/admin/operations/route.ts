import { NextRequest } from "next/server";
import { requireRole, jsonOk, jsonErr } from "@/lib/api";
import { mutateDb } from "@/lib/db";
import { performAdminOperation, AdminOperationError } from "@/lib/admin-operations";
import { flushSupabaseQueue } from "@/lib/supabase-sync";

export async function POST(req: NextRequest) {
  const auth = requireRole(req, "admin");
  if (!auth.ok) return auth.res;
  const body: unknown = await req.json().catch(() => null);
  if (!body || typeof body !== "object" || Array.isArray(body)) return jsonErr(400, "Invalid request body.");
  try {
    const item = mutateDb(db => performAdminOperation(db, auth.session, body as Record<string, unknown>));
    const sync = await flushSupabaseQueue();
    return jsonOk({ ok: true, item, sync }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return jsonErr(error instanceof AdminOperationError ? error.status : 500, error instanceof AdminOperationError ? error.message : "Could not save this change. Please try again.");
  }
}
