"use client";

import React from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Icon, Reveal, SectionHeading, SmartImage } from "../ui";
import type { CaseStudy } from "@/lib/types";

export default function DeploymentSpotlight({ study }: { study?: CaseStudy }) {
  const reduce = useReducedMotion();
  const approved = study?.approved ?? false;

  return (
    <section id="spotlight" className="relative overflow-hidden bg-mist-100 py-20 sm:py-28">
      <div className="shell">
        <SectionHeading
          kicker="Deployment spotlight"
          title={
            <>
              Real roads. Real depots. <span className="text-brand-600">Real outcomes.</span>
            </>
          }
          sub={
            approved
              ? "A live deployment, end to end — from challenge to verified results."
              : "A deployment template from our field. Customer name and verified results appear here once the client approves publication."
          }
        />

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          {/* media */}
          <Reveal className="relative">
            <div className="relative overflow-hidden rounded-3xl border border-line shadow-lift">
              <div className="aspect-[4/3] w-full">
                {study?.video && study.video.type === "video" ? (
                  <video src={study.video.src} poster={study.video.poster} muted loop autoPlay playsInline className="h-full w-full object-cover" />
                ) : (
                  <SmartImage
                    src={study?.image ?? "/media/spotlight/spot-depot.jpg"}
                    alt="RoadLenz deployment site"
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
              <span className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-black/55 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-white backdrop-blur">
                <Icon name="camera" className="h-3.5 w-3.5" />
                {study?.location ?? "Chennai, Tamil Nadu"}
              </span>
              {!approved && (
                <span className="absolute right-4 top-4 rounded-full bg-amber-100/95 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-amber-800">
                  Pending customer approval
                </span>
              )}
            </div>
          </Reveal>

          {/* content */}
          <div className="flex flex-col gap-6">
            <Reveal delay={0.05}>
              <p className="font-display text-xl font-bold text-ink sm:text-2xl">
                {study?.client ?? "[Customer name — pending approval]"}
              </p>
              <p className="mt-1 text-sm font-semibold text-brand-700">{study?.title ?? "City bus operator brings video intelligence to 60+ buses"}</p>
            </Reveal>

            <Reveal delay={0.1} className="space-y-4">
              {[
                { icon: "alert", label: "Challenge", text: study?.challenge },
                { icon: "check", label: "RoadLenz solution", text: study?.solution },
              ].map((b) =>
                b.text ? (
                  <div key={b.label} className="rounded-2xl border border-line bg-white p-5">
                    <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-brand-700">
                      <Icon name={b.icon} className="h-4 w-4" />
                      {b.label}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-ink-muted">{b.text}</p>
                  </div>
                ) : null,
              )}
            </Reveal>

            {study?.technology && (
              <Reveal delay={0.15}>
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-ink-faint">Deployed technology</p>
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {study.technology.map((t) => (
                    <span key={t} className="chip !bg-white">{t}</span>
                  ))}
                </div>
              </Reveal>
            )}

            {study && (
              <Reveal delay={0.2}>
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-ink-faint">Verified results</p>
                <div className="mt-2.5 grid gap-3 sm:grid-cols-2">
                  {study.results.map((r, i) => (
                    <div key={i} className={`rounded-2xl border p-4 ${approved ? "border-line bg-white" : "border-dashed border-line bg-white/60"}`}>
                      <p className="font-display text-lg font-extrabold text-ink">{r.metric}</p>
                      <p className="mt-1 text-xs leading-relaxed text-ink-muted">{r.note}</p>
                    </div>
                  ))}
                </div>
              </Reveal>
            )}

            <Reveal delay={0.25} className="mt-1 flex flex-wrap gap-3">
              <Link href="/resources?type=case-study" className="btn-ghost">
                All case studies <Icon name="arrowRight" className="h-4 w-4" />
              </Link>
              <Link href="/book-demo" className="btn-primary">
                Request a similar deployment
              </Link>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
