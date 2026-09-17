import "server-only";
import fs from "node:fs";
import path from "node:path";
import { readDb } from "./db";
import { getPublicResources } from "./resource-content";
export const RESOURCE_FILE_DIR = path.join(process.cwd(), "data", "resource-files");
export function availableResourceUrl(url:string) {
  if(!url) return "";
  const file=url.startsWith("/api/resources/files/") ? path.join(RESOURCE_FILE_DIR,path.basename(url)) : path.join(process.cwd(),"public",url);
  return fs.existsSync(file) ? url : "";
}
export function readResourceHub() {
  const db=readDb();
  const resources=getPublicResources(db).map(r=>({...r,image:availableResourceUrl(r.image),poster:availableResourceUrl(r.poster),video:availableResourceUrl(r.video),file:availableResourceUrl(r.file)}));
  const categories=db.productCategories.filter(c=>c.published).sort((a,b)=>a.order-b.order).map(c=>({name:c.name,slug:c.slug}));
  return {resources,categories};
}
