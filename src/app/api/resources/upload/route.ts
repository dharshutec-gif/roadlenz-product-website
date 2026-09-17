import { NextRequest } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import sharp from "sharp";
import { requireRole,jsonOk,jsonErr } from "@/lib/api";
import { RESOURCE_FILE_DIR } from "@/lib/resource-server";
import { validResourceFile,resourceFileTypes } from "@/lib/resource-files";
export async function POST(req:NextRequest) {
  const auth=requireRole(req,"admin");
  if(!auth.ok) return auth.res;
  if(Number(req.headers.get("content-length"))>81*1024*1024) return jsonErr(413,"File too large (max 80 MB).");
  const form=await req.formData().catch(()=>null);
  const file=form?.get("file");
  if(!(file instanceof File) || !file.size || file.size>80*1024*1024) return jsonErr(400,"Choose a file up to 80 MB.");
  const ext=path.extname(file.name).slice(1).toLowerCase().replace("jpeg","jpg");
  const buffer=Buffer.from(await file.arrayBuffer());
  if(!resourceFileTypes[ext] || !validResourceFile(ext,buffer)) return jsonErr(400,"File contents do not match a supported PDF, XLSX, image or video format.");
  if(["png","jpg","webp"].includes(ext)) {
    try { await sharp(buffer,{limitInputPixels:40_000_000}).metadata(); } catch { return jsonErr(400,"Invalid image."); }
  }
  const name=`${crypto.randomBytes(16).toString("hex")}.${ext}`;
  await fs.mkdir(RESOURCE_FILE_DIR,{recursive:true});
  await fs.writeFile(path.join(RESOURCE_FILE_DIR,name),buffer,{flag:"wx"});
  return jsonOk({url:`/api/resources/files/${name}`,type:resourceFileTypes[ext]},{status:201});
}
