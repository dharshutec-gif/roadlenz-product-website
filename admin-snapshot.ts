import "server-only";
import type { SessionInfo } from "./auth";
import type { Db, CustomerProfile } from "./types";
import type { AdminSnapshot, AdminCustomer, AdminRequestRecord, AdminNotification, AdminStore } from "./admin-types";
import { isPrimaryAdminEmail } from "./admin-primary";
import { supabaseSyncStatus } from "./supabase-sync";

const text = (value: unknown) => typeof value === "string" ? value : typeof value === "number" ? String(value) : "";
const record = (value: unknown): Record<string, unknown> => value && typeof value === "object" ? value as Record<string, unknown> : {};
const newest = <T extends { createdAt: string }>(rows: T[]) => [...rows].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
/** Defensive serialization also strips accidental legacy credential fields nested in records. */
function safeCopy<T>(value: T): T {
  if (Array.isArray(value)) return value.map(item => safeCopy(item)) as T;
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).filter(([key]) => !/^(password(?:hash)?|temporaryPassword|token|accessToken|refreshToken|sessionToken|sessions|secret|apiKey|serviceRoleKey)$/i.test(key)).map(([key, nested]) => [key, safeCopy(nested)])) as T;
  }
  return value;
}
function storeOf(db: Db): AdminStore {
  return db.admin ?? { inventoryHistory: [], quotations: [], media: [], activity: [], notificationReads: {}, quotationDefaults: { gstRate: 18, validityDays: 30, paymentTerms: "", deliveryTerms: "", terms: "" } };
}
function normalizeProfile(profile: CustomerProfile | undefined): CustomerProfile | null {
  if (!profile) return null;
  return safeCopy({ ...profile, registeredProducts: profile.registeredProducts || [], savedProductSlugs: profile.savedProductSlugs || [], quotes: profile.quotes || [], tickets: profile.tickets || [], installations: profile.installations || [], warranties: profile.warranties || [], notifications: profile.notifications || [], addresses: profile.addresses || [] });
}
export function adminCustomers(db: Db): AdminCustomer[] {
  const store = storeOf(db);
  return newest(db.users.filter(user => user.role === "customer").map(user => {
    const profile = normalizeProfile(db.customers[user.id]);
    return { lastLoginAt: user.lastLoginAt, id: user.id, name: profile?.name || user.name, company: profile?.company || user.company || "", email: profile?.email || user.email,
      phone: profile?.phone || user.phone || "", createdAt: user.createdAt, active: user.active !== false, fleetSize: user.fleetSize || text(record(profile).fleetSize),
      internalNotes: user.internalNotes || "", profile, orders: newest(db.orders.filter(order => order.customerUserId === user.id)),
      quotations: newest(store.quotations.filter(quote => quote.customerUserId === user.id)) };
  }));
}
function normalizedRequest(value: unknown, kind: AdminRequestRecord["kind"], customer?: AdminCustomer): AdminRequestRecord {
  const row = record(value);
  return { id: text(row.id), kind, ref: text(row.ref) || text(row.id), name: text(row.name) || customer?.name || "", company: text(row.company) || customer?.company || "",
    email: text(row.email) || customer?.email || "", phone: text(row.phone) || customer?.phone || "", message: text(row.message) || text(row.description) || text(row.subject),
    status: text(row.status), createdAt: text(row.createdAt), date: text(row.date), timeSlot: text(row.timeSlot) || text(row.time), fleetSize: text(row.fleetSize) || customer?.fleetSize || "",
    topics: text(row.topics) || text(row.products) || text(row.subject), assignedAdminId: text(row.assignedAdminId), internalNotes: text(row.internalNotes),
    followUpDate: text(row.followUpDate), priority: text(row.priority) === "medium" ? "normal" : text(row.priority) || "normal",
    ...(customer ? { customerUserId: customer.id } : {}) };
}
export function adminSnapshot(db: Db, session: SessionInfo): AdminSnapshot {
  if (session.role !== "admin") throw new Error("Administrator access required.");
  const user = db.users.find(item => item.id === session.userId && item.role === "admin" && item.active !== false);
  if (!user) throw new Error("Administrator access required.");
  const store = storeOf(db), customers = adminCustomers(db), products = [...db.products].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  const byEmail = new Map(customers.map(customer => [customer.email.toLowerCase(), customer]));
  const requests = newest([
    ...db.demos.map(row => normalizedRequest(row, "demo", byEmail.get(row.email.toLowerCase()))),
    ...db.quotes.map(row => normalizedRequest(row, "quote", byEmail.get(row.email.toLowerCase()))),
    ...db.messages.map(row => normalizedRequest(row, "message", byEmail.get(row.email.toLowerCase()))),
    ...customers.flatMap(customer => (customer.profile?.tickets || []).map(ticket => normalizedRequest(ticket, "support", customer))),
  ]);
  const quotations = newest(store.quotations), orders = newest(db.orders);
  const tracked = products.filter(product => product.trackInventory);
  const stockStatus = (product: typeof products[number]) => (product.stockQuantity || 0) <= 0 ? "out-of-stock" : (product.stockQuantity || 0) <= (product.lowStockThreshold || 0) ? "low-stock" : "in-stock";
  const pendingIds = new Set(quotations.filter(quote => ["draft", "sent"].includes(quote.status)).map(quote => quote.id));
  customers.forEach(customer => customer.profile?.quotes.forEach(quote => { if (quote.status === "pending" && !quotations.some(item => item.id === quote.id)) pendingIds.add(quote.id); }));
  const readIds = new Set(store.notificationReads[session.userId] || []);
  const notifications: AdminNotification[] = [];
  const notify = (id: string, title: string, createdAt: string, href: string) => notifications.push({ id, title, createdAt, href, read: readIds.has(id) });
  db.messages.filter(message => message.emailDelivery && message.emailDelivery.status !== "sent").forEach(message => notify(`email:${message.id}`, `Enquiry email ${message.emailDelivery?.status === "failed" ? "failed" : "pending"}: ${message.ref}`, message.createdAt, "/admin/requests"));
  customers.forEach(customer => notify(`customer:${customer.id}`, `New customer: ${customer.name}`, customer.createdAt, `/admin/customers/${customer.id}`));
  requests.filter(request => ["new", "open"].includes(request.status)).forEach(request => notify(`${request.kind}:${request.id}`, `${request.kind === "demo" ? "Demo booking" : request.kind === "support" ? "Support request" : request.kind === "quote" ? "Quote request" : "New enquiry"}: ${request.name || request.ref}`, request.createdAt, request.kind === "demo" ? "/admin/demo-requests" : request.kind === "support" ? "/admin/support" : "/admin/requests"));
  tracked.filter(product => stockStatus(product) !== "in-stock").forEach(product => notify(`stock:${product.id}:${stockStatus(product)}:${product.updatedAt}`, `${stockStatus(product) === "out-of-stock" ? "Out of stock" : "Low stock"}: ${product.name}`, product.updatedAt, "/admin/inventory"));
  return safeCopy({ updatedAt: db.updatedAt, session: { userId: user.id, name: user.name, email: user.email, adminRole: isPrimaryAdminEmail(user.email) || user.adminRole === "SUPER_ADMIN" ? "SUPER_ADMIN" : "ADMIN" },
    metrics: { totalProducts: products.length, publishedProducts: products.filter(product => product.published).length, draftProducts: products.filter(product => !product.published).length,
      lowStock: tracked.filter(product => stockStatus(product) === "low-stock").length, outOfStock: tracked.filter(product => stockStatus(product) === "out-of-stock").length,
      totalCustomers: customers.length, pendingQuotations: pendingIds.size + requests.filter(request => request.kind === "quote" && ["new", "contacted", "open", "in-progress"].includes(request.status)).length,
      demoRequests: requests.filter(request => request.kind === "demo" && !["completed", "cancelled"].includes(request.status)).length,
      newEnquiries: requests.filter(request => request.kind === "message" && request.status === "new").length, orders: orders.length,
      orderValue: orders.filter(order => order.status !== "cancelled").reduce((sum, order) => sum + order.total, 0) },
    products, categories: [...db.productCategories].sort((a, b) => a.order - b.order), customers, requests, quotations, orders,
    inventoryHistory: newest(store.inventoryHistory), media: newest(store.media), activity: newest(store.activity), settings: db.settings,
    quotationDefaults: store.quotationDefaults, notifications: newest(notifications).slice(0, 200), sync: supabaseSyncStatus() });
}
