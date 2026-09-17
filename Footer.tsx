import React from "react";
import Link from "next/link";
import { Icon, Logo } from "./ui";
import type { Db } from "@/lib/types";

export default function Footer({ db }: { db: Pick<Db, "settings" | "products" | "industries" | "locations"> }) {
  const s = db.settings;
  const products = db.products.filter((p) => p.published);
  const industries = db.industries.filter((i) => i.published);
  const categories = Array.from(new Set(products.map((p) => p.category)));

  const col = (title: string, links: { label: string; href: string }[]) => (
    <div>
      <h3 className="text-[11px] font-bold uppercase tracking-[0.18em] text-ink-faint">{title}</h3>
      <ul className="mt-4 space-y-2.5">
        {links.map((l) => (
          <li key={l.label}>
            <Link href={l.href} className="text-sm text-ink-soft transition hover:text-brand-700">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <footer className="border-t border-line bg-white">
      <div className="shell grid gap-10 py-14 lg:grid-cols-[1.4fr_repeat(4,1fr)] lg:gap-8">
        <div className="max-w-xs">
          <Link href="/" aria-label="RoadLenz home">
            <Logo />
          </Link>
          <p className="mt-4 text-sm leading-relaxed text-ink-muted">{s.description}</p>
          <ul className="mt-5 space-y-2.5 text-sm text-ink-soft">
            {s.contact.address ? (
              <li className="flex items-start gap-2.5">
                <Icon name="pin" className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
                <span>{s.contact.address}</span>
              </li>
            ) : null}
            {s.contact.phone ? (
              <li className="flex items-center gap-2.5">
                <Icon name="phone" className="h-4 w-4 text-brand-600" />
                <a href={`tel:${s.contact.phone.replace(/\s/g, "")}`} className="hover:text-brand-700">{s.contact.phone}</a>
              </li>
            ) : (
              <li className="flex items-center gap-2.5 text-ink-faint">
                <Icon name="phone" className="h-4 w-4" />
                Phone — available soon
              </li>
            )}
            {s.contact.email ? (
              <li className="flex items-center gap-2.5">
                <Icon name="mail" className="h-4 w-4 text-brand-600" />
                <a href={`mailto:${s.contact.email}`} className="hover:text-brand-700">{s.contact.email}</a>
              </li>
            ) : (
              <li className="flex items-center gap-2.5 text-ink-faint">
                <Icon name="mail" className="h-4 w-4" />
                Email — available soon
              </li>
            )}
          </ul>
          <div className="mt-5 flex gap-2">
            {s.social.map((so) => (
              <a
                key={so.label}
                href={so.href}
                aria-label={so.label}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-xs font-bold text-ink-soft transition hover:border-brand-400 hover:bg-brand-50 hover:text-brand-700"
              >
                {so.label.slice(0, 2)}
              </a>
            ))}
          </div>
        </div>

        {col("Products", categories.map((c) => ({ label: c, href: `/products?cat=${encodeURIComponent(c)}` })))}
        {col("Industries", industries.map((i) => ({ label: i.name, href: `/industries/${i.slug}` })))}
        {col(
          "Company",
          [
            { label: "About Us", href: "/about" },
            { label: "Global Presence", href: "/global-presence" },
            { label: "Technology", href: "/technology" },
            { label: "Contact Us", href: "/contact" },
            { label: "Request Quote", href: "/request-quote" },
            { label: "Book a Demo", href: "/book-demo" },
          ],
        )}
        {col(
          "Resources",
          [
            { label: "All Resources", href: "/resources" },
            { label: "Case Studies", href: "/resources?type=case-study" },
            { label: "Installation Guides", href: "/resources?type=guide" },
            { label: "Downloads", href: "/resources?type=download" },
            { label: "Warranty Info", href: "/resources?type=warranty" },
            { label: "Customer Login", href: "/customer-login" },
          ],
        )}
      </div>

      <div className="border-t border-line">
        <div className="shell flex flex-col gap-3 py-6 md:flex-row md:items-center md:justify-between">
          <p className="max-w-2xl text-xs leading-relaxed text-ink-faint">{s.footerNote}</p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-semibold text-ink-muted">
            <span>© {new Date().getFullYear()} {s.legalName}</span>
            <Link href="/privacy" className="hover:text-brand-700">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-brand-700">Terms</Link>
            <span className="flex items-center gap-1.5 text-ink-faint">
              <Icon name="shield" className="h-3.5 w-3.5 text-brand-600" />
              Powered by {s.parentCompany}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
