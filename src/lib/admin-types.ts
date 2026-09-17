import type { AppUser, CustomerOrder, CustomerProfile, Db, Product, ProductCategory } from "./types";

export type AdminRole = "SUPER_ADMIN" | "ADMIN";
export type ProductView = "hero" | "front" | "left" | "right" | "rear" | "top" | "ports" | "installation" | "vehicle" | "accessories" | "other";
export interface ProductImage { id: string; src: string; sourceType: "upload" | "url"; viewType: ProductView; alt: string; order: number; primary?: boolean }
export interface InventoryAdjustment { id: string; productId: string; productName: string; actorId: string; actorName: string; previous: number; quantity: number; change: number; reason: string; notes: string; createdAt: string }
export interface MediaAsset { id: string; name: string; url: string; mimeType: string; size?: number; category: string; sourceType: "upload" | "url"; createdAt: string; updatedAt: string }
export interface AuditEntry { id: string; actorId: string; actorName: string; action: string; module: string; recordId: string; description: string; createdAt: string }
export type QuotationStatus = "draft" | "sent" | "accepted" | "rejected" | "expired" | "converted";
export interface QuotationLine { productSlug: string; description: string; quantity: number; unitPrice: number; discount: number; gstRate: number; lineTotal: number }
export interface AdminQuotation {
  id: string; number: string; customerUserId: string; customerName: string; company: string; email: string;
  date: string; validUntil: string; items: QuotationLine[]; subtotal: number; discount: number; gst: number;
  freight: number; installation: number; additionalCharges: number; total: number; status: QuotationStatus;
  terms: string; paymentTerms: string; deliveryTerms: string; internalNotes: string; customerNotes: string;
  createdAt: string; updatedAt: string; orderId?: string;
}
export interface AdminStore {
  inventoryHistory: InventoryAdjustment[]; quotations: AdminQuotation[]; media: MediaAsset[]; activity: AuditEntry[];
  notificationReads: Record<string, string[]>;
  quotationDefaults: { gstRate: number; validityDays: number; paymentTerms: string; deliveryTerms: string; terms: string };
}
export interface AdminCustomer {
  lastLoginAt?: string;
  id: string; name: string; company: string; email: string; phone: string; createdAt: string; active: boolean;
  fleetSize: string; internalNotes: string; profile: CustomerProfile | null; orders: CustomerOrder[];
  quotations: AdminQuotation[];
}
export interface AdminRequestRecord {
  id: string; kind: "demo" | "quote" | "message" | "support"; ref: string; name: string; company: string;
  email: string; phone: string; message: string; status: string; createdAt: string; date: string;
  timeSlot: string; fleetSize: string; topics: string; assignedAdminId: string; internalNotes: string;
  followUpDate: string; priority: string; customerUserId?: string;
}
export interface AdminNotification { id: string; title: string; createdAt: string; href: string; read: boolean }
export interface SupabaseSyncStatus { configured: boolean; pending: boolean; lastSyncedAt: string | null; error: string | null }
export type PublicAdminUser = Omit<AppUser, "passwordHash"> & { adminRole: AdminRole; active: boolean; primary: boolean };
export interface AdminSnapshot {
  updatedAt: string; session: { userId: string; name: string; email: string; adminRole: AdminRole };
  metrics: Record<string, number>; products: Product[]; categories: ProductCategory[]; customers: AdminCustomer[];
  requests: AdminRequestRecord[]; quotations: AdminQuotation[]; orders: CustomerOrder[];
  inventoryHistory: InventoryAdjustment[]; media: MediaAsset[]; activity: AuditEntry[];
  settings: Db["settings"]; quotationDefaults: AdminStore["quotationDefaults"];
  notifications: AdminNotification[]; sync: SupabaseSyncStatus;
}
