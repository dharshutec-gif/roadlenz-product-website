"use client";

import { useRef } from "react";
import Link from "next/link";
import { useInView } from "framer-motion";
import useMotionPreference from "./useMotionPreference";
import { MapPin, Video, ShieldCheck, Bell, FileText, Truck, ArrowRight, ChevronRight } from "lucide-react";
import styles from "./IndustryIntelligenceSection.module.css";

const capabilities = [
  { label: "GPS Tracking", description: "Real-time location and route visibility.", icon: MapPin, href: "/technology/gps-tracking" },
  { label: "Live Video", description: "See what happens, when it happens.", icon: Video, href: "/technology/live-video" },
  { label: "AI Safety", description: "Smarter detection for safer fleets.", icon: ShieldCheck, href: "/technology#ai-safety" },
  { label: "Alerts & Notifications", description: "Stay informed in real time.", icon: Bell, href: "/technology/alerts" },
  { label: "Reports & Analytics", description: "Turn data into deeper insights.", icon: FileText, href: "/technology/reports" },
  { label: "Fleet Management", description: "Simpler, smarter fleet operations.", icon: Truck, href: "/technology/multi-fleet" },
];

export default function IndustryIntelligenceSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { amount: 0.12 });
  const reducedMotion = useMotionPreference();
  const motionEnabled = !reducedMotion;
  return (
    <section ref={sectionRef} className={styles.section} data-in-view={inView} data-motion={motionEnabled ? "on" : "off"} aria-labelledby="roadlenz-intelligence-title">
      <div className={styles.inner}>
        <div className={styles.copy}>
          <p className={styles.eyebrow}>The RoadLenz Advantage</p>
          <h2 id="roadlenz-intelligence-title">One intelligence layer <em>for every industry.</em></h2>
          <p className={styles.description}>Live visibility, video, safety, alerts and reporting connected through one RoadLenz platform.</p>
          <Link href="/technology" className={styles.button}>Explore Our Technology <ArrowRight aria-hidden="true" /></Link>
          <ul className={styles.outcomes} aria-label="Platform benefits">
            <li>Smarter<br />Operations</li><li>Safer<br />Journeys</li><li>A More<br />Connected World</li>
          </ul>
        </div>
        <div className={styles.visual}>
          <p className={styles.visualCaption}>Real data. <strong>Real impact.</strong></p>
          <div className={styles.artwork}>
            <div className={styles.layeredStack} role="img" aria-label="Animated RoadLenz intelligence core connecting fleet operations, video insights, safety alerts, and analytics and reporting.">
              <div className={styles.movingLayer} data-layer="Intelligence stack"><img src="/media/industries/intelligence/roadlenz-advantage-glass.png" alt="" width={1122} height={1402} loading="lazy" /></div>
            </div>
            <div className={styles.orbit} aria-hidden="true"><i /></div>
            <div className={styles.orbitSecondary} aria-hidden="true"><i /></div>
            <span className={styles.coreGlow} aria-hidden="true" />
            <span className={styles.dataBeam} aria-hidden="true" />
            <span className={styles.scanLine} aria-hidden="true" />
          </div>
        </div>
        <div className={styles.capabilityColumn}>
          <p className={styles.caption}>People / Vehicles / Data / A safer tomorrow</p>
          <nav className={styles.capabilities} aria-label="RoadLenz platform capabilities">
            {capabilities.map((item, index) => (
              <div key={item.label} className={styles.cardReveal} style={{ animationDelay: `${index * 90 + 180}ms` }}>
                <Link href={item.href} className={styles.card}>
                  <span className={styles.iconCircle}><item.icon aria-hidden="true" /></span>
                  <strong>{item.label}</strong>
                  <span className={styles.cardDescription}>{item.description}</span>
                  <span className={styles.cardArrow}><ChevronRight aria-hidden="true" /></span>
                </Link>
              </div>
            ))}
          </nav>
          <p className={`${styles.caption} ${styles.bottomCaption}`}>Intelligence in motion <span /></p>
        </div>
      </div>
    </section>
  );
}

