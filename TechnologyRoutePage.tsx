"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { TechnologyRoute } from "./technologyRoutes";
import { technologyRoutes } from "./technologyRoutes";
import { technologyMedia } from "./TechnologyMedia";
import styles from "./TechnologyRoutePage.module.css";

const ease = [0.16, 1, 0.3, 1] as const;

type RouteIconName =
  | "gps"
  | "video"
  | "fuel"
  | "status"
  | "reports"
  | "analytics"
  | "recordings"
  | "fleet"
  | "alerts"
  | "connect"
  | "understand"
  | "respond";

function RouteIcon({ name }: { name: RouteIconName }) {
  const p = {
    width: 21,
    height: 21,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.85,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  switch (name) {
    case "gps":
      return (
        <svg {...p}>
          <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
          <circle cx="12" cy="10" r="2.4" />
        </svg>
      );

    case "video":
      return (
        <svg {...p}>
          <rect x="3" y="6" width="13" height="12" rx="2" />
          <path d="m16 10 5-3v10l-5-3Z" />
        </svg>
      );

    case "fuel":
      return (
        <svg {...p}>
          <path d="M5 21V4h9v17M5 9h9M14 8h2l3 3v7a2 2 0 0 0 2 2" />
          <path d="M8 13h3" />
        </svg>
      );

    case "status":
      return (
        <svg {...p}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </svg>
      );

    case "reports":
      return (
        <svg {...p}>
          <path d="M6 3h9l3 3v15H6z" />
          <path d="M9 11h6M9 15h6M9 7h3" />
        </svg>
      );

    case "analytics":
      return (
        <svg {...p}>
          <path d="M4 20V11M10 20V5M16 20v-8M22 20V8" />
        </svg>
      );

    case "recordings":
      return (
        <svg {...p}>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      );

    case "fleet":
      return (
        <svg {...p}>
          <circle cx="6" cy="12" r="2" />
          <circle cx="18" cy="7" r="2" />
          <circle cx="18" cy="17" r="2" />
          <path d="m8 11 8-3M8 13l8 3" />
        </svg>
      );

    case "alerts":
      return (
        <svg {...p}>
          <path d="M18 8a6 6 0 1 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
          <path d="M10 21h4" />
        </svg>
      );

    case "connect":
      return (
        <svg {...p}>
          <path d="M7 12a5 5 0 0 1 5-5h2M17 12a5 5 0 0 1-5 5h-2" />
          <path d="m14 5 2 2-2 2M10 15l-2 2 2 2" />
        </svg>
      );

    case "understand":
      return (
        <svg {...p}>
          <path d="M4 18h16M6 15l4-5 3 3 5-7" />
          <circle cx="18" cy="6" r="1.5" />
        </svg>
      );

    default:
      return (
        <svg {...p}>
          <path d="m13 2-8 12h7l-1 8 8-12h-7Z" />
        </svg>
      );
  }
}

function themeFor(slug: string) {
  if (slug === "live-video") return "violet";
  if (slug === "fuel-monitoring") return "green";
  if (slug === "analytics") return "indigo";
  if (slug === "alerts") return "red";
  if (slug === "recordings") return "cyan";
  if (slug === "multi-fleet") return "navy";
  return "blue";
}

function iconForSlug(slug: string): RouteIconName {
  switch (slug) {
    case "gps-tracking":
      return "gps";

    case "live-video":
      return "video";

    case "fuel-monitoring":
      return "fuel";

    case "real-time-status":
      return "status";

    case "reports":
      return "reports";

    case "analytics":
      return "analytics";

    case "recordings":
      return "recordings";

    case "multi-fleet":
      return "fleet";

    case "alerts":
      return "alerts";

    default:
      return "gps";
  }
}

function nextRoutes(currentSlug: string) {
  return technologyRoutes
    .filter((item) => item.slug !== currentSlug)
    .slice(0, 3);
}

export default function TechnologyRoutePage({
  route,
}: {
  route: TechnologyRoute;
}) {
  const theme = themeFor(route.slug);

  return (
    <main className={styles.page} data-theme={theme}>
      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroBackdrop} />
        <div className={styles.heroGridBg} />
        <div className={styles.heroGlowA} />
        <div className={styles.heroGlowB} />

        <div className={styles.shell}>
          <div className={styles.heroLayout}>
            <motion.div
              className={styles.heroCopy}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.72, ease }}
            >
              <Link href="/technology" className={styles.backLink}>
                ← Back to Technology
              </Link>

              <span className={styles.eyebrow}>
                {route.eyebrow}
              </span>

              <h1>{route.title}</h1>

              <p>{route.description}</p>

              <div className={styles.heroActions}>
                <Link
                  href="/book-demo"
                  className={styles.primaryButton}
                >
                  Request a Demo <span>→</span>
                </Link>

                <Link
                  href="#capabilities"
                  className={styles.secondaryButton}
                >
                  Explore Features
                </Link>
              </div>

              <div className={styles.heroMeta}>
                <div>
                  <small>ROADLENZ</small>
                  <strong>Connected workspace</strong>
                </div>

                <div>
                  <small>REAL-TIME</small>
                  <strong>Fleet intelligence</strong>
                </div>

                <div>
                  <small>ONE PLATFORM</small>
                  <strong>Live + historical context</strong>
                </div>
              </div>
            </motion.div>

            <motion.div
              className={styles.heroVisual}
              initial={{
                opacity: 0,
                y: 28,
                scale: 0.98,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              transition={{
                duration: 0.88,
                delay: 0.08,
                ease,
              }}
            >
              <div className={styles.visualHalo} />

              <motion.div
                className={styles.heroBrowser}
                animate={{
                  y: [0, -6, 0],
                }}
                transition={{
                  duration: 6.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <div className={styles.browserBar}>
                  <div>
                    <i />
                    <i />
                    <i />
                  </div>

                  <span>RoadLenz Intelligence</span>

                  <small>LIVE</small>
                </div>

                <div className={styles.browserCanvas}>
                  <img
                    src={route.heroImage}
                    alt={route.label}
                  />
                </div>
              </motion.div>

              {route.secondaryImage && (
                <motion.div
                  className={styles.heroPhone}
                  animate={{
                    y: [0, -9, 0],
                    rotate: [-2, -1, -2],
                  }}
                  transition={{
                    duration: 5.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <img
                    src={route.secondaryImage}
                    alt={`${route.label} mobile view`}
                  />
                </motion.div>
              )}

              <motion.div
                className={`${styles.floatPanel} ${styles.floatPanelOne}`}
                animate={{
                  y: [0, -5, 0],
                }}
                transition={{
                  duration: 4.6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <small>ACTIVE MODULE</small>
                <strong>{route.label}</strong>
                <span>Connected to RoadLenz</span>
              </motion.div>

              <motion.div
                className={`${styles.floatPanel} ${styles.floatPanelTwo}`}
                animate={{
                  y: [0, 6, 0],
                }}
                transition={{
                  duration: 5.1,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <small>FLEET CONTEXT</small>
                <strong>Live + Historical</strong>
                <span>One operating view</span>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ROUTE NAVIGATION */}
      <section className={styles.moduleNav}>
        <div className={styles.shell}>
          <div className={styles.moduleNavGrid}>
            {technologyRoutes.map((item, index) => (
              <Link
                key={item.slug}
                href={`/technology/${item.slug}`}
                data-active={item.slug === route.slug}
              >
                <span className={styles.moduleIcon}>
                  <RouteIcon
                    name={iconForSlug(item.slug)}
                  />
                </span>

                <div className={styles.moduleLabel}>
                  <small>
                    {String(index + 1).padStart(2, "0")}
                  </small>

                  <strong>{item.label}</strong>
                </div>

                <b>→</b>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CAPABILITIES */}
      <section
        id="capabilities"
        className={styles.capabilitiesSection}
      >
        <div className={styles.shell}>
          <div className={styles.sectionHeader}>
            <div>
              <span className={styles.eyebrow}>
                CORE CAPABILITIES
              </span>

              <h2>
                Everything you need in one{" "}
                <em>connected workflow.</em>
              </h2>
            </div>

            <p>
              Each capability stays connected to the same
              RoadLenz vehicle, trip, video and operating context.
            </p>
          </div>

          <div className={styles.featureGrid}>
            {route.features.map((feature, index) => (
              <motion.article
                key={feature.title}
                className={styles.featureCard}
                initial={{
                  opacity: 0,
                  y: 18,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                  amount: 0.2,
                }}
                transition={{
                  delay: index * 0.05,
                }}
                whileHover={{
                  y: -7,
                }}
              >
                <div className={styles.featureTop}>
                  <span>
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <i />
                </div>

                <h3>{feature.title}</h3>

                <p>{feature.copy}</p>

                <div className={styles.featureFoot}>
                  <small>ROADLENZ MODULE</small>
                  <b>→</b>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* STORY */}
      <section className={styles.storySection}>
        <div className={styles.shell}>
          <div className={styles.storyGrid}>
            <motion.div
              className={styles.storyCopy}
              initial={{
                opacity: 0,
                x: -22,
              }}
              whileInView={{
                opacity: 1,
                x: 0,
              }}
              viewport={{
                once: true,
                amount: 0.24,
              }}
            >
              <span className={styles.eyebrow}>
                ROADLENZ IN ACTION
              </span>

              <h2>{route.storyTitle}</h2>

              <p>{route.storyDescription}</p>

              <div className={styles.storyPoints}>
                {route.storyPoints.map((point, index) => (
                  <div key={point}>
                    <span>
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <strong>{point}</strong>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              className={styles.storyVisual}
              initial={{
                opacity: 0,
                y: 24,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
                amount: 0.2,
              }}
            >
              <div className={styles.storyHalo} />

              <div className={styles.storyBrowser}>
                <div className={styles.browserBar}>
                  <div>
                    <i />
                    <i />
                    <i />
                  </div>

                  <span>{route.label}</span>
                </div>

                <div className={styles.storyCanvas}>
                  <img
                    src={route.storyImage}
                    alt={route.storyTitle}
                  />
                </div>
              </div>

              <motion.div
                className={styles.metricCard}
                animate={{
                  y: [0, -6, 0],
                }}
                transition={{
                  duration: 4.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <small>ROADLENZ INTELLIGENCE</small>
                <strong>Connected fleet context</strong>
                <span>
                  Live data · history · action
                </span>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* WORKFLOW */}
      <section className={styles.workflowSection}>
        <div className={styles.shell}>
          <div className={styles.workflowHeading}>
            <span className={styles.eyebrow}>
              HOW THIS MODULE WORKS
            </span>

            <h2>
              From vehicle signal to{" "}
              <em>fleet response.</em>
            </h2>

            <p>
              A simple connected flow that turns live vehicle
              information into context and then into action.
            </p>
          </div>

          <div className={styles.workflowGrid}>
            {[
              [
                "01",
                "connect" as RouteIconName,
                "Connect",
                "Vehicle data, cameras and telematics connect to RoadLenz.",
              ],
              [
                "02",
                "understand" as RouteIconName,
                "Understand",
                "RoadLenz combines live status, history and context.",
              ],
              [
                "03",
                "respond" as RouteIconName,
                "Respond",
                "Your team acts without switching between disconnected tools.",
              ],
            ].map(
              ([number, icon, title, copy], index) => (
                <motion.article
                  key={number}
                  className={styles.workflowCard}
                  initial={{
                    opacity: 0,
                    y: 16,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                    amount: 0.3,
                  }}
                  transition={{
                    delay: index * 0.08,
                  }}
                >
                  <span className={styles.workflowNumber}>
                    {number}
                  </span>

                  <div className={styles.workflowIcon}>
                    <RouteIcon
                      name={icon as RouteIconName}
                    />
                  </div>

                  <h3>{title}</h3>

                  <p>{copy}</p>

                  {index < 2 && (
                    <span className={styles.workflowArrow}>
                      →
                    </span>
                  )}
                </motion.article>
              )
            )}
          </div>
        </div>
      </section>

      {/* NEXT MODULES */}
      <section className={styles.nextSection}>
        <div className={styles.shell}>
          <div className={styles.nextHeader}>
            <div>
              <span className={styles.eyebrow}>
                EXPLORE MORE
              </span>

              <h2>
                Connected modules.{" "}
                <em>One platform.</em>
              </h2>
            </div>

            <p>
              Move between RoadLenz modules without losing
              the vehicle or fleet context.
            </p>
          </div>

          <div className={styles.nextGrid}>
            {nextRoutes(route.slug).map((item, index) => (
              <motion.div
                key={item.slug}
                initial={{
                  opacity: 0,
                  y: 16,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                  amount: 0.3,
                }}
                transition={{
                  delay: index * 0.06,
                }}
              >
                <Link
                  href={`/technology/${item.slug}`}
                  className={styles.nextCard}
                >
                  <span className={styles.nextIcon}>
                    <RouteIcon
                      name={iconForSlug(item.slug)}
                    />
                  </span>

                  <small>
                    {String(index + 1).padStart(2, "0")}
                  </small>

                  <strong>{item.label}</strong>

                  <b>Explore →</b>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        className={styles.cta}
        style={{
          backgroundImage: `linear-gradient(
              90deg,
              rgba(1,15,27,.96),
              rgba(3,24,37,.52)
            ),
            url("${technologyMedia.roadScene}")`,
        }}
      >
        <div className={styles.shell}>
          <div className={styles.ctaGrid}>
            <div>
              <span className={styles.ctaEyebrow}>
                ROADLENZ TECHNOLOGY
              </span>

              <h2>{route.ctaTitle}</h2>

              <p>{route.ctaDescription}</p>
            </div>

            <div className={styles.ctaActions}>
              <Link
                href="/contact"
                className={styles.ctaPrimary}
              >
                Talk to Our Team <span>→</span>
              </Link>

              <Link
                href="/technology"
                className={styles.ctaSecondary}
              >
                Explore Technology
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}