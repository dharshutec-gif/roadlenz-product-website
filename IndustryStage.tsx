"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { Icon, SectionHeading, SmartImage } from "../ui";
import type { Industry } from "@/lib/types";

const ICONS: Record<string, string> = {
  agriculture: "leaf",
  "public-transport": "bus",
  "trucking-logistics": "truck",
  "cab-taxi": "car",
  "school-transport": "shield",
  mining: "box",
  "employee-transport": "users",
};

const CYCLE_MS = 5000;

export default function IndustryStage({ industries }: { industries: Industry[] }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();
  const router = useRouter();
  const tapRef = useRef<{ index: number; at: number }>({ index: -1, at: 0 });
  const list = industries;
  const count = list.length;

  const navigate = useCallback(
    (i: number) => {
      const ind = list[i];
      if (ind) router.push(`/industries/${ind.slug}`);
    },
    [list, router],
  );

  const select = useCallback(
    (i: number) => {
      setActive(i);
      setPaused(false);
      const now = performance.now();
      if (tapRef.current.index === i && now - tapRef.current.at < 330) {
        navigate(i); // double-tap / double-click
      }
      tapRef.current = { index: i, at: now };
    },
    [navigate],
  );

  /* auto-advance every 5s */
  useEffect(() => {
    if (paused || reduce || count < 2) return;
    const t = setInterval(() => setActive((a) => (a + 1) % count), CYCLE_MS);
    return () => clearInterval(t);
  }, [paused, reduce, count, active]);

  const activeInd = list[active];

  return (
    <section id="industries-scene" className="relative overflow-hidden bg-white py-20 sm:py-28">
      {/* faint grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          backgroundImage: "linear-gradient(rgba(12,31,58,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(12,31,58,0.03) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage: "radial-gradient(80% 80% at 50% 40%, black, transparent)",
          WebkitMaskImage: "radial-gradient(80% 80% at 50% 40%, black, transparent)",
        }}
      />
      <div className="shell relative">
        <SectionHeading
          kicker="Industry solutions"
          title={
            <>
              One Platform. <span className="text-brand-600">Every Industry.</span>
            </>
          }
          sub="Pick a vehicle to explore how RoadLenz adapts to its world. Double-click any vehicle to open its solution page."
        />

        {/* scene */}
        <div
          className="mt-14 overflow-x-auto pb-2"
          role="group"
          aria-label="Industry vehicles — select or double-click"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
        >
          <div className="relative min-w-[880px]">
            {/* baseline */}
            <div aria-hidden className="absolute inset-x-6 bottom-[64px] h-px bg-line" />

            {/* vehicle row */}
            <div className="grid grid-cols-7 items-end">
              {list.map((ind, i) => {
                const isActive = i === active;
                return (
                  <button
                    key={ind.id}
                    onClick={() => select(i)}
                    onDoubleClick={(e) => {
                      e.preventDefault();
                      navigate(i);
                    }}
                    onFocus={() => setActive(i)}
                    aria-label={`${ind.name} — select (double-click to open solution)`}
                    aria-pressed={isActive}
                    className="group relative flex h-44 w-full cursor-pointer items-end justify-center outline-none sm:h-56 lg:h-64"
                  >
                    {/* glow behind active */}
                    <span
                      aria-hidden
                      className={`pointer-events-none absolute bottom-2 left-1/2 h-16 w-[130%] -translate-x-1/2 rounded-full blur-2xl transition-opacity duration-700 ${
                        isActive ? "opacity-60" : "opacity-0"
                      }`}
                      style={{ background: "radial-gradient(ellipse, rgba(18,89,214,0.35), transparent 70%)" }}
                    />
                    <SmartImage
                      src={ind.vehicleImage}
                      alt={`${ind.name} vehicle render`}
                      className={`relative z-10 h-full w-full object-contain object-bottom mix-blend-multiply transition-all duration-700 ease-[cubic-bezier(0.22,0.61,0.36,1)] ${
                        isActive ? "-translate-y-3 scale-[1.07] brightness-[1.02] drop-shadow-[0_18px_24px_rgba(12,80,190,0.25)]" : "brightness-[0.98] group-hover:brightness-100"
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            {/* elliptical stage */}
            <motion.div
              aria-hidden
              initial={false}
              animate={{ left: `${((active + 0.5) / count) * 100}%` }}
              transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 90, damping: 18 }}
              className="pointer-events-none absolute bottom-[40px] z-0 h-14 w-40 -translate-x-1/2 sm:h-16 sm:w-48"
            >
              <div className="absolute inset-0 rounded-[50%] border border-brand-400/50" style={{ background: "radial-gradient(ellipse at center, rgba(18,89,214,0.30) 0%, rgba(18,89,214,0.12) 55%, transparent 75%)" }} />
              <div className="absolute inset-x-6 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-brand-500/70 to-transparent" />
            </motion.div>
          </div>
        </div>

        {/* active caption (below baseline, above nav) */}
        <div className="mt-6 flex min-h-[64px] items-center justify-center">
          <AnimatePresenceCaption active={activeInd} />
        </div>

        {/* bottom navigation */}
        <nav aria-label="Industries" className="mt-8 flex flex-wrap justify-center gap-2">
          {list.map((ind, i) => {
            const isActive = i === active;
            return (
              <button
                key={ind.id}
                onClick={() => select(i)}
                onDoubleClick={(e) => {
                  e.preventDefault();
                  navigate(i);
                }}
                aria-pressed={isActive}
                className={`flex items-center gap-2 rounded-full border px-4 py-2.5 text-[13px] font-semibold transition-all duration-300 ${
                  isActive
                    ? "border-brand-600 bg-brand-600 text-white shadow-card"
                    : "border-line bg-white text-ink-soft hover:border-brand-300 hover:text-brand-700"
                }`}
              >
                <Icon name={ICONS[ind.slug] ?? "sparkle"} className="h-4 w-4" />
                {ind.shortName}
              </button>
            );
          })}
        </nav>
      </div>
    </section>
  );
}

function AnimatePresenceCaption({ active }: { active: Industry | undefined }) {
  const reduce = useReducedMotion();
  const [shown, setShown] = useState(active);
  const [visible, setVisible] = useState(true);
  const key = active?.id;
  const prev = useRef(key);

  useEffect(() => {
    if (prev.current !== key) {
      setVisible(false);
      const t = setTimeout(() => {
        setShown(active);
        setVisible(true);
      }, 140);
      prev.current = key;
      return () => clearTimeout(t);
    }
  }, [key, active]);

  if (!shown) return null;
  return (
    <motion.div
      initial={false}
      animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 8 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center gap-1.5 text-center"
    >
      <p className="font-display text-lg font-bold text-ink sm:text-xl">{shown.name}</p>
      <p className="max-w-xl text-sm text-ink-muted">{shown.tagline}</p>
      <Link href={`/industries/${shown.slug}`} className="mt-1 inline-flex items-center gap-1.5 text-sm font-bold text-brand-600 transition hover:gap-2.5 hover:text-brand-700">
        View solution <Icon name="arrowRight" className="h-4 w-4" />
      </Link>
    </motion.div>
  );
}
