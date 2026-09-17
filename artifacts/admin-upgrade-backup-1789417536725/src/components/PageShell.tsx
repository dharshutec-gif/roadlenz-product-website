"use client";

import React from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Icon } from "./ui";

/** Consistent band under the fixed header for all interior pages. */
export default function PageShell({
  kicker,
  title,
  sub,
  crumb,
  children,
  dark = false,
}: {
  kicker?: string;
  title: React.ReactNode;
  sub?: React.ReactNode;
  crumb?: { label: string; href: string }[];
  children?: React.ReactNode;
  dark?: boolean;
}) {
  const reduce = useReducedMotion();
  return (
    <section className={`relative overflow-hidden pt-[72px] ${dark ? "bg-ink" : "bg-mist-100"}`}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: dark
            ? "radial-gradient(1200px 400px at 70% -10%, rgba(42,114,236,0.22), transparent 60%)"
            : "radial-gradient(1100px 380px at 75% -10%, rgba(18,89,214,0.08), transparent 60%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage: `linear-gradient(${dark ? "rgba(255,255,255,0.045)" : "rgba(12,31,58,0.035)"} 1px, transparent 1px), linear-gradient(90deg, ${
            dark ? "rgba(255,255,255,0.045)" : "rgba(12,31,58,0.035)"
          } 1px, transparent 1px)`,
          backgroundSize: "56px 56px",
          maskImage: "linear-gradient(to bottom, black, transparent 85%)",
          WebkitMaskImage: "linear-gradient(to bottom, black, transparent 85%)",
        }}
      />
      <div className="shell relative pb-12 pt-12 sm:pb-16 sm:pt-16">
        {crumb && (
          <motion.nav
            aria-label="Breadcrumb"
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-5 flex items-center gap-1.5 text-xs font-semibold text-ink-faint"
          >
            <Link href="/" className="transition hover:text-brand-700">Home</Link>
            {crumb.map((c) => (
              <React.Fragment key={c.label}>
                <Icon name="chevronRight" className="h-3 w-3" />
                <Link href={c.href} className="transition hover:text-brand-700">{c.label}</Link>
              </React.Fragment>
            ))}
          </motion.nav>
        )}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="max-w-3xl"
        >
          {kicker && (
            <span className={`kicker ${dark ? "text-brand-300" : ""}`}>{kicker}</span>
          )}
          <h1 className={`h-display mt-4 text-4xl sm:text-5xl ${dark ? "text-white" : ""}`}>{title}</h1>
          {sub && <p className={`mt-5 max-w-2xl text-base leading-relaxed sm:text-lg ${dark ? "text-white/70" : "text-ink-muted"}`}>{sub}</p>}
        </motion.div>
        {children}
      </div>
    </section>
  );
}
