"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Pickaxe, Plane, Truck, GraduationCap, UsersRound } from "lucide-react";
import { Icon } from "@/components/ui";
import styles from "./IndustriesHero.module.css";

const sectors = [
  { title: "Mining", detail: "Keep industry moving", slug: "mining", icon: Pickaxe },
  { title: "Airports & Taxis", detail: "Seamless mobility", slug: "cab-taxi", icon: Plane },
  { title: "Construction & Logistics", detail: "Stronger supply chains", slug: "trucking-logistics", icon: Truck },
  { title: "Education", detail: "Safer communities", slug: "school-transport", icon: GraduationCap },
  { title: "Employee Transport", detail: "Happier workplaces", slug: "employee-transport", icon: UsersRound },
];

export default function IndustriesHero() {
  const [convoyReady, setConvoyReady] = useState(false);
  const convoyImage = useRef<HTMLImageElement>(null);

  useEffect(() => {
    // A cached image can finish loading before React attaches its load handler.
    if (convoyImage.current?.complete && convoyImage.current.naturalWidth > 0) {
      setConvoyReady(true);
    }
  }, []);

  return (
    <section className={styles.hero} aria-labelledby="industries-title">
      <div className={styles.copy}>
        <p className={styles.eyebrow}>Industries</p>
        <h1 id="industries-title">Built for real <span>operations.</span></h1>
        <p className={styles.lead}>
          Different fleets. Different challenges. One connected RoadLenz intelligence platform.
        </p>
        <a className={styles.explore} href="#industry-explorer">
          Explore Industries <Icon name="arrowRight" />
        </a>
      </div>

      <div className={styles.stage} aria-hidden="true">
        <img
          className={styles.backdrop}
          src="/media/industries/hero/industries-hero.png"
          alt=""
          width={1672}
          height={941}
          fetchPriority="high"
        />
        <div className={styles.roadGlow} />
        <div className={`${styles.convoy} ${convoyReady ? styles.convoyReady : ""}`}>
          <img
            ref={convoyImage}
            src="/media/industries/hero/vehicle-convoy.png"
            alt=""
            width={2172}
            height={724}
            fetchPriority="high"
            onLoad={() => setConvoyReady(true)}
          />
        </div>
      </div>

      <nav className={styles.sectors} aria-label="Featured industries">
        {sectors.map((sector) => (
          <Link className={styles.sector} href={`/solutions/${sector.slug}`} key={sector.slug}>
            <sector.icon aria-hidden="true" />
            <span>
              <strong>{sector.title}</strong>
              <small>{sector.detail}</small>
            </span>
          </Link>
        ))}
      </nav>
    </section>
  );
}
