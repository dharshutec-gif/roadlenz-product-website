"use client";
import Link from "next/link";

import React, { createContext, useContext, useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Icon } from "../ui";
import type { LogisticsContent, TaxiContent } from "@/lib/types";

const LOGISTICS_COPY_FIELDS: [keyof LogisticsContent, string][] = [
  ["challengeEyebrow", "Challenge eyebrow"], ["challengeTitle", "Challenge heading"], ["challengeSummary", "Challenge summary"],
  ["journeyEyebrow", "Freight room eyebrow"], ["journeyTitle", "Freight room heading"], ["journeySummary", "Freight room summary"],
  ["stageHeading", "Stage list heading"], ["technologyEyebrow", "Technology eyebrow"],
  ["setupEyebrow", "Setup eyebrow"], ["setupTitle", "Setup heading"], ["setupReasonsTitle", "Recommendation heading"],
  ["outcomeEyebrow", "Outcomes eyebrow"], ["faqTitle", "FAQ heading"], ["demoLabel", "Illustrative journey label"],
  ["mediaFallback", "Unavailable product image text"], ["emptyProductsLabel", "Empty setup text"],
  ["pauseLabel", "Pause label"], ["resumeLabel", "Resume label"], ["productActionLabel", "Product link label"], ["enquiryLabel", "Enquiry button label"],
];

const TAXI_COPY_FIELDS: [keyof TaxiContent, string][] = [
  ["heroEyebrow", "Hero eyebrow"], ["enquiryLabel", "Enquiry button label"],
  ["challengeTitle", "Challenge heading"], ["challengeSummary", "Challenge summary"],
  ["journeyTitle", "Journey heading"], ["journeySummary", "Journey summary"],
  ["setupTitle", "Setup heading"], ["setupSummary", "Setup summary"],
  ["setupReasonsTitle", "Setup reasons heading"], ["faqTitle", "FAQ heading"],
  ["demoLabel", "Illustrative demo label"], ["mediaFallback", "Unavailable device media text"],
  ["pauseLabel", "Pause journey label"], ["resumeLabel", "Resume journey label"],
  ["productActionLabel", "Product action label"],
];

type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "select"
  | "categorySelect"
  | "productSelect"
  | "bool"
  | "image"
  | "imageList"
  | "mediaRef"
  | "kvList"
  | "strList"
  | "docList"
  | "docRef"
  | "linkList"
  | "resultList"
  | "journeyList"
  | "capabilityList"
  | "recommendedProductList"
  | "benefitList"
  | "statPair";

interface Field {
  key: string;
  label: string;
  type: FieldType;
  options?: string[];
  hint?: string;
}

const ICON_OPTIONS = [
  "compass", "fleet", "headset", "map", "chip", "wrench", "shield", "brain", "video", "pin",
  "driver", "fuel", "route", "leaf", "bus", "truck", "car", "box", "users", "sparkle",
  "gauge", "alert", "calendar", "bell", "doc", "download", "globe", "building", "layers",
  "sliders", "flask", "plug", "refresh", "zap", "eye", "link", "camera", "gps",
];

const ResourceUploadContext = createContext(false);
const RES_TYPES = ["guide", "insight", "video", "webinar", "download", "checklist", "documentation", "case-study", "faq", "warranty"];
const LOC_TYPES = ["headquarters", "production", "regional", "office"];

const SCHEMAS: Record<string, Field[]> = {
aboutSections: [{"key":"slug","label":"Section (keep the existing key)","type":"text"},{"key":"eyebrow","label":"Eyebrow","type":"text"},{"key":"title","label":"Title","type":"text"},{"key":"description","label":"Description","type":"textarea"},{"key":"note","label":"Closing note","type":"textarea"},{"key":"image","label":"Image","type":"image"},{"key":"ctaLabel","label":"Button label","type":"text"},{"key":"ctaHref","label":"Button destination","type":"text"},{"key":"order","label":"Display order","type":"number"}],
aboutSlides: [{"key":"title","label":"Title","type":"text"},{"key":"alt","label":"Accessible media description","type":"text"},{"key":"media","label":"Image or video","type":"mediaRef"},{"key":"order","label":"Display order","type":"number"}],
aboutMilestones: [{"key":"year","label":"Year","type":"text"},{"key":"title","label":"Title","type":"text"},{"key":"description","label":"Description","type":"textarea"},{"key":"image","label":"Image","type":"image"},{"key":"order","label":"Display order","type":"number"}],
aboutOffices: [{"key":"title","label":"Title","type":"text"},{"key":"officeType","label":"Office type","type":"text"},{"key":"city","label":"City","type":"text"},{"key":"region","label":"Region","type":"text"},{"key":"country","label":"Country","type":"text"},{"key":"address","label":"Address","type":"strList"},{"key":"phone","label":"Phone","type":"text"},{"key":"email","label":"Email","type":"text"},{"key":"headquarters","label":"Headquarters","type":"bool"},{"key":"mapsUrl","label":"Google Maps URL","type":"text"},{"key":"image","label":"Image","type":"image"},{"key":"lat","label":"Latitude","type":"number"},{"key":"lng","label":"Longitude","type":"number"},{"key":"order","label":"Display order","type":"number"}],
aboutSupport: [{"key":"title","label":"Title","type":"text"},{"key":"description","label":"Description","type":"textarea"},{"key":"phone","label":"Phone","type":"text"},{"key":"email","label":"Email","type":"text"},{"key":"image","label":"Image","type":"image"},{"key":"order","label":"Display order","type":"number"}],
aboutLeaders: [{"key":"name","label":"Name","type":"text"},{"key":"role","label":"Role","type":"text"},{"key":"quote","label":"Quote","type":"textarea"},{"key":"image","label":"Image","type":"image"},{"key":"order","label":"Display order","type":"number"}],
  heroSlides: [
    { key: "title", label: "Heading", type: "text" },
    { key: "subtitle", label: "Description", type: "textarea" },
    { key: "primaryCta", label: "Primary button", type: "text" },
    { key: "primaryHref", label: "Primary link", type: "text" },
    { key: "secondaryCta", label: "Secondary button", type: "text" },
    { key: "secondaryHref", label: "Secondary link (use #film for the video section)", type: "text" },
    { key: "media", label: "Media (image or video)", type: "mediaRef" },
    { key: "overlay", label: "Overlay darkness (0–1)", type: "number", hint: "0.4–0.6 recommended" },
    { key: "duration", label: "Slide duration (seconds)", type: "number" },
  ],
  stats: [
    { key: "label", label: "Label", type: "text" },
    { key: "value", label: "Display value", type: "text", hint: "e.g. 2,000+ or 24/7" },
    { key: "counter", label: "Counter target (0 = static)", type: "number" },
    { key: "suffix", label: "Suffix", type: "text" },
    { key: "icon", label: "Icon", type: "select", options: ICON_OPTIONS },
  ],
  products: [
    { key: "name", label: "Name", type: "text" },
    { key: "slug", label: "Slug", type: "text", hint: "URL path, for example ai-dashcam" },
    { key: "category", label: "Category", type: "categorySelect" },
    { key: "tagline", label: "Short tagline", type: "text" },
    { key: "description", label: "Full description (blank line = new paragraph)", type: "textarea" },
    { key: "price", label: "Price", type: "text", hint: "e.g. ₹14,900 / vehicle or On request" },
    { key: "priceNote", label: "GST / price note", type: "text" },
    { key: "order", label: "Display order", type: "number" },
    { key: "image", label: "Primary product image", type: "image" },
    { key: "gallery", label: "Gallery images", type: "imageList" },
    { key: "video", label: "Optional product video / poster", type: "mediaRef" },
    { key: "badges", label: "Specification badges", type: "kvList" },
    { key: "features", label: "Features (one per line)", type: "strList" },
    { key: "specs", label: "Technical specifications", type: "kvList" },
    { key: "compatibility", label: "Compatibility notes (one per line)", type: "strList" },
    { key: "inBox", label: "In the box (one per line)", type: "strList" },
    { key: "documents", label: "Documents", type: "docList" },
    { key: "installationGuide", label: "Installation guide", type: "docRef" },
    { key: "warranty", label: "Warranty details", type: "docRef" },
    { key: "relatedProductSlugs", label: "Related products", type: "productSelect" },
    { key: "featured", label: "Featured", type: "bool" },
  ],
  productCategories: [
    { key: "name", label: "Category name", type: "text" },
    { key: "slug", label: "Slug", type: "text" },
    { key: "description", label: "Description", type: "textarea" },
  ],
  solutions: [
    { key: "name", label: "Solution name", type: "text" },
    { key: "slug", label: "Slug", type: "text" },
    { key: "industry", label: "Industry / category", type: "text" },
    { key: "heroTitle", label: "Hero title", type: "text" },
    { key: "heroSummary", label: "Hero summary", type: "textarea" },
    { key: "heroMedia", label: "Hero image / video", type: "mediaRef" },
    { key: "heroCtaLabel", label: "Hero button label", type: "text" },
    { key: "heroCtaHref", label: "Hero button link", type: "text", hint: "Use an existing route or an in-page anchor." },
    { key: "trustLine", label: "Optional trust / support line", type: "text" },
    { key: "mapMedia", label: "Map background image / video", type: "mediaRef" },
    { key: "vehicleImage", label: "Vehicle image (for selection stage)", type: "image" },
    { key: "abstractPreviewImage", label: "Abstract preview image (for selected preview)", type: "image" },
    { key: "relatedProductSlugs", label: "Related products", type: "productSelect" },
    { key: "keyOutcomes", label: "Key outcomes (one per line)", type: "strList" },
    { key: "painPoints", label: "Operational pain points", type: "benefitList", hint: "Use a short challenge title and a clear explanation." },
    { key: "faqs", label: "Frequently asked questions", type: "kvList", hint: "Question in the left field; answer in the right field." },
    { key: "productCallouts", label: "Product callouts (product slug / position|label)", type: "kvList", hint: "Example value: top-left|AI Dashcam" },
    { key: "platformOutcomes", label: "Platform-flow outcomes (one per line)", type: "strList" },
    { key: "bestFor", label: "Best-for labels (one per line)", type: "strList" },
    { key: "journeyStages", label: "Real-world journey stages", type: "journeyList", hint: "Stages appear in this order. Lower-page videos never autoplay." },
    { key: "capabilityTitle", label: "Capabilities section title", type: "text" },
    { key: "capabilities", label: "Capabilities", type: "capabilityList" },
    { key: "technologyTitle", label: "Technology section title", type: "text" },
    { key: "technologyDescription", label: "Technology section description", type: "textarea" },
    { key: "blueprintMedia", label: "Vehicle blueprint / cutaway", type: "mediaRef" },
    { key: "deviceConsoleMedia", label: "Device console supporting visual", type: "mediaRef" },
    { key: "recommendedProducts", label: "Recommended product setup", type: "recommendedProductList", hint: "Associate existing published products and explain why each is recommended." },
    { key: "benefits", label: "Benefits / outcomes", type: "benefitList" },
    { key: "outcomeTitle", label: "Outcome section title", type: "text" },
    { key: "outcomeSummary", label: "Outcome section summary", type: "textarea" },
    { key: "outcomeMedia", label: "Outcome visual", type: "mediaRef" },
    { key: "ctaTitle", label: "CTA title", type: "text" },
    { key: "ctaSummary", label: "CTA description", type: "textarea" },
    { key: "ctaMedia", label: "CTA background image / video", type: "mediaRef" },
    { key: "ctaPrimaryLabel", label: "Primary CTA label", type: "text" },
    { key: "ctaPrimaryHref", label: "Primary CTA link", type: "text" },
    { key: "ctaSecondaryLabel", label: "Secondary CTA label", type: "text" },
    { key: "ctaSecondaryHref", label: "Secondary CTA link", type: "text" },
    { key: "sequenceNumber", label: "Sequence number", type: "number" },
    { key: "featured", label: "Featured (default selected)", type: "bool" },
    { key: "order", label: "Display order", type: "number" },
  ],
  industries: [
    { key: "slug", label: "Slug", type: "text" },
    { key: "name", label: "Name", type: "text" },
    { key: "shortName", label: "Short name", type: "text" },
    { key: "tagline", label: "Tagline", type: "text" },
    { key: "summary", label: "Summary (blank line = new paragraph)", type: "textarea" },
    { key: "vehicleImage", label: "Vehicle render", type: "image" },
    { key: "image", label: "Detail image", type: "image" },
    { key: "challenges", label: "Challenges (one per line)", type: "strList" },
    { key: "outcomes", label: "Outcomes (one per line)", type: "strList" },
    { key: "capabilities", label: "Capabilities (one per line)", type: "strList" },
    { key: "relatedProductSlugs", label: "Related product slugs (one per line)", type: "strList" },
    { key: "stat", label: "Stat", type: "statPair" },
  ],
  caseStudies: [
    { key: "client", label: "Client name (until approved use a placeholder)", type: "text" },
    { key: "title", label: "Title", type: "text" },
    { key: "location", label: "Location", type: "text" },
    { key: "image", label: "Image", type: "image" },
    { key: "challenge", label: "Challenge", type: "textarea" },
    { key: "solution", label: "RoadLenz solution", type: "textarea" },
    { key: "technology", label: "Deployed technology (one per line)", type: "strList" },
    { key: "results", label: "Verified results", type: "resultList" },
    { key: "approved", label: "Customer approved publication", type: "bool" },
  ],
  customerLogos: [
    { key: "name", label: "Customer name (internal)", type: "text" },
    { key: "image", label: "Logo image (PNG preferred)", type: "image" },
    { key: "approved", label: "Client authorised public use", type: "bool" },
  ],
  resources: [
    { key: "type", label: "Type", type: "select", options: RES_TYPES },
    { key: "title", label: "Title", type: "text" },
    { key: "description", label: "Description", type: "textarea" },
    { key: "image", label: "Thumbnail", type: "image" },
    { key: "media", label: "Video (optional)", type: "mediaRef" },
    { key: "file", label: "Download file (optional)", type: "docRef" },
    { key: "slug", label: "URL slug (optional; use lowercase letters, digits and hyphens)", type: "text" },
    { key: "category", label: "Category", type: "categorySelect" },
    { key: "featured", label: "Featured resource", type: "bool" },
    { key: "approved", label: "Case study cleared for publication", type: "bool" },
    { key: "duration", label: "Duration (optional)", type: "text" },
    { key: "pageCount", label: "Page count (optional)", type: "number" },
    { key: "body", label: "Article content (paragraphs)", type: "textarea" },
    { key: "answer", label: "FAQ answer", type: "textarea" },
    { key: "relatedLinks", label: "Related product, solution or technology links", type: "linkList" },
    { key: "meta", label: "Meta line", type: "text", hint: "e.g. Video · 2 min" },
  ],
  locations: [
    { key: "name", label: "Name", type: "text" },
    { key: "city", label: "City", type: "text" },
    { key: "region", label: "State / Region", type: "text" },
    { key: "country", label: "Country", type: "text" },
    { key: "type", label: "Type", type: "select", options: LOC_TYPES },
    { key: "international", label: "International", type: "bool" },
    { key: "lat", label: "Latitude", type: "number" },
    { key: "lng", label: "Longitude", type: "number" },
    { key: "address", label: "Address (leave blank until verified)", type: "text" },
    { key: "phone", label: "Phone (leave blank until verified)", type: "text" },
    { key: "email", label: "Email (leave blank until verified)", type: "text" },
    { key: "timings", label: "Office timings (leave blank until verified)", type: "text" },
    { key: "mapsLink", label: "Google Maps link", type: "text" },
    { key: "image", label: "Image", type: "image" },
    { key: "verified", label: "Details verified", type: "bool" },
  ],
  whyPoints: [
    { key: "title", label: "Title", type: "text" },
    { key: "text", label: "Text", type: "textarea" },
    { key: "icon", label: "Icon", type: "select", options: ICON_OPTIONS },
  ],
  ecosystemNodes: [
    { key: "label", label: "Label", type: "text" },
    { key: "text", label: "Description", type: "textarea" },
    { key: "icon", label: "Icon", type: "select", options: ICON_OPTIONS },
  ],
  engineeringItems: [
    { key: "title", label: "Title", type: "text" },
    { key: "text", label: "One-liner", type: "text" },
    { key: "image", label: "Image", type: "image" },
    { key: "icon", label: "Icon", type: "select", options: ICON_OPTIONS },
  ],
  solutionFinder: [
    { key: "option", label: "Option label", type: "text" },
    { key: "icon", label: "Icon", type: "select", options: ICON_OPTIONS },
    { key: "headline", label: "Result headline", type: "text" },
    { key: "body", label: "Result body", type: "textarea" },
    { key: "recommendation", label: "Recommendation line", type: "text" },
    { key: "links", label: "Links", type: "linkList" },
  ],
};

const TITLES: Record<string, (i: any) => string> = {
  aboutMilestones: (i) => `${i.year}${i.title ? ` — ${i.title}` : ""}`,
  aboutLeaders: (i) => i.name || i.role,
  heroSlides: (i) => i.title,
  stats: (i) => `${i.value} — ${i.label}`,
  products: (i) => i.name,
  productCategories: (i) => i.name,
  solutions: (i) => i.name,
  industries: (i) => i.name,
  caseStudies: (i) => i.title,
  customerLogos: (i) => i.name || "Untitled logo",
  resources: (i) => i.title,
  locations: (i) => i.name,
  whyPoints: (i) => i.title,
  ecosystemNodes: (i) => i.label,
  engineeringItems: (i) => i.title,
  solutionFinder: (i) => i.option,
};

const SUBTITLES: Record<string, (i: any) => string> = {
  heroSlides: (i) => i.subtitle,
  stats: (i) => i.label,
  products: (i) => i.category,
  productCategories: (i) => i.description,
  solutions: (i) => i.industry,
  industries: (i) => i.tagline,
  caseStudies: (i) => i.client,
  customerLogos: () => "Customer logo",
  resources: (i) => i.type,
  locations: (i) => `${i.city}, ${i.country}`,
  whyPoints: (i) => i.text,
  ecosystemNodes: (i) => i.text,
  engineeringItems: (i) => i.text,
  solutionFinder: (i) => i.headline,
};

const PREVIEW: Record<string, (i: any) => string> = {
aboutSections: () => "/about",
aboutSlides: () => "/about",
aboutMilestones: () => "/about",
aboutOffices: () => "/about",
aboutSupport: () => "/about",
aboutLeaders: () => "/about",
  products: (i) => `/products/${i.slug}`,
  solutions: (i) => `/solutions/${i.slug}`,
  industries: (i) => `/industries/${i.slug}`,
};

/* ---------- value transforms (array fields <-> form state) ---------- */

function toForm(entity: string, item: Record<string, any>) {
  const f: Record<string, any> = { ...item };
  if (entity === "resources" && Array.isArray(f.file)) f.file = f.file[0];
  if ((entity === "products" || entity === "industries") && Array.isArray(f.description)) f.description = f.description.join("\n\n");
  if (entity === "industries" && Array.isArray(f.summary)) f.summary = f.summary.join("\n\n");
  return f;
}

function fromForm(entity: string, f: Record<string, any>) {
  const out: Record<string, any> = { ...f };
  if (entity === "solutions" && ["taxi", "logistics", "agriculture", "employee-transport", "public-transport"].includes(out.slug)) {
    for (const key of ["journeyStages", "capabilities", "recommendedProducts", "painPoints", "benefits"]) {
      if (Array.isArray(out[key])) out[key] = out[key].map((row: Record<string, unknown>, index: number) => ({ ...row, order: index + 1 }));
    }
  }
  if (entity === "products" && typeof out.description === "string")
    out.description = out.description.split(/\n{2,}/).map((s) => s.trim()).filter(Boolean);
  if (entity === "industries") {
    if (typeof out.summary === "string") out.summary = out.summary.split(/\n{2,}/).map((s) => s.trim()).filter(Boolean);
    for (const k of ["challenges", "outcomes", "capabilities", "relatedProductSlugs"]) {
      if (typeof out[k] === "string") out[k] = out[k].split("\n").map((s) => s.trim()).filter(Boolean);
    }
  }
  if (entity === "caseStudies" && Array.isArray(out.technology)) out.technology = out.technology.filter(Boolean);
  return out;
}

/* ---------- upload button ---------- */

function UploadButton({ value, onDone, accept = "image/*,video/mp4,video/webm,application/pdf" }: {
  value?: string;
  onDone: (url: string) => void;
  accept?: string;
}) {
  const resourceUpload = useContext(ResourceUploadContext);
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setErr("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch(resourceUpload ? "/api/resources/upload" : "/api/upload", { method: "POST", body: fd });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "Upload failed");
      onDone(body.url);
    } catch (e2) {
      setErr(e2 instanceof Error ? e2.message : "Upload failed");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div>
      <div className="flex items-center gap-3">
        <button type="button" onClick={() => inputRef.current?.click()} disabled={busy} className="btn-ghost !py-2 text-xs disabled:opacity-60">
          <Icon name="upload" className="h-3.5 w-3.5" />
          {busy ? "Uploading…" : value ? "Replace file" : "Upload file"}
        </button>
        {value ? <span className="max-w-[220px] truncate text-xs font-semibold text-ink-muted">{value}</span> : null}
      </div>
      {err && <p className="mt-1.5 text-xs font-semibold text-accent">{err}</p>}
      <input ref={inputRef} type="file" accept={resourceUpload && accept === "application/pdf" ? ".pdf,.xlsx" : accept} className="hidden" onChange={onFile} />
    </div>
  );
}

/* ---------- complex field editors ---------- */

function KvListEditor({ value, onChange }: { value?: { label: string; value: string }[]; onChange: (v: { label: string; value: string }[]) => void }) {
  const rows = value ?? [];
  const set = (i: number, key: "label" | "value", v: string) => {
    const next = rows.map((r, n) => (n === i ? { ...r, [key]: v } : r));
    onChange(next);
  };
  return (
    <div className="space-y-2">
      {rows.map((r, i) => (
        <div key={i} className="flex items-center gap-2">
          <input value={r.label} onChange={(e) => set(i, "label", e.target.value)} placeholder="Label" className="field !py-2 text-xs" />
          <input value={r.value} onChange={(e) => set(i, "value", e.target.value)} placeholder="Value" className="field !py-2 text-xs" />
          <button type="button" onClick={() => onChange(rows.filter((_, n) => n !== i))} className="rounded-full p-2 text-ink-faint hover:bg-accent-soft hover:text-accent" aria-label="Remove row">
            <Icon name="x" className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
      <button type="button" onClick={() => onChange([...rows, { label: "", value: "" }])} className="text-xs font-bold text-brand-700 hover:underline">
        + Add row
      </button>
    </div>
  );
}

function StrListEditor({ value, onChange }: { value?: string[]; onChange: (v: string[]) => void }) {
  const [text, setText] = useState((value ?? []).join("\n"));
  useEffect(() => setText((value ?? []).join("\n")), [value]);
  return (
    <textarea
      rows={4}
      value={text}
      onChange={(e) => {
        setText(e.target.value);
        onChange(e.target.value.split("\n").map((s) => s.trim()).filter(Boolean));
      }}
      className="field resize-y font-mono text-xs"
      placeholder={"line one\nline two"}
    />
  );
}

function DocListEditor({ value, onChange }: { value?: { name: string; url: string; size?: string }[]; onChange: (v: { name: string; url: string; size?: string }[]) => void }) {
  const rows = value ?? [];
  const set = (i: number, key: string, v: string) => onChange(rows.map((r, n) => (n === i ? { ...r, [key]: v } : r)));
  return (
    <div className="space-y-3">
      {rows.map((r, i) => (
        <div key={i} className="rounded-2xl border border-line p-3">
          <div className="flex items-center gap-2">
            <input value={r.name} onChange={(e) => set(i, "name", e.target.value)} placeholder="Document name" className="field !py-2 text-xs" />
            <button type="button" onClick={() => onChange(rows.filter((_, n) => n !== i))} className="rounded-full p-2 text-ink-faint hover:bg-accent-soft hover:text-accent" aria-label="Remove document">
              <Icon name="x" className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <input value={r.url} onChange={(e) => set(i, "url", e.target.value)} placeholder="/media/documents/file.pdf" className="field !py-2 font-mono text-xs" />
          </div>
          <div className="mt-2">
            <UploadButton accept="application/pdf" onDone={(url) => set(i, "url", url)} value={r.url} />
          </div>
        </div>
      ))}
      <button type="button" onClick={() => onChange([...rows, { name: "", url: "" }])} className="text-xs font-bold text-brand-700 hover:underline">
        + Add document
      </button>
    </div>
  );
}

function ImageListEditor({ value, onChange }: { value?: string[]; onChange: (v: string[]) => void }) {
  const images = value ?? [];
  return <div className="space-y-3">{images.map((url, index) => <div key={`${url}-${index}`} className="flex items-center gap-3 rounded-xl border border-line p-2"><img src={url} alt="" className="h-16 w-20 rounded-lg bg-mist-50 object-contain p-1" /><span className="min-w-0 flex-1 truncate text-xs text-ink-muted">{url}</span><button type="button" onClick={() => onChange(images.filter((_, itemIndex) => itemIndex !== index))} className="rounded-full p-2 text-ink-faint hover:bg-accent-soft hover:text-accent" aria-label="Remove gallery image"><Icon name="x" className="h-4 w-4" /></button></div>)}<UploadButton accept="image/*" onDone={(url) => onChange([...images, url])} /></div>;
}

function DocRefEditor({ value, onChange }: { value?: { name: string; url: string; size?: string }; onChange: (v: { name: string; url: string; size?: string } | undefined) => void }) {
  const doc = value ?? { name: "", url: "", size: "" };
  return <div className="space-y-2 rounded-2xl border border-line p-3"><input value={doc.name} onChange={(event) => onChange({ ...doc, name: event.target.value })} placeholder="Document name or warranty summary" className="field !py-2 text-xs" /><input value={doc.url} onChange={(event) => onChange({ ...doc, url: event.target.value })} placeholder="Optional document URL" className="field !py-2 font-mono text-xs" /><div className="flex items-center justify-between gap-2"><UploadButton accept="application/pdf" value={doc.url} onDone={(url) => onChange({ ...doc, url })} />{value && <button type="button" onClick={() => onChange(undefined)} className="text-xs font-bold text-accent">Clear</button>}</div></div>;
}

function LinkListEditor({ value, onChange }: { value?: { label: string; href: string }[]; onChange: (v: { label: string; href: string }[]) => void }) {
  const rows = value ?? [];
  const set = (i: number, key: string, v: string) => onChange(rows.map((r, n) => (n === i ? { ...r, [key]: v } : r)));
  return (
    <div className="space-y-2">
      {rows.map((r, i) => (
        <div key={i} className="flex items-center gap-2">
          <input value={r.label} onChange={(e) => set(i, "label", e.target.value)} placeholder="Label" className="field !py-2 text-xs" />
          <input value={r.href} onChange={(e) => set(i, "href", e.target.value)} placeholder="/href" className="field !py-2 text-xs" />
          <button type="button" onClick={() => onChange(rows.filter((_, n) => n !== i))} className="rounded-full p-2 text-ink-faint hover:bg-accent-soft hover:text-accent" aria-label="Remove link">
            <Icon name="x" className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
      <button type="button" onClick={() => onChange([...rows, { label: "", href: "" }])} className="text-xs font-bold text-brand-700 hover:underline">
        + Add link
      </button>
    </div>
  );
}

function ResultListEditor({ value, onChange }: { value?: { metric: string; note: string }[]; onChange: (v: { metric: string; note: string }[]) => void }) {
  const rows = value ?? [];
  const set = (i: number, key: string, v: string) => onChange(rows.map((r, n) => (n === i ? { ...r, [key]: v } : r)));
  return (
    <div className="space-y-2">
      {rows.map((r, i) => (
        <div key={i} className="flex items-center gap-2">
          <input value={r.metric} onChange={(e) => set(i, "metric", e.target.value)} placeholder="Metric (e.g. 23% fewer incidents)" className="field !py-2 text-xs" />
          <input value={r.note} onChange={(e) => set(i, "note", e.target.value)} placeholder="Note" className="field !py-2 text-xs" />
          <button type="button" onClick={() => onChange(rows.filter((_, n) => n !== i))} className="rounded-full p-2 text-ink-faint hover:bg-accent-soft hover:text-accent" aria-label="Remove result">
            <Icon name="x" className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
      <button type="button" onClick={() => onChange([...rows, { metric: "", note: "" }])} className="text-xs font-bold text-brand-700 hover:underline">
        + Add result
      </button>
    </div>
  );
}

function MediaRefEditor({ value, onChange }: { value?: { type: "image" | "video"; src: string; poster?: string }; onChange: (v: any) => void }) {
  const v = value ?? { type: "image" as const, src: "", poster: "" };
  return (
    <div className="space-y-3 rounded-2xl border border-line p-3">
      <div className="flex items-center gap-3">
        <label className="flex items-center gap-2 text-xs font-semibold text-ink-soft">
          <input
            type="radio"
            checked={v.type === "image"}
            onChange={() => onChange({ ...v, type: "image" })}
            className="accent-brand-600"
          />
          Image
        </label>
        <label className="flex items-center gap-2 text-xs font-semibold text-ink-soft">
          <input
            type="radio"
            checked={v.type === "video"}
            onChange={() => onChange({ ...v, type: "video" })}
            className="accent-brand-600"
          />
          Video
        </label>
      </div>
      <div>
        <UploadButton
          accept={v.type === "video" ? "video/mp4,video/webm" : "image/*"}
          value={v.src}
          onDone={(url) => onChange({ ...v, src: url, type: url.match(/\.(mp4|webm)(\?|$)/i) ? "video" : v.type })}
        />
      </div>
      {v.type === "video" && (
        <div>
          <p className="field-label">Poster image</p>
          <UploadButton accept="image/*" value={v.poster} onDone={(url) => onChange({ ...v, poster: url })} />
        </div>
      )}
    </div>
  );
}

function StatPairEditor({ value, onChange }: { value?: { value: string; label: string }; onChange: (v: any) => void }) {
  const v = value ?? { value: "", label: "" };
  return (
    <div className="flex items-center gap-2">
      <input value={v.value} onChange={(e) => onChange({ ...v, value: e.target.value })} placeholder="Value" className="field !py-2 text-xs" />
      <input value={v.label} onChange={(e) => onChange({ ...v, label: e.target.value })} placeholder="Label" className="field !py-2 text-xs" />
    </div>
  );
}

function JourneyListEditor({ value, onChange, freightDetails = false }: { value?: any[]; onChange: (v: any[]) => void; freightDetails?: boolean }) {
  const rows = Array.isArray(value) ? value : [];
  const update = (index: number, patch: Record<string, any>) => onChange(rows.map((row, i) => i === index ? { ...row, ...patch } : row));
  return <div className="space-y-3">
    {rows.map((row, index) => <div key={index} className="space-y-2 rounded-2xl border border-line bg-mist-50 p-3">
      <div className="flex items-center justify-between"><strong className="text-xs text-ink">Stage {index + 1}</strong><button type="button" onClick={() => onChange(rows.filter((_, i) => i !== index))} className="text-xs font-bold text-accent">Remove</button></div>
      <input className="field !py-2 text-xs" placeholder="Stage title" value={row.title ?? ""} onChange={(e) => update(index, { title: e.target.value })} />
      <input className="field !py-2 text-xs" placeholder="Short label" value={row.label ?? ""} onChange={(e) => update(index, { label: e.target.value })} />
      <textarea className="field resize-y !py-2 text-xs" rows={2} placeholder="Stage description" value={row.description ?? ""} onChange={(e) => update(index, { description: e.target.value })} />
      <div className="grid grid-cols-3 gap-2"><input className="field !py-2 text-xs" type="number" min="0" max="100" placeholder="Node X %" value={row.nodeX ?? ""} onChange={(e) => update(index, { nodeX: Number(e.target.value) })} /><input className="field !py-2 text-xs" type="number" min="0" max="100" placeholder="Node Y %" value={row.nodeY ?? ""} onChange={(e) => update(index, { nodeY: Number(e.target.value) })} /><input className="field !py-2 text-xs" placeholder="Status / time" value={row.status ?? ""} onChange={(e) => update(index, { status: e.target.value })} /></div>
      <MediaRefEditor value={row.media} onChange={(media) => update(index, { media })} />
      {freightDetails && <div className="space-y-2"><p className="text-xs font-bold">Operational details for this stage</p><p className="text-[11px] text-ink-muted">Editable example values for vehicle, driver, speed, cargo, route, ETA, engine and door status.</p><KvListEditor value={row.details} onChange={(details) => update(index, { details })} /></div>}
    </div>)}
    <button type="button" onClick={() => onChange([...rows, { title: "", description: "", media: { type: "image", src: "", poster: "" } }])} className="btn-ghost !py-2 text-xs"><Icon name="plus" className="h-4 w-4" /> Add journey stage</button>
  </div>;
}

function CapabilityListEditor({ value, onChange }: { value?: any[]; onChange: (v: any[]) => void }) {
  const rows = Array.isArray(value) ? value : [];
  const update = (index: number, patch: Record<string, any>) => onChange(rows.map((row, i) => i === index ? { ...row, ...patch } : row));
  return <div className="space-y-3">{rows.map((row, index) => <div key={index} className="space-y-2 rounded-2xl border border-line bg-mist-50 p-3"><div className="flex justify-between"><strong className="text-xs">Capability {index + 1}</strong><button type="button" className="text-xs font-bold text-accent" onClick={() => onChange(rows.filter((_, i) => i !== index))}>Remove</button></div><input className="field !py-2 text-xs" placeholder="Title" value={row.title ?? ""} onChange={(e) => update(index, { title: e.target.value })}/><select className="field !py-2 text-xs" value={row.icon ?? "gps"} onChange={(e) => update(index, { icon: e.target.value })}>{ICON_OPTIONS.map((icon) => <option key={icon}>{icon}</option>)}</select><textarea className="field !py-2 text-xs" rows={2} placeholder="Description" value={row.description ?? ""} onChange={(e) => update(index, { description: e.target.value })}/><MediaRefEditor value={row.visual} onChange={(visual) => update(index, { visual })}/><label className="flex items-center gap-2 text-xs font-semibold"><input type="checkbox" checked={row.autoSlide !== false} onChange={(e) => update(index, { autoSlide: e.target.checked })}/> Include in auto-slide</label></div>)}<button type="button" className="btn-ghost !py-2 text-xs" onClick={() => onChange([...rows, { title: "", icon: "gps", description: "", visual: { type: "image", src: "" }, autoSlide: true }])}><Icon name="plus" className="h-4 w-4"/> Add capability</button></div>;
}

function RecommendedProductListEditor({ value, onChange, products }: { value?: any[]; onChange: (v: any[]) => void; products: any[] }) {
  const rows = Array.isArray(value) ? value : [];
  const update = (index: number, patch: Record<string, any>) => onChange(rows.map((row, i) => i === index ? { ...row, ...patch } : row));
  return <div className="space-y-3">{rows.map((row, index) => <div key={index} className="space-y-2 rounded-2xl border border-line bg-mist-50 p-3"><div className="flex justify-between"><strong className="text-xs">Device {index + 1}</strong><button type="button" className="text-xs font-bold text-accent" onClick={() => onChange(rows.filter((_, i) => i !== index))}>Remove</button></div><select className="field !py-2 text-xs" value={row.productSlug ?? ""} onChange={(e) => update(index, { productSlug: e.target.value })}><option value="">Select an existing product</option>{products.map((product) => <option key={product.id} value={product.slug}>{product.name}{product.published ? "" : " (unpublished)"}</option>)}</select><textarea className="field !py-2 text-xs" rows={2} placeholder="Why this product is recommended" value={row.explanation ?? ""} onChange={(e) => update(index, { explanation: e.target.value })}/><textarea className="field !py-2 text-xs" rows={2} placeholder="What it performs" value={row.performance ?? ""} onChange={(e) => update(index, { performance: e.target.value })}/></div>)}<button type="button" className="btn-ghost !py-2 text-xs" onClick={() => onChange([...rows, { productSlug: "", explanation: "", performance: "" }])}><Icon name="plus" className="h-4 w-4"/> Add product</button></div>;
}

function BenefitListEditor({ value, onChange }: { value?: any[]; onChange: (v: any[]) => void }) {
  const rows = Array.isArray(value) ? value : [];
  const update = (index: number, patch: Record<string, any>) => onChange(rows.map((row, i) => i === index ? { ...row, ...patch } : row));
  return <div className="space-y-3">{rows.map((row, index) => <div key={index} className="space-y-2 rounded-2xl border border-line bg-mist-50 p-3"><div className="flex justify-between"><strong className="text-xs">Outcome {index + 1}</strong><button type="button" className="text-xs font-bold text-accent" onClick={() => onChange(rows.filter((_, i) => i !== index))}>Remove</button></div><input className="field !py-2 text-xs" placeholder="Title" value={row.title ?? ""} onChange={(e) => update(index, { title: e.target.value })}/><select className="field !py-2 text-xs" value={row.icon ?? "shield"} onChange={(e) => update(index, { icon: e.target.value })}>{ICON_OPTIONS.map((icon) => <option key={icon}>{icon}</option>)}</select><textarea className="field !py-2 text-xs" rows={2} placeholder="Description" value={row.description ?? ""} onChange={(e) => update(index, { description: e.target.value })}/></div>)}<button type="button" className="btn-ghost !py-2 text-xs" onClick={() => onChange([...rows, { title: "", description: "", icon: "shield" }])}><Icon name="plus" className="h-4 w-4"/> Add outcome</button></div>;
}

/* ---------- main manager ---------- */

export default function EntityManager({ entity }: { entity: string }) {
  const [items, setItems] = useState<Record<string, any>[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Record<string, any> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [categoryOptions, setCategoryOptions] = useState<Record<string, any>[]>([]);
  const [productOptions, setProductOptions] = useState<Record<string, any>[]>([]);

  const schema = SCHEMAS[entity] ?? [];
  const titleOf = TITLES[entity] ?? ((i: any) => i.name ?? i.title ?? "Item");
  const subOf = SUBTITLES[entity];
  const previewOf = PREVIEW[entity];

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/c/${entity}`, { cache: "no-store" });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "Failed to load");
      setItems(body.items ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [entity]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (entity !== "products" && entity !== "resources") return;
    fetch("/api/c/productCategories", { cache: "no-store" }).then((res) => res.json()).then((body) => setCategoryOptions(body.items ?? [])).catch(() => setCategoryOptions([]));
  }, [entity]);

  useEffect(() => {
    if (!schema.some((field) => field.type === "productSelect" || field.type === "recommendedProductList")) return;
    fetch("/api/c/products", { cache: "no-store" }).then((res) => res.json()).then((body) => setProductOptions(body.items ?? [])).catch(() => setProductOptions([]));
  }, [entity, schema]);

  const save = async () => {
    if (!editing) return;
    setBusy(true);
    setError("");
    try {
      const payload = fromForm(entity, editing);
      const res = await fetch(isNew ? `/api/c/${entity}` : `/api/c/${entity}/${editing.id}`, {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "Save failed");
      setEditing(null);
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id: string) => {
    const res = await fetch(`/api/c/${entity}/${id}`, { method: "DELETE" });
    if (res.ok) {
      setConfirmDelete(null);
      load();
    }
  };

  const reorder = async (id: string, dir: -1 | 1) => {
    const idx = items.findIndex((i) => i.id === id);
    const swap = idx + dir;
    if (idx < 0 || swap < 0 || swap >= items.length) return;
    const next = [...items];
    [next[idx], next[swap]] = [next[swap], next[idx]];
    setItems(next);
    await fetch(`/api/c/${entity}/reorder`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: next.map((i) => i.id) }),
    });
  };

  const togglePublish = async (item: Record<string, any>) => {
    const res = await fetch(`/api/c/${entity}/${item.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !item.published }),
    });
    if (res.ok) load();
  };

  const openNew = () => {
    const base: Record<string, any> = { published: true };
    for (const f of schema) {
      if (f.type === "bool") base[f.key] = false;
      else if (f.type === "number") base[f.key] = 0;
      else if (f.type === "mediaRef") base[f.key] = { type: "image", src: "", poster: "" };
      else if (["kvList", "strList", "docList", "imageList", "linkList", "resultList", "productSelect", "journeyList", "capabilityList", "recommendedProductList", "benefitList"].includes(f.type)) base[f.key] = [];
      else if (f.type === "statPair") base[f.key] = { value: "", label: "" };
      else if (f.type === "select") base[f.key] = f.options?.[0] ?? "";
      else base[f.key] = "";
    }
    setIsNew(true);
    setEditing(base);
  };

  const openEdit = (item: Record<string, any>) => {
    setIsNew(false);
    setEditing(toForm(entity, { ...item }));
  };

  const setField = (key: string, v: any) => setEditing((e) => (e ? { ...e, [key]: v } : e));

  return (
    <ResourceUploadContext.Provider value={entity === "resources"}><div>
      <div className="mb-5 flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-ink-muted">
          {items.length} item{items.length === 1 ? "" : "s"} · changes publish to the site immediately
        </p>
        <button onClick={openNew} className="btn-primary !py-2.5 text-xs">
          <Icon name="plus" className="h-4 w-4" /> Add new
        </button>
      </div>

      {error && (
        <div className="mb-4 flex items-center justify-between rounded-2xl bg-accent-soft px-4 py-3 text-sm font-semibold text-accent">
          {error}
          <button onClick={load} className="underline">Retry</button>
        </div>
      )}

      <div className="overflow-hidden rounded-3xl border border-line bg-white shadow-card">
        {loading ? (
          <div className="flex items-center gap-3 p-8 text-sm font-semibold text-ink-muted">
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-brand-200 border-t-brand-600" />
            Loading…
          </div>
        ) : items.length === 0 ? (
          <div className="p-10 text-center text-sm font-semibold text-ink-muted">
            Nothing here yet. Add the first item to get started.
          </div>
        ) : (
          <ul className="divide-y divide-line/70">
            {items.map((item, idx) => (
              <li key={item.id} className={`flex items-center gap-3 px-4 py-3.5 transition sm:px-5 ${item.published ? "" : "opacity-55"}`}>
                {/* order */}
                <div className="hidden flex-col gap-0.5 sm:flex">
                  <button onClick={() => reorder(item.id, -1)} disabled={idx === 0} className="rounded p-0.5 text-ink-faint hover:bg-mist-100 hover:text-ink disabled:opacity-30" aria-label="Move up">
                    <Icon name="up" className="h-3.5 w-3.5" />
                  </button>
                  <button onClick={() => reorder(item.id, 1)} disabled={idx === items.length - 1} className="rounded p-0.5 text-ink-faint hover:bg-mist-100 hover:text-ink disabled:opacity-30" aria-label="Move down">
                    <Icon name="down" className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* title */}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-ink">{titleOf(item)}</p>
                  {subOf && <p className="truncate text-xs text-ink-muted">{subOf(item)}</p>}
                </div>

                {/* badges */}
                {entity === "products" && item.featured && (
                  <span className="hidden rounded-full bg-brand-50 px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-wider text-brand-700 md:inline">Featured</span>
                )}
                {entity === "caseStudies" && (
                  <span className={`hidden rounded-full px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-wider md:inline ${item.approved ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                    {item.approved ? "Approved" : "Pending"}
                  </span>
                )}
                {entity === "locations" && item.international && (
                  <span className="hidden rounded-full bg-mist-200 px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-wider text-ink-muted md:inline">Intl</span>
                )}

                {/* publish */}
                <button
                  onClick={() => togglePublish(item)}
                  aria-pressed={item.published}
                  className={`relative h-6 w-11 shrink-0 rounded-full transition ${item.published ? "bg-brand-600" : "bg-mist-300"}`}
                  aria-label={item.published ? "Unpublish" : "Publish"}
                  title={item.published ? "Published — click to unpublish" : "Unpublished — click to publish"}
                >
                  <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${item.published ? "left-[22px]" : "left-0.5"}`} />
                </button>

                {/* actions */}
                <div className="flex shrink-0 items-center gap-1">
                  {previewOf && (
                    <a href={previewOf(item)} target="_blank" rel="noreferrer" className="rounded-full p-2 text-ink-faint hover:bg-mist-100 hover:text-brand-700" aria-label="Preview">
                      <Icon name="eye" className="h-4 w-4" />
                    </a>
                  )}
                  <button onClick={() => openEdit(item)} className="rounded-full p-2 text-ink-faint hover:bg-mist-100 hover:text-ink" aria-label="Edit">
                    <Icon name="edit" className="h-4 w-4" />
                  </button>
                  {confirmDelete === item.id ? (
                    <button onClick={() => remove(item.id)} className="rounded-full bg-accent px-3 py-1.5 text-[11px] font-bold text-white">
                      Confirm?
                    </button>
                  ) : (
                    <button onClick={() => setConfirmDelete(item.id)} className="rounded-full p-2 text-ink-faint hover:bg-accent-soft hover:text-accent" aria-label="Delete">
                      <Icon name="trash" className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* drawer */}
      <AnimatePresence>
        {editing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-ink/45 backdrop-blur-sm"
            onClick={() => setEditing(null)}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.28, ease: [0.22, 0.61, 0.36, 1] }}
              className="absolute right-0 top-0 flex h-full w-full max-w-xl flex-col bg-white shadow-2xl"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
            >
              <div className="flex items-center justify-between border-b border-line px-6 py-4">
                <div>
                  <p className="text-[10.5px] font-bold uppercase tracking-[0.18em] text-ink-faint">
                    {isNew ? "Create" : "Edit"} · {entity}
                  </p>
                  <h2 className="font-display text-lg font-extrabold text-ink">{isNew ? "New item" : titleOf(editing)}</h2>
                </div>
                <button onClick={() => setEditing(null)} className="rounded-full p-2 text-ink hover:bg-mist-100" aria-label="Close">
                  <Icon name="x" className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
                {error && <p className="rounded-xl bg-accent-soft px-4 py-3 text-sm font-semibold text-accent">{error}</p>}
                {schema.map((f) => (
                  <div key={f.key}>
                    <label className="block">
                      <span className="field-label">{entity === "solutions" && editing.slug === "taxi" && f.key === "blueprintMedia" ? "Connected technology section visual" : f.label}</span>
                      {f.type === "text" && <input value={editing[f.key] ?? ""} onChange={(e) => setField(f.key, e.target.value)} className="field" />}
                      {f.type === "textarea" && <textarea rows={f.key === "description" || f.key === "summary" ? 5 : 3} value={editing[f.key] ?? ""} onChange={(e) => setField(f.key, e.target.value)} className="field resize-y" />}
                      {f.type === "number" && (
                        <input
                          type="number"
                          step="any"
                          value={editing[f.key] ?? 0}
                          onChange={(e) => setField(f.key, parseFloat(e.target.value) || 0)}
                          className="field"
                        />
                      )}
                      {f.type === "select" && (
                        <select value={editing[f.key] ?? ""} onChange={(e) => setField(f.key, e.target.value)} className="field">
                          {f.options?.map((o) => (
                            <option key={o} value={o}>{o}</option>
                          ))}
                        </select>
                      )}
                      {f.type === "categorySelect" && <select value={editing[f.key] ?? ""} onChange={(e) => setField(f.key, e.target.value)} className="field"><option value="">Select category</option>{categoryOptions.map((category) => <option key={category.id} value={category.name}>{category.name}{category.published ? "" : " (unpublished)"}</option>)}</select>}
                      {f.type === "productSelect" && <div className="grid gap-2 rounded-2xl border border-line p-3 sm:grid-cols-2">{productOptions.filter((item) => entity !== "products" || item.id !== editing.id).map((item) => { const selected = (editing[f.key] ?? []).includes(item.slug); return <label key={item.id} className="flex items-center gap-2 rounded-lg p-2 text-xs font-semibold hover:bg-mist-50"><input type="checkbox" checked={selected} onChange={() => setField(f.key, selected ? editing[f.key].filter((slug: string) => slug !== item.slug) : [...(editing[f.key] ?? []), item.slug])} className="accent-brand-600" />{item.name}</label>; })}</div>}
                      {f.type === "bool" && (
                        <button
                          type="button"
                          onClick={() => setField(f.key, !editing[f.key])}
                          aria-pressed={!!editing[f.key]}
                          className={`relative h-7 w-12 rounded-full transition ${editing[f.key] ? "bg-brand-600" : "bg-mist-300"}`}
                        >
                          <span className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-all ${editing[f.key] ? "left-[22px]" : "left-0.5"}`} />
                          <span className={`absolute top-1/2 -translate-y-1/2 text-[10px] font-bold ${editing[f.key] ? "left-2.5 text-brand-700" : "right-2.5 text-ink-muted"}`}>
                            {editing[f.key] ? "ON" : "OFF"}
                          </span>
                        </button>
                      )}
                      {f.type === "image" && (
                        <div className="space-y-2">
                          {editing[f.key] && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={editing[f.key]} alt="" className="h-28 rounded-xl border border-line object-contain bg-mist-50 p-2" />
                          )}
                          <UploadButton value={editing[f.key]} onDone={(url) => setField(f.key, url)} />
                        </div>
                      )}
                      {f.type === "imageList" && <ImageListEditor value={editing[f.key]} onChange={(v) => setField(f.key, v)} />}
                      {f.type === "mediaRef" && <MediaRefEditor value={editing[f.key]} onChange={(v) => setField(f.key, v)} />}
                      {entity === "solutions" && editing.slug === "taxi" && f.key === "blueprintMedia" && <p className="mt-1 text-[11px] text-ink-faint">An image here replaces the connected vehicle diagram. Use the complete artwork with its heading and captions. Clear it to restore the linked-product diagram.</p>}
                      {f.type === "kvList" && <KvListEditor value={editing[f.key]} onChange={(v) => setField(f.key, v)} />}
                      {f.type === "strList" && <StrListEditor value={editing[f.key]} onChange={(v) => setField(f.key, v)} />}
                      {f.type === "docList" && <DocListEditor value={editing[f.key]} onChange={(v) => setField(f.key, v)} />}
                      {f.type === "docRef" && <DocRefEditor value={editing[f.key]} onChange={(v) => setField(f.key, v)} />}
                      {f.type === "linkList" && <LinkListEditor value={editing[f.key]} onChange={(v) => setField(f.key, v)} />}
                      {f.type === "resultList" && <ResultListEditor value={editing[f.key]} onChange={(v) => setField(f.key, v)} />}
                      {f.type === "journeyList" && <JourneyListEditor value={editing[f.key]} freightDetails={entity === "solutions" && ["logistics", "taxi", "agriculture", "employee-transport", "public-transport"].includes(editing.slug)} onChange={(v) => setField(f.key, v)} />}
                      {f.type === "capabilityList" && <CapabilityListEditor value={editing[f.key]} onChange={(v) => setField(f.key, v)} />}
                      {f.type === "recommendedProductList" && <RecommendedProductListEditor value={editing[f.key]} products={productOptions} onChange={(v) => setField(f.key, v)} />}
                      {f.type === "benefitList" && <BenefitListEditor value={editing[f.key]} onChange={(v) => setField(f.key, v)} />}
                      {f.type === "statPair" && <StatPairEditor value={editing[f.key]} onChange={(v) => setField(f.key, v)} />}
                      {f.hint && <p className="mt-1 text-[11px] text-ink-faint">{f.hint}</p>}
                    </label>
                  </div>
                ))}

                {entity === "products" && <div className="overflow-hidden rounded-2xl border border-line bg-mist-50"><div className="flex items-center justify-between border-b border-line px-4 py-3"><p className="text-sm font-bold text-ink">Product preview</p><span className="text-[10px] font-bold uppercase tracking-wider text-ink-faint">Before publishing</span></div><div className="grid gap-4 p-4 sm:grid-cols-[120px_1fr]">{editing.image ? <img src={editing.image} alt="" className="h-28 w-full rounded-xl bg-white object-contain p-2" /> : <div className="flex h-28 items-center justify-center rounded-xl bg-white text-ink-faint"><Icon name="image" /></div>}<div className="min-w-0"><p className="text-[10px] font-bold uppercase tracking-wider text-brand-600">{editing.category || "Category"}</p><h3 className="mt-1 font-display text-xl font-bold text-ink">{editing.name || "Product name"}</h3><p className="mt-2 line-clamp-2 text-xs leading-relaxed text-ink-muted">{editing.tagline || "Product tagline will appear here."}</p><p className="mt-3 text-sm font-extrabold text-ink">{editing.price || "Price"}</p></div></div></div>}

                {entity === "solutions" && editing.slug === "taxi" && (
                  <fieldset className="space-y-4 rounded-2xl border border-line bg-mist-50 p-4">
                    <legend className="px-2 text-sm font-bold">Cab &amp; Taxi section copy</legend>
                    <p className="text-xs leading-5 text-ink-muted">Device images, names and descriptions come from the linked Products. Missing device images are omitted from the connected diagram. Taxi CTA links use /request-quote or /contact.</p>
                    <div><p className="field-label">Hero status strip</p><KvListEditor value={editing.liveStatus} onChange={(value) => setField("liveStatus", value)} /></div>
                  {TAXI_COPY_FIELDS.map(([key, label]) => (
                      <label key={key} className="block">
                        <span className="field-label">{label}</span>
                        <input className="field" value={editing.taxiContent?.[key] ?? ""} onChange={(event) => setField("taxiContent", { ...editing.taxiContent, [key]: event.target.value })} />
                      </label>
                    ))}
                  </fieldset>
                )}

                {entity === "solutions" && editing.slug === "logistics" && <fieldset className="space-y-4 rounded-2xl border border-line bg-mist-50 p-4">
                  <legend className="px-2 text-sm font-bold">Logistics &amp; Trucking experience</legend>
                  <p className="text-xs leading-5 text-ink-muted">Product names and images come from linked Products. Freight details describe an illustrative journey; edit them within each journey stage.</p>
                  <div><p className="field-label">Hero live-status strip</p><KvListEditor value={editing.liveStatus} onChange={(value) => setField("liveStatus", value)} /></div>
                  {LOGISTICS_COPY_FIELDS.map(([key, label]) => <label key={key} className="block"><span className="field-label">{label}</span><input className="field" value={editing.logisticsContent?.[key] ?? ""} onChange={(event) => setField("logisticsContent", { ...editing.logisticsContent, [key]: event.target.value })} /></label>)}
                </fieldset>}

                {entity === "solutions" && editing.slug === "agriculture" && <fieldset className="space-y-4 rounded-2xl border border-line bg-mist-50 p-4">
                  <legend className="px-2 text-sm font-bold">Agriculture &amp; Equipment experience</legend>
                  <p className="text-xs leading-5 text-ink-muted">Product names and images come from linked Products. Edit illustrative equipment values within each journey stage.</p>
                  <div><p className="field-label">Hero live-status strip</p><KvListEditor value={editing.liveStatus} onChange={(value) => setField("liveStatus", value)} /></div>
                  {LOGISTICS_COPY_FIELDS.map(([key, label]) => <label key={key} className="block"><span className="field-label">{label.replace("Freight room", "Field operations").replace("Stage list", "Task stage list")}</span><input className="field" value={editing.agricultureContent?.[key] ?? ""} onChange={(event) => setField("agricultureContent", { ...editing.agricultureContent, [key]: event.target.value })} /></label>)}
                </fieldset>}

                {entity === "solutions" && editing.slug === "employee-transport" && <fieldset className="space-y-4 rounded-2xl border border-line bg-mist-50 p-4">
                  <legend className="px-2 text-sm font-bold">Employee Transport experience</legend>
                  <p className="text-xs leading-5 text-ink-muted">Product names and images come from linked Products. Edit illustrative shuttle values within each journey stage.</p>
                  <div><p className="field-label">Hero live-status strip</p><KvListEditor value={editing.liveStatus} onChange={(value) => setField("liveStatus", value)} /></div>
                  {LOGISTICS_COPY_FIELDS.map(([key, label]) => <label key={key} className="block"><span className="field-label">{label.replace("Freight room", "Shift journey").replace("Stage list", "Task stage list")}</span><input className="field" value={editing.employeeContent?.[key] ?? ""} onChange={(event) => setField("employeeContent", { ...editing.employeeContent, [key]: event.target.value })} /></label>)}
                </fieldset>}

                {entity === "solutions" && editing.slug === "public-transport" && <fieldset className="space-y-4 rounded-2xl border border-line bg-mist-50 p-4">
                  <legend className="px-2 text-sm font-bold">Public Transport experience</legend>
                  <p className="text-xs leading-5 text-ink-muted">Product names and images come from linked Products. Edit illustrative bus values within each journey stage.</p>
                  <div><p className="field-label">Hero live-status strip</p><KvListEditor value={editing.liveStatus} onChange={(value) => setField("liveStatus", value)} /></div>
                  {LOGISTICS_COPY_FIELDS.map(([key, label]) => <label key={key} className="block"><span className="field-label">{label.replace("Freight room", "Transit operations").replace("Stage list", "Task stage list")}</span><input className="field" value={editing.transitContent?.[key] ?? ""} onChange={(event) => setField("transitContent", { ...editing.transitContent, [key]: event.target.value })} /></label>)}
                </fieldset>}

                {/* published */}
                <div className="flex items-center justify-between rounded-2xl border border-line p-4">
                  <div>
                    <p className="text-sm font-bold text-ink">Published</p>
                    <p className="text-xs text-ink-muted">Visible on the public site when on.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setField("published", !editing.published)}
                    aria-pressed={!!editing.published}
                    className={`relative h-7 w-12 rounded-full transition ${editing.published ? "bg-brand-600" : "bg-mist-300"}`}
                  >
                    <span className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-all ${editing.published ? "left-[22px]" : "left-0.5"}`} />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-line px-6 py-4">
                <button onClick={() => setEditing(null)} className="btn-ghost !py-2.5 text-xs">Cancel</button>
                <button onClick={save} disabled={busy} className="btn-primary !py-2.5 text-xs disabled:opacity-60">
                  {busy ? "Saving…" : isNew ? "Create item" : "Save changes"} <Icon name="check" className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div></ResourceUploadContext.Provider>
  );
}
