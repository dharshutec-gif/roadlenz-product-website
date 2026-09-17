import "server-only";
import crypto from "node:crypto";
import type { Db, CustomerProfile, CustomerOrder, CustomerOrderItem, CompanySettings } from "./types";
import type { AdminQuotation, QuotationLine, QuotationStatus, AdminStore } from "./admin-types";
import { hashPassword } from "./auth";
import { adminStore, recordAdminActivity } from "./admin-store";
import { notifyCustomer } from "./enquiries";

export class AdminOperationError extends Error { constructor(message: string, public status = 400) { super(message); } }
const id = (prefix: string) => `${prefix}_${crypto.randomBytes(8).toString("hex")}`;
const text = (value: unknown, max = 5000) => typeof value === "string" ? value.trim().slice(0, max) : "";
const object = (value: unknown): Record<string, unknown> => value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
const money = (value: unknown, label: string) => {
  const number = Number(value ?? 0);
  if (!Number.isFinite(number) || number < 0 || number > 100000000) throw new AdminOperationError(`${label} must be a non-negative amount below 100,000,000.`);
  return Math.round(number * 100);
};
const statuses: QuotationStatus[] = ["draft", "sent", "accepted", "rejected", "expired", "converted"];

export function quotationTotals(input: unknown[], freightInput: unknown = 0, installationInput: unknown = 0, extraInput: unknown = 0) {
  if (!Array.isArray(input) || !input.length || input.length > 100) throw new AdminOperationError("Add between 1 and 100 quotation items.");
  let subtotal = 0, discount = 0, gst = 0;
  const items: QuotationLine[] = input.map(raw => {
    const line = object(raw), quantity = Number(line.quantity);
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 100000) throw new AdminOperationError("Item quantities must be positive whole numbers.");
    const unit = money(line.unitPrice, "Unit price"), reduction = money(line.discount, "Discount");
    const amount = unit * quantity, rate = Number(line.gstRate ?? 0);
    if (!Number.isFinite(rate) || rate < 0 || rate > 100 || reduction > amount) throw new AdminOperationError("Invalid GST rate or discount greater than line subtotal.");
    const tax = Math.round((amount - reduction) * rate / 100);
    subtotal += amount; discount += reduction; gst += tax;
    return { productSlug: text(line.productSlug, 180), description: text(line.description, 1000), quantity,
      unitPrice: unit / 100, discount: reduction / 100, gstRate: rate, lineTotal: (amount - reduction + tax) / 100 };
  });
  const freight = money(freightInput, "Freight"), installation = money(installationInput, "Installation"), additionalCharges = money(extraInput, "Additional charges");
  const total = subtotal - discount + gst + freight + installation + additionalCharges;
  if (!Number.isSafeInteger(total) || total > 100000000000) throw new AdminOperationError("Quotation total is too large.");
  return { items, subtotal: subtotal / 100, discount: discount / 100, gst: gst / 100, freight: freight / 100,
    installation: installation / 100, additionalCharges: additionalCharges / 100, total: total / 100 };
}

function ensureCustomerProfile(db: Db, userId: string): CustomerProfile {
  const user = db.users.find(user => user.id === userId && user.role === "customer");
  if (!user) throw new AdminOperationError("Customer not found.", 404);
  return db.customers[userId] ??= { userId, name: user.name, company: user.company, email: user.email, phone: user.phone,
    plan: "", memberSince: user.createdAt, registeredProducts: [], savedProductSlugs: [], quotes: [], tickets: [], installations: [],
    warranties: [], notifications: [], addresses: [], fleetPlatformUrl: "" };
}

function publishCustomerQuotation(db: Db, quotation: AdminQuotation) {
  const profile = ensureCustomerProfile(db, quotation.customerUserId);
  const previous = profile.quotes.findIndex(quote => quote.id === quotation.id);
  if (quotation.status === "draft") { if (previous >= 0) profile.quotes.splice(previous, 1); return; }
  const quote = { id: quotation.id, order: 0, published: true, createdAt: quotation.createdAt, updatedAt: quotation.updatedAt,
    kind: "customerQuote" as const, ref: quotation.number, item: quotation.items.map(item => item.description).join(", "),
    qty: quotation.items.reduce((sum, item) => sum + item.quantity, 0), amount: `₹${quotation.total.toFixed(2)}`,
    status: quotation.status === "converted" ? "delivered" as const : quotation.status === "accepted" ? "approved" as const : "pending" as const,
    quotationStatus: quotation.status, pdfUrl: `/api/customer/quotations/${quotation.id}/pdf` };
  if (previous < 0) profile.quotes.push(quote); else profile.quotes[previous] = quote;
}

export function performAdminOperation(db: Db, actor: { userId: string; name: string }, input: Record<string, unknown>): unknown {
  const action = text(input.action, 80), now = new Date().toISOString(), store = adminStore(db);
  const audit = (module: string, recordId: string, message: string) => recordAdminActivity(db, actor, action, module, recordId, message);
  if (action === "customer.create" || action === "customer.update") {
    const name = text(input.name, 150), email = text(input.email, 254).toLowerCase();
    if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new AdminOperationError("A name and valid email are required.");
    const existing = action === "customer.update" ? db.users.find(user => user.id === input.id && user.role === "customer") : undefined;
    if (action === "customer.update" && !existing) throw new AdminOperationError("Customer not found.", 404);
    if (db.users.some(user => user.email.toLowerCase() === email && user.id !== existing?.id)) throw new AdminOperationError("This email already belongs to an account.", 409);
    const password = typeof input.temporaryPassword === "string" ? input.temporaryPassword : "";
    if (password && (password.length < 10 || password.length > 256)) throw new AdminOperationError("Temporary passwords must contain 10 to 256 characters.");
    const user = existing ?? { id: id("user"), name, email, company: "", phone: "", role: "customer" as const,
      createdAt: now, active: Boolean(password), passwordHash: hashPassword(password || crypto.randomBytes(32).toString("hex")) };
    user.name = name; user.email = email; user.company = text(input.company, 200); user.phone = text(input.phone, 30);
    user.fleetSize = text(input.fleetSize, 100); user.internalNotes = text(input.internalNotes);
    if (typeof input.active === "boolean" && existing) user.active = input.active;
    if (password) { user.passwordHash = hashPassword(password); if (!existing) user.active = true; }
    if (!existing) db.users.push(user);
    const profile = ensureCustomerProfile(db, user.id);
    Object.assign(profile, { name: user.name, email: user.email, company: user.company, phone: user.phone });
    if (password || user.active === false) db.sessions = db.sessions.filter(session => session.userId !== user.id);
    audit("customers", user.id, `${existing ? "Updated" : "Created"} customer ${user.name}`);
    const { passwordHash: _passwordHash, ...safe } = user;
    return safe;
  }
  if (action === "request.update") {
    const kind = text(input.kind), requestId = text(input.id), customerId = text(input.customerUserId);
    const list = kind === "demo" ? db.demos : kind === "quote" ? db.quotes : kind === "message" ? db.messages :
      kind === "support" ? db.customers[customerId]?.tickets ?? [] : [];
    const request = list.find(item => item.id === requestId);
    if (!request) throw new AdminOperationError("Request not found.", 404);
    const allowed = kind === "demo" ? ["new", "contacted", "scheduled", "completed", "cancelled"] :
      kind === "quote" ? ["new", "contacted", "quoted", "closed", "open", "in-progress", "waiting-for-customer", "resolved"] :
      ["new", "open", "in-progress", "waiting-for-customer", "resolved", "closed", "replied"];
    const status = text(input.status);
    if (!allowed.includes(status)) throw new AdminOperationError("Unsupported request status.");
    const assignee = text(input.assignedAdminId);
    if (assignee && !db.users.some(user => user.id === assignee && user.role === "admin" && user.active !== false)) throw new AdminOperationError("Choose an active administrator.");
    const priority = text(input.priority) || "normal";
    if (!["low", "normal", "medium", "high", "urgent"].includes(priority)) throw new AdminOperationError("Unsupported priority.");
    const followUpDate = text(input.followUpDate, 10);
    if (followUpDate && !/^\d{4}-\d{2}-\d{2}$/.test(followUpDate)) throw new AdminOperationError("Invalid follow-up date.");
      const statusChanged = request.status !== status;
      Object.assign(request, { status, priority, assignedAdminId: assignee, internalNotes: text(input.internalNotes), followUpDate, updatedAt: now });
      if (kind === "message" && statusChanged) {
        const enquiry = db.messages.find(message => message.id === requestId);
        notifyCustomer(db, enquiry?.customerUserId, `Your enquiry ${request.ref} is now ${status.replaceAll("-", " ")}.`);
      }
    if (kind === "demo") {
      if (input.date !== undefined) Object.assign(request, { date: text(input.date, 10) });
      if (input.timeSlot !== undefined) Object.assign(request, { timeSlot: text(input.timeSlot, 100) });
    }
    audit("requests", requestId, `Updated ${kind} request ${request.ref} to ${status}`); return request;
  }
  if (action === "quotation.save") {
    const value = object(input.quotation), existing = value.id ? store.quotations.find(quote => quote.id === value.id) : undefined;
    if (value.id && !existing) throw new AdminOperationError("Quotation not found.", 404);
    if (existing?.status === "converted") throw new AdminOperationError("Converted quotations cannot be edited.", 409);
    const customerUserId = text(value.customerUserId), profile = ensureCustomerProfile(db, customerUserId);
    const status = text(value.status || existing?.status || "draft") as QuotationStatus;
    if (!statuses.includes(status) || status === "converted") throw new AdminOperationError("Invalid quotation status.");
    const totals = quotationTotals(Array.isArray(value.items) ? value.items : [], value.freight, value.installation, value.additionalCharges);
    if (totals.items.some(line => !line.description)) throw new AdminOperationError("Every quotation item needs a description.");
    const quoteId = existing?.id || id("quotation");
    const date = text(value.date, 10) || now.slice(0, 10);
    const defaultExpiry = new Date(`${date}T12:00:00Z`); defaultExpiry.setUTCDate(defaultExpiry.getUTCDate() + store.quotationDefaults.validityDays);
    if (Number.isNaN(defaultExpiry.getTime())) throw new AdminOperationError("Invalid quotation date.");
    const validUntil = text(value.validUntil, 10) || defaultExpiry.toISOString().slice(0, 10);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(validUntil) || validUntil < date) throw new AdminOperationError("Validity must end on or after the quotation date.");
    const quotation: AdminQuotation = { id: quoteId, number: existing?.number || `Q-${new Date().getFullYear()}-${quoteId.slice(-8).toUpperCase()}`,
      customerUserId, customerName: profile.name, company: profile.company, email: profile.email, date, validUntil, ...totals, status,
      terms: text(value.terms ?? store.quotationDefaults.terms), paymentTerms: text(value.paymentTerms ?? store.quotationDefaults.paymentTerms),
      deliveryTerms: text(value.deliveryTerms ?? store.quotationDefaults.deliveryTerms), internalNotes: text(value.internalNotes), customerNotes: text(value.customerNotes),
      createdAt: existing?.createdAt || now, updatedAt: now };
    if (existing) Object.assign(existing, quotation); else store.quotations.push(quotation);
    publishCustomerQuotation(db, quotation); audit("quotations", quoteId, `Saved ${quotation.number}`); return quotation;
  }
  if (["quotation.status", "quotation.duplicate", "quotation.convert"].includes(action)) {
    const quote = store.quotations.find(item => item.id === input.id);
    if (!quote) throw new AdminOperationError("Quotation not found.", 404);
    if (action === "quotation.duplicate") return performAdminOperation(db, actor, { action: "quotation.save", quotation: { ...quote, id: undefined, status: "draft", date: now.slice(0, 10), validUntil: "" } });
    if (action === "quotation.status") {
      const status = text(input.status) as QuotationStatus;
      if (!statuses.includes(status) || status === "converted" || quote.status === "converted") throw new AdminOperationError("Invalid quotation transition.");
      quote.status = status; quote.updatedAt = now; publishCustomerQuotation(db, quote);
      audit("quotations", quote.id, `${quote.number}: ${status}`); return quote;
    }
    if (quote.orderId) return db.orders.find(order => order.id === quote.orderId);
    if (quote.status !== "accepted") throw new AdminOperationError("Accept the quotation before converting it to an order.", 409);
    const orderId = id("order");
    const order: CustomerOrder = { id: orderId, orderNumber: `RL-${new Date().getFullYear()}-${orderId.slice(-8).toUpperCase()}`,
      customerUserId: quote.customerUserId, createdAt: now, updatedAt: now, status: "pending", paymentStatus: "pending", currency: "INR",
      items: quote.items.map(item => ({ productSlug: item.productSlug, name: item.description, quantity: item.quantity,
        unitAmount: item.unitPrice, gstRate: item.gstRate, discount: item.discount })), subtotal: quote.subtotal, gst: quote.gst,
      shipping: quote.freight, total: quote.total, notes: quote.customerNotes, discount: quote.discount,
      installation: quote.installation, additionalCharges: quote.additionalCharges, quotationId: quote.id };
    db.orders.push(order); quote.orderId = orderId; quote.status = "converted"; quote.updatedAt = now;
    publishCustomerQuotation(db, quote); audit("orders", orderId, `Converted ${quote.number} to ${order.orderNumber}`); return order;
  }
  if (action === "order.save") {
    const value = object(input.order), order = db.orders.find(item => item.id === value.id);
    if (!order) throw new AdminOperationError("Order not found.", 404);
    if (value.status !== undefined && !["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"].includes(text(value.status))) throw new AdminOperationError("Invalid order status.");
    if (value.paymentStatus !== undefined && !["pending", "paid", "failed", "refunded"].includes(text(value.paymentStatus))) throw new AdminOperationError("Invalid payment status.");
    for (const key of ["status", "paymentStatus", "courier", "trackingNumber", "expectedDelivery", "deliveredAt", "shippingAddress", "notes"] as const) {
      if (value[key] !== undefined) Object.assign(order, { [key]: text(value[key]) });
    }
    order.updatedAt = now; audit("orders", order.id, `Updated ${order.orderNumber}`); return order;
  }
  if (action === "notifications.read") {
    const ids = Array.isArray(input.ids) ? input.ids.filter((value): value is string => typeof value === "string").slice(0, 1000) : [];
    store.notificationReads[actor.userId] = [...new Set([...(store.notificationReads[actor.userId] || []), ...ids])].slice(-5000);
    return { ok: true };
  }
  if (action === "settings.save") {
    const value = object(input.settings), settings = db.settings;
    for (const key of ["name", "legalName", "parentCompany", "tagline", "description", "footerNote"] as const) if (value[key] !== undefined) settings[key] = text(value[key]);
    for (const key of ["contact", "seo", "solutionsHero"] as const) {
      const nested = object(value[key]);
      for (const field of Object.keys(settings[key])) if (nested[field] !== undefined) Object.assign(settings[key], { [field]: text(nested[field]) });
    }
    if (Array.isArray(value.social)) settings.social = value.social.map(item => { const row = object(item); return { label: text(row.label, 60), href: text(row.href, 2000) }; }).filter(item => /^https?:\/\//i.test(item.href));
    if (value.support !== undefined) {
      const support = object(value.support);
      settings.support = { customerEmail: text(support.customerEmail, 254), customerPhone: text(support.customerPhone, 40), installationEmail: text(support.installationEmail, 254), technicalEmail: text(support.technicalEmail, 254) };
    }
    if (value.brand !== undefined) {
      const brand = object(value.brand);
      const safeLogo = (value: unknown) => { const url = text(value, 2000); if (url && !/^\/(?!\/)|^https?:\/\//i.test(url)) throw new AdminOperationError("Logo URLs must be local paths or HTTP(S) URLs."); return url; };
      settings.brand = { roadlenzLogo: safeLogo(brand.roadlenzLogo), companyLogo: safeLogo(brand.companyLogo) };
    }
    const defaults = object(input.quotationDefaults);
    if (defaults.gstRate !== undefined) { const rate = Number(defaults.gstRate); if (!Number.isFinite(rate) || rate < 0 || rate > 100) throw new AdminOperationError("GST must be between 0 and 100."); store.quotationDefaults.gstRate = rate; }
    if (defaults.validityDays !== undefined) { const days = Number(defaults.validityDays); if (!Number.isInteger(days) || days < 1 || days > 365) throw new AdminOperationError("Quotation validity must be 1 to 365 days."); store.quotationDefaults.validityDays = days; }
    for (const key of ["paymentTerms", "deliveryTerms", "terms"] as const) if (defaults[key] !== undefined) store.quotationDefaults[key] = text(defaults[key]);
    audit("settings", "company", "Updated company and quotation settings"); return { settings, quotationDefaults: store.quotationDefaults };
  }
  throw new AdminOperationError("Unknown operation.");
}
