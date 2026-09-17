import { NextRequest } from "next/server";
import { requireRole, jsonOk } from "@/lib/api";
import { readDb, mutateDb } from "@/lib/db";

export async function POST(req: NextRequest) {
  const auth = requireRole(req, "customer");
  if (!auth.ok) return auth.res;
  const db = readDb();
  const profile = db.customers[auth.session.userId];
  if (!profile) return jsonOk({ ok: false });
  mutateDb((d) => {
    const p = d.customers[auth.session.userId];
    p.notifications.forEach((n) => (n.read = true));
  });
  return jsonOk({ ok: true });
}
