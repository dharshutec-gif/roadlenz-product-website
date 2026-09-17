import type { Solution, SolutionJourneyStage } from "./types";

const stages: SolutionJourneyStage[] = [
  { title: "Warehouse", label: "Warehouse", description: "Confirm the load and vehicle readiness before dispatch. Bring the first journey events into view.", status: "Chennai · Ready for dispatch", media: { type: "image", src: "" }, nodeX: 10, nodeY: 72, order: 1 },
  { title: "In Transit", label: "In Transit", description: "Follow the shipment along its route with location, driver and available cargo-event context.", status: "On route · On schedule", media: { type: "image", src: "" }, nodeX: 49, nodeY: 43, order: 2 },
  { title: "Delivery", label: "Delivery", description: "Review arrival and unloading context, with the completed journey available for operational follow-up.", status: "Bengaluru · Delivery reached", media: { type: "image", src: "" }, nodeX: 89, nodeY: 23, order: 3 },
];

function details(index: number) {
  return [
    { label: "Vehicle", value: "Truck LZ-204" },
    { label: "Driver status", value: index === 2 ? "At delivery" : "On duty" },
    { label: "Current speed", value: index === 1 ? "78 km/h" : "0 km/h" },
    { label: "Cargo status", value: ["Loaded", "Secure", "Received"][index] },
    { label: "Route", value: "Chennai → Bengaluru" },
    { label: "ETA", value: ["2h 18m", "1h 05m", "Arrived"][index] },
    { label: "Engine status", value: ["Idle", "Running", "Off"][index] },
    { label: "Door status", value: index === 2 ? "Open for unloading" : "Closed" },
  ];
}

/** One-time v15 migration and fresh-seed initializer. Does not mutate any Product. */
export function upgradeLogisticsSolution(solution: Solution): void {
  if (!["logistics", "logistics-trucking"].includes(solution.slug)) return;
  solution.slug = "logistics";
  solution.logisticsContent = {
    challengeEyebrow: "The challenge",
    challengeTitle: "Built for every moving load.",
    challengeSummary: "Logistics never stops. Bring clearer visibility to the road, the driver and the load.",
    journeyEyebrow: "The Freight Control Room",
    journeyTitle: "Live visibility from warehouse to delivery.",
    journeySummary: "Follow every kilometre, every stop and every stage of the shipment.",
    stageHeading: "Journey stage",
    technologyEyebrow: "Connected technology",
    setupEyebrow: "Recommended RoadLenz Setup",
    setupTitle: "A connected setup for logistics and trucking.",
    setupReasonsTitle: "Why it is recommended",
    outcomeEyebrow: "Operational outcomes",
    faqTitle: "Frequently asked questions",
    demoLabel: "Illustrative freight journey",
    mediaFallback: "Product image coming soon",
    emptyProductsLabel: "Talk to RoadLenz about a setup for your fleet.",
    pauseLabel: "Pause journey", resumeLabel: "Resume journey",
    productActionLabel: "View Product", enquiryLabel: "Add to Enquiry",
    ...solution.logisticsContent,
  };
  solution.liveStatus ??= [
    { label: "Vehicle", value: "Truck LZ-204" }, { label: "Journey", value: "Warehouse → Delivery" },
    { label: "Route", value: "Chennai → Bengaluru" }, { label: "Connection", value: "Connected" },
  ];
  solution.painPoints ??= [
    { title: "Route blind spots", description: "Limited visibility across long routes can lead to inefficient stops and slower decisions.", icon: "pin", order: 1 },
    { title: "Driver and cargo risk without evidence", description: "Review incidents with available video and journey context, instead of disconnected reports.", icon: "shield", order: 2 },
    { title: "Delayed delivery decisions", description: "Help teams respond to route changes and customer enquiries with clearer operational information.", icon: "clock", order: 3 },
  ];
  solution.journeyStages ??= stages.map((stage) => structuredClone(stage));
  const oldTitles = ["Warehouse", "In Transit", "Delivered"];
  const oldDescriptions = ["The journey begins with live operational visibility.", "Location and vehicle context remain visible while the journey is active.", "The completed stage is recorded for operational review."];
  solution.journeyStages.forEach((stage, index) => {
    if (!stages[index]) return;
    if (stage.title === oldTitles[index] && stage.description === oldDescriptions[index]) {
      stage.title = stages[index].title;
      stage.description = stages[index].description;
      if (stage.label === oldTitles[index]) stage.label = stages[index].label;
      if (stage.nodeX === [6, 36, 69][index] && stage.nodeY === [64, 54, 58][index]) {
        stage.nodeX = stages[index].nodeX; stage.nodeY = stages[index].nodeY;
      }
    }
    stage.status ??= stages[index].status;
    stage.details ??= details(index);
  });
  solution.technologyTitle ??= "One shipment. One connected operational view.";
  solution.technologyDescription ??= "Connected RoadLenz hardware brings the cab, journey and available cargo context into one operational view.";
  const outcomes = [
    { title: "Safer deliveries", description: "Support safer driving decisions with vehicle, driver and journey context.", icon: "shield", order: 1 },
    { title: "Faster incident review", description: "Find available video and route evidence together when an event needs attention.", icon: "clock", order: 2 },
    { title: "Protected cargo", description: "Review supported cargo events and route context to help safeguard the load.", icon: "box", order: 3 },
    { title: "More reliable operations", description: "Give dispatch teams clearer information for delivery planning and follow-up.", icon: "gauge", order: 4 },
  ];
  solution.benefits ??= outcomes;
  solution.benefits.forEach((benefit, index) => {
    if (!outcomes[index]) return;
    if ([`A clearer ${benefit.title.toLowerCase()} outcome for the transport team.`, `Operational visibility for ${benefit.title.toLowerCase()}.`].includes(benefit.description)) Object.assign(benefit, outcomes[index]);
  });
  solution.outcomeTitle ??= "Built for safer, more efficient deliveries.";
  solution.faqs ??= [
    { label: "Which fleets is this solution suitable for?", value: "The setup can be selected around long-haul trucks, distribution vehicles and logistics fleets. Discuss vehicle types and operating priorities with RoadLenz." },
    { label: "Can I review live and recorded video remotely?", value: "Supported recording devices can provide remote viewing and incident playback workflows. Availability depends on the selected hardware, connectivity and configuration." },
    { label: "Can cargo and door events be included?", value: "Compatible cargo or door sensing can be discussed as part of your deployment. RoadLenz can confirm suitable hardware and integration requirements for your vehicles." },
    { label: "Is installation and support available?", value: "Contact RoadLenz to discuss vehicle compatibility, installation planning and support for your fleet rollout." },
  ];
  solution.recommendedProducts ??= (solution.relatedProductSlugs ?? []).map((productSlug, index) => ({ productSlug, explanation: "", order: index + 1 }));
  if (solution.heroCtaLabel == null || solution.heroCtaLabel === "Explore the journey") solution.heroCtaLabel = "Request Quote";
  if (solution.heroCtaHref == null || solution.heroCtaHref === "#capabilities") solution.heroCtaHref = "/request-quote?solution=logistics";
  solution.ctaPrimaryLabel ??= "Talk to an Expert";
  solution.ctaPrimaryHref ??= "/contact?solution=logistics";
  solution.ctaSecondaryLabel ??= "Request Quote";
  solution.ctaSecondaryHref ??= "/request-quote?solution=logistics";
}
