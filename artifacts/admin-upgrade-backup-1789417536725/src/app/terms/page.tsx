import type { Metadata } from "next";
import PageShell from "@/components/PageShell";

export const metadata: Metadata = { title: "Terms" };

export default function TermsPage() {
  const sections: [string, string][] = [
    [
      "The service",
      "RoadLenz provides fleet intelligence hardware, platform subscriptions and related professional services. All commercial terms are governed by the written quotation and service agreement signed for each deployment.",
    ],
    [
      "Pricing",
      "Prices shown on this website are indicative list prices for planning purposes. Binding prices are those stated in the quotation accepted by the customer.",
    ],
    [
      "Media and placeholders",
      "Marketing materials may include simulated demonstration data, placeholder media and pending-approval content. Nothing on this marketing site constitutes a case study or verified customer result unless explicitly labelled as approved.",
    ],
    [
      "Intellectual property",
      "RoadLenz hardware designs, firmware, software and documentation are the property of RoadLenz Intelligent Mobility and its parent company. Customers receive a licence to use the platform for their own fleet.",
    ],
    [
      "Liability",
      "RoadLenz provides safety-assist technology. It does not replace driver responsibility, road rules or insurance. Full liability terms appear in the service agreement.",
    ],
    [
      "Changes",
      "These terms are maintained through the RoadLenz CMS. Material changes to contractual terms are communicated to customers separately.",
    ],
  ];
  return (
    <>
      <PageShell kicker="Legal" title="Terms of Use" sub="The short version — full commercial terms live in your quotation and service agreement." crumb={[{ label: "Terms", href: "/terms" }]} />
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
