import { NextRequest } from "next/server";
import { listEntity, createEntity } from "@/lib/db";
import { requireRole, isEntityKey, jsonOk, jsonErr, sanitizedEntityData } from "@/lib/api";
import { saveCategory, CatalogueError } from "@/lib/admin-catalogue";
import { recordAdminActivity } from "@/lib/admin-store";

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
  if (!body || typeof body !== "object" || Array.isArray(body)) return jsonErr(400, "Invalid body.");
  if (entity === "products") return jsonErr(409, "Use the Products editor to create products with validated media and inventory history.");
  const { mutateDb } = await import("@/lib/db");
  try {
    const item = mutateDb((db) => {
      if (entity === "productCategories") return saveCategory(db, body, auth.session);
      const created = createEntity(db, entity, sanitizedEntityData(entity, body));
      recordAdminActivity(db, auth.session, "create", entity, created.id, `Created ${entity} record.`);
      return created;
    });
    return jsonOk({ item }, { status: 201 });
  } catch (error) { if (error instanceof CatalogueError) return jsonErr(error.status, error.message); throw error; }
}
