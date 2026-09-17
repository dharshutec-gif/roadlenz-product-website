import type { Solution, LogisticsContent } from "./types";
const copy: LogisticsContent = {
  challengeEyebrow: "The challenge", challengeTitle: "Built for every public journey.", challengeSummary: "Bring passenger, route and vehicle context together to help teams keep public transport moving.",
  journeyEyebrow: "Live operation", journeyTitle: "The Transit Operations Room.", journeySummary: "Follow the bus, its route and available passenger context from depot to passenger stop.", stageHeading: "Journey progress",
  technologyEyebrow: "Connected technology", setupEyebrow: "Recommended RoadLenz Setup", setupTitle: "A connected setup for public transport.", setupReasonsTitle: "Why this setup works",
  outcomeEyebrow: "Real outcomes", faqTitle: "Your questions, answered.", demoLabel: "Illustrative transit service", mediaFallback: "Product image coming soon", emptyProductsLabel: "Talk to RoadLenz about a setup for your buses.",
  pauseLabel: "Pause service", resumeLabel: "Resume service", productActionLabel: "View Product", enquiryLabel: "Add to Enquiry",
};
const titles = ["Depot", "Active Route", "Passenger Stop"];
const descriptions = ["Review bus readiness and the assigned route before the service begins.", "Follow the bus along its route with location and available passenger context.", "Review the passenger stop, door status and available boarding information."];
const stages = titles.map((title, i) => ({ title, label: title, description: descriptions[i], status: ["Depot - Ready", "Route 18 - In service", "Riverside Station - Boarding"][i], nodeX: [12, 48, 87][i], nodeY: [24, 48, 73][i], media: { type: "image" as const, src: "" }, order: i + 1 }));
const slugs = ["roadlenz-4ch-mdvr-sd-storage", "roadlenz-people-counting-camera", "roadlenz-wired-gps-tracker", "roadlenz-2ch-ai-dashcam", "roadlenz-driver-monitoring-camera"];
export function upgradePublicTransportSolution(solution: Solution): void {
  if (solution.slug !== "public-transport") return;
  solution.transitContent = { ...copy, ...solution.transitContent };
  solution.liveStatus ??= [{ label: "Bus ID", value: "PT-42" }, { label: "Status", value: "Active Route" }, { label: "Route number", value: "18" }, { label: "Onboard", value: "46" }, { label: "Connection", value: "Connected" }];
  solution.painPoints ??= [
    { title: "Limited passenger visibility", description: "Bring available passenger counts and boarding context into the operating view.", icon: "users", order: 1 },
    { title: "Route disruption without context", description: "Give teams clearer location and event information when service is disrupted.", icon: "alert", order: 2 },
    { title: "Driver and vehicle safety risk", description: "Support safety reviews with available driver, road and vehicle evidence.", icon: "shield", order: 3 },
  ];
  const legacy = ["The journey begins with live operational visibility.", "Location and vehicle context remain visible while the journey is active.", "The completed stage is recorded for operational review."];
  solution.journeyStages ??= structuredClone(stages);
  solution.journeyStages.forEach((stage, i) => {
    if (!stages[i]) return;
    if (stage.title === titles[i] && stage.description === legacy[i]) {
      stage.description = descriptions[i];
      if (stage.nodeX === [6,36,69][i] && stage.nodeY === [64,54,58][i]) { stage.nodeX = stages[i].nodeX; stage.nodeY = stages[i].nodeY; }
    }
    stage.status ??= stages[i].status;
    stage.details ??= [{ label: "Bus ID", value: "PT-42" }, { label: "Driver status", value: "On duty" }, { label: "Route", value: "Route 18 - Riverside Loop" }, { label: "Current stop", value: ["Depot", "Central Station", "Riverside Station"][i] }, { label: "Onboard count", value: ["0", "46", "52"][i] }, { label: "Next-stop ETA", value: ["12 min", "2 min", "8 min"][i] }, { label: "Door status", value: i === 2 ? "Open" : "Closed" }, { label: "Service status", value: ["Ready", "In service", "Boarding"][i] }];
  });
  const rationale = ["Brings multiple vehicle camera feeds into one recorded evidence system.", "Adds passenger-flow context to the operation.", "Provides continuous vehicle location and route visibility.", "Adds road and driver-facing video context for safety events.", "Adds dedicated driver attention and behaviour context."];
  const isLegacy = solution.recommendedProducts?.length === 4 && solution.recommendedProducts.every((item, i) => item.productSlug === slugs[i] && item.explanation === rationale[i] && item.order === i + 1);
  if (solution.recommendedProducts == null || isLegacy) { const previous = solution.recommendedProducts ?? []; solution.recommendedProducts = slugs.map((productSlug, i) => ({ ...previous.find(p => p.productSlug === productSlug), productSlug, explanation: rationale[i], order: i + 1 })); }
  solution.technologyTitle ??= "One route. One connected operational view.";
  solution.technologyDescription ??= "Connected RoadLenz hardware brings bus location, video and supported passenger events together.";
  const benefits = [
    { title: "Safer passengers", description: "Support passenger safety reviews with available video and event evidence.", icon: "shield", order: 1 },
    { title: "Better route visibility", description: "Give teams clearer route and location context to support service decisions.", icon: "pin", order: 2 },
    { title: "Accurate passenger counts", description: "Use supported counting data to understand boarding patterns and inform capacity planning.", icon: "users", order: 3 },
    { title: "More reliable service", description: "Bring route, passenger and vehicle context into operational follow-up.", icon: "gauge", order: 4 },
  ];
  solution.benefits ??= benefits;
  solution.benefits.forEach((item, i) => { if (benefits[i] && [`A clearer ${item.title.toLowerCase()} outcome for the transport team.`, `Operational visibility for ${item.title.toLowerCase()}.`].includes(item.description)) Object.assign(item, benefits[i]); });
  solution.outcomeTitle ??= "A better journey for everyone.";
  solution.faqs ??= [
    { label: "How does RoadLenz help with passenger counting?", value: "Supported people-counting cameras provide passenger-flow context for reviewing boarding patterns and planning capacity. Results depend on installation and operating conditions." },
    { label: "Can the setup work across our fleet?", value: "Discuss your bus types, routes and rollout requirements with RoadLenz to confirm suitable hardware and configuration." },
    { label: "How are video and operating data managed?", value: "Access, recording and retention depend on the chosen platform and configuration. RoadLenz can discuss requirements with your operations team." },
    { label: "How is installation planned?", value: "RoadLenz can review vehicle compatibility, camera positions, connectivity and deployment requirements with your team." },
  ];
  if (solution.heroCtaLabel == null || solution.heroCtaLabel === "Explore the journey") solution.heroCtaLabel = "Request Quote";
  if (solution.heroCtaHref == null || solution.heroCtaHref === "#capabilities") solution.heroCtaHref = "/request-quote?solution=public-transport";
  solution.ctaPrimaryLabel ??= "Talk to an Expert"; solution.ctaPrimaryHref ??= "/contact?solution=public-transport";
  solution.ctaSecondaryLabel ??= "Request Quote"; solution.ctaSecondaryHref ??= "/request-quote?solution=public-transport";
}
