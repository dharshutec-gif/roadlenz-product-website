"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Icon } from "../ui";
import type { HeroSlide } from "@/lib/types";

export default function Hero({ slides }: { slides: HeroSlide[] }) {
  const [index, setIndex] = useState(0);
  const [muted, setMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const reduce = useReducedMotion();
  const rafRef = useRef<number>(0);
  const lastRef = useRef<number>(0);
  const videoRefs = useRef<Record<number, HTMLVideoElement | null>>({});

  const active = slides[index];
  const count = slides.length;

  const go = useCallback(
    (dir: 1 | -1) => {
      setIndex((i) => (i + dir + count) % count);
      setProgress(0);
    },
    [count],
  );

  const goTo = useCallback(
    (i: number) => {
      setIndex(((i % count) + count) % count);
      setProgress(0);
    },
    [count],
  );

  /* progress clock */
  useEffect(() => {
    if (reduce) {
      setProgress(1);
      return;
    }
    lastRef.current = performance.now();
    const dur = Math.max(4, active?.duration ?? 9) * 1000;
    const tick = (t: number) => {
      const dt = t - lastRef.current;
      lastRef.current = t;
      setProgress((p) => {
        const next = p + dt / dur;
        if (next >= 1) {
          setIndex((i) => (i + 1) % count);
          return 0;
        }
        return next;
      });
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
    // restart clock on slide change
  }, [index, count, reduce, active?.duration]);

  /* pause/play videos based on active slide */
  useEffect(() => {
    slides.forEach((s, i) => {
      const v = videoRefs.current[i];
      if (!v) return;
      if (i === index) {
        v.muted = muted;
        v.play().catch(() => undefined);
      } else {
        v.pause();
      }
    });
  }, [index, muted, slides]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") go(1);
    if (e.key === "ArrowLeft") go(-1);
  };

  const goCta = (href: string) => {
    if (href.startsWith("#")) {
      const el = document.getElementById(href.slice(1));
      el?.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
      return true;
    }
    return false;
  };

  const ctaLink = (label: string, href: string, primary: boolean) => (
    <Link
      key={label}
      href={href.startsWith("#") ? href : href}
      onClick={(e) => {
        if (goCta(href)) e.preventDefault();
      }}
      className={primary ? "btn-primary" : "btn-white"}
    >
      {label}
      <Icon name={label.toLowerCase().includes("watch") ? "play" : "arrowRight"} className="h-4 w-4" />
    </Link>
  );

  return (
    <section
      id="hero"
      aria-label="RoadLenz — intelligent mobility"
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-ink"
      onKeyDown={onKeyDown}
      tabIndex={0}
      role="region"
    >
      {/* slides */}
      {slides.map((slide, i) => {
        const isActive = i === index;
        return (
          <div
            key={slide.id}
            aria-hidden={!isActive}
            className={`absolute inset-0 transition-opacity duration-[1200ms] ease-out ${isActive ? "opacity-100" : "opacity-0"}`}
          >
            {slide.media.type === "video" ? (
              <video
                ref={(el) => {
                  videoRefs.current[i] = el;
                }}
                src={slide.media.src}
                poster={slide.media.poster}
                muted
                loop
                playsInline
                autoPlay={isActive}
                preload={Math.abs(i - index) === 1 ? "metadata" : "none"}
                className="h-full w-full object-cover"
              />
            ) : (
              <div key={isActive ? "on" : "off"} className="h-full w-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={slide.media.src}
                  alt=""
                  className={`h-full w-full object-cover ${isActive && !reduce ? "kenburns" : ""}`}
                />
              </div>
            )}
            {/* overlay */}
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background: `linear-gradient(180deg, rgba(7,17,34,${0.35 + slide.overlay * 0.4}) 0%, rgba(7,17,34,${
                  slide.overlay * 0.55
                }) 45%, rgba(7,17,34,${0.55 + slide.overlay * 0.35}) 100%)`,
              }}
            />
          </div>
        );
      })}

      {/* copy */}
      <div className="shell relative z-10 flex flex-col items-center pb-28 pt-32 text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={active?.id}
            initial={reduce ? false : { opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -18 }}
            transition={{ duration: 0.7, ease: [0.21, 0.6, 0.35, 1] }}
            className="flex max-w-4xl flex-col items-center"
          >
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.22em] text-white/90 backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-400 pulse-blue" />
              Fleet Intelligence · Video Telematics · Safety
            </span>
            <h1 className="font-display text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-6xl lg:text-[4.4rem]">
              {active?.title}
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">
              {active?.subtitle}
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              {active && ctaLink(active.primaryCta, active.primaryHref, true)}
              {active && ctaLink(active.secondaryCta, active.secondaryHref, false)}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* controls */}
      <div className="absolute inset-x-0 bottom-7 z-20">
        <div className="shell flex items-center justify-between">
          <button
            onClick={() => go(-1)}
            aria-label="Previous slide"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur transition hover:bg-white/25 focus-visible:outline-2 focus-visible:outline-white"
          >
            <Icon name="chevronLeft" className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-3">
            {slides.map((s, i) => (
              <button
                key={s.id}
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === index}
                className="group relative h-6 w-12"
              >
                <span className="absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 overflow-hidden rounded-full bg-white/30">
                  <span
                    key={i === index ? `p-${index}` : "idle"}
                    className="absolute inset-y-0 left-0 rounded-full bg-white"
                    style={i === index ? { width: `${progress * 100}%`, transition: "width 80ms linear" } : { width: i < index ? "100%" : "0%" }}
                  />
                </span>
              </button>
            ))}
            <span className="ml-1 text-xs font-semibold tabular text-white/70">
              {String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setMuted((m) => !m)}
              aria-label={muted ? "Unmute video" : "Mute video"}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur transition hover:bg-white/25"
            >
              <Icon name={muted ? "volumeX" : "volume"} className="h-[18px] w-[18px]" />
            </button>
            <button
              onClick={() => go(1)}
              aria-label="Next slide"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur transition hover:bg-white/25"
            >
              <Icon name="chevronRight" className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* scroll hint */}
      <div aria-hidden className="pointer-events-none absolute bottom-24 left-1/2 hidden -translate-x-1/2 lg:block">
        <div className="flex h-9 w-5 items-start justify-center rounded-full border border-white/30 p-1.5">
          <motion.span
            animate={reduce ? undefined : { y: [0, 10, 0], opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="h-1.5 w-1 rounded-full bg-white/80"
          />
        </div>
      </div>
    </section>
  );
}
