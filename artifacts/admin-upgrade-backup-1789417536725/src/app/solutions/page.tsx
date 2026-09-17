import type { Metadata } from "next";
import { listEntity, publishedOf, readDb } from "@/lib/db";
import SolutionsOverview from "@/components/solutions/SolutionsOverview";
import type { Solution } from "@/lib/types";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Solutions",
  description: "Explore RoadLenz connected vehicle solutions for taxi, school transport, logistics, public transport, employee transport, mining, and agriculture operations.",
};

export default function SolutionsPage() {
  const db = readDb();
  const solutions = publishedOf<Solution>(listEntity<Solution>(db, "solutions"));
  return <SolutionsOverview solutions={solutions} heroMedia={db.settings.solutionsHero} />;
}
