"use client";
import { useCallback, useEffect, useState } from "react";
export type CartItem = { productId: string; quantity: number; name: string; slug: string; image: string; price: string; available: boolean; stockQuantity?: number };
type Cart = { cart: Record<string, { quantity: number }>; items: CartItem[]; count: number };
const empty: Cart = { cart: {}, items: [], count: 0 };
export function useCustomerCart() {
  const [data, setData] = useState<Cart>(empty);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [signedIn, setSignedIn] = useState(false);
  const refresh = useCallback(async () => {
    try { const response = await fetch("/api/customer/cart", { cache: "no-store" });
      if (response.status === 401 || response.status === 403) { setData(empty); setSignedIn(false); return; }
      if (!response.ok) throw new Error("Could not load your cart.");
      setData(await response.json()); setSignedIn(true);
    } catch { setError("Could not load your cart. Please try again."); } finally { setLoading(false); }
  }, []);
  useEffect(() => { void refresh(); const update = () => { void refresh(); }; window.addEventListener("roadlenz-cart-updated", update); window.addEventListener("roadlenz:auth-changed", update); window.addEventListener("focus", update); return () => { window.removeEventListener("roadlenz-cart-updated", update); window.removeEventListener("roadlenz:auth-changed", update); window.removeEventListener("focus", update); }; }, [refresh]);
  const change = async (productId: string, action: "add" | "set" | "remove", quantity = 1) => {
    if (busy) return;
    setBusy(true); setError("");
    try { const response = await fetch("/api/customer/cart", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ productId, action, quantity }) });
      if (response.status === 401) { setData(empty); window.location.assign("/customer-login?next=/cart"); return; }
      const body = await response.json(); if (!response.ok) throw new Error(body.error || "Could not update cart.");
      setData(body); window.dispatchEvent(new Event("roadlenz-cart-updated"));
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Could not update cart."); } finally { setBusy(false); }
  };
  return { ...data, error, busy, loading, signedIn, change, refresh };
}
