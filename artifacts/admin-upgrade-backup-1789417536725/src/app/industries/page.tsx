import type { Metadata } from "next";
import { listEntity, publishedOf, readDb } from "@/lib/db";
import type { Industry } from "@/lib/types";
import IndustriesExperience from "@/components/industries/industriesExperience";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Industries | RoadLenz Fleet Intelligence",
  description:
    "Explore RoadLenz fleet intelligence for cab and taxi, school transport, public transport, employee transport, logistics, mining and agriculture operations.",
};

export default function IndustriesPage() {
  const db = readDb();

  const industries = publishedOf<Industry>(
    listEntity<Industry>(db, "industries"),
  );

  return <IndustriesExperience industries={industries} />;
}