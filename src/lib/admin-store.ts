import type { Db } from "./types";
import type { AdminStore, AuditEntry } from "./admin-types";
import crypto from "node:crypto";

export function adminStore(db: Db): AdminStore {
  db.admin ??= {
    inventoryHistory: [], quotations: [], media: [], activity: [], notificationReads: {},
    quotationDefaults: { gstRate: 18, validityDays: 30, paymentTerms: "", deliveryTerms: "", terms: "" },
  };
  return db.admin;
}

export function recordAdminActivity(db: Db, actor: { userId: string; name: string }, action: string, module: string, recordId: string, description: string): AuditEntry {
  const entry = { id: `audit_${crypto.randomBytes(8).toString("hex")}`, actorId: actor.userId,
    actorName: actor.name, action, module, recordId, description, createdAt: new Date().toISOString() };
  adminStore(db).activity.push(entry);
  return entry;
}
