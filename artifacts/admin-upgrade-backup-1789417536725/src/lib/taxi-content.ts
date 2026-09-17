import type { Solution, TaxiContent } from "./types";

/** CMS seed/migration content. Public components never import these defaults. */
export const taxiCopy: Required<TaxiContent> = {
  heroEyebrow: "Cab & Taxi Operations",
  enquiryLabel: "Add to Enquiry",
  challengeTitle: "Built around every trip.",
  challengeSummary: "Clearer visibility for the people, vehicles and decisions behind every ride.",
  journeyTitle: "The Trip Control Room.",
  journeySummary: "Follow a connected journey, from booking to destination.",
  setupTitle: "Recommended RoadLenz Setup",
  setupSummary: "Connected devices. Clearer trip context.",
  setupReasonsTitle: "Why this setup works",
  faqTitle: "Frequently asked questions",
  demoLabel: "Illustrative trip experience",
  mediaFallback: "Device imagery will appear here when available.",
  pauseLabel: "Pause journey",
  resumeLabel: "Resume journey",
  productActionLabel: "View product",
};

const stages = [
  { title: "Booking", label: "Booking", description: "Begin with a clear view of the assigned vehicle and the journey ahead.", status: "Journey planned", nodeX: 12, nodeY: 72 },
  { title: "Passenger Pickup", label: "Passenger Pickup", description: "Connect vehicle location and available journey context as the passenger is picked up.", status: "Pickup in view", nodeX: 49, nodeY: 44 },
  { title: "Destination Reached", label: "Destination Reached", description: "Review the completed route with available location and event evidence.", status: "Journey complete", nodeX: 88, nodeY: 26 },
];

const legacyDescriptions = [
  "The journey begins with live operational visibility.",
  "Location and vehicle context remain visible while the journey is active.",
  "The completed stage is recorded for operational review.",
];

/** Called once by database v14; also supplies the same defaults to fresh seeds. */
export function upgradeTaxiSolution(solution: Solution): void {
  if (solution.slug !== "taxi" && solution.slug !== "cab-taxi") return;
  solution.slug = "taxi";
  solution.taxiContent = { ...taxiCopy, ...solution.taxiContent };
  const capabilities = [
    { title: "Fleet Safety", icon: "shield", description: "Bring vehicle and journey context together when your team needs to review a risk.", visual: { type: "image" as const, src: "" }, order: 1 },
    { title: "Video Telematics", icon: "video", description: "Connect available event evidence with the trip it belongs to.", visual: { type: "image" as const, src: "" }, order: 2 },
    { title: "GPS Tracking", icon: "gps", description: "Keep location and route progress visible across the journey.", visual: { type: "image" as const, src: "" }, order: 3 },
    { title: "Driver Monitoring", icon: "users", description: "Give operators clearer context around supported driver-risk events.", visual: { type: "image" as const, src: "" }, order: 4 },
  ];
  solution.capabilityTitle ??= "Trip intelligence at a glance";
  if (solution.capabilityTitle === `Built for smarter ${solution.name.toLowerCase()} operations.`) solution.capabilityTitle = "Trip intelligence at a glance";
  solution.capabilities ??= capabilities;
  solution.capabilities.forEach((capability) => {
    const target = capabilities.find((item) => item.title === capability.title);
    if (target && capability.description === `${capability.title} is brought into the same RoadLenz operational view for this solution.`) {
      capability.description = target.description;
      const legacyIcon = ["gps", "shield", "video", "users"][capabilities.indexOf(target)];
      if (capability.icon === legacyIcon) capability.icon = target.icon;
    }
  });
  const benefits = [
    { title: "Safer Trips", description: "Help your team identify and review risks with connected journey context.", icon: "shield", order: 1 },
    { title: "Verified Events", description: "Review available video and location evidence alongside the trip record.", icon: "video", order: 2 },
    { title: "Fleet Visibility", description: "Keep vehicle movement and route history within reach of the operations team.", icon: "route", order: 3 },
    { title: "Driver Monitoring", description: "Support informed follow-up around configured driver-risk events.", icon: "users", order: 4 },
  ];
  solution.benefits ??= benefits;
  solution.benefits.forEach((benefit) => {
    const target = benefits.find((item) => item.title === benefit.title);
    if (target && [`A clearer ${benefit.title.toLowerCase()} outcome for the transport team.`, `Operational visibility for ${benefit.title.toLowerCase()}.`].includes(benefit.description)) benefit.description = target.description;
  });
  solution.recommendedProducts ??= solution.relatedProductSlugs.map((productSlug, index) => ({ productSlug, explanation: "", order: index + 1 }));
  solution.painPoints ??= [
    { title: "Limited trip visibility", description: "Keep vehicle movement and journey progress in view, from dispatch to arrival.", icon: "eye", order: 1 },
    { title: "Risk events without context", description: "Bring available video and location evidence together when an event needs attention.", icon: "shield", order: 2 },
    { title: "Passenger confidence", description: "Support a more accountable operation with clearer records of each journey.", icon: "users", order: 3 },
  ];
  solution.journeyStages ??= stages.map((stage, index) => ({ ...stage, media: { type: "image", src: "" }, order: index + 1 }));
  // Replace only recognized generated fields; never reset an edited stage or empty list.
  solution.journeyStages.forEach((stage, index) => {
    const target = stages[index];
    if (!target) return;
    const legacyTitle = ["Booking", "Live Trip", "Destination"][index];
    if (stage.title === legacyTitle && stage.description === legacyDescriptions[index]) {
      stage.title = target.title;
      if (!stage.label || stage.label === legacyTitle) stage.label = target.label;
      stage.description = target.description;
      stage.status ??= target.status;
      if (stage.nodeX === [6, 36, 69][index] && stage.nodeY === [64, 54, 58][index]) {
        stage.nodeX = target.nodeX;
        stage.nodeY = target.nodeY;
      }
    }
  });
  solution.technologyTitle ??= "One trip. One connected view.";
  solution.blueprintMedia ??= { type: "image", src: "/media/solutions/taxi-connected-view.png" };
  solution.technologyDescription ??= "A connected RoadLenz setup brings location, video and driver context together around every trip.";
  solution.outcomeTitle ??= "Better context. Better journeys.";
  solution.outcomeSummary ??= "Help your team act with confidence across the operation.";
  solution.faqs ??= [
    { label: "What makes up the Cab & Taxi setup?", value: "The recommended setup links the RoadLenz devices shown on this page. Open each product for its capabilities, and discuss vehicle compatibility with our team." },
    { label: "How can location and video help the team?", value: "Supported GPS and video devices bring route history and available event evidence into the review process, giving operators more context around a trip." },
    { label: "Can the setup be adapted to our vehicles?", value: "Talk to RoadLenz about your vehicle types, fleet size and operating priorities to select a suitable device configuration." },
    { label: "How do we get started?", value: "Request a quote with your fleet requirements. The RoadLenz team can discuss the recommended hardware, installation and deployment approach." },
  ];
  if (solution.heroMedia == null || solution.heroMedia.src === "/media/vehicles/veh-cab.png") solution.heroMedia = { type: "image", src: "/media/solutions/taxi-hero.jpg" };
  if (solution.vehicleImage == null || solution.vehicleImage === "/media/vehicles/veh-cab.png") solution.vehicleImage = "/media/vehicles/taxi-cab.png";
  if (solution.heroCtaLabel == null || solution.heroCtaLabel === "Explore the journey") solution.heroCtaLabel = "Request Quote";
  if (solution.heroCtaHref == null || solution.heroCtaHref === "#capabilities") solution.heroCtaHref = "/request-quote?solution=taxi";
  solution.ctaTitle ??= "Build a more connected taxi operation.";
  solution.ctaSummary ??= "Talk to RoadLenz about the right setup for your vehicles and operating priorities.";
  solution.ctaPrimaryLabel ??= "Talk to an Expert";
  solution.ctaPrimaryHref ??= "/contact?solution=taxi";
  solution.ctaSecondaryLabel ??= "Request Quote";
  solution.ctaSecondaryHref ??= "/request-quote?solution=taxi";
}

/** One-time v16 upgrade; preserve edited content and intentional empty lists. */
export function upgradeTaxiOperations(solution: Solution): void {
  if (solution.slug !== "taxi") return;
  solution.taxiContent = { ...taxiCopy, ...solution.taxiContent };
  solution.liveStatus ??= [{ label: "Cab ID", value: "TX-104" }, { label: "Status", value: "On Trip" }, { label: "Route", value: "City Centre" }, { label: "ETA", value: "08 min" }, { label: "Connection", value: "Connected" }];
  solution.journeyStages?.forEach((stage, i) => {
    if (i > 2) return;
    if (stage.title === "Booking" && stage.description === stages[0].description) { stage.title = "Booking Confirmed"; if (stage.label === "Booking") stage.label = stage.title; }
    stage.details ??= [{ label: "Trip ID", value: "TX-104" }, { label: "Driver status", value: "Active" }, { label: "Speed", value: i === 1 ? "42 km/h" : "0 km/h" }, { label: "Pickup zone", value: "Bandra West" }, { label: "ETA", value: ["12 min", "08 min", "Arrived"][i] }, { label: "Trip status", value: ["Booking confirmed", "On trip", "Destination reached"][i] }];
  });
  const changes: Record<string, string> = { "Risk events without context": "Driver-risk events without context", "Passenger confidence": "Passenger safety uncertainty" };
  solution.painPoints?.forEach(item => { if (changes[item.title] && ["Bring available video and location evidence together when an event needs attention.", "Support a more accountable operation with clearer records of each journey."].includes(item.description)) item.title = changes[item.title]; });
  const titles = ["Safer drivers", "Better passenger confidence", "Clearer trip evidence", "Faster operations"];
  const old = ["Safer Trips", "Verified Events", "Fleet Visibility", "Driver Monitoring"];
  const descriptions = ["Support safer driving decisions with connected trip context.", "Help teams provide a more accountable passenger experience.", "Review available video and location evidence alongside each trip.", "Give operators clearer information for timely follow-up."];
  solution.benefits?.forEach((item, i) => { if (item.title === old[i] && ["Help your team identify and review risks with connected journey context.", "Review available video and location evidence alongside the trip record.", "Keep vehicle movement and route history within reach of the operations team.", "Support informed follow-up around configured driver-risk events."].includes(item.description)) { item.title = titles[i]; item.description = descriptions[i]; } });
}
