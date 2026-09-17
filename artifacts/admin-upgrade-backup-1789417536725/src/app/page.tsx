import type { Metadata } from "next";

import { readDb } from "@/lib/db";
import HomeExperience from "@/components/home/HomeExperience";

export const metadata: Metadata = {
  title: "Smart Fleet Intelligence | RoadLenz",
  description:
    "RoadLenz connects GPS tracking, video telematics, AI driver safety and fleet analytics in one intelligent platform.",
};

const ordered = <T extends { order: number }>(items: T[]) =>
  [...items].sort((a, b) => a.order - b.order);

export default function HomePage() {
  const db = readDb();

  return (
    <HomeExperience
      heroSlides={ordered(db.heroSlides)}
      stats={ordered(db.stats)}
      industries={ordered(db.industries)}
      products={ordered(db.products)}
      customerLogos={ordered(db.customerLogos)}
      locations={ordered(db.locations)}
      whyPoints={ordered(db.whyPoints)}
    />
  );
}