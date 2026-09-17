"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import type { Industry, Solution } from "@/lib/types";
import { Icon } from "@/components/ui";
import type { IndustryPresentation } from "./industryPresentation";
import styles from "./IndustryDetailExperience.module.css";

type Props = {
  industry: Industry;
  presentation: IndustryPresentation;
  solution?: Solution;
};

const reveal = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.18 },
};

export default function IndustryDetailExperience({ industry, presentation, solution }: Props) {
  const reduce = useReducedMotion();
  const capabilityLabels = (industry.capabilities ?? []).slice(0, 7);

  return (
    <main className={styles.page}>
      <section className={styles.hero} aria-labelledby="industry-detail-title">
        <div className={styles.heroMesh} aria-hidden="true" />
        <div className={styles.heroInner}>
          <motion.div {...reveal} className={styles.heroCopy}>
            <p className={styles.eyebrow}>{presentation.eyebrow}</p>
            <h1 id="industry-detail-title">
              {presentation.heroTitleLead}<br />
              <em>{presentation.heroTitleAccent}</em>
            </h1>
            <p className={styles.heroLead}>{presentation.heroCopy}</p>
            <div className={styles.heroActions}>
              <Link href="/book-demo" className={styles.primaryButton}>Book Demo <Icon name="arrowRight" /></Link>
              <Link href="/contact" className={styles.secondaryButton}>Talk to Our Team <Icon name="arrowRight" /></Link>
            </div>
            {capabilityLabels.length > 0 && (
              <div className={styles.heroCapabilities}>
                {capabilityLabels.slice(0, 3).map((capability) => <span key={capability}><Icon name="checkCircle" />{capability}</span>)}
              </div>
            )}
          </motion.div>

          <div className={styles.heroVisual} aria-hidden="true">
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 18, rotateY: -7 }}
              animate={{ opacity: 1, y: 0, rotateY: -5 }}
              transition={{ duration: reduce ? 0 : .7 }}
              className={styles.desktopFrame}
            >
              <RoadLenzDashboard variant={presentation.slug} />
            </motion.div>
            <motion.img
              src={presentation.vehicleImage}
              alt=""
              className={styles.heroVehicle}
              initial={reduce ? false : { opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: reduce ? 0 : .6, delay: reduce ? 0 : .16 }}
            />
            <div className={styles.phoneCluster}>
              <PhoneMock title="Live Tracking" icon="pin" variant="map" />
              <PhoneMock title="Trip in Progress" icon="route" variant="trip" />
              <PhoneMock title="AI Safety" icon="shield" variant="safety" />
            </div>
          </div>
        </div>
        <p className={styles.heroScript} aria-hidden="true">{presentation.shortLine}</p>
      </section>

      <section id="industry-advantage" className={styles.advantage} aria-labelledby="advantage-title">
        <div className={styles.advantageInner}>
          <motion.div {...reveal} className={styles.advantageCopy}>
            <p className={styles.eyebrow}>The RoadLenz Advantage</p>
            <h2 id="advantage-title">{presentation.advantageTitle}</h2>
            <p>{presentation.advantageCopy}</p>
          </motion.div>
          <div className={styles.advantageItems}>
            {presentation.advantageItems.map((item, index) => (
              <motion.div {...reveal} transition={{ delay: reduce ? 0 : index * .06 }} key={item.title}>
                <span><Icon name={item.icon} /></span>
                <div><strong>{item.title}</strong><p>{item.description}</p></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="industry-platform" className={styles.platform} aria-labelledby="platform-title">
        <motion.div {...reveal} className={styles.sectionHead}>
          <div>
            <p className={styles.eyebrow}>What the platform helps you manage</p>
            <h2 id="platform-title">{presentation.featureSectionTitle}</h2>
          </div>
          <p>{presentation.featureSectionCopy}</p>
        </motion.div>
        <div className={styles.featureGrid}>
          {presentation.featureCards.map((card, index) => (
            <motion.article {...reveal} transition={{ delay: reduce ? 0 : index * .07 }} className={styles.featureCard} key={card.title}>
              <div className={styles.featureTitle}><span><Icon name={card.icon} /></span><div><h3>{card.title}</h3><p>{card.description}</p></div></div>
              <MiniSoftwarePanel type={index} industry={presentation.navName} />
              <Link href="/technology">{card.action} <Icon name="arrowRight" /></Link>
            </motion.article>
          ))}
        </div>
      </section>

      <section id="industry-journey" className={styles.journey} aria-labelledby="journey-title">
        <motion.div {...reveal} className={styles.journeyHead}>
          <p className={styles.eyebrow}>{presentation.journeyEyebrow}</p>
          <h2 id="journey-title">{presentation.journeyTitle}</h2>
        </motion.div>
        <div className={styles.journeyFlow}>
          {presentation.journey.map((step, index) => (
            <motion.div {...reveal} transition={{ delay: reduce ? 0 : index * .08 }} key={step.title} className={styles.journeyStep}>
              <div className={styles.stepIcon}><Icon name={step.icon} /></div>
              <div><span>{String(index + 1).padStart(2, "0")}</span><h3>{step.title}</h3><p>{step.description}</p></div>
              {index < presentation.journey.length - 1 && <i aria-hidden="true" />}
            </motion.div>
          ))}
        </div>
      </section>

      <section id="industry-intelligence" className={styles.intelligence} aria-labelledby="intelligence-title">
        <div className={styles.intelligenceInner}>
          <motion.div {...reveal} className={styles.intelligenceCopy}>
            <p className={styles.eyebrow}>Operational Intelligence</p>
            <h2 id="intelligence-title">{presentation.operationsTitle}</h2>
            <p>{presentation.operationsCopy}</p>
            <div className={styles.operationPoints}>
              {presentation.operationsPoints.map((point) => <div key={point.title}><Icon name={point.icon} /><span><strong>{point.title}</strong><small>{point.description}</small></span></div>)}
            </div>
            <Link href="/technology" className={styles.primaryButton}>Explore All Features <Icon name="arrowRight" /></Link>
          </motion.div>
          <motion.div {...reveal} className={styles.controlRoom}>
            <RoadLenzDashboard variant={presentation.slug} expanded />
          </motion.div>
        </div>
      </section>

      <section id="industry-mobile" className={styles.mobileSection} aria-labelledby="mobile-title">
        <div className={styles.mobileInner}>
          <motion.div {...reveal} className={styles.mobileCopy}>
            <p className={styles.eyebrow}>Mobile first</p>
            <h2 id="mobile-title">{presentation.mobileTitle}</h2>
            <p>{presentation.mobileCopy}</p>
            <div className={styles.mobilePoints}>
              {presentation.mobilePoints.map((point) => <span key={point.title}><Icon name={point.icon} />{point.title}</span>)}
            </div>
          </motion.div>
          <div className={styles.mobileDevices} aria-hidden="true">
            <PhoneMock title="Live Tracking" icon="pin" variant="map" />
            <PhoneMock title="Trip Details" icon="route" variant="trip" />
            <PhoneMock title="Vehicle Health" icon="gauge" variant="health" />
          </div>
          <p className={styles.mobileScript} aria-hidden="true">Full control.<br />In your hands.</p>
        </div>
      </section>

      <section id="industry-why" className={styles.why} aria-labelledby="why-title">
        <motion.div {...reveal} className={styles.whyTitle}>
          <p className={styles.eyebrow}>Why teams choose RoadLenz</p>
          <h2 id="why-title">{presentation.whyTitle}</h2>
        </motion.div>
        <div className={styles.whyGrid}>
          {presentation.why.map((item) => <div key={item.title}><span><Icon name={item.icon} /></span><div><strong>{item.title}</strong><p>{item.description}</p></div></div>)}
        </div>
      </section>

      <section id="industry-cta" className={styles.cta} aria-labelledby="detail-cta-title">
        <img src={presentation.ctaImage} alt="" className={styles.ctaImage} />
        <div className={styles.ctaShade} />
        <div className={styles.ctaInner}>
          <div>
            <p className={styles.eyebrow}>{presentation.ctaEyebrow}</p>
            <h2 id="detail-cta-title">{presentation.ctaTitle}</h2>
            <p>{presentation.ctaCopy}</p>
            <div className={styles.ctaActions}>
              <Link href="/book-demo" className={styles.primaryButton}>Book Demo <Icon name="arrowRight" /></Link>
              <Link href="/contact" className={styles.secondaryButton}>Contact Us</Link>
            </div>
          </div>
          <div className={styles.ctaValues}>
            {(industry.outcomes ?? []).slice(0, 3).map((outcome) => <span key={outcome}><Icon name="checkCircle" />{outcome}</span>)}
            {solution?.name && <small>RoadLenz {solution.name} solution available for this industry.</small>}
          </div>
        </div>
      </section>
    </main>
  );
}

function RoadLenzDashboard({ variant, expanded = false }: { variant: string; expanded?: boolean }) {
  return (
    <div className={`${styles.dashboard} ${expanded ? styles.dashboardExpanded : ""}`}>
      <div className={styles.dashTop}><strong>RoadLenz</strong><span>{expanded ? "Operations Control" : "Live Fleet"}</span><i>● Connected</i></div>
      <div className={styles.dashBody}>
        <aside>{["Dashboard", "Live Fleet", "Video", "Alerts", "Reports", "Groups"].map((item, index) => <span key={item} className={index === 1 ? styles.dashActive : ""}>{item}</span>)}</aside>
        <div className={styles.dashMain}>
          {expanded && <div className={styles.kpiRow}><span><b>Vehicles</b><strong>Online</strong></span><span><b>Trips</b><strong>Active</strong></span><span><b>Alerts</b><strong>Review</strong></span></div>}
          <div className={styles.dashMap} data-variant={variant}>
            <i className={styles.pathOne} /><i className={styles.pathTwo} />
            <b className={`${styles.dashPin} ${styles.dp1}`}><Icon name="car" /></b>
            <b className={`${styles.dashPin} ${styles.dp2}`}><Icon name="pin" /></b>
            <b className={`${styles.dashPin} ${styles.dp3}`}><Icon name="fleet" /></b>
            <div className={styles.vehicleBubble}><strong>Vehicle in view</strong><span>Operational context available</span></div>
          </div>
        </div>
        <div className={styles.dashSide}><small>Recent activity</small><span><i />Vehicle status updated</span><span><i />Route event received</span><span><i />Report ready</span><span><i />Alert reviewed</span></div>
      </div>
    </div>
  );
}

function MiniSoftwarePanel({ type, industry }: { type: number; industry: string }) {
  if (type === 1) {
    return <div className={`${styles.miniPanel} ${styles.videoPanel}`}><div className={styles.miniHeader}>RoadLenz · Live Video</div><div className={styles.videoGrid}><span>Front</span><span>Cabin</span><span>Rear</span><span>Side</span></div></div>;
  }
  if (type === 2) {
    return <div className={`${styles.miniPanel} ${styles.alertPanel}`}><div className={styles.miniHeader}>RoadLenz · Safety</div><div className={styles.alertBox}><Icon name="alert" /><span><strong>Operational alert</strong><small>{industry} context</small></span></div><div className={styles.alertBox}><Icon name="shield" /><span><strong>Safety event</strong><small>Review available data</small></span></div></div>;
  }
  if (type === 3) {
    return <div className={`${styles.miniPanel} ${styles.reportPanel}`}><div className={styles.miniHeader}>RoadLenz · Reports</div><div className={styles.bars}>{[48,72,58,84,67,92,76,88].map((height, index) => <i key={index} style={{ height: `${height}%` }} />)}</div><div className={styles.reportMeta}><span>Trips</span><span>Distance</span><span>Idle</span></div></div>;
  }
  return <div className={`${styles.miniPanel} ${styles.mapPanel}`}><div className={styles.miniHeader}>RoadLenz · Live Fleet</div><i className={styles.mapRoute} /><b className={`${styles.miniPin} ${styles.mp1}`} /><b className={`${styles.miniPin} ${styles.mp2}`} /><b className={`${styles.miniPin} ${styles.mp3}`} /></div>;
}

function PhoneMock({ title, icon, variant }: { title: string; icon: string; variant: "map" | "trip" | "safety" | "health" }) {
  return (
    <div className={styles.phone}>
      <div className={styles.phoneNotch} />
      <div className={styles.phoneHeader}><Icon name={icon} /><strong>{title}</strong></div>
      {variant === "map" && <div className={styles.phoneMap}><i /><b className={styles.phonePin} /><span>Vehicle<br /><strong>On route</strong></span></div>}
      {variant === "trip" && <div className={styles.tripList}><span><i />Pickup<small>Completed</small></span><span><i />In transit<small>Current</small></span><span><i />Destination<small>Next</small></span></div>}
      {variant === "safety" && <div className={styles.safetyList}><span><Icon name="checkCircle" />Normal operation</span><span><Icon name="shield" />Safety context</span><span><Icon name="bell" />Alerts</span></div>}
      {variant === "health" && <div className={styles.healthList}><span>GPS <b>Online</b></span><span>Battery <b>Normal</b></span><span>Ignition <b>On</b></span><span>Fuel <b>Available*</b></span></div>}
    </div>
  );
}
