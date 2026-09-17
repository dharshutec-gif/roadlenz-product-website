import { NextRequest } from "next/server";
import { listEntity, createEntity } from "@/lib/db";
import { requireRole, isEntityKey, jsonOk, jsonErr, sanitizedEntityData } from "@/lib/api";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ entity: string }> }) {
  const { entity } = await params;
  if (!isEntityKey(entity)) return jsonErr(404, "Unknown entity.");
  const auth = requireRole(_req, "admin");
  if (!auth.ok) return auth.res;
  const { readDb } = await import("@/lib/db");
  const db = readDb();
  return jsonOk({ items: listEntity(db, entity) });
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ entity: string }> }) {
  const { entity } = await params;
  if (!isEntityKey(entity)) return jsonErr(404, "Unknown entity.");
  const auth = requireRole(req, "admin");
  if (!auth.ok) return auth.res;
  const body = await req.json().catch(() => null);
  if (!body) return jsonErr(400, "Invalid body.");
  const { mutateDb } = await import("@/lib/db");
  const item = mutateDb((db) => createEntity(db, entity, sanitizedEntityData(entity, body)));
  return jsonOk({ item }, { status: 201 });
}
