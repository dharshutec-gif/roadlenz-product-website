export const INDUSTRY_ORDER = [
  "cab-taxi",
  "school-transport",
  "public-transport",
  "employee-transport",
  "trucking-logistics",
  "mining",
  "agriculture",
] as const;

export type IndustrySlug = (typeof INDUSTRY_ORDER)[number];

export type PresentationItem = {
  title: string;
  description: string;
  icon: string;
};

export type FeatureCard = PresentationItem & {
  action: string;
};

export type JourneyStep = {
  title: string;
  description: string;
  icon: string;
};

export type IndustryPresentation = {
  slug: IndustrySlug;
  navName: string;
  eyebrow: string;
  heroTitleLead: string;
  heroTitleAccent: string;
  heroCopy: string;
  vehicleImage: string;
  sceneImage: string;
  montageImage: string;
  icon: string;
  shortLine: string;
  storyTitle: string;
  storyCopy: string;
  storyBenefits: PresentationItem[];
  advantageTitle: string;
  advantageCopy: string;
  advantageItems: PresentationItem[];
  featureSectionTitle: string;
  featureSectionCopy: string;
  featureCards: FeatureCard[];
  journeyEyebrow: string;
  journeyTitle: string;
  journey: JourneyStep[];
  operationsTitle: string;
  operationsCopy: string;
  operationsPoints: PresentationItem[];
  mobileTitle: string;
  mobileCopy: string;
  mobilePoints: PresentationItem[];
  whyTitle: string;
  why: PresentationItem[];
  ctaEyebrow: string;
  ctaTitle: string;
  ctaCopy: string;
  ctaImage: string;
};

const presentations: Record<IndustrySlug, IndustryPresentation> = {
  "cab-taxi": {
    slug: "cab-taxi",
    navName: "Cab & Taxi",
    eyebrow: "Cab & Taxi Fleet Solution",
    heroTitleLead: "One trip. One",
    heroTitleAccent: "connected view.",
    heroCopy: "Live location, safety and operational visibility for smarter, more reliable cab and taxi operations.",
    vehicleImage: "/media/vehicles/taxi-cab.png",
    sceneImage: "/media/solutions/taxi-hero.jpg",
    montageImage: "/media/solutions/taxi-hero.jpg",
    icon: "car",
    shortLine: "Safer rides. Smarter fleets.",
    storyTitle: "Every ride counts.",
    storyCopy: "RoadLenz helps cab and taxi operators improve passenger safety, strengthen trip visibility and run a more controlled fleet operation.",
    storyBenefits: [
      { title: "Passenger Safety", description: "Connected location and video context for safer journeys.", icon: "shield" },
      { title: "Trip Visibility", description: "Track active rides, routes and vehicle status in real time.", icon: "pin" },
      { title: "Operational Efficiency", description: "Use fleet activity and trip data to reduce avoidable downtime.", icon: "gauge" },
    ],
    advantageTitle: "Built for modern cab & taxi operations.",
    advantageCopy: "Bring vehicles, driver context, trip visibility and operational alerts into one connected RoadLenz workspace.",
    advantageItems: [
      { title: "Real-Time Trip Visibility", description: "Know where each vehicle is and how each trip is progressing.", icon: "pin" },
      { title: "Safer Operations", description: "Review event and video context when attention is required.", icon: "shield" },
      { title: "Better Utilisation", description: "See movement, idle time and trip activity more clearly.", icon: "gauge" },
      { title: "Central Fleet Control", description: "Group vehicles by operator, city or fleet from one platform.", icon: "fleet" },
    ],
    featureSectionTitle: "All the tools you need, in one platform.",
    featureSectionCopy: "Bring together location, video, safety and operational data to manage every trip with confidence.",
    featureCards: [
      { title: "Live GPS Tracking", description: "Real-time vehicle location, trip status and route progress across the fleet.", icon: "pin", action: "Track in real time" },
      { title: "Live Cameras & Video", description: "View available live and recorded video for faster trip and incident review.", icon: "video", action: "View video" },
      { title: "Alerts & Driver Safety", description: "Surface risky events and operational alerts with vehicle context.", icon: "shield", action: "Explore safety" },
      { title: "Reports & Trip Summary", description: "Review trip history, GPS distance, idle time and fleet activity reports.", icon: "doc", action: "View reports" },
    ],
    journeyEyebrow: "From pickup to drop-off",
    journeyTitle: "A smoother ride, every step of the way.",
    journey: [
      { title: "Dispatch", description: "Assign vehicles and drivers for the next movement.", icon: "pin" },
      { title: "Monitor", description: "Track live location, trip progress and driver context.", icon: "car" },
      { title: "Manage", description: "Review alerts, video and operational exceptions.", icon: "gauge" },
      { title: "Respond", description: "Act quickly with the right trip and vehicle information.", icon: "checkCircle" },
    ],
    operationsTitle: "Smarter decisions for a better tomorrow.",
    operationsCopy: "From live operations to trip history and reporting, RoadLenz keeps the complete taxi fleet picture in one place.",
    operationsPoints: [
      { title: "Live fleet map", description: "See vehicle and trip status at a glance.", icon: "map" },
      { title: "Trip history & playback", description: "Review previous movement and route context.", icon: "route" },
      { title: "Alerts & notifications", description: "Prioritise events that need attention.", icon: "alert" },
      { title: "Company groups", description: "Organise vehicles by operator or business unit.", icon: "users" },
      { title: "GPS distance & idle", description: "Review distance and idle activity in reports.", icon: "gauge" },
      { title: "Role-based access", description: "Give teams the right operational visibility.", icon: "shield" },
    ],
    mobileTitle: "Stay connected. Anywhere, anytime.",
    mobileCopy: "Give operations teams access to live tracking, trip context, alerts and vehicle information while they are on the move.",
    mobilePoints: [
      { title: "Live tracking", description: "Vehicle location on the move.", icon: "pin" },
      { title: "Trip status", description: "See active trip progress.", icon: "route" },
      { title: "Video access", description: "Open configured live video.", icon: "video" },
      { title: "Instant alerts", description: "Review operational events.", icon: "bell" },
    ],
    whyTitle: "Trusted by fleet teams. Built for what’s next.",
    why: [
      { title: "Higher visibility", description: "Keep fleet activity easier to understand.", icon: "eye" },
      { title: "Safer rides", description: "Bring safety and video context into operations.", icon: "shield" },
      { title: "Faster review", description: "Find trip and event information more quickly.", icon: "doc" },
      { title: "Scalable control", description: "Manage growing fleets and companies from one platform.", icon: "users" },
    ],
    ctaEyebrow: "Ready for a smarter tomorrow?",
    ctaTitle: "Power safer, smarter taxi operations.",
    ctaCopy: "Talk to RoadLenz about a connected fleet setup for your cab and taxi operation.",
    ctaImage: "/media/hero/hero-3.jpg",
  },
  "school-transport": {
    slug: "school-transport",
    navName: "School Transport",
    eyebrow: "School Transport Solution",
    heroTitleLead: "Safer every",
    heroTitleAccent: "school journey.",
    heroCopy: "Real-time location, safer operations and connected visibility for a more dependable school transport experience.",
    vehicleImage: "/media/vehicles/school-transport.png",
    sceneImage: "/media/solutions/school-transport-hero.jpg",
    montageImage: "/media/solutions/school-transport-blue-hour.png",
    icon: "bus",
    shortLine: "A safer tomorrow.",
    storyTitle: "Safe students. Confident operations.",
    storyCopy: "RoadLenz helps schools and transport operators see routes, vehicle status and available video context from one connected platform.",
    storyBenefits: [
      { title: "Safer Pickups & Drop-offs", description: "Keep route and stop visibility clearer for transport teams.", icon: "shield" },
      { title: "Complete Route Visibility", description: "Track each configured school vehicle across its route.", icon: "eye" },
      { title: "Operational Control", description: "Manage vehicles, routes and alerts from one workspace.", icon: "settings" },
    ],
    advantageTitle: "Built for school transport operations.",
    advantageCopy: "Connect school vehicles, route progress, safety alerts and operational reporting in one platform.",
    advantageItems: [
      { title: "Safer Journeys", description: "Bring live visibility and safety events into one operational view.", icon: "shield" },
      { title: "Route Confidence", description: "Know where school vehicles are and how routes are progressing.", icon: "route" },
      { title: "Faster Incident Review", description: "Use location and configured video to review events quickly.", icon: "video" },
      { title: "Scalable Operations", description: "Organise multiple schools, routes or transport vendors.", icon: "users" },
    ],
    featureSectionTitle: "A complete view of your school transport operations.",
    featureSectionCopy: "Bring together location, video, safety and route data to manage school transport with confidence.",
    featureCards: [
      { title: "Live GPS Tracking", description: "See school-bus location, route progress and current movement status.", icon: "pin", action: "Track school buses" },
      { title: "Live Cameras & Video", description: "View configured live and recorded video for operational review.", icon: "video", action: "View live video" },
      { title: "Student Safety & Alerts", description: "Review safety-related events, vehicle alerts and route exceptions.", icon: "shield", action: "Explore safety" },
      { title: "Reports & Trip Summary", description: "Use trip, stop, distance and idle reports for transport review.", icon: "doc", action: "View reports" },
    ],
    journeyEyebrow: "From pickup to drop-off",
    journeyTitle: "A safer journey, every step of the way.",
    journey: [
      { title: "Plan", description: "Create routes, stops and operating groups.", icon: "doc" },
      { title: "Track", description: "Monitor live location, route progress and status.", icon: "bus" },
      { title: "Stay Informed", description: "Review alerts, video and trip updates.", icon: "bell" },
      { title: "Ensure Safety", description: "Take action with connected operational context.", icon: "shield" },
    ],
    operationsTitle: "Complete operational visibility for every school trip.",
    operationsCopy: "Use live tracking, route history, alerts, reports and fleet grouping to keep school transport operations clear and manageable.",
    operationsPoints: [
      { title: "Route history & playback", description: "Review previous routes and movement.", icon: "route" },
      { title: "Fleet grouping", description: "Group vehicles by school, route or vendor.", icon: "users" },
      { title: "Stop & status review", description: "Understand trip and stop activity.", icon: "pin" },
      { title: "Driver safety context", description: "Review configured driver safety events.", icon: "shield" },
      { title: "Trip reports", description: "Use GPS distance, idle and stop reports.", icon: "doc" },
      { title: "Role-based access", description: "Control what each team can manage.", icon: "settings" },
    ],
    mobileTitle: "Stay connected. Anywhere, anytime.",
    mobileCopy: "Give school transport teams mobile access to tracking, trip status, alerts and configured video.",
    mobilePoints: [
      { title: "Live bus tracking", description: "See bus movement on the go.", icon: "pin" },
      { title: "Trip updates", description: "Review route and stop progress.", icon: "route" },
      { title: "Video streaming", description: "Open configured camera feeds.", icon: "video" },
      { title: "Instant alerts", description: "See important operational events.", icon: "bell" },
    ],
    whyTitle: "Trusted by school transport teams. Built for what’s next.",
    why: [
      { title: "Greater visibility", description: "Know where vehicles are and what is happening.", icon: "eye" },
      { title: "Higher confidence", description: "Use connected data for more dependable operations.", icon: "shield" },
      { title: "Faster review", description: "Find route, event and video context quickly.", icon: "doc" },
      { title: "Future-ready platform", description: "Scale across more vehicles, routes and schools.", icon: "users" },
    ],
    ctaEyebrow: "Ready for safer school transport?",
    ctaTitle: "Let’s build a safer tomorrow, together.",
    ctaCopy: "See how RoadLenz can help create a more connected school transport operation.",
    ctaImage: "/media/solutions/school-transport-blue-hour.png",
  },
  "public-transport": {
    slug: "public-transport",
    navName: "Public Transport",
    eyebrow: "Public Transport Solution",
    heroTitleLead: "Visibility for",
    heroTitleAccent: "every route.",
    heroCopy: "Connected fleet intelligence for city and public transport operations with route, vehicle, video and operational context in one place.",
    vehicleImage: "/media/vehicles/public-transport.png",
    sceneImage: "/media/solutions/public-transport-hero.jpg",
    montageImage: "/media/solutions/public-transport-hero.jpg",
    icon: "bus",
    shortLine: "Connected cities.",
    storyTitle: "On-time operations. Happier communities.",
    storyCopy: "RoadLenz helps transit teams monitor fleet movement, operational alerts and route performance across the network.",
    storyBenefits: [
      { title: "Better Route Visibility", description: "See buses, routes and current movement status.", icon: "route" },
      { title: "Depot & Fleet Monitoring", description: "Group and review vehicles across multiple operations.", icon: "building" },
      { title: "Faster Incident Response", description: "Use alerts and video context when attention is needed.", icon: "alert" },
    ],
    advantageTitle: "Built for public transport operations.",
    advantageCopy: "Bring route, fleet, video and alert data into one operational view for transit teams.",
    advantageItems: [
      { title: "Route Adherence", description: "Understand route movement and operational exceptions.", icon: "route" },
      { title: "Passenger Safety", description: "Use configured video and safety context across the fleet.", icon: "shield" },
      { title: "Fleet Utilisation", description: "Review active, idle and offline vehicles by group.", icon: "gauge" },
      { title: "Data-Driven Operations", description: "Use reports to understand fleet activity over time.", icon: "doc" },
    ],
    featureSectionTitle: "A complete view of your public transport operations.",
    featureSectionCopy: "Bring together vehicles, routes, video and operational data for a clearer transit control-room view.",
    featureCards: [
      { title: "Live GPS Tracking", description: "Monitor buses, route progress and movement across the network.", icon: "pin", action: "Track buses" },
      { title: "Live Cameras & Video", description: "View configured road and vehicle camera feeds for incident review.", icon: "video", action: "View live video" },
      { title: "AI Safety & Alerts", description: "Review route, vehicle and safety alerts with operational context.", icon: "shield", action: "Explore alerts" },
      { title: "Reports & Trip Summary", description: "Use trip, distance, idle and fleet online reports for analysis.", icon: "doc", action: "View reports" },
    ],
    journeyEyebrow: "From depot to destination",
    journeyTitle: "A smarter transit system, every step of the way.",
    journey: [
      { title: "Plan & Deploy", description: "Organise buses, routes and fleet groups.", icon: "bus" },
      { title: "Monitor", description: "Track location, route progress and operational status.", icon: "pin" },
      { title: "Stay Informed", description: "Review alerts, video and trip data.", icon: "gauge" },
      { title: "Take Action", description: "Respond faster with connected fleet context.", icon: "checkCircle" },
    ],
    operationsTitle: "Data that keeps your city moving.",
    operationsCopy: "From live fleet location to historical route and report data, RoadLenz gives transit teams a clear operational picture.",
    operationsPoints: [
      { title: "Live fleet tracking", description: "See current vehicle status.", icon: "map" },
      { title: "Route history", description: "Review previous movement and routes.", icon: "route" },
      { title: "Depot grouping", description: "Group fleets by city, route or depot.", icon: "building" },
      { title: "Alerts", description: "Review operational events and exceptions.", icon: "alert" },
      { title: "Trip reports", description: "Analyse distance, idle and stop activity.", icon: "doc" },
      { title: "Role access", description: "Control team access by responsibility.", icon: "settings" },
    ],
    mobileTitle: "On the move. Always in control.",
    mobileCopy: "Look up buses, live tracking, alerts and available video from the RoadLenz mobile experience.",
    mobilePoints: [
      { title: "Live bus tracking", description: "See buses on the move.", icon: "pin" },
      { title: "Route status", description: "Review route progress.", icon: "route" },
      { title: "Real-time alerts", description: "See operational events.", icon: "bell" },
      { title: "Vehicle details", description: "Open important vehicle context.", icon: "bus" },
    ],
    whyTitle: "Trusted by transit teams. Built for what’s next.",
    why: [
      { title: "More reliable service", description: "Keep operations informed with real-time visibility.", icon: "clock" },
      { title: "Safer communities", description: "Bring video and safety context together.", icon: "shield" },
      { title: "Data-driven planning", description: "Use fleet reports to improve decisions.", icon: "doc" },
      { title: "Scalable network control", description: "Support multiple fleets and operating groups.", icon: "users" },
    ],
    ctaEyebrow: "Ready for smarter public transport?",
    ctaTitle: "Let’s build a better-connected city.",
    ctaCopy: "Talk to RoadLenz about a connected fleet intelligence setup for your public transport operation.",
    ctaImage: "/media/hero/hero-3.jpg",
  },
  "employee-transport": {
    slug: "employee-transport",
    navName: "Employee Transport",
    eyebrow: "Employee Transport Solution",
    heroTitleLead: "Every employee commute.",
    heroTitleAccent: "In view.",
    heroCopy: "Live location, safety and operational context for a smarter, more reliable employee transport experience.",
    vehicleImage: "/media/vehicles/employee-transport.png",
    sceneImage: "/media/solutions/employee-transport-hero.jpg",
    montageImage: "/media/solutions/employee-transport-hero.jpg",
    icon: "users",
    shortLine: "Reliable people movement.",
    storyTitle: "Simpler operations. Happier people.",
    storyCopy: "RoadLenz helps transport teams coordinate workforce mobility with connected route, vehicle and safety visibility.",
    storyBenefits: [
      { title: "Safer Commutes", description: "Connected safety and route context for everyday operations.", icon: "shield" },
      { title: "Higher Reliability", description: "See active routes and current vehicle movement.", icon: "clock" },
      { title: "Better Fleet Utilisation", description: "Use trip and fleet activity to improve planning.", icon: "gauge" },
    ],
    advantageTitle: "Built for employee transport operations.",
    advantageCopy: "Manage employee transport with clearer visibility from first pickup to final drop.",
    advantageItems: [
      { title: "Safer Employees", description: "Use connected safety and vehicle context across shifts.", icon: "users" },
      { title: "Optimised Utilisation", description: "Understand active routes, trips and fleet activity.", icon: "gauge" },
      { title: "Reduced Operational Risk", description: "Surface events that require transport-team attention.", icon: "shield" },
      { title: "Data-Driven Decisions", description: "Use trip and report data for better planning.", icon: "doc" },
    ],
    featureSectionTitle: "A complete view of your transport operations.",
    featureSectionCopy: "Bring together location, video, safety and operational data to manage employee transport with confidence.",
    featureCards: [
      { title: "Live GPS Tracking", description: "Track route progress, vehicle movement and trip status.", icon: "pin", action: "Track in real time" },
      { title: "Live Cameras & Video", description: "View configured live and recorded camera feeds for faster review.", icon: "video", action: "View video" },
      { title: "Alerts & AI Safety", description: "Review operational and safety events with vehicle context.", icon: "shield", action: "Explore safety" },
      { title: "Reports & Trip Summary", description: "Analyse trip history, distance, idle time and fleet activity.", icon: "doc", action: "View reports" },
    ],
    journeyEyebrow: "From boarding point to destination",
    journeyTitle: "A safer journey, every step of the way.",
    journey: [
      { title: "Connect", description: "Organise vehicles, routes and employee transport groups.", icon: "pin" },
      { title: "Monitor", description: "Track live location, route activity and vehicle status.", icon: "bus" },
      { title: "Understand", description: "Review alerts, reports and trip context.", icon: "gauge" },
      { title: "Act", description: "Take action with the right operational information.", icon: "checkCircle" },
    ],
    operationsTitle: "Operational visibility for every trip.",
    operationsCopy: "From route history to live location, ignition status, distance and company-wise fleet grouping, keep employee transport activity in one place.",
    operationsPoints: [
      { title: "Route history & playback", description: "Review past movement and route activity.", icon: "route" },
      { title: "GPS distance & utilisation", description: "Understand distance and fleet usage.", icon: "gauge" },
      { title: "Live location & trip status", description: "See active vehicles and routes.", icon: "pin" },
      { title: "Company grouping", description: "Group vehicles by customer or company.", icon: "users" },
      { title: "Ignition & idle activity", description: "Review operational status and idle reports.", icon: "clock" },
      { title: "Role-based access", description: "Give each team the right visibility.", icon: "shield" },
    ],
    mobileTitle: "Mobile experience for supervisors and teams.",
    mobileCopy: "Look up vehicles, trip progress, configured video and alerts from the RoadLenz mobile experience.",
    mobilePoints: [
      { title: "Live tracking", description: "See employee vehicles on the move.", icon: "pin" },
      { title: "Video streaming", description: "Open configured camera feeds.", icon: "video" },
      { title: "Instant alerts", description: "Review events quickly.", icon: "bell" },
      { title: "Trip status", description: "Follow active journeys and ETAs.", icon: "route" },
    ],
    whyTitle: "Trusted by transport teams. Built for what’s next.",
    why: [
      { title: "On-time visibility", description: "Keep operations informed across shifts.", icon: "clock" },
      { title: "Safer transport", description: "Bring safety and video context together.", icon: "shield" },
      { title: "Faster incident review", description: "Find events with connected data.", icon: "doc" },
      { title: "Centralised control", description: "Manage companies, locations and vehicles from one platform.", icon: "users" },
    ],
    ctaEyebrow: "Ready for a smarter tomorrow?",
    ctaTitle: "Ready to modernize employee transport?",
    ctaCopy: "Let’s build a safer, more efficient and connected commute experience for your teams.",
    ctaImage: "/media/hero/hero-3.jpg",
  },
  "trucking-logistics": {
    slug: "trucking-logistics",
    navName: "Logistics & Trucking",
    eyebrow: "Trucking & Logistics Solution",
    heroTitleLead: "Every load.",
    heroTitleAccent: "In view.",
    heroCopy: "Live location, safety and operational intelligence for a more efficient, reliable and controlled trucking operation.",
    vehicleImage: "/media/vehicles/logistics-trucking.png",
    sceneImage: "/media/solutions/logistics-hero.jpg",
    montageImage: "/media/solutions/logistics-hero.jpg",
    icon: "truck",
    shortLine: "Every load in view.",
    storyTitle: "Moving businesses forward.",
    storyCopy: "RoadLenz helps logistics teams track vehicles, review driver and video context, and keep long-haul operations visible from dispatch to delivery.",
    storyBenefits: [
      { title: "Driver Safety", description: "Review safety events with location and video context.", icon: "shield" },
      { title: "Route Visibility", description: "Know where vehicles are and how journeys progress.", icon: "pin" },
      { title: "Operational Efficiency", description: "Use distance, idle and fuel-related data for better decisions.", icon: "gauge" },
    ],
    advantageTitle: "Built for the trucking and logistics industry.",
    advantageCopy: "Bring vehicles, drivers, routes and operational intelligence into one connected RoadLenz platform.",
    advantageItems: [
      { title: "On-Time Visibility", description: "Track journeys from dispatch through delivery.", icon: "truck" },
      { title: "Higher Fleet Productivity", description: "Understand utilisation, idle time and movement.", icon: "gauge" },
      { title: "Reduced Operational Risk", description: "Review alerts, safety and video context.", icon: "shield" },
      { title: "Fuel Awareness", description: "Connect compatible fuel monitoring where configured.", icon: "fuel" },
    ],
    featureSectionTitle: "A complete view of your trucking operations.",
    featureSectionCopy: "Bring together vehicles, drivers, route progress and operational data to move freight with confidence.",
    featureCards: [
      { title: "Live GPS Tracking", description: "Real-time vehicle location, route progress and status across the fleet.", icon: "pin", action: "Track fleet" },
      { title: "Live Cameras & Video", description: "View configured live and recorded video for safety and incident review.", icon: "video", action: "View live video" },
      { title: "Fuel & Idle Monitoring", description: "Use compatible fuel sensor data with idle and trip activity where configured.", icon: "fuel", action: "Explore fuel" },
      { title: "Reports & Deliveries", description: "Review trip, GPS distance, stop and fleet online reports.", icon: "doc", action: "View reports" },
    ],
    journeyEyebrow: "From dispatch to delivery",
    journeyTitle: "A smarter, more connected journey.",
    journey: [
      { title: "Plan & Dispatch", description: "Organise vehicles, routes and delivery groups.", icon: "pin" },
      { title: "Track & Monitor", description: "See live location, trip progress and vehicle activity.", icon: "truck" },
      { title: "Analyze", description: "Review reports, alerts and fleet performance context.", icon: "gauge" },
      { title: "Deliver & Improve", description: "Use operational intelligence to improve the next run.", icon: "checkCircle" },
    ],
    operationsTitle: "Total control over your fleet operations.",
    operationsCopy: "From live location to delivery status, fuel context and trip history, RoadLenz keeps the trucking operation visible in one platform.",
    operationsPoints: [
      { title: "Route history & playback", description: "Review previous long-haul movement.", icon: "route" },
      { title: "Driver performance context", description: "Review configured safety events.", icon: "shield" },
      { title: "Ignition & idle reporting", description: "Understand operational idle activity.", icon: "clock" },
      { title: "Fleet grouping", description: "Group vehicles by client, region or company.", icon: "users" },
      { title: "GPS distance reports", description: "Review fleet distance and trip activity.", icon: "gauge" },
      { title: "Fuel monitoring", description: "Use compatible sensor data where fitted.", icon: "fuel" },
    ],
    mobileTitle: "Trucking operations in your pocket.",
    mobileCopy: "Track vehicles, view configured video, see alerts and review vehicle status while teams are on the move.",
    mobilePoints: [
      { title: "Live vehicle tracking", description: "See trucks on the road.", icon: "pin" },
      { title: "Trip status", description: "Follow journey progress.", icon: "route" },
      { title: "Instant alerts", description: "Review operational events.", icon: "bell" },
      { title: "Vehicle details", description: "Open current vehicle context.", icon: "truck" },
    ],
    whyTitle: "Trusted by logistics teams. Built for what’s next.",
    why: [
      { title: "Greater visibility", description: "Keep transport teams informed across the fleet.", icon: "eye" },
      { title: "Safer operations", description: "Use safety and video context for review.", icon: "shield" },
      { title: "Lower avoidable cost", description: "Use idle, distance and fuel-related data to improve operations.", icon: "gauge" },
      { title: "Scalable fleet management", description: "Manage more vehicles and companies from one platform.", icon: "users" },
    ],
    ctaEyebrow: "Ready for a more connected fleet?",
    ctaTitle: "Let’s move your business forward.",
    ctaCopy: "Unlock greater fleet visibility and operational control with RoadLenz.",
    ctaImage: "/media/solutions/logistics-hero.jpg",
  },
  mining: {
    slug: "mining",
    navName: "Mining",
    eyebrow: "Mining Fleet Solution",
    heroTitleLead: "Tough sites.",
    heroTitleAccent: "Clear intelligence.",
    heroCopy: "Real-time visibility, safety context and control for demanding mining operations from pit to plant.",
    vehicleImage: "/media/vehicles/mining.png",
    sceneImage: "/media/solutions/mining-hero.jpg",
    montageImage: "/media/solutions/mining-hero.jpg",
    icon: "truck",
    shortLine: "Tougher sites. Smarter safety.",
    storyTitle: "Greater control. Safer sites.",
    storyCopy: "RoadLenz helps mining teams see heavy vehicles, movement, alerts and operational activity across demanding sites.",
    storyBenefits: [
      { title: "Remote Visibility", description: "Know where site vehicles are across operational zones.", icon: "eye" },
      { title: "Harsh-Site Safety", description: "Review safety and alert context across heavy fleets.", icon: "shield" },
      { title: "Site Movement Control", description: "Use route, zone and vehicle visibility for operations.", icon: "map" },
    ],
    advantageTitle: "Built for mining operations.",
    advantageCopy: "Connect heavy vehicles, site movement, safety events and operational reporting in one platform.",
    advantageItems: [
      { title: "Heavy Vehicle Monitoring", description: "See movement and current fleet status across sites.", icon: "truck" },
      { title: "Geofence Visibility", description: "Use operational zones and location context.", icon: "map" },
      { title: "Fleet Utilisation", description: "Review active, idle and offline vehicle activity.", icon: "gauge" },
      { title: "Reduced Safety Risk", description: "Review alert and video context where configured.", icon: "shield" },
    ],
    featureSectionTitle: "A complete view of your mining operations.",
    featureSectionCopy: "Bring together site location, video, alerts and fleet data to manage heavy vehicles with confidence.",
    featureCards: [
      { title: "Real-Time Fleet Tracking", description: "Track heavy vehicles, site movement and status on one operational map.", icon: "pin", action: "View live fleet" },
      { title: "Live Cameras & Video", description: "Review configured road, cabin or site vehicle video when available.", icon: "video", action: "View live video" },
      { title: "AI Safety Alerts", description: "Surface configured safety and operational events for faster review.", icon: "shield", action: "Explore safety" },
      { title: "Reports & Fleet Analytics", description: "Review trip, distance, idle and fleet-online reports across site groups.", icon: "doc", action: "View reports" },
    ],
    journeyEyebrow: "From plant to higher productivity",
    journeyTitle: "A smarter, safer mining operation. Every step of the way.",
    journey: [
      { title: "Connect", description: "Organise site vehicles and operating groups.", icon: "pin" },
      { title: "Monitor", description: "Track movement, status and configured video.", icon: "truck" },
      { title: "Analyse", description: "Review reports, alerts and operational trends.", icon: "gauge" },
      { title: "Act", description: "Respond quickly with clearer fleet context.", icon: "checkCircle" },
    ],
    operationsTitle: "Actionable insights for every mine.",
    operationsCopy: "From live fleet movement to route history, idle activity and group-wise operations, keep the mining picture in one place.",
    operationsPoints: [
      { title: "Site movement", description: "See heavy fleet activity across locations.", icon: "map" },
      { title: "Route history", description: "Review previous haul movement.", icon: "route" },
      { title: "Fuel context", description: "Use compatible fuel integrations where fitted.", icon: "fuel" },
      { title: "Operational groups", description: "Group vehicles by site, contractor or zone.", icon: "users" },
      { title: "Idle & stop reports", description: "Review activity that affects utilisation.", icon: "clock" },
      { title: "Alerts", description: "Surface operational events that need attention.", icon: "alert" },
    ],
    mobileTitle: "Mining operations in your hands.",
    mobileCopy: "Look up site vehicles, current movement, configured video and alerts from the RoadLenz mobile experience.",
    mobilePoints: [
      { title: "Live vehicle tracking", description: "See site vehicles on the map.", icon: "pin" },
      { title: "Live video", description: "Open configured camera feeds.", icon: "video" },
      { title: "Instant alerts", description: "Review events on the move.", icon: "bell" },
      { title: "Reports", description: "Access operational summaries.", icon: "doc" },
    ],
    whyTitle: "Trusted by mining teams. Built for what’s next.",
    why: [
      { title: "Real-time visibility", description: "Know what is happening across site fleets.", icon: "eye" },
      { title: "Safer operations", description: "Use connected safety context for review.", icon: "shield" },
      { title: "Higher productivity", description: "Understand fleet movement and utilisation.", icon: "gauge" },
      { title: "Future-ready platform", description: "Scale across more sites and operating groups.", icon: "users" },
    ],
    ctaEyebrow: "Ready for a smarter mine?",
    ctaTitle: "Let’s build a safer, more productive tomorrow.",
    ctaCopy: "See how RoadLenz can transform visibility across your mining operation.",
    ctaImage: "/media/solutions/mining-hero.jpg",
  },
  agriculture: {
    slug: "agriculture",
    navName: "Agriculture",
    eyebrow: "Connected Agriculture Solution",
    heroTitleLead: "Smarter connected",
    heroTitleAccent: "farming.",
    heroCopy: "Live location, equipment visibility and field operations context for a more productive, efficient and sustainable operation.",
    vehicleImage: "/media/vehicles/agriculture-equipment.png",
    sceneImage: "/media/solutions/agriculture-hero.jpg",
    montageImage: "/media/solutions/agriculture-hero.jpg",
    icon: "leaf",
    shortLine: "Powering rural progress.",
    storyTitle: "Greater visibility. Higher productivity.",
    storyCopy: "RoadLenz helps agricultural teams monitor connected equipment, movement and operational activity across fields and remote locations.",
    storyBenefits: [
      { title: "Complete Field Visibility", description: "Know where connected equipment is across your operation.", icon: "eye" },
      { title: "Higher Utilisation", description: "Use movement and activity data to improve planning.", icon: "gauge" },
      { title: "Better Coordination", description: "Keep teams and connected equipment easier to manage.", icon: "users" },
    ],
    advantageTitle: "Built for modern agricultural operations.",
    advantageCopy: "Connect equipment, fields, people and operational data in one RoadLenz platform.",
    advantageItems: [
      { title: "Track Equipment", description: "See connected tractors and equipment on the map.", icon: "gps" },
      { title: "Maximise Utilisation", description: "Understand activity and idle time more clearly.", icon: "gauge" },
      { title: "Fuel Awareness", description: "Use compatible fuel integrations where configured.", icon: "fuel" },
      { title: "Data-Driven Decisions", description: "Use operational reports across fields and groups.", icon: "doc" },
    ],
    featureSectionTitle: "A complete view of your farm operations.",
    featureSectionCopy: "Bring together connected equipment, field movement and operational data to manage agricultural activity with confidence.",
    featureCards: [
      { title: "Live Equipment Tracking", description: "See real-time location and movement for connected tractors and equipment.", icon: "pin", action: "Track equipment" },
      { title: "Live Cameras & Video", description: "View configured live and recorded video from connected equipment where available.", icon: "video", action: "View live video" },
      { title: "Field & Zone Visibility", description: "Use mapped operating areas and location context across fields.", icon: "map", action: "Manage fields" },
      { title: "Reports & Utilisation", description: "Review distance, idle and equipment activity reports for better planning.", icon: "doc", action: "View reports" },
    ],
    journeyEyebrow: "From planning to harvest",
    journeyTitle: "A more connected season, every step of the way.",
    journey: [
      { title: "Plan", description: "Organise equipment, fields and operating groups.", icon: "leaf" },
      { title: "Monitor", description: "Track connected equipment and field activity.", icon: "gps" },
      { title: "Analyze", description: "Review movement, idle and operational reports.", icon: "gauge" },
      { title: "Act", description: "Use clearer information to make faster decisions.", icon: "checkCircle" },
    ],
    operationsTitle: "Complete visibility across your farm.",
    operationsCopy: "From connected equipment tracking to trip history, field activity and reports, RoadLenz keeps operational context in one place.",
    operationsPoints: [
      { title: "Real-time equipment location", description: "See connected assets on the map.", icon: "pin" },
      { title: "Route history", description: "Review previous movement and activity.", icon: "route" },
      { title: "Fuel monitoring", description: "Use compatible fuel sensor data where fitted.", icon: "fuel" },
      { title: "Fleet grouping", description: "Organise assets by farm, field or operator.", icon: "users" },
      { title: "Idle activity", description: "Review equipment idle time and status.", icon: "clock" },
      { title: "Reports", description: "Use distance and activity data for planning.", icon: "doc" },
    ],
    mobileTitle: "Farm operations in your hands.",
    mobileCopy: "Look up connected equipment, movement, configured video and alerts from the RoadLenz mobile experience.",
    mobilePoints: [
      { title: "Live tracking", description: "See equipment location on the go.", icon: "pin" },
      { title: "Field activity", description: "Review current movement and status.", icon: "map" },
      { title: "Instant alerts", description: "See operational events quickly.", icon: "bell" },
      { title: "Fuel & activity", description: "Review available equipment context.", icon: "fuel" },
    ],
    whyTitle: "Trusted by progressive operations. Built for what’s next.",
    why: [
      { title: "Greater productivity", description: "Get more visibility from connected equipment.", icon: "gauge" },
      { title: "Lower avoidable cost", description: "Use idle and activity data to improve planning.", icon: "fuel" },
      { title: "Data-driven decisions", description: "Turn movement and report data into better choices.", icon: "doc" },
      { title: "Scalable platform", description: "Support more equipment, fields and operating groups.", icon: "users" },
    ],
    ctaEyebrow: "Ready for smarter connected farming?",
    ctaTitle: "Let’s build a more productive future for agriculture.",
    ctaCopy: "See how RoadLenz can help connect equipment, optimise operations and improve fleet visibility.",
    ctaImage: "/media/solutions/agriculture-hero.jpg",
  },
};

const solutionSlugs: Record<IndustrySlug, string> = {
  "cab-taxi": "taxi",
  "school-transport": "school-transport",
  "public-transport": "public-transport",
  "employee-transport": "employee-transport",
  "trucking-logistics": "logistics",
  mining: "mining",
  agriculture: "agriculture",
};

export function getIndustryPresentation(slug: string): IndustryPresentation | undefined {
  return presentations[slug as IndustrySlug];
}

export function getSolutionSlugForIndustry(slug: string): string | undefined {
  return solutionSlugs[slug as IndustrySlug];
}

export function getOrderedIndustryRecords<T extends { slug: string }>(records: T[]): T[] {
  const bySlug = new Map(records.map((record) => [record.slug, record]));
  return INDUSTRY_ORDER.map((slug) => bySlug.get(slug)).filter((record): record is T => Boolean(record));
}

export function getIndustryAssetPaths(): string[] {
  return Array.from(
    new Set(
      INDUSTRY_ORDER.flatMap((slug) => {
        const item = presentations[slug];
        return [item.vehicleImage, item.sceneImage, item.montageImage, item.ctaImage];
      }),
    ),
  );
}
