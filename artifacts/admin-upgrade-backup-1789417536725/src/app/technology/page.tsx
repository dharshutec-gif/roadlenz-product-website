import type { Metadata } from "next";
import TechnologyExperience from "@/components/technology/TechnologyExperience";

export const metadata: Metadata = {
  title: "Technology",
  description:
    "Explore RoadLenz fleet software for live GPS tracking, live camera, track history, alerts, recordings, AI safety, fuel monitoring, reports, company grouping and mobile fleet operations.",
};

export default function TechnologyPage() {
  return <TechnologyExperience />;
}
