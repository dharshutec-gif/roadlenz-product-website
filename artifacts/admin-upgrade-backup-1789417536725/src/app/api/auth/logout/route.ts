import { NextRequest } from "next/server";
import { mutateDb } from "@/lib/db";
import { clearSessionCookie } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const token = req.cookies.get("rl_session")?.value;
  if (token) {
    mutateDb((db) => {
      db.sessions = db.sessions.filter((s) => s.token !== token);
    });
  }
  const res = new Response(null, { status: 204 });
  res.headers.set("Set-Cookie", "rl_session=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0");
  return res;
}
