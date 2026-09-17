import type { NextRequest } from "next/server";
import { requireRole, jsonErr, jsonOk } from "@/lib/api";
import { readDb } from "@/lib/db";
import { adminCustomers } from "@/lib/admin-snapshot";
export const dynamic = "force-dynamic";
export async function GET(req: NextRequest) {
  const auth = requireRole(req, "admin");
  if (!auth.ok) return auth.res;
  try {
    const db = readDb();
    const customers = adminCustomers(db).map(customer => {
      const totalSpend = customer.orders.filter(order => order.status !== "cancelled").reduce((sum, order) => sum + order.total, 0);
      const pendingQuotes = new Set([...customer.quotations.filter(quote => ["draft", "sent"].includes(quote.status)).map(quote => quote.id), ...(customer.profile?.quotes.filter(quote => quote.status === "pending").map(quote => quote.id) || [])]).size;
      return { id: customer.id, name: customer.name, company: customer.company, email: customer.email, phone: customer.phone,
        active: customer.active, fleetSize: customer.fleetSize, registeredAt: customer.createdAt, createdAt: customer.createdAt,
        memberSince: customer.profile?.memberSince || customer.createdAt, plan: customer.profile?.plan || "", orderCount: customer.orders.length,
        quoteCount: new Set([...customer.quotations.map(quote => quote.id), ...(customer.profile?.quotes.map(quote => quote.id) || [])]).size,
        ticketCount: customer.profile?.tickets.length || 0, invoiceCount: db.invoices.filter(invoice => invoice.customerUserId === customer.id).length,
        pendingOrders: customer.orders.filter(order => !["delivered", "cancelled"].includes(order.status)).length,
        deliveredOrders: customer.orders.filter(order => order.status === "delivered").length, pendingQuotes,
        openTickets: customer.profile?.tickets.filter(ticket => !["resolved", "closed"].includes(ticket.status)).length || 0,
        totalSpend, orderValue: totalSpend };
    });
    return jsonOk({ customers, summary: { totalCustomers: customers.length, customersWithOrders: customers.filter(customer => customer.orderCount > 0).length,
      customersWithOpenOrders: customers.filter(customer => customer.pendingOrders > 0).length,
      customersWithPendingQuotes: customers.filter(customer => customer.pendingQuotes > 0).length,
      totalOrderValue: customers.reduce((sum, customer) => sum + customer.totalSpend, 0) } }, { headers: { "Cache-Control": "no-store, private" } });
  } catch { return jsonErr(500, "Could not load customers."); }
}
