"use client";

import Link from "next/link";
import { useState } from "react";
import { Icon } from "@/components/ui";

export default function ProductPurchasePanel({ name, slug, price, priceNote }: { name: string; slug: string; price: string; priceNote: string }) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const quoteHref = `/request-quote?product=${encodeURIComponent(name)}&qty=${quantity}`;

  return (
    <aside className="rounded-2xl border border-line bg-white p-5 shadow-card sm:p-6">
      <div className="flex items-start justify-between gap-4 border-b border-line pb-5">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-ink-faint">From</p>
          <p className="mt-1 font-display text-2xl font-extrabold text-ink">{price}</p>
          <p className="mt-1 text-xs leading-relaxed text-ink-muted">{priceNote}</p>
          <p className="mt-1 text-[11px] text-ink-faint">GST and installation, where applicable, are confirmed at quotation.</p>
        </div>
        <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-[11px] font-bold text-emerald-700">Fleet-ready</span>
      </div>

      <div className="mt-5 flex items-center justify-between gap-4">
        <div><p className="text-sm font-bold text-ink">Quantity</p><p className="text-xs text-ink-muted">For your enquiry</p></div>
        <div className="flex items-center rounded-xl border border-line bg-mist-50">
          <button type="button" aria-label="Decrease quantity" onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="p-2.5 text-ink-soft hover:text-brand-700"><Icon name="minus" className="h-4 w-4" /></button>
          <span className="min-w-9 text-center text-sm font-bold text-ink">{quantity}</span>
          <button type="button" aria-label="Increase quantity" onClick={() => setQuantity((q) => q + 1)} className="p-2.5 text-ink-soft hover:text-brand-700"><Icon name="plus" className="h-4 w-4" /></button>
        </div>
      </div>

      <div className="mt-5 grid gap-2">
        <button type="button" onClick={() => setAdded(true)} className="btn-primary min-h-12 justify-center !rounded-lg"><Icon name="plus" className="h-4 w-4" />{added ? "Added to Enquiry" : "Add to Enquiry"}</button>
        <div className="grid gap-2 sm:grid-cols-2"><Link href={quoteHref} className="btn-ghost min-h-11 justify-center !rounded-lg !px-3">Request Quote</Link><Link href={`/contact?product=${encodeURIComponent(slug)}`} className="btn-ghost min-h-11 justify-center !rounded-lg !px-3">Talk to an Expert</Link></div>
        <Link href={`/book-demo?product=${encodeURIComponent(slug)}`} className="flex min-h-11 items-center justify-center gap-2 text-sm font-bold text-brand-700 hover:underline"><Icon name="calendar" className="h-4 w-4" />Request Demo</Link>
      </div>
      {added && <p role="status" className="mt-3 rounded-xl bg-brand-50 px-3 py-2 text-xs font-semibold text-brand-700">{name} × {quantity} is ready for your quote request.</p>}
    </aside>
  );
}
