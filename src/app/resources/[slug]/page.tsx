import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { readResourceHub } from "@/lib/resource-server";
import ResourceDetail from "@/components/resources/ResourceDetail";
export const dynamic="force-dynamic";
type Props={params:Promise<{slug:string}>};
export async function generateMetadata({params}:Props):Promise<Metadata> {const slug=(await params).slug;const resource=readResourceHub().resources.find(item=>item.slug===slug);return {title:resource?.title ?? "Resource not found",description:resource?.description};}
export default async function ResourcePage({params}:Props) {const {slug}=await params;const resource=readResourceHub().resources.find(r=>r.slug===slug);if(!resource) notFound();return <ResourceDetail resource={resource}/>;}
