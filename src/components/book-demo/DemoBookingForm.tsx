"use client";

import { useEffect, useState, type FormEvent } from "react";
import { ArrowRight, CheckCircle2, LockKeyhole, Send } from "lucide-react";
import Link from "next/link";
import { buildDemoRequest, earliestDemoDate, type DemoBookingFields } from "@/lib/demo-booking";
import styles from "./DemoExperience.module.css";

export default function DemoBookingForm({ product = "" }: { product?: string }) {
  const [minDate, setMinDate] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");
  const [reference, setReference] = useState("");
  const [form, setForm] = useState<DemoBookingFields>({
    enquiryType: product ? "Hardware Overview" : "", name: "", company: "", email: "",
    countryCode: "+91", phone: "", fleetSize: "", date: "", timeSlot: "", message: "",
  });
  useEffect(() => {
    const date = earliestDemoDate();
    setMinDate(date);
    setForm(current => ({ ...current, date: current.date || date }));
  }, []);
  const set = (field: keyof DemoBookingFields) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm(current => ({ ...current, [field]: event.target.value }));

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;
    const earliest = earliestDemoDate();
    setMinDate(earliest);
    if (form.date < earliest) {
      setError("Please choose a demo date at least 3 days from today."); setStatus("error"); return;
    }
    if (!form.name.trim() || !form.message.trim()) {
      setError("Please enter your name and a short description of your requirements."); setStatus("error"); return;
    }
    setStatus("sending"); setError("");
    try {
      const response = await fetch("/api/requests", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildDemoRequest(form, product)),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.ref) throw new Error(result.error || "We couldn't send your request. Please try again.");
      setReference(result.ref); setStatus("done");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Please try again in a moment."); setStatus("error");
    }
  }
  const dateHint = minDate ? new Date(`${minDate}T12:00:00`).toLocaleDateString("en-GB", {
    day: "numeric", month: "short", year: "numeric",
  }) : "";
  if (status === "done") return (
    <section className={`${styles.formCard} ${styles.success}`} aria-live="polite">
      <CheckCircle2 size={54} /><h2>Demo request received!</h2>
      <p>Thank you, {form.name}. Our team will contact you to confirm your preferred date and time.</p>
      <p className={styles.reference}>Your reference: <strong>{reference}</strong></p>
      <Link href="/products" className={styles.submit}>Explore our products <ArrowRight size={20} /></Link>
    </section>
  );
  return (
    <section className={styles.formCard} aria-labelledby="demo-form-title">
      <h2 id="demo-form-title">Schedule a Demo</h2>
      <p className={styles.formIntro}>Tell us a few details and our team will get in touch to show you the platform in action.</p>
      {product && <p className={styles.productContext}>Product of interest: <strong>{product}</strong></p>}
      <form className={styles.form} onSubmit={submit}>
        <fieldset disabled={status === "sending"} className={styles.fields}>
          <label className={styles.full}>Enquiry Type <em>*</em>
            <select required value={form.enquiryType} onChange={set("enquiryType")}>
              <option value="" disabled>Select enquiry type</option>
              <option>Live Platform Walkthrough</option><option>Hardware Overview</option>
              <option>Solution Consultation</option><option>Custom Demo for Your Fleet</option>
            </select>
          </label>
          <label>Name <em>*</em><input required autoComplete="name" placeholder="Your name" value={form.name} onChange={set("name")} maxLength={100} /></label>
          <label>Company<input autoComplete="organization" placeholder="Company name" value={form.company} onChange={set("company")} maxLength={150} /></label>
          <label>Email Address <em>*</em><input required type="email" autoComplete="email" placeholder="you@company.com" value={form.email} onChange={set("email")} /></label>
          <div className={styles.phoneField}>
            <label htmlFor="demo-phone">Phone Number <em>*</em></label>
            <div className={styles.phoneInputs}>
              <select aria-label="Country calling code" value={form.countryCode} onChange={set("countryCode")}>
                <option>+91</option><option>+1</option><option>+44</option><option>+971</option><option>+65</option><option>+61</option>
              </select>
              <input id="demo-phone" required type="tel" autoComplete="tel-national" inputMode="numeric" placeholder="Enter number" pattern="[0-9]{7,15}" title="Enter 7 to 15 digits without the country code." value={form.phone} onChange={set("phone")} />
            </div>
          </div>
          <label className={styles.full}>Fleet Size
            <select value={form.fleetSize} onChange={set("fleetSize")}>
              <option value="">Select fleet size</option><option>1–10 vehicles</option><option>11–50 vehicles</option>
              <option>51–100 vehicles</option><option>101–500 vehicles</option><option>500+ vehicles</option>
            </select>
          </label>
          <div className={`${styles.full} ${styles.dateGroup}`}>
            <label>Preferred Demo Date <em>*</em><input required type="date" min={minDate} value={form.date} onChange={set("date")} aria-describedby="demo-date-hint" /></label>
            <label>Preferred Time Slot <em>*</em>
              <select required value={form.timeSlot} onChange={set("timeSlot")} aria-label="Preferred Time Slot (IST)">
                <option value="" disabled>Select time slot</option><option>10:00 AM – 12:00 PM</option>
                <option>12:00 PM – 2:00 PM</option><option>2:00 PM – 4:00 PM</option><option>4:00 PM – 6:00 PM</option>
              </select>
            </label>
            <p id="demo-date-hint" className={styles.dateHint}>Choose a date at least 3 days from your request date.<br />{dateHint && `Earliest available date: ${dateHint}. `}Time slots are in IST.</p>
          </div>
          <label className={styles.full}>Your Requirement / Message <em>*</em>
            <span className={styles.messageBox}>
              <textarea required maxLength={500} placeholder="Tell us about your requirements..." value={form.message} onChange={set("message")} />
              <span className={styles.counter}>{form.message.length}/500</span>
            </span>
          </label>
          {status === "error" && <p role="alert" className={styles.error}>{error}</p>}
          <button className={`${styles.submit} ${styles.full}`} type="submit">
            <Send size={23} fill="currentColor" />{status === "sending" ? "Sending request…" : "Request Demo"}<ArrowRight size={23} />
          </button>
        </fieldset>
        <p className={styles.privacy}><LockKeyhole size={14} fill="currentColor" />Your information is safe with us. We respect your <Link href="/privacy">privacy</Link>.</p>
      </form>
    </section>
  );
}
