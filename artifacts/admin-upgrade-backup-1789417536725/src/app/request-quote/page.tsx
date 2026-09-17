import type { Metadata } from "next";
import Link from "next/link";
import { readDb, listEntity, publishedOf } from "@/lib/db";
import PageShell from "@/components/PageShell";
import { Icon, Reveal } from "@/components/ui";
import { QuoteForm } from "@/components/RequestForms";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Request Quote",
  description: "Get fleet pricing for RoadLenz hardware and the platform — indicative pricing shared in the first response.",
};

const STEPS = [
  { icon: "doc", title: "We review your fleet", text: "Routes, vehicle mix and current setup — one engineer reads your brief, not a bot." },
  { icon: "gauge", title: "Configuration & pricing", text: "A written configuration with indicative pricing per vehicle and per site." },
  { icon: "wrench", title: "Pilot, then scale", text: "Start with a pilot group, verify results, then roll out depot by depot." },
];

export default async function RequestQuotePage() {
  const db = readDb();
  const products = publishedOf<import("@/lib/types").Product>(listEntity<import("@/lib/types").Product>(db, "products"));

  return (
    <>
      <PageShell
        kicker="Request quote"
        title={
          <>
            Pricing that matches <span className="text-brand-600">your fleet.</span>
          </>
        }
        sub="Tell us what you run. We'll respond within one business day with a written configuration and indicative pricing."
        crumb={[{ label: "Request Quote", href: "/request-quote" }]}
      />
      <section className="bg-mist-50 py-14">
        <div className="shell grid gap-8 lg:grid-cols-[1fr_1.3fr]">
          <div className="flex flex-col gap-4">
            {STEPS.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.07}>
                <div className="flex items-start gap-4 rounded-3xl border border-line bg-white p-5 shadow-card">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
                    <Icon name={s.icon} className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-display text-[15px] font-bold text-ink">
                      <span className="mr-2 text-[11px] font-bold tabular text-ink-faint">0{i + 1}</span>
                      {s.title}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-ink-muted">{s.text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
            <Reveal delay={0.2}>
              <div className="rounded-3xl border border-line bg-white p-5 shadow-card">
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-ink-faint">Hardware in scope</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {products.map((p) => (
                    <Link key={p.id} href={`/products/${p.slug}`} className="chip transition hover:border-brand-400 hover:text-brand-700">
                      {p.category}
                    </Link>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <QuoteForm />
          </Reveal>
        </div>
      </section>
    </>
  );
}
