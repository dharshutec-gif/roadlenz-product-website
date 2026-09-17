"use client";

import { Component } from "react";
import type { CSSProperties, FormEvent, MouseEvent, ReactNode, FocusEvent, KeyboardEvent } from "react";
import styles from "./aboutexperience.module.css";

/** Approved visual reference, heading-only hero, motion effects, accessible office popovers and premium leadership section.
 * Replace BOTH component files. No Tailwind, icon package, header or footer required.
 * Company history and contacts retain the information supplied by Bigfox.
 */
export type Office = {
  id: string;
  title: string;
  officeType: string;
  city: string;
  region?: string;
  country: string;
  address: string[];
  phone?: string;
  email?: string;
  headquarters?: boolean;
  mapsUrl: string;
};

export const offices: Office[] = [
  {
    "id": "chennai-headquarters",
    "title": "Bigfox Office",
    "officeType": "Headquarters",
    "city": "Chennai",
    "region": "Tamil Nadu",
    "country": "India",
    "address": [
      "Plot No. 23, Women Industrial Park",
      "SIDCO Industrial Estate",
      "Thirumudivakkam",
      "Chennai, Chengalpattu",
      "Tamil Nadu – 600044",
      "India"
    ],
    "phone": "+91 98416 00444",
    "email": "sales@bigfox.co.in",
    "headquarters": true,
    "mapsUrl": "https://www.google.com/maps/search/?api=1&query=Plot%20No.%2023%20Women%20Industrial%20Park%20SIDCO%20Industrial%20Estate%20Thirumudivakkam%20Chennai%20600044"
  },
  {
    "id": "chennai-production-unit",
    "title": "Production facility",
    "officeType": "Production unit",
    "city": "Old Perungalathur",
    "region": "Tamil Nadu",
    "country": "India",
    "address": [
      "Plot No. 46, AGS Office Staff Colony",
      "Kishkintha Road",
      "Old Perungalathur",
      "Chennai, Chengalpattu District",
      "Tamil Nadu – 600063",
      "India"
    ],
    "phone": "+91 98416 00444",
    "email": "sales@bigfox.co.in",
    "mapsUrl": "https://www.google.com/maps/search/?api=1&query=Plot%20No.%2046%20AGS%20Office%20Staff%20Colony%20Kishkintha%20Road%20Old%20Perungalathur%20Chennai%20600063"
  },
  {
    "id": "bangalore",
    "officeType": "Branch Office",
    "title": "Bangalore Branch",
    "city": "Bangalore, Karnataka",
    "country": "India",
    "address": [
      "BigFox Engineering Pvt Ltd",
      "No. #29, First Main, Second Cross",
      "Bachappa Layout",
      "Bangalore - 16",
      "India"
    ],
    "phone": "+91 98416 00444",
    "email": "sales@bigfox.co.in",
    "mapsUrl": "https://www.google.com/maps/search/?api=1&query=BigFox+Engineering+Pvt+Ltd%2C+No.+29%2C+First+Main%2C+Second+Cross%2C+Bachappa+Layout%2C+Bangalore%2C+India"
  },
  {
    "id": "germany-office",
    "title": "Germany Office",
    "officeType": "European Office",
    "city": "Erlangen",
    "region": "Bavaria",
    "country": "Germany",
    "address": [
      "Fraunhoferstraße 27",
      "91058 Erlangen",
      "Germany"
    ],
    "email": "sales@bigfox.co.in",
    "mapsUrl": "https://www.google.com/maps/search/?api=1&query=Fraunhoferstra%C3%9Fe%2027%2091058%20Erlangen%20Germany"
  },
  {
    "id": "netherlands-office",
    "title": "Netherlands Office",
    "officeType": "European Office",
    "city": "Veldhoven",
    "region": "North Brabant",
    "country": "The Netherlands",
    "address": [
      "Vlierbeek 39",
      "5501 AJ",
      "Veldhoven",
      "North Brabant",
      "The Netherlands"
    ],
    "email": "sales@bigfox.co.in",
    "mapsUrl": "https://www.google.com/maps/search/?api=1&query=Vlierbeek%2039%205501%20AJ%20Veldhoven%20Netherlands"
  },
  {
    "id": "usa-office",
    "title": "USA Office",
    "officeType": "North America Office",
    "city": "Mountain House",
    "region": "California",
    "country": "United States",
    "address": [
      "266 W Moraga St",
      "Mountain House",
      "California 95391",
      "United States"
    ],
    "email": "sales@bigfox.co.in",
    "mapsUrl": "https://www.google.com/maps/search/?api=1&query=266%20W%20Moraga%20St%20Mountain%20House%20CA%2095391%20United%20States"
  }
];

/** Files live in public/media/about/. Keep the URLs below free of "public/". */
export const ABOUT_IMAGES = {
  hero: "/media/about/bigfox-team-hero.jpg",
  logo: "/media/about/bigfox-logo.png",
  globe: "/media/about/global-presence-globe.png",
  vision: "/media/about/vision-landscape.jpg",
  mission: "/media/about/mission-road.jpg",
  values: "/media/about/values-team.jpg",
  customerSupport: "/media/about/customer-support-team.jpg",
  installationSupport: "/media/about/installation-support-team.jpg",
  technicalSupport: "/media/about/technical-support-team.jpg",
  managingDirector: "/media/about/managing-director-cutout.png",
  director: "/media/about/director-cutout.png",
  cta: "/media/about/cta-road.jpg",
};

/** Illustrative purpose/CTA artwork from the approved mockup.
 * Support cards only use your real team photos (or a neutral icon fallback).
 * Set useReferenceArtwork={false} to disable the remaining decorative fallbacks.
 */
const REFERENCE_ART = {
  vision: "/media/about/preview-vision.webp",
  mission: "/media/about/preview-mission.webp",
  values: "/media/about/preview-values.webp",
  cta: "/media/about/preview-cta-road.webp",
};

export type SupportTeamId = "customer" | "installation" | "technical";
export type GlobePinPosition = { x: number; y: number };
export type HeroSlide = { src: string; alt?: string; position?: string };
export type EnquiryData = {
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
};

export type AboutExperienceProps = {
  className?: string;
  /** Unique only if you render multiple instances on the same page. */
  idPrefix?: string;
  /** Existing sticky header height, for in-page scrolling; no header is rendered. */
  headerOffset?: number;
  /** Default 96px on desktop; automatically reduced on smaller screens. */
  sectionSpacing?: number;
  heroImageSrc?: string;
  heroImagePosition?: string;
  /** Optional real slideshow. Controls are hidden when there is only one slide. */
  heroSlides?: readonly HeroSlide[];
  logoSrc?: string;
  globeImageSrc?: string;
  /** Full-world view makes all six offices visible. "image" needs all six calibrated globePins. */
  mapMode?: "world" | "image";
  /** Turns decorative motion off; reduced-motion preferences are always respected. */
  enableAnimations?: boolean;
  /** "system" respects the visitor's device preference (default).
   * "full" explicitly opts this page into full motion, useful for previewing on
   * a Windows/browser profile that has Animation effects switched off.
   * "reduced" disables movement. No visitor-facing control is rendered.
   */
  motionPreference?: "system" | "full" | "reduced";
  /** Calibrated percentage coordinates on your COMPLETE globe image; no guessed pins. */
  globePins?: Partial<Record<string, GlobePinPosition>>;
  purposeImages?: Partial<Record<"vision" | "mission" | "values", string>>;
  /** One real group photograph for each of the three support teams. */
  supportTeamImages?: Partial<Record<SupportTeamId, string>>;
  /** Optional per-photo crop adjustment; e.g. customer: "center 30%". */
  supportTeamImagePositions?: Partial<Record<SupportTeamId, string>>;
  ctaImageSrc?: string;
  useReferenceArtwork?: boolean;
  /** Optional older sections are off by default to match the newly approved image. */
  showImpactStats?: boolean;
  showLeadership?: boolean;
  showEnquirySection?: boolean;
  showOfficeLinks?: boolean;
  managingDirectorPhotoSrc?: string;
  directorPhotoSrc?: string;
  /** Set to an existing route (e.g. /contact) to navigate rather than open the enquiry. */
  contactHref?: string;
  /** Resolve only after successful delivery; throw/reject on failure.
   * Without a handler, the form opens an email draft and does not claim delivery.
   * In Next.js, pass a normal function from a Client Component wrapper.
   */
  onEnquirySubmit?: (data: EnquiryData) => void | Promise<void>;
};

export const SUPPORT_TEAMS = [
  {
    id: "customer",
    title: "Customer Support",
    phone: "+91 98416 00444",
    email: "bigfoxinfo@gmail.com",
    image: "customerSupport",
    badge: "Fast Response",
    summary: "Product enquiries, quotation follow-up and everyday customer assistance from the Bigfox team.",
    highlights: ["Sales help", "Order support"],
  },
  {
    id: "installation",
    title: "Installation Support",
    phone: "+91 95669 12277",
    email: "projects@bigfox.co.in",
    image: "installationSupport",
    badge: "Project Delivery",
    summary: "Site coordination, rollout planning and deployment support for every connected mobility project.",
    highlights: ["Scheduling", "On-site support"],
  },
  {
    id: "technical",
    title: "Technical Support",
    phone: "+91 78710 59890",
    email: "bigfoxsales@gmail.com",
    image: "technicalSupport",
    badge: "Expert Assistance",
    summary: "Software guidance, device diagnostics and troubleshooting from our dedicated technical specialists.",
    highlights: ["Diagnostics", "Platform help"],
  },
] as const;

export const GLOBAL_PRESENCE_STATS = [
  { id: "locations", value: String(offices.length), label: "Locations Worldwide" },
  { id: "support", value: "24/7", label: "Support" },
  { id: "countries", value: String(new Set(offices.map((office) => office.country)).size), label: "Countries" },
  { id: "vehicles", value: "1,000+", label: "Vehicles Connected" },
] as const;

/** Optional company-supplied marketing figures, not independently verified.
 * Substantiate "Lives Saved" before publication. Hidden in the approved layout.
 */
export const IMPACT_STATS = [
  { value: "2016", label: "Founded" },
  { value: "5L+", label: "Lives Saved" },
  { value: "1,000+", label: "Vehicles Connected" },
  { value: "24/7", label: "Support" },
] as const;

/** Empty by design: office coordinates must be calibrated to the chosen image. */
export const DEFAULT_GLOBE_PINS: Record<string, GlobePinPosition> = {};

export const MILESTONES = [
  { year: "2016", title: "Company Founded", description: "Bigfox Engineering established in Chennai." },
  { year: "2018", title: "Fabrication Center Unit-I", description: "Our first production facility became operational." },
  { year: "2023", title: "R&D Center — Thirumudivakkam", description: "A dedicated research and development hub was launched." },
  { year: "2024", title: "Fabrication Center Unit-II", description: "Expanded production capabilities with a second fabrication center." },
  { year: "2025", title: "ADAS AI Test Facilities", description: "Advanced facilities for testing AI-enabled driver assistance features." },
  { year: "2026", title: "Laser Cutting Facility", description: "January 1 — Launch of the laser cutting facility at our Thirumudivakkam unit." },
  { year: "2026", title: "RoadLenz", description: "Smart Fleet Intelligence — connecting GPS tracking, vehicle video and AI-enabled safety in one platform." },
] as const;

const PURPOSE = [
  {
    id: "vision",
    title: "Our Vision",
    copy: "To build a safer, smarter and more connected tomorrow.",
    caption: "Explore our journey",
    href: "journey",
  },
  {
    id: "mission",
    title: "Our Mission",
    copy: "Deliver intelligent technology that creates safer operations and better decisions.",
    caption: "See our global reach",
    href: "presence",
  },
  {
    id: "values",
    title: "Our Values",
    copy: "Innovation. Integrity. Impact. People First.",
    caption: "Meet our support teams",
    href: "support",
  },
] as const;

type IconName = "vision" | "mission" | "values" | "shield" | "gear" | "chart" | "locations" | "support" | "countries" | "vehicles" | "installation" | "technical" | "phone" | "email" | "arrow" | "previous" | "next" | "close" | "pause" | "play" | "replay";
function Icon({ name, className }: { name: IconName; className?: string | undefined }) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true" focusable="false">
      {name === "vision" && <g><path d="M2 12s3.8-7 10-7 10 7 10 7-3.8 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" /></g>}
      {name === "mission" && <g><circle cx="11" cy="13" r="9" /><circle cx="11" cy="13" r="5" /><path d="m11 13 9-10m-4 0h4v4" /></g>}
      {name === "values" && <g><circle cx="12" cy="6" r="3" /><path d="M6 20v-3a6 6 0 0 1 12 0v3M3 9a3 3 0 0 1 0 6m0 0H2v5m19-11a3 3 0 0 0 0 6m0 0h1v5" /></g>}
      {name === "shield" && <g><path d="m12 2 8 4v6c0 5-8 10-8 10S4 17 4 12V6l8-4Z" /><path d="m8 12 3 3 5-6" /></g>}
      {name === "gear" && <g><path d="m9 3 1-2h4l1 2 2 1 2-1 2 3-1 2 1 2 2 1v4l-2 1-1 2 1 2-3 2-2-1-2 1-1 2h-4l-1-2-2-1-2 1-2-3 1-2-1-2-2-1v-4l2-1 1-2-1-2 3-2 2 1 2-1Z" transform="translate(1 1) scale(.85)" /><circle cx="12" cy="12" r="3" /></g>}
      {name === "chart" && <g><path d="M3 12h4v9H3zM10 7h4v14h-4zM17 2h4v19h-4z" /></g>}
      {name === "locations" && <g><path d="M20 10c0 6-8 11-8 11S4 16 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></g>}
      {name === "support" && <g><path d="M4 13v-1a8 8 0 0 1 16 0v1" /><rect x="3" y="11" width="4" height="8" rx="2" /><rect x="17" y="11" width="4" height="8" rx="2" /><path d="M19 19c0 2-3 3-7 3" /></g>}
      {name === "countries" && <g><circle cx="12" cy="12" r="9" /><ellipse cx="12" cy="12" rx="4" ry="9" /><path d="M3 12h18M5 6.5h14M5 17.5h14" /></g>}
      {name === "vehicles" && <g><rect x="3" y="3" width="18" height="15" rx="3" /><path d="M3 11h18M7 18v3M17 18v3M8 7h8" /><path d="M7 14h2m6 0h2" /></g>}
      {name === "installation" && <path d="M14.5 6.5 18 3a6 6 0 0 0-7.5 7.5L3 18a2.1 2.1 0 0 0 3 3l7.5-7.5A6 6 0 0 0 21 6l-3.5 3.5-3-3Z" />}
      {name === "technical" && <g><rect x="3" y="3" width="18" height="13" rx="2" /><path d="M8 21h8M12 16v5M9 7 7 9l2 2m6-4 2 2-2 2" /></g>}
      {name === "phone" && <path d="m8 3 3 5-3 2a15 15 0 0 0 6 6l2-3 5 3v3a2 2 0 0 1-2 2A18 18 0 0 1 3 5a2 2 0 0 1 2-2h3Z" />}
      {name === "email" && <g><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></g>}
      {name === "arrow" && <path d="M4 12h16m-6-6 6 6-6 6" />}
      {name === "previous" && <path d="m15 6-6 6 6 6" />}
      {name === "next" && <path d="m9 6 6 6-6 6" />}
      {name === "pause" && <g><path d="M8 5v14M16 5v14" strokeWidth="3" /></g>}
      {name === "play" && <path d="m8 4 12 8-12 8V4Z" />}
      {name === "replay" && <g><path d="M4 10a8 8 0 1 1 1 8M4 4v6h6" /></g>}
      {name === "close" && <path d="m6 6 12 12M6 18 18 6" />}
    </svg>
  );
}

function join(...classes: Array<string | undefined | false>): string {
  return classes.filter(Boolean).join(" ");
}
function phoneHref(phone: string): string { return `tel:${phone.replace(/[^+\d]/g, "")}`; }
function bounded(value: number | undefined, fallback: number, min: number, max: number): number {
  return typeof value === "number" && Number.isFinite(value) ? Math.min(max, Math.max(min, value)) : fallback;
}
export function buildEnquiryMailto(data: EnquiryData): string {
  const recipient = SUPPORT_TEAMS.find((team) => team.title === data.subject)?.email ?? "sales@bigfox.co.in";
  const subject = encodeURIComponent(`RoadLenz / Bigfox enquiry: ${data.subject}`);
  const body = encodeURIComponent(`Name: ${data.fullName}\nEmail: ${data.email}\nPhone: ${data.phone}\nSubject: ${data.subject}\n\n${data.message}`);
  return `mailto:${recipient}?subject=${subject}&body=${body}`;
}

type SafeImageProps = {
  src?: string | undefined;
  fallbackSrc?: string | undefined;
  alt: string;
  className: string;
  style?: CSSProperties | undefined;
  eager?: boolean;
  width?: number;
  height?: number;
  children?: ReactNode;
};
/** Falls back once per failed URL, without broken-image icons or retry loops. */
class SafeImage extends Component<SafeImageProps, { failed: readonly string[] }> {
  state: { failed: readonly string[] } = { failed: [] };
  render() {
    const { src, fallbackSrc, alt, className, style, eager, width, height, children } = this.props;
    const candidates = [src, fallbackSrc].filter((item): item is string => Boolean(item));
    const current = candidates.find((item) => !this.state.failed.includes(item));
    if (!current) return children ?? null;
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={current} alt={alt} className={className} style={style} width={width} height={height}
        loading={eager ? "eager" : "lazy"} decoding="async"
        onError={() => this.setState((previous) => ({ failed: [...previous.failed, current] }))} />
    );
  }
}

/**
 * Interactive world-map panel. Office addresses are supplied by Bigfox.
 * City anchors are approximate city centres, NOT building coordinates.
 * The visible markers are offset with leader lines so adjacent offices remain selectable.
 * Coastline geometry: Natural Earth (public domain), simplified and embedded below.
 * No API key, map SDK, geolocation request or external map-image fetch is needed.
 */
const WORLD_COASTLINE = "M302.0,240.1L297.8,234.2L296.7,234.4L294.3,236.5L295.5,237.9L293.3,238.8L292.8,237.2L286.6,235.6L286.3,234.1L282.8,231.4L282.5,232.8L281.1,231.8L281.0,228.9L276.0,224.2L276.9,224.0L276.4,223.2L273.9,223.6L266.9,221.6L261.4,217.3L258.0,215.8L253.2,217.2L235.5,210.5L230.4,206.2L229.8,205.0L230.7,204.8L231.0,202.5L229.0,199.0L223.0,192.9L220.8,191.8L220.7,189.6L217.9,187.8L217.3,186.0L213.2,183.2L210.8,177.6L206.7,176.0L206.9,180.1L214.8,189.1L217.2,195.1L218.4,195.2L220.3,198.0L218.8,198.9L218.1,197.3L213.3,194.0L213.0,190.7L206.0,186.4L207.2,186.3L208.3,184.2L204.8,181.7L200.2,172.8L197.1,170.3L191.7,168.8L182.1,154.2L182.6,149.9L181.7,147.9L183.4,140.9L181.4,134.1L185.4,134.5L186.7,136.9L187.4,136.2L186.1,132.0L179.0,128.4L174.3,127.3L172.9,125.1L173.3,123.5L170.0,122.4L169.6,120.3L166.5,118.5L166.4,117.2L162.8,115.4L162.0,113.2L158.7,111.1L157.4,108.7L150.8,108.5L142.6,105.1L132.1,103.9L124.0,101.6L121.2,102.2L121.7,103.9L112.3,106.0L111.9,104.5L113.1,102.0L115.8,101.2L115.1,100.6L106.4,105.5L108.3,106.8L105.9,108.6L100.5,110.5L95.1,114.1L78.9,118.2L86.5,114.4L89.7,114.1L96.9,110.1L98.7,106.7L93.5,107.9L91.8,106.6L91.2,107.5L90.2,106.3L86.1,107.3L86.3,104.8L84.7,103.9L81.4,104.4L77.4,102.6L77.4,101.1L75.5,100.1L76.5,98.6L79.5,95.8L83.3,96.1L89.1,94.3L87.2,92.6L89.1,91.7L84.1,92.8L78.4,92.5L74.7,91.9L70.4,89.4L79.7,87.1L81.8,87.1L81.4,88.4L86.8,88.3L77.3,83.3L73.8,82.5L75.3,81.2L79.8,81.1L83.0,79.9L83.6,78.7L86.2,77.5L99.8,74.9L105.6,76.6L111.0,76.2L114.8,77.2L133.0,77.9L151.2,81.1L156.5,79.3L160.3,79.6L168.3,77.8L170.1,78.9L172.0,78.3L172.5,77.1L178.6,79.7L182.0,77.9L182.4,79.9L189.6,78.9L205.5,81.1L208.9,82.4L205.3,83.7L210.0,84.2L219.0,83.5L221.8,85.0L224.5,83.7L221.9,82.6L223.6,81.8L228.7,81.4L233.4,83.4L240.7,84.3L248.4,84.0L248.1,82.4L250.4,82.0L254.4,82.8L254.3,85.3L256.0,83.2L258.0,83.3L259.2,80.7L253.5,78.1L253.7,75.3L256.7,73.4L260.1,73.8L266.1,77.8L263.8,79.1L268.6,79.6L268.6,82.2L272.0,80.2L275.1,81.9L274.3,83.8L276.8,85.5L281.3,81.4L281.4,78.6L288.9,79.2L292.3,80.5L292.4,81.7L290.5,83.1L292.3,84.5L292.0,85.7L287.0,87.5L280.8,87.1L276.8,91.7L273.9,93.4L270.2,93.6L268.2,94.7L268.0,96.3L265.1,96.6L259.2,101.6L258.0,106.6L261.8,107.0L264.1,111.3L267.7,110.8L282.7,115.9L289.7,116.3L290.1,121.1L292.0,123.9L295.8,126.4L297.7,125.5L299.1,122.9L297.8,118.9L296.0,117.5L300.1,116.3L304.4,112.7L302.4,108.9L299.3,106.9L302.4,104.3L300.4,98.0L311.3,97.6L317.6,101.0L322.2,101.2L322.9,106.6L327.1,108.5L330.8,107.0L335.0,103.0L343.1,111.6L342.1,113.2L347.8,116.1L353.5,117.6L354.5,119.8L357.5,121.1L357.7,124.0L349.8,126.7L346.6,128.8L330.3,128.9L324.9,131.8L318.3,137.6L320.5,137.1L324.6,133.8L329.9,131.7L333.7,131.4L336.0,132.7L333.6,134.4L335.2,139.1L338.6,140.3L342.8,140.0L345.3,137.1L345.5,138.9L347.2,139.9L333.0,145.9L331.0,145.8L330.9,143.6L335.4,141.5L328.4,141.9L328.9,142.7L320.8,145.6L319.5,147.1L319.0,149.0L319.8,150.4L320.9,150.5L320.6,149.5L321.4,150.1L321.2,150.8L311.6,152.6L316.1,152.6L311.0,153.1L310.4,155.7L308.6,157.7L307.0,156.3L308.2,159.1L305.9,162.1L306.5,160.3L305.2,159.3L304.9,157.2L304.9,159.9L303.2,159.5L305.0,160.3L306.5,166.4L304.8,168.3L298.0,171.6L292.1,176.9L292.2,180.5L295.4,188.5L294.6,192.8L292.6,192.8L291.2,191.1L288.3,186.0L288.8,184.3L286.1,180.7L282.5,181.5L279.2,179.5L271.0,180.1L271.5,182.7L260.2,181.3L253.1,184.9L251.2,187.3L251.8,191.1L250.8,191.2L251.8,191.1L249.9,199.9L251.6,204.5L254.9,209.1L258.7,210.9L266.4,209.0L268.0,207.9L269.3,203.6L277.5,202.2L278.1,203.9L276.1,207.0L275.5,210.6L274.3,209.9L274.2,215.0L272.7,216.6L282.8,216.3L286.8,218.2L287.4,220.7L285.8,228.8L289.9,234.2L293.1,234.6L296.6,232.7L303.6,235.1L306.6,233.1L307.1,230.1L308.6,228.9L312.4,228.5L316.6,225.4L318.2,226.3L317.6,227.7L316.1,228.0L316.9,230.5L315.8,232.0L316.8,234.0L317.9,233.9L318.5,232.0L317.5,229.2L320.7,228.2L320.4,226.9L321.3,226.1L322.2,227.9L324.0,228.0L325.7,230.2L330.8,230.0L334.2,231.5L335.6,230.0L341.9,229.8L339.7,230.6L340.6,231.8L344.5,233.2L345.0,235.3L349.0,236.8L350.6,239.8L354.0,242.0L362.1,242.5L364.9,243.4L368.0,246.6L368.9,246.5L370.9,252.4L372.3,252.8L372.4,254.5L370.4,256.7L375.7,257.8L375.8,260.4L377.8,258.7L385.2,261.2L386.5,262.7L386.1,264.1L389.0,263.3L394.0,264.7L397.8,264.6L404.9,269.5L410.0,271.2L411.2,276.0L410.2,280.2L401.2,290.6L399.7,302.9L395.4,313.3L393.3,314.4L392.7,315.9L385.9,316.9L378.2,320.8L376.1,323.4L375.1,330.5L362.5,345.1L359.6,346.5L356.3,346.3L352.2,345.3L350.7,343.9L350.5,345.2L353.8,347.4L353.4,349.2L355.0,350.3L354.9,351.5L352.4,354.8L348.6,356.2L340.7,356.4L341.2,361.2L339.6,362.1L337.0,362.4L334.6,361.5L333.6,362.2L333.9,364.7L335.7,365.5L337.1,364.7L337.8,366.0L333.4,368.4L332.4,372.3L330.0,372.3L328.0,373.6L327.3,375.5L332.3,377.9L331.4,380.2L328.4,381.7L326.7,384.7L323.3,386.9L324.1,389.5L325.8,391.0L322.5,390.9L319.0,392.4L318.5,394.8L314.6,394.0L308.5,390.8L306.8,381.6L307.9,379.2L310.6,377.2L306.7,376.4L309.1,374.2L310.0,369.9L312.8,370.8L314.2,365.5L312.5,364.9L311.7,368.0L310.0,367.7L311.7,359.3L312.9,357.5L311.9,352.2L313.0,352.1L317.4,340.1L317.3,331.0L318.8,327.9L320.7,307.7L320.2,304.1L317.6,302.6L317.4,301.6L305.8,294.7L305.1,291.8L296.2,275.6L292.4,272.9L293.2,271.8L291.9,269.3L296.1,264.0L295.6,262.9L294.6,264.1L293.1,263.0L293.2,259.9L294.1,259.5L295.3,255.3L298.5,253.7L299.6,250.5L300.8,250.3L302.9,247.4L302.0,246.8L302.0,240.1ZM171.8,128.1L178.6,128.7L184.4,133.3L178.9,132.4L175.4,129.9L172.7,129.5L171.8,128.1ZM159.7,118.8L163.3,118.9L162.5,121.8L164.8,123.9L160.0,120.7L159.7,118.8ZM110.1,109.3L111.2,110.0L109.0,111.3L106.4,112.2L105.1,111.6L104.7,110.4L110.1,109.3ZM287.6,93.4L281.4,96.1L280.6,94.6L277.1,94.8L279.3,93.6L280.5,89.2L295.3,94.4L293.0,95.2L289.0,94.6L287.6,93.4ZM58.0,93.0L50.3,91.3L49.7,90.2L44.2,90.1L42.8,89.2L43.4,88.3L40.3,88.9L41.4,90.1L40.0,91.2L40.0,81.0L53.0,85.5L52.7,87.1L54.5,87.7L53.9,85.8L60.8,86.2L65.8,88.6L59.1,90.0L59.0,92.5L58.0,93.0ZM249.0,78.0L255.6,80.6L254.0,81.5L245.0,79.9L249.0,78.0ZM238.2,81.5L229.2,80.4L210.4,82.1L209.0,80.9L203.3,80.5L200.1,78.4L212.7,77.4L198.7,77.0L197.3,76.0L203.3,75.0L194.9,74.4L198.8,71.4L205.6,69.9L208.2,70.4L207.0,71.6L212.7,70.8L216.2,72.1L219.1,70.8L221.4,71.6L223.5,74.1L224.8,73.1L223.0,70.4L227.8,70.5L230.6,71.5L233.0,75.8L241.9,78.3L241.7,79.4L237.5,79.6L239.1,80.6L238.2,81.5ZM248.6,75.1L238.1,71.9L238.1,71.1L243.3,71.4L240.5,69.7L243.5,68.5L251.1,68.7L251.8,69.5L249.4,70.7L253.3,71.8L252.8,74.1L248.6,75.1ZM184.1,74.9L178.2,73.6L183.3,68.9L180.8,67.4L199.6,67.6L204.8,69.5L195.3,71.9L192.2,73.7L192.2,74.8L185.4,76.0L184.1,74.9ZM258.5,67.8L263.8,67.9L268.7,68.5L259.1,73.2L256.2,73.1L254.6,69.5L258.5,67.8ZM259.4,66.6L252.6,65.7L253.9,64.6L257.6,63.9L260.8,65.6L259.4,66.6ZM214.3,65.1L199.2,65.0L205.1,61.8L221.3,64.3L217.6,61.9L220.0,61.0L222.6,61.3L224.5,63.4L229.4,63.1L229.9,64.3L228.3,65.5L213.2,67.0L209.3,67.1L209.0,66.3L214.3,65.1ZM252.8,60.0L265.9,61.0L268.1,61.9L267.5,62.8L272.1,64.0L292.7,63.7L296.0,65.8L290.6,67.0L270.6,66.8L263.8,66.0L262.6,63.3L260.0,62.2L251.8,61.1L252.8,60.0ZM237.9,62.1L248.3,61.2L250.2,62.3L250.3,63.7L249.1,65.6L244.9,65.8L242.2,65.4L242.2,63.9L238.1,64.1L237.9,62.1ZM193.6,62.9L186.0,62.7L195.6,59.1L203.0,58.8L202.7,60.8L200.7,61.6L193.6,62.9ZM209.9,58.6L211.9,57.8L219.3,57.9L213.6,59.4L209.9,58.6ZM255.1,57.7L249.2,57.7L247.9,55.7L255.8,56.8L255.1,57.7ZM230.6,55.5L230.4,54.6L242.3,55.8L245.3,58.1L231.2,56.9L233.7,56.2L230.6,55.5ZM280.7,54.5L272.5,57.2L262.6,57.0L259.9,56.0L259.9,55.0L262.0,54.4L257.3,54.4L252.9,52.4L256.4,50.5L259.0,50.3L257.9,49.7L263.8,49.6L267.1,50.9L275.6,52.0L277.6,53.6L280.7,54.5ZM309.2,392.3L318.3,395.4L320.4,392.5L322.8,391.4L324.6,391.7L326.9,394.8L333.8,397.0L332.6,398.3L330.2,398.4L328.9,397.5L325.8,399.3L323.1,399.1L315.3,396.5L309.2,392.3ZM346.7,388.2L348.8,388.8L350.4,387.8L352.4,389.0L348.2,390.6L347.0,389.7L344.9,390.9L343.6,389.7L346.7,388.2ZM477.0,244.9L468.2,238.7L462.1,229.4L457.5,226.1L457.3,222.5L455.0,219.6L457.9,216.0L458.7,210.9L458.4,205.9L456.4,203.6L456.6,201.3L458.4,199.3L459.2,196.6L461.4,194.6L463.1,190.1L467.8,185.6L470.1,185.3L475.6,180.7L474.9,177.5L476.2,174.0L482.3,170.1L484.8,165.8L494.5,167.3L503.7,163.7L513.6,163.4L516.0,162.4L521.5,162.8L524.3,161.8L526.1,162.1L526.0,163.4L528.4,162.9L527.1,164.2L528.0,166.0L527.6,168.2L525.9,169.5L526.4,170.9L529.4,172.5L539.0,174.8L540.2,177.0L548.8,179.9L551.2,178.0L550.7,176.1L551.5,174.8L555.1,173.3L558.5,173.8L559.4,175.0L564.3,176.5L567.7,176.5L573.9,178.3L579.2,176.6L581.0,176.9L581.7,178.2L582.3,177.3L586.3,178.1L588.3,176.6L592.0,168.7L592.4,165.7L591.4,164.5L592.4,163.6L588.7,163.2L587.0,164.7L583.1,164.9L581.0,163.6L578.3,163.5L577.7,164.6L575.9,164.9L573.4,163.5L570.6,163.5L567.3,159.6L568.5,157.6L566.9,156.4L569.7,153.9L573.7,153.8L574.7,151.9L579.6,152.2L585.6,149.8L589.9,149.8L598.0,152.6L603.2,152.4L606.2,151.1L605.9,148.2L593.7,141.6L595.6,141.2L597.7,139.1L596.3,138.0L600.0,136.4L589.3,139.0L589.5,140.6L593.4,141.0L592.9,141.9L586.6,143.9L585.2,143.3L585.7,142.1L582.9,141.4L585.8,140.0L585.1,139.5L581.1,138.8L580.9,137.9L578.6,138.2L575.7,142.1L573.7,142.4L573.0,145.5L570.7,148.4L571.9,150.9L574.1,151.7L573.6,152.3L570.6,152.4L567.4,154.6L566.6,152.9L563.7,152.6L560.6,153.2L562.4,154.7L561.1,155.1L558.3,153.8L557.8,154.3L559.7,157.1L558.7,157.6L561.4,159.5L561.4,161.0L559.1,160.3L559.8,161.6L558.2,161.9L559.2,164.1L557.5,164.2L555.4,163.1L554.0,159.3L549.6,154.4L549.9,150.6L540.9,146.0L538.8,144.2L538.1,142.0L536.4,141.6L535.7,142.7L534.9,141.9L535.6,140.7L533.6,140.3L531.5,141.2L532.2,144.5L538.7,150.0L540.7,150.0L541.3,150.6L540.6,151.1L547.2,154.6L546.7,155.5L543.1,153.9L542.0,155.5L543.9,156.5L543.6,157.8L542.5,158.0L541.1,160.1L540.1,160.3L541.2,157.6L539.4,154.9L530.9,150.6L526.9,147.5L526.1,145.0L522.7,143.8L516.7,147.0L511.6,146.3L507.9,147.1L507.8,150.2L505.3,151.9L502.1,152.4L499.3,156.8L500.3,158.2L498.3,161.0L496.3,161.5L494.5,163.5L488.8,163.5L486.3,165.4L485.0,165.1L483.3,162.8L477.3,163.0L477.4,159.4L475.7,158.2L477.6,153.1L477.0,148.4L476.0,147.3L479.6,145.4L495.1,146.3L496.5,144.7L496.9,139.6L492.4,135.7L488.5,134.7L488.3,132.8L495.9,132.9L495.1,130.0L497.5,131.1L503.4,129.1L504.2,127.0L509.8,125.3L512.0,121.5L518.1,120.0L520.8,120.4L522.5,119.2L520.8,115.3L520.7,112.7L521.8,111.3L527.0,109.7L526.2,111.8L527.9,112.9L524.7,115.5L525.4,117.7L528.0,118.3L528.0,119.2L532.0,118.0L536.1,119.8L545.0,117.0L550.2,118.1L550.8,117.0L554.4,116.2L553.9,112.1L555.2,110.5L557.6,109.6L559.6,111.5L561.6,111.5L562.4,108.0L559.9,107.4L559.6,106.0L566.1,104.9L571.5,105.2L574.4,103.8L571.7,102.6L558.4,104.3L554.5,102.0L555.1,99.5L553.8,97.2L555.0,95.7L564.9,90.8L564.6,89.7L561.1,88.5L556.7,89.3L554.2,91.0L554.6,92.6L545.6,96.9L543.7,100.5L548.0,103.7L545.7,106.6L543.0,107.2L540.6,113.8L537.5,113.6L536.0,115.6L533.1,115.7L528.2,106.8L526.5,105.2L521.4,108.2L518.0,108.8L514.5,107.5L512.8,98.9L526.9,92.4L537.7,83.9L549.0,78.8L558.8,77.8L562.7,75.7L572.0,75.3L580.0,77.2L576.7,77.9L579.5,79.5L582.1,78.6L586.3,80.1L593.3,80.7L604.9,84.8L605.1,86.5L598.1,88.6L584.8,86.9L589.0,88.8L589.3,92.6L594.6,94.1L594.9,92.8L593.4,91.7L595.0,90.7L601.2,92.3L603.3,91.7L601.6,89.8L607.6,87.3L612.3,88.4L613.8,86.6L611.7,85.1L612.9,83.6L611.0,82.0L618.2,82.8L619.7,84.2L616.4,84.6L616.4,86.0L618.4,86.8L622.4,86.3L623.0,84.7L637.3,81.3L639.2,81.4L636.7,82.9L639.9,83.2L650.3,81.2L653.2,82.7L656.1,81.0L653.4,79.6L654.7,78.7L662.3,79.5L675.1,83.2L676.8,81.9L674.1,80.0L671.0,79.7L671.9,78.5L670.4,75.7L678.7,70.6L685.5,71.2L686.0,72.7L683.6,74.7L686.0,77.3L685.4,80.8L688.3,82.4L682.2,87.7L685.1,88.1L688.9,86.5L691.8,84.1L690.3,82.6L691.5,80.9L688.7,80.7L688.1,79.3L690.1,76.7L686.8,74.6L691.4,72.9L690.8,71.1L692.1,71.0L693.4,72.5L692.4,74.9L695.1,75.4L694.0,73.5L698.3,72.5L703.6,72.4L708.3,73.9L706.0,71.7L705.8,69.0L721.9,68.3L719.8,66.9L722.8,65.3L738.3,62.9L747.1,63.2L752.8,61.9L757.5,61.9L760.6,59.7L766.7,58.7L771.1,59.5L767.6,60.1L773.4,60.5L774.1,61.8L783.9,61.2L791.7,63.4L791.0,64.7L779.6,67.7L788.8,68.2L790.1,69.8L795.3,68.7L803.5,69.2L804.2,70.4L814.8,70.7L815.0,68.8L824.5,69.2L828.6,70.6L829.8,72.2L828.3,73.3L835.5,76.3L838.0,73.6L842.1,74.8L846.4,74.1L857.4,74.5L855.6,72.2L859.0,71.1L882.1,72.7L884.2,74.2L890.9,76.2L906.3,76.1L908.5,77.2L908.1,79.0L911.3,79.8L928.9,79.4L933.4,81.7L936.5,80.9L934.5,79.2L935.6,78.1L949.1,78.6L960.0,81.0L960.0,91.2L956.7,92.3L953.4,92.1L958.4,96.3L958.0,98.0L953.3,97.4L943.8,99.7L935.3,104.2L931.6,102.4L925.0,104.4L923.8,103.5L921.4,104.6L917.9,104.2L914.0,108.4L914.1,109.4L917.0,110.0L916.7,113.7L914.3,113.8L913.2,115.9L914.3,117.0L909.8,118.3L908.9,121.3L905.1,121.9L904.4,124.5L900.7,126.9L897.2,115.7L898.4,112.1L900.6,110.6L900.7,109.4L904.7,108.9L918.3,101.0L920.3,97.4L917.2,97.6L915.7,99.7L909.2,102.5L907.1,99.4L900.5,100.2L894.1,104.5L896.2,106.1L886.6,107.0L886.8,105.2L882.8,104.8L879.6,106.0L863.4,106.3L845.3,117.4L849.3,117.7L850.6,119.3L853.1,119.8L854.7,118.6L857.5,118.7L861.2,121.5L861.3,123.7L859.3,126.3L857.9,133.4L853.2,138.9L844.7,146.3L841.3,147.8L838.0,146.6L832.1,150.0L831.5,152.7L825.9,155.6L825.5,157.0L828.0,158.5L830.8,163.2L830.9,166.2L829.9,167.6L823.2,169.3L823.4,166.0L822.3,163.4L824.2,162.9L822.4,160.8L820.1,161.0L818.7,159.8L820.0,158.4L820.3,156.1L817.6,155.2L809.4,157.8L810.7,156.6L810.2,155.6L812.2,153.9L810.9,152.6L804.2,156.9L801.7,157.0L800.4,158.2L801.7,160.0L803.8,160.4L803.9,161.5L805.9,162.3L808.8,160.4L812.7,161.5L813.1,162.8L809.5,163.6L804.5,168.0L807.2,169.4L811.5,176.2L811.5,178.1L809.9,178.8L812.0,181.0L811.0,185.1L809.5,185.3L803.2,194.5L796.2,199.0L791.7,200.4L790.8,199.6L789.4,200.9L783.1,202.5L782.2,205.2L780.8,205.4L780.2,203.5L780.8,202.5L777.3,201.7L772.7,204.3L770.6,206.7L770.0,208.5L778.2,218.2L779.4,222.9L779.1,227.4L768.7,235.2L767.8,233.6L768.5,231.9L764.5,230.1L762.2,226.1L757.7,225.0L758.1,222.9L755.8,223.0L753.6,233.6L755.2,233.7L756.7,238.2L763.1,243.1L764.2,244.8L764.5,250.1L766.4,253.9L764.6,254.1L759.1,250.2L756.1,243.6L755.8,240.7L751.7,235.8L751.3,237.3L750.8,235.9L752.4,228.0L748.3,214.0L743.7,217.1L740.7,216.2L741.6,213.1L741.1,210.7L739.0,207.7L739.4,206.8L737.9,206.5L736.1,204.4L733.6,199.0L731.3,198.9L730.7,201.4L727.5,200.9L727.2,201.8L722.3,202.3L722.4,204.2L721.1,205.7L717.4,207.4L710.0,213.7L710.0,214.9L705.3,216.6L704.1,230.8L702.8,230.9L701.6,232.8L702.4,233.7L700.0,234.4L698.2,236.9L695.7,234.5L691.3,224.7L690.2,219.9L687.9,216.4L685.6,202.6L681.9,204.2L680.1,203.9L676.8,200.8L678.0,199.8L677.2,198.8L672.4,196.0L669.6,192.2L657.2,193.1L646.7,191.4L645.6,188.3L644.4,187.9L639.8,189.5L631.7,186.0L628.1,180.2L625.1,179.7L624.1,180.7L622.6,180.6L624.7,186.5L628.2,189.0L628.1,190.9L629.8,194.0L630.4,190.8L631.8,191.3L631.3,194.3L632.4,195.8L638.0,195.6L644.0,189.8L644.1,193.5L645.3,195.3L650.1,197.0L652.8,200.2L649.5,205.0L647.8,205.5L647.4,208.8L644.7,209.8L643.8,211.5L641.2,212.2L641.3,213.2L633.9,215.4L633.3,217.4L626.7,219.6L624.4,221.4L616.6,223.3L615.0,224.8L611.1,224.9L608.9,218.3L609.0,214.4L604.6,207.4L600.0,202.8L599.8,199.5L598.4,196.7L595.8,195.2L589.8,185.5L588.5,185.5L589.3,182.2L589.2,181.8L589.0,181.2L586.7,186.6L582.9,180.9L587.2,190.4L591.2,196.1L590.8,198.2L594.2,201.0L595.8,209.7L598.2,211.2L600.3,216.5L610.7,225.6L610.6,226.6L609.2,227.2L612.7,230.5L614.0,230.5L630.6,226.5L630.4,230.0L626.4,239.8L622.0,246.4L602.9,263.8L600.2,269.2L599.0,272.3L599.2,273.8L600.8,274.7L600.1,278.9L603.4,284.7L604.2,294.8L602.5,298.4L595.6,302.2L588.9,307.8L588.7,309.6L590.9,313.7L590.6,318.9L583.2,323.0L584.1,324.2L583.0,329.5L576.8,336.8L572.1,341.0L565.9,344.0L557.7,343.8L550.1,346.2L547.0,344.5L545.8,340.6L546.6,340.1L546.6,338.1L538.9,326.5L536.4,313.7L530.1,303.4L529.7,299.8L531.9,291.8L534.8,288.0L535.0,284.6L532.9,280.6L533.8,279.1L530.4,270.1L522.5,260.1L525.0,249.4L521.7,245.0L515.1,246.3L511.1,241.2L504.8,241.5L495.0,245.2L488.1,244.0L480.8,246.1L477.0,244.9ZM325.4,209.7L324.5,210.7L319.4,210.1L317.5,212.2L315.0,210.7L311.1,211.1L309.7,210.3L309.9,209.5L315.1,209.5L314.0,207.4L312.4,207.0L313.0,206.3L319.0,206.4L325.4,209.7ZM306.8,203.5L306.6,204.2L308.5,204.3L310.4,205.4L310.1,206.0L301.3,206.5L303.0,205.1L300.3,204.2L298.8,202.0L290.0,200.0L291.0,199.4L288.5,199.2L285.2,201.2L282.8,201.3L287.2,198.5L294.0,198.2L297.4,200.0L299.8,199.7L304.4,203.0L306.8,203.5ZM362.5,133.2L364.3,132.8L365.5,135.7L364.4,138.0L361.5,137.6L362.1,135.5L361.4,135.2L358.4,137.4L356.9,137.3L358.7,136.1L356.2,135.5L348.5,135.6L348.2,134.8L349.7,133.9L348.6,133.2L350.8,131.7L353.4,127.6L357.2,125.3L358.4,125.4L354.9,129.9L356.5,129.1L358.2,129.6L357.3,130.5L363.3,131.4L362.5,133.2ZM485.5,117.8L484.2,119.6L484.6,121.4L482.7,123.7L478.1,125.2L474.5,124.8L476.6,122.1L475.2,119.5L480.6,116.3L482.8,116.2L485.5,117.8ZM438.8,91.4L443.3,90.9L443.2,90.1L437.8,89.5L439.6,87.9L443.4,87.5L447.4,89.2L451.3,87.8L454.5,88.6L458.7,87.2L462.9,87.4L462.3,89.0L465.2,90.8L461.9,92.7L452.3,95.0L441.8,93.8L444.3,92.6L438.8,91.4ZM307.8,84.9L303.3,85.7L302.6,84.5L303.7,83.1L308.0,83.4L307.8,84.9ZM328.9,80.4L324.2,81.6L334.2,83.8L337.9,86.2L341.9,86.4L341.1,88.1L336.7,91.1L329.5,87.6L326.2,87.9L325.9,89.3L333.1,92.7L334.7,95.2L333.9,97.1L324.2,94.3L330.9,99.0L318.5,96.5L315.4,95.2L316.3,94.5L308.8,91.9L308.8,92.7L301.4,93.1L299.2,92.2L300.9,90.3L311.0,89.9L310.1,89.0L311.0,87.8L314.3,85.3L312.6,83.3L303.6,81.2L305.2,80.5L298.2,77.9L292.2,79.0L273.4,77.3L271.2,76.4L273.9,75.2L270.3,75.2L269.5,72.6L271.4,70.3L274.1,69.3L280.7,68.6L278.8,70.3L280.8,71.9L283.2,69.8L289.6,68.7L294.0,71.4L293.6,73.1L301.1,71.3L310.3,73.8L310.6,74.9L315.4,74.4L318.0,76.0L324.2,77.0L328.9,80.4ZM418.5,47.2L436.5,48.2L441.5,47.4L443.6,48.3L440.8,49.8L459.7,47.9L467.4,48.4L468.8,49.5L456.9,51.9L448.8,52.3L454.7,52.4L449.6,56.0L449.7,58.8L452.8,60.5L444.6,61.4L449.3,62.7L449.9,64.9L447.2,65.2L450.5,67.4L444.8,67.5L447.8,68.6L446.9,69.5L439.8,69.9L443.0,71.6L443.0,72.8L438.0,71.7L436.6,72.4L443.4,74.6L444.4,76.6L439.9,77.1L434.7,74.7L435.6,76.4L432.6,77.8L442.9,78.0L429.1,82.2L418.8,83.1L412.6,86.8L398.3,89.9L396.1,91.5L394.7,95.0L390.6,97.0L391.6,99.0L389.1,103.6L385.5,103.8L381.8,101.7L376.7,101.7L368.0,94.6L366.4,90.7L362.9,88.3L363.8,86.4L362.1,85.5L364.6,82.5L368.5,81.6L370.0,78.5L363.4,80.2L360.3,79.3L360.1,77.6L361.1,76.2L368.7,76.9L362.0,74.4L357.3,74.1L360.2,71.7L353.5,66.3L350.3,65.3L350.3,64.2L343.4,62.7L324.9,62.8L317.5,60.4L329.4,59.5L312.7,57.8L313.0,56.8L332.1,54.3L333.1,53.4L326.2,52.5L341.0,49.4L339.9,48.3L345.9,47.6L361.7,47.2L364.4,48.0L371.2,46.5L386.2,48.5L380.1,47.2L380.5,46.1L389.1,44.5L410.3,43.5L430.7,43.8L446.7,45.8L442.0,46.8L418.5,47.2ZM296.9,71.3L293.3,69.8L293.4,68.9L300.5,69.0L305.1,71.1L296.9,71.3ZM289.4,45.5L313.9,44.5L341.9,46.1L341.8,46.7L327.1,48.9L332.7,48.9L322.5,51.2L318.1,53.3L303.5,54.5L307.0,54.8L305.2,55.3L307.3,56.5L296.2,59.9L301.0,61.0L294.1,62.5L271.3,61.8L271.0,60.6L275.7,60.0L274.4,58.1L282.8,59.1L279.4,57.4L275.2,56.9L282.5,54.5L278.9,53.5L277.8,52.1L286.8,52.5L290.8,51.6L276.1,51.5L271.6,50.6L265.9,47.9L281.5,46.0L287.4,46.8L289.4,45.5ZM532.1,159.8L539.7,159.5L538.6,163.6L531.8,161.1L532.1,159.8ZM520.9,152.6L523.5,151.9L525.1,153.7L524.7,157.1L522.5,157.8L521.5,157.1L520.9,152.6ZM485.7,115.9L485.6,113.4L484.3,112.1L485.2,109.5L487.2,107.4L492.3,107.4L489.6,110.1L495.0,109.8L494.3,111.9L492.0,114.2L494.7,114.3L497.2,117.6L498.9,118.0L501.2,122.0L504.3,122.4L504.0,124.1L502.7,124.8L503.7,126.1L501.4,127.5L492.4,127.7L490.8,128.9L485.2,129.0L491.3,125.8L487.3,125.4L486.5,124.4L489.2,123.6L487.8,122.2L488.3,120.5L492.1,120.7L492.5,119.3L490.7,117.7L487.6,117.2L487.0,116.5L487.9,115.4L487.1,114.7L485.7,115.9ZM535.2,59.5L537.5,58.6L528.7,55.7L526.7,53.7L533.7,52.8L535.1,53.6L538.7,53.6L539.7,52.7L543.4,52.6L555.1,55.4L548.6,56.5L547.2,58.3L545.0,58.8L543.7,60.9L540.7,61.0L535.2,59.5ZM560.6,166.0L567.2,167.0L566.9,167.8L563.2,168.0L560.1,167.1L560.6,166.0ZM553.0,58.7L554.7,58.1L553.2,57.2L558.5,56.7L563.2,58.3L557.5,59.3L553.0,58.7ZM558.6,51.1L570.0,52.6L566.3,54.0L558.8,54.3L551.3,53.9L544.4,52.0L558.6,51.1ZM676.2,381.5L680.2,382.6L679.6,384.3L675.7,384.4L676.2,381.5ZM627.4,299.3L620.4,321.0L616.0,322.6L612.5,321.1L610.5,313.6L613.4,308.5L612.4,301.7L613.6,298.7L618.4,297.5L621.9,294.5L622.3,292.1L623.4,292.4L625.7,288.0L627.3,290.2L629.0,296.1L628.3,298.1L627.4,296.6L626.9,297.4L627.4,299.3ZM792.8,279.6L776.7,277.1L769.3,274.7L771.0,272.3L774.1,272.4L777.6,274.5L782.5,274.8L783.1,273.7L787.8,275.0L788.7,276.6L795.7,278.6L792.8,279.6ZM762.2,268.0L753.7,256.8L752.0,252.6L743.8,244.5L743.5,243.2L749.1,243.8L757.2,251.9L759.8,251.9L765.4,257.0L764.3,259.0L766.7,260.0L768.0,263.2L769.9,263.4L771.2,265.0L770.4,272.2L767.6,272.2L762.2,268.0ZM796.8,267.5L796.4,266.6L793.5,267.7L792.5,266.2L789.4,265.2L786.4,266.1L785.5,264.9L781.7,264.7L781.3,261.3L778.8,258.4L778.4,256.2L778.7,253.8L780.3,252.1L782.1,253.0L784.1,252.5L784.6,250.3L788.8,249.3L798.3,239.5L799.3,239.5L800.8,241.9L804.6,243.4L804.4,244.4L802.7,244.5L803.1,245.8L801.3,246.6L799.8,249.0L801.7,251.4L801.2,252.6L804.1,254.9L801.1,255.2L800.3,259.3L797.9,261.0L796.8,267.5ZM709.0,238.0L708.6,240.7L705.3,242.0L703.7,236.3L704.8,232.1L706.6,233.5L709.0,238.0ZM779.8,210.7L777.7,209.9L777.6,207.7L778.9,206.6L783.1,205.9L783.7,206.9L782.0,209.5L779.8,210.7ZM676.0,61.6L657.4,64.9L649.4,67.3L641.6,72.3L642.1,74.4L647.0,76.5L637.2,76.4L636.5,75.2L631.9,74.6L631.5,73.2L634.1,72.6L634.0,71.2L639.1,69.1L636.7,68.8L642.9,66.5L642.2,65.3L656.3,62.4L669.2,60.9L674.2,60.6L676.0,61.6ZM754.1,58.1L758.8,54.7L760.9,54.4L769.3,56.1L768.5,57.1L754.1,58.1ZM733.0,51.9L745.2,49.6L756.0,53.3L755.4,55.6L749.8,56.0L738.5,54.2L736.5,52.4L733.0,51.9ZM631.7,51.0L621.6,52.8L618.8,52.1L620.3,51.3L614.6,51.3L623.5,50.8L624.0,51.5L627.9,50.4L631.7,51.0ZM944.6,361.8L945.3,364.0L941.4,368.1L942.3,369.3L938.2,370.3L936.0,374.5L932.7,376.4L926.0,375.3L925.5,374.4L926.9,372.5L935.8,367.2L939.8,361.9L941.6,360.7L942.7,362.8L944.6,361.8ZM873.2,368.5L869.9,361.2L874.0,362.4L879.0,361.7L879.1,364.7L878.0,367.7L877.1,367.0L875.3,368.7L873.2,368.5ZM946.1,356.4L946.4,352.8L945.5,350.6L941.2,345.5L945.5,347.3L948.1,352.3L948.1,350.6L949.3,351.3L949.7,353.2L953.5,354.2L956.2,353.6L954.8,357.3L952.9,357.3L949.8,362.7L947.8,363.8L946.3,362.7L947.8,360.6L947.0,359.2L944.2,358.2L944.3,357.3L946.1,356.4ZM806.4,344.0L801.6,346.8L798.0,346.7L794.0,344.6L794.0,343.1L795.7,342.2L795.9,339.5L794.0,332.5L789.6,324.0L790.8,325.1L789.9,322.7L791.9,324.4L789.8,319.5L790.7,314.7L791.7,312.8L791.9,314.8L793.0,313.0L798.3,310.1L808.9,307.5L812.4,303.7L812.6,301.3L814.4,299.1L815.4,301.4L816.5,300.8L815.6,299.6L816.4,298.4L817.5,298.9L817.9,297.0L821.2,293.6L824.7,292.5L828.0,295.2L831.3,295.5L830.7,294.1L833.8,289.3L838.8,288.2L838.8,286.9L836.9,286.0L838.2,285.7L845.8,288.5L848.8,287.5L850.0,288.8L847.5,291.3L846.3,295.5L858.3,302.5L860.0,301.6L861.0,299.1L862.1,295.7L862.1,288.9L864.2,284.5L867.8,294.4L869.4,293.4L871.5,295.5L874.1,305.7L880.4,309.3L882.5,314.3L883.5,313.8L885.2,314.5L885.6,317.2L890.6,321.8L891.2,326.9L892.5,329.1L890.7,338.1L889.6,340.4L887.7,341.7L884.2,348.4L883.3,352.9L879.0,353.8L873.9,357.0L870.2,355.4L870.6,354.1L867.0,356.4L859.4,354.4L857.8,352.8L856.7,349.6L853.0,348.2L853.8,347.0L853.2,345.1L851.9,346.9L849.7,347.3L852.4,343.2L852.2,341.3L848.5,344.4L847.5,346.4L845.5,345.3L845.6,344.0L842.7,341.2L843.1,340.6L835.6,337.7L822.4,339.6L817.5,341.5L816.0,343.8L806.4,344.0ZM919.2,308.6L921.7,309.5L927.1,313.9L926.1,314.5L922.9,312.6L919.2,308.6ZM821.9,278.8L825.4,278.7L819.7,281.2L818.0,283.1L815.5,283.4L816.8,281.0L821.9,278.8ZM876.2,276.1L880.1,280.5L881.6,280.4L881.5,281.5L883.4,282.0L882.7,282.5L885.4,283.5L885.1,284.3L878.0,283.1L873.2,277.8L869.9,276.7L866.2,278.3L866.5,280.2L864.5,281.1L860.4,280.5L858.1,278.4L855.5,277.9L851.7,278.7L852.8,276.6L854.4,275.9L852.5,271.0L845.4,268.6L841.6,266.3L839.8,267.7L839.3,265.7L837.3,264.4L841.9,263.6L841.7,262.9L837.9,262.9L836.9,261.4L834.6,260.9L833.5,259.6L838.3,258.2L842.4,259.2L843.5,264.3L846.2,265.8L848.3,263.1L851.2,261.6L853.5,261.6L869.5,267.1L872.7,269.7L873.1,271.2L877.3,272.8L877.9,274.1L875.6,274.4L876.2,276.1ZM883.3,270.1L883.9,271.4L885.4,271.2L887.5,269.4L887.3,267.9L889.3,268.2L888.4,271.2L883.9,273.4L879.0,271.9L879.2,271.1L882.9,271.3L883.3,270.1ZM833.4,265.1L834.4,267.1L832.2,266.0L826.9,265.9L827.5,264.5L833.4,265.1ZM806.8,258.6L809.1,260.8L810.4,259.7L815.2,258.8L815.0,260.0L813.9,259.6L810.5,262.1L812.9,265.4L812.5,266.2L814.8,269.2L814.7,270.9L813.4,271.6L812.4,270.7L813.6,268.6L811.1,269.6L810.5,268.9L810.8,267.9L809.0,266.4L809.2,263.9L807.4,264.7L807.8,271.3L806.1,271.7L805.0,271.0L805.4,266.2L804.3,266.1L803.5,264.4L806.8,255.8L808.9,253.9L814.1,255.0L817.1,254.9L819.6,253.0L820.1,253.6L818.0,256.1L816.1,256.6L807.1,256.6L806.8,258.6ZM825.6,254.6L826.9,251.7L827.1,253.1L828.6,253.3L828.7,256.6L827.4,256.3L827.0,257.9L828.1,259.2L827.4,259.5L826.3,257.9L825.6,254.6ZM817.5,238.4L815.9,237.2L812.0,239.6L811.6,238.8L812.6,236.7L815.6,235.0L816.5,236.2L818.4,235.5L818.8,234.3L820.6,234.3L820.5,232.3L822.6,233.5L823.4,238.8L822.5,241.2L821.6,238.6L820.4,239.9L821.2,241.8L820.5,243.0L817.5,241.5L816.7,239.6L817.5,238.4ZM814.3,234.2L812.7,232.4L814.2,229.4L815.6,229.3L815.2,231.0L817.1,228.5L816.8,231.0L814.3,234.2ZM819.2,228.0L819.1,227.1L817.6,225.1L820.0,225.2L821.4,229.0L819.5,228.3L820.2,230.7L818.9,231.3L817.7,227.8L819.2,228.0ZM816.8,222.0L817.1,225.2L814.2,222.6L813.5,223.5L811.9,222.0L808.3,221.8L809.2,220.1L808.4,219.5L808.1,220.4L806.8,219.0L806.4,215.4L807.4,216.2L808.5,209.9L812.6,210.6L813.1,213.5L812.4,215.7L810.9,216.5L811.1,220.6L813.6,220.6L816.8,222.0ZM811.7,193.3L808.6,201.1L806.9,197.0L810.5,192.6L811.7,193.3ZM838.3,172.9L839.7,170.2L841.1,170.5L842.2,169.4L844.1,170.0L844.4,170.8L843.0,172.4L841.9,171.6L839.9,173.6L838.3,172.9ZM845.2,168.8L834.7,170.6L837.3,172.5L835.6,176.8L834.0,177.9L832.7,176.9L833.4,174.6L830.7,172.1L833.1,171.3L838.9,166.7L846.7,166.4L849.4,161.9L851.1,163.1L856.3,159.6L857.9,156.4L857.5,153.6L858.6,151.9L861.3,151.5L862.6,157.1L860.2,159.7L859.8,165.6L858.4,167.4L855.2,168.6L850.7,168.8L847.0,171.7L845.3,170.7L845.2,168.8ZM858.6,146.5L861.3,146.3L862.8,140.8L867.8,144.3L869.6,144.9L871.4,143.8L871.9,146.7L868.2,147.4L865.9,149.9L861.9,148.2L860.5,151.0L857.7,151.0L857.3,148.4L858.6,146.5ZM864.8,137.8L863.1,139.8L863.3,127.0L861.9,124.5L862.1,121.0L864.4,119.8L863.4,118.6L864.6,118.3L866.0,125.0L869.7,132.1L865.9,131.2L864.3,134.9L866.8,137.5L866.7,139.3L864.8,137.8ZM863.0,68.5L867.0,70.1L857.4,69.7L859.9,68.7L863.0,68.5ZM873.4,65.1L874.0,64.3L885.2,65.3L882.2,66.4L873.4,65.1ZM870.8,64.1L868.8,66.0L855.1,66.5L850.0,64.9L851.4,63.1L854.8,62.7L870.8,64.1Z";

type MapPoint = { x: number; y: number; anchorX: number; anchorY: number; label: string; dx: number; dy: number };
function cityPoint(longitude: number, latitude: number, dx: number, dy: number, label: string): MapPoint {
  const anchorX = (40 + (longitude + 180) * 920 / 360) / 10;
  const anchorY = (40 + (85 - latitude) * 920 / 360) / 5.4;
  return { x: anchorX, y: anchorY, anchorX, anchorY, dx, dy, label };
}
export const WORLD_MAP_POINTS: Record<string, MapPoint> = {
  "chennai-headquarters": cityPoint(80.27, 13.08, 31, -18, "Chennai HQ"),
  "chennai-production-unit": cityPoint(80.27, 13.08, 17, 39, "Production"),
  bangalore: cityPoint(77.59, 12.97, -35, 24, "Bangalore"),
  "germany-office": cityPoint(11.00, 49.59, 24, -18, "Erlangen"),
  "netherlands-office": cityPoint(5.41, 51.42, -28, -15, "Veldhoven"),
  "usa-office": cityPoint(-121.54, 37.78, 0, -8, "California"),
};

type OfficeMapProps = {
  prefix: string;
  globeImageSrc: string;
  mode: "world" | "image";
  imagePins?: Partial<Record<string, GlobePinPosition>> | undefined;
  showOfficeLinks: boolean;
};
type OfficeMapState = { activeId: string | null; locked: boolean; stageWidth: number };

class OfficeMap extends Component<OfficeMapProps, OfficeMapState> {
  state: OfficeMapState = { activeId: null, locked: false, stageWidth: 600 };
  private element: HTMLDivElement | null = null;
  private stageElement: HTMLDivElement | null = null;
  private resizeObserver?: ResizeObserver;
  private setStage = (node: HTMLDivElement | null) => { this.stageElement = node; };
  private measureStage = () => {
    const width = this.stageElement?.getBoundingClientRect().width ?? 0;
    if (width > 0 && Math.abs(width - this.state.stageWidth) > .5) this.setState({ stageWidth: width });
  };
  private leaveTimer: ReturnType<typeof setTimeout> | undefined;
  private ignoreNextFocus = false;
  private setElement = (node: HTMLDivElement | null) => { this.element = node; };
  componentDidMount() {
    document.addEventListener("pointerdown", this.onOutsidePointer);
    document.addEventListener("keydown", this.onGlobalKeyDown);
    this.measureStage();
    if ("ResizeObserver" in window && this.stageElement) {
      this.resizeObserver = new ResizeObserver(this.measureStage);
      this.resizeObserver.observe(this.stageElement);
    } else window.addEventListener("resize", this.measureStage);
  }
  componentWillUnmount() {
    document.removeEventListener("pointerdown", this.onOutsidePointer);
    document.removeEventListener("keydown", this.onGlobalKeyDown);
    this.resizeObserver?.disconnect();
    window.removeEventListener("resize", this.measureStage);
    this.clearTimer();
  }
  private clearTimer = () => { if (this.leaveTimer !== undefined) clearTimeout(this.leaveTimer); };
  private onOutsidePointer = (event: globalThis.PointerEvent) => {
    if (event.target instanceof Node && !this.element?.contains(event.target)) {
      this.clearTimer();
      if (this.state.activeId) this.setState({ activeId: null, locked: false });
    }
  };
  private previewOffice = (id: string) => {
    this.clearTimer();
    this.setState({ activeId: id, locked: false });
  };
  private focusOffice = (id: string) => {
    if (this.ignoreNextFocus) { this.ignoreNextFocus = false; return; }
    this.clearTimer();
    this.setState({ activeId: id, locked: false });
  };
  private chooseOffice = (id: string, fromKeyboard: boolean) => {
    this.clearTimer();
    const closes = this.state.locked && this.state.activeId === id;
    this.setState({ activeId: closes ? null : id, locked: !closes }, () => {
      if (!closes && fromKeyboard) this.element?.querySelector<HTMLElement>("[data-location-popup]")?.focus();
    });
  };
  private scheduleClose = () => {
    this.clearTimer();
    if (this.state.locked || this.element?.contains(document.activeElement)) return;
    this.leaveTimer = setTimeout(() => this.setState({ activeId: null }), 180);
  };
  private closePopup = (restoreFocus = true) => {
    this.clearTimer();
    const id = this.state.activeId;
    this.setState({ activeId: null, locked: false }, () => {
      if (!restoreFocus || !id) return;
      const pin = this.element?.querySelector<HTMLButtonElement>(`[data-office-id="${id}"]`);
      if (pin && document.activeElement !== pin) {
        this.ignoreNextFocus = true;
        pin.focus({ preventScroll: true });
      }
    });
  };
  private onGlobalKeyDown = (event: globalThis.KeyboardEvent) => {
    if (event.key === "Escape" && !event.defaultPrevented && this.state.activeId) {
      event.preventDefault();
      this.closePopup(Boolean(this.element?.contains(document.activeElement)));
    }
  };
  private onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape" && this.state.activeId) {
      event.preventDefault(); event.stopPropagation(); this.closePopup();
    }
  };
  private onBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      this.clearTimer(); this.setState({ activeId: null, locked: false });
    }
  };
  render() {
    const { prefix, mode, imagePins, globeImageSrc, showOfficeLinks } = this.props;
    // Uncalibrated image pins are never silently guessed. World view is the default.
    const imageMode = mode === "image" && offices.every((office) => {
      const pin = imagePins?.[office.id];
      return pin && Number.isFinite(pin.x) && Number.isFinite(pin.y);
    });
    const points = offices.map((office) => {
      const city = WORLD_MAP_POINTS[office.id]!;
      const custom = imageMode ? imagePins?.[office.id] : undefined;
      return { office, point: custom ? { ...city, x: bounded(custom.x, city.x, 4, 96),
        y: bounded(custom.y, city.y, 4, 96) } : { ...city,
          x: bounded(city.anchorX + city.dx * 100 / this.state.stageWidth, city.anchorX, 7, 93),
          y: bounded(city.anchorY + city.dy * 100 / (this.state.stageWidth * .54), city.anchorY, 9, 86) } };
    });
    const active = points.find(({ office }) => office.id === this.state.activeId);
    const popupId = `${prefix}-location-popup`;
    const panelStyle = active ? { "--rl-popup-side": active.point.x < 50 ? "right" : "left" } as CSSProperties : undefined;
    return (
      <div ref={this.setElement} className={styles.rlOfficeMap} data-map-mode={imageMode ? "image" : "world"}
        style={panelStyle} onMouseEnter={this.clearTimer} onMouseLeave={this.scheduleClose}
        onBlur={this.onBlur} onKeyDown={this.onKeyDown} role="group" aria-label="Interactive Bigfox office map">
        <div className={styles.rlMapTopbar}>
          <span className={styles.rlMapNetwork}><span aria-hidden="true" />Our office network</span>
        </div>
        <div ref={this.setStage} className={styles.rlWorldStage}>
          {imageMode ? (
            <SafeImage className={styles.rlCalibratedGlobe} src={globeImageSrc} alt="Office locations on the supplied globe image">
              <div className={styles.rlMapImageFallback}><Icon name="countries" /><span>Office network</span></div>
            </SafeImage>
          ) : (
            <svg className={styles.rlWorldSvg} viewBox="0 0 1000 540" aria-hidden="true" focusable="false">
              <defs>
                <radialGradient id={`${prefix}-map-ocean`} cx="55%" cy="34%" r="78%">
                  <stop offset="0" stopColor="#0d3257" /><stop offset="1" stopColor="#041226" />
                </radialGradient>
                <linearGradient id={`${prefix}-map-land`} x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#245a89" /><stop offset="1" stopColor="#12365e" />
                </linearGradient>
                <pattern id={`${prefix}-map-dots`} width="7" height="7" patternUnits="userSpaceOnUse">
                  <circle cx="3" cy="3" r=".9" fill="#8dd0ff" opacity=".27" />
                </pattern>
              </defs>
              <rect width="1000" height="540" fill={`url(#${prefix}-map-ocean)`} />
              <g className={styles.rlMapGraticule}>
                {[100, 200, 300, 400, 500, 600, 700, 800, 900].map((x) => <path key={`x-${x}`} d={`M${x} 24V475`} />)}
                {[95, 175, 255, 335, 415].map((y) => <path key={`y-${y}`} d={`M28 ${y}H972`} />)}
              </g>
              <path d={WORLD_COASTLINE} fill={`url(#${prefix}-map-land)`} stroke="#5283ac" strokeOpacity=".52" strokeWidth="1.1" />
              <path d={WORLD_COASTLINE} fill={`url(#${prefix}-map-dots)`} />
              <g className={styles.rlMapRoutes}>
                <path d="M744 224Q480 -25 189 161" />
                <path d="M744 224Q633 83 528 130" />
                <path d="M744 224Q601 78 514 126" />
              </g>
              {points.map(({ office, point }) => (
                <g key={office.id} className={styles.rlMapLeader} data-active={office.id === this.state.activeId}>
                  <path d={`M${point.anchorX * 10} ${point.anchorY * 5.4}L${point.x * 10} ${point.y * 5.4}`} />
                  <circle cx={point.anchorX * 10} cy={point.anchorY * 5.4} r="3.4" />
                </g>
              ))}
            </svg>
          )}
          {points.map(({ office, point }, index) => (
            <button className={styles.rlOfficePin} key={office.id} type="button" data-office-id={office.id}
              data-active={this.state.activeId === office.id} data-headquarters={Boolean(office.headquarters)}
              style={{ left: `${point.x}%`, top: `${point.y}%`, "--rl-pin-delay": `${index * 230}ms` } as CSSProperties}
              aria-label={`Show ${office.title}, ${office.city}, ${office.country}`}
              aria-haspopup="dialog" aria-expanded={this.state.activeId === office.id}
              aria-controls={this.state.activeId === office.id ? popupId : undefined}
              onMouseEnter={() => this.previewOffice(office.id)} onFocus={() => this.focusOffice(office.id)}
              onClick={(event) => this.chooseOffice(office.id, event.detail === 0)}>
              <span className={styles.rlPinPulse} aria-hidden="true" />
              <span className={styles.rlPinFace} aria-hidden="true"><Icon name="locations" /></span>
              <span className={styles.rlPinLabel} aria-hidden="true">{point.label}</span>
            </button>
          ))}
        </div>
        <div className={styles.rlMapBottom}><span>6 locations · 4 countries</span><span>Hover or tap a pin</span></div>
        {active && (
          <div id={popupId} key={active.office.id} className={join(styles.rlLocationPopup, active.point.x < 50 ? styles.rlPopupRight : styles.rlPopupLeft)}
            data-location-popup data-office-popup={active.office.id} role="dialog" aria-modal="false" tabIndex={-1}
            aria-labelledby={`${popupId}-title`} onMouseEnter={this.clearTimer}>
            <button className={styles.rlPopupClose} type="button" onClick={() => this.closePopup()}
              aria-label="Close location details"><Icon name="close" /></button>
            <span className={styles.rlPopupType}>{active.office.officeType}</span>
            <h3 className={styles.rlPopupTitle} id={`${popupId}-title`}>{active.office.title}</h3>
            <p className={styles.rlPopupPlace}>{active.office.city} · {active.office.country}</p>
            <address className={styles.rlPopupAddress}>{active.office.address.join(", ")}</address>
            <div className={styles.rlPopupContacts}>
              {active.office.phone && <a href={phoneHref(active.office.phone)}><Icon name="phone" />{active.office.phone}</a>}
              {active.office.email && <a href={`mailto:${active.office.email}`}><Icon name="email" />{active.office.email}</a>}
            </div>
            <a className={styles.rlPopupMapLink} href={active.office.mapsUrl} target="_blank" rel="noopener noreferrer">
              View on Google Maps<Icon name="arrow" /><span className={styles.rlSrOnly}> (opens in a new tab)</span>
            </a>
          </div>
        )}
        {showOfficeLinks && <div className={styles.rlOfficeLinks}>{offices.map((office) => (
          <a href={office.mapsUrl} key={office.id} target="_blank" rel="noopener noreferrer"><Icon name="locations" />{office.title}</a>
        ))}</div>}
      </div>
    );
  }
}

type AboutState = { slideIndex: number; formStatus: string; formError: boolean; submitting: boolean; reducedMotion: boolean };

export default class AboutExperience extends Component<AboutExperienceProps, AboutState> {
  state: AboutState = { slideIndex: 0, formStatus: "", formError: false, submitting: false, reducedMotion: false };
  private rootElement: HTMLDivElement | null = null;
  private setRoot = (node: HTMLDivElement | null) => { this.rootElement = node; };
  private dialogElement: HTMLDialogElement | null = null;
  private setDialog = (node: HTMLDialogElement | null) => { this.dialogElement = node; };
  private observer?: IntersectionObserver;
  private motionQuery?: MediaQueryList;
  private mounted = false;
  private submitting = false;
  private journeyFrame: number | null = null;
  private purposeFrame: number | null = null;
  private heroElement: HTMLElement | null = null;
  private setHero = (node: HTMLElement | null) => { this.heroElement = node; };
  private scrollViewport: HTMLElement | null = null;
  private runningEntrances = new Map<HTMLElement, Animation>();
  private counterFrames = new Map<HTMLElement, number>();
  private seenElements = new WeakSet<HTMLElement>();
  private styleTimer: ReturnType<typeof setTimeout> | undefined;
  private styleAttempts = 0;
  private storyResize: ResizeObserver | null = null;

  private get shouldReduceMotion(): boolean {
    if (this.props.motionPreference === "reduced") return true;
    if (this.props.motionPreference === "system") return Boolean(this.motionQuery?.matches);
    return false;
  }
  private get effectsEnabled(): boolean {
    return this.props.enableAnimations !== false && !this.shouldReduceMotion;
  }

  private get prefix() { return this.props.idPrefix ?? "roadlenz-about"; }
  private get slides(): readonly HeroSlide[] {
    const validSlides = this.props.heroSlides?.filter((slide) => slide.src.trim());
    return validSlides?.length ? validSlides : [{ src: this.props.heroImageSrc ?? ABOUT_IMAGES.hero, position: this.props.heroImagePosition ?? "center 58%", alt: "Bigfox Engineering team" }];
  }

  componentDidMount() {
    this.mounted = true;
    const root = this.rootElement;
    if (!root) return;
    this.scrollViewport = this.findScrollViewport(root);
    this.styleTimer = setTimeout(this.checkStyles, 160);
    this.motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    this.setupReveal();
    this.motionQuery.addEventListener?.("change", this.setupReveal);
    // Capture also observes scrolls inside an existing project's scroll container.
    document.addEventListener("scroll", this.queueJourneyUpdate, { passive: true, capture: true });
    window.addEventListener("resize", this.queueJourneyUpdate, { passive: true });
    document.addEventListener("visibilitychange", this.onPageVisibility);
    if (typeof ResizeObserver !== "undefined") {
      this.storyResize = new ResizeObserver(this.queueJourneyUpdate);
      this.storyResize.observe(root);
    }
    this.onPageVisibility();
    this.queueJourneyUpdate();
    // Wait until the initial render is committed; the photo and heading are not
    // hidden in the server HTML, so a JS/CSS failure cannot leave a blank hero.
    const title = root.querySelector<HTMLElement>("[data-hero-heading]");
    if (title) this.playEntrance(title, 80);
  }
  componentWillUnmount() {
    this.mounted = false;
    this.observer?.disconnect();
    this.motionQuery?.removeEventListener?.("change", this.setupReveal);
    document.removeEventListener("scroll", this.queueJourneyUpdate, true);
    window.removeEventListener("resize", this.queueJourneyUpdate);
    document.removeEventListener("visibilitychange", this.onPageVisibility);
    this.storyResize?.disconnect();
    if (this.journeyFrame !== null) cancelAnimationFrame(this.journeyFrame);
    if (this.purposeFrame !== null) cancelAnimationFrame(this.purposeFrame);
    if (this.styleTimer !== undefined) clearTimeout(this.styleTimer);
    this.runningEntrances.forEach((animation) => animation.cancel());
    this.runningEntrances.clear();
    this.counterFrames.forEach((frame) => cancelAnimationFrame(frame));
    this.counterFrames.clear();
  }
  private findScrollViewport(element: HTMLElement): HTMLElement | null {
    let parent = element.parentElement;
    while (parent && parent !== document.body && parent !== document.documentElement) {
      const overflow = getComputedStyle(parent).overflowY;
      if (/(auto|scroll|overlay|hidden)/.test(overflow)) return parent;
      parent = parent.parentElement;
    }
    return null;
  }
  private viewBounds() {
    const rect = this.scrollViewport?.getBoundingClientRect();
    const top = rect ? Math.max(0, rect.top + (this.scrollViewport?.clientTop ?? 0)) : 0;
    const bottom = rect ? Math.min(window.innerHeight, rect.bottom) : window.innerHeight;
    return { top, bottom, height: Math.max(1, bottom - top) };
  }
  private checkStyles = () => {
    if (!this.mounted || !this.rootElement) return;
    const root = this.rootElement;
    const marker = getComputedStyle(root).getPropertyValue("--rl-styles-ready").trim();
    const cards = root.querySelector<HTMLElement>("[data-purpose-grid]");
    const layoutReady = cards && getComputedStyle(cards).display === "grid";
    if (marker === "1" && layoutReady) {
      root.setAttribute("data-style-status", "ready");
      this.queueJourneyUpdate();
      return;
    }
    root.setAttribute("data-style-status", "waiting");
    if (++this.styleAttempts < 12) {
      this.styleTimer = setTimeout(this.checkStyles, 200);
    } else {
      root.setAttribute("data-style-status", "check-import");
      console.warn("[Bigfox About] CSS module styles are not applied. Open the ./aboutexperience.module.css import in this component and replace that exact file with the matching CSS. No content has been hidden.", { marker, gridDisplay: cards ? getComputedStyle(cards).display : "missing-grid" });
    }
  };
  private playEntrance = (element: HTMLElement, delay = 0) => {
    if (this.props.enableAnimations === false || typeof element.animate !== "function") return;
    this.runningEntrances.get(element)?.cancel();
    const calm = this.shouldReduceMotion;
    const side = element.hasAttribute("data-milestone-index") ? 28 : 0;
    const frames: Keyframe[] = calm
      ? [{ opacity: .65 }, { opacity: 1 }]
      : [
          { opacity: 0, transform: `translate3d(${side}px, ${side ? 0 : 36}px, 0) scale(.985)` },
          { opacity: 1, transform: "translate3d(0, 0, 0) scale(1)" },
        ];
    const animation = element.animate(frames, {
      duration: calm ? 180 : 900,
      delay: calm ? 0 : delay,
      easing: "cubic-bezier(.16,1,.3,1)",
      fill: "backwards",
    });
    this.runningEntrances.set(element, animation);
    const clear = () => {
      if (this.runningEntrances.get(element) === animation) this.runningEntrances.delete(element);
    };
    animation.finished.then(clear, clear);
    this.animateCounters(element);
  };
  private animateCounters = (element: HTMLElement) => {
    if (!this.effectsEnabled) return;
    element.querySelectorAll<HTMLElement>("[data-count-target]").forEach((counter) => {
      const target = Number(counter.dataset.countTarget);
      if (!Number.isFinite(target)) return;
      const previous = this.counterFrames.get(counter);
      if (previous !== undefined) cancelAnimationFrame(previous);
      const start = performance.now();
      const finalText = counter.dataset.countFinal ?? String(target);
      const suffix = counter.dataset.countSuffix ?? "";
      const tick = (now: number) => {
        if (!this.mounted || !this.effectsEnabled) {
          counter.textContent = finalText;
          this.counterFrames.delete(counter);
          return;
        }
        const progress = Math.min(1, (now - start) / 1200);
        counter.textContent = progress >= 1 ? finalText : `${Math.round(target * (1 - Math.pow(1 - progress, 3))).toLocaleString("en-IN")}${suffix}`;
        if (progress < 1) this.counterFrames.set(counter, requestAnimationFrame(tick));
        else this.counterFrames.delete(counter);
      };
      this.counterFrames.set(counter, requestAnimationFrame(tick));
    });
  };
  private setupReveal = () => {
    const root = this.rootElement;
    if (!root) return;
    this.observer?.disconnect();
    this.runningEntrances.forEach((animation) => animation.cancel());
    this.runningEntrances.clear();
    this.seenElements = new WeakSet<HTMLElement>();
    const reduced = this.shouldReduceMotion;
    if (this.state.reducedMotion !== reduced) this.setState({ reducedMotion: reduced });
    // Never use a CSS class that hides all sections pending hydration.
    root.removeAttribute("data-motion-ready");
    const elements = root.querySelectorAll<HTMLElement>("[data-about-reveal]");
    if (!("IntersectionObserver" in window) || this.props.enableAnimations === false) {
      elements.forEach((element) => element.setAttribute("data-in-view", "true"));
      this.queueJourneyUpdate();
      return;
    }
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const element = entry.target as HTMLElement;
        if (entry.isIntersecting && entry.intersectionRatio > 0) {
          element.setAttribute("data-in-view", "true");
          if (!this.seenElements.has(element)) {
            this.seenElements.add(element);
            const stagger = Number.parseFloat(element.style.getPropertyValue("--rl-reveal-delay")) || 0;
            this.playEntrance(element, Math.min(stagger, 360));
          }
        } else if (!entry.isIntersecting && !element.contains(document.activeElement)) {
          element.removeAttribute("data-in-view");
          this.seenElements.delete(element);
        }
      });
      this.queueJourneyUpdate();
    }, { root: this.scrollViewport, threshold: [0, .12], rootMargin: "0px 0px -20px 0px" });
    elements.forEach((element) => this.observer?.observe(element));
    this.queueJourneyUpdate();
  };
  private updateHero = () => {
    const hero = this.heroElement;
    if (!hero) return;
    const bounds = this.viewBounds();
    const rect = hero.getBoundingClientRect();
    const inView = rect.bottom > bounds.top && rect.top < bounds.bottom;
    hero.setAttribute("data-hero-visible", String(inView));
    const progress = this.effectsEnabled ? Math.min(1, Math.max(0, (bounds.top - rect.top) / Math.max(1, hero.offsetHeight * .82))) : 0;
    // Layout height is unchanged: the next section arrives through normal scrolling.
    hero.style.setProperty("--rl-hero-opacity", (1 - progress * .98).toFixed(4));
    hero.style.setProperty("--rl-hero-text-opacity", (1 - Math.min(1, progress * 1.5)).toFixed(4));
    hero.style.setProperty("--rl-hero-lift", `${(-progress * 42).toFixed(2)}px`);
    hero.style.setProperty("--rl-hero-text-lift", `${(-progress * 68).toFixed(2)}px`);
  };

  private onPageVisibility = () => {
    this.rootElement?.setAttribute("data-page-hidden", document.hidden ? "true" : "false");
    if (!document.hidden) this.queueJourneyUpdate();
  };

  private queueJourneyUpdate = () => {
    if (!this.mounted || this.journeyFrame !== null) return;
    this.journeyFrame = requestAnimationFrame(() => {
      this.journeyFrame = null;
      this.updateHero();
      this.updateJourney();
    });
  };

  private updateJourney = () => {
    const root = this.rootElement;
    const timeline = root?.querySelector<HTMLOListElement>("[data-about-timeline]");
    if (!timeline) return;
    const rows = Array.from(timeline.querySelectorAll<HTMLLIElement>("[data-milestone-index]"));
    if (!rows.length) return;
    const dotCenter = (row: HTMLLIElement) => {
      const dot = row.querySelector<HTMLElement>("[data-story-dot]");
      return row.offsetTop + (dot ? dot.offsetTop + dot.offsetHeight / 2 : 21.5);
    };
    const start = dotCenter(rows[0]!);
    const end = dotCenter(rows[rows.length - 1]!);
    const rect = timeline.getBoundingClientRect();
    const viewport = this.viewBounds();
    const readingLine = viewport.top + viewport.height * 0.62 - rect.top;
    const progress = Math.min(1, Math.max(0, (readingLine - start) / Math.max(1, end - start)));
    const isVisible = rect.top < viewport.bottom && rect.bottom > viewport.top;
    timeline.style.setProperty("--rl-track-top", `${start}px`);
    timeline.style.setProperty("--rl-track-bottom", `${Math.max(0, timeline.offsetHeight - end)}px`);
    timeline.style.setProperty("--rl-timeline-progress", String(progress));
    timeline.setAttribute("data-story-visible", String(isVisible));
    // Current year follows the reading position; chronology and copy are untouched.
    let current = -1;
    rows.forEach((row, index) => { if (dotCenter(row) <= readingLine + 2) current = index; });
    rows.forEach((row, index) => {
      row.setAttribute("data-story-state", index < current ? "complete" : index === current ? "current" : "upcoming");
    });
  };

  private trackPurposePointer = (event: MouseEvent<HTMLElement>) => {
    if (!this.effectsEnabled || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const surface = event.currentTarget.querySelector<HTMLElement>("[data-purpose-surface]");
    if (!surface) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (event.clientX - rect.left) / Math.max(1, rect.width)));
    const y = Math.max(0, Math.min(1, (event.clientY - rect.top) / Math.max(1, rect.height)));
    if (this.purposeFrame !== null) cancelAnimationFrame(this.purposeFrame);
    this.purposeFrame = requestAnimationFrame(() => {
      this.purposeFrame = null;
      surface.style.setProperty("--rl-card-rx", `${(0.5 - y) * 5}deg`);
      surface.style.setProperty("--rl-card-ry", `${(x - 0.5) * 5}deg`);
      surface.style.setProperty("--rl-spot-x", `${x * 100}%`);
      surface.style.setProperty("--rl-spot-y", `${y * 100}%`);
    });
  };

  private resetPurposePointer = (event: MouseEvent<HTMLElement>) => {
    if (this.purposeFrame !== null) cancelAnimationFrame(this.purposeFrame);
    this.purposeFrame = null;
    const surface = event.currentTarget.querySelector<HTMLElement>("[data-purpose-surface]");
    surface?.style.setProperty("--rl-card-rx", "0deg");
    surface?.style.setProperty("--rl-card-ry", "0deg");
  };

  componentDidUpdate(previous: AboutExperienceProps) {
    if (previous.motionPreference !== this.props.motionPreference || previous.enableAnimations !== this.props.enableAnimations || previous.showLeadership !== this.props.showLeadership || previous.showEnquirySection !== this.props.showEnquirySection) this.setupReveal();
  }
  private scrollTo = (event: MouseEvent<HTMLAnchorElement>, suffix: string) => {
    const section = document.getElementById(`${this.prefix}-${suffix}`);
    if (!section) return;
    event.preventDefault();
    section.scrollIntoView({ behavior: this.shouldReduceMotion ? "auto" : "smooth", block: "start" });
    section.focus({ preventScroll: true });
  };
  private advanceSlide = (direction: number) => {
    const count = this.slides.length;
    this.setState((previous) => ({ slideIndex: (previous.slideIndex + direction + count) % count }));
  };
  private openEnquiry = () => {
    if (this.props.showEnquirySection) {
      const section = document.getElementById(`${this.prefix}-enquiry`);
      section?.scrollIntoView({ behavior: this.shouldReduceMotion ? "auto" : "smooth", block: "start" });
      section?.focus({ preventScroll: true });
      return;
    }
    this.dialogElement?.showModal();
  };
  private closeEnquiry = () => this.dialogElement?.close();
  private closeOnBackdrop = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target !== event.currentTarget) return;
    const rect = event.currentTarget.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) this.closeEnquiry();
  };
  private submitEnquiry = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (this.submitting) return;
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const values = new FormData(form);
    const data: EnquiryData = {
      fullName: String(values.get("fullName") ?? "").trim(), email: String(values.get("email") ?? "").trim(),
      phone: String(values.get("phone") ?? "").trim(), subject: String(values.get("subject") ?? "").trim(),
      message: String(values.get("message") ?? "").trim(),
    };
    if (Object.values(data).some((value) => !value)) {
      this.setState({ formError: true, formStatus: "Please complete all required fields; spaces alone are not a valid entry." });
      return;
    }
    if (!this.props.onEnquirySubmit) {
      window.location.href = buildEnquiryMailto(data);
      this.setState({ formError: false, formStatus: "An email draft has been requested. Review and send it in your email app. Nothing has been sent automatically." });
      return;
    }
    this.submitting = true;
    this.setState({ submitting: true, formError: false, formStatus: "" });
    try {
      await this.props.onEnquirySubmit(data);
      if (this.mounted) { form.reset(); this.setState({ formStatus: "Thank you. Your enquiry has been submitted." }); }
    } catch {
      if (this.mounted) this.setState({ formError: true, formStatus: "Your enquiry could not be sent. Please try again or contact a support team directly." });
    } finally {
      this.submitting = false;
      if (this.mounted) this.setState({ submitting: false });
    }
  };

  private renderForm() {
    const id = `${this.prefix}-form`;
    return (
      <form className={styles.rlForm} onSubmit={this.submitEnquiry} aria-busy={this.state.submitting} aria-describedby={`${id}-note`}>
        <div className={styles.rlFormGrid}>
          <label className={styles.rlField}><span>Full Name *</span><input name="fullName" autoComplete="name" required maxLength={120} placeholder="Your name" /></label>
          <label className={styles.rlField}><span>Email Address *</span><input name="email" type="email" autoComplete="email" required maxLength={254} placeholder="you@company.com" /></label>
          <label className={styles.rlField}><span>Phone Number *</span><input name="phone" type="tel" autoComplete="tel" required minLength={7} maxLength={30} placeholder="Your phone number" /></label>
          <label className={styles.rlField}><span>Subject *</span><select name="subject" defaultValue="" required><option value="" disabled>Select a team</option><option>Sales Enquiry</option>{SUPPORT_TEAMS.map((team) => <option key={team.id}>{team.title}</option>)}<option>Partnership</option></select></label>
        </div>
        <label className={styles.rlField}><span>Message *</span><textarea name="message" rows={4} required maxLength={3000} placeholder="Tell us about your requirements" /></label>
        <button className={join(styles.rlButton, styles.rlButtonBlue, styles.rlSubmit)} type="submit" disabled={this.state.submitting}>
          {this.state.submitting ? "Sending…" : this.props.onEnquirySubmit ? "Submit Enquiry" : "Prepare Email Enquiry"}<Icon name="arrow" />
        </button>
        <p className={styles.rlFormNote} id={`${id}-note`}>{this.props.onEnquirySubmit ? "Your enquiry will be sent through your connected website handler." : "This opens an email draft. Review and send it in your email app."}</p>
        <p className={join(styles.rlFormStatus, this.state.formError && styles.rlFormError)} role={this.state.formError ? "alert" : "status"}>{this.state.formStatus}</p>
      </form>
    );
  }

  render() {
    const {
      className, logoSrc = ABOUT_IMAGES.logo, globeImageSrc = ABOUT_IMAGES.globe, globePins,
      purposeImages, supportTeamImages, supportTeamImagePositions, ctaImageSrc = ABOUT_IMAGES.cta, useReferenceArtwork = true,
      showLeadership = true, showEnquirySection = false, showImpactStats = false, showOfficeLinks = false,
      managingDirectorPhotoSrc, directorPhotoSrc, contactHref, mapMode = "world", enableAnimations = true,
    } = this.props;
    const slide = this.slides[this.state.slideIndex % this.slides.length]!;
    const rootStyle = {
      "--rl-section-space": `${bounded(this.props.sectionSpacing, 96, 56, 160)}px`,
      "--rl-anchor-offset": `${bounded(this.props.headerOffset, 96, 0, 240)}px`,
    } as CSSProperties;
    return (
      <div ref={this.setRoot} className={join(styles.rlAbout, className)} style={rootStyle} data-about-version="bigfox-text-fixed-v9" data-effects={enableAnimations && !this.state.reducedMotion ? "on" : "paused"}>

        {/* 1. HERO — heading only. No paragraph, CTA, benefit labels or signature. */}
        <section ref={this.setHero} className={styles.rlHero} data-hero-visible="true" aria-labelledby={`${this.prefix}-hero-title`}>
          <div className={styles.rlHeroMedia} aria-hidden="true">
            <SafeImage key={slide.src} className={styles.rlHeroImage} src={slide.src} alt="" eager style={{ objectPosition: slide.position ?? this.props.heroImagePosition ?? "center 58%" }} />
            <div className={styles.rlHeroShade} />
            <div className={styles.rlHeroAtmosphere} />
          </div>
          <div className={join(styles.rlContainer, styles.rlHeroInner)}>
            <h1 data-hero-heading aria-label="Driven by Vision" className={styles.rlHeroTitle} id={`${this.prefix}-hero-title`}>
              <span>Driven by</span>{" "}<em>Vision</em>
            </h1>
            {this.slides.length > 1 && <div className={styles.rlHeroControls} aria-label="Hero slideshow controls">
              <button type="button" aria-label="Previous team image" onClick={() => this.advanceSlide(-1)}><Icon name="previous" /></button>
              <button type="button" aria-label="Next team image" onClick={() => this.advanceSlide(1)}><Icon name="next" /></button>
            </div>}
          </div>
        </section>

        {/* 2. WHO WE ARE — Bigfox is the company; RoadLenz is its connected-mobility offering. */}
        <section className={styles.rlSection} id={`${this.prefix}-company`} tabIndex={-1} aria-labelledby={`${this.prefix}-company-title`}>
          <div className={join(styles.rlContainer, styles.rlWhoGrid)}>
            <div className={styles.rlCompanyCopy} data-about-reveal>
              <span className={styles.rlEyebrow}>About Bigfox</span>
              <h2 className={styles.rlTitle} id={`${this.prefix}-company-title`}>Who <em>We Are</em></h2>
              <p className={styles.rlIntro}>
                Founded in Chennai in 2016, <strong>Bigfox Engineering Pvt. Ltd.</strong> brings together industrial automation, security systems, component manufacturing and R&amp;D. Our journey into connected mobility led to <strong>RoadLenz</strong>, combining our engineering experience with vehicle safety and fleet intelligence.
              </p>
              <p className={styles.rlIntro}>
                <strong>RoadLenz software</strong> helps customers track vehicles, view live locations, monitor telematics and access live video and two-way voice communication with compatible devices.
              </p>
              <p className={styles.rlIntro}>
                The <strong>RoadLenz website</strong> helps customers explore and purchase MDVR systems, GPS trackers, dashcams and related vehicle-safety products — supported by Bigfox&apos;s customer, installation and technical teams.
              </p>
              <a className={join(styles.rlButton, styles.rlButtonOutline)} href={`#${this.prefix}-journey`} onClick={(event) => this.scrollTo(event, "journey")}>Our Story<Icon name="arrow" /></a>
              {showImpactStats && <div className={styles.rlImpactStats}>{IMPACT_STATS.map((stat) => <div key={stat.label}><strong>{stat.value}</strong><span>{stat.label}</span></div>)}</div>}
            </div>
            <div className={styles.rlBrandArea} data-about-reveal>
              <div className={styles.rlBrandPanel}>
                <SafeImage className={styles.rlBrandLogo} src={logoSrc} fallbackSrc={ABOUT_IMAGES.logo} alt="Bigfox Engineering Pvt. Ltd." eager width={520} height={180}>
                  <div className={styles.rlWordmark}><span>BIGFOX</span><small>ENGINEERING PVT. LTD.</small></div>
                </SafeImage>
              </div>
              <p className={styles.rlBrandStatement}><strong>Engineering trusted mobility.</strong>From industrial automation to the RoadLenz ecosystem, Bigfox builds safer systems for people, vehicles and assets.<span aria-hidden="true" /></p>
            </div>
          </div>
        </section>

        {/* 3. OUR PURPOSE — independent, image-ready animated cards. */}
        <section className={join(styles.rlSection, styles.rlTint, styles.rlPurposeSection)}
          data-motion-section="purpose" aria-labelledby={`${this.prefix}-purpose-title`}>
          <div className={styles.rlContainer}>
            <div className={styles.rlHeadingRow}>
              <div data-about-reveal><span className={styles.rlEyebrow}>Our Purpose</span><h2 className={styles.rlTitle} id={`${this.prefix}-purpose-title`}>Vision. <em>Mission. Values.</em></h2></div>
              <div data-about-reveal><p className={styles.rlHeadingNote}><strong>Purpose-driven innovation.</strong>We design connected mobility and industrial solutions with clarity, trust and long-term impact.</p></div>
            </div>
            <div className={styles.rlPurposeGrid} data-purpose-grid>
              {PURPOSE.map((item, index) => (
                <article className={styles.rlPurposeCard} key={item.id} data-about-reveal data-purpose={item.id}
                  aria-labelledby={`${this.prefix}-${item.id}-title`}
                  style={{ "--rl-reveal-delay": `${index * 130}ms`, "--rl-purpose-phase": `${index * -1.4}s` } as CSSProperties}
                  onMouseMove={this.trackPurposePointer} onMouseLeave={this.resetPurposePointer}>
                  <div className={styles.rlPurposeSurface} data-purpose-surface>
                    <SafeImage className={styles.rlPurposeImage} src={purposeImages?.[item.id] ?? ABOUT_IMAGES[item.id]}
                      fallbackSrc={useReferenceArtwork ? REFERENCE_ART[item.id] : undefined} alt="" />
                    <div className={styles.rlPurposeShade} aria-hidden="true" />
                    <div className={styles.rlPurposeSpotlight} aria-hidden="true" />
                    <span className={styles.rlPurposeNumber} aria-hidden="true">0{index + 1}</span>
                    <div className={styles.rlPurposeSeal} aria-hidden="true">
                      <span className={styles.rlPurposeOrbit} /><span className={styles.rlPurposeOrbitInner} />
                      <span className={styles.rlPurposeIconCore}><Icon name={item.id} className={styles.rlPurposeIcon} /></span>
                    </div>
                    <div className={styles.rlPurposeCopy}>
                      <h3 id={`${this.prefix}-${item.id}-title`}>{item.title}</h3>
                      <p>{item.copy}</p>
                    </div>
                    <div className={styles.rlPurposeFooter}>
                      <a className={styles.rlPurposeLink} href={`#${this.prefix}-${item.href}`} onClick={(event) => this.scrollTo(event, item.href)} aria-label={`${item.title} — ${item.caption}`}>
                        <span className={styles.rlPurposeCaption}>{item.caption}</span>
                        <span className={styles.rlPurposeArrow} aria-hidden="true"><Icon name="arrow" /></span>
                      </a>
                    </div>
                    <span className={styles.rlPurposeBeam} aria-hidden="true" />
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* 4. JOURNEY — vertical timeline; supplied 2016–2026 history is retained. */}
        <section className={styles.rlSection} data-motion-section="journey" id={`${this.prefix}-journey`} tabIndex={-1} aria-labelledby={`${this.prefix}-journey-title`}>
          <div className={join(styles.rlContainer, styles.rlJourneyGrid)}>
            <div className={styles.rlJourneyIntro} data-about-reveal>
              <span className={styles.rlEyebrow}>Our Journey</span>
              <h2 className={styles.rlTitle} id={`${this.prefix}-journey-title`}>Key <em>Milestones</em></h2>
              <p>A journey of innovation, trust and impact — building intelligent solutions for a safer tomorrow.</p>
              <div className={styles.rlJourneySignature}>Building<br />a Safer Tomorrow<span aria-hidden="true" /></div>
            </div>
            <ol className={styles.rlTimeline} data-about-timeline>
              {MILESTONES.map((milestone, index) => <li className={styles.rlMilestone} key={`${milestone.year}-${milestone.title}`} data-about-reveal data-milestone-index={index} style={{ "--rl-reveal-delay": `${Math.min(index * 85, 425)}ms` } as CSSProperties}>
                <span className={styles.rlTimelineDot} data-story-dot aria-hidden="true" />
                <time className={styles.rlYear} dateTime={milestone.year}>{milestone.year}</time>
                <div className={styles.rlMilestoneCopy}><h3>{milestone.title}{index === MILESTONES.length - 1 && <span className={styles.rlLatest}>Our next chapter</span>}</h3><p>{milestone.description}</p></div>
              </li>)}
            </ol>
          </div>
        </section>

        {/* 5. GLOBAL PRESENCE — four independent statistic cards, no address list. */}
        <section className={join(styles.rlSection, styles.rlTint)} aria-labelledby={`${this.prefix}-presence-title`}>
          <div className={styles.rlContainer}>
            <div className={styles.rlHeadingRow} data-about-reveal>
              <div><span className={styles.rlEyebrow}>Our Locations</span><h2 className={styles.rlTitle} id={`${this.prefix}-presence-title`}>Global <em>Presence</em></h2></div>
              <p className={styles.rlHeadingNote}><strong>Local support. Global reach.</strong>Teams across India, Europe and the U.S. help customers deploy with confidence and stay connected.</p>
            </div>
            <div className={styles.rlPresenceGrid}>
              <div className={styles.rlStatsGrid} role="list" aria-label="RoadLenz at a glance">
                {GLOBAL_PRESENCE_STATS.map((stat, index) => <div className={styles.rlStatCard} key={stat.id} role="listitem" data-about-reveal style={{ "--rl-reveal-delay": `${index * 100}ms` } as CSSProperties}>
                  <Icon name={stat.id} className={styles.rlStatIcon} />
                  <div className={styles.rlStatText}><strong aria-label={stat.value}><span aria-hidden="true" data-count-target={stat.id === "support" ? undefined : Number.parseInt(stat.value.replace(/[^0-9]/g, ""), 10)} data-count-final={stat.value} data-count-suffix={stat.value.endsWith("+") ? "+" : ""}>{stat.value}</span></strong><span>{stat.label}</span></div>
                </div>)}
              </div>
              <OfficeMap prefix={this.prefix} globeImageSrc={globeImageSrc} imagePins={globePins}
                mode={mapMode} showOfficeLinks={showOfficeLinks} />
            </div>
          </div>
        </section>

        {/* Optional legacy sections; off to preserve the exact approved section order. */}
        {showLeadership && <section className={join(styles.rlSection, styles.rlLeadershipSection)} aria-labelledby={`${this.prefix}-leaders-title`}>
          <div className={styles.rlContainer}>
            <div className={styles.rlHeadingRow} data-about-reveal>
              <div>
                <span className={styles.rlEyebrow}>Bigfox Leadership</span>
                <h2 className={styles.rlTitle} id={`${this.prefix}-leaders-title`}>Guided by <em>Leadership</em></h2>
              </div>
              <p className={styles.rlHeadingNote}><strong>Leadership with purpose.</strong>The Bigfox leadership team drives innovation, customer trust and the RoadLenz journey forward.</p>
            </div>
            <div className={styles.rlLeaders}>
              {[
                { name: "MRS. SARANYA S", role: "Managing Director", company: "Bigfox Engineering Private Limited", photo: managingDirectorPhotoSrc ?? ABOUT_IMAGES.managingDirector },
                { name: "MR. SAMPATH KUMAR G", role: "Director", company: "Bigfox Engineering Private Limited", photo: directorPhotoSrc ?? ABOUT_IMAGES.director },
              ].map((leader, index) => (
                <article className={styles.rlLeader} key={leader.role} data-about-reveal style={{ "--rl-reveal-delay": `${index * 120}ms` } as CSSProperties}>
                  <div className={styles.rlLeaderVisual}>
                    <div className={styles.rlLeaderGlow} aria-hidden="true" />
                    <div className={styles.rlPortrait}>
                      <SafeImage className={styles.rlPortraitImage} src={leader.photo} alt={leader.name}>
                        <div className={styles.rlPortraitFallback}><Icon name="values" /></div>
                      </SafeImage>
                    </div>
                  </div>
                  <div className={styles.rlLeaderBody}>
                    <span className={styles.rlLeaderKicker}>{leader.role}</span>
                    <h3>{leader.name}</h3>
                    <p className={styles.rlLeaderCompany}>{leader.company}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>}
        {showEnquirySection && <section className={join(styles.rlSection, styles.rlTint)} id={`${this.prefix}-enquiry`} tabIndex={-1} aria-labelledby={`${this.prefix}-enquiry-title`}><div className={join(styles.rlContainer, styles.rlEnquiryWidth)}>
          <span className={styles.rlEyebrow}>Connect With Us</span><h2 className={styles.rlTitle} id={`${this.prefix}-enquiry-title`}>Send Us an <em>Enquiry</em></h2>{this.renderForm()}
        </div></section>}

        {/* 6. SUPPORT — equally sized image cards, real links and accessible buttons. */}
        <section className={styles.rlSection} id={`${this.prefix}-support`} aria-labelledby={`${this.prefix}-support-title`}>
          <div className={styles.rlContainer}>
            <div className={styles.rlHeadingRow} data-about-reveal>
              <div><span className={styles.rlEyebrow}>Here to Help</span><h2 className={styles.rlTitle} id={`${this.prefix}-support-title`}>Our Support <em>Teams</em></h2></div>
              <p className={styles.rlHeadingNote}><strong>Dedicated teams. Faster response.</strong>Sales guidance, project execution and technical help — all under one roof.</p>
            </div>
            <div className={styles.rlSupportGrid}>
              {SUPPORT_TEAMS.map((team, index) => <article className={styles.rlSupportCard} key={team.id} aria-labelledby={`${this.prefix}-${team.id}-title`} data-about-reveal style={{ "--rl-reveal-delay": `${index * 140}ms` } as CSSProperties}>
                <div className={styles.rlSupportPhoto}>
                  <SafeImage
                    className={styles.rlSupportImage}
                    src={supportTeamImages?.[team.id] ?? ABOUT_IMAGES[team.image]}
                    alt={`Bigfox ${team.title} team`}
                    style={{ objectPosition: supportTeamImagePositions?.[team.id] ?? "center" }}
                    width={800}
                    height={420}
                  >
                    <div className={styles.rlSupportPlaceholder}><Icon name={team.id === "customer" ? "support" : team.id} /></div>
                  </SafeImage>
                  <div className={styles.rlSupportOverlay} aria-hidden="true" />
                  <div className={styles.rlSupportVisualContent}>
                    <div className={styles.rlSupportBadge}>{team.badge}</div>

                  </div>
                </div>
                <div className={styles.rlSupportBody}>
                  <div className={styles.rlSupportHeader}>
                    <h3 className={styles.rlSupportTitle} id={`${this.prefix}-${team.id}-title`}><Icon name={team.id === "customer" ? "support" : team.id} />{team.title}</h3>
                    <div className={styles.rlSupportMeta}>
                      {team.highlights.map((highlight) => <span className={styles.rlSupportKicker} key={highlight}>{highlight}</span>)}
                    </div>
                    <p className={styles.rlSupportSummary}>{team.summary}</p>
                  </div>
                  <div className={styles.rlSupportInfo}>
                    <a className={styles.rlContactRow} href={phoneHref(team.phone)}><Icon name="phone" /><span>{team.phone}</span></a>
                    <a className={styles.rlContactRow} href={`mailto:${team.email}`}><Icon name="email" /><span>{team.email}</span></a>
                  </div>
                  <div className={styles.rlSupportActions}>
                    <a className={join(styles.rlButton, styles.rlButtonNavy)} href={phoneHref(team.phone)} aria-label={`Call ${team.title}`}><Icon name="phone" />Call Now</a>
                    <a className={join(styles.rlButton, styles.rlButtonOutline)} href={`mailto:${team.email}`} aria-label={`Email ${team.title}`}><Icon name="email" />Email Team</a>
                  </div>
                </div>
              </article>)}
            </div>
          </div>
        </section>

        {/* 7. CTA — content banner, NOT another website footer. */}
        <section className={styles.rlCta} aria-labelledby={`${this.prefix}-cta-title`}>
          <SafeImage className={styles.rlCtaImage} src={ctaImageSrc} fallbackSrc={useReferenceArtwork ? REFERENCE_ART.cta : undefined} alt="" />
          <div className={styles.rlCtaShade} aria-hidden="true" />
          <div className={join(styles.rlContainer, styles.rlCtaInner)} data-about-reveal>
            <div><span className={styles.rlEyebrow}>Let&apos;s Build a Safer Tomorrow</span><h2 className={styles.rlTitle} id={`${this.prefix}-cta-title`}>Partner with <em>RoadLenz</em></h2><p>Intelligent solutions for a safer, smarter and more connected world.</p></div>
            {contactHref ? <a className={join(styles.rlButton, styles.rlButtonBlue)} href={contactHref}>Get in Touch<Icon name="arrow" /></a> : <button type="button" className={join(styles.rlButton, styles.rlButtonBlue)} onClick={this.openEnquiry}>Get in Touch<Icon name="arrow" /></button>}
          </div>
        </section>

        {/* Enquiry remains available through the CTA without adding an extra visible band. */}
        {!showEnquirySection && <dialog ref={this.setDialog} className={styles.rlDialog} aria-labelledby={`${this.prefix}-dialog-title`} onClick={this.closeOnBackdrop}>
          <button className={styles.rlClose} type="button" aria-label="Close enquiry" onClick={this.closeEnquiry}><Icon name="close" /></button>
          <span className={styles.rlEyebrow}>Connect With Us</span><h2 className={styles.rlTitle} id={`${this.prefix}-dialog-title`}>Send Us an <em>Enquiry</em></h2>{this.renderForm()}
        </dialog>}
      </div>
    );
  }
}
