export interface DemoBookingFields {
  enquiryType: string; name: string; company: string; email: string;
  countryCode: string; phone: string; fleetSize: string; date: string;
  timeSlot: string; message: string;
}

export function earliestDemoDate(now = new Date()): string {
  const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 3);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function buildDemoRequest(form: DemoBookingFields, product = "") {
  return {
    type: "demo", name: form.name.trim(), company: form.company.trim(), email: form.email.trim(),
    phone: `${form.countryCode} ${form.phone.trim()}`, date: form.date, duration: "30 minutes",
    topics: [form.enquiryType, product && `Product: ${product}`].filter(Boolean).join(" · "),
    // Retain booking details in fields supported by the existing API and admin view.
    message: [form.message.trim(), `Preferred time: ${form.timeSlot} (IST)`,
      form.fleetSize && `Fleet size: ${form.fleetSize}`].filter(Boolean).join("\n\n"),
  };
}
