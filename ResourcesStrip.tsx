"use client";

import React from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Icon, Reveal, SectionHeading, SmartImage } from "../ui";
import type { ResourceItem } from "@/lib/types";

const TYPE_ICON: Record<string, string> = {
  "case-study": "doc",
  video: "video",
  guide: "wrench",
  insight: "sparkle",
  download: "download",
  warranty: "shield",
};

export default function ResourcesStrip({ resources }: { resources: ResourceItem[] }) {
  const reduce = useReducedMotion();
  const items = resources.slice(0, 4);

  return (
    <section id="resources-home" className="bg-white py-20 sm:py-28">
      <div className="shell">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            align="left"
            kicker="Resources"
            title={
              <>
                Field notes, guides and <span className="text-brand-600">proof.</span>
              </>
            }
            sub="Case studies, product videos, installation guides, fleet-safety insights, downloads and warranty information — all maintained by the RoadLenz team."
          />
          <Reveal delay={0.15}>
            <Link href="/resources" className="btn-ghost shrink-0">
              Browse all resources <Icon name="arrowRight" className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((r, i) => (
            <motion.article
              key={r.id}
              initial={reduce ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.55, delay: i * 0.06 }}
              className="group flex flex-col overflow-hidden rounded-3xl border border-line bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
            >
              <Link href="/resources" className="flex h-full flex-col">
                <div className="relative aspect-[16/10] overflow-hidden bg-mist-100">
                  <SmartImage src={r.image} alt={r.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]" />
                  {r.type === "video" && (
                    <span className="absolute inset-0 flex items-center justify-center">
                      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-brand-700 shadow-lift backdrop-blur transition group-hover:scale-110">
                        <Icon name="play" className="h-5 w-5" />
                      </span>
                    </span>
                  )}
                  <span className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-ink-soft backdrop-blur">
                    <Icon name={TYPE_ICON[r.type] ?? "doc"} className="h-3 w-3 text-brand-600" />
                    {r.type.replace("-", " ")}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="font-display text-[15.5px] font-bold leading-snug text-ink transition group-hover:text-brand-700">{r.title}</h3>
                  <p className="mt-2 line-clamp-2 text-[12.5px] leading-relaxed text-ink-muted">{r.description}</p>
                  <p className="mt-auto pt-4 text-[11px] font-bold uppercase tracking-wider text-ink-faint">{r.meta}</p>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
