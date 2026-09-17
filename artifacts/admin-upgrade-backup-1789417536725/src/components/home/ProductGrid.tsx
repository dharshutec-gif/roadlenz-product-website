"use client";

import React from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Icon, Reveal, SectionHeading, SmartImage } from "../ui";
import type { Product } from "@/lib/types";

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.article
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, delay: (index % 4) * 0.06 }}
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-line bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-lift"
    >
      <Link href={`/products/${product.slug}`} className="flex h-full flex-col" aria-label={product.name}>
        <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-b from-mist-100 to-mist-200">
          <SmartImage
            src={product.image}
            alt={product.name}
            className="h-full w-full object-contain p-6 mix-blend-multiply transition-transform duration-700 ease-out group-hover:scale-[1.06]"
          />
          <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[10.5px] font-bold uppercase tracking-wider text-brand-700 shadow-card backdrop-blur">
            {product.category}
          </span>
        </div>
        <div className="flex flex-1 flex-col p-5">
          <h3 className="font-display text-lg font-bold text-ink transition group-hover:text-brand-700">{product.name}</h3>
          <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-ink-muted">{product.tagline}</p>
          <div className="mt-auto flex items-center justify-between pt-5">
            <span className="text-sm font-bold text-ink">{product.price}</span>
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink-soft transition-all duration-300 group-hover:border-brand-600 group-hover:bg-brand-600 group-hover:text-white">
              <Icon name="arrowUpRight" className="h-4 w-4" />
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

export default function ProductGrid({ products }: { products: Product[] }) {
  return (
    <section id="products" className="relative bg-white py-20 sm:py-28">
      <div className="shell">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            align="left"
            kicker="Hardware"
            title={
              <>
                Engineered for Performance. <span className="text-brand-600">Built for Reliability.</span>
              </>
            }
            sub="Every unit is designed, assembled and tested by Bigfox Engineering teams in Chennai — then fielded across India."
          />
          <Reveal delay={0.15}>
            <Link href="/products" className="btn-ghost shrink-0">
              View all products <Icon name="arrowRight" className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.slice(0, 8).map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
