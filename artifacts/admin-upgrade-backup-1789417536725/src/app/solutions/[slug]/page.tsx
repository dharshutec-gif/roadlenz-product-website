import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { listEntity, publishedOf, readDb } from "@/lib/db";
import SolutionExperience from "@/components/solutions/SolutionExperience";
import type { Product, Solution } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const solution = publishedOf<Solution>(listEntity<Solution>(readDb(), "solutions")).find((item) => item.slug === slug);
  if (!solution) return { title: "Solution not found" };
  const image = solution.heroMedia.type === "image" ? solution.heroMedia.src : solution.heroMedia.poster;
  return { title: `${solution.name} Solution`, description: solution.heroSummary, openGraph: { title: solution.heroTitle, description: solution.heroSummary, images: image ? [{ url: image }] : [] }, twitter: { card: "summary_large_image", title: solution.heroTitle, description: solution.heroSummary, images: image ? [image] : [] } };
}

export default async function SolutionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const db = readDb();
  const solution = publishedOf<Solution>(listEntity<Solution>(db, "solutions")).find((item) => item.slug === slug);
  if (!solution) notFound();
  const related = new Set([
    ...(solution.relatedProductSlugs ?? []),
    ...(solution.recommendedProducts ?? []).map((item) => item.productSlug),
  ]);
  const products = publishedOf<Product>(listEntity<Product>(db, "products")).filter((product) => related.has(product.slug));
  return <SolutionExperience solution={solution} products={products} />;
}
