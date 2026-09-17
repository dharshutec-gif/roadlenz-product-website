import { technologyMedia } from "./TechnologyMedia";

export type TechnologyRoute = {
  slug: string;
  label: string;
  eyebrow: string;
  title: string;
  description: string;
  heroImage: string;
  secondaryImage?: string;
  tone: "blue" | "violet" | "green" | "orange" | "red";
  features: { title: string; copy: string }[];
  storyTitle: string;
  storyDescription: string;
  storyImage: string;
  storyPoints: string[];
  ctaTitle: string;
  ctaDescription: string;
};

export const technologyRoutes: TechnologyRoute[] = [
  {
    slug: "gps-tracking",
    label: "GPS Tracking",
    eyebrow: "REAL-TIME LOCATION INTELLIGENCE",
    title: "Real-Time GPS Tracking",
    description:
      "Know where every connected vehicle is, understand movement status and review journey context from one live RoadLenz map.",
    heroImage: technologyMedia.fleetMap,
    secondaryImage: technologyMedia.vehicleDetail,
    tone: "blue",
    features: [
      { title: "Live Position", copy: "See the latest connected vehicle location on the RoadLenz fleet map." },
      { title: "Movement Status", copy: "Separate moving, stopped, online and offline vehicles in seconds." },
      { title: "Vehicle Context", copy: "Move directly from the map into speed, ignition, cameras, alerts and history." },
      { title: "Track History", copy: "Review previous journeys, distance, duration and route playback." },
    ],
    storyTitle: "Track smarter. Operate better.",
    storyDescription:
      "RoadLenz connects a live location to the vehicle behind it, so your team can move from map visibility to the next action without changing tools.",
    storyImage: technologyMedia.trackHistory,
    storyPoints: ["Live fleet map", "Vehicle drill-down", "Journey history", "Multi-company visibility"],
    ctaTitle: "Put your entire fleet on one live map.",
    ctaDescription:
      "Talk to our team about GPS devices, fleet size and the RoadLenz tracking workflow.",
  },
  {
    slug: "live-video",
    label: "Live Video",
    eyebrow: "CONNECTED VIDEO INTELLIGENCE",
    title: "Live Video. Anytime. Anywhere.",
    description:
      "See what is happening on the road and inside the vehicle with connected RoadLenz camera views and fleet context.",
    heroImage: technologyMedia.liveVideo,
    secondaryImage: technologyMedia.driverVideo,
    tone: "violet",
    features: [
      { title: "Road View", copy: "Monitor front-road activity using the connected vehicle camera." },
      { title: "Cabin View", copy: "See driver or cabin context where the vehicle configuration supports it." },
      { title: "Multi-Camera", copy: "Open multiple camera channels from the same RoadLenz live-video workspace." },
      { title: "Vehicle Context", copy: "Keep location, vehicle and operating information connected to the video." },
    ],
    storyTitle: "More than video. Complete visibility.",
    storyDescription:
      "RoadLenz video is part of the fleet workflow — not a separate CCTV viewer. Location, vehicle status and camera context stay together.",
    storyImage: technologyMedia.roadVideo,
    storyPoints: ["Live streaming", "Road + cabin views", "Multi-channel video", "Fleet context"],
    ctaTitle: "Add live video to your fleet intelligence.",
    ctaDescription:
      "Discuss dashcam, MDVR and AI-video configurations for your RoadLenz deployment.",
  },
  {
    slug: "fuel-monitoring",
    label: "Fuel Monitoring",
    eyebrow: "FUEL & TELEMATICS INTELLIGENCE",
    title: "Fuel Monitoring. Control. Optimize. Save.",
    description:
      "Bring compatible fuel-sensor data into the RoadLenz operating picture to support fleet efficiency and exception review.",
    heroImage: technologyMedia.overviewDesktop,
    secondaryImage: technologyMedia.vehicleDetail,
    tone: "green",
    features: [
      { title: "Fuel Level", copy: "Review compatible fuel-sensor information from connected vehicles." },
      { title: "Fuel Activity", copy: "Bring fuel events into the same context as vehicle movement and trips." },
      { title: "Exception Review", copy: "Use operational context to investigate unusual fuel activity." },
      { title: "Trip Context", copy: "Compare fuel information with route, distance and vehicle activity." },
    ],
    storyTitle: "Turn fuel data into action.",
    storyDescription:
      "Fuel monitoring becomes more useful when it is connected to vehicle location, trip history and operating context inside the same platform.",
    storyImage: technologyMedia.fleetOverview,
    storyPoints: ["Compatible sensor data", "Vehicle context", "Trip correlation", "Fleet reporting"],
    ctaTitle: "Connect fuel intelligence to RoadLenz.",
    ctaDescription:
      "Share your vehicle and fuel-sensor requirement and our team can scope the right deployment.",
  },
  {
    slug: "real-time-status",
    label: "Real-Time Status",
    eyebrow: "LIVE FLEET STATUS",
    title: "Real-Time Status",
    description:
      "Stay informed about vehicle movement, connectivity, alerts and the latest fleet activity from one RoadLenz operating view.",
    heroImage: technologyMedia.overviewDesktop,
    secondaryImage: technologyMedia.fleetOverview,
    tone: "blue",
    features: [
      { title: "Fleet Overview", copy: "See connected vehicles, moving, stopped and offline state at a glance." },
      { title: "Live Activity", copy: "Keep the latest vehicle and fleet activity visible to the operating team." },
      { title: "Status Filters", copy: "Focus the workspace on the fleet state that needs attention." },
      { title: "Alert Context", copy: "Move from fleet status into the vehicle, map or alert that needs review." },
    ],
    storyTitle: "Complete fleet awareness in real time.",
    storyDescription:
      "RoadLenz keeps the operating picture current so teams know what is connected, what is moving and what needs attention.",
    storyImage: technologyMedia.liveFleetDesktop,
    storyPoints: ["Moving / stopped", "Online / offline", "Current alerts", "Vehicle availability"],
    ctaTitle: "Make fleet status visible to everyone who needs it.",
    ctaDescription:
      "Discuss RoadLenz access, roles and live fleet workflows for your operations team.",
  },
  {
    slug: "reports",
    label: "Reports",
    eyebrow: "REPORTS & ANALYTICS",
    title: "Reports & Analytics",
    description:
      "Turn trips, distance, idle activity, stops and connectivity into structured RoadLenz reports your team can review.",
    heroImage: technologyMedia.reports,
    secondaryImage: technologyMedia.trackHistory,
    tone: "blue",
    features: [
      { title: "Trip Summary", copy: "Review journey-level fleet activity in a repeatable report." },
      { title: "GPS Distance", copy: "Understand travelled distance across vehicles and selected periods." },
      { title: "Idle & Stops", copy: "Review ignition idle and stop activity for operational follow-up." },
      { title: "Connectivity", copy: "Use online/offline session detail and fleet online rate to review availability." },
    ],
    storyTitle: "From data to better performance.",
    storyDescription:
      "The RoadLenz report catalogue keeps common fleet reviews together, while journey history gives the route-level story behind the numbers.",
    storyImage: technologyMedia.trackHistory,
    storyPoints: ["Trip reports", "Distance", "Idle & stops", "Fleet online rate"],
    ctaTitle: "Turn fleet activity into useful reports.",
    ctaDescription:
      "Tell us how your team reviews performance and we can map RoadLenz reporting to your workflow.",
  },
  {
    slug: "analytics",
    label: "Analytics",
    eyebrow: "ADVANCED FLEET INSIGHT",
    title: "Advanced Analytics",
    description:
      "Use RoadLenz fleet data to identify operating patterns, compare activity and support smarter fleet decisions.",
    heroImage: technologyMedia.overviewDesktop,
    secondaryImage: technologyMedia.reports,
    tone: "violet",
    features: [
      { title: "Fleet Trends", copy: "Review fleet activity across repeated operating periods." },
      { title: "Route Trends", copy: "Use trip and route data to understand recurring movement patterns." },
      { title: "Performance Context", copy: "Bring distance, connectivity and other fleet indicators together." },
      { title: "Operational Review", copy: "Support recurring fleet discussions with structured RoadLenz data." },
    ],
    storyTitle: "Smarter insights. Stronger operations.",
    storyDescription:
      "Analytics builds on RoadLenz reporting and journey data, helping teams move from individual events to recurring operating patterns.",
    storyImage: technologyMedia.reports,
    storyPoints: ["Fleet trends", "Trip patterns", "Operational KPIs", "Historical context"],
    ctaTitle: "Use your RoadLenz data more effectively.",
    ctaDescription:
      "Talk to our team about reporting, dashboards and the fleet questions you need to answer.",
  },
  {
    slug: "recordings",
    label: "Recordings",
    eyebrow: "VIDEO RECORDINGS",
    title: "Video Recordings",
    description:
      "Review recorded vehicle footage when you need to understand what happened before, during or after an operational event.",
    heroImage: technologyMedia.liveVideo,
    secondaryImage: technologyMedia.roadVideo,
    tone: "blue",
    features: [
      { title: "Server Recordings", copy: "Access indexed vehicle recordings through the RoadLenz recordings workspace." },
      { title: "Camera Selection", copy: "Review the camera channel relevant to the event or journey." },
      { title: "Event Context", copy: "Keep vehicle and operating context close to recorded video review." },
      { title: "Incident Review", copy: "Use historical footage as evidence when a fleet event needs investigation." },
    ],
    storyTitle: "Find the right video. When you need it.",
    storyDescription:
      "Recorded video gives your team the historical evidence needed to understand an event beyond a location or alert alone.",
    storyImage: technologyMedia.roadVideo,
    storyPoints: ["Indexed recordings", "Camera channels", "Incident review", "Vehicle context"],
    ctaTitle: "Keep video evidence connected to the fleet.",
    ctaDescription:
      "Discuss storage, MDVR and recording requirements for your RoadLenz video deployment.",
  },
  {
    slug: "multi-fleet",
    label: "Multi-Fleet",
    eyebrow: "MULTI-FLEET MANAGEMENT",
    title: "Multi-Fleet Management",
    description:
      "Manage multiple companies, fleets and vehicle groups from one RoadLenz operating environment.",
    heroImage: technologyMedia.workspace,
    secondaryImage: technologyMedia.fleetOverview,
    tone: "blue",
    features: [
      { title: "Fleet Groups", copy: "Keep different operating fleets structured inside one platform." },
      { title: "Company Context", copy: "Move between companies while maintaining the correct vehicle context." },
      { title: "User Access", copy: "Align platform access to the organisation and user role." },
      { title: "Shared Intelligence", copy: "Keep reporting, tracking and fleet operations connected across groups." },
    ],
    storyTitle: "Built to scale with your business.",
    storyDescription:
      "RoadLenz supports multi-company and multi-fleet operations without forcing teams into separate tools for each operating group.",
    storyImage: technologyMedia.workspace,
    storyPoints: ["Companies", "Fleet groups", "User roles", "Shared reporting"],
    ctaTitle: "Bring multiple fleets into one RoadLenz environment.",
    ctaDescription:
      "Share your company, user and fleet structure and our team can scope the right access model.",
  },
  {
    slug: "alerts",
    label: "Alerts",
    eyebrow: "REAL-TIME ALERTS",
    title: "Real-Time Alerts",
    description:
      "Detect, identify and respond to fleet events with vehicle context, severity and the next RoadLenz workflow close at hand.",
    heroImage: technologyMedia.alerts,
    secondaryImage: technologyMedia.vehicleDetail,
    tone: "red",
    features: [
      { title: "SOS Alerts", copy: "Surface critical SOS activity that needs immediate operator attention." },
      { title: "Device Offline", copy: "Identify connectivity issues and vehicles that require follow-up." },
      { title: "Safety Events", copy: "Bring enabled safety events into the fleet operating picture." },
      { title: "Vehicle Context", copy: "Move from the alert into the affected vehicle, map, video or history." },
    ],
    storyTitle: "Stay ahead of every event.",
    storyDescription:
      "The value of an alert is the action it enables. RoadLenz keeps the vehicle and related operating context connected to every event.",
    storyImage: technologyMedia.vehicleDetail,
    storyPoints: ["SOS", "Offline warnings", "Severity", "Connected investigation"],
    ctaTitle: "Keep important fleet events visible.",
    ctaDescription:
      "Talk to us about RoadLenz alert configuration and event workflows for your fleet.",
  },
];

export function getTechnologyRoute(slug: string) {
  return technologyRoutes.find((route) => route.slug === slug);
}
