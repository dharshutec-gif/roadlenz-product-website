"use client";

import React, { useEffect, useState } from "react";
import { Icon } from "../ui";

interface Settings {
  name: string;
  legalName: string;
  tagline: string;
  parentCompany: string;
  description: string;
  contact: { phone: string; email: string; address: string; hours: string };
  social: { label: string; href: string }[];
  seo: { title: string; description: string; ogImage: string };
  solutionsHero: { video: string; poster: string };
  footerNote: string;
}

export default function SettingsForm() {
  const [s, setS] = useState<Settings | null>(null);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings", { cache: "no-store" })
      .then((r) => r.json())
      .then((b) => setS(b.settings))
      .catch(() => setError("Failed to load settings"));
  }, []);

  if (!s) {
    return (
      <div className="rounded-3xl border border-line bg-white p-10 text-center text-sm font-semibold text-ink-muted">
        {error || "Loading settings…"}
      </div>
    );
  }

  const set = (path: string, v: string) => {
    setS((prev) => {
      if (!prev) return prev;
      const next: any = { ...prev };
      const parts = path.split(".");
      let cur = next;
      for (let i = 0; i < parts.length - 1; i++) cur = cur[parts[i]];
      cur[parts[parts.length - 1]] = v;
      return next;
    });
    setSaved(false);
  };

  const save = async () => {
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(s),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "Save failed");
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setBusy(false);
    }
  };

  const F = ({ label, path, textarea = false, hint }: { label: string; path: string; textarea?: boolean; hint?: string }) => (
    <label className="block">
      <span className="field-label">{label}</span>
      {textarea ? (
        <textarea rows={3} value={path.split(".").reduce((a: any, k) => a?.[k], s) ?? ""} onChange={(e) => set(path, e.target.value)} className="field resize-y" />
      ) : (
        <input value={path.split(".").reduce((a: any, k) => a?.[k], s) ?? ""} onChange={(e) => set(path, e.target.value)} className="field" />
      )}
      {hint && <p className="mt-1 text-[11px] text-ink-faint">{hint}</p>}
    </label>
  );

  return (
    <div className="space-y-5">
      {error && <p className="rounded-2xl bg-accent-soft px-4 py-3 text-sm font-semibold text-accent">{error}</p>}

      <div className="rounded-3xl border border-line bg-white p-6 shadow-card">
        <h3 className="font-display text-lg font-bold text-ink">Company</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <F label="Brand name" path="name" />
          <F label="Legal name" path="legalName" />
          <F label="Tagline" path="tagline" />
          <F label="Parent company" path="parentCompany" />
          <div className="sm:col-span-2">
            <F label="Description (footer + SEO)" path="description" textarea />
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-line bg-white p-6 shadow-card">
        <h3 className="font-display text-lg font-bold text-ink">Contact details</h3>
        <p className="mt-1 text-xs text-ink-faint">
          Leave fields blank until verified — the site shows “available soon” placeholders instead of inventing details.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <F label="Phone" path="contact.phone" />
          <F label="Email" path="contact.email" />
          <F label="Address" path="contact.address" />
          <F label="Hours" path="contact.hours" />
        </div>
      </div>

      <div className="rounded-3xl border border-line bg-white p-6 shadow-card">
        <h3 className="font-display text-lg font-bold text-ink">SEO</h3>
        <div className="mt-4 space-y-4">
          <F label="Default title" path="seo.title" />
          <F label="Default description" path="seo.description" textarea />
          <F label="OG image URL" path="seo.ogImage" />
        </div>
      </div>

      <div className="rounded-3xl border border-line bg-white p-6 shadow-card">
        <h3 className="font-display text-lg font-bold text-ink">Solutions hero media</h3>
        <p className="mt-1 text-xs text-ink-faint">Upload media first, then enter its public URL here.</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <F label="Hero video URL" path="solutionsHero.video" />
          <F label="Hero poster URL" path="solutionsHero.poster" />
        </div>
      </div>

      <div className="rounded-3xl border border-line bg-white p-6 shadow-card">
        <h3 className="font-display text-lg font-bold text-ink">Footer note</h3>
        <div className="mt-4">
          <F label="Legal / attribution line" path="footerNote" textarea />
        </div>
      </div>

      <div className="flex items-center justify-end gap-3">
        {saved && (
          <span className="flex items-center gap-1.5 text-sm font-bold text-emerald-700">
            <Icon name="checkCircle" className="h-4 w-4" /> Saved
          </span>
        )}
        <button onClick={save} disabled={busy} className="btn-primary disabled:opacity-60">
          {busy ? "Saving…" : "Save settings"} <Icon name="check" className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
