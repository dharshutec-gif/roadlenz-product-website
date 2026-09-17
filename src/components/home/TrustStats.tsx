"use client";

import React from "react";
import { Reveal, Icon, useCountUp, useRevealOnView } from "../ui";
import type { Stat } from "@/lib/types";

function StatItem({ stat, index }: { stat: Stat; index: number }) {
  const { ref, inView } = useRevealOnView<HTMLDivElement>(0.4);
  const value = useCountUp(stat.counter ?? 0, inView);
  const isCounter = (stat.counter ?? 0) > 0;
  return (
    <div ref={ref} className="relative flex flex-col items-center gap-2 px-6 py-8 text-center sm:py-10">
      {index > 0 && (
        <span aria-hidden className="absolute left-0 top-1/2 hidden h-14 w-px -translate-y-1/2 bg-line lg:block" />
      )}
      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
        <Icon name={stat.icon} className="h-5 w-5" />
      </span>
      <span className="font-display text-3xl font-extrabold tracking-tight text-ink tabular sm:text-4xl">
        {isCounter ? `${value.toLocaleString("en-IN")}${stat.suffix ?? ""}` : stat.value}
      </span>
      <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-muted">{stat.label}</span>
    </div>
  );
}

export default function TrustStats({ stats }: { stats: Stat[] }) {
  return (
    <section aria-label="RoadLenz at a glance" className="relative border-b border-line bg-white">
      <div className="shell">
        <Reveal>
          <div className="grid grid-cols-2 divide-y divide-line lg:grid-cols-4 lg:divide-x lg:divide-y-0">
            {stats.map((s, i) => (
              <StatItem key={s.id} stat={s} index={i} />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
