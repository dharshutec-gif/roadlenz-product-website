import { NextRequest, NextResponse } from "next/server";
import { mutateDb } from "@/lib/db";
import { clearSessionCookie, sessionFromRequest } from "@/lib/auth";
import { recordAdminActivity } from "@/lib/admin-store";

export async function POST(req: NextRequest) {
  const token = req.cookies.get("rl_session")?.value;
  const session = sessionFromRequest(req);
  if (token) {
    mutateDb((db) => {
      db.sessions = db.sessions.filter((s) => s.token !== token);
      if (session?.role === "admin") recordAdminActivity(db, session, "logout", "security", session.userId, "Administrator signed out.");
    });
  }
  const res = new NextResponse(null, { status: 204 });
  res.cookies.set(clearSessionCookie());
  return res;
}
