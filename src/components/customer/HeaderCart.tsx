"use client";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCustomerCart } from "./useCustomerCart";
export default function HeaderCart() {
  const { count } = useCustomerCart();
  return <Link href="/cart" title="Your cart" aria-label={`Cart, ${count} items`} className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-slate-200 text-[#172f4d] hover:bg-sky-50"><ShoppingCart size={21}/>{count > 0 && <span className="absolute -right-1 -top-2 rounded-full bg-blue-600 px-1.5 text-[10px] leading-5 text-white">{count}</span>}</Link>;
}
