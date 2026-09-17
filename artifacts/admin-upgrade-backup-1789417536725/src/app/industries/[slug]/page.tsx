import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { listEntity, publishedOf, readDb } from "@/lib/db";
import type { Industry, Solution } from "@/lib/types";
import IndustryDetailExperience from "@/components/industries/IndustryDetailExperience";
import {
  getIndustryPresentation,
  getSolutionSlugForIndustry,
} from "@/components/industries/industryPresentation";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const db = readDb();
  const industry = publishedOf<Industry>(listEntity<Industry>(db, "industries")).find((item) => item.slug === slug);
  const presentation = getIndustryPresentation(slug);
  if (!industry || !presentation) return { title: "Industry not found" };

  const description = industry.summary?.[0] || industry.tagline || presentation.heroCopy;
  return {
    title: `${industry.name} Fleet Intelligence | RoadLenz`,
    description,
    openGraph: {
      title: `${industry.name} Fleet Intelligence | RoadLenz`,
      description,
      images: [{ url: presentation.sceneImage }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${industry.name} Fleet Intelligence | RoadLenz`,
      description,
      images: [presentation.sceneImage],
    },
  };
}

export default async function IndustryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const db = readDb();
  const industries = publishedOf<Industry>(listEntity<Industry>(db, "industries"));
  const industry = industries.find((item) => item.slug === slug);
  const presentation = getIndustryPresentation(slug);
  if (!industry || !presentation) notFound();

  const solutionSlug = getSolutionSlugForIndustry(slug);
  const solution = solutionSlug
    ? publishedOf<Solution>(listEntity<Solution>(db, "solutions")).find((item) => item.slug === solutionSlug)
    : undefined;

  return <IndustryDetailExperience industry={industry} presentation={presentation} solution={solution} />;
}
