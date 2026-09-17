import { NextRequest } from "next/server";
import { requireRole, isEntityKey, jsonOk, jsonErr, sanitizedEntityData } from "@/lib/api";

export async function GET(_req: NextRequest, ctx: { params: Promise<{ entity: string; id: string }> }) {
  const { entity, id } = await ctx.params;
  if (!isEntityKey(entity)) return jsonErr(404, "Unknown entity.");
  const auth = requireRole(_req, "admin");
  if (!auth.ok) return auth.res;
  const { readDb, listEntity } = await import("@/lib/db");
  const db = readDb();
  const item = listEntity(db, entity).find((i) => i.id === id);
  if (!item) return jsonErr(404, "Not found.");
  return jsonOk({ item });
}

export async function PUT(req: NextRequest, ctx: { params: Promise<{ entity: string; id: string }> }) {
  const { entity, id } = await ctx.params;
  if (!isEntityKey(entity)) return jsonErr(404, "Unknown entity.");
  const auth = requireRole(req, "admin");
  if (!auth.ok) return auth.res;
  const body = await req.json().catch(() => null);
  if (!body) return jsonErr(400, "Invalid body.");
  const { mutateDb, updateEntity } = await import("@/lib/db");
  const item = mutateDb((db) => updateEntity(db, entity, id, sanitizedEntityData(entity, body)));
  if (!item) return jsonErr(404, "Not found.");
  return jsonOk({ item });
}

export async function DELETE(_req: NextRequest, ctx: { params: Promise<{ entity: string; id: string }> }) {
  const { entity, id } = await ctx.params;
  if (!isEntityKey(entity)) return jsonErr(404, "Unknown entity.");
  const auth = requireRole(_req, "admin");
  if (!auth.ok) return auth.res;
  const { mutateDb, deleteEntity } = await import("@/lib/db");
  const ok = mutateDb((db) => deleteEntity(db, entity, id));
  if (!ok) return jsonErr(404, "Not found.");
  return jsonOk({ ok: true });
}
