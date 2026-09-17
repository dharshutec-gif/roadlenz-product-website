"use client";

import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Icon, SectionHeading } from "../ui";
import RouteMap, { MapRoute } from "../RouteMap";

/* Simulated demo data — clearly labelled as such in the UI. */
const DEMO_VEHICLES = [
  {
    id: "v1",
    name: "RL-TK-118",
    reg: "TN 09 AB 1172",
    status: "moving" as const,
    speed: 62,
    route: "Depot → Chennai Port",
    eta: "18:42",
    fuel: 74,
    driver: 92,
  },
  {
    id: "v2",
    name: "RL-BUS-042",
    reg: "TN 09 C 3321",
    status: "moving" as const,
    speed: 45,
    route: "OMR Line 3 · Loop",
    eta: "19:05",
    fuel: 61,
    driver: 88,
  },
  {
    id: "v3",
    name: "RL-MIN-007",
    reg: "TN 01 Z 8841",
    status: "idle" as const,
    speed: 0,
    route: "Site 4 laydown",
    eta: "—",
    fuel: 48,
    driver: 95,
  },
];

const DEMO_ALERTS = [
  { id: "a1", sev: "warn" as const, text: "Lane departure detected", where: "RL-TK-118 · NH-48", time: "just now" },
  { id: "a2", sev: "info" as const, text: "Speeding — 89 km/h in a 60 km/h zone", where: "RL-BUS-042 · OMR", time: "2 min ago" },
  { id: "a3", sev: "warn" as const, text: "Harsh braking event", where: "RL-MIN-007 · Gate 2", time: "6 min ago" },
  { id: "a4", sev: "ok" as const, text: "Geofence exit logged — refuel stop", where: "RL-TK-118 · CMBT", time: "12 min ago" },
  { id: "a5", sev: "info" as const, text: "Driver fatigue check passed", where: "RL-BUS-042", time: "19 min ago" },
];

const ROUTES: MapRoute[] = [
  { id: "r1", d: "M120 300 C 200 265 310 210 505 97", animated: true },
  { id: "r2", d: "M120 300 C 230 330 360 315 513 331", animated: true, color: "#0c4a8f" },
  { id: "r3", d: "M240 200 C 330 150 430 170 500 235", animated: true, color: "#7a8ea9" },
];

const sevStyle: Record<string, string> = {
  warn: "bg-accent-soft text-accent border-accent/20",
  info: "bg-brand-50 text-brand-700 border-brand-200",
  ok: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

export default function LiveOps() {
  const [selected, setSelected] = useState("v1");
  const [alertTick, setAlertTick] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    const t = setInterval(() => setAlertTick((x) => (x + 1) % DEMO_ALERTS.length), 4200);
    return () => clearInterval(t);
  }, [reduce]);

  const alerts = useMemo(
    () => [DEMO_ALERTS[alertTick], DEMO_ALERTS[(alertTick + 1) % DEMO_ALERTS.length], DEMO_ALERTS[(alertTick + 2) % DEMO_ALERTS.length]],
    [alertTick],
  );

  return (
    <section id="live-ops" className="relative overflow-hidden bg-mist-50 py-20 sm:py-28">
      <div className="shell">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            align="left"
            kicker="Real-time operations"
            title={
              <>
                Your entire fleet, <span className="text-brand-600">one live view.</span>
              </>
            }
            sub="Live position, speed, fuel, driver score and events — streamed from every vehicle and assembled on one operations map."
          />
          <div className="flex items-center gap-2 self-start lg:self-end">
            <span className="chip !border-accent/20 !bg-accent-soft !text-accent">
              <span className="h-2 w-2 rounded-full bg-accent pulse-red" />
              Demo data — simulated for preview
            </span>
          </div>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          {/* map */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7 }}
            className="relative overflow-hidden rounded-3xl border border-line bg-white shadow-card"
          >
            <div className="flex items-center justify-between border-b border-line px-5 py-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-ink">
                <Icon name="map" className="h-4 w-4 text-brand-600" />
                Fleet Map — Chennai Region
              </div>
              <div className="flex items-center gap-3 text-[11px] font-semibold text-ink-muted">
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-brand-600" /> Moving</span>
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-ink" /> Idle</span>
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-accent" /> Alert</span>
              </div>
            </div>
            <div className="aspect-[16/10] w-full">
              <RouteMap
                routes={ROUTES}
                selected={selected}
                onSelect={setSelected}
                highlight={DEMO_VEHICLES.find((v) => v.id === selected)?.id === "v3" ? null : null}
                vehicles={[
                  { id: "v1", routeId: "r1", offset: 0.15, speed: 1, color: "#1259d6", label: "RL-TK-118" },
                  { id: "v2", routeId: "r2", offset: 0.45, speed: 1.4, color: "#0c4a8f", label: "RL-BUS-042" },
                  { id: "v3", routeId: "r3", offset: 0.7, speed: 0.35, color: "#7a8ea9", label: "RL-MIN-007" },
                ]}
              />
            </div>
            <div className="pointer-events-none absolute bottom-4 left-4 rounded-xl border border-line bg-white/90 px-3.5 py-2.5 backdrop-blur">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-ink-faint">Network</p>
              <p className="text-sm font-semibold text-ink">
                <span className="text-brand-600">3</span> vehicles online · <span className="text-ink-muted">demo feed</span>
              </p>
            </div>
          </motion.div>

          {/* right column */}
          <div className="flex flex-col gap-4">
            {DEMO_VEHICLES.map((v, i) => {
              const isSel = selected === v.id;
              return (
                <motion.button
                  key={v.id}
                  initial={reduce ? false : { opacity: 0, x: 24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.55, delay: i * 0.08 }}
                  onClick={() => setSelected(v.id)}
                  className={`group rounded-2xl border bg-white p-4 text-left transition-all duration-300 ${
                    isSel ? "border-brand-400 shadow-lift" : "border-line shadow-card hover:border-brand-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span
                        className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                          v.status === "moving" ? "bg-brand-50 text-brand-600" : "bg-mist-200 text-ink-muted"
                        }`}
                      >
                        <Icon name={v.id === "v2" ? "bus" : v.id === "v3" ? "truck" : "truck"} className="h-[18px] w-[18px]" />
                      </span>
                      <div>
                        <p className="text-sm font-bold text-ink">{v.name}</p>
                        <p className="text-[11px] text-ink-faint">{v.reg}</p>
                      </div>
                    </div>
                    <span
                      className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-wider ${
                        v.status === "moving" ? "bg-brand-50 text-brand-700" : "bg-mist-200 text-ink-muted"
                      }`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${v.status === "moving" ? "bg-brand-600 pulse-blue" : "bg-ink-faint"}`} />
                      {v.status}
                    </span>
                  </div>
                  <div className="mt-3 grid grid-cols-4 gap-2 text-center">
                    <div className="rounded-xl bg-mist-100 px-2 py-2">
                      <p className="text-[9.5px] font-bold uppercase tracking-wider text-ink-faint">Speed</p>
                      <p className="text-sm font-bold tabular text-ink">{v.speed} <span className="text-[10px] font-semibold text-ink-faint">km/h</span></p>
                    </div>
                    <div className="rounded-xl bg-mist-100 px-2 py-2">
                      <p className="text-[9.5px] font-bold uppercase tracking-wider text-ink-faint">ETA</p>
                      <p className="text-sm font-bold tabular text-ink">{v.eta}</p>
                    </div>
                    <div className="rounded-xl bg-mist-100 px-2 py-2">
                      <p className="text-[9.5px] font-bold uppercase tracking-wider text-ink-faint">Fuel</p>
                      <p className="text-sm font-bold tabular text-ink">{v.fuel}%</p>
                    </div>
                    <div className="rounded-xl bg-mist-100 px-2 py-2">
                      <p className="text-[9.5px] font-bold uppercase tracking-wider text-ink-faint">Driver</p>
                      <p className="text-sm font-bold tabular text-ink">{v.driver}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-mist-200">
                      <div className="h-full rounded-full bg-brand-500 transition-all duration-700" style={{ width: `${v.fuel}%` }} />
                    </div>
                    <span className="text-[10.5px] font-semibold text-ink-muted">{v.route}</span>
                  </div>
                </motion.button>
              );
            })}

            {/* alerts */}
            <div className="rounded-2xl border border-line bg-white p-4 shadow-card">
              <div className="flex items-center justify-between">
                <p className="flex items-center gap-2 text-sm font-bold text-ink">
                  <Icon name="alert" className="h-4 w-4 text-accent" />
                  Active alerts
                </p>
                <span className="rounded-full bg-accent-soft px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent">demo</span>
              </div>
              <ul className="mt-3 space-y-2">
                <AnimatePresence initial={false} mode="popLayout">
                  {alerts.map((a) => (
                    <motion.li
                      key={a.id}
                      layout={!reduce}
                      initial={reduce ? false : { opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={reduce ? undefined : { opacity: 0, y: 10 }}
                      transition={{ duration: 0.4 }}
                      className={`flex items-start gap-2.5 rounded-xl border px-3 py-2 ${sevStyle[a.sev]}`}
                    >
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-current opacity-70" />
                      <div className="min-w-0">
                        <p className="truncate text-[12.5px] font-semibold">{a.text}</p>
                        <p className="truncate text-[10.5px] opacity-70">
                          {a.where} · {a.time}
                        </p>
                      </div>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
