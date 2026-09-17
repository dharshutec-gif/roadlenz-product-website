"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

import { Icon } from "@/components/ui";
import styles from "./IndustryIntelligenceSection.module.css";

const capabilities = [
  { id: "gps", label: "GPS Tracking", icon: "pin" },
  { id: "video", label: "Live Video", icon: "video" },
  { id: "ai", label: "AI Safety", icon: "shield" },
  {
    id: "alerts",
    label: "Alerts & Notifications",
    icon: "alert",
  },
  {
    id: "reports",
    label: "Reports & Analytics",
    icon: "doc",
  },
  {
    id: "fleet",
    label: "Fleet Management",
    icon: "fleet",
  },
] as const;

const layers = [
  {
    id: "fleet",
    label: "FLEET OPERATIONS",
    y: -118,
    hoverY: -132,
    z: 90,
    opacity: 1,
  },
  {
    id: "video",
    label: "VIDEO & INSIGHTS",
    y: -40,
    hoverY: -47,
    z: 35,
    opacity: 0.92,
  },
  {
    id: "safety",
    label: "SAFETY & ALERTS",
    y: 40,
    hoverY: 47,
    z: -20,
    opacity: 0.84,
  },
  {
    id: "reports",
    label: "ANALYTICS & REPORTING",
    y: 118,
    hoverY: 132,
    z: -75,
    opacity: 0.76,
  },
] as const;

const particles = Array.from({ length: 20 }, (_, index) => ({
  id: index,
  x: 8 + ((index * 19) % 84),
  y: 4 + ((index * 13) % 58),
  duration: 2.6 + (index % 5) * 0.42,
  delay: index * -0.18,
}));

export default function IndustryIntelligenceSection() {
  return (
    <section
      className={styles.section}
      aria-labelledby="roadlenz-intelligence-title"
    >
      <div className={styles.grid} aria-hidden="true" />
      <div className={styles.ambientGlow} aria-hidden="true" />
      <div className={styles.sectionScan} aria-hidden="true" />

      <div className={styles.inner}>
        {/* LEFT */}

        <motion.div
          className={styles.copy}
          initial={{ opacity: 0, x: -22 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{
            duration: 0.65,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <p className={styles.eyebrow}>
            THE ROADLENZ ADVANTAGE
          </p>

          <h2 id="roadlenz-intelligence-title">
            One intelligence
            <br />
            layer for every
            <br />
            <em>industry.</em>
          </h2>

          <p className={styles.description}>
            Live visibility, video, safety, alerts and reporting
            connected through one RoadLenz platform.
          </p>

          <Link href="/technology" className={styles.button}>
            Explore Our Technology
            <Icon name="arrowRight" />
          </Link>
        </motion.div>

        {/* CENTER */}

        <motion.div
          className={styles.visual}
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.22 }}
          transition={{
            duration: 0.85,
            ease: [0.22, 1, 0.36, 1],
          }}
          aria-hidden="true"
        >
          <div className={styles.visualGlow} />

          {/* orbit rings behind stack */}

          <div className={`${styles.orbit} ${styles.orbitTop}`}>
            <span />
          </div>

          <div className={`${styles.orbit} ${styles.orbitMiddle}`}>
            <span />
          </div>

          <div className={`${styles.orbit} ${styles.orbitBottom}`}>
            <span />
          </div>

          {/* particles */}

          <div className={styles.particles}>
            {particles.map((particle) => {
              const style = {
                "--x": `${particle.x}%`,
                "--y": `${particle.y}%`,
                "--duration": `${particle.duration}s`,
                "--delay": `${particle.delay}s`,
              } as CSSProperties;

              return <span key={particle.id} style={style} />;
            })}
          </div>

          {/* subtle beam */}

          <div className={styles.beam}>
            <span />
          </div>

          {/* unified 3D stack */}

          <div className={styles.stackFloat}>
            <div className={styles.stack}>
              {layers.map((layer, index) => {
                const layerStyle = {
                  "--layer-y": `${layer.y}px`,
                  "--layer-hover-y": `${layer.hoverY}px`,
                  "--layer-z": `${layer.z}px`,
                  "--layer-opacity": layer.opacity,
                  "--delay": `${index * -0.85}s`,
                } as CSSProperties;

                return (
                  <div
                    key={layer.id}
                    className={styles.layer}
                    style={layerStyle}
                  >
                    <div className={styles.layerFace}>
                      <span className={styles.layerGrid} />
                      <span className={styles.layerSweep} />
                      <span className={styles.layerEdge} />

                      <div className={styles.layerDots}>
                        <i />
                        <i />
                        <i />
                      </div>

                      <strong>{layer.label}</strong>
                    </div>
                  </div>
                );
              })}

              {/* RoadLenz processor */}

              <div className={styles.core}>
                <span className={styles.coreAura} />

                <div className={styles.coreBody}>
                  <strong>ROADLENZ</strong>
                  <small>INTELLIGENCE CORE</small>

                  <i />
                  <i />
                  <i />
                </div>
              </div>
            </div>
          </div>

          {/* scanning base */}

          <div className={styles.base}>
            <span className={styles.baseOuter} />
            <span className={styles.baseMiddle} />
            <span className={styles.baseInner} />

            <i className={styles.baseDotOne} />
            <i className={styles.baseDotTwo} />
            <i className={styles.baseDotThree} />
          </div>
        </motion.div>

        {/* RIGHT — DISPLAY ONLY */}

        <div
          className={styles.capabilities}
          aria-label="RoadLenz platform capabilities"
        >
          {capabilities.map((item, index) => {
            const cardStyle = {
              "--float-delay": `${index * -0.55}s`,
              "--shine-delay": `${index * -0.72}s`,
            } as CSSProperties;

            return (
              <motion.div
                key={item.id}
                initial={{
                  opacity: 0,
                  y: 16,
                  scale: 0.97,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                }}
                viewport={{
                  once: true,
                  amount: 0.35,
                }}
                transition={{
                  duration: 0.48,
                  delay: index * 0.07,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <div className={styles.card} style={cardStyle}>
                  <span className={styles.cardShine} />

                  <span className={styles.iconCircle}>
                    <span className={styles.iconPulse} />
                    <Icon name={item.icon} />
                  </span>

                  <strong>{item.label}</strong>

                  <span className={styles.cardAccent} />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}