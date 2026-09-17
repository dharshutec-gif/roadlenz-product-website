import type { Metadata } from "next";
import ResourcesHub from "@/components/resources/ResourcesHub";
import { readResourceHub } from "@/lib/resource-server";
export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Resources", description: "Practical guidance, product resources and fleet intelligence to help your operation move with more clarity." };
export default async function ResourcesPage({searchParams}:{searchParams:Promise<{type?:string}>}) {
  const type=(await searchParams).type;
  const sections:Record<string,string>={video:"videos",webinar:"videos",download:"downloads",documentation:"documentation",warranty:"documentation","case-study":"case-studies",faq:"help",guide:"insights",insight:"insights"};
  return <ResourcesHub {...readResourceHub()} initialSection={type ? sections[type] ?? "insights" : "insights"}/>;
}
