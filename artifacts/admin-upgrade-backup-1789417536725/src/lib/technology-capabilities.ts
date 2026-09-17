import type { Product } from "./types";

export type WorkspaceKind = "fleet" | "video" | "safety" | "playback" | "reports" | "health";
export interface TechnologyMedia {
  type: "placeholder" | "image" | "video";
  src: string;
  poster?: string;
  alt: string;
  workspace: WorkspaceKind;
}
export interface TechnologyOutcome { title: string; text: string; icon: string }
export interface TechnologyStory { title: string; text: string; status: string; media: TechnologyMedia; href?: string }
export interface TechnologyCapability {
  slug: string; name: string; shortName: string; icon: string; published: boolean; order: number;
  heading: string; description: string; theme: "light" | "dark";
  hero: TechnologyMedia; workspace: TechnologyMedia;
  workspaceTitle: string; workspaceDescription: string; callouts: TechnologyOutcome[];
  outcomes: TechnologyOutcome[]; stories: TechnologyStory[]; productSlugs: string[];
}

/** The only technology media configuration. Replace type/src/poster here;
 * no component changes or product/solution record duplication are needed.
 * Empty src + placeholder renders the local illustrative workspace.
 */
const softwareScreens: Record<WorkspaceKind, string> = {
  fleet: "/media/technology/roadlenz-software/fleet-map.png",
  video: "/media/technology/roadlenz-software/live-cameras-grid.png",
  safety: "/media/technology/roadlenz-software/ai-safety-events.png",
  playback: "/media/technology/roadlenz-software/track-history.png",
  reports: "/media/technology/roadlenz-software/reports.png",
  health: "/media/technology/roadlenz-software/vehicle-details.png",
};
const media = (workspace: WorkspaceKind, alt: string): TechnologyMedia => ({ type: "image", src: softwareScreens[workspace], poster: "", workspace, alt });
const screenshot = (workspace: WorkspaceKind, src: string, alt: string): TechnologyMedia => ({ type: "image", src, poster: "", workspace, alt });
const outcome = (icon: string, title: string, text: string): TechnologyOutcome => ({ icon, title, text });
const story = (workspace: WorkspaceKind, title: string, text: string, status: string): TechnologyStory => ({ title, text, status, media: media(workspace, `${title} — RoadLenz software preview`) });

export const technologySettings = {
  eyebrow: "RoadLenz Intelligence",
  demo: { label: "Request a Live Demo", href: "/book-demo" },
  expert: { label: "Talk to an Expert", href: "/contact" },
  quote: { label: "Request Quote", href: "/request-quote" },
  ctaTitle: "Ready to run your fleet with RoadLenz Intelligence?",
  ctaDescription: "See live fleet status, video, AI safety, track history and reports working together in one RoadLenz software experience.",
  ctaBackground: "/media/hero/hero-3.jpg",
  placeholderLabel: "Illustrative workspace · placeholder",
  placeholderNote: "Preview only. No live fleet data is connected.",
  hardwareTitle: "The signal bridge",
  hardwareDescription: "Relevant vehicle hardware. One connected operational view.",
};

export const technologyCapabilities: TechnologyCapability[] = [
  {
    slug: "live-fleet", name: "Live Fleet", shortName: "Live Fleet", icon: "pin", published: true, order: 1, theme: "light",
    heading: "Know where every vehicle is. Right now.",
    description: "Bring live location, vehicle status and operational context into one clear view.",
    hero: media("fleet", "Live Fleet map and vehicle status preview"),
    workspace: media("fleet", "Live Fleet workspace with vehicle selection and route context"),
    workspaceTitle: "Your operation, in one live view.",
    workspaceDescription: "Start with location. Add the vehicle state and journey context your team needs to coordinate the next step.",
    outcomes: [outcome("pin", "Locate vehicles", "Find a vehicle and understand where it sits within the wider operation."), outcome("gauge", "Monitor vehicle state", "Review the available movement, ignition and connectivity signals together."), outcome("bell", "Identify exceptions", "Bring route and vehicle events into the same operational context."), outcome("users", "Coordinate faster", "Use a shared location view to guide your team’s next response.")],
    callouts: [outcome("pin", "Location with context", "Select a vehicle to focus the view."), outcome("gps", "Vehicle state", "Keep the available status signals close."), outcome("route", "Journey awareness", "Connect the vehicle to its route.")],
    stories: [story("fleet", "Know what is happening now.", "Move from a fleet-wide view to the vehicle that needs attention. Keep location and available status in the same workspace.", "Location and vehicle context"), story("playback", "Understand the journey behind the position.", "Look beyond a point on a map. Review available journey history when a stop, route change or arrival needs context.", "Route history alongside location"), story("health", "Give the next response a clearer starting point.", "Use the available vehicle and device signals to help distinguish an operational exception from a connectivity issue.", "A shared view for your team")],
    productSlugs: ["roadlenz-wired-gps-tracker", "roadlenz-advanced-gps-tracker", "roadlenz-2ch-ai-dashcam"],
  },
  {
    slug: "video-telematics", name: "Video Telematics", shortName: "Video", icon: "video", published: true, order: 2, theme: "dark",
    heading: "See the full story behind every journey.",
    description: "Connect road and cabin video with vehicle events, routes and time.",
    hero: media("video", "Road and cabin video preview"), workspace: media("video", "Multi-channel video workspace and event timeline preview"),
    workspaceTitle: "More angles. A clearer picture.", workspaceDescription: "Bring the available camera views together, with the time and event context needed to understand what they show.",
    outcomes: [outcome("video", "See available streams", "Review road, cabin and surrounding views from supported cameras."), outcome("layers", "Connect the context", "Place video alongside vehicle events, route and time."), outcome("eye", "Review the evidence", "Move from an event to the available footage behind it."), outcome("users", "Support your team", "Give operational reviews a shared visual starting point.")],
    callouts: [outcome("camera", "Road and cabin", "Choose the perspective you need."), outcome("clock", "Event timeline", "Keep video and time together."), outcome("pin", "Journey context", "Place each view within the journey.")],
    stories: [story("video", "See beyond a single camera.", "Bring the road and cabin perspectives into the same review. Camera availability depends on your vehicle setup and connection.", "Supported camera views"), story("safety", "See the context behind an alert.", "Use the available footage to understand the moments around an event before deciding how to respond.", "Event-linked video context"), story("playback", "Keep the story in sequence.", "Review video with route and time to build a clearer picture of the journey, from the first signal to the follow-up.", "Video and journey review")],
    productSlugs: ["roadlenz-2ch-ai-dashcam", "roadlenz-4ch-mdvr-sd-storage", "roadlenz-side-view-camera", "roadlenz-driver-monitoring-camera"],
  },
  {
    slug: "ai-safety", name: "AI Safety", shortName: "AI Safety", icon: "shield", published: true, order: 3, theme: "light",
    heading: "Turn risk signals into safer driving decisions.", description: "Review ADAS and driver-monitoring evidence with the context needed to act.",
    hero: media("safety", "ADAS and driver-monitoring alert evidence preview"), workspace: media("safety", "AI Safety event review workspace preview"),
    workspaceTitle: "A risk signal is the start of the story.", workspaceDescription: "Bring the alert, the available evidence and the journey context together for a more informed review.",
    outcomes: [outcome("shield", "Identify risk signals", "Bring supported ADAS and driver-monitoring events into view."), outcome("video", "Review evidence", "Look at the available video and vehicle context behind an alert."), outcome("driver", "Coach with context", "Use specific journey moments to support constructive conversations."), outcome("route", "Follow up on patterns", "Review repeat events to help focus the next safety conversation.")],
    callouts: [outcome("bell", "Event evidence", "Start with the signal that needs review."), outcome("eye", "Road and driver context", "Consider the available perspectives."), outcome("shield", "Human review", "Use evidence to inform the next action.")],
    stories: [story("safety", "Give each alert the context it deserves.", "Review the event type alongside the available road and driver evidence. A signal starts a review; it does not replace a considered decision.", "ADAS and driver-monitoring context"), story("video", "Turn evidence into a useful conversation.", "Use a specific moment from the journey to explain what happened and discuss a safer response with the driver.", "Evidence-led coaching"), story("reports", "Return to the patterns that matter.", "Review available event trends to guide follow-up, identify recurring situations and focus attention where it is needed.", "Safety review over time")],
    productSlugs: ["roadlenz-2ch-ai-dashcam", "roadlenz-driver-monitoring-camera", "roadlenz-adas-system", "roadlenz-dms-system"],
  },
  {
    slug: "playback", name: "Playback", shortName: "Playback", icon: "clock", published: true, order: 4, theme: "dark",
    heading: "Go back in time. Understand what happened.", description: "Replay routes, vehicle events and synchronised video in one investigation view.",
    hero: media("playback", "Route replay and synchronised video preview"), workspace: media("playback", "Playback workspace with route, timeline and video context"),
    workspaceTitle: "One timeline. The journey in context.", workspaceDescription: "Work through the available route, events and footage together, with a shared point in time.",
    outcomes: [outcome("route", "Replay journeys", "Follow the available route history through a selected journey."), outcome("video", "Align route and video", "Review footage alongside the matching location and time."), outcome("search", "Investigate events", "Focus on the moments that need a closer look."), outcome("doc", "Prepare evidence", "Use supported export options to prepare material for review.")],
    callouts: [outcome("clock", "Shared timeline", "Keep each signal at the same moment."), outcome("route", "Route replay", "See where the selected event occurred."), outcome("video", "Synchronized context", "Review the matching available footage.")],
    stories: [story("playback", "Find the moment that matters.", "Start with a journey or event and narrow the review to the relevant period, using the history available for that vehicle.", "Journey and event review"), story("video", "Put the perspectives back together.", "Align route, video and vehicle events to see the context around the moment you are investigating.", "A shared point in time"), story("reports", "Take a clearer account into the next step.", "Use the supported evidence and export workflow to prepare a focused review for the people who need it.", "Evidence for follow-up")],
    productSlugs: ["roadlenz-wired-gps-tracker", "roadlenz-2ch-ai-dashcam", "roadlenz-4ch-mdvr-sd-storage"],
  },
  {
    slug: "reports", name: "Reports & Insights", shortName: "Reports", icon: "doc", published: true, order: 5, theme: "light",
    heading: "Turn operational data into clearer decisions.", description: "Explore GPS, video and AI insights in reports built for daily operations.",
    hero: media("reports", "Operational reporting and insight preview"), workspace: media("reports", "Reports workspace with report controls and illustrative chart layout"),
    workspaceTitle: "A clearer view of the patterns behind the day.", workspaceDescription: "Bring the relevant reporting period and vehicle scope together, then explore the available operational insights.",
    outcomes: [outcome("sliders", "Set the scope", "Focus the review on the vehicles and reporting period that matter."), outcome("route", "Review fleet activity", "Explore available location and journey data across operations."), outcome("shield", "Understand event patterns", "Review available safety events over time with their context."), outcome("doc", "Share useful insight", "Prepare supported reports for daily review and follow-up.")],
    callouts: [outcome("sliders", "Focused controls", "Choose a relevant reporting scope."), outcome("layers", "Connected signals", "Bring available data into one review."), outcome("doc", "Operational insight", "Move from a pattern to the next question.")],
    stories: [story("reports", "Start with the right question.", "Set a focused reporting scope so the review reflects the vehicles, period and operational question you want to understand.", "Reports with a clear purpose"), story("safety", "Give a trend its operational context.", "Move between summary patterns and the available event evidence to understand the situations behind the report.", "Patterns and supporting evidence"), story("fleet", "Bring insight back to the operation.", "Use the review to guide your next conversation with the team, then return to the current vehicle and journey context.", "A practical next step")],
    productSlugs: ["roadlenz-wired-gps-tracker", "roadlenz-2ch-ai-dashcam", "roadlenz-4ch-mdvr-sd-storage"],
  },
  {
    slug: "vehicle-health", name: "Vehicle Health & Sensors", shortName: "Vehicle Health", icon: "gauge", published: true, order: 6, theme: "light",
    heading: "Know what your vehicle is telling you.", description: "Bring fuel, temperature, I/O, battery and device-health signals into view.",
    hero: media("health", "Vehicle sensor and device-health preview"), workspace: media("health", "Fuel, temperature, I/O, battery and device signal workspace preview"),
    workspaceTitle: "Listen to the signals behind the journey.", workspaceDescription: "Review the vehicle and device data available from your installed hardware and supported sensor connections.",
    outcomes: [outcome("fuel", "Review sensor signals", "Bring supported fuel, temperature and I/O information into view."), outcome("chip", "Check device health", "Review available device connectivity and power signals."), outcome("bell", "Identify exceptions", "See which signals may need an operational or technical review."), outcome("wrench", "Plan the follow-up", "Use the available evidence to guide the next inspection or support step.")],
    callouts: [outcome("fuel", "Connected sensors", "Visibility depends on the installed setup."), outcome("chip", "Device signals", "Keep power and connectivity in context."), outcome("wrench", "Informed follow-up", "Use the signal to guide a closer check.")],
    stories: [story("health", "See the signals your setup supports.", "Bring the available sensor and vehicle inputs into a single view. The data shown depends on compatible hardware and configuration.", "Supported vehicle inputs"), story("fleet", "Distinguish a signal gap from an operational event.", "Review device and journey context together when data is missing or a vehicle status needs further investigation.", "Device and journey context"), story("reports", "Give the follow-up a clearer starting point.", "Use available signal history to explain an issue to your support or operations team and guide the next check.", "Evidence for the next inspection")],
    productSlugs: ["roadlenz-advanced-gps-tracker", "roadlenz-wired-gps-tracker"],
  },
];

export function getTechnologyCapabilities() { return technologyCapabilities.filter(c => c.published).slice().sort((a,b) => a.order-b.order); }
export function getTechnologyCapability(slug: string) { return getTechnologyCapabilities().find(c => c.slug === slug); }
export function getCapabilityProducts(capability: Pick<TechnologyCapability, "productSlugs">, products: Product[]) {
  return capability.productSlugs.flatMap(slug => { const product = products.find(p => p.published && p.slug === slug); return product ? [product] : []; });
}

export function getTechnologyOverview(): TechnologyCapability {
  const capabilities = getTechnologyCapabilities();
  const steps = ["Live Fleet", "Live Video", "AI Safety", "Track History", "Reports", "Vehicle Intelligence"];
  return {
    slug: "overview", name: "Technology", shortName: "Overview", published: true, order: 0, icon: "layers", theme: "light",
    heading: "Your fleet. One live intelligence platform.", description: "RoadLenz brings live location, multi-camera video, AI safety, track history, alerts and reports into one connected software experience.",
    hero: screenshot("fleet", "/media/technology/roadlenz-software/overview.png", "RoadLenz real fleet overview software screen"), workspace: screenshot("fleet", "/media/technology/roadlenz-software/vehicles.png", "RoadLenz real vehicle list software screen"),
    workspaceTitle: "See the real RoadLenz software in action.", workspaceDescription: "Real screens from the RoadLenz platform show how fleet teams move from live status to video, safety review, journey replay and reporting.",
    outcomes: [], callouts: [],
    stories: capabilities.map(capability => ({ title: steps[capability.order - 1] ?? capability.shortName, text: capability.description, status: capability.name, href: `/technology/${capability.slug}`, media: capability.hero })),
    productSlugs: [...new Set(capabilities.flatMap(c => c.productSlugs))].slice(0,5),
  };
}
