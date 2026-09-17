import { NextRequest } from "next/server";
import fs from "node:fs";
import path from "node:path";
import { Readable } from "node:stream";
import { readDb } from "@/lib/db";
import { sessionFromRequest } from "@/lib/auth";
import { isPublicResource } from "@/lib/resource-content";
import { RESOURCE_FILE_DIR } from "@/lib/resource-server";
import { parseResourceRange,resourceFileTypes } from "@/lib/resource-files";
export const dynamic="force-dynamic";
export async function GET(req:NextRequest,{params}:{params:Promise<{name:string}>}) {
  const {name}=await params;
  if(!/^[a-f0-9]{32}\.(?:pdf|xlsx|jpg|png|webp|mp4|webm)$/.test(name)) return new Response(null,{status:404});
  const url=`/api/resources/files/${name}`;
  const published=readDb().resources.some(r=>isPublicResource(r) && [r.image,r.media?.src,r.media?.poster,...(Array.isArray(r.file) ? r.file.map(f=>f.url) : [r.file?.url])].includes(url));
  if(!published && sessionFromRequest(req)?.role !== "admin") return new Response(null,{status:404,headers:{"Cache-Control":"private, no-store"}});
  const file=path.join(RESOURCE_FILE_DIR,name);
  let size:number; try {size=fs.statSync(file).size;} catch {return new Response(null,{status:404});}
  const range=parseResourceRange(req.headers.get("range"),size);
  if(range === false) return new Response(null,{status:416,headers:{"Content-Range":`bytes */${size}`,"Cache-Control":"private, no-store"}});
  const ext=name.split(".").pop()!;
  const headers:Record<string,string>={"Content-Type":resourceFileTypes[ext],"Content-Length":String(range ? range.end-range.start+1 : size),"Accept-Ranges":"bytes","Cache-Control":"private, no-store","X-Content-Type-Options":"nosniff","Content-Security-Policy":"sandbox", "Content-Disposition":`${req.nextUrl.searchParams.has("download") || ext === "xlsx" ? "attachment" : "inline"}; filename="${name}"`};
  if(range) headers["Content-Range"]=`bytes ${range.start}-${range.end}/${size}`;
  return new Response(Readable.toWeb(fs.createReadStream(file,range || undefined)) as ReadableStream,{status:range ? 206 : 200,headers});
}
