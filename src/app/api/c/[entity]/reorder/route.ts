import { NextRequest } from "next/server";
import { requireRole, isEntityKey, jsonOk, jsonErr } from "@/lib/api";
import { recordAdminActivity } from "@/lib/admin-store";

export async function POST(req: NextRequest, { params }: { params: Promise<{ entity: string }> }) {
  const { entity } = await params;
  if (!isEntityKey(entity)) return jsonErr(404, "Unknown entity.");
  const auth = requireRole(req, "admin");
  if (!auth.ok) return auth.res;
  const body = await req.json().catch(() => null);
  const ids = Array.isArray(body?.ids) ? (body.ids as string[]) : null;
  if (!ids || ids.some(id => typeof id !== "string") || new Set(ids).size !== ids.length) return jsonErr(400, "Unique string IDs are required.");
  const { mutateDb, reorderEntity, listEntity, readDb } = await import("@/lib/db");
  const existing = new Set(listEntity(readDb(), entity).map(item => item.id));
  if (ids.some(id => !existing.has(id))) return jsonErr(400, "One or more records no longer exist. Refresh before reordering.");
  mutateDb((db) => { reorderEntity(db, entity, ids); recordAdminActivity(db, auth.session, "reorder", entity, "", `Reordered ${ids.length} records.`); });
  return jsonOk({ ok: true });
}
