"use client";

import { useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, useInView } from "framer-motion";
import useMotionPreference from "./useMotionPreference";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { IndustryPresentation } from "./industryPresentation";
import styles from "./IndustriesExplorerStage.module.css";

type IndustryView = {
  slug: string;
  presentation: IndustryPresentation;
};

/*
  The atlas file has a fixed source order. Keep this separate from
  the display order so the correct vehicle is always cropped.
*/
const atlasOrder = [
  "cab-taxi",
  "school-transport",
  "trucking-logistics",
  "public-transport",
  "employee-transport",
  "mining",
  "agriculture",
];

const displayOrder = [
  "cab-taxi",
  "school-transport",
  "public-transport",
  "employee-transport",
  "trucking-logistics",
  "mining",
  "agriculture",
];

const edges = [0, 280, 585, 910, 1203, 1499, 1845, 2125];

function Vehicle({ slug }: { slug: string }) {
  const index = Math.max(0, atlasOrder.indexOf(slug));

  return (
    <svg
      className={styles.vehicleImage}
      viewBox={`${edges[index]} 215 ${edges[index + 1] - edges[index]} 300`}
      aria-hidden="true"
    >
      <image
        href="/media/industries/gallery/vehicle-stage-atlas.png"
        width="2125"
        height="740"
      />
    </svg>
  );
}

export default function IndustriesExplorerStage({
  industries,
}: {
  industries: IndustryView[];
}) {
  const router = useRouter();
  const reduceMotion = useMotionPreference();
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { amount: .12 });
  const railRef = useRef<HTMLDivElement>(null);
  const lastTapRef = useRef<{ slug: string; time: number } | null>(null);

  const ordered = useMemo(
    () =>
      [...industries].sort(
        (a, b) =>
          displayOrder.indexOf(a.slug) - displayOrder.indexOf(b.slug),
      ),
    [industries],
  );

  function openIndustry(industry: IndustryView) {
    router.push(`/industries/${industry.slug}`);
  }

  function handleTouchEnd(industry: IndustryView) {
    const now = Date.now();
    const previous = lastTapRef.current;

    if (
      previous &&
      previous.slug === industry.slug &&
      now - previous.time < 360
    ) {
      lastTapRef.current = null;
      openIndustry(industry);
      return;
    }

    lastTapRef.current = {
      slug: industry.slug,
      time: now,
    };
  }

  function scrollRail(direction: -1 | 1) {
    const rail = railRef.current;
    if (!rail) return;

    rail.scrollBy({
      left: direction * Math.max(320, rail.clientWidth * 0.7),
      behavior: reduceMotion ? "auto" : "smooth",
    });
  }

  if (!ordered.length) return null;

  return (
    <motion.section
      ref={sectionRef}
      data-in-view={inView}
      id="industry-explorer"
      className={styles.explorer}
      aria-labelledby="industry-explorer-title"
      initial={false}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
    >
      <header className={styles.heading}>
        <p>Industries</p>
        <h2 id="industry-explorer-title">Different fleets. <em>A smarter tomorrow.</em></h2>
      </header>

      <div className={styles.shell}>
        <button
          type="button"
          className={`${styles.navButton} ${styles.prev}`}
          aria-label="Scroll industries left"
          onClick={() => scrollRail(-1)}
        >
          <ArrowLeft />
        </button>

        <div ref={railRef} className={styles.rail}>
          <div className={styles.vehicles}>
            {ordered.map((industry, index) => (
              <motion.button
                type="button"
                tabIndex={0}
                key={industry.slug}
                className={styles.vehicle}
                aria-label={`${industry.presentation.navName}. Double click or double tap to open.`}
                onDoubleClick={() => openIndustry(industry)}
                onTouchEnd={() => handleTouchEnd(industry)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") openIndustry(industry);
                }}
                initial={false}
                viewport={{ once: true, amount: 0.35 }}
                transition={{
                  duration: 0.5,
                  delay: reduceMotion ? 0 : index * 0.055,
                  ease: [0.22, 1, 0.36, 1],
                }}
                whileHover={
                  reduceMotion
                    ? undefined
                    : {
                        y: -8,
                        scale: 1.025,
                      }
                }
                whileTap={reduceMotion ? undefined : { scale: 0.985 }}
              >
                <span className={styles.vehicleStage}>
                  <span className={styles.vehicleGlow} aria-hidden="true" />
                  <span className={styles.cutout}>
                    <Vehicle slug={industry.slug} />
                  </span>
                </span>

                <span className={styles.namePill}>
                  {industry.presentation.navName}
                </span>
              </motion.button>
            ))}
          </div>
        </div>

        <button
          type="button"
          className={`${styles.navButton} ${styles.next}`}
          aria-label="Scroll industries right"
          onClick={() => scrollRail(1)}
        >
          <ArrowRight />
        </button>
      </div>
    </motion.section>
  );
}
