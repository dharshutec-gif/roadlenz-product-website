import type { Solution, SolutionJourneyStage, LogisticsContent } from "./types";

/** Editable defaults used by the v17 migration and fresh Agriculture seeds. */
const copy: LogisticsContent = {
  challengeEyebrow: "The challenge", challengeTitle: "Built for every working acre.",
  challengeSummary: "Bring clearer visibility to equipment, field activity and the decisions behind each season.",
  journeyEyebrow: "Live operations", journeyTitle: "The Field Operations Room.",
  journeySummary: "Follow equipment activity, task progress and available operating context across the field.",
  stageHeading: "Task stages", technologyEyebrow: "Connected technology",
  setupEyebrow: "Recommended RoadLenz Setup", setupTitle: "A complete setup for agricultural fleets.",
  setupReasonsTitle: "Why this setup works", outcomeEyebrow: "Real outcomes", faqTitle: "Your questions, answered.",
  demoLabel: "Illustrative field operation", mediaFallback: "Product image coming soon",
  emptyProductsLabel: "Talk to RoadLenz about a setup for your equipment.",
  pauseLabel: "Pause task", resumeLabel: "Resume task", productActionLabel: "View Product", enquiryLabel: "Add to Enquiry",
};
const stages: SolutionJourneyStage[] = [
  { title: "Field Entry", label: "Field Entry", description: "Confirm the equipment has reached the assigned field and is ready for work.", status: "Field Block C · Ready", nodeX: 18, nodeY: 72, media: { type: "image", src: "" }, order: 1 },
  { title: "Active Work", label: "Active Work", description: "Follow the working route and available engine, fuel and task context while equipment is active.", status: "Field Block C · In progress", nodeX: 52, nodeY: 40, media: { type: "image", src: "" }, order: 2 },
  { title: "Task Complete", label: "Task Complete", description: "Review the completed field activity and recorded equipment context for operational follow-up.", status: "Field Block C · Complete", nodeX: 85, nodeY: 72, media: { type: "image", src: "" }, order: 3 },
];
export function upgradeAgricultureSolution(solution: Solution): void {
  if (solution.slug !== "agriculture") return;
  solution.agricultureContent = { ...copy, ...solution.agricultureContent };
  solution.liveStatus ??= [
    { label: "Tractor ID", value: "AG-72" }, { label: "Task", value: "Active Work" },
    { label: "Field Block", value: "C" }, { label: "Engine", value: "On" }, { label: "Connection", value: "Connected" },
  ];
  solution.painPoints ??= [
    { title: "Limited equipment visibility", description: "Keep equipment location and activity in view across large, seasonal and remote operations.", icon: "eye", order: 1 },
    { title: "Unverified field activity", description: "Bring location and available event records together to understand where work happened.", icon: "doc", order: 2 },
    { title: "Fuel and maintenance uncertainty", description: "Use supported operating data to inform fuel reviews and equipment maintenance planning.", icon: "gauge", order: 3 },
  ];
  solution.journeyStages ??= structuredClone(stages);
  const legacy = ["The journey begins with live operational visibility.", "Location and vehicle context remain visible while the journey is active.", "The completed stage is recorded for operational review."];
  solution.journeyStages.forEach((stage, i) => {
    if (!stages[i]) return;
    if (stage.title === stages[i].title && stage.description === legacy[i]) {
      stage.description = stages[i].description;
      if (stage.nodeX === [6,36,69][i] && stage.nodeY === [64,54,58][i]) { stage.nodeX = stages[i].nodeX; stage.nodeY = stages[i].nodeY; }
    }
    stage.status ??= stages[i].status;
    stage.details ??= [
      { label: "Asset", value: "Tractor AG-72" }, { label: "Operator status", value: i === 2 ? "Task finished" : "Active" },
      { label: "Engine status", value: i === 2 ? "Off" : "On" }, { label: "Field block", value: "Field Block C" },
      { label: "Task status", value: ["Ready", "Active work", "Complete"][i] }, { label: "Fuel level", value: ["68%", "66%", "64%"][i] },
      { label: "Engine hours", value: ["1,284.0 h", "1,284.7 h", "1,285.4 h"][i] }, { label: "Last update", value: "2 min ago" },
    ];
  });
  solution.technologyTitle ??= "One field. One connected operational view.";
  solution.technologyDescription ??= "Connected RoadLenz devices bring equipment location, video and available operating context together.";
  const benefits = [
    { title: "Better equipment use", description: "Understand how equipment is being used across your fields and operating teams.", icon: "gauge", order: 1 },
    { title: "Safer field operations", description: "Support safer working practices with available camera and event context.", icon: "shield", order: 2 },
    { title: "Controlled fuel use", description: "Review supported fuel data when compatible sensing is configured for your equipment.", icon: "gauge", order: 3 },
    { title: "Clearer task records", description: "Bring recorded location and equipment events into task reviews and reporting.", icon: "doc", order: 4 },
  ];
  solution.benefits ??= benefits;
  solution.benefits.forEach((item, i) => {
    if (benefits[i] && [`A clearer ${item.title.toLowerCase()} outcome for the transport team.`, `Operational visibility for ${item.title.toLowerCase()}.`].includes(item.description)) Object.assign(item, benefits[i]);
  });
  solution.outcomeTitle ??= "More value from every season.";
  solution.faqs ??= [
    { label: "What types of agricultural equipment can RoadLenz support?", value: "Discuss tractors, field vehicles and other equipment with RoadLenz. The recommended hardware depends on vehicle compatibility and operating requirements." },
    { label: "Can I view field activity remotely?", value: "Supported tracking and video devices provide location and available event context. Remote access depends on connectivity, device capabilities and configuration." },
    { label: "Does RoadLenz work in remote areas?", value: "Connectivity and coverage vary by location. RoadLenz can help assess recording, tracking and data-access requirements for your fields." },
    { label: "How does fuel monitoring help my operation?", value: "Compatible fuel sensing can add consumption context for operational review. A fuel sensor is not included in the current recommended products; discuss suitable hardware and integration with RoadLenz." },
  ];
  solution.recommendedProducts ??= (solution.relatedProductSlugs ?? []).map((productSlug, i) => ({ productSlug, explanation: "", order: i + 1 }));
  if (solution.heroCtaLabel == null || solution.heroCtaLabel === "Explore the journey") solution.heroCtaLabel = "Request Quote";
  if (solution.heroCtaHref == null || solution.heroCtaHref === "#capabilities") solution.heroCtaHref = "/request-quote?solution=agriculture";
  solution.ctaPrimaryLabel ??= "Talk to an Expert"; solution.ctaPrimaryHref ??= "/contact?solution=agriculture";
  solution.ctaSecondaryLabel ??= "Request Quote"; solution.ctaSecondaryHref ??= "/request-quote?solution=agriculture";
}
