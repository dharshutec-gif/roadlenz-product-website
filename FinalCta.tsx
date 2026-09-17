"use client";

import React from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Icon, Reveal } from "../ui";

export default function FinalCta() {
  const reduce = useReducedMotion();
  return (
    <section aria-label="Contact RoadLenz" className="relative overflow-hidden bg-ink py-20 sm:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(900px 480px at 50% 115%, rgba(18,89,214,0.4), transparent 65%), radial-gradient(600px 300px at 85% -10%, rgba(42,114,236,0.2), transparent 60%)",
        }}
      />
      <svg aria-hidden className="pointer-events-none absolute inset-x-0 top-1/2 h-px w-full" preserveAspectRatio="none" viewBox="0 0 1440 1">
        <path d="M0 0.5 H1440" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
      </svg>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-10 h-24 opacity-50"
        style={{
          backgroundImage: "repeating-linear-gradient(90deg, rgba(255,255,255,0.14) 0 34px, transparent 34px 74px)",
          maskImage: "linear-gradient(90deg, transparent, black 20%, black 80%, transparent)",
          WebkitMaskImage: "linear-gradient(90deg, transparent, black 20%, black 80%, transparent)",
          transform: "skewY(-2deg)",
        }}
      />
      <div className="shell relative flex flex-col items-center text-center">
        <Reveal>
          <span className="kicker !text-brand-300">Ready when you are</span>
          <h2 className="h-display mt-5 max-w-3xl text-3xl leading-tight text-white sm:text-5xl">
            Wherever the Road Takes You, <span className="text-brand-400">RoadLenz Goes Further.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.12}>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/70">
            From a single vehicle to a national fleet — tell us what you run and we'll design the configuration, the rollout and the support plan.
          </p>
        </Reveal>
        <Reveal delay={0.2} className="mt-9 flex flex-col gap-3 sm:flex-row">
          <Link href="/request-quote" className="btn-primary !px-8 !py-3.5">
            Request Quote <Icon name="arrowRight" className="h-4 w-4" />
          </Link>
          <Link href="/book-demo" className="btn-white !px-8 !py-3.5">
            <Icon name="calendar" className="h-4 w-4" />
            Book a Demo
          </Link>
          <Link href="/contact" className="btn-ghost !border-white/25 !bg-transparent !px-8 !py-3.5 !text-white hover:!border-white/60">
            <Icon name="phone" className="h-4 w-4" />
            Talk to an Expert
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
