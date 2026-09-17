import { NextRequest } from "next/server";
import { requireRole, jsonErr, jsonOk } from "@/lib/api";
import { readDb, listEntity, publishedOf } from "@/lib/db";

export async function GET(req: NextRequest) {
  const auth = requireRole(req, "customer");

  if (!auth.ok) {
    return auth.res;
  }

  try {
    const db = readDb();
    const customers = db.customers ?? {};
    const profile = customers[auth.session.userId] ?? null;
    const products = publishedOf(listEntity(db, "products"));

    const orders = (Array.isArray(db.orders) ? db.orders : [])
      .filter((order) => order.customerUserId === auth.session.userId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

    const invoices = (Array.isArray(db.invoices) ? db.invoices : [])
      .filter((invoice) => invoice.customerUserId === auth.session.userId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

    return jsonOk({ profile, products, orders, invoices });
  } catch (error) {
    console.error("[api/customer] GET failed", error);
    return jsonErr(500, "Could not load customer account.");
  }
}
