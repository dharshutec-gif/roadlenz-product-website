import type { Metadata } from "next";
import { readDb, listEntity, publishedOf } from "@/lib/db";
import PageShell from "@/components/PageShell";
import GlobalGlobe from "@/components/home/GlobalGlobe";
import EngineeringSupport from "@/components/home/EngineeringSupport";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Global Presence",
  description: "RoadLenz offices and production units — Chennai headquarters, Thirumudivakkam and Kishkintha production, Bengaluru regional office, and international offices in the US, Netherlands and Germany.",
};

export default async function GlobalPresencePage() {
  const db = readDb();
  const locations = publishedOf<import("@/lib/types").OfficeLocation>(listEntity<import("@/lib/types").OfficeLocation>(db, "locations"));
  const engineering = publishedOf<import("@/lib/types").EngineeringItem>(listEntity<import("@/lib/types").EngineeringItem>(db, "engineeringItems"));

  return (
    <>
      <PageShell
        kicker="Global presence"
        title={
          <>
            Built in Chennai. <span className="text-brand-600">Deployed everywhere.</span>
          </>
        }
        sub="Seven locations across three continents — headquarters, two production and engineering units, a regional office, and international offices."
        crumb={[{ label: "Global Presence", href: "/global-presence" }]}
      />
      <div className="-mt-4 pb-4">
        <GlobalGlobe offices={locations.map(location => ({
          id: location.id,
          title: location.name,
          officeType: location.type,
          city: location.city,
          region: location.region,
          country: location.country,
          address: location.address.split(/\r?\n/).filter(Boolean),
          phone: location.phone,
          email: location.email,
          mapsUrl: location.mapsLink,
          lat: location.lat,
          lon: location.lng,
        }))} />
      </div>
      <EngineeringSupport items={engineering} parent={db.settings.parentCompany} />
    </>
  );
}
