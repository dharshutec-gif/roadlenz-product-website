import { NextRequest } from "next/server";
import { sessionFromRequest } from "@/lib/auth";
import { jsonOk, jsonErr } from "@/lib/api";

export async function GET(req: NextRequest) {
  const session = sessionFromRequest(req);
  if (!session) return jsonErr(401, "Not signed in.");
  return jsonOk(session);
}
