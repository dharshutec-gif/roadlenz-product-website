import { NextRequest } from "next/server";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { requireRole, jsonOk, jsonErr } from "@/lib/api";

const ALLOWED = new Map<string, string>([
  [".jpg", "image/jpeg"], [".jpeg", "image/jpeg"], [".png", "image/png"],
  [".webp", "image/webp"], [".gif", "image/gif"], [".svg", "image/svg+xml"],
  [".mp4", "video/mp4"], [".webm", "video/webm"], [".pdf", "application/pdf"],
  [".mp3", "audio/mpeg"], [".ogg", "audio/ogg"],
]);

export async function POST(req: NextRequest) {
  const auth = requireRole(req, "admin");
  if (!auth.ok) return auth.res;
  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) return jsonErr(400, "No file uploaded.");
  if (file.size > 80 * 1024 * 1024) return jsonErr(400, "File too large (max 80 MB).");
  const ext = path.extname(file.name).toLowerCase();
  if (!ALLOWED.has(ext)) return jsonErr(400, `Unsupported file type: ${ext}`);
  const dir = path.join(process.cwd(), "public", "uploads");
  fs.mkdirSync(dir, { recursive: true });
  const name = `${Date.now()}-${crypto.randomBytes(4).toString("hex")}${ext}`;
  const buf = Buffer.from(await file.arrayBuffer());
  fs.writeFileSync(path.join(dir, name), buf);
  return jsonOk({ url: `/uploads/${name}`, type: ALLOWED.get(ext) }, { status: 201 });
}
