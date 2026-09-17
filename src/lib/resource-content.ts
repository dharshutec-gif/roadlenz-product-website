import type { Db, ResourceItem } from "./types";

export const resourceSections = [
  { id: "insights", label: "Insights & Guides", icon: "doc" },
  { id: "videos", label: "Videos & Webinars", icon: "play" },
  { id: "downloads", label: "Downloads", icon: "download" },
  { id: "documentation", label: "Documentation", icon: "doc" },
  { id: "case-studies", label: "Case Studies", icon: "fleet" },
  { id: "help", label: "Help Centre", icon: "headset" },
];
export const resourceTypeLabels: Record<string,string> = { guide:"Guide", insight:"Insight", video:"Video", webinar:"Webinar", download:"Download", checklist:"Checklist", documentation:"Documentation", "case-study":"Case study", faq:"FAQ", warranty:"Warranty" };
export interface PublicResource {
  id:string; slug:string; title:string; type:string; description:string; image:string; video:string; poster:string;
  file:string; fileType:string; meta:string; category:string; featured:boolean; order:number; createdAt:string;
  body:string; answer:string; relatedLinks:{label:string;href:string}[];
}
export function isPublicResource(resource: ResourceItem) { return resource.published === true && (resource.type !== "case-study" || resource.approved === true); }
/** Public surfaces use only local, managed media. Never emit arbitrary/private URLs. */
export function safeResourceUrl(value: unknown): string {
  if(typeof value !== "string" || /[?#\\%\u0000-\u0020]/.test(value) || value.includes("..")) return "";
  return /^\/(?:media\/|uploads\/)[a-zA-Z0-9_./-]+\.(?:pdf|xlsx|png|jpe?g|webp|gif|mp4|webm)$/.test(value) || /^\/api\/resources\/files\/[a-f0-9]{32}\.(?:pdf|xlsx|png|jpg|webp|mp4|webm)$/.test(value) ? value : "";
}
export function getPublicResources(db: Db): PublicResource[] {
  const allowedLinks = new Set(["/contact","/request-quote","/technology",...db.products.filter(p=>p.published).map(p=>`/products/${p.slug}`),...db.solutions.filter(s=>s.published).map(s=>`/solutions/${s.slug}`),...["live-fleet","video-telematics","ai-safety","playback","reports","vehicle-health"].map(s=>`/technology/${s}`)]);
  const result: PublicResource[] = db.resources.filter(isPublicResource).map(r => {
    // Legacy resource editors sometimes stored the single download as an array.
    const fileRef = Array.isArray(r.file) ? r.file[0] : r.file;
    const file = safeResourceUrl(fileRef?.url);
    return { id:r.id,slug:r.slug && /^[a-z0-9-]+$/.test(r.slug) ? r.slug : r.id,title:r.title,type:r.type,description:r.description,
      image:safeResourceUrl(r.image),video:r.media?.type === "video" ? safeResourceUrl(r.media.src) : "",poster:safeResourceUrl(r.media?.poster),file,fileType:file.split(".").pop()?.toUpperCase() ?? "",
      meta:r.duration || (r.pageCount && r.pageCount > 0 ? `${r.pageCount} pages` : ["video","webinar"].includes(r.type) ? resourceTypeLabels[r.type] : r.meta),category:r.category ?? "",featured:r.featured === true,order:r.order,createdAt:r.createdAt,body:r.body ?? "",answer:r.answer ?? "",relatedLinks:(r.relatedLinks ?? []).filter(l=>allowedLinks.has(l.href)),
    };
  });
  db.caseStudies.filter(c=>c.published && c.approved).forEach(c=>result.push({id:c.id,slug:c.id,title:c.title,type:"case-study",description:c.challenge,image:safeResourceUrl(c.image),video:c.video?.type === "video" ? safeResourceUrl(c.video.src) : "",poster:safeResourceUrl(c.video?.poster),file:"",fileType:"",meta:c.location,category:"Fleet operations",featured:false,order:c.order,createdAt:c.createdAt,body:[c.challenge,c.solution].join("\n\n"),answer:"",relatedLinks:[]}));
  db.products.filter(p=>p.published).forEach(p=>[...(p.documents ?? []),p.installationGuide,p.warranty].filter(Boolean).forEach((doc,index)=>{
    const file=safeResourceUrl(doc!.url);
    if(!file || result.some(r=>r.file === file)) return;
    const id=`document-${p.slug}-${index}`;
    result.push({id,slug:id,title:doc!.name,type:"documentation",description:`Product documentation for ${p.name}.`,image:"",video:"",poster:"",file,fileType:file.split(".").pop()!.toUpperCase(),meta:"Product document",category:p.category,featured:false,order:100+index,createdAt:p.createdAt,body:"",answer:"",relatedLinks:[{label:p.name,href:`/products/${p.slug}`}]});
  }));
  // Add product/category context to existing resources sharing a product document.
  result.forEach(r=>db.products.filter(p=>p.published).forEach(p=>{
    if(r.file && [...p.documents,p.installationGuide,p.warranty].some(d=>d?.url === r.file)) {
      if(!r.category) r.category=p.category;
      if(!r.relatedLinks.some(l=>l.href === `/products/${p.slug}`)) r.relatedLinks.push({label:p.name,href:`/products/${p.slug}`});
    }
  }));
  return result.sort((a,b)=>Number(b.featured)-Number(a.featured) || a.order-b.order);
}
export function resourceHref(r: PublicResource) { return `/resources/${encodeURIComponent(r.slug)}`; }
export function isDocumentation(r: PublicResource) { return ["documentation","guide","warranty"].includes(r.type); }
export function searchDocumentation(resources: PublicResource[],query:string,category="") {
  const terms=query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  return resources.filter(r=>isDocumentation(r) && (!category || r.category === category) && terms.every(term=>`${r.title} ${r.description} ${r.category}`.toLowerCase().includes(term)));
}
