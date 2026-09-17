import { NextRequest } from "next/server";
import { requireRole, jsonOk, jsonErr } from "@/lib/api";
import { readDb, mutateDb } from "@/lib/db";
import { customerCart, updateCustomerCart } from "@/lib/customer-cart";

export async function GET(req: NextRequest) {
  const auth = requireRole(req, "customer");
  if (!auth.ok) return auth.res;
  return jsonOk(customerCart(readDb(), auth.session.userId), { headers: { "Cache-Control": "no-store" } });
}
export async function POST(req: NextRequest) {
  const auth = requireRole(req, "customer");
  if (!auth.ok) return auth.res;
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") return jsonErr(400, "Invalid cart request.");
  try { return jsonOk(mutateDb(db => updateCustomerCart(db, auth.session.userId, body)), { headers: { "Cache-Control": "no-store" } }); }
  catch (error) { return jsonErr(400, error instanceof Error ? error.message : "Could not update cart."); }
}
