import type { NextRequest } from "next/server";
import { requireRole, jsonErr } from "@/lib/api";
import { readDb } from "@/lib/db";
import { generateQuotationPdf, quotationPdfFilename } from "@/lib/quotation-pdf";
export const runtime = "nodejs";
export async function GET(req:NextRequest,context:{params:Promise<{id:string}>}) {
  const auth = requireRole(req,"customer");
  if (!auth.ok) return auth.res;
  const {id} = await context.params;
  const db = readDb();
  const quote = db.admin?.quotations.find(item => item.id === id && item.customerUserId === auth.session.userId && item.status !== "draft");
  if (!quote) return jsonErr(404,"Quotation not found.");
  return new Response(new Uint8Array(generateQuotationPdf(quote,db.settings)),{headers:{"Content-Type":"application/pdf","Content-Disposition":`attachment; filename="${quotationPdfFilename(quote.number)}"`,"Cache-Control":"private, no-store","X-Content-Type-Options":"nosniff"}});
}
