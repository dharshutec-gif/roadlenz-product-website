import { NextRequest, NextResponse } from "next/server";
import { mutateDb } from "@/lib/db";
import { sessionFromRequest } from "@/lib/auth";
import { parseEnquiry, saveEnquiry } from "@/lib/enquiries";
import { deliverEnquiryEmail } from "@/lib/enquiry-mail";

export const runtime = "nodejs";
export async function POST(req: NextRequest) {
  if (Number(req.headers.get("content-length") || 0) > 20000) return NextResponse.json({ message: "Enquiry is too large." }, { status: 413 });
  let input;
  try { input = parseEnquiry(await req.json()); }
  catch (error) { return NextResponse.json({ message: error instanceof Error ? error.message : "Invalid enquiry." }, { status: 400 }); }
  const session = sessionFromRequest(req);
  const enquiry = mutateDb(db => saveEnquiry(db, input, session?.role === "customer" ? session.userId : undefined));
  await deliverEnquiryEmail(enquiry.id);
  return NextResponse.json({ ok: true, ref: enquiry.ref }, { status: 201 });
}
