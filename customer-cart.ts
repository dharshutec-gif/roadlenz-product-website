import type { Db } from "./types";

export function customerCart(db: Db, userId: string) {
  const cart = db.customers[userId]?.cart || {};
  const items = Object.entries(cart).map(([productId, item]) => {
    const p = db.products.find(product => product.id === productId);
    return { productId, quantity: item.quantity, name: p?.name || "Unavailable product", slug: p?.slug || "", image: p?.image || "", price: p?.price || "Price on request", available: Boolean(p?.published && p.stockStatus !== "discontinued" && p.stockStatus !== "out-of-stock"), stockQuantity: p?.trackInventory ? p.stockQuantity : undefined };
  });
  return { cart, items, count: items.reduce((count, item) => count + item.quantity, 0) };
}

export function updateCustomerCart(db: Db, userId: string, body: { productId?: unknown; action?: unknown; quantity?: unknown }) {
  const profile = db.customers[userId];
  if (!profile) throw new Error("Customer account not found.");
  const id = typeof body.productId === "string" ? body.productId : "";
  const action = body.action;
  if (!id || !["add", "set", "remove"].includes(String(action))) throw new Error("Choose a product and a valid cart action.");
  const cart = { ...profile.cart };
  if (action === "remove") { delete cart[id]; profile.cart = cart; return customerCart(db, userId); }
  const requested = body.quantity;
  if (typeof requested !== "number" || !Number.isInteger(requested) || requested < 1 || requested > 999) throw new Error("Quantity must be between 1 and 999.");
  const product = db.products.find(p => p.id === id && p.published);
  if (!product || ["out-of-stock", "discontinued"].includes(product.stockStatus || "")) throw new Error("This product is currently unavailable.");
  const quantity = action === "add" ? (cart[id]?.quantity || 0) + requested : requested;
  if (quantity > 999 || (product.trackInventory && quantity > (product.stockQuantity || 0))) throw new Error("The requested quantity exceeds availability.");
  if (!cart[id] && Object.keys(cart).length >= 100) throw new Error("Your cart can contain up to 100 products.");
  cart[id] = { quantity }; profile.cart = cart;
  return customerCart(db, userId);
}
