import { NextRequest } from "next/server";
import { requireRole, jsonOk, jsonErr } from "@/lib/api";
import { readDb, mutateDb } from "@/lib/db";
import type { CompanySettings } from "@/lib/types";

export async function GET(req: NextRequest) {
  const auth = requireRole(req, "admin");
  if (!auth.ok) return auth.res;
  return jsonOk({ settings: readDb().settings });
}

export async function PUT(req: NextRequest) {
  const auth = requireRole(req, "admin");
  if (!auth.ok) return auth.res;
  const body = await req.json().catch(() => null);
  if (!body) return jsonErr(400, "Invalid body.");
  mutateDb((db) => {
    const s = body as CompanySettings;
    db.settings = {
      ...db.settings,
      ...s,
      contact: { ...db.settings.contact, ...s.contact },
      social: s.social ?? db.settings.social,
      seo: { ...db.settings.seo, ...s.seo },
    };
  });
  return jsonOk({ ok: true });
}
