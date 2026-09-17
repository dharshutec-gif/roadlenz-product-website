import type { Solution, LogisticsContent } from "./types";
const copy: LogisticsContent = {
  challengeEyebrow: "The challenge", challengeTitle: "Built around every shift.", challengeSummary: "Bring arrival, boarding and journey context together for the people who keep your business moving.",
  journeyEyebrow: "The Shift Journey Room", journeyTitle: "Live employee transport operations.", journeySummary: "Follow each stage of the shift journey, from pickup to the return trip.", stageHeading: "Journey stages",
  technologyEyebrow: "Connected technology", setupEyebrow: "Recommended RoadLenz Setup", setupTitle: "A complete setup for employee transport.", setupReasonsTitle: "Why this setup works",
  outcomeEyebrow: "Real outcomes", faqTitle: "Your questions, answered.", demoLabel: "Illustrative shift journey", mediaFallback: "Product image coming soon", emptyProductsLabel: "Talk to RoadLenz about a setup for your shuttles.",
  pauseLabel: "Pause journey", resumeLabel: "Resume journey", productActionLabel: "View Product", enquiryLabel: "Add to Enquiry",
};
const titles = ["Pickup Zone", "En Route", "Workplace Arrival", "Return Journey"];
const descriptions = ["Confirm the shuttle is at the pickup zone and review available boarding events.", "Follow the shuttle towards the workplace with route and arrival context.", "Review workplace arrival and available attendance records for the shift.", "Keep the return journey in view as employees travel back to their pickup zones."];
const stages = titles.map((title, i) => ({ title, label: title, description: descriptions[i], status: ["Pickup Zone A - Boarding", "Campus route - In progress", "Workplace - Arrived", "Return route - Scheduled"][i], nodeX: [14, 39, 73, 87][i], nodeY: [25, 58, 28, 73][i], media: { type: "image" as const, src: "" }, order: i + 1 }));
const slugs = ["roadlenz-wired-gps-tracker", "roadlenz-4ch-mdvr-sd-storage", "roadlenz-driver-monitoring-camera", "roadlenz-rfid-attendance-reader", "roadlenz-2ch-ai-dashcam"];
export function upgradeEmployeeTransportSolution(solution: Solution): void {
  if (solution.slug !== "employee-transport") return;
  solution.employeeContent = { ...copy, ...solution.employeeContent };
  solution.liveStatus ??= [{ label: "Shuttle ID", value: "ET-18" }, { label: "Status", value: "Active Route" }, { label: "Pickup Zone", value: "A" }, { label: "Onboard", value: "34" }, { label: "Connection", value: "Connected" }];
  solution.painPoints ??= [
    { title: "Uncertain employee arrival", description: "Give transport teams clearer arrival context to support shift planning.", icon: "clock", order: 1 },
    { title: "Limited route and boarding visibility", description: "Connect shuttle movement with supported boarding events across the journey.", icon: "pin", order: 2 },
    { title: "Safety events without context", description: "Review available video and journey evidence when an incident needs attention.", icon: "shield", order: 3 },
  ];
  const legacyTitles = ["Pickup Zone", "Workplace", "Return Journey"];
  const legacyDescriptions = ["The journey begins with live operational visibility.", "Location and vehicle context remain visible while the journey is active.", "The completed stage is recorded for operational review."];
  if (solution.journeyStages == null || (solution.journeyStages.length === 3 && solution.journeyStages.every((stage, i) => stage.title === legacyTitles[i] && stage.description === legacyDescriptions[i] && (!stage.label || stage.label === legacyTitles[i]) && stage.details == null && stage.status == null))) solution.journeyStages = structuredClone(stages);
  solution.journeyStages?.forEach((stage, i) => {
    if (!stages[i]) return;
    stage.status ??= stages[i].status;
    stage.details ??= [{ label: "Shuttle ID", value: "ET-18" }, { label: "Driver status", value: "On duty" }, { label: "Route", value: "West Campus Loop" }, { label: "Onboard count", value: ["34 / 40", "34 / 40", "0 / 40", "34 / 40"][i] }, { label: "ETA", value: ["12 min", "6 min", "Arrived", "18 min"][i] }, { label: "Shift time", value: "14:00 - 22:00" }, { label: "Attendance status", value: ["Boarding verification", "34 boarding events", "Arrival recorded", "Return boarding"][i] }];
  });
  const oldAssignments = [slugs[1], slugs[0], slugs[3], slugs[2]];
  const rationale = ["Provides continuous vehicle location and route visibility.", "Provides multi-camera recording across the vehicle.", "Adds dedicated driver attention and behaviour context.", "Connects authorised RFID events with the vehicle journey record.", "Adds road and driver-facing video context for safety events."];
  const isLegacy = solution.recommendedProducts?.length === 4 && solution.recommendedProducts.every((item, i) => item.productSlug === oldAssignments[i] && item.explanation === rationale[slugs.indexOf(item.productSlug)] && item.order === i + 1);
  if (solution.recommendedProducts == null || isLegacy) {
    const previous = solution.recommendedProducts ?? [];
    solution.recommendedProducts = slugs.map((productSlug, i) => ({ ...previous.find(p => p.productSlug === productSlug), productSlug, explanation: rationale[i], order: i + 1 }));
  }
  solution.technologyTitle ??= "One shift. One connected operational view.";
  solution.technologyDescription ??= "Connected RoadLenz hardware brings shuttle location, video and supported boarding events into one operational view.";
  const benefits = [
    { title: "More reliable arrivals", description: "Give teams clearer journey context for shift planning and arrival follow-up.", icon: "clock", order: 1 },
    { title: "Safer employee journeys", description: "Support informed safety reviews with available driver and video evidence.", icon: "shield", order: 2 },
    { title: "Verified boarding", description: "Connect supported RFID events with the shuttle journey record.", icon: "users", order: 3 },
    { title: "Clearer transport operations", description: "Bring route, boarding and event context together for operating teams.", icon: "gauge", order: 4 },
  ];
  solution.benefits ??= benefits;
  solution.benefits.forEach((item, i) => { if (benefits[i] && [`A clearer ${item.title.toLowerCase()} outcome for the transport team.`, `Operational visibility for ${item.title.toLowerCase()}.`].includes(item.description)) Object.assign(item, benefits[i]); });
  solution.outcomeTitle ??= "A safer, more dependable shift journey.";
  solution.faqs ??= [
    { label: "How does RoadLenz support employee transport safety?", value: "Supported tracking, video and driver-monitoring devices provide context for operational reviews and configured safety events." },
    { label: "Can RoadLenz integrate with our existing systems?", value: "Discuss your attendance, transport and reporting workflows with RoadLenz to confirm supported integration options." },
    { label: "Is the setup suitable for multiple locations and shifts?", value: "The recommended hardware can be selected around your vehicles, pickup zones and shift patterns. Contact RoadLenz to discuss rollout requirements." },
    { label: "What installation and support is available?", value: "RoadLenz can discuss vehicle compatibility, installation planning and deployment support for your transport operation." },
  ];
  if (solution.heroCtaLabel == null || solution.heroCtaLabel === "Explore the journey") solution.heroCtaLabel = "Request Quote";
  if (solution.heroCtaHref == null || solution.heroCtaHref === "#capabilities") solution.heroCtaHref = "/request-quote?solution=employee-transport";
  solution.ctaPrimaryLabel ??= "Talk to an Expert"; solution.ctaPrimaryHref ??= "/contact?solution=employee-transport";
  solution.ctaSecondaryLabel ??= "Request Quote"; solution.ctaSecondaryHref ??= "/request-quote?solution=employee-transport";
}
