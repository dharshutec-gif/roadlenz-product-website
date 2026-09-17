"use client";

import React from "react";
import { Reveal } from "../ui";
import type { CustomerLogo } from "@/lib/types";

/**
 * Customer logo strip. Logos are CMS-managed and intentionally unpublished
 * until a client authorises their use and uploads the asset. Until then an
 * explicit placeholder strip is shown — we never invent client logos.
 */
export default function CustomerLogos({ logos }: { logos: CustomerLogo[] }) {
  const approved = logos.filter((l) => l.approved && l.published && l.image);

  return (
    <section aria-label="Trusted customers" className="border-y border-line bg-white py-16 sm:py-20">
      <div className="shell">
        <Reveal className="flex flex-col items-center gap-3 text-center">
          <span className="kicker">Customers</span>
          <h2 className="h-display text-2xl sm:text-3xl">Trusted on Every Road.</h2>
          {approved.length === 0 ? (
            <p className="max-w-xl text-sm leading-relaxed text-ink-muted">
              Client logos appear here as soon as each customer authorises their brand for public display through the
              RoadLenz content system.
            </p>
          ) : null}
        </Reveal>

        {approved.length === 0 ? (
          <Reveal delay={0.1}>
            <div className="mx-auto mt-10 grid max-w-4xl grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  aria-hidden
                  className="flex h-20 items-center justify-center rounded-2xl border border-dashed border-line bg-mist-50"
                >
                  <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-ink-faint">Logo pending</span>
                </div>
              ))}
            </div>
          </Reveal>
        ) : (
          <div className="relative mt-10 overflow-hidden" style={{ maskImage: "linear-gradient(90deg, transparent, black 8%, black 92%, transparent)" }}>
            <div className="marquee-track flex w-max gap-4">
              {[...approved, ...approved].map((l, i) => (
                <div key={`${l.id}-${i}`} className="flex h-20 w-44 items-center justify-center overflow-hidden rounded-2xl border border-line bg-white p-4 grayscale transition duration-500 hover:grayscale-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={l.image} alt={`${l.name} logo`} className="max-h-full max-w-full object-contain" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
