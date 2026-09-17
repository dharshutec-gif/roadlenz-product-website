import { getAboutDefaults } from "./about-content";
import "server-only";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { buildSeedDb, getProductCatalog, getSolutions } from "./seed";
import { upgradeTaxiSolution, upgradeTaxiOperations } from "./taxi-content";
import { upgradePublicTransportSolution } from "./transit-content";
import { upgradeEmployeeTransportSolution } from "./employee-content";
import { upgradeAgricultureSolution } from "./agriculture-content";
import { upgradeLogisticsSolution } from "./logistics-content";
import type { Db, EntityKey } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "db.json");

let cache: { mtimeMs: number; db: Db } | null = null;

const solutionJourney: Record<string, string[]> = {
  taxi: ["Booking", "Live Trip", "Destination"],
  "school-transport": ["Pickup", "On Route", "Safe Drop-off"],
  logistics: ["Warehouse", "In Transit", "Delivered"],
  "public-transport": ["Depot", "Active Route", "Passenger Stop"],
  "employee-transport": ["Pickup Zone", "Workplace", "Return Journey"],
  mining: ["Site Entry", "Work Zone", "Safety Review"],
  agriculture: ["Field Entry", "Active Work", "Task Complete"],
};

function upgradeSolutions(db: Db) {
  const slugMap: Record<string, string> = { "cab-taxi": "taxi", "logistics-trucking": "logistics", "agriculture-equipment": "agriculture" };
  const descriptions = ["The journey begins with live operational visibility.", "Location and vehicle context remain visible while the journey is active.", "The completed stage is recorded for operational review."];
  const productReasons: Record<string, string> = {
    "roadlenz-2ch-ai-dashcam": "Adds road and driver-facing video context for safety events.",
    "roadlenz-wired-gps-tracker": "Provides continuous vehicle location and route visibility.",
    "roadlenz-4ch-mdvr-sd-storage": "Brings multiple vehicle camera feeds into one recorded evidence system.",
    "roadlenz-rfid-attendance-reader": "Connects authorised RFID events with the vehicle journey record.",
  };
  db.solutions.forEach((solution) => {
    solution.slug = slugMap[solution.slug] ?? solution.slug;
    const labels = solutionJourney[solution.slug] ?? solution.platformOutcomes.slice(0, 3);
    solution.heroCtaLabel ??= "Explore the journey";
    solution.heroCtaHref ??= "#capabilities";
    solution.mapMedia ??= solution.slug === "school-transport" ? { type: "image", src: "/media/solutions/school-transport-blue-hour.png" } : solution.heroMedia;
    solution.journeyStages ??= labels.map((title, index) => ({ title, label: title, description: descriptions[index] ?? solution.heroSummary, media: solution.heroMedia, nodeX: [6, 36, 69][index], nodeY: [64, 54, 58][index], order: index + 1 }));
    solution.capabilityTitle ??= `Built for smarter ${solution.name.toLowerCase()} operations.`;
    solution.capabilities ??= solution.keyOutcomes.slice(0, 4).map((title, index) => ({ title, icon: ["gps", "shield", "video", "users"][index], description: `${title} is brought into the same RoadLenz operational view for this solution.`, visual: index === 0 ? solution.heroMedia : { type: "image", src: solution.vehicleImage }, order: index + 1, autoSlide: true }));
    solution.recommendedProducts ??= solution.relatedProductSlugs.map((productSlug, index) => ({ productSlug, explanation: productReasons[productSlug] ?? "Connects this RoadLenz device to the recommended operational setup.", order: index + 1 }));
    solution.benefits ??= solution.platformOutcomes.slice(0, 4).map((title, index) => ({ title, description: `A clearer ${title.toLowerCase()} outcome for the transport team.`, icon: ["shield", "gauge", "route", "users"][index] ?? "check", order: index + 1 }));
    while (solution.benefits.length < 4 && solution.keyOutcomes[solution.benefits.length]) {
      const title = solution.keyOutcomes[solution.benefits.length]; solution.benefits.push({ title, description: `Operational visibility for ${title.toLowerCase()}.`, icon: "check", order: solution.benefits.length + 1 });
    }
    solution.ctaTitle ??= `Build a better ${solution.name.toLowerCase()} operation.`;
    solution.ctaSummary ??= "Talk to RoadLenz about the right connected setup for your vehicles and operating priorities.";
    solution.ctaMedia ??= solution.heroMedia;
    solution.ctaPrimaryLabel ??= "Talk to an Expert";
    solution.ctaPrimaryHref ??= `/contact?solution=${encodeURIComponent(solution.slug)}`;
    solution.ctaSecondaryLabel ??= "Request a Quote";
    solution.ctaSecondaryHref ??= `/request-quote?solution=${encodeURIComponent(solution.slug)}`;
  });
}

function upgradeSchoolTransport(db: Db) {
  const solution = db.solutions.find((item) => item.slug === "school-transport");
  if (!solution) return;
  const requiredProducts = ["roadlenz-2ch-ai-dashcam", "roadlenz-4ch-mdvr-sd-storage", "roadlenz-advanced-gps-tracker", "roadlenz-driver-monitoring-camera", "roadlenz-rfid-attendance-reader"];
  db.products.forEach((product) => { if (requiredProducts.includes(product.slug)) product.published = true; });
  solution.heroTitle = "The Route Room.";
  solution.heroSummary = "Live visibility, safer journeys and confidence at every stop. RoadLenz connects people, vehicles and routes so school transport teams can identify risks and respond with clearer operational context.";
  solution.heroMedia = { type: "image", src: "/media/solutions/roadlenz-route-room.jpg" };
  solution.mapMedia = solution.heroMedia;
  solution.heroCtaLabel = "Explore the technology";
  solution.heroCtaHref = "#school-technology";
  solution.capabilityTitle = "Route intelligence at a glance";
  solution.capabilities = [
    { title: "Live Visibility", icon: "gps", description: "See vehicle location and route progress in one operational view.", visual: solution.heroMedia, order: 1, autoSlide: false },
    { title: "Safety First", icon: "shield", description: "Bring driver, vehicle and journey safety context together.", visual: solution.heroMedia, order: 2, autoSlide: false },
    { title: "Smarter Routes", icon: "route", description: "Review route movement, stops and journey status more clearly.", visual: solution.heroMedia, order: 3, autoSlide: false },
    { title: "Operational Alerts", icon: "bell", description: "Help the right transport team respond when attention is required.", visual: solution.heroMedia, order: 4, autoSlide: false },
  ];
  solution.technologyTitle = "Technology that looks after every ride";
  solution.technologyDescription = "A connected RoadLenz device setup brings location, video and attendance context into the school transport operation.";
  solution.blueprintMedia = { type: "image", src: "/media/solutions/roadlenz-bus-blueprint.jpg" };
  solution.deviceConsoleMedia = { type: "image", src: "/media/solutions/roadlenz-device-console.jpg" };
  solution.relatedProductSlugs = requiredProducts;
  const detail: Record<string, [string, string]> = {
    "roadlenz-2ch-ai-dashcam": ["Adds road and cabin context to support safety review.", "Captures road and cabin video and connects supported event evidence to the fleet view."],
    "roadlenz-4ch-mdvr-sd-storage": ["Provides multi-camera coverage across the school vehicle.", "Records supported camera channels for live viewing and incident playback workflows."],
    "roadlenz-advanced-gps-tracker": ["Connects the school vehicle to live route visibility.", "Provides location, route history, stop and supported geofence information."],
    "roadlenz-driver-monitoring-camera": ["Adds dedicated context around driver attention and behaviour.", "Supports monitoring of configured driver-risk events and related alerts."],
    "roadlenz-rfid-attendance-reader": ["Links authorised boarding events with the vehicle journey.", "Records supported RFID attendance events for transport-team visibility."],
  };
  solution.recommendedProducts = requiredProducts.map((productSlug, index) => ({ productSlug, explanation: detail[productSlug][0], performance: detail[productSlug][1], order: index + 1 }));
  solution.benefits = [
    { title: "Safer journeys", description: "Connected visibility helps transport teams identify and review risk across the journey.", icon: "shield", order: 1 },
    { title: "Faster incident review", description: "Location and available video context support a clearer review workflow.", icon: "video", order: 2 },
    { title: "Clearer operations", description: "Route, vehicle and attendance information sits within one connected setup.", icon: "route", order: 3 },
    { title: "Greater parent confidence", description: "More visible school transport operations help teams communicate with confidence.", icon: "users", order: 4 },
  ];
  solution.painPoints ??= [
    { title: "No live visibility", description: "Transport teams need a clear view of where every bus is and what stage of the route is active.", icon: "eye", order: 1 },
    { title: "Safety events lack context", description: "Location alone is not enough when a driver, vehicle or passenger event needs review.", icon: "shield", order: 2 },
    { title: "Manual boarding follow-up", description: "Boarding and drop-off follow-up can take time when records are not connected to the journey.", icon: "calendar", order: 3 },
  ];
  solution.faqs ??= [
    { label: "How does the RFID attendance system work?", value: "RFID events can be associated with the vehicle journey to give transport teams clearer boarding visibility." },
    { label: "Can I access live tracking and video remotely?", value: "RoadLenz can bring supported vehicle location and available video context into the same operational workflow." },
    { label: "Is the system easy to install and use?", value: "The right device setup is selected around the vehicle, routes and the school transport team's operating requirements." },
  ];
  solution.ctaTitle = "Build a safer school transport operation.";
  solution.ctaSummary = "Talk to RoadLenz about a connected setup for your school vehicles and operating priorities.";
  solution.ctaMedia = { type: "image", src: "/media/solutions/roadlenz-cta-map.jpg" };
}

function upgradeSolutionProductSets(db: Db) {
  const sets: Record<string, string[]> = {
    taxi: ["roadlenz-2ch-ai-dashcam", "roadlenz-wired-gps-tracker", "roadlenz-driver-monitoring-camera"],
    "school-transport": ["roadlenz-2ch-ai-dashcam", "roadlenz-4ch-mdvr-sd-storage", "roadlenz-advanced-gps-tracker", "roadlenz-driver-monitoring-camera", "roadlenz-rfid-attendance-reader"],
    logistics: ["roadlenz-4ch-mdvr-sd-storage", "roadlenz-wired-gps-tracker", "roadlenz-2ch-ai-dashcam", "roadlenz-driver-monitoring-camera"],
    "public-transport": ["roadlenz-4ch-mdvr-sd-storage", "roadlenz-people-counting-camera", "roadlenz-wired-gps-tracker", "roadlenz-2ch-ai-dashcam"],
    "employee-transport": ["roadlenz-4ch-mdvr-sd-storage", "roadlenz-wired-gps-tracker", "roadlenz-rfid-attendance-reader", "roadlenz-driver-monitoring-camera"],
    mining: ["roadlenz-4ch-mdvr-sd-storage", "roadlenz-wired-gps-tracker", "roadlenz-2ch-ai-dashcam", "roadlenz-side-view-camera"],
    agriculture: ["roadlenz-wired-gps-tracker", "roadlenz-2ch-ai-dashcam", "roadlenz-side-view-camera", "roadlenz-4ch-mdvr-sd-storage"],
  };
  const explanations: Record<string, [string, string]> = {
    "roadlenz-2ch-ai-dashcam": ["Adds road and cabin context for safety review.", "Captures supported road, driver and event evidence."],
    "roadlenz-4ch-mdvr-sd-storage": ["Provides multi-camera recording across the vehicle.", "Supports live viewing and incident playback workflows."],
    "roadlenz-wired-gps-tracker": ["Connects the vehicle to live route visibility.", "Provides location, route history, stops and geofence context."],
    "roadlenz-advanced-gps-tracker": ["Connects the vehicle to live route visibility.", "Provides location, route history, stops and geofence context."],
    "roadlenz-driver-monitoring-camera": ["Adds dedicated driver attention and behaviour context.", "Supports configured driver-risk events and alerts."],
    "roadlenz-rfid-attendance-reader": ["Links authorised boarding events with each journey.", "Records supported RFID attendance events."],
    "roadlenz-people-counting-camera": ["Adds passenger-flow context to the operation.", "Supports boarding and occupancy visibility."],
    "roadlenz-side-view-camera": ["Extends visibility into side blind spots and work zones.", "Provides additional camera coverage for manoeuvring and review."],
  };
  const required = new Set(Object.values(sets).flat());
  db.products.forEach((product) => { if (required.has(product.slug)) product.published = true; });
  db.solutions.forEach((solution) => {
    const slugs = sets[solution.slug];
    if (!slugs) return;
    const existing = new Map((solution.recommendedProducts ?? []).map(item => [item.productSlug, item]));
    solution.relatedProductSlugs = slugs;
    solution.recommendedProducts = slugs.map((productSlug, index) => {
      const current = existing.get(productSlug);
      const detail = explanations[productSlug];
      return { productSlug, explanation: current?.explanation || detail?.[0] || "Supports this connected operation.", performance: current?.performance || detail?.[1], order: index + 1 };
    });
  });
}

function upgradeSolutionJourneys(db: Db) {
  db.solutions.forEach((solution) => {
    const labels = solutionJourney[solution.slug];
    if (!labels) return;
    const existing = (solution.journeyStages ?? []).slice().sort((a,b)=>(a.order??0)-(b.order??0));
    solution.journeyStages = labels.map((label, index) => ({
      ...(existing[index] ?? { description: "Live operational visibility throughout this stage.", media: solution.mapMedia ?? solution.heroMedia }),
      title: label,
      label,
      order: index + 1,
    }));
  });
}

function upgradeSolutionHeroes(db: Db) {
  const heroes: Record<string, { title: string; src: string }> = {
    taxi: { title: "City rides, fully visible.", src: "/media/solutions/taxi-hero.jpg" },
    "school-transport": { title: "Every school ride, accounted for.", src: "/media/solutions/school-transport-hero.jpg" },
    logistics: { title: "From dispatch to delivery, in view.", src: "/media/solutions/logistics-hero.jpg" },
    "public-transport": { title: "A clearer view of every route.", src: "/media/solutions/public-transport-hero.jpg" },
    "employee-transport": { title: "Reliable journeys for every shift.", src: "/media/solutions/employee-transport-hero.jpg" },
    mining: { title: "Visibility built for demanding sites.", src: "/media/solutions/mining-hero.jpg" },
    agriculture: { title: "Smarter work across every field.", src: "/media/solutions/agriculture-hero.jpg" },
  };
  db.solutions.forEach((solution) => {
    const hero = heroes[solution.slug];
    if (!hero) return;
    solution.heroTitle = hero.title;
    solution.heroMedia = { type: "image", src: hero.src };
  });
}

export function dbPath(): string {
  return DB_PATH;
}

export function readDb(force = false): Db {
  try {
    const stat = fs.statSync(DB_PATH);
    if (!cache || force || stat.mtimeMs !== cache.mtimeMs) {
      const raw = fs.readFileSync(DB_PATH, "utf8");
      const db = JSON.parse(raw) as Db;
      const aboutDefaults = getAboutDefaults();
      let aboutAdded = false;
      for (const key of Object.keys(aboutDefaults) as (keyof typeof aboutDefaults)[]) {
        if (!Array.isArray(db[key])) {
          Object.assign(db, { [key]: aboutDefaults[key] });
          aboutAdded = true;
        }
      }
      if (aboutAdded) writeDbRaw(db);
      if (db.version < 4 || !Array.isArray(db.productCategories)) {
        const catalog = getProductCatalog();
        db.products = catalog.products;
        db.productCategories = catalog.productCategories;
        db.version = 4;
      }
      if (db.version < 7 || !Array.isArray(db.solutions)) {
        db.solutions = getSolutions();
        const solutionProducts = new Set(["roadlenz-2ch-ai-dashcam", "roadlenz-wired-gps-tracker", "roadlenz-4ch-mdvr-sd-storage", "roadlenz-rfid-attendance-reader"]);
        const seededProducts = new Map(getProductCatalog().products.map((product) => [product.slug, product]));
        db.products.forEach((product) => {
          if (!solutionProducts.has(product.slug)) return;
          const seeded = seededProducts.get(product.slug);
          if (seeded) Object.assign(product, { image: seeded.image, tagline: seeded.tagline, published: true });
        });
        db.version = 7;
        writeDbRaw(db);
        return db;
      }
      if (db.version < 9 || db.solutions.some((solution) => !solution.capabilities || !solution.recommendedProducts || !solution.benefits)) {
        upgradeSolutions(db);
        db.version = 9;
        writeDbRaw(db);
        return db;
      }
      if (db.version < 10) {
        upgradeSchoolTransport(db);
        db.version = 10;
        writeDbRaw(db);
        return db;
      }
      if (db.version < 11) {
        upgradeSolutionProductSets(db);
        db.version = 11;
        writeDbRaw(db);
        return db;
      }
      if (db.version < 12) {
        upgradeSchoolTransport(db);
        db.version = 12;
        writeDbRaw(db);
        return db;
      }
      if (db.version < 12) {
        upgradeSolutionJourneys(db);
        db.version = 12;
        writeDbRaw(db);
        return db;
      }
      if (db.version < 13) {
        upgradeSolutionHeroes(db);
        db.version = 13;
        writeDbRaw(db);
        return db;
      }
      if (db.version < 14) {
        const taxi = db.solutions.find((solution) => solution.slug === "taxi");
        if (taxi) upgradeTaxiSolution(taxi);
        db.version = 14;
        writeDbRaw(db);
        return db;
      }
      if (db.version < 15) {
        const logistics = db.solutions.find((solution) => solution.slug === "logistics");
        if (logistics) upgradeLogisticsSolution(logistics);
        db.version = 15;
        writeDbRaw(db);
        return db;
      }
      if (db.version < 16) {
        const taxi = db.solutions.find(solution => solution.slug === "taxi");
        if (taxi) upgradeTaxiOperations(taxi);
        db.version = 16;
        writeDbRaw(db);
        return db;
      }
      if (db.version < 17) {
        const agriculture = db.solutions.find(solution => solution.slug === "agriculture");
        if (agriculture) upgradeAgricultureSolution(agriculture);
        db.version = 17;
        writeDbRaw(db);
        return db;
      }
      if (db.version < 18) {
        const employee = db.solutions.find(solution => solution.slug === "employee-transport");
        if (employee) upgradeEmployeeTransportSolution(employee);
        db.version = 18;
        writeDbRaw(db);
        return db;
      }
      if (db.version < 19) {
        const transit = db.solutions.find(solution => solution.slug === "public-transport");
        if (transit) upgradePublicTransportSolution(transit);
        db.version = 19;
        writeDbRaw(db);
        return db;
      }
      cache = { mtimeMs: stat.mtimeMs, db };
      return db;
    }
    return cache.db;
  } catch {
    // First run: seed the store.
    const db = buildSeedDb();
    writeDbRaw(db);
    return db;
  }
}

function writeDbRaw(db: Db): void {
  db.updatedAt = new Date().toISOString();
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  const tmp = DB_PATH + ".tmp";
  fs.writeFileSync(tmp, JSON.stringify(db, null, 2), "utf8");
  fs.renameSync(tmp, DB_PATH);
  cache = null;
}

/** Mutator: reads db, applies fn, persists atomically. Returns the new db. */
export function mutateDb<T>(fn: (db: Db) => T): T {
  const db = readDb(true);
  const out = fn(db);
  writeDbRaw(db);
  return out;
}

export function newId(prefix: string): string {
  return `${prefix}_${crypto.randomBytes(5).toString("hex")}`;
}

export function listEntity<T = Record<string, any>>(db: Db, key: EntityKey): T[] {
  const items = db[key] as unknown as { id: string; order: number }[];
  return [...items].sort((a, b) => a.order - b.order) as unknown as T[];
}

export function publishedOf<T = Record<string, any>>(items: T[]): T[] {
  return items.filter((i) => (i as { published: boolean }).published);
}

export function createEntity(db: Db, key: EntityKey, data: Record<string, unknown>) {
  const items = db[key] as unknown as { id: string; order: number }[];
  const now = new Date().toISOString();
  const id = newId(key);
  const order = items.length ? Math.max(...items.map((i) => i.order)) + 1 : 1;
  const item = { id, order, published: true, createdAt: now, updatedAt: now, ...data };
  (db[key] as unknown as unknown[]).push(item);
  return item;
}

export function updateEntity(db: Db, key: EntityKey, id: string, data: Record<string, unknown>) {
  const items = db[key] as unknown as { id: string }[];
  const item = items.find((i) => i.id === id);
  if (!item) return null;
  Object.assign(item, data, { id: item.id, updatedAt: new Date().toISOString() });
  return item;
}

export function deleteEntity(db: Db, key: EntityKey, id: string) {
  const items = db[key] as unknown as { id: string; order: number }[];
  const idx = items.findIndex((i) => i.id === id);
  if (idx === -1) return false;
  items.splice(idx, 1);
  items.forEach((i, n) => (i.order = n + 1));
  return true;
}

export function reorderEntity(db: Db, key: EntityKey, ids: string[]) {
  const items = db[key] as unknown as { id: string; order: number }[];
  const map = new Map(items.map((i) => [i.id, i]));
  ids.forEach((id, n) => {
    const it = map.get(id);
    if (it) it.order = n + 1;
  });
}
