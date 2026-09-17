import { NextRequest } from "next/server";
import { requireRole, jsonOk, jsonErr } from "@/lib/api";
import { readDb, mutateDb } from "@/lib/db";

export async function POST(req: NextRequest) {
  const auth = requireRole(req, "customer");
  if (!auth.ok) return auth.res;
  const body = await req.json().catch(() => null);
  const slug = String(body?.slug ?? "");
  if (!slug) return jsonErr(400, "slug required.");
  const db = readDb();
  const profile = db.customers[auth.session.userId];
  if (!profile) return jsonErr(404, "No customer workspace found.");
  const has = profile.savedProductSlugs.includes(slug);
  mutateDb((d) => {
    const p = d.customers[auth.session.userId];
    p.savedProductSlugs = has ? p.savedProductSlugs.filter((s) => s !== slug) : [...p.savedProductSlugs, slug];
  });
  return jsonOk({ saved: !has });
}
