import { NextRequest } from "next/server";
import { requireRole, jsonOk, jsonErr } from "@/lib/api";
import { readDb } from "@/lib/db";
import { checkoutSummary } from "@/lib/checkout";

export async function GET(req: NextRequest) {
  const auth = requireRole(req, "customer");
  if (!auth.ok) return auth.res;
  return jsonOk(checkoutSummary(readDb(), auth.session.userId), { headers: { "Cache-Control": "no-store" } });
}
/** Intentionally unavailable until a gateway and verified payment lifecycle are implemented. */
export async function POST(req: NextRequest) {
  const auth = requireRole(req, "customer");
  if (!auth.ok) return auth.res;
  return jsonErr(503, "Online payments are not available yet. Please contact our team to purchase.");
}
