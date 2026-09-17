import type { Metadata } from "next";
import { notFound } from "next/navigation";
import TechnologyRoutePage from "../../../components/technology/TechnologyRoutePage";
import {
  getTechnologyRoute,
  technologyRoutes,
} from "../../../components/technology/technologyRoutes";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return technologyRoutes.map((route) => ({ slug: route.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const route = getTechnologyRoute(slug);

  if (!route) {
    return {
      title: "Technology | RoadLenz",
    };
  }

  return {
    title: `${route.label} | RoadLenz Technology`,
    description: route.description,
  };
}

export default async function TechnologyDetailPage({ params }: Props) {
  const { slug } = await params;
  const route = getTechnologyRoute(slug);

  if (!route) notFound();

  return <TechnologyRoutePage route={route} />;
}
