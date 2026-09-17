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
  overlay: number;
  duration: number;
}

export interface Stat extends BaseEntity {
  kind: "stat";
  label: string;
  value: string;
  counter?: number;
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

export type ProductStockStatus =
  | "in-stock"
  | "low-stock"
  | "out-of-stock"
  | "available-on-order"
  | "discontinued";

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

  price: string;
  priceNote: string;
  featured: boolean;

  sku?: string;

  stockQuantity?: number;

  stockStatus?: ProductStockStatus;

  lowStockThreshold?: number;

  trackInventory?: boolean;
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
  capabilities: string[];
  relatedProductSlugs: string[];
  stat: {
    value: string;
    label: string;
  };
}

export interface CaseStudy extends BaseEntity {
  kind: "caseStudy";
  client: string;
  title: string;
  location: string;
  image: string;
  video?: MediaRef;
  challenge: string;
  solution: string;
  technology: string[];
  results: {
    metric: string;
    note: string;
  }[];
  approved: boolean;
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
  | "warranty";

export interface ResourceItem extends BaseEntity {
  kind: "resource";
  type: ResourceType;
  title: string;
  description: string;
  image: string;
  media?: MediaRef;
  file?: DocumentRef;
  meta: string;
}

export interface OfficeLocation extends BaseEntity {
  kind: "location";
  name: string;
  city: string;
  region: string;
  country: string;
  international: boolean;
  type:
    | "headquarters"
    | "production"
    | "regional"
    | "office";

  lat: number;
  lng: number;

  address: string;
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

export interface SolutionFinderOption
  extends BaseEntity {
  kind: "finder";
  option: string;
  icon: string;
  headline: string;
  body: string;
  recommendation: string;
  links: {
    label: string;
    href: string;
  }[];
}

export interface Solution extends BaseEntity {
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
}

export interface SolutionJourneyStage {
  title: string;
  label?: string;
  description: string;

  media: MediaRef;

  nodeX?: number;

  nodeY?: number;

  status?: string;

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

  social: {
    label: string;
    href: string;
  }[];

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

export interface QuoteRequest
  extends BaseEntity {
  kind: "quote";

  name: string;

  company: string;

  email: string;

  phone: string;

  fleetSize: string;

  vehicleTypes: string;

  products: string;

  message: string;

  status:
    | "new"
    | "contacted"
    | "quoted"
    | "closed";

  ref: string;
}

export interface DemoRequest
  extends BaseEntity {
  kind: "demo";

  name: string;

  company: string;

  email: string;

  phone: string;

  date: string;

  duration: string;

  topics: string;

  message: string;

  status:
    | "new"
    | "scheduled"
    | "completed";

  ref: string;
}

export interface ContactMessage
  extends BaseEntity {
  kind: "message";

  name: string;

  email: string;

  phone: string;

  subject: string;

  message: string;

  status:
    | "new"
    | "replied";

  ref: string;
}

export interface AppUser {
  id: string;

  email: string;

  passwordHash: string;

  name: string;

  company: string;

  phone: string;

  role:
    | "admin"
    | "customer";

  createdAt: string;
}

export interface SessionRecord {
  token: string;

  userId: string;

  role:
    | "admin"
    | "customer";

  createdAt: string;

  expiresAt: string;
}

/* =========================================================
   ORDERS
========================================================= */

export type CustomerOrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export type CustomerPaymentStatus =
  | "pending"
  | "paid"
  | "failed"
  | "refunded";

export interface CustomerOrderItem {
  productSlug: string;

  name: string;

  image?: string;

  quantity: number;

  unitAmount: number;

  gstRate?: number;
}

export interface CustomerOrder {
  id: string;

  orderNumber: string;

  customerUserId: string;

  createdAt: string;

  updatedAt: string;

  status: CustomerOrderStatus;

  paymentStatus: CustomerPaymentStatus;

  currency: "INR";

  items: CustomerOrderItem[];

  subtotal: number;

  gst: number;

  shipping: number;

  total: number;

  trackingNumber?: string;

  courier?: string;

  expectedDelivery?: string;

  deliveredAt?: string;

  shippingAddress?: string;

  notes?: string;
}

/* =========================================================
   INVOICES
========================================================= */

export interface CustomerInvoice {
  id: string;

  invoiceNumber: string;

  customerUserId: string;

  orderId: string;

  createdAt: string;

  amount: number;

  currency: "INR";

  paymentStatus: CustomerPaymentStatus;

  pdfUrl?: string;
}

/* =========================================================
   CUSTOMER ADDRESSES
========================================================= */

export interface CustomerAddress {
  id: string;

  label: string;

  fullName: string;

  phone: string;

  line1: string;

  line2?: string;

  city: string;

  state: string;

  postalCode: string;

  country: string;

  isDefault?: boolean;
}

/* =========================================================
   CUSTOMER QUOTATIONS
========================================================= */

export interface CustomerQuote
  extends BaseEntity {
  kind: "customerQuote";

  ref: string;

  item: string;

  qty: number;

  amount: string;

  status:
    | "pending"
    | "approved"
    | "delivered";

  createdAt: string;
}

/* =========================================================
   SUPPORT TICKETS
========================================================= */

export interface Ticket
  extends BaseEntity {
  kind: "ticket";

  ref: string;

  subject: string;

  description: string;

  status:
    | "open"
    | "in-progress"
    | "resolved";

  priority:
    | "low"
    | "medium"
    | "high";

  updatedAt: string;

  replies: {
    from:
      | "customer"
      | "support";

    text: string;

    at: string;
  }[];
}

/* =========================================================
   INSTALLATIONS
========================================================= */

export interface Installation
  extends BaseEntity {
  kind: "installation";

  site: string;

  vehicles: number;

  status:
    | "scheduled"
    | "in-progress"
    | "completed";

  progress: number;

  started: string;

  expected: string;

  steps: {
    label: string;
    done: boolean;
  }[];
}

/* =========================================================
   WARRANTY
========================================================= */

export interface Warranty
  extends BaseEntity {
  kind: "warranty";

  productName: string;

  serial: string;

  vehicle: string;

  status:
    | "active"
    | "expiring"
    | "expired";

  started: string;

  expires: string;
}

/* =========================================================
   NOTIFICATIONS
========================================================= */

export interface CustomerNotification
  extends BaseEntity {
  kind: "notification";

  text: string;

  read: boolean;
}

/* =========================================================
   REGISTERED PRODUCTS
========================================================= */

export interface RegisteredProduct
  extends BaseEntity {
  kind: "registeredProduct";

  productSlug: string;

  serial: string;

  vehicle: string;

  installedAt: string;

  status:
    | "active"
    | "maintenance";
}

/* =========================================================
   CUSTOMER PROFILE
========================================================= */

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

  addresses: CustomerAddress[];

  fleetPlatformUrl: string;
}

/* =========================================================
   DATABASE ROOT
========================================================= */

export interface Db {
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

  customers: Record<
    string,
    CustomerProfile
  >;

  orders: CustomerOrder[];

  invoices: CustomerInvoice[];
}

/* =========================================================
   CMS ENTITY KEYS
========================================================= */

export const ENTITY_KEYS = [
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

export type EntityKey =
  (typeof ENTITY_KEYS)[number];