import type { Metadata } from "next";
import PageShell from "@/components/PageShell";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  const sections: [string, string][] = [
    [
      "What we collect",
      "When you submit a form on this website — quote requests, demo bookings or messages — we collect the details you provide: name, company, email, phone and the message content. Customer and admin portal accounts store the profile data needed to serve that account.",
    ],
    [
      "How we use it",
      "Your details are used to respond to your request, provide the services you booked, and — only with your consent — share relevant product updates. We do not sell personal data.",
    ],
    [
      "Fleet data",
      "Vehicle telemetry (location, video, fuel, driver events) is processed exclusively for customers who deploy RoadLenz hardware, under the service agreement governing that deployment. Demo data shown on this marketing site is simulated and does not belong to any customer.",
    ],
    [
      "Security",
      "Portal access is protected with hashed credentials and session tokens. Administrative access is role-restricted. Media and documents are served from our own infrastructure.",
    ],
    [
      "Your choices",
      "You may request a copy, correction or deletion of your personal data by contacting the address below. Account data can be exported from the customer dashboard.",
    ],
    [
      "Contact",
      "Queries about this policy can be directed to the RoadLenz team through the Contact page. This policy is maintained by the RoadLenz CMS and updated as needed.",
    ],
  ];
  return (
    <>
      <PageShell kicker="Legal" title="Privacy Policy" sub="How RoadLenz collects, uses and protects personal information." crumb={[{ label: "Privacy", href: "/privacy" }]} />
      <section className="bg-mist-50 py-14">
        <div className="shell max-w-3xl">
          {sections.map(([t, body], i) => (
            <div key={t} className="mb-8 rounded-3xl border border-line bg-white p-7 shadow-card">
              <h2 className="font-display text-lg font-bold text-ink">{i + 1}. {t}</h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-muted">{body}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
