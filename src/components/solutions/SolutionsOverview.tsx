"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";

import { Icon } from "@/components/ui";
import type { Solution } from "@/lib/types";

import styles from "./SolutionsOverview.module.css";

const capabilities = [
  {
    icon: "pin",
    title: "Live GPS Tracking",
    copy: "Every vehicle. One live map.",
    href: "gps-tracking",
  },
  {
    icon: "video",
    title: "Live Video",
    copy: "A clear view of every journey.",
    href: "live-video",
  },
  {
    icon: "shield",
    title: "AI Safety",
    copy: "Spot risk. Support safer driving.",
    href: "alerts",
  },
  {
    icon: "alert",
    title: "Alerts",
    copy: "Know sooner. Respond faster.",
    href: "alerts",
  },
  {
    icon: "doc",
    title: "Reports",
    copy: "Turn journeys into useful insights.",
    href: "reports",
  },
  {
    icon: "fleet",
    title: "Fleet Management",
    copy: "Your entire fleet, connected.",
    href: "multi-fleet",
  },
];

const steps = [
  {
    icon: "link",
    title: "Connect",
    copy: "Bring your vehicles onto one platform.",
  },
  {
    icon: "pin",
    title: "Track",
    copy: "See where your fleet is moving.",
  },
  {
    icon: "video",
    title: "Monitor",
    copy: "See the road. Understand events.",
  },
  {
    icon: "gauge",
    title: "Act",
    copy: "Make informed decisions, faster.",
  },
];

const values = [
  {
    icon: "shield",
    title: "Engineered Hardware",
    copy: "Vehicle technology built for demanding environments.",
  },
  {
    icon: "eye",
    title: "Connected Visibility",
    copy: "Location, video and vehicle data together.",
  },
  {
    icon: "fleet",
    title: "Flexible Solutions",
    copy: "Solutions that fit your fleet.",
  },
  {
    icon: "headphones",
    title: "Expert Support",
    copy: "People to help you deploy and grow.",
  },
];

function vehicle(s: Solution) {
  return (
    s.vehicleImage ||
    (s.heroMedia.type === "image"
      ? s.heroMedia.src
      : s.heroMedia.poster)
  );
}

export default function SolutionsOverview({
  solutions,
}: {
  solutions: Solution[];
  heroMedia: {
    video: string;
    poster: string;
  };
}) {
  const [selectedSlug, setSelectedSlug] = useState(
    solutions.find((s) => /school/.test(s.slug))?.slug ??
      solutions[0]?.slug
  );

  const selected =
    solutions.find((s) => s.slug === selectedSlug) ??
    solutions[0];

  /* =========================================================
     SCROLL REVEAL OBSERVERS
  ========================================================= */

  const workflowRef = useRef<HTMLElement | null>(null);
  const platformRef = useRef<HTMLElement | null>(null);

  const [workflowVisible, setWorkflowVisible] =
    useState(false);

  const [platformVisible, setPlatformVisible] =
    useState(false);

  useEffect(() => {
    const workflowElement = workflowRef.current;
    const platformElement = platformRef.current;

    if (!workflowElement && !platformElement) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          if (entry.target === workflowElement) {
            setWorkflowVisible(true);
          }

          if (entry.target === platformElement) {
            setPlatformVisible(true);
          }
        });
      },
      {
        threshold: 0.18,
        rootMargin: "0px 0px -80px 0px",
      }
    );

    if (workflowElement) {
      observer.observe(workflowElement);
    }

    if (platformElement) {
      observer.observe(platformElement);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className={styles.page}>
      {/* =====================================================
          HERO
      ===================================================== */}

      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroCopy}>
            <span className={styles.eyebrow}>
              RoadLenz Solutions
            </span>

            <h1>
              Built Around
              <br />
              Your <em>Operation.</em>
            </h1>

            <p>
              Connected fleets. Safer journeys.
              <br />
              The right solution for the way you move.
            </p>

            <a
              className={styles.button}
              href="#solutions-operations"
            >
              Explore Your Solution
              <Icon name="arrowRight" />
            </a>

            <div className={styles.heroBenefits}>
              {[
                {
                  icon: "shield",
                  title: "Safer",
                  copy: "Operations",
                },
                {
                  icon: "gauge",
                  title: "Smarter",
                  copy: "Decisions",
                },
                {
                  icon: "fleet",
                  title: "Real Impact",
                  copy: "Across industries",
                },
              ].map((x) => (
                <div key={x.title}>
                  <Icon name={x.icon} />

                  <span>
                    <strong>{x.title}</strong>
                    <small>{x.copy}</small>
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.heroVisual}>
            <div className={styles.laptop}>
              <img
                src="/media/technology/desktop/overview.png"
                alt="RoadLenz desktop fleet overview dashboard"
                width={1440}
                height={900}
              />
            </div>

            <div className={styles.laptopBase} />

            <figure className={styles.camera}>
              <img
                src="/media/solutions/school-transport-hero.jpg"
                alt="School transport fleet camera preview"
              />

              <figcaption>
                <Icon name="video" />
                Connected vehicle visibility
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* =====================================================
          OPERATIONS
      ===================================================== */}

      <section
        id="solutions-operations"
        className={styles.operations}
      >
        <div className={styles.container}>
          <div className={styles.centerHeading}>
            <h2>
              Choose Your <em>Operation.</em>
            </h2>

            <p>
              Different vehicles. Different needs. One connected
              solution.
            </p>
          </div>

          <div
            className={styles.vehicles}
            aria-label="Choose an operation"
          >
            {solutions.map((s, i) => (
              <button
                type="button"
                key={s.id}
                aria-pressed={selected?.slug === s.slug}
                onClick={() => setSelectedSlug(s.slug)}
                className={styles.vehicle}
                style={
                  {
                    animationDelay: `${i * 65}ms`,
                  } as CSSProperties
                }
              >
                <img
                  src={vehicle(s)}
                  alt={`${s.name} vehicle`}
                  loading="lazy"
                />

                <span>{s.name}</span>

                <i aria-hidden="true" />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          FROM VEHICLE DATA TO FLEET ACTION
      ===================================================== */}

      <section
        ref={workflowRef}
        className={`${styles.workflow} ${
          workflowVisible
            ? styles.workflowVisible
            : ""
        }`}
      >
        <div className={styles.container}>
          <div className={styles.sectionHeading}>
            <div className={styles.workflowHeading}>
              <span className={styles.workflowEyebrow}>
                From vehicle data to fleet action
              </span>

              <h2 className={styles.workflowTitle}>
                A simpler way to{" "}
                <em>smarter operations.</em>
              </h2>
            </div>

            <p className={styles.workflowDescription}>
              RoadLenz turns connected vehicle data into a clear
              operational flow — from onboarding and visibility to
              monitoring and action.
            </p>
          </div>

          <div className={styles.steps}>
            {steps.map((x, i) => (
              <article
                key={x.title}
                className={styles.workflowStep}
                style={
                  {
                    "--step-delay": `${i * 150}ms`,
                  } as CSSProperties
                }
              >
                <span className={styles.stepIcon}>
                  <Icon name={x.icon} />
                </span>

                {i < steps.length - 1 && (
                  <span
                    className={styles.stepConnector}
                    aria-hidden="true"
                  />
                )}

                <small>0{i + 1}</small>

                <h3>{x.title}</h3>

                <p>{x.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          ONE CONNECTED PLATFORM
      ===================================================== */}

      <section
        ref={platformRef}
        className={`${styles.platform} ${
          platformVisible
            ? styles.platformVisible
            : ""
        }`}
      >
        <div className={styles.container}>
          <div className={styles.sectionHeading}>
            <div className={styles.platformHeading}>
              <span className={styles.platformEyebrow}>
                One connected platform
              </span>

              <h2 className={styles.platformTitle}>
                One Platform.{" "}
                <em>Every Operation.</em>
              </h2>
            </div>

            <p className={styles.platformDescription}>
              Six connected capabilities. One clear view of your
              fleet.
            </p>
          </div>

          <div className={styles.capabilities}>
            {capabilities.map((x, i) => (
              <Link
                key={x.title}
                href={`/technology/${x.href}`}
                className={styles.capability}
                style={
                  {
                    "--capability-delay": `${i * 90}ms`,
                  } as CSSProperties
                }
              >
                <span className={styles.icon}>
                  <Icon name={x.icon} />
                </span>

                <div>
                  <h3>{x.title}</h3>

                  <p>{x.copy}</p>
                </div>

                <small>0{i + 1}</small>

                <span
                  className={styles.capabilityArrow}
                  aria-hidden="true"
                >
                  <Icon name="arrowRight" />
                </span>
              </Link>
            ))}
          </div>

          {selected && (
            <article
              className={`${styles.featured} ${
                platformVisible
                  ? styles.featuredVisible
                  : ""
              }`}
              id="selected-solution"
              aria-live="polite"
              style={
                {
                  "--featured-delay": "650ms",
                } as CSSProperties
              }
            >
              <div className={styles.featuredCopy}>
                <span className={styles.eyebrow}>
                  {selected.name}
                </span>

                <h2>
                  {/school/.test(selected.slug)
                    ? "Every school ride, accounted for."
                    : selected.heroTitle}
                </h2>

                <p>
                  Connected visibility and practical tools for
                  every journey.
                </p>

                <Link
                  className={styles.button}
                  href={`/solutions/${selected.slug}`}
                >
                  Explore {selected.name}
                  <Icon name="arrowRight" />
                </Link>
              </div>

              <ul>
                {capabilities.slice(0, 5).map((x) => (
                  <li key={x.title}>
                    <Icon name={x.icon} />
                    {x.title}
                  </li>
                ))}
              </ul>

              <img
                className={styles.featuredVehicle}
                src={vehicle(selected)}
                alt={`${selected.name} connected fleet solution`}
              />
            </article>
          )}
        </div>
      </section>

      {/* =====================================================
          WHY ROADLENZ
      ===================================================== */}

      <section className={styles.why}>
        <div className={styles.container}>
          <div className={styles.sectionHeading}>
            <div>
              <span className={styles.eyebrow}>
                Why RoadLenz
              </span>

              <h2>
                Built Around the{" "}
                <em>Real World.</em>
              </h2>
            </div>

            <p>
              Built for everyday challenges. Supported by real
              people.
            </p>
          </div>

          <div className={styles.values}>
            {values.map((x) => (
              <article key={x.title}>
                <span className={styles.icon}>
                  <Icon name={x.icon} />
                </span>

                <div>
                  <h3>{x.title}</h3>

                  <p>{x.copy}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          CTA
      ===================================================== */}

      <section className={styles.cta}>
        <div className={styles.container}>
          <div className={styles.ctaContent}>
            <span className={styles.ctaEyebrow}>
              Let’s Build a Safer Tomorrow
            </span>

            <h2>
              Find the right solution
              <br />
              for your <em>operation.</em>
            </h2>
          </div>

          <div className={styles.ctaActions}>
            <Link
              className={styles.button}
              href="/contact"
            >
              Get in Touch
              <Icon name="arrowRight" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}