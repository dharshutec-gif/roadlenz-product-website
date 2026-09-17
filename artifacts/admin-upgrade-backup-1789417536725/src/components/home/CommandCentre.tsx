"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Icon, SectionHeading, SmartImage } from "../ui";
import Link from "next/link";
import RouteMap, { MapRoute } from "../RouteMap";

const ROUTES: MapRoute[] = [
  { id: "c1", d: "M120 300 C 200 265 310 210 505 97", animated: true },
  { id: "c2", d: "M120 300 C 230 330 360 315 513 331", animated: true, color: "#0c4a8f" },
  { id: "c3", d: "M240 200 C 330 150 430 170 500 235", animated: true, color: "#7a8ea9" },
  { id: "c4", d: "M60 40 C 160 120 300 90 420 170", animated: true, color: "#2a72ec" },
];

const KPIS = [
  { label: "Vehicles online", value: "128", sub: "of 142 active", icon: "fleet" },
  { label: "Active alerts", value: "4", sub: "2 need attention", icon: "alert", hot: true },
  { label: "Avg driver score", value: "86", sub: "fleet average", icon: "driver" },
  { label: "Fuel today", value: "412 L", sub: "−6.8% vs last week", icon: "fuel" },
];

const FUEL_BARS = [62, 78, 55, 84, 71, 66, 90, 60, 74, 58, 82, 69];

function Sparkline({ points, drawKey }: { points: string; drawKey: string }) {
  const reduce = useReducedMotion();
  return (
    <svg viewBox="0 0 200 56" className="h-14 w-full" aria-hidden>
      <path
        d={points}
        fill="none"
        stroke="#1259d6"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray={reduce ? 0 : 600}
        strokeDashoffset={reduce ? 0 : 600}
        style={{ animation: drawKey ? "rl-draw 1.8s ease-out forwards" : undefined }}
      />
      <style jsx>{`
        @keyframes rl-draw {
          to { stroke-dashoffset: 0; }
        }
      `}</style>
    </svg>
  );
}

export default function CommandCentre() {
  const reduce = useReducedMotion();
  const [drawKey, setDrawKey] = useState("");
  const sectionRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setInView(true), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (inView) setDrawKey("on");
  }, [inView]);

  return (
    <section id="command-centre" ref={sectionRef} className="relative overflow-hidden bg-mist-50 py-20 sm:py-28">
      <div className="shell">
        <SectionHeading
          kicker="The platform"
          title={
            <>
              A command centre your team will <span className="text-brand-600">actually live in.</span>
            </>
          }
          sub="Maps, video, fuel, driver scores and alerts — one console, no tab-hopping. Shown here with simulated demo data."
        />

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8 }}
          className="mt-14 overflow-hidden rounded-3xl border border-line bg-white shadow-lift"
        >
          {/* window chrome */}
          <div className="flex items-center justify-between border-b border-line bg-mist-100/70 px-5 py-3">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-[#f0a8a0]" />
              <span className="h-3 w-3 rounded-full bg-[#f5d9a2]" />
              <span className="h-3 w-3 rounded-full bg-[#a8d8b4]" />
              <span className="ml-3 text-sm font-bold text-ink">RoadLenz Command Centre</span>
            </div>
            <span className="chip !border-brand-200 !bg-brand-50 !text-brand-700">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-600 pulse-blue" />
              Live · demo data
            </span>
          </div>

          <div className="grid gap-px bg-line lg:grid-cols-[1.6fr_1fr]">
            {/* map + kpis */}
            <div className="bg-white">
              <div className="aspect-[16/9] w-full lg:aspect-[16/7.5]">
                <RouteMap
                  routes={ROUTES}
                  vehicles={[
                    { id: "m1", routeId: "c1", offset: 0.2, speed: 1, color: "#1259d6" },
                    { id: "m2", routeId: "c1", offset: 0.55, speed: 1.2, color: "#1259d6" },
                    { id: "m3", routeId: "c2", offset: 0.3, speed: 1.4, color: "#0c4a8f" },
                    { id: "m4", routeId: "c3", offset: 0.6, speed: 0.9, color: "#7a8ea9" },
                    { id: "m5", routeId: "c4", offset: 0.4, speed: 1.1, color: "#2a72ec" },
                  ]}
                />
              </div>
              <div className="grid grid-cols-2 divide-x divide-y divide-line border-t border-line sm:grid-cols-4">
                {KPIS.map((k) => (
                  <div key={k.label} className="px-4 py-4">
                    <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-ink-faint">
                      <Icon name={k.icon} className="h-3.5 w-3.5" />
                      {k.label}
                    </p>
                    <p className={`mt-1 font-display text-2xl font-extrabold tabular ${k.hot ? "text-accent" : "text-ink"}`}>{k.value}</p>
                    <p className="text-[11px] font-medium text-ink-muted">{k.sub}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* right rail */}
            <div className="flex flex-col bg-white">
              {/* camera */}
              <div className="relative aspect-video w-full overflow-hidden border-b border-line bg-[#0a1730]">
                <SmartImage src="/media/resources/poster-road.jpg" alt="Live camera feed (demo)" className="h-full w-full object-cover opacity-90" />
                <div className="scanline absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-transparent via-white/[0.06] to-transparent" />
                <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-md bg-black/55 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent pulse-red" />
                  CAM 01 · TN 09 AB 1172
                </div>
                <div className="absolute bottom-3 right-3 rounded-md bg-black/55 px-2 py-1 text-[10px] font-semibold tabular text-white/80 backdrop-blur">
                  18:41:22 · 62 km/h
                </div>
              </div>

              {/* alerts */}
              <div className="border-b border-line px-4 py-3.5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-ink-faint">Alerts</p>
                <ul className="mt-2 space-y-1.5">
                  <li className="flex items-center gap-2 text-[12px] font-semibold text-ink">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent pulse-red" />
                    Lane departure — RL-TK-118
                  </li>
                  <li className="flex items-center gap-2 text-[12px] font-semibold text-ink">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                    Speeding 89/60 — RL-BUS-042
                  </li>
                  <li className="flex items-center gap-2 text-[12px] font-semibold text-ink-muted">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Geofence exit — refuel · 12 min
                  </li>
                </ul>
              </div>

              {/* fuel + distance charts */}
              <div className="grid flex-1 grid-cols-2 divide-x divide-line">
                <div className="px-4 py-3.5">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-ink-faint">Fuel · 12 h</p>
                  <div className="mt-3 flex h-14 items-end gap-1">
                    {FUEL_BARS.map((b, i) => (
                      <div key={i} className="flex-1 rounded-t-sm bg-brand-500/80 transition-all duration-700" style={{ height: inView ? `${b}%` : "8%", transitionDelay: `${i * 40}ms` }} />
                    ))}
                  </div>
                </div>
                <div className="px-4 py-3.5">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-ink-faint">Distance · today</p>
                  <div className="mt-3">
                    <Sparkline points="M0,44 L18,40 L36,42 L54,32 L72,34 L90,24 L108,27 L126,18 L144,21 L162,12 L180,14 L200,6" drawKey={drawKey} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link className="btn-primary" href="/book-demo">
            See it live on your fleet <Icon name="arrowRight" className="h-4 w-4" />
          </Link>
          <Link className="btn-ghost" href="/technology">
            Explore the technology
          </Link>
        </div>
      </div>
    </section>
  );
}
