import type { Metadata } from "next";
import DemoExperience from "@/components/book-demo/DemoExperience";

export const metadata: Metadata = {
  title: "Book a Demo",
  description: "See the RoadLenz platform live. Book a personal walkthrough of fleet tracking, video telematics, AI safety and connected hardware.",
};

export default async function BookDemoPage({ searchParams }: {
  searchParams: Promise<{ product?: string | string[] }>;
}) {
  const params = await searchParams;
  const product = typeof params.product === "string" ? params.product.slice(0, 150) : undefined;
  return <DemoExperience product={product} />;
}
