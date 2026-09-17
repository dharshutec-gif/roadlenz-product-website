"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { Icon, Logo } from "../ui";
import EntityManager from "./EntityManager";
import SettingsForm from "./SettingsForm";
import RequestsView from "./RequestsView";
import Overview from "./Overview";

type Section =
  | "aboutSections"
  | "aboutSlides"
  | "aboutMilestones"
  | "aboutOffices"
  | "aboutSupport"
  | "aboutLeaders"
  | "overview"
  | "heroSlides"
  | "products"
  | "productCategories"
  | "industries"
  | "caseStudies"
  | "customerLogos"
  | "resources"
  | "locations"
  | "stats"
  | "whyPoints"
  | "ecosystemNodes"
  | "engineeringItems"
  | "solutionFinder"
  | "solutions"
  | "requests"
  | "settings";

const NAV: { group: string; items: { id: Section; label: string; icon: string; badge?: string }[] }[] = [
  { group: "About Us", items: [{"id":"aboutSections","label":"Page copy & backgrounds","icon":"globe"},{"id":"aboutSlides","label":"Hero slides","icon":"globe"},{"id":"aboutMilestones","label":"Journey milestones","icon":"globe"},{"id":"aboutOffices","label":"Worldwide offices","icon":"globe"},{"id":"aboutSupport","label":"Support teams","icon":"globe"},{"id":"aboutLeaders","label":"Leadership","icon":"globe"}] },
  { group: "Site", items: [{ id: "overview", label: "Overview", icon: "gauge" }] },
  {
    group: "Homepage",
    items: [
      { id: "heroSlides", label: "Hero slides", icon: "video" },
      { id: "stats", label: "Statistics", icon: "compass" },
      { id: "whyPoints", label: "Why RoadLenz", icon: "chip" },
      { id: "ecosystemNodes", label: "Ecosystem", icon: "layers" },
      { id: "solutionFinder", label: "Solution finder", icon: "route" },
      { id: "engineeringItems", label: "Engineering", icon: "wrench" },
    ],
  },
  {
    group: "Catalog",
    items: [
      { id: "solutions", label: "Solutions", icon: "route" },
      { id: "productCategories", label: "Product categories", icon: "layers" },
      { id: "products", label: "Products", icon: "box" },
      { id: "industries", label: "Industries", icon: "fleet" },
      { id: "caseStudies", label: "Case studies", icon: "doc" },
      { id: "customerLogos", label: "Customer logos", icon: "building" },
      { id: "resources", label: "Resources", icon: "sparkle" },
      { id: "locations", label: "Locations", icon: "pin" },
    ],
  },
  {
    group: "Requests & settings",
    items: [
      { id: "requests", label: "Requests", icon: "mail" },
      { id: "settings", label: "Settings & SEO", icon: "settings" },
    ],
  },
];

export default function AdminConsole({ session }: { session: { name: string; email: string } }) {
  const [section, setSection] = useState<Section>("overview");
  const [navOpen, setNavOpen] = useState(false);
  const router = useRouter();
  const reduce = useReducedMotion();

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  };

  const labelOf = (id: Section) =>
    NAV.flatMap((g) => g.items).find((i) => i.id === id)?.label ?? id;

  return (
    <div className="min-h-[100svh] bg-mist-50 pt-[72px]">
      {/* top bar */}
      <div className="sticky top-[72px] z-30 border-b border-line bg-white/95 backdrop-blur">
        <div className="shell flex items-center justify-between gap-4 py-3.5">
          <div className="flex items-center gap-3">
            <button onClick={() => setNavOpen((o) => !o)} className="rounded-full border border-line p-2 text-ink lg:hidden" aria-label="Toggle navigation">
              <Icon name={navOpen ? "x" : "menu"} className="h-[18px] w-[18px]" />
            </button>
            <div>
              <p className="text-[10.5px] font-bold uppercase tracking-[0.18em] text-ink-faint">Admin console</p>
              <h1 className="font-display text-lg font-extrabold leading-tight text-ink">{labelOf(section)}</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/" target="_blank" className="btn-ghost hidden !py-2 text-xs sm:inline-flex">
              <Icon name="eye" className="h-3.5 w-3.5" /> Preview site
            </Link>
            <span className="hidden items-center gap-2 rounded-full border border-line bg-mist-50 px-3.5 py-1.5 text-xs font-bold text-ink-soft md:flex">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              {session.name}
            </span>
            <button onClick={logout} className="btn-ghost !py-2 text-xs">
              <Icon name="logout" className="h-3.5 w-3.5" /> Sign out
            </button>
          </div>
        </div>
      </div>

      <div className="shell grid gap-6 py-6 lg:grid-cols-[240px_1fr]">
        {/* sidebar */}
        <aside className={`${navOpen ? "block" : "hidden"} lg:block`}>
          <nav className="sticky top-[136px] space-y-5 rounded-3xl border border-line bg-white p-4 shadow-card">
            {NAV.map((g) => (
              <div key={g.group}>
                <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-ink-faint">{g.group}</p>
                <div className="space-y-0.5">
                  {g.items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setSection(item.id);
                        setNavOpen(false);
                      }}
                      aria-pressed={section === item.id}
                      className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-[13px] font-semibold transition ${
                        section === item.id ? "bg-brand-600 text-white shadow-card" : "text-ink-soft hover:bg-mist-100 hover:text-ink"
                      }`}
                    >
                      <Icon name={item.icon} className="h-4 w-4" />
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </aside>

        {/* content */}
        <motion.main
          key={section}
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="min-w-0"
        >
          {section === "overview" && <Overview onGo={setSection} />}
          {section === "settings" && <SettingsForm />}
          {section === "requests" && <RequestsView />}
          {["aboutSections","aboutSlides","aboutMilestones","aboutOffices","aboutSupport","aboutLeaders","heroSlides", "products", "productCategories", "solutions", "industries", "caseStudies", "customerLogos", "resources", "locations", "stats", "whyPoints", "ecosystemNodes", "engineeringItems", "solutionFinder"].includes(section) && (
            <EntityManager entity={section as "heroSlides"} key={section} />
          )}
        </motion.main>
      </div>
    </div>
  );
}
