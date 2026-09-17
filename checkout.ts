import type { Db } from "./types";

export const PAYMENT_METHODS = [
  { id: "upi", label: "UPI", description: "Pay using your UPI app." },
  { id: "netbanking", label: "Net Banking", description: "Pay through your bank." },
  { id: "card", label: "Credit / Debit Card", description: "Pay using your card." },
] as const;

/** Strict INR parsing: never interpret ranges or quotation text as a payable amount. */
export function priceInPaise(value: string): number | null {
  const normalized = value.trim().replace(/^(?:INR|Rs\.?)\s*/i, "").replace(/^₹\s*/, "");
  if (!/^(?:\d+|\d{1,3}(?:,\d{3})+|\d{1,2}(?:,\d{2})*,\d{3})(?:\.\d{1,2})?$/.test(normalized)) return null;
  const [whole, fraction = ""] = normalized.replace(/,/g, "").split(".");
  const amount = Number(whole) * 100 + Number(fraction.padEnd(2, "0"));
  return Number.isSafeInteger(amount) && amount > 0 ? amount : null;
}
export function checkoutSummary(db: Db, userId: string) {
  const items = Object.entries(db.customers[userId]?.cart ?? {}).map(([productId, item]) => {
    const p = db.products.find(product => product.id === productId);
    const validQuantity = Number.isSafeInteger(item.quantity) && item.quantity > 0 && item.quantity <= 999;
    const available = Boolean(validQuantity && p?.published && !["out-of-stock", "discontinued"].includes(p.stockStatus ?? "") && (!p.trackInventory || item.quantity <= (p.stockQuantity ?? 0)));
    const unitAmount = p && !p.priceOnRequest ? priceInPaise(p.price) : null;
    const lineAmount = unitAmount !== null && validQuantity && Number.isSafeInteger(unitAmount * item.quantity) ? unitAmount * item.quantity : null;
    return { productId, name: p?.name ?? "Unavailable product", slug: p?.slug ?? "", image: p?.image ?? "", quantity: item.quantity, unitAmount, lineAmount, available };
  });
  const sum = items.reduce((total, item) => total + (item.lineAmount ?? 0), 0);
  const subtotal = items.length && items.every(item => item.lineAmount !== null) && Number.isSafeInteger(sum) ? sum : null;
  return { currency: "INR" as const, items, subtotal, paymentEnabled: false as const, methods: PAYMENT_METHODS, needsQuotation: items.some(item => item.lineAmount === null), hasUnavailableItems: items.some(item => !item.available) };
}
export type CheckoutSummary = ReturnType<typeof checkoutSummary>;
