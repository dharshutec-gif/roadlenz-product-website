import type { Metadata } from "next";
import { notFound } from "next/navigation";
import TechnologyRoutePage from "../../../components/technology/TechnologyRoutePage";
import {
  getTechnologyPage,
  technologyPages,
} from "../../../components/technology/technologyPages";

import { getTechnologyRoute } from "../../../components/technology/technologyRoutes";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return technologyPages.map((route) => ({ slug: route.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const route = getTechnologyPage(slug);

  if (!route) {
    return {
      title: "Technology | RoadLenz",
    };
  }

  return {
    title: `${route.label} | RoadLenz Technology`,
    description: getTechnologyRoute(slug)?.description ?? route.description,
  };
}

export default async function TechnologyDetailPage({ params }: Props) {
  const { slug } = await params;
  const route = getTechnologyPage(slug);

  if (!route) notFound();

  return <TechnologyRoutePage route={route} />;
}
