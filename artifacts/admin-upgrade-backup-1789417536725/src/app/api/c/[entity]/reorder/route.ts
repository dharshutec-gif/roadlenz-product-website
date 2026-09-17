import { NextRequest } from "next/server";
import { requireRole, isEntityKey, jsonOk, jsonErr } from "@/lib/api";

export async function POST(req: NextRequest, { params }: { params: Promise<{ entity: string }> }) {
  const { entity } = await params;
  if (!isEntityKey(entity)) return jsonErr(404, "Unknown entity.");
  const auth = requireRole(req, "admin");
  if (!auth.ok) return auth.res;
  const body = await req.json().catch(() => null);
  const ids = Array.isArray(body?.ids) ? (body.ids as string[]) : null;
  if (!ids) return jsonErr(400, "ids array required.");
  const { mutateDb, reorderEntity } = await import("@/lib/db");
  mutateDb((db) => reorderEntity(db, entity, ids));
  return jsonOk({ ok: true });
}
