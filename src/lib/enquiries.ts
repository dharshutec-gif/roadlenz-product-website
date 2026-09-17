import crypto from "node:crypto";
import type { Db, ContactMessage } from "./types";
import { createEntity } from "./db";

const categories = ["General Enquiry", "Product Enquiry", "Customer Support", "Installation Support", "Technical Support"];
export type EnquiryInput = { enquiryType: string; name: string; company: string; phone: string; email: string; fleetSize: string; message: string };
export function parseEnquiry(body: unknown): EnquiryInput {
  if (!body || typeof body !== "object" || Array.isArray(body)) throw new Error("Please provide your enquiry details.");
  const values = body as Record<string, unknown>;
  const limits: Record<keyof EnquiryInput, number> = { enquiryType: 80, name: 150, company: 200, phone: 40, email: 254, fleetSize: 80, message: 10000 };
  const input = {} as EnquiryInput;
  for (const key of Object.keys(limits) as (keyof EnquiryInput)[]) {
    if (values[key] !== undefined && typeof values[key] !== "string") throw new Error("Please check your enquiry details.");
    const value = String(values[key] ?? "").trim();
    if (value.length > limits[key]) throw new Error("One of your enquiry fields is too long.");
    input[key] = value;
  }
  if (!categories.includes(input.enquiryType) || !input.name || !input.message || !input.phone || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) throw new Error("Please enter your name, valid email, phone number and enquiry.");
  input.email = input.email.toLowerCase();
  return input;
}

export function notifyCustomer(db: Db, userId: string | undefined, text: string) {
  const profile = userId ? db.customers[userId] : undefined;
  if (!profile) return;
  const now = new Date().toISOString();
  profile.notifications.unshift({ id: `notification_${crypto.randomUUID()}`, kind: "notification", text, read: false, published: true, order: 0, createdAt: now, updatedAt: now });
}

export function saveEnquiry(db: Db, input: EnquiryInput, customerUserId?: string): ContactMessage {
  // Ownership comes only from the authenticated session, never a submitted email or user ID.
  const owner = db.users.find(user => user.id === customerUserId && user.role === "customer" && user.active !== false);
  const ref = `E-${new Date().getFullYear()}-${crypto.randomBytes(5).toString("hex").toUpperCase()}`;
  createEntity(db, "messages", { kind: "message", ...input, subject: input.enquiryType, status: "new", ref, customerUserId: owner?.id, emailDelivery: { status: "pending", attempts: 0 } });
  const saved = db.messages.find(message => message.ref === ref)!;
  notifyCustomer(db, owner?.id, `Your enquiry ${ref} has been received. Our team will follow up with you.`);
  return saved;
}
