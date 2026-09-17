import type { Metadata } from "next";
import { listEntity, publishedOf, readDb } from "@/lib/db";
import SolutionsOverview from "@/components/solutions/SolutionsOverview";
import type { Solution } from "@/lib/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Solutions",
  description:
    "Explore RoadLenz connected vehicle solutions for taxi, school transport, logistics, public transport, employee transport, mining, and agriculture operations.",
};

export default function SolutionsPage() {
  const db = readDb();

  const solutions = publishedOf<Solution>(
    listEntity<Solution>(db, "solutions")
  );

  return (
    <>
      <style>{`
        @keyframes roadlenzSolutionsPageIn {
          from {
            opacity: 0;
            transform: translateY(22px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .roadlenz-solutions-page {
          animation:
            roadlenzSolutionsPageIn
            0.8s
            cubic-bezier(.22,.61,.36,1)
            both;
        }

        @media (prefers-reduced-motion: reduce) {
          .roadlenz-solutions-page {
            animation: none;
          }
        }
      `}</style>

      <div className="roadlenz-solutions-page">
        <SolutionsOverview
          solutions={solutions}
          heroMedia={db.settings.solutionsHero}
        />
      </div>
    </>
  );
}