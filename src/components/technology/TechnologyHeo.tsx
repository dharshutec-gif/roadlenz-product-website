"use client";

import Link from "next/link";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import type { MouseEvent } from "react";
import { technologyMedia } from "./TechnologyMedia";
import styles from "./TechnologyHero.module.css";

const ease = [0.16, 1, 0.3, 1] as const;

type IconName =
  | "pin"
  | "video"
  | "fuel"
  | "clock"
  | "report"
  | "analytics"
  | "record"
  | "fleet"
  | "alert";

function Icon({ name }: { name: IconName }) {
  const p = {
    width: 21,
    height: 21,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  if (name === "pin") {
    return <svg {...p}><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.4"/></svg>;
  }
  if (name === "video") {
    return <svg {...p}><rect x="3" y="6" width="13" height="12" rx="2"/><path d="m16 10 5-3v10l-5-3Z"/></svg>;
  }
  if (name === "fuel") {
    return <svg {...p}><path d="M5 21V4h9v17M5 9h9M14 8h2l3 3v7a2 2 0 0 0 2 2"/><path d="M8 13h3"/></svg>;
  }
  if (name === "clock") {
    return <svg {...p}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>;
  }
  if (name === "report") {
    return <svg {...p}><path d="M6 3h9l3 3v15H6z"/><path d="M9 11h6M9 15h6M9 7h3"/></svg>;
  }
  if (name === "analytics") {
    return <svg {...p}><path d="M4 20V11M10 20V5M16 20v-8M22 20V8"/></svg>;
  }
  if (name === "record") {
    return <svg {...p}><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="12" cy="12" r="3"/></svg>;
  }
  if (name === "fleet") {
    return <svg {...p}><circle cx="6" cy="12" r="2"/><circle cx="18" cy="7" r="2"/><circle cx="18" cy="17" r="2"/><path d="m8 11 8-3M8 13l8 3"/></svg>;
  }
  return <svg {...p}><path d="M18 8a6 6 0 1 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/></svg>;
}

const nav = [
  ["pin", "GPS Tracking", "/technology/gps-tracking"],
  ["video", "Live Video", "/technology/live-video"],
  ["fuel", "Fuel Monitoring", "/technology/fuel-monitoring"],
  ["clock", "Real-Time Status", "/technology/real-time-status"],
  ["report", "Reports", "/technology/reports"],
  ["analytics", "Analytics", "/technology/analytics"],
  ["record", "Recordings", "/technology/recordings"],
  ["fleet", "Multi-Fleet", "/technology/multi-fleet"],
  ["alert", "Alerts", "/technology/alerts"],
] as const;

export default function TechnologyHero() {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 85, damping: 22 });
  const sy = useSpring(my, { stiffness: 85, damping: 22 });

  const rotateY = useTransform(sx, [-0.5, 0.5], [-6, 6]);
  const rotateX = useTransform(sy, [-0.5, 0.5], [5, -5]);
  const shiftX = useTransform(sx, [-0.5, 0.5], [-12, 12]);
  const shiftY = useTransform(sy, [-0.5, 0.5], [-8, 8]);

  function handleMove(event: MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    mx.set((event.clientX - rect.left) / rect.width - 0.5);
    my.set((event.clientY - rect.top) / rect.height - 0.5);
  }

  function reset() {
    mx.set(0);
    my.set(0);
  }

  return (
    <>
      <section className={styles.hero}>
        <div className={styles.background} />
        <div className={styles.overlay} />
        <div className={styles.gridGlow} />

        <div className={styles.shell}>
          <div className={styles.layout}>
            <motion.div
              className={styles.copy}
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.72, ease }}
            >
              <span className={styles.eyebrow}>
                FLEET INTELLIGENCE / VIDEO TELEMATICS / AI SAFETY
              </span>

              <h1>
                Connected.
                <br />
                Intelligent. <em>Visible.</em>
              </h1>

              <p>
                Track vehicles, see live operations and turn fleet activity into
                actionable intelligence — all from one connected RoadLenz platform.
              </p>

              <div className={styles.actions}>
                <Link href="#platform" className={styles.primary}>
                  Explore Platform <span>→</span>
                </Link>
                <Link href="/book-demo" className={styles.secondary}>
                  Request a Demo
                </Link>
              </div>

              <div className={styles.stats}>
                <div>
                  <strong>2,000+</strong>
                  <span>Vehicles Connected</span>
                </div>
                <div>
                  <strong>24/7</strong>
                  <span>Support</span>
                </div>
                <div>
                  <strong>10+ Years</strong>
                  <span>Experience</span>
                </div>
                <div>
                  <strong>Pan India</strong>
                  <span>Deployment</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              className={styles.visual}
              onMouseMove={handleMove}
              onMouseLeave={reset}
              style={{ rotateX, rotateY, x: shiftX, y: shiftY }}
              initial={{ opacity: 0, scale: 0.96, y: 26 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.95, delay: 0.08, ease }}
            >
              <div className={styles.deviceGlow} />

              <motion.div
                className={styles.laptop}
                animate={{ y: [0, -7, 0] }}
                transition={{ duration: 6.2, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className={styles.windowBar}>
                  <div><i /><i /><i /></div>
                  <span>RoadLenz Intelligence</span>
                  <small>LIVE</small>
                </div>
                <div className={styles.laptopScreen}>
                  <img
                    src={technologyMedia.overviewDesktop}
                    alt="RoadLenz fleet overview dashboard"
                  />
                </div>
              </motion.div>

              <motion.div
                className={`${styles.phone} ${styles.phoneLeft}`}
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 5.6, repeat: Infinity, ease: "easeInOut" }}
              >
                <img src={technologyMedia.heroLeft} alt="RoadLenz fleet mobile screen" />
              </motion.div>

              <motion.div
                className={`${styles.phone} ${styles.phoneCenter}`}
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 5.0, repeat: Infinity, ease: "easeInOut" }}
              >
                <img src={technologyMedia.heroCenter} alt="RoadLenz live tracking mobile" />
              </motion.div>

              <motion.div
                className={`${styles.phone} ${styles.phoneRight}`}
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 6.1, repeat: Infinity, ease: "easeInOut" }}
              >
                <img src={technologyMedia.heroRight} alt="RoadLenz live video mobile" />
              </motion.div>

              <motion.div
                className={`${styles.floatingCard} ${styles.trackingCard}`}
                animate={{ y: [0, -7, 0] }}
                transition={{ duration: 4.4, repeat: Infinity, ease: "easeInOut" }}
              >
                <span className={styles.blueIcon}><Icon name="pin" /></span>
                <div>
                  <strong>Live Tracking</strong>
                  <small>2,000+ Vehicles</small>
                </div>
              </motion.div>

              <motion.div
                className={`${styles.floatingCard} ${styles.alertCard}`}
                animate={{ y: [0, 7, 0] }}
                transition={{ duration: 5.1, repeat: Infinity, ease: "easeInOut" }}
              >
                <span className={styles.redIcon}><Icon name="alert" /></span>
                <div>
                  <strong>Real-Time Alerts</strong>
                  <small>Instant Notifications</small>
                </div>
              </motion.div>

              <motion.div
                className={`${styles.floatingCard} ${styles.monitorCard}`}
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <span className={styles.greenIcon}>✓</span>
                <div>
                  <strong>24/7</strong>
                  <small>Fleet Monitoring</small>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className={styles.navStrip}>
        <div className={styles.shell}>
          <div className={styles.navGrid}>
            {nav.map(([icon, label, href]) => (
              <Link href={href} key={label} className={styles.navItem}>
                <span><Icon name={icon} /></span>
                <strong>{label}</strong>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
