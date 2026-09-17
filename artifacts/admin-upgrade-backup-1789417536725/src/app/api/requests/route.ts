import { NextRequest } from "next/server";
import { jsonOk, jsonErr } from "@/lib/api";
import { mutateDb, createEntity } from "@/lib/db";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) return jsonErr(400, "Invalid request.");
  const type = String(body.type ?? "");
  if (!["quote", "demo", "message"].includes(type)) return jsonErr(400, "Unknown request type.");

  let item;
  let ref: string;
  if (type === "quote") {
    ref = `Q-${new Date().getFullYear()}-${String(Math.floor(1000 + Math.random() * 9000))}`;
    item = {
      kind: "quote", ref,
      name: String(body.name ?? ""),
      company: String(body.company ?? ""),
      email: String(body.email ?? ""),
      phone: String(body.phone ?? ""),
      fleetSize: String(body.fleetSize ?? ""),
      vehicleTypes: String(body.vehicleTypes ?? ""),
      products: String(body.products ?? ""),
      message: String(body.message ?? ""),
      status: "new",
    };
  } else if (type === "demo") {
    ref = `D-${new Date().getFullYear()}-${String(Math.floor(1000 + Math.random() * 9000))}`;
    item = {
      kind: "demo", ref,
      name: String(body.name ?? ""),
      company: String(body.company ?? ""),
      email: String(body.email ?? ""),
      phone: String(body.phone ?? ""),
      date: String(body.date ?? ""),
      duration: String(body.duration ?? ""),
      topics: String(body.topics ?? ""),
      message: String(body.message ?? ""),
      status: "new",
    };
  } else {
    ref = `M-${new Date().getFullYear()}-${String(Math.floor(1000 + Math.random() * 9000))}`;
    item = {
      kind: "message", ref,
      name: String(body.name ?? ""),
      email: String(body.email ?? ""),
      phone: String(body.phone ?? ""),
      subject: String(body.subject ?? ""),
      message: String(body.message ?? ""),
      status: "new",
    };
  }
  const key = type === "quote" ? "quotes" : type === "demo" ? "demos" : "messages";
  mutateDb((db) => createEntity(db, key as "quotes", item));
  return jsonOk({ ok: true, ref }, { status: 201 });
}
