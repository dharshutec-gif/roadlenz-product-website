import type { AdminQuotation } from "./admin-types";
import type { CompanySettings } from "./types";

/** Small, dependency-free PDF 1.4 writer using the standard Courier fonts.
 * Only customer-facing fields are selected below. Internal notes are never serialized.
 * Text is Latin ASCII; INR is explicit and unsupported characters become '?'.
 */
function latin(text: string): string {
  return text.normalize("NFKD").replace(/[\u0300-\u036f]/g, "")
    .replace(/₹/g, "INR ").replace(/[–—]/g, "-").replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'").replace(/[^\x20-\x7e\n]/g, "?");
}
function escaped(text: string): string { return latin(text).replace(/([\\()])/g, "\\$1"); }
function wrap(text: string, max: number): string[] {
  const lines: string[] = [];
  for (const paragraph of latin(text).split(/\r?\n/)) {
    let line = "";
    for (let word of paragraph.split(/\s+/).filter(Boolean)) {
      if (line && line.length + word.length + 1 > max) { lines.push(line); line = ""; }
      while (word.length > max) { if (line) { lines.push(line); line = ""; } lines.push(word.slice(0,max)); word = word.slice(max); }
      line += `${line ? " " : ""}${word}`;
    }
    lines.push(line);
  }
  return lines;
}
const money = (amount: number) => Number.isFinite(amount) ? amount.toFixed(2) : "0.00";
export function quotationPdfFilename(number: string): string {
  return `quotation-${number.replace(/[^a-zA-Z0-9_-]/g,"-").slice(0,80) || "download"}.pdf`;
}
export function generateQuotationPdf(quote: AdminQuotation, settings: CompanySettings): Buffer {
  const pages: string[][] = [];
  let commands: string[] = [];
  let y = 716;
  const left = 42;
  const right = 553;
  const text = (value: string, x: number, baseline: number, size = 9, bold = false, color = "0.12 0.18 0.25") => {
    commands.push(`${color} rg BT /${bold ? "F2" : "F1"} ${size} Tf 1 0 0 1 ${x} ${baseline} Tm (${escaped(value)}) Tj ET`);
  };
  const rule = (baseline: number) => commands.push(`0.82 0.87 0.92 RG 0.5 w ${left} ${baseline} m ${right} ${baseline} l S`);
  const page = () => {
    if (commands.length) pages.push(commands);
    commands = [];
    commands.push("0.06 0.14 0.24 rg 0 754 595 88 re f");
    text("ROADLENZ",left,798,21,true,"1 1 1");
    text("QUOTATION",left,775,10,false,"0.65 0.85 1");
    text(latin(quote.number).slice(0,38),320,798,9,true,"1 1 1");
    text(`Status: ${quote.status.toUpperCase()}`,320,778,9,false,"0.8 0.9 1");
    y = 730;
  };
  const space = (height: number) => { if (y - height < 55) page(); };
  const paragraph = (value: string, bold = false, size = 9, indent = 0) => {
    const max = Math.floor((right - left - indent) / (size * 0.6));
    for (const line of wrap(value,max)) { space(size+5); text(line,left+indent,y,size,bold); y -= size+5; }
  };
  const heading = (value: string) => { space(48); y -= 10; text(value,left,y,10,true,"0.02 0.38 0.65"); y -= 10; rule(y); y -= 17; };
  page();
  paragraph(settings.legalName || settings.name || "RoadLenz",true,11);
  if (settings.parentCompany && settings.parentCompany !== settings.legalName) paragraph(`A ${settings.parentCompany} company`);
  if (settings.contact?.address) paragraph(settings.contact.address);
  paragraph([settings.contact?.email,settings.contact?.phone].filter(Boolean).join(" | "));
  y -= 8;
  paragraph(`Quotation date: ${quote.date}    Valid until: ${quote.validUntil}`);
  heading("PREPARED FOR");
  paragraph(quote.customerName,true);
  if (quote.company) paragraph(quote.company);
  if (quote.email) paragraph(quote.email);
  heading("PRODUCTS AND SERVICES - ALL AMOUNTS IN INR");
  quote.items.forEach((item,index) => {
    space(70);
    paragraph(`${index+1}. ${item.description || item.productSlug || "Item"}`,true);
    if (item.productSlug && item.description !== item.productSlug) paragraph(`Product: ${item.productSlug}`,false,8,12);
    paragraph(`Quantity: ${item.quantity}    Unit price: INR ${money(item.unitPrice)}`,false,9,12);
    paragraph(`Discount: INR ${money(item.discount)}    GST: ${item.gstRate}%    Line total: INR ${money(item.lineTotal)}`,false,9,12);
    y -= 4; rule(y); y -= 15;
  });
  heading("QUOTATION TOTALS");
  const totals: [string,number][] = [["Subtotal",quote.subtotal],["Discount",quote.discount],["GST",quote.gst],["Freight",quote.freight],["Installation",quote.installation],["Additional charges",quote.additionalCharges]];
  for (const [label,amount] of totals) paragraph(`${label.padEnd(23)} INR ${money(amount)}`);
  space(38); y -= 5;
  commands.push(`0.91 0.96 0.99 rg ${left} ${y-9} ${right-left} 27 re f`);
  text(`GRAND TOTAL             INR ${money(quote.total)}`,left+8,y,11,true,"0.02 0.3 0.5"); y -= 32;
  for (const [label,value] of [["CUSTOMER NOTES",quote.customerNotes],["PAYMENT TERMS",quote.paymentTerms],["DELIVERY TERMS",quote.deliveryTerms],["TERMS AND CONDITIONS",quote.terms]]) {
    if (value) { heading(label); paragraph(value); }
  }
  pages.push(commands);
  pages.forEach((content,index) => {
    content.push(`0.82 0.87 0.92 RG 0.5 w ${left} 38 m ${right} 38 l S`);
    content.push(`0.4 0.46 0.53 rg BT /F1 8 Tf 1 0 0 1 ${left} 24 Tm (${escaped(`RoadLenz | ${quote.number}`.slice(0,75))}) Tj ET`);
    content.push(`BT /F1 8 Tf 1 0 0 1 463 24 Tm (Page ${index+1} of ${pages.length}) Tj ET`);
  });
  const objects: string[] = ["<< /Type /Catalog /Pages 2 0 R >>", "", "<< /Type /Font /Subtype /Type1 /BaseFont /Courier >>", "<< /Type /Font /Subtype /Type1 /BaseFont /Courier-Bold >>"];
  const pageRefs: string[] = [];
  for (const content of pages) {
    const pageId = objects.length+1;
    const streamId = pageId+1;
    pageRefs.push(`${pageId} 0 R`);
    objects.push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${streamId} 0 R >>`);
    const stream = content.join("\n")+"\n";
    objects.push(`<< /Length ${Buffer.byteLength(stream,"ascii")} >>\nstream\n${stream}endstream`);
  }
  objects[1] = `<< /Type /Pages /Count ${pages.length} /Kids [${pageRefs.join(" ")}] >>`;
  let output = "%PDF-1.4\n";
  const offsets = [0];
  objects.forEach((object,index) => { offsets.push(Buffer.byteLength(output,"ascii")); output += `${index+1} 0 obj\n${object}\nendobj\n`; });
  const xref = Buffer.byteLength(output,"ascii");
  output += `xref\n0 ${objects.length+1}\n0000000000 65535 f \n`;
  for (const offset of offsets.slice(1)) output += `${String(offset).padStart(10,"0")} 00000 n \n`;
  output += `trailer\n<< /Size ${objects.length+1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
  return Buffer.from(output,"ascii");
}
