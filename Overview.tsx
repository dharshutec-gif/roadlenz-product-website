"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Icon } from "../ui";

interface Stats {
  counts: Record<string, number>;
  newQuotes: number;
  newDemos: number;
  newMessages: number;
  recent: { kind: string; text: string; at: string; ref: string }[];
  unapproved: number;
}

export default function Overview({ onGo }: { onGo: (s: any) => void }) {
  const [data, setData] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/admin/overview", { cache: "no-store" })
      .then((r) => r.json())
      .then(setData)
      .catch(() => setData(null));
  }, []);

  if (!data) {
    return <div className="rounded-3xl border border-line bg-white p-10 text-center text-sm font-semibold text-ink-muted">Loading overview…</div>;
  }

  const tiles = [
    { label: "Products", value: data.counts.products, icon: "box", to: "products" },
    { label: "Industries", value: data.counts.industries, icon: "fleet", to: "industries" },
    { label: "Hero slides", value: data.counts.heroSlides, icon: "video", to: "heroSlides" },
    { label: "Resources", value: data.counts.resources, icon: "sparkle", to: "resources" },
    { label: "Locations", value: data.counts.locations, icon: "pin", to: "locations" },
    { label: "Case studies", value: data.counts.caseStudies, icon: "doc", to: "caseStudies" },
  ];

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {tiles.map((t) => (
          <button
            key={t.label}
            onClick={() => onGo(t.to)}
            className="group rounded-3xl border border-line bg-white p-4 text-left shadow-card transition hover:-translate-y-0.5 hover:shadow-lift"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-600 transition group-hover:bg-brand-600 group-hover:text-white">
              <Icon name={t.icon} className="h-4 w-4" />
            </span>
            <p className="mt-3 font-display text-2xl font-extrabold tabular text-ink">{t.value}</p>
            <p className="text-[11px] font-bold uppercase tracking-wider text-ink-faint">{t.label}</p>
          </button>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="rounded-3xl border border-line bg-white p-5 shadow-card lg:col-span-2">
          <h3 className="font-display text-lg font-bold text-ink">Latest requests</h3>
          {data.recent.length === 0 ? (
            <p className="mt-4 text-sm text-ink-muted">No quote, demo or contact requests yet.</p>
          ) : (
            <ul className="mt-4 divide-y divide-line/70">
              {data.recent.map((r, i) => (
                <li key={i} className="flex items-center justify-between gap-3 py-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-mist-100 text-brand-600">
                      <Icon name={r.kind === "quote" ? "doc" : r.kind === "demo" ? "calendar" : "mail"} className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-sm font-bold text-ink">{r.text}</p>
                      <p className="text-xs text-ink-muted">{r.ref}</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-ink-faint">{r.at}</span>
                </li>
              ))}
            </ul>
          )}
          <button onClick={() => onGo("requests")} className="mt-3 text-xs font-bold text-brand-700 hover:underline">
            Open all requests →
          </button>
        </div>

        <div className="space-y-4">
          <div className="rounded-3xl border border-line bg-ink p-5 text-white shadow-card">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-300">Inbox pulse</p>
            <div className="mt-3 space-y-2.5 text-sm">
              <p className="flex items-center justify-between"><span className="text-white/70">New quotes</span><span className="font-bold tabular">{data.newQuotes}</span></p>
              <p className="flex items-center justify-between"><span className="text-white/70">New demo requests</span><span className="font-bold tabular">{data.newDemos}</span></p>
              <p className="flex items-center justify-between"><span className="text-white/70">New messages</span><span className="font-bold tabular">{data.newMessages}</span></p>
            </div>
          </div>
          <div className="rounded-3xl border border-amber-200 bg-amber-50 p-5">
            <p className="flex items-center gap-2 text-sm font-bold text-amber-900">
              <Icon name="alert" className="h-4 w-4" />
              {data.unapproved} case stud{data.unapproved === 1 ? "y" : "ies"} awaiting customer approval
            </p>
            <p className="mt-1.5 text-xs leading-relaxed text-amber-800/80">
              Published case studies with <span className="font-bold">approved = off</span> show as placeholders on the site.
            </p>
            <button onClick={() => onGo("caseStudies")} className="mt-3 text-xs font-bold text-amber-900 underline underline-offset-2">
              Review case studies
            </button>
          </div>
          <Link href="/" target="_blank" className="btn-ghost w-full justify-center !py-2.5 text-xs">
            <Icon name="eye" className="h-3.5 w-3.5" /> Preview public site
          </Link>
        </div>
      </div>
    </div>
  );
}
