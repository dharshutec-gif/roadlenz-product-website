"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Icon, SmartImage } from "../ui";
import type {
  CustomerProfile,
  Product,
  Ticket,
  Installation,
  Warranty,
  CustomerQuote,
  NotificationRow,
} from "./types";

type Tab = "overview" | "products" | "quotes" | "support" | "installations" | "documents" | "warranty" | "notifications";

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: "overview", label: "Overview", icon: "gauge" },
  { id: "products", label: "My Products", icon: "box" },
  { id: "quotes", label: "Quotes", icon: "doc" },
  { id: "support", label: "Support", icon: "headset" },
  { id: "installations", label: "Installations", icon: "wrench" },
  { id: "documents", label: "Documents", icon: "download" },
  { id: "warranty", label: "Warranty", icon: "shield" },
  { id: "notifications", label: "Notifications", icon: "bell" },
];

const statusChip: Record<string, string> = {
  active: "bg-emerald-50 text-emerald-700 border-emerald-200",
  approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
  delivered: "bg-brand-50 text-brand-700 border-brand-200",
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  open: "bg-brand-50 text-brand-700 border-brand-200",
  "in-progress": "bg-amber-50 text-amber-700 border-amber-200",
  resolved: "bg-emerald-50 text-emerald-700 border-emerald-200",
  completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  scheduled: "bg-mist-200 text-ink-muted border-line",
  maintenance: "bg-amber-50 text-amber-700 border-amber-200",
  expiring: "bg-amber-50 text-amber-700 border-amber-200",
  expired: "bg-accent-soft text-accent border-accent/25",
  high: "bg-accent-soft text-accent border-accent/25",
  medium: "bg-amber-50 text-amber-700 border-amber-200",
  low: "bg-mist-200 text-ink-muted border-line",
};

function Chip({ value }: { value: string }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10.5px] font-bold uppercase tracking-wider ${statusChip[value] ?? "bg-mist-200 text-ink-muted border-line"}`}>
      {value.replace("-", " ")}
    </span>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-3xl border border-line bg-white p-5 shadow-card ${className}`}>{children}</div>;
}

function SectionTitle({ title, action }: { title: string; action?: React.ReactNode }) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <h2 className="font-display text-lg font-bold text-ink">{title}</h2>
      {action}
    </div>
  );
}

export default function CustomerWorkspace({ initialName }: { initialName: string }) {
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [tab, setTab] = useState<Tab>("overview");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [ticketForm, setTicketForm] = useState({ subject: "", description: "" });
  const [ticketBusy, setTicketBusy] = useState(false);
  const router = useRouter();
  const reduce = useReducedMotion();

  const flash = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2600);
  };

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/customer", { cache: "no-store" });
      if (res.status === 401) {
        router.push("/customer-login");
        return;
      }
      const body = await res.json();
      setProfile(body.profile);
      setProducts(body.products ?? []);
      setError("");
    } catch {
      setError("Could not load your workspace. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    load();
  }, [load]);

  const unread = profile?.notifications.filter((n) => !n.read).length ?? 0;

  const toggleSave = async (slug: string) => {
    const res = await fetch("/api/customer/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug }),
    });
    const body = await res.json();
    if (body.saved !== undefined) {
      setProfile((p) => (p ? { ...p, savedProductSlugs: body.saved ? [...p.savedProductSlugs, slug] : p.savedProductSlugs.filter((s) => s !== slug) } : p));
      flash(body.saved ? "Saved to your list" : "Removed from saved");
    }
  };

  const createTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketForm.subject || !ticketForm.description) return;
    setTicketBusy(true);
    const res = await fetch("/api/customer/ticket", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(ticketForm),
    });
    const body = await res.json();
    setTicketBusy(false);
    if (body.ref) {
      setTicketForm({ subject: "", description: "" });
      flash(`Ticket ${body.ref} created`);
      load();
    }
  };

  const markRead = async () => {
    await fetch("/api/customer/notifications", { method: "POST" });
    load();
  };

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/customer-login");
    router.refresh();
  };

  const docs = useMemo(() => {
    if (!profile) return [];
    const fromProducts = profile.registeredProducts.flatMap((rp) => {
      const p = products.find((x) => x.slug === rp.productSlug);
      return (p?.documents ?? []).map((d) => ({ ...d, product: p?.name ?? rp.productSlug, serial: rp.serial }));
    });
    const base = [
      { name: "Warranty Certificate — fleet", url: "/media/documents/warranty-certificate.pdf", size: "280 KB", product: "All registered products", serial: "—" },
      { name: "RoadLenz Quick Start Guide", url: "/media/documents/quickstart.pdf", size: "1.4 MB", product: "Platform", serial: "—" },
    ];
    return [...fromProducts, ...base];
  }, [profile, products]);

  if (loading) {
    return (
      <div className="flex min-h-[100svh] flex-col items-center justify-center gap-4 bg-mist-50 pt-[72px]">
        <span className="h-8 w-8 animate-spin rounded-full border-[3px] border-brand-200 border-t-brand-600" />
        <p className="text-sm font-semibold text-ink-muted">Loading your workspace…</p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex min-h-[100svh] flex-col items-center justify-center gap-3 bg-mist-50 pt-[72px] px-6 text-center">
        <Icon name="alert" className="h-8 w-8 text-accent" />
        <p className="max-w-sm text-sm font-semibold text-ink-muted">{error || "No customer workspace found for this account."}</p>
        <button onClick={() => { setLoading(true); load(); }} className="btn-ghost !py-2.5">Try again</button>
      </div>
    );
  }

  return (
    <div className="min-h-[100svh] bg-mist-50 pt-[72px]">
      {/* top strip */}
      <div className="border-b border-line bg-white">
        <div className="shell flex flex-col gap-3 py-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-ink-faint">Customer workspace</p>
            <h1 className="font-display text-xl font-extrabold text-ink sm:text-2xl">
              Hello, {profile.name.split(" ")[0]} <span className="text-ink-faint">·</span>{" "}
              <span className="font-bold text-ink-muted">{profile.company}</span>
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={profile.fleetPlatformUrl || "#"}
              target={profile.fleetPlatformUrl ? "_blank" : undefined}
              rel="noreferrer"
              className={`btn-ghost !py-2.5 ${!profile.fleetPlatformUrl ? "pointer-events-none opacity-50" : ""}`}
              title={profile.fleetPlatformUrl ? "Open the live fleet platform" : "Integration link is enabled per contract"}
            >
              <Icon name="external" className="h-4 w-4" />
              Fleet platform
            </a>
            <button onClick={logout} className="btn-ghost !py-2.5">
              <Icon name="logout" className="h-4 w-4" />
              Sign out
            </button>
          </div>
        </div>
        {/* tabs */}
        <div className="shell -mx-1 flex gap-1 overflow-x-auto px-4 pb-0">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              aria-pressed={tab === t.id}
              className={`relative flex shrink-0 items-center gap-2 rounded-t-2xl px-4 py-3 text-[13px] font-bold transition ${
                tab === t.id ? "text-brand-700" : "text-ink-muted hover:text-ink"
              }`}
            >
              <Icon name={t.icon} className="h-4 w-4" />
              {t.label}
              {t.id === "notifications" && unread > 0 && (
                <span className="flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-accent px-1 text-[9.5px] font-bold text-white">{unread}</span>
              )}
              {tab === t.id && <span className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-brand-600" />}
            </button>
          ))}
        </div>
      </div>

      <div className="shell py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
          >
            {tab === "overview" && (
              <div className="grid gap-5 lg:grid-cols-3">
                <Card className="lg:col-span-2">
                  <SectionTitle title="Your plan" />
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-ink-faint">Plan</p>
                      <p className="mt-1 font-display text-lg font-extrabold text-ink">{profile.plan}</p>
                    </div>
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-ink-faint">Member since</p>
                      <p className="mt-1 font-display text-lg font-extrabold text-ink">{profile.memberSince}</p>
                    </div>
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-ink-faint">Contact</p>
                      <p className="mt-1 truncate text-sm font-bold text-ink">{profile.email}</p>
                      {profile.phone && <p className="truncate text-xs text-ink-muted">{profile.phone}</p>}
                    </div>
                  </div>
                  <div className="mt-6 rounded-2xl border border-dashed border-brand-300 bg-brand-50/60 p-5">
                    <p className="flex items-center gap-2 text-sm font-bold text-ink">
                      <Icon name="external" className="h-4 w-4 text-brand-600" />
                      Live fleet tracking
                    </p>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-ink-muted">
                      Real-time vehicle tracking lives in the dedicated RoadLenz fleet platform, not on this marketing site.
                      Your secure integration link is enabled here once your deployment contract is active.
                    </p>
                  </div>
                </Card>

                <Card>
                  <SectionTitle title="Recent activity" />
                  <ul className="space-y-3">
                    {profile.notifications.slice(0, 4).map((n) => (
                      <li key={n.id} className="flex items-start gap-2.5 text-[13px] leading-snug text-ink-soft">
                        <span className={`mt-1 h-1.5 w-1.5 shrink-0 rounded-full ${n.read ? "bg-ink-faint" : "bg-brand-600"}`} />
                        {n.text}
                      </li>
                    ))}
                  </ul>
                  <button onClick={() => setTab("notifications")} className="mt-4 text-xs font-bold text-brand-700 hover:underline">
                    View all notifications →
                  </button>
                </Card>

                <Card>
                  <SectionTitle
                    title="Installations"
                    action={<button onClick={() => setTab("installations")} className="text-xs font-bold text-brand-700 hover:underline">Details →</button>}
                  />
                  {profile.installations.slice(0, 2).map((inst) => (
                    <div key={inst.id} className="mb-4 last:mb-0">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-bold text-ink">{inst.site}</p>
                        <Chip value={inst.status} />
                      </div>
                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-mist-200">
                        <div className="h-full rounded-full bg-brand-500 transition-all duration-700" style={{ width: `${inst.progress}%` }} />
                      </div>
                      <p className="mt-1.5 text-xs text-ink-muted">{inst.progress}% complete · {inst.vehicles} vehicles</p>
                    </div>
                  ))}
                </Card>

                <Card>
                  <SectionTitle
                    title="Open tickets"
                    action={<button onClick={() => setTab("support")} className="text-xs font-bold text-brand-700 hover:underline">Support →</button>}
                  />
                  {profile.tickets.filter((t) => t.status !== "resolved").length === 0 ? (
                    <p className="text-sm text-ink-muted">No open tickets. 👍</p>
                  ) : (
                    <ul className="space-y-3">
                      {profile.tickets
                        .filter((t) => t.status !== "resolved")
                        .map((t) => (
                          <li key={t.id} className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-sm font-bold text-ink">{t.subject}</p>
                              <p className="text-xs text-ink-muted">{t.ref}</p>
                            </div>
                            <Chip value={t.status} />
                          </li>
                        ))}
                    </ul>
                  )}
                </Card>

                <Card>
                  <SectionTitle
                    title="Quotes"
                    action={<button onClick={() => setTab("quotes")} className="text-xs font-bold text-brand-700 hover:underline">All quotes →</button>}
                  />
                  <ul className="space-y-3">
                    {profile.quotes.slice(0, 3).map((q) => (
                      <li key={q.id} className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-bold text-ink">{q.item}</p>
                          <p className="text-xs text-ink-muted">{q.ref}</p>
                        </div>
                        <Chip value={q.status} />
                      </li>
                    ))}
                  </ul>
                </Card>
              </div>
            )}

            {tab === "products" && (
              <div className="grid gap-5 lg:grid-cols-2">
                <Card>
                  <SectionTitle title="Registered products" />
                  <div className="space-y-3">
                    {profile.registeredProducts.map((rp) => {
                      const p = products.find((x) => x.slug === rp.productSlug);
                      return (
                        <div key={rp.id} className="flex items-center gap-4 rounded-2xl border border-line p-3.5">
                          <span className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-mist-100 p-1.5">
                            <SmartImage src={p?.image ?? ""} alt="" className="h-full w-full object-contain mix-blend-multiply" />
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-bold text-ink">{p?.name ?? rp.productSlug}</p>
                            <p className="text-xs text-ink-muted">
                              {rp.serial} · {rp.vehicle}
                            </p>
                            <p className="text-[11px] text-ink-faint">Installed {rp.installedAt}</p>
                          </div>
                          <Chip value={rp.status} />
                        </div>
                      );
                    })}
                  </div>
                </Card>
                <Card>
                  <SectionTitle title="Saved for later" />
                  {profile.savedProductSlugs.length === 0 && <p className="text-sm text-ink-muted">Nothing saved yet — browse the catalog below.</p>}
                  <div className="space-y-2.5">
                    {profile.savedProductSlugs.map((slug) => {
                      const p = products.find((x) => x.slug === slug);
                      if (!p) return null;
                      return (
                        <div key={slug} className="flex items-center gap-3 rounded-2xl border border-line p-3">
                          <span className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-mist-100 p-1">
                            <SmartImage src={p.image} alt="" className="h-full w-full object-contain mix-blend-multiply" />
                          </span>
                          <div className="min-w-0 flex-1">
                            <Link href={`/products/${p.slug}`} className="block truncate text-sm font-bold text-ink hover:text-brand-700">{p.name}</Link>
                            <p className="text-xs text-ink-muted">{p.price}</p>
                          </div>
                          <button onClick={() => toggleSave(slug)} className="text-xs font-bold text-ink-faint hover:text-accent" aria-label={`Remove ${p.name} from saved`}>
                            Remove
                          </button>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-5 border-t border-line pt-4">
                    <p className="mb-3 text-[11px] font-bold uppercase tracking-wider text-ink-faint">Catalog</p>
                    <div className="grid grid-cols-2 gap-2">
                      {products.map((p) => {
                        const saved = profile.savedProductSlugs.includes(p.slug);
                        return (
                          <button
                            key={p.id}
                            onClick={() => toggleSave(p.slug)}
                            aria-pressed={saved}
                            className={`flex items-center justify-between gap-2 rounded-xl border px-3 py-2.5 text-left text-[12.5px] font-semibold transition ${
                              saved ? "border-brand-500 bg-brand-50 text-brand-700" : "border-line text-ink-soft hover:border-brand-300"
                            }`}
                          >
                            <span className="truncate">{p.name}</span>
                            <Icon name={saved ? "check" : "plus"} className="h-3.5 w-3.5 shrink-0" />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {tab === "quotes" && (
              <Card>
                <SectionTitle
                  title="Quotes & orders"
                  action={
                    <Link href="/request-quote" className="btn-primary !py-2 text-[12.5px]">
                      New request <Icon name="plus" className="h-3.5 w-3.5" />
                    </Link>
                  }
                />
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[640px] text-left text-sm">
                    <thead>
                      <tr className="border-b border-line text-[11px] font-bold uppercase tracking-wider text-ink-faint">
                        <th className="pb-3 pr-4">Reference</th>
                        <th className="pb-3 pr-4">Item</th>
                        <th className="pb-3 pr-4">Qty</th>
                        <th className="pb-3 pr-4">Amount</th>
                        <th className="pb-3 pr-4">Status</th>
                        <th className="pb-3">Created</th>
                      </tr>
                    </thead>
                    <tbody>
                      {profile.quotes.map((q) => (
                        <tr key={q.id} className="border-b border-line/60 last:border-0">
                          <td className="py-3.5 pr-4 font-bold tabular text-ink">{q.ref}</td>
                          <td className="py-3.5 pr-4 text-ink-soft">{q.item}</td>
                          <td className="py-3.5 pr-4 tabular text-ink-soft">{q.qty}</td>
                          <td className="py-3.5 pr-4 text-ink-soft">{q.amount}</td>
                          <td className="py-3.5 pr-4"><Chip value={q.status} /></td>
                          <td className="py-3.5 text-ink-muted">{q.createdAt.slice(0, 10)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}

            {tab === "support" && (
              <div className="grid gap-5 lg:grid-cols-[1.3fr_1fr]">
                <Card>
                  <SectionTitle title="Support tickets" />
                  <div className="space-y-3">
                    {profile.tickets.map((t) => (
                      <div key={t.id} className="rounded-2xl border border-line p-4">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-sm font-bold text-ink">{t.subject}</p>
                          <div className="flex gap-1.5">
                            <Chip value={t.priority} />
                            <Chip value={t.status} />
                          </div>
                        </div>
                        <p className="mt-1 text-xs text-ink-muted">{t.ref} · updated {t.updatedAt.slice(0, 10)}</p>
                        <div className="mt-3 space-y-2">
                          {t.replies.map((r, i) => (
                            <div key={i} className={`rounded-xl px-3.5 py-2.5 text-[13px] leading-relaxed ${r.from === "support" ? "bg-mist-100 text-ink-soft" : "bg-brand-50 text-ink"}`}>
                              <p className="text-[10px] font-bold uppercase tracking-wider opacity-60">{r.from === "support" ? "RoadLenz support" : "You"} · {r.at.slice(0, 10)}</p>
                              {r.text}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
                <Card className="h-fit">
                  <SectionTitle title="Raise a ticket" />
                  <form onSubmit={createTicket} className="space-y-4">
                    <label className="block">
                      <span className="field-label">Subject</span>
                      <input value={ticketForm.subject} onChange={(e) => setTicketForm((f) => ({ ...f, subject: e.target.value }))} className="field" placeholder="Short summary" required />
                    </label>
                    <label className="block">
                      <span className="field-label">Details</span>
                      <textarea rows={4} value={ticketForm.description} onChange={(e) => setTicketForm((f) => ({ ...f, description: e.target.value }))} className="field resize-y" placeholder="Vehicle, serial, what happened…" required />
                    </label>
                    <button type="submit" disabled={ticketBusy} className="btn-primary w-full justify-center disabled:opacity-60">
                      {ticketBusy ? "Creating…" : "Create ticket"} <Icon name="arrowRight" className="h-4 w-4" />
                    </button>
                    <p className="text-xs leading-relaxed text-ink-faint">
                      24/7 desk. Urgent road-safety issues: call your assigned support number from your contract.
                    </p>
                  </form>
                </Card>
              </div>
            )}

            {tab === "installations" && (
              <div className="grid gap-5 lg:grid-cols-2">
                {profile.installations.map((inst) => (
                  <Card key={inst.id}>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-display text-lg font-bold text-ink">{inst.site}</h3>
                        <p className="mt-0.5 text-xs text-ink-muted">
                          {inst.vehicles} vehicles · started {inst.started} · expected {inst.expected}
                        </p>
                      </div>
                      <Chip value={inst.status} />
                    </div>
                    <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-mist-200">
                      <div className="h-full rounded-full bg-brand-500 transition-all duration-700" style={{ width: `${inst.progress}%` }} />
                    </div>
                    <p className="mt-1.5 text-xs font-bold tabular text-ink">{inst.progress}% complete</p>
                    <ol className="mt-4 space-y-2.5">
                      {inst.steps.map((s, i) => (
                        <li key={i} className="flex items-center gap-3 text-sm">
                          <span
                            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                              s.done ? "bg-emerald-500 text-white" : "border border-line bg-white text-ink-faint"
                            }`}
                          >
                            {s.done ? <Icon name="check" className="h-3.5 w-3.5" /> : i + 1}
                          </span>
                          <span className={s.done ? "text-ink-soft" : "text-ink-faint"}>{s.label}</span>
                        </li>
                      ))}
                    </ol>
                  </Card>
                ))}
              </div>
            )}

            {tab === "documents" && (
              <Card>
                <SectionTitle title="Documents & downloads" />
                <ul className="divide-y divide-line/70">
                  {docs.map((d, i) => (
                    <li key={i} className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0">
                      <div className="flex min-w-0 items-center gap-3.5">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                          <Icon name="doc" className="h-[18px] w-[18px]" />
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-ink">{d.name}</p>
                          <p className="truncate text-xs text-ink-muted">
                            {d.product}{d.serial && d.serial !== "—" ? ` · ${d.serial}` : ""}{d.size ? ` · ${d.size}` : ""}
                          </p>
                        </div>
                      </div>
                      <a href={d.url} className="btn-ghost shrink-0 !px-4 !py-2 text-xs">
                        <Icon name="download" className="h-3.5 w-3.5" /> Download
                      </a>
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {tab === "warranty" && (
              <Card>
                <SectionTitle title="Warranty coverage" />
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[680px] text-left text-sm">
                    <thead>
                      <tr className="border-b border-line text-[11px] font-bold uppercase tracking-wider text-ink-faint">
                        <th className="pb-3 pr-4">Product</th>
                        <th className="pb-3 pr-4">Serial</th>
                        <th className="pb-3 pr-4">Vehicle</th>
                        <th className="pb-3 pr-4">Started</th>
                        <th className="pb-3 pr-4">Expires</th>
                        <th className="pb-3">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {profile.warranties.map((w) => (
                        <tr key={w.id} className="border-b border-line/60 last:border-0">
                          <td className="py-3.5 pr-4 font-bold text-ink">{w.productName}</td>
                          <td className="py-3.5 pr-4 tabular text-ink-soft">{w.serial}</td>
                          <td className="py-3.5 pr-4 text-ink-soft">{w.vehicle}</td>
                          <td className="py-3.5 pr-4 tabular text-ink-muted">{w.started}</td>
                          <td className="py-3.5 pr-4 tabular text-ink-muted">{w.expires}</td>
                          <td className="py-3.5"><Chip value={w.status} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-4 text-xs leading-relaxed text-ink-faint">
                  Standard coverage per the warranty policy. Extended coverage and on-site service plans are available at renewal.
                </p>
              </Card>
            )}

            {tab === "notifications" && (
              <Card>
                <SectionTitle
                  title="Notifications"
                  action={
                    <button onClick={markRead} className="text-xs font-bold text-brand-700 hover:underline">
                      Mark all read
                    </button>
                  }
                />
                <ul className="space-y-2.5">
                  {profile.notifications.map((n) => (
                    <li key={n.id} className={`flex items-start gap-3 rounded-2xl border px-4 py-3.5 ${n.read ? "border-line/70 bg-white" : "border-brand-200 bg-brand-50/50"}`}>
                      <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${n.read ? "bg-ink-faint/50" : "bg-brand-600 pulse-blue"}`} />
                      <p className="text-sm leading-snug text-ink-soft">{n.text}</p>
                      <span className="ml-auto shrink-0 text-[11px] font-semibold text-ink-faint">{n.createdAt.slice(0, 10)}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-ink px-5 py-3 text-sm font-bold text-white shadow-lift"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
