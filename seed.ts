import { getAboutDefaults } from "./about-content";
import type {
  Db,
  HeroSlide,
  Stat,
  Product,
  ProductCategory,
  Industry,
  CaseStudy,
  CustomerLogo,
  ResourceItem,
  OfficeLocation,
  WhyPoint,
  EcosystemNode,
  EngineeringItem,
  SolutionFinderOption,
  Solution,
  AppUser,
  CustomerProfile,
} from "./types";
import { hashPassword } from "./auth";
import { upgradeTaxiSolution, upgradeTaxiOperations } from "./taxi-content";
import { upgradePublicTransportSolution } from "./transit-content";
import { upgradeEmployeeTransportSolution } from "./employee-content";
import { upgradeAgricultureSolution } from "./agriculture-content";
import { upgradeLogisticsSolution } from "./logistics-content";

const now = () => new Date().toISOString();
const iso = (s: string) => s;

const ent = (order: number, extra: Record<string, unknown>, published = true) => ({
  id: `seed_${order}_${Math.random().toString(36).slice(2, 8)}`,
  order,
  published,
  createdAt: iso("2025-04-12T09:00:00.000Z"),
  updatedAt: iso("2026-07-20T09:00:00.000Z"),
  ...extra,
});

/* ------------------------------------------------------------------ */
/* Hero slides                                                         */
/* ------------------------------------------------------------------ */

const heroSlides: HeroSlide[] = [
  ent(1, {
    kind: "hero",
    title: "Every Journey. One Intelligent Road.",
    subtitle:
      "Real-time visibility, video intelligence and safer mobility—connected by RoadLenz.",
    primaryCta: "Explore Solutions",
    primaryHref: "/solutions",
    secondaryCta: "Watch the Film",
    secondaryHref: "#film",
    media: { type: "video", src: "/media/video/hero-1.mp4", poster: "/media/hero/hero-1.jpg" },
    overlay: 0.52,
    duration: 11,
  }),
  ent(2, {
    kind: "hero",
    title: "Fleets that arrive on time, on budget, every time.",
    subtitle:
      "GPS tracking, video telematics and fuel analytics for transport teams that run tight.",
    primaryCta: "Explore Products",
    primaryHref: "/products",
    secondaryCta: "Book a Demo",
    secondaryHref: "/book-demo",
    media: { type: "image", src: "/media/hero/hero-2.jpg" },
    overlay: 0.5,
    duration: 9,
  }),
  ent(3, {
    kind: "hero",
    title: "Safer roads, powered by on-board AI.",
    subtitle:
      "Driver monitoring, event detection and fleet safety scores—analysed in real time.",
    primaryCta: "See the Technology",
    primaryHref: "/technology",
    secondaryCta: "Talk to an Expert",
    secondaryHref: "/contact",
    media: { type: "video", src: "/media/video/hero-3.mp4", poster: "/media/hero/hero-3.jpg" },
    overlay: 0.55,
    duration: 11,
  }),
] as unknown as HeroSlide[];

/* ------------------------------------------------------------------ */
/* Stats                                                               */
/* ------------------------------------------------------------------ */

const stats: Stat[] = [
  ent(1, { kind: "stat", label: "Years Experience", value: "10+", counter: 10, suffix: "+", icon: "compass" }),
  ent(2, { kind: "stat", label: "Vehicles Connected", value: "2,000+", counter: 2000, suffix: "+", icon: "fleet" }),
  ent(3, { kind: "stat", label: "Service and Support", value: "24/7", counter: 0, suffix: "", icon: "headset" }),
  ent(4, { kind: "stat", label: "Operations", value: "Pan-India", counter: 0, suffix: "", icon: "map" }),
] as unknown as Stat[];

/* ------------------------------------------------------------------ */
/* Products                                                            */
/* ------------------------------------------------------------------ */

const products: Product[] = [
  ent(1, {
    kind: "product",
    slug: "ai-dashcam",
    name: "AI Dashcam",
    category: "AI Cameras",
    tagline: "In-cabin and in-vehicle AI vision that sees every road event.",
    description: [
      "The RL-Vision AI Camera pair blends a forward road camera with a driver-facing camera, running on-device neural detection for lane departure, harsh braking, collision risk and driver distraction. Events stream to the RoadLenz platform in real time with video evidence attached.",
      "Housed in a compact, low-glare mount, it is engineered for Indian road conditions—dust, rain, heat and night driving—while consuming minimal power from the vehicle.",
    ],
    image: "/media/products/prod-ai-camera.png",
    gallery: ["/media/products/prod-ai-camera.png", "/media/products/prod-dashcam.png"],
    badges: [
      { label: "Road camera", value: "2K" },
      { label: "Cabin camera", value: "1080p" },
      { label: "AI events", value: "Real time" },
    ],
    features: ["Forward collision and lane-departure detection", "Driver drowsiness, distraction and phone-use alerts", "Event-linked video evidence in the RoadLenz platform", "Low-glare, vehicle-grade installation"],
    compatibility: ["9–32 V commercial and passenger vehicles", "RoadLenz platform and supported MDVR connectivity", "Professional installation and fleet commissioning available"],
    inBox: ["AI Dashcam camera unit", "Vehicle-grade power harness", "Mounting kit", "Quick-start guide"],
    specs: [
      { label: "Resolution", value: "2K forward / 1080p cabin" },
      { label: "On-device AI", value: "Lane, braking, collision, drowsiness, phone, smoke" },
      { label: "Storage", value: "32 GB local buffer, continuous loop" },
      { label: "Connectivity", value: "4G/LTE via paired MDVR or tracker" },
      { label: "Operating temp", value: "-20°C to 70°C" },
      { label: "Power", value: "9–32 V DC, < 4 W" },
    ],
    documents: [
      { name: "RL-Vision AI Camera — Data Sheet", url: "/media/documents/rl-vision-datasheet.pdf", size: "420 KB" },
      { name: "Installation Guide", url: "/media/documents/rl-vision-install.pdf", size: "1.1 MB" },
    ],
    installationGuide: { name: "AI Dashcam Installation Guide", url: "/media/documents/rl-vision-install.pdf", size: "1.1 MB" },
    warranty: { name: "RoadLenz standard product warranty", url: "" },
    price: "₹14,900 / vehicle",
    priceNote: "Indicative. Volume pricing available on request.",
    featured: true,
  }),
  ent(2, {
    published: false,
    kind: "product",
    slug: "rl-mdvr-8ch",
    name: "RL-MDVR 8CH",
    category: "MDVR Systems",
    tagline: "Rugged multi-channel in-vehicle video recorder with live streaming.",
    description: [
      "The RL-MDVR 8CH records up to eight camera channels while streaming live video over 4G for command-centre monitoring. GPS logging, event-triggered recording and dual-storage options keep evidence secure even in harsh depot environments.",
      "Designed for buses, trucks and special-purpose vehicles, it pairs with the RoadLenz platform for live view, playback and AI event overlays.",
    ],
    image: "/media/products/prod-mdvr.png",
    specs: [
      { label: "Channels", value: "8× 1080p / 4× 2K" },
      { label: "Streaming", value: "4G/LTE live, H.265" },
      { label: "Storage", value: "2× 2 TB HDD + 256 GB SSD (configurable)" },
      { label: "GPS", value: "Built-in GNSS, 1 Hz logging" },
      { label: "Ingress", value: "16 digital I/O, 4 RS-232/485" },
      { label: "Ingress", value: "IP65 front, DIN rail or panel mount" },
    ],
    documents: [
      { name: "RL-MDVR 8CH — Data Sheet", url: "/media/documents/rl-mdvr-datasheet.pdf", size: "560 KB" },
      { name: "Wiring Diagrams", url: "/media/documents/rl-mdvr-wiring.pdf", size: "2.3 MB" },
    ],
    price: "On request",
    priceNote: "Priced per configuration. Share your fleet mix for a quote.",
    featured: true,
  }),
  ent(3, {
    published: false,
    kind: "product",
    slug: "rl-track-pro",
    name: "RL-Track Pro",
    category: "GPS Trackers",
    tagline: "Precision GPS tracking with fuel analytics and I/O control.",
    description: [
      "A compact, low-power tracker delivering 1 Hz position logging, geofencing, speed and engine-status reporting, plus two digital I/O lines for ignition, doors and accessories. Ideal as the backbone for mixed fleets and shared vehicles.",
      "Pairs with the RoadLenz platform for live tracking, route replay, trip reports and maintenance alerts.",
    ],
    image: "/media/products/prod-gps.png",
    specs: [
      { label: "Positioning", value: "GPS / GLONASS / Galileo / NavIC" },
      { label: "Logging", value: "1 Hz position + engine telemetry" },
      { label: "I/O", value: "2 digital, 2 analog, CAN-bus ready" },
      { label: "Battery backup", value: "720 mAh, 6 h standby" },
      { label: "Power", value: "9–16 V DC, 80 mA" },
      { label: "Operating temp", value: "-40°C to 85°C" },
    ],
    documents: [
      { name: "RL-Track Pro — Data Sheet", url: "/media/documents/rl-track-datasheet.pdf", size: "380 KB" },
    ],
    price: "₹4,900 / vehicle",
    priceNote: "Indicative. Platform subscription billed separately.",
    featured: true,
  }),
  ent(4, {
    published: false,
    kind: "product",
    slug: "rl-dash-2k",
    name: "RL-Dash 2K",
    category: "Dash Cameras",
    tagline: "Dual-lens 2K dash camera with event lock and night vision.",
    description: [
      "Front and rear 2K capture with starlight low-light sensors, automatic event locking on impact or hard braking, and timestamped trip recording. The simplest way to add road evidence to any vehicle in the fleet.",
      "Clips sync to the RoadLenz platform over 4G or on depot Wi-Fi, with driver-facing mode for shared fleets.",
    ],
    image: "/media/products/prod-dashcam.png",
    specs: [
      { label: "Capture", value: "2K front + 1080p rear" },
      { label: "Night vision", value: "Starlight sensor, WDR" },
      { label: "Storage", value: "Up to 512 GB microSD" },
      { label: "Sync", value: "4G LTE or Wi-Fi depot sync" },
      { label: "G-sensor", value: "3-axis, event lock" },
      { label: "Power", value: "12–24 V DC, vehicle-safe" },
    ],
    documents: [
      { name: "RL-Dash 2K — Data Sheet", url: "/media/documents/rl-dash-datasheet.pdf", size: "350 KB" },
    ],
    price: "₹6,900 / vehicle",
    priceNote: "Indicative. Fleet bundles available.",
    featured: true,
  }),
  ent(5, {
    published: false,
    kind: "product",
    slug: "rl-fuelsense",
    name: "RL-FuelSense",
    category: "Fuel Monitoring",
    tagline: "Level and theft analytics for every tank in the fleet.",
    description: [
      "A sealed, calibration-free fuel level sensor that streams tank level every 15 seconds, detects siphoning and unusual drain patterns, and closes loops with refill alerts. Built for diesel-heavy fleets where fuel is the largest controllable cost.",
      "Integrates with the RoadLenz platform for per-vehicle consumption, route-fuel efficiency and theft alerts.",
    ],
    image: "/media/products/prod-fuel.png",
    specs: [
      { label: "Accuracy", value: "±1% of tank range" },
      { label: "Reporting", value: "15 s level sync, refill detection" },
      { label: "Sensors", value: "Level + temp, 8-channel unit" },
      { label: "Housing", value: "IP67, stainless probe" },
      { label: "Integration", value: "CAN, RS-485, 4G via MDVR" },
      { label: "Compatibility", value: "Diesel, petrol, CNG tanks" },
    ],
    documents: [
      { name: "RL-FuelSense — Data Sheet", url: "/media/documents/rl-fuel-datasheet.pdf", size: "410 KB" },
    ],
    price: "₹8,500 / tank",
    priceNote: "Indicative. Multi-tank units discounted.",
    featured: true,
  }),
  ent(6, {
    published: false,
    kind: "product",
    slug: "rl-io-hub",
    name: "RL-IO Hub",
    category: "Sensors and I/O",
    tagline: "One rugged hub for doors, locks, temperature and switches.",
    description: [
      "The RL-IO Hub turns any vehicle into a data node: 8 digital inputs, 4 relay outputs and 4 analog channels read doors, curtains, locks, temperature and auxiliary switches, with per-event GPS tagging.",
      "Pair it with RL-Track Pro or RL-MDVR for cargo security, cold-chain monitoring and access control across the fleet.",
    ],
    image: "/media/products/prod-io.png",
    specs: [
      { label: "Inputs", value: "8 digital, 4 analog (0–20 V)" },
      { label: "Outputs", value: "4 relays, 30 A max" },
      { label: "Buses", value: "CAN 2.0B, RS-232/485" },
      { label: "Housing", value: "IP65 metal, DIN rail" },
      { label: "Power", value: "9–36 V DC" },
      { label: "Firmware", value: "OTA updates" },
    ],
    documents: [
      { name: "RL-IO Hub — Data Sheet", url: "/media/documents/rl-io-datasheet.pdf", size: "390 KB" },
    ],
    price: "₹9,900 / unit",
    priceNote: "Indicative. Configurable channel packs.",
    featured: true,
  }),
  ent(7, {
    published: false,
    kind: "product",
    slug: "rl-count",
    name: "RL-Count",
    category: "People Counting",
    tagline: "Occupancy and passenger counting for buses and shuttles.",
    description: [
      "Infrared people counting for bus and shuttle operators: per-door counts, seat-occupancy snapshots and route-level occupancy analytics that feed fare, load and route-planning decisions.",
      "Installs in minutes at each door, works in all lighting conditions, and reports to the RoadLenz platform with stop-level breakdowns.",
    ],
    image: "/media/products/prod-people-counting.png",
    specs: [
      { label: "Counting", value: "IR beam array, per-door" },
      { label: "Accuracy", value: "99% in normal boarding" },
      { label: "Occupancy", value: "Seat + standing snapshots" },
      { label: "Power", value: "12–24 V DC" },
      { label: "Reporting", value: "Stop-level, per-trip" },
      { label: "Mount", value: "Door-frame, tool-free" },
    ],
    documents: [
      { name: "RL-Count — Data Sheet", url: "/media/documents/rl-count-datasheet.pdf", size: "330 KB" },
    ],
    price: "₹7,400 / door",
    priceNote: "Indicative. Fleet bundles available.",
    featured: false,
  }),
  ent(8, {
    published: false,
    kind: "product",
    slug: "rl-access-rfid",
    name: "RL-Access RFID",
    category: "RFID Solutions",
    tagline: "Driver, vehicle and asset identification at every touchpoint.",
    description: [
      "A complete RFID layer for depots and gates: driver check-in, vehicle in/out, fuel-bowser matching and asset tagging. Readers at depots and gates push events straight into the platform, removing paperwork from the daily run.",
      "Works with passive UHF tags for assets and 125 kHz/13.56 MHz tags for drivers and vehicles.",
    ],
    image: "/media/products/prod-rfid.png",
    specs: [
      { label: "Frequencies", value: "125 kHz, 13.56 MHz, 860–960 MHz UHF" },
      { label: "Read range", value: "Up to 6 m (UHF)" },
      { label: "Readers", value: "Gate, counter and bowser mounts" },
      { label: "Interface", value: "RS-232/485, TCP/IP" },
      { label: "Tags", value: "Passive UHF + LF/MF options" },
      { label: "Integration", value: "RoadLenz platform, API" },
    ],
    documents: [
      { name: "RL-Access RFID — Data Sheet", url: "/media/documents/rl-rfid-datasheet.pdf", size: "360 KB" },
    ],
    price: "On request",
    priceNote: "Quoted per reader configuration and site survey.",
    featured: false,
  }),
] as unknown as Product[];

const productCategories: ProductCategory[] = [
  "AI Dashcams", "MDVR Systems", "Vehicle CCTV Cameras", "GPS Tracking Devices", "AI Safety Systems", "Passenger & RFID Solutions",
].map((name, index) => ent(index + 1, { kind: "productCategory", name, slug: name.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""), description: `RoadLenz ${name} product range.` })) as unknown as ProductCategory[];

const catalogNames: [string, string][] = [
  ["AI Dashcams", "RoadLenz Wi‑Fi Dashcam"],
  ["AI Dashcams", "RoadLenz 2CH AI Dashcam"],
  ["AI Dashcams", "RoadLenz 3CH AI Dashcam"],
  ["AI Dashcams", "RoadLenz 4CH AI Dashcam"],
  ["MDVR Systems", "RoadLenz 4CH MDVR – SD Storage"],
  ["MDVR Systems", "RoadLenz 4CH MDVR – SSD Storage"],
  ["MDVR Systems", "RoadLenz 8CH MDVR – SD Storage"],
  ["MDVR Systems", "RoadLenz 8CH MDVR – SSD Storage"],
  ["MDVR Systems", "RoadLenz High-Channel MDVR – 10CH / 12CH"],
  ["Vehicle CCTV Cameras", "RoadLenz Dome Camera"],
  ["Vehicle CCTV Cameras", "RoadLenz Infrared Dome Camera"],
  ["Vehicle CCTV Cameras", "RoadLenz Bullet Camera"],
  ["Vehicle CCTV Cameras", "RoadLenz Front Road Camera"],
  ["Vehicle CCTV Cameras", "RoadLenz Rear View Camera"],
  ["Vehicle CCTV Cameras", "RoadLenz Reverse / Parking Camera"],
  ["Vehicle CCTV Cameras", "RoadLenz Side View Camera"],
  ["Vehicle CCTV Cameras", "RoadLenz Fisheye Camera"],
  ["Vehicle CCTV Cameras", "RoadLenz Driver Monitoring Camera"],
  ["Vehicle CCTV Cameras", "RoadLenz People Counting Camera"],
  ["GPS Tracking Devices", "RoadLenz Wired GPS Tracker"],
  ["GPS Tracking Devices", "RoadLenz Advanced GPS Tracker"],
  ["GPS Tracking Devices", "RoadLenz GPS + Video Device"],
  ["GPS Tracking Devices", "RoadLenz Personal Tracker"],
  ["AI Safety Systems", "RoadLenz ADAS System"],
  ["AI Safety Systems", "RoadLenz DMS System"],
  ["AI Safety Systems", "RoadLenz ADAS + DMS System"],
  ["AI Safety Systems", "RoadLenz AI Event Platform"],
  ["Passenger & RFID Solutions", "RoadLenz People Counting System"],
  ["Passenger & RFID Solutions", "RoadLenz RFID Attendance Reader"],
  ["Passenger & RFID Solutions", "RoadLenz School Bus RFID System"],
  ["Passenger & RFID Solutions", "RoadLenz Passenger Validation System"],
];

const productSlug = (name: string) => name.toLowerCase().replace(/wi‑fi/g, "wifi").replace(/&/g, "and").replace(/\+/g, "plus").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const solutionProductTaglines: Record<string, string> = {
  "RoadLenz 2CH AI Dashcam": "See every road and driver event.",
  "RoadLenz Wired GPS Tracker": "Know every bus location in real time.",
  "RoadLenz 4CH MDVR – SD Storage": "Record every angle with reliable evidence.",
  "RoadLenz RFID Attendance Reader": "Verify every student boarding event.",
};
const solutionProductImages: Record<string, string> = {
  "RoadLenz 2CH AI Dashcam": "/media/products/prod-ai-camera.png",
  "RoadLenz Wired GPS Tracker": "/media/products/prod-gps.png",
  "RoadLenz 4CH MDVR – SD Storage": "/media/products/prod-mdvr.png",
  "RoadLenz RFID Attendance Reader": "/media/products/prod-rfid.png",
};
const catalogProducts: Product[] = catalogNames.map(([category, name], index) => {
  const featured = name === "RoadLenz 2CH AI Dashcam";
  const published = ["RoadLenz 2CH AI Dashcam", "RoadLenz Wired GPS Tracker", "RoadLenz 4CH MDVR – SD Storage", "RoadLenz RFID Attendance Reader"].includes(name);
  return ent(index + 1, {
    kind: "product", category, name, slug: productSlug(name),
    tagline: solutionProductTaglines[name] ?? "RoadLenz vehicle intelligence hardware, configurable for professional fleet deployment.",
    description: featured ? ["The RoadLenz 2CH AI Dashcam combines forward-road and driver-facing video with on-device safety intelligence, event capture and connected fleet visibility.", "Designed for demanding vehicle environments, it gives operations teams reliable evidence and actionable driver-safety alerts through the RoadLenz platform."] : [],
    image: solutionProductImages[name] ?? "",
    gallery: featured ? ["/media/products/prod-ai-camera.png", "/media/products/prod-dashcam.png"] : [],
    badges: featured ? [{ label: "Channels", value: "2CH" }, { label: "Road camera", value: "2K" }, { label: "AI alerts", value: "Real time" }] : [],
    features: featured ? ["Forward collision and lane-departure alerts", "Driver drowsiness and distraction detection", "Event-linked video evidence", "Connected RoadLenz fleet visibility"] : [],
    specs: featured ? [{ label: "Video", value: "2K road / 1080p cabin" }, { label: "Connectivity", value: "4G LTE and Wi‑Fi" }, { label: "Storage", value: "Local loop recording" }, { label: "Power", value: "9–32 V DC" }] : [],
    compatibility: featured ? ["Commercial and passenger vehicles with 9–32 V electrical systems", "RoadLenz cloud platform", "Professional fleet installation"] : [],
    inBox: featured ? ["RoadLenz 2CH AI Dashcam", "Vehicle power harness", "Mounting kit", "Quick-start guide"] : [],
    documents: featured ? [{ name: "2CH AI Dashcam Datasheet", url: "/media/documents/rl-vision-datasheet.pdf", size: "420 KB" }] : [],
    installationGuide: featured ? { name: "2CH AI Dashcam Installation Guide", url: "/media/documents/rl-vision-install.pdf", size: "1.1 MB" } : undefined,
    warranty: featured ? { name: "RoadLenz standard product warranty", url: "" } : undefined,
    relatedProductSlugs: [], price: "On request", priceNote: "GST and installation are confirmed at quotation.", featured,
  }, published) as unknown as Product;
});

const solutions: Solution[] = [
  ent(1, {
    kind: "solution",
    name: "Taxi & Cab",
    slug: "cab-taxi",
    industry: "Passenger Mobility",
    heroTitle: "Safer trips. Accountable drivers. Visible fleets.",
    heroSummary: "Connect every cab with live location, in-cabin intelligence and event evidence that helps operators protect passengers and improve utilisation.",
    heroMedia: { type: "image", src: "/media/vehicles/veh-cab.png" },
    vehicleImage: "/media/vehicles/veh-cab.png",
    abstractPreviewImage: "/media/solutions/preview-cab-taxi.svg",
    relatedProductSlugs: ["roadlenz-2ch-ai-dashcam", "roadlenz-wired-gps-tracker", "roadlenz-driver-monitoring-camera"],
    keyOutcomes: ["Fleet Safety", "Video Telematics", "GPS Tracking", "Driver Monitoring", "Smart Surveillance"],
    productCallouts: [{ label: "roadlenz-2ch-ai-dashcam", value: "top-left|AI Dashcam" }, { label: "roadlenz-wired-gps-tracker", value: "top-right|GPS Tracker" }],
    platformOutcomes: ["Safer Trips", "Verified Events", "Fleet Visibility"],
    bestFor: ["Taxi fleets", "Ride operators", "Corporate cabs"],
    sequenceNumber: 1,
    featured: true,
  }),
  ent(2, {
    kind: "solution",
    name: "School Transport",
    slug: "school-transport",
    industry: "Student Mobility",
    heroTitle: "Every child's journey, visible and protected.",
    heroSummary: "One connected system for school-bus visibility, driver safety, video evidence and verified boarding.",
    heroMedia: { type: "image", src: "/media/vehicles/veh-school.png" },
    vehicleImage: "/media/vehicles/veh-school.png",
    abstractPreviewImage: "/media/solutions/preview-school-transport.svg",
    relatedProductSlugs: ["roadlenz-2ch-ai-dashcam", "roadlenz-wired-gps-tracker", "roadlenz-4ch-mdvr-sd-storage", "roadlenz-rfid-attendance-reader"],
    keyOutcomes: ["Passenger Monitoring", "GPS Tracking", "Driver Monitoring", "Fleet Safety", "Smart Surveillance"],
    productCallouts: [{ label: "roadlenz-2ch-ai-dashcam", value: "top-left|AI Dashcam" }, { label: "roadlenz-wired-gps-tracker", value: "top-right|GPS Tracker" }, { label: "roadlenz-4ch-mdvr-sd-storage", value: "bottom-left|4CH MDVR" }, { label: "roadlenz-rfid-attendance-reader", value: "bottom-right|RFID Reader" }],
    platformOutcomes: ["Live Location", "Video Evidence", "School Alerts"],
    bestFor: ["Schools", "School-bus operators", "Parents and transport teams"],
    sequenceNumber: 2,
    featured: false,
  }),
  ent(3, {
    kind: "solution",
    name: "Logistics & Trucking",
    slug: "logistics-trucking",
    industry: "Freight Operations",
    heroTitle: "Keep every load, driver and kilometre in view.",
    heroSummary: "Combine video evidence, live tracking and driver intelligence to manage long-haul risk, route performance and fleet uptime.",
    heroMedia: { type: "image", src: "/media/vehicles/veh-trucking.png" },
    vehicleImage: "/media/vehicles/veh-trucking.png",
    abstractPreviewImage: "/media/solutions/preview-logistics-trucking.svg",
    relatedProductSlugs: ["roadlenz-2ch-ai-dashcam", "roadlenz-wired-gps-tracker", "roadlenz-4ch-mdvr-sd-storage"],
    keyOutcomes: ["Fuel Monitoring", "GPS Tracking", "Video Telematics", "Driver Monitoring", "Fleet Safety"],
    productCallouts: [{ label: "roadlenz-2ch-ai-dashcam", value: "top-left|AI Dashcam" }, { label: "roadlenz-wired-gps-tracker", value: "top-right|GPS Tracker" }, { label: "roadlenz-4ch-mdvr-sd-storage", value: "bottom-left|4CH MDVR" }],
    platformOutcomes: ["Route Visibility", "Incident Evidence", "Driver Insights"],
    bestFor: ["Logistics fleets", "Long-haul operators", "Distribution teams"],
    sequenceNumber: 3,
    featured: false,
  }),
  ent(4, {
    kind: "solution",
    name: "Public Transport",
    slug: "public-transport",
    industry: "Mass Transit",
    heroTitle: "Connected visibility for every route and passenger.",
    heroSummary: "Give control rooms a clearer view of bus location, passenger environments, driver events and recorded evidence across the network.",
    heroMedia: { type: "image", src: "/media/vehicles/veh-public.png" },
    vehicleImage: "/media/vehicles/veh-public.png",
    abstractPreviewImage: "/media/solutions/preview-public-transport.svg",
    relatedProductSlugs: ["roadlenz-4ch-mdvr-sd-storage", "roadlenz-wired-gps-tracker", "roadlenz-2ch-ai-dashcam"],
    keyOutcomes: ["Passenger Monitoring", "Video Telematics", "GPS Tracking", "Smart Surveillance", "Fleet Safety"],
    productCallouts: [{ label: "roadlenz-4ch-mdvr-sd-storage", value: "top-left|4CH MDVR" }, { label: "roadlenz-wired-gps-tracker", value: "top-right|GPS Tracker" }, { label: "roadlenz-2ch-ai-dashcam", value: "bottom-left|AI Dashcam" }],
    platformOutcomes: ["Network Visibility", "Passenger Safety", "Event Evidence"],
    bestFor: ["City bus fleets", "Transit contractors", "Control rooms"],
    sequenceNumber: 4,
    featured: false,
  }),
  ent(5, {
    kind: "solution",
    name: "Employee Transport",
    slug: "employee-transport",
    industry: "Workforce Mobility",
    heroTitle: "Reliable workforce journeys, from pickup to drop.",
    heroSummary: "Connect shuttle location, driver behaviour and passenger events so transport teams can deliver safer, more dependable employee mobility.",
    heroMedia: { type: "image", src: "/media/vehicles/veh-employee.png" },
    vehicleImage: "/media/vehicles/veh-employee.png",
    abstractPreviewImage: "/media/solutions/preview-employee-transport.svg",
    relatedProductSlugs: ["roadlenz-wired-gps-tracker", "roadlenz-2ch-ai-dashcam", "roadlenz-rfid-attendance-reader"],
    keyOutcomes: ["Passenger Monitoring", "GPS Tracking", "Driver Monitoring", "Fleet Safety", "Video Telematics"],
    productCallouts: [{ label: "roadlenz-wired-gps-tracker", value: "top-left|GPS Tracker" }, { label: "roadlenz-2ch-ai-dashcam", value: "top-right|AI Dashcam" }, { label: "roadlenz-rfid-attendance-reader", value: "bottom-left|RFID Reader" }],
    platformOutcomes: ["On-time Mobility", "Driver Accountability", "Passenger Visibility"],
    bestFor: ["Corporate transport", "BPO fleets", "Industrial shuttles"],
    sequenceNumber: 5,
    featured: false,
  }),
  ent(6, {
    kind: "solution",
    name: "Mining",
    slug: "mining",
    industry: "Extractive Operations",
    heroTitle: "Haulage that is tracked, fuelled and safe in the harshest ground.",
    heroSummary: "Rugged tracking, fuel analytics and equipment protection for mines where GPS can vanish and uptime is everything.",
    heroMedia: { type: "image", src: "/media/vehicles/veh-mining.png" },
    vehicleImage: "/media/vehicles/veh-mining.png",
    abstractPreviewImage: "/media/solutions/preview-mining.svg",
    relatedProductSlugs: ["roadlenz-wired-gps-tracker", "roadlenz-2ch-ai-dashcam", "roadlenz-4ch-mdvr-sd-storage"],
    keyOutcomes: ["GPS Tracking", "Fuel Monitoring", "Video Telematics", "Smart Surveillance", "Fleet Safety"],
    productCallouts: [{ label: "roadlenz-wired-gps-tracker", value: "top-left|GPS Tracker" }, { label: "roadlenz-2ch-ai-dashcam", value: "top-right|AI Dashcam" }, { label: "roadlenz-4ch-mdvr-sd-storage", value: "bottom-left|4CH MDVR" }],
    platformOutcomes: ["Haul Tracking", "Fuel Accountability", "Asset Protection"],
    bestFor: ["Mining fleets", "Haul contractors", "Site operations"],
    sequenceNumber: 6,
    featured: false,
  }),
  ent(7, {
    kind: "solution",
    name: "Agriculture & Equipment",
    slug: "agriculture-equipment",
    industry: "Off-road Assets",
    heroTitle: "Know where equipment works, idles and moves.",
    heroSummary: "Bring tractors and field equipment into one operational view with rugged tracking, usage visibility and evidence for remote assets.",
    heroMedia: { type: "image", src: "/media/vehicles/veh-agriculture.png" },
    vehicleImage: "/media/vehicles/veh-agriculture.png",
    abstractPreviewImage: "/media/solutions/preview-agriculture-equipment.svg",
    relatedProductSlugs: ["roadlenz-wired-gps-tracker", "roadlenz-2ch-ai-dashcam"],
    keyOutcomes: ["GPS Tracking", "Fuel Monitoring", "Smart Surveillance", "Fleet Safety", "Driver Monitoring"],
    productCallouts: [{ label: "roadlenz-wired-gps-tracker", value: "top-left|GPS Tracker" }, { label: "roadlenz-2ch-ai-dashcam", value: "top-right|AI Dashcam" }],
    platformOutcomes: ["Asset Location", "Usage Visibility", "Remote Oversight"],
    bestFor: ["Agriculture fleets", "Equipment owners", "Field operations"],
    sequenceNumber: 7,
    featured: false,
  }),
] as unknown as Solution[];

/* ------------------------------------------------------------------ */
/* Industries                                                          */
/* ------------------------------------------------------------------ */

const industries: Industry[] = [
  ent(1, {
    kind: "industry",
    slug: "agriculture",
    name: "Agriculture",
    shortName: "Agriculture",
    tagline: "Protect crops, equipment and harvest hours on the move.",
    summary: [
      "Farm transport runs on thin windows and long rural roads. RoadLenz gives growers and agri-logistics teams live visibility of tractors and harvest vehicles, theft protection for high-value equipment, and fuel analytics that make every tank count.",
    ],
    image: "/media/vehicles/veh-agriculture.png",
    vehicleImage: "/media/vehicles/veh-agriculture.png",
    challenges: [
      "High-value tractors and harvesters at risk of theft between farms",
      "Unclear fuel usage across seasonal contracts",
      "Poor connectivity on rural routes breaks standard trackers",
    ],
    outcomes: [
      "Geofenced equipment with instant theft alerts",
      "Per-trip fuel and duty reports for contract settlements",
      "Offline-tolerant tracking with store-and-forward",
    ],
    capabilities: [
      "GPS & asset tracking",
      "Fuel monitoring",
      "Ignition & I/O control",
      "Depot geofencing",
    ],
    relatedProductSlugs: ["rl-track-pro", "rl-fuelsense", "rl-io-hub"],
    stat: { value: "Season-ready", label: "deployment in 48 h" },
  }),
  ent(2, {
    kind: "industry",
    slug: "public-transport",
    name: "Public Transport",
    shortName: "Public Transport",
    tagline: "Bus fleets that run safe, full and on schedule.",
    summary: [
      "City and intercity bus operators juggle passenger safety, seat occupancy and tight schedules. RoadLenz combines MDVR video, people counting and AI driver monitoring to give transit authorities and operators one control room for the entire fleet.",
    ],
    image: "/media/vehicles/veh-public.png",
    vehicleImage: "/media/vehicles/veh-public.png",
    challenges: [
      "Passenger safety incidents without video evidence",
      "Occupancy and fare data collected manually",
      "Driver behaviour variance across hundreds of buses",
    ],
    outcomes: [
      "Live bus view with incident video attached",
      "Stop-level occupancy analytics for route planning",
      "Fleet-wide driver safety scores and coaching loops",
    ],
    capabilities: [
      "MDVR video telematics",
      "People counting",
      "AI driver monitoring",
      "Fare & occupancy analytics",
    ],
    relatedProductSlugs: ["rl-mdvr-8ch", "rl-count", "rl-vision-ai-camera"],
    stat: { value: "One console", label: "for the whole fleet" },
  }),
  ent(3, {
    kind: "industry",
    slug: "trucking-logistics",
    name: "Trucking and Logistics",
    shortName: "Trucking",
    tagline: "Every truck, every tank, every minute—under control.",
    summary: [
      "For 3PLs and fleet operators, margin lives in utilisation and fuel. RoadLenz connects tracking, fuel sensors, video and driver scores into a single operating picture—so dispatchers act on what trucks are actually doing, not what the TMS says.",
    ],
    image: "/media/vehicles/veh-trucking.png",
    vehicleImage: "/media/vehicles/veh-trucking.png",
    challenges: [
      "Fuel leakage and unauthorised siphoning erode margins",
      "Empty-return and idle-time costs stay invisible",
      "Dispute resolution without road evidence",
    ],
    outcomes: [
      "Fuel theft alerts with GPS-stamped video",
      "Idle, detour and empty-return reporting",
      "Defensible evidence for claims and disputes",
    ],
    capabilities: [
      "Live fleet tracking",
      "Fuel & theft analytics",
      "Dash & MDVR evidence",
      "Driver safety scoring",
    ],
    relatedProductSlugs: ["rl-track-pro", "rl-fuelsense", "rl-dash-2k", "rl-mdvr-8ch"],
    stat: { value: "Tank-level", label: "fuel visibility" },
  }),
  ent(4, {
    kind: "industry",
    slug: "cab-taxi",
    name: "Cab and Taxi",
    shortName: "Cab & Taxi",
    tagline: "Ride-safe. Ride-verified. Ride-profitable.",
    summary: [
      "Aggregators and taxi fleets depend on trust between riders, drivers and operations. RoadLenz adds verified trips, in-cabin AI and live vehicle status—helping operators protect riders, defend drivers, and cut dead running.",
    ],
    image: "/media/vehicles/veh-cab.png",
    vehicleImage: "/media/vehicles/veh-cab.png",
    challenges: [
      "Rider-safety incidents lack objective evidence",
      "Driver behaviour varies with no systematic feedback",
      "Dead running and detours squeeze per-trip economics",
    ],
    outcomes: [
      "In-cabin AI for distraction and occupancy detection",
      "Per-trip evidence archive for disputes",
      "Utilisation and detour analytics per driver",
    ],
    capabilities: [
      "In-cabin AI monitoring",
      "Trip verification & GPS",
      "Fuel and utilisation analytics",
      "Driver score cards",
    ],
    relatedProductSlugs: ["rl-vision-ai-camera", "rl-track-pro", "rl-dash-2k"],
    stat: { value: "Trip-level", label: "evidence archive" },
  }),
  ent(5, {
    kind: "industry",
    slug: "school-transport",
    name: "School Transport",
    shortName: "School Transport",
    tagline: "Every child's bus, seen and safe, on every route.",
    summary: [
      "Schools and transport societies need absolute assurance that every bus, driver and child is accounted for. RoadLenz pairs GPS tracking, in-bus video and live alerts so parents and authorities can see each bus in real time—without chasing phone calls.",
    ],
    image: "/media/vehicles/veh-school.png",
    vehicleImage: "/media/vehicles/veh-school.png",
    challenges: [
      "Parents demand live visibility of their child's bus",
      "Driver behaviour on school routes is a safety-critical risk",
      "Manual stop checks and attendance follow-up",
    ],
    outcomes: [
      "Parent-facing live bus status and arrival alerts",
      "AI driver monitoring with speed and behaviour rules",
      "Digital stop verification with door and door-sensor events",
    ],
    capabilities: [
      "Parent communication layer",
      "AI driver monitoring",
      "Live tracking & ETA",
      "Stop & door event logging",
    ],
    relatedProductSlugs: ["rl-track-pro", "rl-vision-ai-camera", "rl-mdvr-8ch"],
    stat: { value: "Parent-level", label: "route assurance" },
  }),
  ent(6, {
    kind: "industry",
    slug: "mining",
    name: "Mining",
    shortName: "Mining",
    tagline: "Haulage that is tracked, fuelled and safe in the harshest ground.",
    summary: [
      "Mines run precision haulage where GPS can vanish and fuel burn is enormous. RoadLenz's rugged tracking and fuel systems work off the grid, keep haul cycles honest and protect high-value equipment on site and in transit.",
    ],
    image: "/media/vehicles/veh-mining.png",
    vehicleImage: "/media/vehicles/veh-mining.png",
    challenges: [
      "Fuel and duty-hour leaks across large haul fleets",
      "Equipment theft at remote sites",
      "Downtime from unreported breakdowns",
    ],
    outcomes: [
      "Per-haul fuel and cycle-time reporting",
      "Site geofencing with tamper alerts",
      "Breakdown and idle alerts before they stack",
    ],
    capabilities: [
      "Off-grid tracking",
      "Fuel analytics",
      "Equipment geofencing",
      "Downtime alerts",
    ],
    relatedProductSlugs: ["rl-track-pro", "rl-fuelsense", "rl-io-hub"],
    stat: { value: "Haul-level", label: "accountability" },
  }),
  ent(7, {
    kind: "industry",
    slug: "employee-transport",
    name: "Employee Transport",
    shortName: "Employee",
    tagline: "Staff shuttle runs that are punctual, safe and easy to manage.",
    summary: [
      "Corporate shuttle operations live on schedules, seat utilisation and employee confidence. RoadLenz gives HR and transport vendors live route visibility, driver scores and occupancy data—turning the shuttle into a service employees trust.",
    ],
    image: "/media/vehicles/veh-employee.png",
    vehicleImage: "/media/vehicles/veh-employee.png",
    challenges: [
      "Delayed shuttles with no live explanation",
      "Rigid route costs with uneven seat usage",
      "Safety assurance for late-night routes",
    ],
    outcomes: [
      "Live route and delay visibility for HR and employees",
      "Occupancy-driven route and seat rationalisation",
      "Driver safety scores with night-route video assurance",
    ],
    capabilities: [
      "Live shuttle tracking",
      "Occupancy analytics",
      "Driver monitoring",
      "Employee status layer",
    ],
    relatedProductSlugs: ["rl-track-pro", "rl-vision-ai-camera", "rl-count"],
    stat: { value: "Seat-level", label: "utilisation insight" },
  }),
] as unknown as Industry[];

/* ------------------------------------------------------------------ */
/* Case study (unapproved — placeholder until customer verified)       */
/* ------------------------------------------------------------------ */

const caseStudies: CaseStudy[] = [
  ent(1, {
    kind: "caseStudy",
    client: "[Customer name — pending approval]",
    title: "City bus operator brings video intelligence to 60+ buses",
    location: "Chennai, Tamil Nadu",
    image: "/media/spotlight/spot-depot.jpg",
    challenge:
      "The operator was managing a growing city bus fleet with paper-based checks and no objective record of driver behaviour or passenger incidents.",
    solution:
      "RoadLenz deployed RL-MDVR 8CH with in-bus AI cameras, people counting and the RoadLenz command centre, covering every route with live video and driver safety scoring.",
    technology: ["RL-MDVR 8CH", "RL-Vision AI Camera", "RL-Count", "RoadLenz Platform"],
    results: [
      { metric: "[Result pending approval]", note: "Verified figures appear here once the customer clears publication." },
      { metric: "[Result pending approval]", note: "Verified figures appear here once the customer clears publication." },
    ],
    approved: false,
  }),
] as unknown as CaseStudy[];

/* ------------------------------------------------------------------ */
/* Customer logos — intentionally empty until uploaded & approved      */
/* ------------------------------------------------------------------ */

const customerLogos: CustomerLogo[] = [] as unknown as CustomerLogo[];

/* ------------------------------------------------------------------ */
/* Resources                                                           */
/* ------------------------------------------------------------------ */

const resources: ResourceItem[] = [
  ent(1, {
    kind: "resource",
    type: "video",
    title: "How RoadLenz AI reads the road",
    description:
      "A two-minute walkthrough of lane departure, harsh braking and driver distraction detection, from camera to alert.",
    image: "/media/resources/poster-road.jpg",
    media: { type: "video", src: "/media/video/road-demo.mp4", poster: "/media/resources/poster-road.jpg" },
    meta: "Video · 2 min",
  }),
  ent(2, {
    kind: "resource",
    type: "case-study",
    title: "Deployment spotlight — city bus fleet",
    description:
      "Challenge, deployed technology and verified outcomes from a live deployment. Customer details pending approval.",
    image: "/media/spotlight/spot-depot.jpg",
    meta: "Case study · Pending approval",
  }),
  ent(3, {
    kind: "resource",
    type: "guide",
    title: "Installation guide — RL-Vision AI Camera",
    description:
      "Step-by-step mounting, wiring and platform pairing for the RL-Vision camera pair, with depot checklists.",
    image: "/media/engineering/eng-installation.jpg",
    file: { name: "RL-Vision Installation Guide (PDF)", url: "/media/documents/rl-vision-install.pdf", size: "1.1 MB" },
    meta: "Guide · PDF",
  }),
  ent(4, {
    kind: "resource",
    type: "insight",
    title: "Fleet safety: reading your driver score",
    description:
      "What goes into a RoadLenz driver score, how events are weighted, and how operators turn scores into coaching.",
    image: "/media/resources/cam-interior.jpg",
    meta: "Insight · 5 min read",
  }),
  ent(5, {
    kind: "resource",
    type: "download",
    title: "Product data sheets — full catalogue",
    description:
      "Complete specifications for every RoadLenz hardware line, available for procurement teams.",
    image: "/media/products/prod-mdvr.png",
    file: { name: "RoadLenz Product Catalogue (PDF)", url: "/media/documents/roadlenz-catalogue.pdf", size: "3.8 MB" },
    meta: "Download · PDF",
  }),
  ent(6, {
    kind: "resource",
    type: "warranty",
    title: "Warranty policy & registration",
    description:
      "Standard warranty terms, coverage by product line, and how to register your fleet for extended coverage.",
    image: "/media/engineering/eng-support.jpg",
    meta: "Warranty · Policy",
  }),
  ent(7, {
    kind: "resource",
    type: "guide",
    title: "Fleet onboarding checklist",
    description:
      "The 14-point pre-installation checklist RoadLenz engineering teams use before rolling hardware out to a depot.",
    image: "/media/engineering/eng-testing.jpg",
    file: { name: "Onboarding Checklist (PDF)", url: "/media/documents/onboarding-checklist.pdf", size: "540 KB" },
    meta: "Guide · PDF",
  }),
  ent(8, {
    kind: "resource",
    type: "insight",
    title: "Fuel analytics: where the leaks hide",
    description:
      "Common patterns behind fuel loss in Indian fleets, and the signals that separate normal burn from siphoning.",
    image: "/media/products/prod-fuel.png",
    meta: "Insight · 6 min read",
  }),
] as unknown as ResourceItem[];

/* ------------------------------------------------------------------ */
/* Locations                                                           */
/* ------------------------------------------------------------------ */

const locations: OfficeLocation[] = [
  ent(1, {
    kind: "location",
    name: "Thirumudivakkam Head Office",
    city: "Chennai",
    region: "Tamil Nadu",
    country: "India",
    international: false,
    type: "headquarters",
    lat: 13.0268,
    lng: 80.2528,
    address: "",
    phone: "",
    email: "",
    timings: "",
    mapsLink: "",
    image: "/media/hero/hero-2.jpg",
    verified: false,
  }),
  ent(2, {
    kind: "location",
    name: "Thirumudivakkam Production & Engineering Unit-1",
    city: "Chennai",
    region: "Tamil Nadu",
    country: "India",
    international: false,
    type: "production",
    lat: 13.0232,
    lng: 80.2471,
    address: "",
    phone: "",
    email: "",
    timings: "",
    mapsLink: "",
    image: "/media/engineering/eng-testing.jpg",
    verified: false,
  }),
  ent(3, {
    kind: "location",
    name: "Kishkintha Production Unit-2",
    city: "Chennai",
    region: "Tamil Nadu",
    country: "India",
    international: false,
    type: "production",
    lat: 13.0419,
    lng: 80.2253,
    address: "",
    phone: "",
    email: "",
    timings: "",
    mapsLink: "",
    image: "/media/engineering/eng-maintenance.jpg",
    verified: false,
  }),
  ent(4, {
    kind: "location",
    name: "Bangalore Regional Office",
    city: "Bengaluru",
    region: "Karnataka",
    country: "India",
    international: false,
    type: "regional",
    lat: 12.9716,
    lng: 77.5946,
    address: "",
    phone: "",
    email: "",
    timings: "",
    mapsLink: "",
    image: "/media/hero/hero-3.jpg",
    verified: false,
  }),
  ent(5, {
    kind: "location",
    name: "United States Office",
    city: "United States",
    region: "",
    country: "United States",
    international: true,
    type: "office",
    lat: 39.8283,
    lng: -98.5795,
    address: "",
    phone: "",
    email: "",
    timings: "",
    mapsLink: "",
    image: "/media/hero/hero-1.jpg",
    verified: false,
  }),
  ent(6, {
    kind: "location",
    name: "Netherlands Office",
    city: "Netherlands",
    region: "",
    country: "Netherlands",
    international: true,
    type: "office",
    lat: 52.1326,
    lng: 5.2913,
    address: "",
    phone: "",
    email: "",
    timings: "",
    mapsLink: "",
    image: "/media/hero/hero-2.jpg",
    verified: false,
  }),
  ent(7, {
    kind: "location",
    name: "Germany Office",
    city: "Germany",
    region: "",
    country: "Germany",
    international: true,
    type: "office",
    lat: 51.1657,
    lng: 10.4515,
    address: "",
    phone: "",
    email: "",
    timings: "",
    mapsLink: "",
    image: "/media/hero/hero-3.jpg",
    verified: false,
  }),
] as unknown as OfficeLocation[];

/* ------------------------------------------------------------------ */
/* Why points / ecosystem / engineering                                */
/* ------------------------------------------------------------------ */

const whyPoints: WhyPoint[] = [
  ent(1, {
    kind: "why",
    title: "Integrated Hardware and Software",
    text: "Cameras, recorders, trackers and sensors built by the same team that builds the platform—so every part behaves as one system.",
    icon: "chip",
  }),
  ent(2, {
    kind: "why",
    title: "Professional Installation",
    text: "Trained field teams install, cable and commission every vehicle to a documented standard—no third-party guesswork.",
    icon: "wrench",
  }),
  ent(3, {
    kind: "why",
    title: "Flexible Fleet Solutions",
    text: "From 5 vehicles to 5,000, configurations scale with your fleet, budget and rollout plan—hardware, platform and support included.",
    icon: "fleet",
  }),
  ent(4, {
    kind: "why",
    title: "24/7 Technical Support",
    text: "A live support desk that answers the phone day or night, with remote diagnostics and depot-level escalation paths.",
    icon: "headset",
  }),
] as unknown as WhyPoint[];

const ecosystemNodes: EcosystemNode[] = [
  ent(1, { kind: "ecosystem", label: "AI & Analytics", text: "On-device detection plus cloud analytics that turn events into scores, trends and cost.", icon: "brain" }),
  ent(2, { kind: "ecosystem", label: "Video Monitoring", text: "Live and recorded video from MDVR, dash and AI cameras, with event-linked clips.", icon: "video" }),
  ent(3, { kind: "ecosystem", label: "GPS Tracking", text: "1 Hz live position, route replay, geofences and ETAs for every vehicle.", icon: "pin" }),
  ent(4, { kind: "ecosystem", label: "Driver Monitoring", text: "Drowsiness, distraction, phone and smoke detection with a fair, explainable score.", icon: "driver" }),
  ent(5, { kind: "ecosystem", label: "Fuel Monitoring", text: "Tank-level telemetry, refill loops and theft patterns per vehicle.", icon: "fuel" }),
  ent(6, { kind: "ecosystem", label: "Safety & Security", text: "Collision-risk alerts, panic response, tamper alerts and evidence archives.", icon: "shield" }),
] as unknown as EcosystemNode[];

const engineeringItems: EngineeringItem[] = [
  ent(1, { kind: "engineering", title: "Installation", text: "Documented, depot-ready installs by trained field teams.", image: "/media/engineering/eng-installation.jpg", icon: "wrench" }),
  ent(2, { kind: "engineering", title: "Integration", text: "CAN, TMS and ERP integrations wired into your existing systems.", image: "/media/engineering/eng-integration.jpg", icon: "plug" }),
  ent(3, { kind: "engineering", title: "Testing", text: "Every unit bench-tested and road-verified before it ships.", image: "/media/engineering/eng-testing.jpg", icon: "flask" }),
  ent(4, { kind: "engineering", title: "Configuration", text: "Fleet profiles, geofences and alert rules configured per operator.", image: "/media/engineering/eng-configuration.jpg", icon: "sliders" }),
  ent(5, { kind: "engineering", title: "Maintenance", text: "Preventive service schedules and rapid hardware swaps.", image: "/media/engineering/eng-maintenance.jpg", icon: "refresh" }),
  ent(6, { kind: "engineering", title: "Support", text: "24/7 desk with remote diagnostics and on-site escalation.", image: "/media/engineering/eng-support.jpg", icon: "headset" }),
] as unknown as EngineeringItem[];

/* ------------------------------------------------------------------ */
/* Solution finder                                                     */
/* ------------------------------------------------------------------ */

const solutionFinder: SolutionFinderOption[] = [
  ent(1, {
    kind: "finder",
    option: "Track My Fleet",
    icon: "pin",
    headline: "Live tracking with the detail dispatchers actually use",
    body: "RL-Track Pro on every vehicle puts 1 Hz position, ETA, geofences and trip reports on one map—no TMS rewrite required.",
    recommendation: "Recommended: RL-Track Pro + RoadLenz Platform",
    links: [
      { label: "View GPS Trackers", href: "/products/rl-track-pro" },
      { label: "Talk to an Expert", href: "/contact" },
    ],
  }),
  ent(2, {
    kind: "finder",
    option: "Improve Vehicle Safety",
    icon: "shield",
    headline: "Prevent incidents, then win the argument",
    body: "Forward AI cameras flag lane departure, harsh braking and collision risk in real time—and attach 30 seconds of video evidence to every event.",
    recommendation: "Recommended: RL-Vision AI Camera + RL-MDVR 8CH",
    links: [
      { label: "View AI Cameras", href: "/products/rl-vision-ai-camera" },
      { label: "See the Technology", href: "/technology" },
    ],
  }),
  ent(3, {
    kind: "finder",
    option: "Monitor Drivers",
    icon: "driver",
    headline: "A fair driver score, not a blacklist",
    body: "In-cabin AI detects drowsiness, phone use and distraction, weighted into an explainable safety score you can coach against.",
    recommendation: "Recommended: RL-Vision AI Camera (cabin) + driver scoring module",
    links: [
      { label: "View AI Cameras", href: "/products/rl-vision-ai-camera" },
      { label: "Book a Demo", href: "/book-demo" },
    ],
  }),
  ent(4, {
    kind: "finder",
    option: "Control Fuel Usage",
    icon: "fuel",
    headline: "See the tank, catch the leak",
    body: "RL-FuelSense streams tank level every 15 seconds and flags siphoning, over-refuel and abnormal drain—per vehicle, per trip.",
    recommendation: "Recommended: RL-FuelSense + fuel analytics on the platform",
    links: [
      { label: "View Fuel Monitoring", href: "/products/rl-fuelsense" },
      { label: "Request a Quote", href: "/request-quote" },
    ],
  }),
  ent(5, {
    kind: "finder",
    option: "Manage Employee Transport",
    icon: "fleet",
    headline: "Shuttles that HR can stand behind",
    body: "Live routes, occupancy and driver scores for every shuttle—plus a status layer employees and HR actually enjoy using.",
    recommendation: "Recommended: Employee Transport solution (tracking + AI + counting)",
    links: [
      { label: "Explore the Solution", href: "/industries/employee-transport" },
      { label: "Talk to an Expert", href: "/contact" },
    ],
  }),
  ent(6, {
    kind: "finder",
    option: "Improve Passenger Safety",
    icon: "shield",
    headline: "Passengers covered by camera and by process",
    body: "MDVR video, in-bus AI and people counting give transit and school operators live assurance and a defensible evidence trail.",
    recommendation: "Recommended: School / Public Transport video telematics package",
    links: [
      { label: "Explore School Transport", href: "/industries/school-transport" },
      { label: "Book a Demo", href: "/book-demo" },
    ],
  }),
] as unknown as SolutionFinderOption[];

/* ------------------------------------------------------------------ */
/* Users + demo customer workspace                                     */
/* ------------------------------------------------------------------ */

const users: AppUser[] = [
  {
    id: "user_admin",
    email: "admin@roadlenz.in",
    passwordHash: hashPassword("Admin@123"),
    name: "Admin (Demo)",
    company: "RoadLenz Intelligent Mobility",
    phone: "",
    role: "admin",
    createdAt: iso("2025-01-05T09:00:00.000Z"),
  },
  {
    id: "user_customer",
    email: "demo@customer.in",
    passwordHash: hashPassword("Customer@123"),
    name: "Arun Prakash (Demo)",
    company: "Demo Transport Pvt Ltd",
    phone: "",
    role: "customer",
    createdAt: iso("2025-06-10T09:00:00.000Z"),
  },
];

const customers: Record<string, CustomerProfile> = {
  user_customer: {
    userId: "user_customer",
    name: "Arun Prakash (Demo)",
    company: "Demo Transport Pvt Ltd",
    email: "demo@customer.in",
    phone: "",
    plan: "RoadLenz Fleet — 25 vehicles",
    memberSince: "June 2025",
    registeredProducts: [
      ent(1, { kind: "registeredProduct", productSlug: "rl-track-pro", serial: "RLT-2406-0117", vehicle: "TN 09 AB 1172", installedAt: "2025-06-24", status: "active" }),
      ent(2, { kind: "registeredProduct", productSlug: "rl-dash-2k", serial: "RLD-2406-0342", vehicle: "TN 09 AB 1172", installedAt: "2025-06-24", status: "active" }),
      ent(3, { kind: "registeredProduct", productSlug: "rl-vision-ai-camera", serial: "RLV-2407-0088", vehicle: "TN 09 CD 2210", installedAt: "2025-07-08", status: "active" }),
    ] as never,
    savedProductSlugs: ["rl-mdvr-8ch", "rl-fuelsense"],
    quotes: [
      ent(1, { kind: "customerQuote", ref: "Q-2026-0341", item: "RL-MDVR 8CH (4 units) + installation", qty: 4, amount: "On approval", status: "approved", createdAt: iso("2026-02-18T10:00:00.000Z") }),
      ent(2, { kind: "customerQuote", ref: "Q-2026-0488", item: "RL-FuelSense (25 tanks) + fuel analytics", qty: 25, amount: "Pending internal review", status: "pending", createdAt: iso("2026-07-02T10:00:00.000Z") }),
    ] as never,
    tickets: [
      ent(1, {
        kind: "ticket",
        ref: "T-1042",
        subject: "Camera feed intermittent on TN 09 CD 2210",
        description: "Forward camera drops for ~30 s at regular intervals on the OMR route.",
        status: "in-progress",
        priority: "medium",
        updatedAt: iso("2026-08-12T09:30:00.000Z"),
        replies: [
          { from: "support", text: "Thanks for the clip. We've updated the firmware on the unit and enabled packet-loss logging. Field visit scheduled for Tuesday.", at: iso("2026-08-12T09:30:00.000Z") },
        ],
      }),
      ent(2, {
        kind: "ticket",
        ref: "T-0977",
        subject: "Driver score export format",
        description: "Need monthly driver score export in CSV with route columns.",
        status: "resolved",
        priority: "low",
        updatedAt: iso("2026-06-30T15:10:00.000Z"),
        replies: [
          { from: "support", text: "CSV export with route columns is now available under Reports → Driver Scores. Let us know if the format needs tweaks.", at: iso("2026-06-30T15:10:00.000Z") },
        ],
      }),
    ] as never,
    installations: [
      ent(1, {
        kind: "installation",
        site: "Chennai Main Depot",
        vehicles: 12,
        status: "in-progress",
        progress: 66,
        started: "2026-08-04",
        expected: "2026-09-15",
        steps: [
          { label: "Site survey & vehicle audit", done: true },
          { label: "Hardware dispatch", done: true },
          { label: "On-vehicle installation (12/12)", done: false },
          { label: "Platform commissioning", done: false },
          { label: "Team training & handover", done: false },
        ],
      }),
      ent(2, {
        kind: "installation",
        site: "Bengaluru Satellite Depot",
        vehicles: 8,
        status: "completed",
        progress: 100,
        started: "2026-05-11",
        expected: "2026-06-20",
        steps: [
          { label: "Site survey & vehicle audit", done: true },
          { label: "Hardware dispatch", done: true },
          { label: "On-vehicle installation (8/8)", done: true },
          { label: "Platform commissioning", done: true },
          { label: "Team training & handover", done: true },
        ],
      }),
    ] as never,
    warranties: [
      ent(1, { kind: "warranty", productName: "RL-Track Pro", serial: "RLT-2406-0117", vehicle: "TN 09 AB 1172", status: "active", started: "2025-06-24", expires: "2027-06-24" }),
      ent(2, { kind: "warranty", productName: "RL-Dash 2K", serial: "RLD-2406-0342", vehicle: "TN 09 AB 1172", status: "expiring", started: "2025-06-24", expires: "2026-12-24" }),
      ent(3, { kind: "warranty", productName: "RL-Vision AI Camera", serial: "RLV-2407-0088", vehicle: "TN 09 CD 2210", status: "active", started: "2025-07-08", expires: "2027-07-08" }),
    ] as never,
    notifications: [
      ent(1, { kind: "notification", text: "Installation at Chennai Main Depot is 66% complete.", read: false }),
      ent(2, { kind: "notification", text: "Ticket T-1042: support team scheduled a field visit.", read: false }),
      ent(3, { kind: "notification", text: "Warranty on RLD-2406-0342 expires in 4 months. Renewal offer available.", read: true }),
    ] as never,
    fleetPlatformUrl: "",
  },
};

/* ------------------------------------------------------------------ */

export function getProductCatalog() {
  return { productCategories, products: catalogProducts };
}

export function getSolutions() {
  return solutions.map((solution) => {
    if (solution.slug === "public-transport") { const transit = structuredClone(solution); upgradePublicTransportSolution(transit); return transit; }
    if (solution.slug === "employee-transport") { const employee = structuredClone(solution); upgradeEmployeeTransportSolution(employee); return employee; }
    if (solution.slug === "agriculture") {
      const agriculture = structuredClone(solution);
      upgradeAgricultureSolution(agriculture);
      return agriculture;
    }
    if (["logistics", "logistics-trucking"].includes(solution.slug)) {
      const logistics = structuredClone(solution);
      upgradeLogisticsSolution(logistics);
      return logistics;
    }
    if (solution.slug !== "cab-taxi" && solution.slug !== "taxi") return solution;
    const taxi = structuredClone(solution);
    upgradeTaxiSolution(taxi);
    upgradeTaxiOperations(taxi);
    return taxi;
  });
}

export function buildSeedDb(): Db {
  return {
    ...getAboutDefaults(),
    version: 8,
    updatedAt: now(),
    settings: {
      name: "RoadLenz",
      legalName: "RoadLenz Intelligent Mobility",
      tagline: "Intelligent Mobility, Engineered on the Road.",
      parentCompany: "Bigfox Engineering Private Limited",
      description:
        "RoadLenz is an enterprise fleet intelligence, GPS tracking, video telematics and vehicle-safety technology company, powered by Bigfox Engineering Private Limited.",
      contact: {
        phone: "",
        email: "",
        address: "Thirumudivakkam, Chennai, Tamil Nadu, India",
        hours: "",
      },
      social: [
        { label: "LinkedIn", href: "#" },
        { label: "YouTube", href: "#" },
        { label: "X", href: "#" },
      ],
      seo: {
        title: "RoadLenz Intelligent Mobility — Fleet Intelligence, GPS Tracking & Video Telematics",
        description:
          "Real-time visibility, video intelligence and safer mobility. RoadLenz connects fleets across India with AI cameras, MDVR systems, GPS tracking and fuel monitoring—powered by Bigfox Engineering Private Limited.",
        ogImage: "/media/hero/hero-1.jpg",
      },
      solutionsHero: {
        video: "/media/video/hero-3.mp4",
        poster: "/media/hero/hero-3.jpg",
      },
      footerNote:
        "RoadLenz is a brand powered by Bigfox Engineering Private Limited. Product figures shown are indicative and configurable; final specifications are confirmed at quotation.",
    },
    heroSlides,
    stats,
    products: catalogProducts,
    productCategories,
    industries,
    caseStudies,
    customerLogos,
    resources,
    locations,
    whyPoints,
    ecosystemNodes,
    engineeringItems,
    solutionFinder,
    solutions: getSolutions(),
    quotes: [],
    demos: [],
    messages: [],
    users,
    sessions: [],
    customers,
  };
}
