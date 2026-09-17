import type { Metadata } from "next";
import Link from "next/link";
import { readDb, listEntity, publishedOf } from "@/lib/db";
import PageShell from "@/components/PageShell";
import { Icon, SmartImage } from "@/components/ui";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Search" };

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = (await searchParams) ?? {};
  const query = (q ?? "").trim().toLowerCase();
  const db = readDb();

  const hay = (s: string) => s.toLowerCase();
  const match = (...fields: (string | undefined)[]) =>
    query && fields.some((f) => f && hay(f).includes(query));

  const products = publishedOf<import("@/lib/types").Product>(listEntity<import("@/lib/types").Product>(db, "products")).filter((p) => match(p.name, p.category, p.tagline));
  const industries = publishedOf<import("@/lib/types").Industry>(listEntity<import("@/lib/types").Industry>(db, "industries")).filter((i) => match(i.name, i.tagline, i.summary.join(" ")));
  const resources = publishedOf<import("@/lib/types").ResourceItem>(listEntity<import("@/lib/types").ResourceItem>(db, "resources")).filter((r) => match(r.title, r.description));
  const locations = publishedOf<import("@/lib/types").OfficeLocation>(listEntity<import("@/lib/types").OfficeLocation>(db, "locations")).filter((l) => match(l.name, l.city, l.country));

  const total = products.length + industries.length + resources.length + locations.length;

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="mb-10">
      <h2 className="mb-4 font-display text-xl font-bold text-ink">{title}</h2>
      {children}
    </div>
  );

  return (
    <>
      <PageShell
        kicker="Search"
        title={query ? <>Results for “{q}”</> : "Search RoadLenz"}
        sub={query ? `${total} result${total === 1 ? "" : "s"} across products, solutions and resources.` : "Type a product, industry or topic to search."}
        crumb={[{ label: "Search", href: "/search" }]}
      />
      <section className="bg-mist-50 py-14">
        <div className="shell">
          <form action="/search" method="get" role="search" className="mb-12 flex max-w-xl items-center gap-2 rounded-full border border-line bg-white px-5 py-3 shadow-card">
            <Icon name="search" className="h-5 w-5 text-ink-faint" />
            <input
              type="search"
              name="q"
              defaultValue={q ?? ""}
              placeholder="Search products, industries, resources…"
              aria-label="Search"
              className="w-full bg-transparent text-sm outline-none"
            />
          </form>

          {query && total === 0 && (
            <div className="rounded-3xl border border-dashed border-line bg-white p-14 text-center">
              <p className="font-display text-lg font-bold text-ink">No matches for “{q}”</p>
              <p className="mt-2 text-sm text-ink-muted">Try a product name (e.g. “MDVR”), an industry (“mining”) or a topic (“fuel”).</p>
            </div>
          )}

          {products.length > 0 && (
            <Section title={`Products (${products.length})`}>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {products.map((p) => (
                  <Link key={p.id} href={`/products/${p.slug}`} className="group flex items-center gap-4 rounded-2xl border border-line bg-white p-4 shadow-card transition hover:border-brand-300">
                    <span className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-mist-100 p-1.5">
                      <SmartImage src={p.image} alt="" className="h-full w-full object-contain mix-blend-multiply" />
                    </span>
                    <span>
                      <span className="block text-[13.5px] font-bold text-ink group-hover:text-brand-700">{p.name}</span>
                      <span className="block text-xs text-ink-muted">{p.category}</span>
                    </span>
                  </Link>
                ))}
              </div>
            </Section>
          )}

          {industries.length > 0 && (
            <Section title={`Industries (${industries.length})`}>
              <div className="grid gap-3 sm:grid-cols-2">
                {industries.map((i) => (
                  <Link key={i.id} href={`/industries/${i.slug}`} className="group rounded-2xl border border-line bg-white p-4 shadow-card transition hover:border-brand-300">
                    <span className="block text-sm font-bold text-ink group-hover:text-brand-700">{i.name}</span>
                    <span className="mt-1 block text-xs leading-relaxed text-ink-muted">{i.tagline}</span>
                  </Link>
                ))}
              </div>
            </Section>
          )}

          {resources.length > 0 && (
            <Section title={`Resources (${resources.length})`}>
              <div className="grid gap-3 sm:grid-cols-2">
                {resources.map((r) => (
                  <Link key={r.id} href="/resources" className="group rounded-2xl border border-line bg-white p-4 shadow-card transition hover:border-brand-300">
                    <span className="block text-[11px] font-bold uppercase tracking-wider text-ink-faint">{r.type.replace("-", " ")}</span>
                    <span className="mt-1 block text-sm font-bold text-ink group-hover:text-brand-700">{r.title}</span>
                  </Link>
                ))}
              </div>
            </Section>
          )}

          {locations.length > 0 && (
            <Section title={`Locations (${locations.length})`}>
              <div className="grid gap-3 sm:grid-cols-2">
                {locations.map((l) => (
                  <Link key={l.id} href="/global-presence" className="group rounded-2xl border border-line bg-white p-4 shadow-card transition hover:border-brand-300">
                    <span className="block text-sm font-bold text-ink group-hover:text-brand-700">{l.name}</span>
                    <span className="mt-1 block text-xs text-ink-muted">{l.city}, {l.country}</span>
                  </Link>
                ))}
              </div>
            </Section>
          )}
        </div>
      </section>
    </>
  );
}
