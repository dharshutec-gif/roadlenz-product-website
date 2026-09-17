"use client";

import React from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Icon, Reveal, SectionHeading } from "../ui";
import type { WhyPoint } from "@/lib/types";

export default function WhyRoadLenz({ points }: { points: WhyPoint[] }) {
  const reduce = useReducedMotion();

  return (
    <section id="why" className="relative overflow-hidden bg-ink py-20 sm:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(1000px 500px at 85% 20%, rgba(18,89,214,0.2), transparent 60%)",
        }}
      />

      {/* road motif */}
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40 w-full opacity-40"
        viewBox="0 0 1440 160"
        preserveAspectRatio="none"
      >
        <path
          d="M0 120 C 360 60 1080 180 1440 90"
          fill="none"
          stroke="rgba(255,255,255,0.14)"
          strokeWidth="2"
        />
        <path
          d="M0 140 C 360 80 1080 200 1440 110"
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="2"
        />
        <path
          d="M0 120 C 360 60 1080 180 1440 90"
          fill="none"
          stroke="#5495f7"
          strokeWidth="2"
          strokeDasharray="14 18"
          className="route-dash"
        />
      </svg>

      <div className="shell relative grid gap-12 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <SectionHeading
            dark
            align="left"
            kicker="Why RoadLenz"
            title={
              <>
                Built by engineers who{" "}
                <span className="text-brand-400">know the road.</span>
              </>
            }
            sub="RoadLenz is powered by Bigfox Engineering Private Limited — the same team designs the hardware, builds the platform and drives the installation vans."
          />

          <Reveal delay={0.2} className="mt-8">
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/about" className="btn-white">
                About the team
                <Icon name="arrowRight" className="h-4 w-4" />
              </Link>

              <Link
                href="/contact"
                className="btn-ghost !border-white/25 !bg-transparent !text-white hover:!border-white/60 hover:!text-white"
              >
                Talk to an expert
              </Link>
            </div>
          </Reveal>
        </div>

        <div className="flex flex-col">
          {points.map((p, i) => (
            <motion.div
              key={p.id}
              initial={reduce ? false : { opacity: 0, x: 28 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.55, delay: i * 0.08 }}
              className="group flex items-start gap-5 border-b border-white/10 py-6 first:pt-0 last:border-b-0"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-brand-300 transition duration-300 group-hover:bg-brand-600 group-hover:text-white">
                <Icon name={p.icon} className="h-[22px] w-[22px]" />
              </span>

              <div>
                {/* Fixed invalid HTML nesting: h3 is no longer inside p */}
                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-bold tabular text-white/30">
                    0{i + 1}
                  </span>

                  <h3 className="font-display text-lg font-bold text-white">
                    {p.title}
                  </h3>
                </div>

                <p className="mt-1.5 max-w-lg text-sm leading-relaxed text-white/60">
                  {p.text}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}