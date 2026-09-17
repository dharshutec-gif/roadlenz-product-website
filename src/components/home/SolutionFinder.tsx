"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { Icon, SectionHeading } from "../ui";
import type { SolutionFinderOption } from "@/lib/types";

function FinderInner({ options }: { options: SolutionFinderOption[] }) {
  const params = useSearchParams();
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();

  /* support /#solve?need=... deep links */
  useEffect(() => {
    const need = params.get("need");
    if (need) {
      const idx = options.findIndex((o) => o.option.toLowerCase() === need.toLowerCase());
      if (idx >= 0) setActive(idx);
    }
  }, [params, options]);

  const current = options[active];

  return (
    <section id="solve" className="relative overflow-hidden bg-white py-20 sm:py-28">
      <div className="shell grid items-start gap-10 lg:grid-cols-[1fr_1.15fr]">
        <div>
          <SectionHeading
            align="left"
            kicker="Solution finder"
            title="What do you need to solve?"
            sub="Tell us the problem, not the product. We'll point you to the RoadLenz configuration that fits."
          />
          <div className="mt-8 grid gap-2.5 sm:grid-cols-2">
            {options.map((o, i) => {
              const on = i === active;
              return (
                <button
                  key={o.id}
                  onClick={() => setActive(i)}
                  aria-pressed={on}
                  className={`group flex items-center gap-3 rounded-2xl border px-4 py-3.5 text-left transition-all duration-300 ${
                    on ? "border-brand-600 bg-brand-600 text-white shadow-lift" : "border-line bg-white text-ink hover:border-brand-300 hover:bg-mist-50"
                  }`}
                >
                  <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition ${on ? "bg-white/15 text-white" : "bg-brand-50 text-brand-600"}`}>
                    <Icon name={o.icon} className="h-5 w-5" />
                  </span>
                  <span className="text-[13.5px] font-bold leading-tight">{o.option}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="lg:sticky lg:top-28">
          <AnimatePresence mode="wait">
            <motion.div
              key={current?.id}
              initial={reduce ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -14 }}
              transition={{ duration: 0.35 }}
              className="overflow-hidden rounded-3xl border border-line bg-gradient-to-b from-mist-50 to-white shadow-card"
            >
              <div className="border-b border-line px-7 py-5">
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-700">Recommended for you</p>
                <h3 className="mt-2 font-display text-xl font-extrabold leading-snug text-ink sm:text-2xl">{current?.headline}</h3>
              </div>
              <div className="px-7 py-6">
                <p className="text-sm leading-relaxed text-ink-muted">{current?.body}</p>
                <p className="mt-5 inline-flex items-center gap-2 rounded-full bg-brand-50 px-4 py-2 text-[13px] font-bold text-brand-700">
                  <Icon name="sparkle" className="h-4 w-4" />
                  {current?.recommendation}
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  {current?.links.map((l) => (
                    <Link key={l.label} href={l.href} className={l.href === "/request-quote" ? "btn-primary" : "btn-ghost"}>
                      {l.label}
                      <Icon name="arrowRight" className="h-4 w-4" />
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
          <p className="mt-4 text-center text-xs text-ink-faint">
            Not sure yet? <Link href="/contact" className="font-bold text-brand-700 hover:underline">Talk to an expert</Link> — we'll scope it with you.
          </p>
        </div>
      </div>
    </section>
  );
}

export default function SolutionFinder({ options }: { options: SolutionFinderOption[] }) {
  return (
    <Suspense fallback={<div className="min-h-[400px] bg-white" />}>
      <FinderInner options={options} />
    </Suspense>
  );
}
