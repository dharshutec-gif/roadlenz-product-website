"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

import type { Industry } from "@/lib/types";
import { Icon } from "@/components/ui";

import {
  getIndustryPresentation,
  getOrderedIndustryRecords,
  type IndustryPresentation,
} from "./industryPresentation";

import IndustryIntelligenceSection from "./IndustryIntelligenceSection";

import styles from "./IndustriesExperience.module.css";

type Props = {
  industries: Industry[];
};

type IndustryView = Industry & {
  presentation: IndustryPresentation;
};

const reveal = {
  initial: {
    opacity: 0,
    y: 16,
  },

  whileInView: {
    opacity: 1,
    y: 0,
  },

  viewport: {
    once: true,
    amount: 0.18,
  },
};

export default function IndustriesExperience({
  industries,
}: Props) {
  const railRef = useRef<HTMLDivElement>(null);

  const ordered = useMemo(
    () =>
      getOrderedIndustryRecords(industries)
        .map((industry) => {
          const presentation =
            getIndustryPresentation(industry.slug);

          return presentation
            ? ({
                ...industry,
                presentation,
              } as IndustryView)
            : null;
        })
        .filter(
          (
            item,
          ): item is IndustryView =>
            Boolean(item),
        ),
    [industries],
  );

  const [activeIndex, setActiveIndex] =
    useState(0);

  const [
    marqueePaused,
    setMarqueePaused,
  ] = useState(false);

  const active =
    ordered[activeIndex] ??
    ordered[0];

  /*
   * Auto vehicle marquee
   */
  useEffect(() => {
    if (
      marqueePaused ||
      ordered.length < 2
    ) {
      return;
    }

    const timer =
      window.setInterval(() => {
        setActiveIndex(
          (current) =>
            (current + 1) %
            ordered.length,
        );
      }, 5000);

    return () => {
      window.clearInterval(timer);
    };
  }, [
    marqueePaused,
    ordered.length,
  ]);

  const select = (
    index: number,
    scroll = false,
  ) => {
    if (!ordered.length) {
      return;
    }

    const next =
      (index + ordered.length) %
      ordered.length;

    setActiveIndex(next);

    if (scroll) {
      const rail =
        railRef.current;

      const card =
        rail?.children[
          next
        ] as
          | HTMLElement
          | undefined;

      card?.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  };

  if (!active) {
    return (
      <section
        className={
          styles.emptyState
        }
      >
        <Icon name="route" />

        <h1>
          Industries are being
          prepared.
        </h1>

        <p>
          Talk to RoadLenz about
          your fleet operation.
        </p>

        <Link href="/contact">
          Contact our team
        </Link>
      </section>
    );
  }

  return (
    <main className={styles.page}>
      {/* =======================
          HERO
      ======================= */}

      <section
        className={styles.hero}
        aria-labelledby="industries-title"
      >
        <div
          className={
            styles.heroBackdrop
          }
          aria-hidden="true"
        />

        <div
          className={
            styles.heroGrid
          }
          aria-hidden="true"
        />

        <div
          className={
            styles.heroInner
          }
        >
          <motion.div
            {...reveal}
            className={
              styles.heroCopy
            }
          >
            <p
              className={
                styles.eyebrow
              }
            >
              Industries
            </p>

            <h1 id="industries-title">
              Built for
              <br />
              real{" "}
              <span
                className={
                  styles.heroAccent
                }
              >
                operations.
              </span>
            </h1>

            <p
              className={
                styles.heroLead
              }
            >
              Different fleets.
              Different challenges.
              One connected RoadLenz
              intelligence platform.
            </p>

            <a
              href="#industry-explorer"
              className={
                styles.primaryButton
              }
            >
              Explore Industries

              <Icon name="arrowRight" />
            </a>
          </motion.div>

          {/* Animated software console */}

          <motion.div
            initial={{
              opacity: 0,
              x: 28,
              y: 10,
            }}
            animate={{
              opacity: 1,
              x: 0,
              y: 0,
            }}
            transition={{
              duration: 0.75,
              delay: 0.12,
              ease: [
                0.22,
                1,
                0.36,
                1,
              ],
            }}
            className={
              styles.heroConsole
            }
            aria-hidden="true"
          >
            <div
              className={
                styles.consoleGlow
              }
            />

            <div
              className={
                styles.consoleWindow
              }
            >
              <div
                className={
                  styles.consoleTopbar
                }
              >
                <span />
                <span />
                <span />

                <b>
                  RoadLenz Fleet
                  Operations
                </b>
              </div>

              <div
                className={
                  styles.consoleBody
                }
              >
                <div
                  className={
                    styles.consoleSidebar
                  }
                >
                  {[
                    "Live Fleet",
                    "Video",
                    "Alerts",
                    "Reports",
                    "Companies",
                  ].map(
                    (
                      item,
                      index,
                    ) => (
                      <span
                        key={
                          item
                        }
                        className={
                          index ===
                          0
                            ? styles.activeMenu
                            : ""
                        }
                      >
                        {item}
                      </span>
                    ),
                  )}
                </div>

                <div
                  className={
                    styles.consoleMap
                  }
                >
                  <span
                    className={`${styles.mapPin} ${styles.pinA}`}
                  />

                  <span
                    className={`${styles.mapPin} ${styles.pinB}`}
                  />

                  <span
                    className={`${styles.mapPin} ${styles.pinC}`}
                  />

                  <span
                    className={`${styles.mapPin} ${styles.pinD}`}
                  />

                  <i
                    className={
                      styles.routeLine
                    }
                  />
                </div>

                <div
                  className={
                    styles.consolePanel
                  }
                >
                  <small>
                    Fleet visibility
                  </small>

                  <strong>
                    Connected
                  </strong>

                  <small>
                    Operational alerts
                  </small>

                  <strong>
                    In view
                  </strong>

                  <small>
                    Reports
                  </small>

                  <strong>
                    Ready
                  </strong>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* HERO STATS */}

        <motion.div
          className={
            styles.heroStats
          }
          initial="hidden"
          animate="show"
          variants={{
            hidden: {
              opacity: 0,
              y: 18,
            },

            show: {
              opacity: 1,
              y: 0,

              transition: {
                delayChildren:
                  0.55,

                staggerChildren:
                  0.12,
              },
            },
          }}
        >
          {[
            [
              "7",
              "Industries",
            ],

            [
              "2,000+",
              "Vehicles Connected",
            ],

            [
              "10+",
              "Years of Experience",
            ],

            [
              "Pan India",
              "Operations",
            ],
          ].map(
            ([
              value,
              label,
            ]) => (
              <motion.div
                key={label}
                variants={{
                  hidden: {
                    opacity: 0,
                    y: 14,
                  },

                  show: {
                    opacity: 1,
                    y: 0,
                  },
                }}
              >
                <strong>
                  {value}
                </strong>

                <span>
                  {label}
                </span>
              </motion.div>
            ),
          )}
        </motion.div>
      </section>

      {/* =======================
          INDUSTRY MARQUEE
      ======================= */}

      <section
        id="industry-explorer"
        className={
          styles.explorer
        }
        aria-labelledby="industry-explorer-title"
      >
        <motion.div
          {...reveal}
          className={
            styles.sectionIntro
          }
        >
          <p
            className={
              styles.eyebrow
            }
          >
            Industry Explorer
          </p>

          <h2 id="industry-explorer-title">
            One platform.{" "}
            <em>
              Seven industries.
            </em>
          </h2>

          <p>
            Select an industry to
            see how RoadLenz adapts
            to the way your
            operation moves.
          </p>
        </motion.div>

        <div
          className={
            styles.marqueeShell
          }
          onMouseEnter={() =>
            setMarqueePaused(true)
          }
          onMouseLeave={() =>
            setMarqueePaused(false)
          }
          onFocusCapture={() =>
            setMarqueePaused(true)
          }
          onBlurCapture={() =>
            setMarqueePaused(false)
          }
        >
          <button
            type="button"
            onClick={() =>
              select(
                activeIndex - 1,
                true,
              )
            }
            className={`${styles.carouselButton} ${styles.prev}`}
            aria-label="Previous industry"
          >
            <Icon name="chevronLeft" />
          </button>

          <div
            ref={railRef}
            className={
              styles.vehicleRail
            }
            onScroll={(event) => {
              const target =
                event.currentTarget;

              if (
                window.innerWidth >
                900
              ) {
                return;
              }

              const center =
                target.scrollLeft +
                target.clientWidth /
                  2;

              const items =
                Array.from(
                  target.children,
                ) as HTMLElement[];

              if (!items.length) {
                return;
              }

              let winner = 0;

              let distance =
                Number.POSITIVE_INFINITY;

              items.forEach(
                (
                  item,
                  index,
                ) => {
                  const itemCenter =
                    item.offsetLeft +
                    item.offsetWidth /
                      2;

                  const nextDistance =
                    Math.abs(
                      itemCenter -
                        center,
                    );

                  if (
                    nextDistance <
                    distance
                  ) {
                    distance =
                      nextDistance;

                    winner =
                      index;
                  }
                },
              );

              setActiveIndex(
                winner,
              );
            }}
          >
            {ordered.map(
              (
                industry,
                index,
              ) => {
                const selected =
                  index ===
                  activeIndex;

                const presentation =
                  industry.presentation;

                return (
                  <motion.div
                    key={
                      industry.slug
                    }
                    className={`${styles.vehicleCard} ${
                      selected
                        ? styles.vehicleCardActive
                        : ""
                    }`}
                    onMouseEnter={() =>
                      setActiveIndex(
                        index,
                      )
                    }
                    onFocusCapture={() =>
                      setActiveIndex(
                        index,
                      )
                    }
                    animate={
                      selected
                        ? {
                            y: -12,
                            scale:
                              1.025,
                          }
                        : {
                            y: 0,
                            scale: 1,
                          }
                    }
                    whileHover={{
                      y: -14,
                      scale:
                        1.035,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 260,
                      damping: 24,
                    }}
                  >
                    <Link
                      href={`/industries/${industry.slug}`}
                      aria-label={`Explore ${presentation.navName}`}
                    >
                      <div
                        className={
                          styles.vehicleStage
                        }
                      >
                        <img
                          src={
                            presentation.vehicleImage
                          }
                          alt={`${presentation.navName} vehicle`}
                        />
                      </div>

                      <div
                        className={
                          styles.vehicleLabel
                        }
                      >
                        <Icon
                          name={
                            presentation.icon
                          }
                        />

                        <div>
                          <strong>
                            {
                              presentation.navName
                            }
                          </strong>

                          <span>
                            {
                              presentation.shortLine
                            }
                          </span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              },
            )}
          </div>

          <button
            type="button"
            onClick={() =>
              select(
                activeIndex + 1,
                true,
              )
            }
            className={`${styles.carouselButton} ${styles.next}`}
            aria-label="Next industry"
          >
            <Icon name="chevronRight" />
          </button>
        </div>

        <div
          className={styles.dots}
          aria-label="Select industry"
        >
          {ordered.map(
            (
              industry,
              index,
            ) => (
              <button
                key={
                  industry.slug
                }
                type="button"
                onClick={() =>
                  select(
                    index,
                    true,
                  )
                }
                aria-label={`Select ${industry.presentation.navName}`}
                aria-pressed={
                  index ===
                  activeIndex
                }
              />
            ),
          )}
        </div>
      </section>

      {/* =======================
          SELECTED INDUSTRY
      ======================= */}

      <section
        className={styles.story}
        aria-live="polite"
      >
        <AnimatePresence
          mode="wait"
          initial={false}
        >
          <motion.div
            key={active.slug}
            initial={{
              opacity: 0,
              y: 12,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: -8,
            }}
            transition={{
              duration: 0.32,

              ease: [
                0.22,
                1,
                0.36,
                1,
              ],
            }}
            className={
              styles.storyInner
            }
          >
            <div
              className={
                styles.storyCopy
              }
            >
              <p
                className={
                  styles.eyebrow
                }
              >
                {
                  active
                    .presentation
                    .navName
                }
              </p>

              <h2>
                {
                  active
                    .presentation
                    .storyTitle
                }
              </h2>

              <p
                className={
                  styles.storyLead
                }
              >
                {
                  active
                    .presentation
                    .storyCopy
                }
              </p>

              <div
                className={
                  styles.storyBenefits
                }
              >
                {active.presentation.storyBenefits.map(
                  (
                    benefit,
                  ) => (
                    <div
                      key={
                        benefit.title
                      }
                    >
                      <span>
                        <Icon
                          name={
                            benefit.icon
                          }
                        />
                      </span>

                      <div>
                        <strong>
                          {
                            benefit.title
                          }
                        </strong>

                        <p>
                          {
                            benefit.description
                          }
                        </p>
                      </div>
                    </div>
                  ),
                )}
              </div>

              <Link
                href={`/industries/${active.slug}`}
                className={
                  styles.primaryButton
                }
              >
                Explore{" "}
                {
                  active
                    .presentation
                    .navName
                }

                <Icon name="arrowRight" />
              </Link>
            </div>

            <div
              className={
                styles.storyVisual
              }
            >
              <img
                src={
                  active
                    .presentation
                    .sceneImage
                }
                alt=""
              />

              <div
                className={
                  styles.storyShade
                }
              />

              <p>
                {
                  active
                    .presentation
                    .shortLine
                }
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </section>

      {/* =======================
          INDUSTRIES IN ACTION
      ======================= */}

      <section
        className={styles.montage}
        aria-labelledby="industries-action-title"
      >
        <div
          className={
            styles.montageCopy
          }
        >
          <motion.p
            {...reveal}
            className={
              styles.eyebrow
            }
          >
            Industries in action
          </motion.p>

          <motion.h2
            {...reveal}
            id="industries-action-title"
          >
            Different roads.
            <br />
            A common purpose.
          </motion.h2>

          <motion.p {...reveal}>
            From city mobility to
            remote operations,
            RoadLenz helps teams
            keep vehicles, people
            and assets connected
            across every terrain.
          </motion.p>

          <motion.a
            {...reveal}
            href="#industry-explorer"
          >
            Discover how we make
            an impact

            <Icon name="arrowRight" />
          </motion.a>
        </div>

        <div
          className={styles.mosaic}
        >
          {ordered
            .slice(0, 6)
            .map(
              (
                industry,
                index,
              ) => (
                <Link
                  href={`/industries/${industry.slug}`}
                  key={
                    industry.slug
                  }
                  className={
                    index === 0
                      ? styles.mosaicLarge
                      : ""
                  }
                >
                  <img
                    src={
                      industry
                        .presentation
                        .montageImage
                    }
                    alt=""
                    loading="lazy"
                  />

                  <span>
                    {
                      industry
                        .presentation
                        .navName
                    }
                  </span>
                </Link>
              ),
            )}
        </div>
      </section>

      {/* NEW 3D INTELLIGENCE CORE */}

      <IndustryIntelligenceSection />

      {/* =======================
          PLATFORM VALUES
      ======================= */}

      <section
        className={styles.results}
        aria-labelledby="results-title"
      >
        <motion.div
          {...reveal}
          className={
            styles.resultsIntro
          }
        >
          <p
            className={
              styles.eyebrow
            }
          >
            Real operations
          </p>

          <h2 id="results-title">
            Built to support
            <br />
            diverse fleets.
          </h2>

          <p>
            RoadLenz connects
            location, video and
            operational intelligence
            so fleet teams can work
            with a clearer picture
            of what is happening.
          </p>
        </motion.div>

        <div
          className={
            styles.resultStats
          }
        >
          {[
            [
              "eye",
              "Live Visibility",
              "Know where vehicles are and what is happening.",
            ],

            [
              "video",
              "Video Intelligence",
              "Bring live and recorded video into fleet context.",
            ],

            [
              "shield",
              "Safety & Alerts",
              "Surface critical events and operational exceptions.",
            ],

            [
              "doc",
              "Reports & Analytics",
              "Turn activity into clear operational intelligence.",
            ],
          ].map(
            (
              [
                icon,
                title,
                copy,
              ],
              index,
            ) => (
              <motion.div
                key={title}
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
                  delay:
                    index *
                    0.08,

                  duration:
                    0.45,
                }}
                whileHover={{
                  y: -5,
                }}
              >
                <span
                  className={
                    styles.resultIcon
                  }
                >
                  <Icon
                    name={icon}
                  />
                </span>

                <strong>
                  {title}
                </strong>

                <small>
                  {copy}
                </small>
              </motion.div>
            ),
          )}
        </div>

        <motion.blockquote
          {...reveal}
          className={
            styles.quoteCard
          }
        >
          <Icon name="eye" />

          <p>
            One connected RoadLenz
            view helps operations
            teams bring vehicle
            movement, alerts, video
            context and reporting
            together instead of
            checking disconnected
            systems.
          </p>

          <footer>
            RoadLenz Fleet
            Intelligence Platform
          </footer>
        </motion.blockquote>
      </section>

      {/* =======================
          CTA
      ======================= */}

      <section
        className={styles.cta}
        aria-labelledby="industries-cta-title"
      >
        <div
          className={
            styles.ctaBackdrop
          }
          aria-hidden="true"
        />

        <div
          className={
            styles.ctaInner
          }
        >
          <div>
            <p
              className={
                styles.eyebrow
              }
            >
              Ready to transform
              your industry?
            </p>

            <h2 id="industries-cta-title">
              Let’s build a{" "}
              <em>
                safer,
                <br />
                smarter tomorrow.
              </em>
            </h2>

            <p>
              Tell us how your fleet
              operates. We’ll show
              you how RoadLenz can
              fit into your
              operation.
            </p>

            <div
              className={
                styles.ctaActions
              }
            >
              <Link
                href="/book-demo"
                className={
                  styles.primaryButton
                }
              >
                Request a Demo

                <Icon name="arrowRight" />
              </Link>

              <Link
                href="/contact"
                className={
                  styles.secondaryButton
                }
              >
                Contact Our Team
              </Link>
            </div>
          </div>

          <ul>
            <li>
              <Icon name="shield" />
              Safer Operations
            </li>

            <li>
              <Icon name="fleet" />
              Connected Fleets
            </li>

            <li>
              <Icon name="gauge" />
              Smarter Decisions
            </li>

            <li>
              <Icon name="leaf" />
              Sustainable Growth
            </li>
          </ul>
        </div>
      </section>
    </main>
  );
}