import { NextRequest } from "next/server";
import { requireRole, jsonOk, jsonErr } from "@/lib/api";
import { readDb, mutateDb } from "@/lib/db";

export async function POST(req: NextRequest) {
  const auth = requireRole(req, "customer");
  if (!auth.ok) return auth.res;
  const body = await req.json().catch(() => null);
  const subject = String(body?.subject ?? "").trim();
  const description = String(body?.description ?? "").trim();
  if (!subject || !description) return jsonErr(400, "Subject and description are required.");
  const db = readDb();
  const profile = db.customers[auth.session.userId];
  if (!profile) return jsonErr(404, "No customer workspace found.");
  const ref = `T-${String(2000 + Math.floor(Math.random() * 7999))}`;
  const ticket = {
    id: `ticket_${Math.random().toString(36).slice(2, 8)}`,
    order: profile.tickets.length + 1,
    published: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    kind: "ticket" as const,
    ref,
    subject,
    description,
    status: "open" as const,
    priority: "medium" as const,
    replies: [],
  };
  mutateDb((d) => {
    const p = d.customers[auth.session.userId];
    p.tickets.push(ticket);
    const nowIso = new Date().toISOString();
    p.notifications.unshift({
      id: `notif_${Math.random().toString(36).slice(2, 8)}`,
      order: 1,
      published: true,
      createdAt: nowIso,
      updatedAt: nowIso,
      kind: "notification",
      text: `Ticket ${ref} created — our support team will respond shortly.`,
      read: false,
    });
    p.notifications.forEach((n, i) => (n.order = i + 1));
  });
  return jsonOk({ ticket, ref }, { status: 201 });
}
