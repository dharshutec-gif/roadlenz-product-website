"use client";

import React, { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Icon } from "../ui";

type ReqKind = "quotes" | "demos" | "messages";

const STATUSES: Record<ReqKind, string[]> = {
  quotes: ["new", "contacted", "quoted", "closed"],
  demos: ["new", "scheduled", "completed"],
  messages: ["new", "replied"],
};

interface Row {
  id: string;
  ref: string;
  name: string;
  company?: string;
  email: string;
  phone: string;
  at: string;
  status: string;
  body: string;
}

export default function RequestsView() {
  const [tab, setTab] = useState<ReqKind>("quotes");
  const [rows, setRows] = useState<Row[]>([]);
  const [counts, setCounts] = useState<Record<ReqKind, number>>({ quotes: 0, demos: 0, messages: 0 });
  const [open, setOpen] = useState<Row | null>(null);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      const res = await Promise.all(
        (["quotes", "demos", "messages"] as ReqKind[]).map((k) =>
          fetch(`/api/c/${k}`, { cache: "no-store" }).then((r) => r.json()),
        ),
      );
      const kinds: ReqKind[] = ["quotes", "demos", "messages"];
      const all: Record<ReqKind, Row[]> = { quotes: [], demos: [], messages: [] };
      res.forEach((body, i) => {
        if (body.error) throw new Error(body.error);
        all[kinds[i]] = (body.items ?? []).map((x: any) => ({
          id: x.id,
          ref: x.ref,
          name: x.name,
          company: x.company,
          email: x.email,
          phone: x.phone,
          at: (x.createdAt ?? "").slice(0, 10),
          status: x.status,
          body: [
            x.fleetSize ? `Fleet: ${x.fleetSize}` : null,
            x.vehicleTypes ? `Vehicles: ${x.vehicleTypes}` : null,
            x.products ? `Products: ${x.products}` : null,
            x.date ? `Preferred date: ${x.date}` : null,
            x.duration ? `Duration: ${x.duration}` : null,
            x.topics ? `Topics: ${x.topics}` : null,
            x.subject ? `Subject: ${x.subject}` : null,
            x.message,
          ]
            .filter(Boolean)
            .join(" · "),
        }));
        all[kinds[i]].sort((a, b) => (a.at < b.at ? 1 : -1));
      });
      setRows(all[tab]);
      setCounts({ quotes: all.quotes.length, demos: all.demos.length, messages: all.messages.length });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    }
  }, [tab]);

  useEffect(() => {
    load();
  }, [load]);

  const setStatus = async (row: Row, status: string) => {
    await fetch(`/api/c/${tab}/${row.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    load();
  };

  const remove = async (row: Row) => {
    await fetch(`/api/c/${tab}/${row.id}`, { method: "DELETE" });
    setOpen(null);
    load();
  };

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center gap-2">
        {(Object.keys(STATUSES) as ReqKind[]).map((k) => (
          <button
            key={k}
            onClick={() => setTab(k)}
            aria-pressed={tab === k}
            className={`rounded-full border px-4 py-2 text-[13px] font-bold capitalize transition ${
              tab === k ? "border-brand-600 bg-brand-600 text-white" : "border-line bg-white text-ink-soft hover:border-brand-300"
            }`}
          >
            {k} <span className={tab === k ? "opacity-70" : "text-ink-faint"}>({counts[k]})</span>
          </button>
        ))}
      </div>

      {error && <p className="mb-4 rounded-2xl bg-accent-soft px-4 py-3 text-sm font-semibold text-accent">{error}</p>}

      <div className="overflow-hidden rounded-3xl border border-line bg-white shadow-card">
        {rows.length === 0 ? (
          <div className="p-12 text-center text-sm font-semibold text-ink-muted">No {tab} yet.</div>
        ) : (
          <ul className="divide-y divide-line/70">
            {rows.map((r) => (
              <li key={r.id}>
                <button onClick={() => setOpen(r)} className="flex w-full items-center gap-4 px-5 py-4 text-left transition hover:bg-mist-50">
                  <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${r.status === "new" ? "bg-brand-600 text-white" : "bg-mist-100 text-brand-600"}`}>
                    <Icon name={tab === "quotes" ? "doc" : tab === "demos" ? "calendar" : "mail"} className="h-[18px] w-[18px]" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-bold text-ink">
                      {r.company ? `${r.company} — ${r.name}` : r.name}
                    </span>
                    <span className="block truncate text-xs text-ink-muted">
                      {r.ref} · {r.email}
                      {r.phone ? ` · ${r.phone}` : ""} · {r.at}
                    </span>
                  </span>
                  <select
                    value={r.status}
                    onChange={(e) => setStatus(r, e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    className="shrink-0 rounded-full border border-line bg-white px-3 py-1.5 text-xs font-bold text-ink-soft focus:border-brand-400 focus:outline-none"
                    aria-label="Status"
                  >
                    {STATUSES[tab].map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <Icon name="chevronRight" className="h-4 w-4 shrink-0 text-ink-faint" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-ink/45 p-4 backdrop-blur-sm"
            onClick={() => setOpen(null)}
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.97, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[10.5px] font-bold uppercase tracking-[0.18em] text-ink-faint">{open.ref}</p>
                  <h3 className="mt-1 font-display text-xl font-extrabold text-ink">{open.company || open.name}</h3>
                  <p className="mt-1 text-sm text-ink-muted">
                    {open.name} · {open.email}
                    {open.phone ? ` · ${open.phone}` : ""}
                  </p>
                </div>
                <button onClick={() => setOpen(null)} className="rounded-full p-2 text-ink hover:bg-mist-100" aria-label="Close">
                  <Icon name="x" className="h-5 w-5" />
                </button>
              </div>
              {open.body && (
                <p className="mt-4 rounded-2xl bg-mist-100 p-4 text-sm leading-relaxed text-ink-soft">{open.body}</p>
              )}
              <div className="mt-5 flex items-center justify-between">
                <select
                  value={open.status}
                  onChange={(e) => setStatus(open, e.target.value)}
                  className="rounded-full border border-line bg-white px-4 py-2 text-sm font-bold text-ink-soft"
                  aria-label="Status"
                >
                  {STATUSES[tab].map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <button
                  onClick={() => remove(open)}
                  className="flex items-center gap-2 rounded-full border border-accent/30 bg-accent-soft px-4 py-2 text-sm font-bold text-accent"
                >
                  <Icon name="trash" className="h-4 w-4" /> Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
