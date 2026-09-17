"use client";

import React, { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

export interface MapVehicle {
  id: string;
  routeId: string;
  /** starting offset along route, 0..1 */
  offset?: number;
  /** cycles per 60s */
  speed?: number;
  color?: string;
  label?: string;
}

export interface MapRoute {
  id: string;
  d: string;
  color?: string;
  animated?: boolean;
}

/**
 * Abstract "operations map" — stylised road network with animated routes
 * and moving vehicle markers. Purely illustrative (demo data).
 */
export default function RouteMap({
  routes,
  vehicles = [],
  className = "",
  highlight = null,
  onSelect,
  selected,
}: {
  routes: MapRoute[];
  vehicles?: MapVehicle[];
  className?: string;
  highlight?: string | null; // route id to emphasise
  onSelect?: (vehicleId: string) => void;
  selected?: string | null;
}) {
  const gRefs = useRef<Record<string, SVGGElement | null>>({});
  const pathRefs = useRef<Record<string, SVGPathElement | null>>({});
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) {
      vehicles.forEach((v) => {
        const g = gRefs.current[v.id];
        const p = pathRefs.current[v.routeId];
        if (g && p) {
          const len = p.getTotalLength();
          const pt = p.getPointAtLength(((v.offset ?? 0) * len) % len);
          g.setAttribute("transform", `translate(${pt.x} ${pt.y})`);
        }
      });
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const s = (t - start) / 1000;
      vehicles.forEach((v) => {
        const g = gRefs.current[v.id];
        const p = pathRefs.current[v.routeId];
        if (!g || !p) return;
        const len = p.getTotalLength();
        const cycle = 60 / (v.speed ?? 1);
        const tt = (((v.offset ?? 0) + s / cycle) % 1 + 1) % 1;
        const pt = p.getPointAtLength(tt * len);
        g.setAttribute("transform", `translate(${pt.x} ${pt.y})`);
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [vehicles, reduce]);

  return (
    <svg viewBox="0 0 640 400" className={`h-full w-full ${className}`} role="img" aria-label="Fleet route map (demo data)">
      <defs>
        <linearGradient id="bay" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#dcecfb" />
          <stop offset="100%" stopColor="#cfe3f8" />
        </linearGradient>
        <pattern id="blocks" width="56" height="56" patternUnits="userSpaceOnUse">
          <rect width="56" height="56" fill="none" />
          <rect x="4" y="4" width="48" height="48" rx="10" fill="#f2f7fd" />
        </pattern>
      </defs>

      <rect width="640" height="400" fill="#fbfdff" />
      <rect width="640" height="400" fill="url(#blocks)" opacity="0.85" />

      {/* bay (east) */}
      <path d="M520 0 C 500 90 540 150 515 220 C 495 280 530 340 510 400 L 640 400 L 640 0 Z" fill="url(#bay)" />
      <path d="M520 0 C 500 90 540 150 515 220 C 495 280 530 340 510 400" fill="none" stroke="#b7d4f0" strokeWidth="2" />

      {/* minor roads */}
      <g stroke="#dbe7f4" strokeWidth="7" strokeLinecap="round" fill="none">
        <path d="M40 80 H 520" />
        <path d="M40 160 H 515" />
        <path d="M40 240 H 515" />
        <path d="M40 320 H 515" />
        <path d="M120 20 V 380" />
        <path d="M240 20 V 380" />
        <path d="M360 20 V 380" />
        <path d="M460 40 V 380" />
      </g>
      <g stroke="#e8f1fa" strokeWidth="2" strokeDasharray="6 10" strokeLinecap="round" fill="none">
        <path d="M40 80 H 520" />
        <path d="M40 160 H 515" />
        <path d="M40 240 H 515" />
        <path d="M40 320 H 515" />
        <path d="M120 20 V 380" />
        <path d="M240 20 V 380" />
        <path d="M360 20 V 380" />
      </g>

      {/* arterials */}
      <g stroke="#cfe0f2" strokeWidth="12" strokeLinecap="round" fill="none">
        <path d="M20 380 C 140 300 180 240 260 200 C 350 155 420 130 505 95" />
        <path d="M60 40 C 160 120 300 90 420 170 C 470 200 500 260 515 330" />
      </g>

      {/* routes */}
      {routes.map((r) => {
        const isHi = highlight === r.id;
        const dim = highlight && !isHi;
        return (
          <g key={r.id} opacity={dim ? 0.35 : 1}>
            <path ref={(el) => { pathRefs.current[r.id] = el; }} d={r.d} fill="none" stroke={r.color ?? "#1259d6"} strokeWidth={isHi ? 4 : 3} strokeLinecap="round" className={r.animated ? "route-dash" : undefined} opacity={isHi ? 1 : 0.75} />
          </g>
        );
      })}

      {/* depot + destinations */}
      <g>
        <rect x="112" y="292" width="16" height="16" rx="4" fill="#0c1f3a" />
        <rect x="115" y="295" width="10" height="10" rx="2" fill="#fff" opacity="0.9" />
        <circle cx="505" cy="95" r="9" fill="none" stroke="#1259d6" strokeWidth="2.5" />
        <circle cx="505" cy="95" r="3.5" fill="#1259d6" />
        <circle cx="515" cy="330" r="9" fill="none" stroke="#d8453e" strokeWidth="2" opacity="0.7" />
        <circle cx="515" cy="330" r="3" fill="#d8453e" opacity="0.8" />
      </g>

      {/* vehicles */}
      {vehicles.map((v) => {
        const isSel = selected === v.id;
        return (
          <g
            key={v.id}
            ref={(el) => { gRefs.current[v.id] = el; }}
            className={onSelect ? "cursor-pointer" : undefined}
            onClick={() => onSelect?.(v.id)}
          >
            {isSel && <circle r="14" fill={v.color ?? "#1259d6"} opacity="0.18" />}
            <circle r={isSel ? 8 : 6.5} fill={v.color ?? "#1259d6"} stroke="#fff" strokeWidth="2.5" />
            {isSel && (
              <g transform="translate(0 -24)">
                <rect x="-24" y="-12" width="48" height="16" rx="4" fill="#0c1f3a" />
                <text x="0" y="0" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="700">
                  {v.label ?? v.id}
                </text>
              </g>
            )}
          </g>
        );
      })}
    </svg>
  );
}
