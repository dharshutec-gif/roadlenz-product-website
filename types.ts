import type { AboutData } from "./about-types";
/* RoadLenz CMS — content types. All public content is sourced from the CMS
   store (data/db.json) via lib/db.ts. Nothing user-facing is hardcoded. */

export interface BaseEntity {
  id: string;
  order: number;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MediaRef {
  type: "image" | "video";
  src: string;
  poster?: string;
}

export interface HeroSlide extends BaseEntity {
  kind: "hero";
  title: string;
  subtitle: string;
  primaryCta: string;
  primaryHref: string;
  secondaryCta: string;
  secondaryHref: string;
  media: MediaRef;
  overlay: number; // 0..1 darkness
  duration: number; // seconds
}

export interface Stat extends BaseEntity {
  kind: "stat";
  label: string;
  value: string; // display value, e.g. "2,000+"
  counter?: number; // numeric part for animation
  suffix?: string;
  icon: string;
}

export interface Spec {
  label: string;
  value: string;
}

export interface DocumentRef {
  name: string;
  url: string;
  size?: string;
}

export interface ProductCategory extends BaseEntity {
  kind: "productCategory";
  name: string;
  slug: string;
  description: string;
}

export interface Product extends BaseEntity {
  kind: "product";
  slug: string;
  name: string;
  category: string;
  tagline: string;
  description: string[];
  image: string;
  gallery?: string[];
  video?: MediaRef;
  badges?: Spec[];
  specs: Spec[];
  features?: string[];
  compatibility?: string[];
  inBox?: string[];
  documents: DocumentRef[];
  installationGuide?: DocumentRef;
  warranty?: DocumentRef;
  relatedProductSlugs?: string[];
  price: string; // e.g. "On request" or "₹14,900 / vehicle"
  priceNote: string;
  featured: boolean;
}

export interface Industry extends BaseEntity {
  kind: "industry";
  slug: string;
  name: string;
  shortName: string;
  tagline: string;
  summary: string[];
  image: string;
  vehicleImage: string;
  challenges: string[];
  outcomes: string[];
  capabilities: string[]; // capability groups offered
  relatedProductSlugs: string[];
  stat: { value: string; label: string };
}

export interface CaseStudy extends BaseEntity {
  kind: "caseStudy";
  client: string; // placeholder until approved
  title: string;
  location: string;
  image: string;
  video?: MediaRef;
  challenge: string;
  solution: string;
  technology: string[];
  results: { metric: string; note: string }[];
  approved: boolean; // customer details verified & cleared
}

export interface CustomerLogo extends BaseEntity {
  kind: "logo";
  name: string;
  image: string;
  approved: boolean;
}

export type ResourceType =
  | "case-study"
  | "video"
  | "guide"
  | "insight"
  | "download"
  | "documentation"
  | "webinar"
  | "checklist"
  | "faq"
  | "warranty";

export interface ResourceItem extends BaseEntity {
  slug?: string;
  category?: string;
  featured?: boolean;
  approved?: boolean;
  duration?: string;
  pageCount?: number;
  body?: string;
  answer?: string;
  relatedLinks?: { label: string; href: string }[];
  kind: "resource";
  type: ResourceType;
  title: string;
  description: string;
  image: string;
  media?: MediaRef;
  file?: DocumentRef;
  meta: string; // e.g. "Updated Jun 2026"
}

export interface OfficeLocation extends BaseEntity {
  kind: "location";
  name: string;
  city: string;
  region: string;
  country: string;
  international: boolean;
  type: "headquarters" | "production" | "regional" | "office";
  lat: number;
  lng: number;
  address: string; // placeholder until verified
  phone: string;
  email: string;
  timings: string;
  mapsLink: string;
  image: string;
  verified: boolean;
}

export interface WhyPoint extends BaseEntity {
  kind: "why";
  title: string;
  text: string;
  icon: string;
}

export interface EcosystemNode extends BaseEntity {
  kind: "ecosystem";
  label: string;
  text: string;
  icon: string;
}

export interface EngineeringItem extends BaseEntity {
  kind: "engineering";
  title: string;
  text: string;
  image: string;
  icon: string;
}

export interface SolutionFinderOption extends BaseEntity {
  kind: "finder";
  option: string;
  icon: string;
  headline: string;
  body: string;
  recommendation: string;
  links: { label: string; href: string }[];
}

export interface Solution extends BaseEntity {
  industryPresentation?: import("./industries-content").IndustryPresentation;
  kind: "solution";
  name: string;
  slug: string;
  industry: string;
  heroTitle: string;
  heroSummary: string;
  heroMedia: MediaRef;
  vehicleImage: string;
  abstractPreviewImage: string;
  relatedProductSlugs: string[];
  keyOutcomes: string[];
  painPoints?: SolutionBenefit[];
  faqs?: Spec[];
  productCallouts: Spec[];
  platformOutcomes: string[];
  bestFor: string[];
  sequenceNumber: number;
  featured: boolean;
  journeyStages?: SolutionJourneyStage[];
  outcomeTitle?: string;
  outcomeSummary?: string;
  outcomeMedia?: MediaRef;
  ctaTitle?: string;
  ctaSummary?: string;
  heroCtaLabel?: string;
  heroCtaHref?: string;
  trustLine?: string;
  mapMedia?: MediaRef;
  capabilities?: SolutionCapability[];
  capabilityTitle?: string;
  recommendedProducts?: SolutionRecommendedProduct[];
  benefits?: SolutionBenefit[];
  ctaMedia?: MediaRef;
  ctaPrimaryLabel?: string;
  ctaPrimaryHref?: string;
  ctaSecondaryLabel?: string;
  ctaSecondaryHref?: string;
  technologyTitle?: string;
  technologyDescription?: string;
  blueprintMedia?: MediaRef;
  deviceConsoleMedia?: MediaRef;
  taxiContent?: TaxiContent;
  logisticsContent?: LogisticsContent;
  agricultureContent?: LogisticsContent;
  employeeContent?: LogisticsContent;
  transitContent?: LogisticsContent;
  liveStatus?: Spec[];
}

/** Editable section copy for the freight experience; device content stays in Products. */
export interface LogisticsContent {
  challengeEyebrow?: string;
  challengeTitle?: string;
  challengeSummary?: string;
  journeyEyebrow?: string;
  journeyTitle?: string;
  journeySummary?: string;
  stageHeading?: string;
  technologyEyebrow?: string;
  setupEyebrow?: string;
  setupTitle?: string;
  setupReasonsTitle?: string;
  outcomeEyebrow?: string;
  faqTitle?: string;
  demoLabel?: string;
  mediaFallback?: string;
  emptyProductsLabel?: string;
  pauseLabel?: string;
  resumeLabel?: string;
  productActionLabel?: string;
  enquiryLabel?: string;
}

/** Editable copy used only by the Cab & Taxi experience. */
export interface TaxiContent {
  heroEyebrow?: string;
  enquiryLabel?: string;
  challengeTitle?: string;
  challengeSummary?: string;
  journeyTitle?: string;
  journeySummary?: string;
  setupTitle?: string;
  setupSummary?: string;
  setupReasonsTitle?: string;
  faqTitle?: string;
  demoLabel?: string;
  mediaFallback?: string;
  pauseLabel?: string;
  resumeLabel?: string;
  productActionLabel?: string;
}

export interface SolutionJourneyStage {
  title: string;
  label?: string;
  description: string;
  media: MediaRef;
  nodeX?: number;
  nodeY?: number;
  status?: string;
  details?: Spec[];
  order?: number;
}

export interface SolutionCapability {
  title: string;
  icon: string;
  description: string;
  visual: MediaRef;
  order?: number;
  autoSlide?: boolean;
}

export interface SolutionRecommendedProduct {
  productSlug: string;
  explanation: string;
  performance?: string;
  order?: number;
}

export interface SolutionBenefit {
  title: string;
  description: string;
  icon: string;
  order?: number;
}

export interface CompanySettings {
  name: string;
  legalName: string;
  tagline: string;
  parentCompany: string;
  description: string;
  contact: {
    phone: string;
    email: string;
    address: string;
    hours: string;
  };
  social: { label: string; href: string }[];
  seo: {
    title: string;
    description: string;
    ogImage: string;
  };
  solutionsHero: {
    video: string;
    poster: string;
  };
  footerNote: string;
}

export interface QuoteRequest extends BaseEntity {
  kind: "quote";
  name: string;
  company: string;
  email: string;
  phone: string;
  fleetSize: string;
  vehicleTypes: string;
  products: string;
  message: string;
  status: "new" | "contacted" | "quoted" | "closed";
  ref: string;
}

export interface DemoRequest extends BaseEntity {
  kind: "demo";
  name: string;
  company: string;
  email: string;
  phone: string;
  date: string;
  duration: string;
  topics: string;
  message: string;
  status: "new" | "scheduled" | "completed";
  ref: string;
}

export interface ContactMessage extends BaseEntity {
  kind: "message";
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: "new" | "replied";
  ref: string;
}

export interface AppUser {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  company: string;
  phone: string;
  role: "admin" | "customer";
  createdAt: string;
}

export interface SessionRecord {
  token: string;
  userId: string;
  role: "admin" | "customer";
  createdAt: string;
  expiresAt: string;
}

/* ---- Customer workspace (demo account data) ---- */

export interface CustomerQuote extends BaseEntity {
  kind: "customerQuote";
  ref: string;
  item: string;
  qty: number;
  amount: string;
  status: "pending" | "approved" | "delivered";
  createdAt: string;
}

export interface Ticket extends BaseEntity {
  kind: "ticket";
  ref: string;
  subject: string;
  description: string;
  status: "open" | "in-progress" | "resolved";
  priority: "low" | "medium" | "high";
  updatedAt: string;
  replies: { from: "customer" | "support"; text: string; at: string }[];
}

export interface Installation extends BaseEntity {
  kind: "installation";
  site: string;
  vehicles: number;
  status: "scheduled" | "in-progress" | "completed";
  progress: number; // 0..100
  started: string;
  expected: string;
  steps: { label: string; done: boolean }[];
}

export interface Warranty extends BaseEntity {
  kind: "warranty";
  productName: string;
  serial: string;
  vehicle: string;
  status: "active" | "expiring" | "expired";
  started: string;
  expires: string;
}

export interface CustomerNotification extends BaseEntity {
  kind: "notification";
  text: string;
  read: boolean;
}

export interface RegisteredProduct extends BaseEntity {
  kind: "registeredProduct";
  productSlug: string;
  serial: string;
  vehicle: string;
  installedAt: string;
  status: "active" | "maintenance";
}

export interface CustomerProfile {
  userId: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  plan: string;
  memberSince: string;
  registeredProducts: RegisteredProduct[];
  savedProductSlugs: string[];
  quotes: CustomerQuote[];
  tickets: Ticket[];
  installations: Installation[];
  warranties: Warranty[];
  notifications: CustomerNotification[];
  fleetPlatformUrl: string;
}

export interface Db extends AboutData {
  version: number;
  updatedAt: string;
  settings: CompanySettings;
  heroSlides: HeroSlide[];
  stats: Stat[];
  products: Product[];
  productCategories: ProductCategory[];
  industries: Industry[];
  caseStudies: CaseStudy[];
  customerLogos: CustomerLogo[];
  resources: ResourceItem[];
  locations: OfficeLocation[];
  whyPoints: WhyPoint[];
  ecosystemNodes: EcosystemNode[];
  engineeringItems: EngineeringItem[];
  solutionFinder: SolutionFinderOption[];
  solutions: Solution[];
  quotes: QuoteRequest[];
  demos: DemoRequest[];
  messages: ContactMessage[];
  users: AppUser[];
  sessions: SessionRecord[];
  customers: Record<string, CustomerProfile>; // keyed by user id
}

export const ENTITY_KEYS = [
  "aboutSections", "aboutSlides", "aboutMilestones", "aboutOffices", "aboutSupport", "aboutLeaders",
  "heroSlides",
  "stats",
  "products",
  "productCategories",
  "industries",
  "caseStudies",
  "customerLogos",
  "resources",
  "locations",
  "whyPoints",
  "ecosystemNodes",
  "engineeringItems",
  "solutionFinder",
  "solutions",
  "quotes",
  "demos",
  "messages",
] as const;

export type EntityKey = (typeof ENTITY_KEYS)[number];
