import { NextRequest } from "next/server";
import { requireRole, jsonOk, jsonErr } from "@/lib/api";
import { readDb, mutateDb } from "@/lib/db";
import { performAdminOperation, AdminOperationError } from "@/lib/admin-operations";

export async function GET(req: NextRequest) {
  const auth = requireRole(req, "admin");
  if (!auth.ok) return auth.res;
  return jsonOk({ settings: readDb().settings });
}

export async function PUT(req: NextRequest) {
  const auth = requireRole(req, "admin");
  if (!auth.ok) return auth.res;
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object" || Array.isArray(body)) return jsonErr(400, "Invalid body.");
  try { mutateDb((db) => performAdminOperation(db, auth.session, { action: "settings.save", settings: body })); }
  catch (error) { if (error instanceof AdminOperationError) return jsonErr(error.status, error.message); throw error; }
  return jsonOk({ ok: true });
}
