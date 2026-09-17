"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Icon, SectionHeading, SmartImage } from "../ui";

type Angle = "front" | "interior" | "rear";

const ANGLES: { id: Angle; label: string; src: string }[] = [
  { id: "front", label: "Front — road", src: "/media/resources/poster-road.jpg" },
  { id: "interior", label: "Cabin — driver", src: "/media/resources/cam-interior.jpg" },
  { id: "rear", label: "Rear — lane", src: "/media/resources/cam-rear.jpg" },
];

const EVENTS = [
  { id: "e1", name: "Lane departure", severity: "warn", vehicle: "RL-TK-118", confidence: 0.97 },
  { id: "e2", name: "Harsh braking", severity: "warn", vehicle: "RL-BUS-042", confidence: 0.93 },
  { id: "e3", name: "Speeding", severity: "info", vehicle: "RL-TK-118", confidence: 0.99 },
  { id: "e4", name: "Collision risk", severity: "high", vehicle: "RL-TK-118", confidence: 0.91 },
  { id: "e5", name: "Driver distraction", severity: "warn", vehicle: "RL-BUS-042", confidence: 0.88 },
];

const sevColor: Record<string, string> = {
  high: "text-accent bg-accent-soft border-accent/25",
  warn: "text-amber-700 bg-amber-50 border-amber-200",
  info: "text-brand-700 bg-brand-50 border-brand-200",
};

export default function VideoIntelligence() {
  const [angle, setAngle] = useState<Angle>("front");
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(true);
  const [activeEvent, setActiveEvent] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    const t = setInterval(() => setActiveEvent((a) => (a + 1) % EVENTS.length), 3600);
    return () => clearInterval(t);
  }, [reduce]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (angle === "front" && playing) v.play().catch(() => undefined);
    else v.pause();
    v.muted = muted;
  }, [angle, playing, muted]);

  const active = EVENTS[activeEvent];

  return (
    <section id="film" className="relative overflow-hidden bg-ink py-20 sm:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(900px 420px at 20% 0%, rgba(18,89,214,0.25), transparent 60%)" }}
      />
      <div className="shell relative">
        <SectionHeading
          dark
          align="left"
          kicker="Video intelligence"
          title={
            <>
              One road. <span className="text-brand-400">Every angle. Every event.</span>
            </>
          }
          sub="Professional multi-angle video, read by on-board AI — so your control room sees what matters, the moment it happens."
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-[1.55fr_1fr]">
          {/* main video */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7 }}
            className="overflow-hidden rounded-3xl border border-white/10 bg-[#0a1730] shadow-2xl"
          >
            <div className="relative aspect-video w-full">
              <AnimatePresence mode="wait">
                {angle === "front" ? (
                  <motion.video
                    key="video"
                    ref={videoRef}
                    src="/media/video/road-demo.mp4"
                    poster="/media/resources/poster-road.jpg"
                    muted
                    loop
                    playsInline
                    autoPlay
                    className="absolute inset-0 h-full w-full object-cover"
                    initial={reduce ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={reduce ? undefined : { opacity: 0 }}
                    transition={{ duration: 0.4 }}
                  />
                ) : (
                  <motion.img
                    key={angle}
                    src={ANGLES.find((a) => a.id === angle)!.src}
                    alt={`${angle} camera angle (demo feed)`}
                    className="absolute inset-0 h-full w-full object-cover"
                    initial={reduce ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={reduce ? undefined : { opacity: 0 }}
                    transition={{ duration: 0.4 }}
                  />
                )}
              </AnimatePresence>

              {/* HUD */}
              <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between p-4">
                <span className="flex items-center gap-2 rounded-full bg-black/50 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-white backdrop-blur">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent pulse-red" />
                  {ANGLES.find((a) => a.id === angle)?.label}
                </span>
                <span className="rounded-full bg-black/50 px-3 py-1.5 text-[11px] font-semibold text-white/80 backdrop-blur">
                  AI analysis on · demo feed
                </span>
              </div>
              <div className="scanline pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-transparent via-white/[0.045] to-transparent" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/60 to-transparent p-4">
                <span className="text-[11px] font-semibold tabular text-white/70">2026-08-25 · 18:41:22 IST</span>
                <span className="text-[11px] font-semibold tabular text-white/70">TN 09 AB 1172 · 62 km/h</span>
              </div>
            </div>

            {/* controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 px-4 py-3">
              <div className="flex items-center gap-2">
                {ANGLES.map((a) => (
                  <button
                    key={a.id}
                    onClick={() => setAngle(a.id)}
                    aria-pressed={angle === a.id}
                    className={`relative overflow-hidden rounded-xl border p-0.5 transition ${
                      angle === a.id ? "border-brand-400" : "border-white/15 hover:border-white/40"
                    }`}
                  >
                    <img src={a.src} alt={a.label} className="h-11 w-[76px] rounded-[10px] object-cover" />
                    <span
                      className={`absolute inset-x-1 bottom-1 rounded-md bg-black/55 px-1 py-0.5 text-center text-[9px] font-bold uppercase tracking-wider text-white backdrop-blur ${
                        angle === a.id ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      {a.label.split(" ")[0]}
                    </span>
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setMuted((m) => !m)}
                  aria-label={muted ? "Unmute" : "Mute"}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
                >
                  <Icon name={muted ? "volumeX" : "volume"} className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setPlaying((p) => !p)}
                  aria-label={playing ? "Pause" : "Play"}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
                >
                  <Icon name={playing ? "pause" : "play"} className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>

          {/* AI events panel */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur"
          >
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <p className="flex items-center gap-2 text-sm font-bold text-white">
                <Icon name="brain" className="h-[18px] w-[18px] text-brand-400" />
                AI Event Detection
              </p>
              <span className="flex items-center gap-1.5 rounded-full bg-brand-500/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-brand-300">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-400 pulse-blue" />
                Live · demo
              </span>
            </div>
            <ul className="flex-1 space-y-2 p-4">
              {EVENTS.map((e, i) => {
                const on = i === activeEvent;
                return (
                  <li key={e.id} className={`rounded-2xl border p-3 transition-all duration-500 ${on ? "border-brand-400/60 bg-brand-500/15" : "border-white/10 bg-white/[0.03]"}`}>
                    <div className="flex items-center justify-between gap-2">
                      <span className={`flex items-center gap-2 text-[13px] font-semibold ${on ? "text-white" : "text-white/75"}`}>
                        <span className={`flex h-7 w-7 items-center justify-center rounded-lg ${on ? "bg-brand-500 text-white" : "bg-white/10 text-white/60"}`}>
                          <Icon name={e.name === "Collision risk" ? "alert" : e.name === "Speeding" ? "gauge" : e.name === "Driver distraction" ? "driver" : e.name === "Harsh braking" ? "zap" : "route"} className="h-3.5 w-3.5" />
                        </span>
                        {e.name}
                      </span>
                      <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${sevColor[e.severity]}`}>
                        {e.severity}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/10">
                        <div
                          className={`h-full rounded-full ${on ? "bg-brand-400" : "bg-white/25"} transition-all duration-700`}
                          style={{ width: `${Math.round(e.confidence * 100)}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-bold tabular text-white/50">{Math.round(e.confidence * 100)}%</span>
                    </div>
                    <p className="mt-1.5 text-[10.5px] font-semibold text-white/40">{e.vehicle}</p>
                  </li>
                );
              })}
            </ul>
            <div className="grid grid-cols-2 gap-px border-t border-white/10 bg-white/10">
              <div className="bg-[#0a1730] px-5 py-3.5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-white/40">Events today <span className="text-white/25">(demo)</span></p>
                <p className="font-display text-xl font-extrabold tabular text-white">27</p>
              </div>
              <div className="bg-[#0a1730] px-5 py-3.5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-white/40">Fleet safety score</p>
                <p className="font-display text-xl font-extrabold tabular text-white">
                  86 <span className="text-xs font-bold text-emerald-400">▲</span>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
