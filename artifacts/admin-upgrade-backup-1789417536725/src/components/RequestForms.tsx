"use client";

import React, { useState } from "react";
import { Icon } from "./ui";

type SubmitState = { status: "idle" | "sending" | "done" | "error"; ref?: string; error?: string };

async function submitRequest(type: "quote" | "demo" | "message", data: Record<string, string>) {
  const res = await fetch("/api/requests", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type, ...data }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.error ?? "Something went wrong.");
  return body as { ref: string };
}

function Field({ label, children, required }: { label: string; children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block">
      <span className="field-label">
        {label} {required ? <span className="text-accent">*</span> : null}
      </span>
      {children}
    </label>
  );
}

function Success({ refId, title }: { refId: string; title: string }) {
  return (
    <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-8 text-center">
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-white">
        <Icon name="check" className="h-6 w-6" />
      </span>
      <h3 className="mt-4 font-display text-xl font-extrabold text-ink">{title}</h3>
      <p className="mt-2 text-sm text-ink-muted">
        Your reference is <span className="font-bold text-ink">{refId}</span>. The RoadLenz team will reach out within one business day.
      </p>
      <p className="mt-4 text-xs text-ink-faint">Keep the reference for any follow-up with support.</p>
    </div>
  );
}

export function QuoteForm() {
  const [state, setState] = useState<SubmitState>({ status: "idle" });
  const [form, setForm] = useState({
    name: "", company: "", email: "", phone: "", fleetSize: "", vehicleTypes: "", products: "", message: "",
  });
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState({ status: "sending" });
    try {
      const { ref } = await submitRequest("quote", form);
      setState({ status: "done", ref });
    } catch (err) {
      setState({ status: "error", error: err instanceof Error ? err.message : "Error" });
    }
  };

  if (state.status === "done") return <Success refId={state.ref!} title="Quote request received" />;

  return (
    <form onSubmit={onSubmit} className="grid gap-4 rounded-3xl border border-line bg-white p-6 shadow-card sm:grid-cols-2">
      <Field label="Full name" required><input required value={form.name} onChange={set("name")} className="field" placeholder="Your name" /></Field>
      <Field label="Company" required><input required value={form.company} onChange={set("company")} className="field" placeholder="Company name" /></Field>
      <Field label="Work email" required><input required type="email" value={form.email} onChange={set("email")} className="field" placeholder="you@company.in" /></Field>
      <Field label="Phone" required><input required value={form.phone} onChange={set("phone")} className="field" placeholder="+91 …" /></Field>
      <Field label="Fleet size">
        <select value={form.fleetSize} onChange={set("fleetSize")} className="field">
          <option value="">Select…</option>
          <option>1–10 vehicles</option>
          <option>11–50 vehicles</option>
          <option>51–200 vehicles</option>
          <option>201–1,000 vehicles</option>
          <option>1,000+ vehicles</option>
        </select>
      </Field>
      <Field label="Vehicle types">
        <input value={form.vehicleTypes} onChange={set("vehicleTypes")} className="field" placeholder="Trucks, buses, two-wheelers…" />
      </Field>
      <div className="sm:col-span-2">
        <Field label="Products of interest">
          <input value={form.products} onChange={set("products")} className="field" placeholder="AI cameras, MDVR, fuel monitoring…" />
        </Field>
      </div>
      <div className="sm:col-span-2">
        <Field label="Tell us about your operation">
          <textarea value={form.message} onChange={set("message")} rows={4} className="field resize-y" placeholder="Routes, current setup, goals…" />
        </Field>
      </div>
      {state.status === "error" && (
        <p className="rounded-xl bg-accent-soft px-4 py-3 text-sm font-semibold text-accent sm:col-span-2">{state.error}</p>
      )}
      <div className="sm:col-span-2">
        <button type="submit" disabled={state.status === "sending"} className="btn-primary w-full disabled:opacity-60">
          {state.status === "sending" ? "Sending…" : "Request Quote"} <Icon name="arrowRight" className="h-4 w-4" />
        </button>
        <p className="mt-3 text-center text-xs text-ink-faint">
          Indicative pricing is shared in the first response. No spam — ever.
        </p>
      </div>
    </form>
  );
}

export function DemoForm() {
  const [state, setState] = useState<SubmitState>({ status: "idle" });
  const [form, setForm] = useState({
    name: "", company: "", email: "", phone: "", date: "", duration: "30 minutes", topics: "", message: "",
  });
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState({ status: "sending" });
    try {
      const { ref } = await submitRequest("demo", form);
      setState({ status: "done", ref });
    } catch (err) {
      setState({ status: "error", error: err instanceof Error ? err.message : "Error" });
    }
  };

  if (state.status === "done") return <Success refId={state.ref!} title="Demo request received" />;

  const minDate = new Date(Date.now() + 86400000).toISOString().slice(0, 10);

  return (
    <form onSubmit={onSubmit} className="grid gap-4 rounded-3xl border border-line bg-white p-6 shadow-card sm:grid-cols-2">
      <Field label="Full name" required><input required value={form.name} onChange={set("name")} className="field" placeholder="Your name" /></Field>
      <Field label="Company" required><input required value={form.company} onChange={set("company")} className="field" placeholder="Company name" /></Field>
      <Field label="Work email" required><input required type="email" value={form.email} onChange={set("email")} className="field" placeholder="you@company.in" /></Field>
      <Field label="Phone" required><input required value={form.phone} onChange={set("phone")} className="field" placeholder="+91 …" /></Field>
      <Field label="Preferred date">
        <input type="date" min={minDate} value={form.date} onChange={set("date")} className="field" />
      </Field>
      <Field label="Duration">
        <select value={form.duration} onChange={set("duration")} className="field">
          <option>30 minutes</option>
          <option>45 minutes</option>
          <option>60 minutes</option>
        </select>
      </Field>
      <div className="sm:col-span-2">
        <Field label="What should we cover?">
          <input value={form.topics} onChange={set("topics")} className="field" placeholder="Live tracking, video, fuel, driver scores…" />
        </Field>
      </div>
      <div className="sm:col-span-2">
        <Field label="Anything specific?">
          <textarea value={form.message} onChange={set("message")} rows={3} className="field resize-y" placeholder="Fleet size, current pain points…" />
        </Field>
      </div>
      {state.status === "error" && (
        <p className="rounded-xl bg-accent-soft px-4 py-3 text-sm font-semibold text-accent sm:col-span-2">{state.error}</p>
      )}
      <div className="sm:col-span-2">
        <button type="submit" disabled={state.status === "sending"} className="btn-primary w-full disabled:opacity-60">
          {state.status === "sending" ? "Sending…" : "Book My Demo"} <Icon name="calendar" className="h-4 w-4" />
        </button>
        <p className="mt-3 text-center text-xs text-ink-faint">
          Live platform walkthrough with a RoadLenz engineer — over video call or in person.
        </p>
      </div>
    </form>
  );
}

export function ContactForm() {
  const [state, setState] = useState<SubmitState>({ status: "idle" });
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState({ status: "sending" });
    try {
      const { ref } = await submitRequest("message", form);
      setState({ status: "done", ref });
    } catch (err) {
      setState({ status: "error", error: err instanceof Error ? err.message : "Error" });
    }
  };

  if (state.status === "done") return <Success refId={state.ref!} title="Message received" />;

  return (
    <form onSubmit={onSubmit} className="grid gap-4 rounded-3xl border border-line bg-white p-6 shadow-card sm:grid-cols-2">
      <Field label="Full name" required><input required value={form.name} onChange={set("name")} className="field" placeholder="Your name" /></Field>
      <Field label="Email" required><input required type="email" value={form.email} onChange={set("email")} className="field" placeholder="you@company.in" /></Field>
      <Field label="Phone"><input value={form.phone} onChange={set("phone")} className="field" placeholder="+91 …" /></Field>
      <Field label="Subject" required><input required value={form.subject} onChange={set("subject")} className="field" placeholder="How can we help?" /></Field>
      <div className="sm:col-span-2">
        <Field label="Message" required>
          <textarea required value={form.message} onChange={set("message")} rows={5} className="field resize-y" placeholder="Tell us what's on your mind…" />
        </Field>
      </div>
      {state.status === "error" && (
        <p className="rounded-xl bg-accent-soft px-4 py-3 text-sm font-semibold text-accent sm:col-span-2">{state.error}</p>
      )}
      <div className="sm:col-span-2">
        <button type="submit" disabled={state.status === "sending"} className="btn-primary w-full disabled:opacity-60">
          {state.status === "sending" ? "Sending…" : "Send Message"} <Icon name="arrowRight" className="h-4 w-4" />
        </button>
      </div>
    </form>
  );
}
