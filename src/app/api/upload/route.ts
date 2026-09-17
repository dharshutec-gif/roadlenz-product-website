import { NextRequest } from "next/server";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { requireRole, jsonOk, jsonErr } from "@/lib/api";
import { mutateDb } from "@/lib/db";
import { adminStore, recordAdminActivity } from "@/lib/admin-store";

const ALLOWED = new Map<string, string>([
  [".jpg", "image/jpeg"], [".jpeg", "image/jpeg"], [".png", "image/png"],
  [".webp", "image/webp"], [".gif", "image/gif"],
  [".mp4", "video/mp4"], [".webm", "video/webm"], [".pdf", "application/pdf"],
  [".mp3", "audio/mpeg"], [".ogg", "audio/ogg"],
]);

function validUploadHeader(ext: string, buf: Buffer): boolean {
  if ([".jpg", ".jpeg"].includes(ext)) return buf.subarray(0,3).equals(Buffer.from([255,216,255]));
  if (ext === ".png") return buf.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]));
  if (ext === ".webp") return buf.toString("ascii",0,4)==="RIFF" && buf.toString("ascii",8,12)==="WEBP";
  if (ext === ".pdf") return buf.toString("ascii",0,5)==="%PDF-";
  if (ext === ".gif") return ["GIF87a","GIF89a"].includes(buf.toString("ascii",0,6));
  if (ext === ".mp4") return buf.toString("ascii",4,8)==="ftyp";
  if (ext === ".webm") return buf.subarray(0,4).equals(Buffer.from([26,69,223,163]));
  if (ext === ".ogg") return buf.toString("ascii",0,4)==="OggS";
  if (ext === ".mp3") return buf.toString("ascii",0,3)==="ID3" || (buf[0]===255 && (buf[1]&224)===224);
  return false;
}

export async function POST(req: NextRequest) {
  const auth = requireRole(req, "admin");
  if (!auth.ok) return auth.res;
  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) return jsonErr(400, "No file uploaded.");
  if (file.size > 80 * 1024 * 1024) return jsonErr(400, "File too large (max 80 MB).");
  const ext = path.extname(file.name).toLowerCase();
  if (!ALLOWED.has(ext)) return jsonErr(400, `Unsupported file type: ${ext}`);
  if (!file.size) return jsonErr(400, "File is empty.");
  if (file.type && file.type !== ALLOWED.get(ext)) return jsonErr(400, "File MIME type does not match its extension.");
  if (ext.match(/^\.(jpg|jpeg|png|webp|gif)$/) && file.size > 12 * 1024 * 1024) return jsonErr(400, "Images must be 12 MB or smaller.");
  const buf = Buffer.from(await file.arrayBuffer());
  if (!validUploadHeader(ext, buf)) return jsonErr(400, "File contents do not match the selected file type.");
  const dir = path.join(process.cwd(), "public", "uploads");
  fs.mkdirSync(dir, { recursive: true });
  const name = `${Date.now()}-${crypto.randomBytes(4).toString("hex")}${ext}`;
  fs.writeFileSync(path.join(dir, name), buf);
  mutateDb(db => { const stamp = new Date().toISOString(); const media = { id: `media_${crypto.randomBytes(8).toString("hex")}`, name: file.name.slice(0,200), url: `/uploads/${name}`, mimeType: ALLOWED.get(ext)!, size: file.size, category: String(form?.get("category") || (file.type.startsWith("image/") ? "Website Images" : file.type.startsWith("video/") ? "Videos" : "Documents")).slice(0,100), sourceType: "upload" as const, createdAt: stamp, updatedAt: stamp }; adminStore(db).media.push(media); recordAdminActivity(db,auth.session,"upload","media",media.id,media.name); });
  return jsonOk({ url: `/uploads/${name}`, type: ALLOWED.get(ext) }, { status: 201 });
}
