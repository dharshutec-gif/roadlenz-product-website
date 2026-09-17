import { NextRequest } from "next/server";
import { requireRole, isEntityKey, jsonOk, jsonErr, sanitizedEntityData } from "@/lib/api";
import { saveCategory, deleteCatalogueRecord, CatalogueError } from "@/lib/admin-catalogue";
import { recordAdminActivity } from "@/lib/admin-store";

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
  if (!body || typeof body !== "object" || Array.isArray(body)) return jsonErr(400, "Invalid body.");
  if (entity === "products") return jsonErr(409, "Use the Products editor to update products with validated media and inventory history.");
  const { mutateDb, updateEntity } = await import("@/lib/db");
  try {
  const item = mutateDb((db) => {
    if (entity === "productCategories") return saveCategory(db, body, auth.session, id);
    const updated = updateEntity(db, entity, id, sanitizedEntityData(entity, body));
    if (updated) recordAdminActivity(db, auth.session, "update", entity, id, `Updated ${entity} record.`);
    return updated;
  });
  if (!item) return jsonErr(404, "Not found.");
  return jsonOk({ item });
  } catch (error) { if (error instanceof CatalogueError) return jsonErr(error.status, error.message); throw error; }
}

export async function DELETE(_req: NextRequest, ctx: { params: Promise<{ entity: string; id: string }> }) {
  const { entity, id } = await ctx.params;
  if (!isEntityKey(entity)) return jsonErr(404, "Unknown entity.");
  const auth = requireRole(_req, "admin");
  if (!auth.ok) return auth.res;
  const { mutateDb, deleteEntity } = await import("@/lib/db");
  try {
  const ok = mutateDb((db) => {
    if (entity === "products" || entity === "productCategories") return deleteCatalogueRecord(db, entity === "products" ? "products" : "categories", id, auth.session);
    const deleted = deleteEntity(db, entity, id);
    if (deleted) recordAdminActivity(db, auth.session, "delete", entity, id, `Deleted ${entity} record.`);
    return deleted;
  });
  if (!ok) return jsonErr(404, "Not found.");
  return jsonOk({ ok: true });
  } catch (error) { if (error instanceof CatalogueError) return jsonErr(error.status, error.message); throw error; }
}
