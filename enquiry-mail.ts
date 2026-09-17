import "server-only";
import nodemailer from "nodemailer";
import { mutateDb } from "./db";
import type { ContactMessage } from "./types";

export const ENQUIRY_RECIPIENT = "bigfoxsoftware@gmail.com";
export function enquiryMail(message: ContactMessage, from: string) {
  return {
    from, to: ENQUIRY_RECIPIENT, replyTo: { address: message.email, name: message.name },
    subject: `RoadLenz enquiry ${message.ref}: ${message.subject}`,
    text: [`Reference: ${message.ref}`, `Enquiry: ${message.subject}`, `Name: ${message.name}`, `Company: ${message.company || "Not provided"}`, `Email: ${message.email}`, `Phone: ${message.phone}`, `Fleet size: ${message.fleetSize || "Not provided"}`, "", message.message, "", "This enquiry is saved in the RoadLenz admin console under Enquiries / Requests."].join("\n"),
  };
}

export async function deliverEnquiryEmail(id: string): Promise<boolean> {
  const user = process.env.SMTP_USER, pass = process.env.SMTP_PASSWORD;
  if (!user || !pass) return false;
  const claimed = mutateDb(db => {
    const message = db.messages.find(row => row.id === id);
    if (!message?.emailDelivery || message.emailDelivery.status === "sent") return null;
    const previous = message.emailDelivery;
    if (previous.lastAttemptAt && Date.now() - Date.parse(previous.lastAttemptAt) < 60000) return null;
    message.emailDelivery = { status: "sending", attempts: previous.attempts + 1, lastAttemptAt: new Date().toISOString() };
    return structuredClone(message);
  });
  if (!claimed) return false;
  let sent = false;
  try {
    const port = Number(process.env.SMTP_PORT || 465);
    const transport = nodemailer.createTransport({ host: process.env.SMTP_HOST || "smtp.gmail.com", port, secure: port === 465, requireTLS: port !== 465, auth: { user, pass }, connectionTimeout: 8000, greetingTimeout: 8000, socketTimeout: 10000, disableFileAccess: true, disableUrlAccess: true });
    const result = await transport.sendMail(enquiryMail(claimed, process.env.SMTP_FROM || user));
    sent = result.accepted.some(address => String(address).toLowerCase() === ENQUIRY_RECIPIENT);
  } catch {
    // Keep delivery failures in the admin record without exposing credentials or customer content in logs.
    sent = false;
  }
  mutateDb(db => {
    const message = db.messages.find(row => row.id === id);
    if (message?.emailDelivery) {
      message.emailDelivery.status = sent ? "sent" : "failed";
      if (sent) message.emailDelivery.sentAt = new Date().toISOString();
    }
  });
  return sent;
}
