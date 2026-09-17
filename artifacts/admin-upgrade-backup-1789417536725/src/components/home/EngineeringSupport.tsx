"use client";

import React from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Icon, Reveal, SectionHeading, SmartImage } from "../ui";
import type { EngineeringItem } from "@/lib/types";

export default function EngineeringSupport({ items, parent }: { items: EngineeringItem[]; parent: string }) {
  const reduce = useReducedMotion();
  return (
    <section id="engineering" className="relative bg-mist-50 py-20 sm:py-28">
      <div className="shell">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            align="left"
            kicker="Engineering support"
            title={
              <>
                Engineered by Bigfox. <span className="text-brand-600">Built for the Road.</span>
              </>
            }
            sub={`From the first site survey to the hundredth vehicle, the same ${parent} team owns the job — no hand-offs, no finger-pointing.`}
          />
          <Reveal delay={0.15}>
            <Link href="/about" className="btn-ghost shrink-0">
              Meet the team <Icon name="arrowRight" className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it, i) => (
            <motion.figure
              key={it.id}
              initial={reduce ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.55, delay: (i % 3) * 0.07 }}
              className="group relative overflow-hidden rounded-3xl border border-line bg-white shadow-card"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <SmartImage
                  src={it.image}
                  alt={it.title}
                  className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.07]"
                />
                <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
                  <div>
                    <p className="font-display text-lg font-bold text-white">{it.title}</p>
                    <p className="mt-0.5 max-w-[85%] text-xs leading-snug text-white/75">{it.text}</p>
                  </div>
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15 text-white backdrop-blur transition group-hover:bg-brand-600">
                    <Icon name={it.icon} className="h-[18px] w-[18px]" />
                  </span>
                </div>
              </div>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
