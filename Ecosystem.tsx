"use client";

import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Icon, SectionHeading } from "../ui";
import type { EcosystemNode } from "@/lib/types";

export default function Ecosystem({ nodes }: { nodes: EcosystemNode[] }) {
  const [selected, setSelected] = useState(0);
  const reduce = useReducedMotion();
  const list = nodes;
  const count = Math.max(list.length, 1);

  /* auto cycle */
  useEffect(() => {
    if (reduce) return;
    const t = setInterval(() => setSelected((s) => (s + 1) % count), 6000);
    return () => clearInterval(t);
  }, [reduce, count]);

  const geometry = useMemo(() => {
    const C = 320; // center of 640 canvas
    const R = 205;
    return list.map((_, i) => {
      const a = (Math.PI * 2 * i) / count - Math.PI / 2;
      return { x: C + R * Math.cos(a), y: C + R * Math.sin(a), a };
    });
  }, [list, count]);

  const active = list[selected];

  return (
    <section id="ecosystem" className="relative overflow-hidden bg-mist-100 py-20 sm:py-28">
      <div className="shell grid items-center gap-14 lg:grid-cols-2">
        {/* visual */}
        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8 }}
          className="relative mx-auto aspect-square w-full max-w-[560px]"
        >
          <svg viewBox="0 0 640 640" className="h-full w-full">
            <defs>
              <radialGradient id="hubGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="rgba(18,89,214,0.28)" />
                <stop offset="100%" stopColor="rgba(18,89,214,0)" />
              </radialGradient>
            </defs>

            {/* rotating rings */}
            <g className={reduce ? "" : "eco-spin"}>
              <circle cx="320" cy="320" r="205" fill="none" stroke="#c9dcf3" strokeWidth="1.5" strokeDasharray="3 9" />
            </g>
            <g className={reduce ? "" : "eco-spin-rev"}>
              <circle cx="320" cy="320" r="140" fill="none" stroke="#d8e6f7" strokeWidth="1" strokeDasharray="1 10" />
            </g>

            {/* spokes */}
            {geometry.map((g, i) => (
              <line key={i} x1="320" y1="320" x2={g.x} y2={g.y} stroke={i === selected ? "rgba(18,89,214,0.5)" : "rgba(12,31,58,0.12)"} strokeWidth={i === selected ? 2 : 1.2} className="transition-all duration-500" />
            ))}

            {/* travelling data pulses */}
            {!reduce &&
              geometry.map((g, i) => (
                <circle key={`p-${i}`} r="3" fill="#1259d6" opacity="0.85">
                  <animateMotion dur={`${4 + (i % 3)}s`} repeatCount="indefinite" path={`M320,320 L${g.x},${g.y}`} />
                </circle>
              ))}

            {/* hub */}
            <circle cx="320" cy="320" r="95" fill="url(#hubGlow)" />
            <circle cx="320" cy="320" r="64" fill="#ffffff" stroke="#bcd6f5" strokeWidth="1.5" />
            {!reduce && (
              <circle cx="320" cy="320" r="64" fill="none" stroke="rgba(18,89,214,0.4)" strokeWidth="1.5">
                <animate attributeName="r" values="64;78" dur="2.6s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.5;0" dur="2.6s" repeatCount="indefinite" />
              </circle>
            )}
            <foreignObject x="284" y="284" width="72" height="72">
              <div className="flex h-full w-full items-center justify-center">
                <Icon name="truck" className="h-9 w-9 text-brand-600" strokeWidth={1.4} />
              </div>
            </foreignObject>

            {/* nodes */}
            {list.map((n, i) => {
              const g = geometry[i];
              const on = i === selected;
              return (
                <g key={n.id} className="cursor-pointer" onClick={() => setSelected(i)} role="button" aria-label={n.label} tabIndex={0} onKeyDown={(e) => e.key === "Enter" && setSelected(i)}>
                  <circle cx={g.x} cy={g.y} r={on ? 34 : 28} fill={on ? "#1259d6" : "#ffffff"} stroke={on ? "#1259d6" : "#bcd6f5"} strokeWidth="1.5" className="transition-all duration-500" />
                  {on && !reduce && (
                    <circle cx={g.x} cy={g.y} r="34" fill="none" stroke="rgba(18,89,214,0.45)" strokeWidth="1.5">
                      <animate attributeName="r" values="34;46" dur="2s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.6;0" dur="2s" repeatCount="indefinite" />
                    </circle>
                  )}
                  <foreignObject x={g.x - 16} y={g.y - 16} width="32" height="32">
                    <div className="flex h-full w-full items-center justify-center">
                      <Icon name={n.icon} className={on ? "h-5 w-5 text-white" : "h-5 w-5 text-brand-600"} />
                    </div>
                  </foreignObject>
                </g>
              );
            })}
          </svg>

          {/* labels */}
          {list.map((n, i) => {
            const g = geometry[i];
            const cos = Math.cos(g.a);
            const sin = Math.sin(g.a);
            const lx = 320 + (205 + 44) * cos;
            const ly = 320 + (205 + 40) * sin;
            const anchor = Math.abs(cos) < 0.35 ? "middle" : cos > 0 ? "start" : "end";
            return (
              <button
                key={`l-${n.id}`}
                onClick={() => setSelected(i)}
                aria-pressed={i === selected}
                className={`absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full border px-3 py-1.5 text-[11px] font-bold tracking-wide transition-all duration-300 sm:text-xs ${
                  i === selected
                    ? "border-brand-600 bg-brand-600 text-white shadow-card"
                    : "border-line bg-white/90 text-ink-soft hover:border-brand-300 hover:text-brand-700"
                }`}
                style={{ left: `${(lx / 640) * 100}%`, top: `${(ly / 640) * 100}%`, transform: `translate(${anchor === "start" ? "0" : anchor === "end" ? "-100%" : "-50%"}, -50%)` }}
              >
                {n.label}
              </button>
            );
          })}
        </motion.div>

        {/* copy */}
        <div>
          <SectionHeading
            align="left"
            kicker="Technology ecosystem"
            title={
              <>
                Connected Intelligence. <span className="text-brand-600">Endless Possibilities.</span>
              </>
            }
            sub="Six systems, one nervous system. Each node talks to every other — hardware on the vehicle, AI on the edge, analytics in the cloud."
          />
          <div className="mt-8 rounded-3xl border border-line bg-white p-6 shadow-card">
            <AnimatePresence mode="wait">
              <motion.div
                key={active?.id}
                initial={reduce ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0, y: -10 }}
                transition={{ duration: 0.35 }}
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-600 text-white">
                    <Icon name={active?.icon ?? "chip"} className="h-5 w-5" />
                  </span>
                  <h3 className="font-display text-xl font-bold text-ink">{active?.label}</h3>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-ink-muted">{active?.text}</p>
              </motion.div>
            </AnimatePresence>
            <div className="mt-5 flex flex-wrap gap-1.5">
              {list.map((n, i) => (
                <button
                  key={n.id}
                  onClick={() => setSelected(i)}
                  aria-pressed={i === selected}
                  className={`h-1.5 rounded-full transition-all duration-500 ${i === selected ? "w-8 bg-brand-600" : "w-4 bg-mist-300 hover:bg-brand-200"}`}
                  aria-label={`Show ${n.label}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes rl-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes rl-spin-rev {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        .eco-spin {
          animation: rl-spin 40s linear infinite;
          transform-origin: 320px 320px;
        }
        .eco-spin-rev {
          animation: rl-spin-rev 56s linear infinite;
          transform-origin: 320px 320px;
        }
      `}</style>
    </section>
  );
}
