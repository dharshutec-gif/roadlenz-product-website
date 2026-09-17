"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Industry, Solution } from "@/lib/types";
import { Icon } from "@/components/ui";
import type { IndustryPresentation } from "./industryPresentation";
import useMotionPreference from "./useMotionPreference";
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
  const reduce = useMotionPreference();
  const sectionReveal = reduce ? { initial: false as const } : reveal;
  const capabilityLabels = (industry.capabilities ?? []).slice(0, 7);

  return (
    <div className={styles.page}>
      <section className={styles.hero} aria-labelledby="industry-detail-title">
        <div className={styles.heroMesh} aria-hidden="true" />
        <nav className={styles.breadcrumb} aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><Link href="/industries">Industries</Link><span>/</span><span aria-current="page">{presentation.navName}</span></nav>
        <div className={styles.heroInner}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>RoadLenz for your industry</p>
            <h1 id="industry-detail-title"><DetailHeading text={presentation.navName}/></h1>
            <p className={styles.heroLead}>{presentation.heroCopy}</p>
            <div className={styles.heroActions}>
              <Link href="/book-demo" className={styles.primaryButton}>Book a Demo <Icon name="arrowRight" /></Link>
              <a href="#industry-platform" className={styles.secondaryButton}>Explore Features <Icon name="arrowRight" /></a>
            </div>
            {capabilityLabels.length > 0 && <div className={styles.heroCapabilities}>{capabilityLabels.slice(0,3).map(capability => <span key={capability}><Icon name="checkCircle"/>{capability}</span>)}</div>}
          </div>
          <div className={styles.industryScene}>
            <img className={styles.scenePhoto} src={presentation.sceneImage} alt={presentation.navName + " fleet in its operating environment"} fetchPriority="high"/>
            <div className={styles.sceneCaption}><span><Icon name={presentation.icon}/></span><div><strong>{presentation.shortLine}</strong><small>Connected fleet intelligence</small></div></div>
            <div className={styles.heroDeviceLayout}>
              <figure className={styles.heroDesktop}>
                <div className={styles.heroDesktopScreen}><img src="/media/technology/desktop/tracking.png" alt="RoadLenz desktop live tracking dashboard preview" width={1440} height={900}/></div>
                <div className={styles.heroDesktopBase} aria-hidden="true"/>
                <figcaption>Desktop fleet dashboard</figcaption>
              </figure>
              <div className={styles.heroMobile}><AppScreen name="fleet-map" label="RoadLenz mobile fleet map"/></div>
            </div>
          </div>
        </div>
      </section>

      <section id="industry-advantage" className={styles.advantage} aria-labelledby="advantage-title">
        <div className={styles.advantageInner}>
          <motion.div {...sectionReveal} className={styles.advantageCopy}>
            <p className={styles.eyebrow}>The RoadLenz Advantage</p>
            <h2 id="advantage-title"><DetailHeading text={presentation.advantageTitle}/></h2>
            <p>{presentation.advantageCopy}</p>
          </motion.div>
          <div className={styles.advantageItems}>
            {presentation.advantageItems.map((item, index) => (
              <motion.div {...sectionReveal} transition={{ delay: reduce ? 0 : index * .06 }} key={item.title}>
                <span><Icon name={item.icon} /></span>
                <div><strong>{item.title}</strong><p>{item.description}</p></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="industry-platform" className={styles.platform} aria-labelledby="platform-title">
        <motion.div {...sectionReveal} className={styles.sectionHead}>
          <div>
            <p className={styles.eyebrow}>What the platform helps you manage</p>
            <h2 id="platform-title"><DetailHeading text={presentation.featureSectionTitle}/></h2>
          </div>
          <p>{presentation.featureSectionCopy}</p>
        </motion.div>
        <div className={styles.featureGrid}>
          {presentation.featureCards.map((card, index) => (
            <motion.article {...sectionReveal} transition={{ delay: reduce ? 0 : index * .07 }} className={styles.featureCard} key={card.title}>
              <div className={styles.featureTitle}><span><Icon name={card.icon} /></span><div><h3>{card.title}</h3><p>{card.description}</p></div></div>
              <MiniSoftwarePanel type={index} industry={presentation.navName} />
              <Link href="/technology">{card.action} <Icon name="arrowRight" /></Link>
            </motion.article>
          ))}
        </div>
      </section>

      <section id="industry-journey" className={styles.journey} aria-labelledby="journey-title">
        <motion.div {...sectionReveal} className={styles.journeyHead}>
          <p className={styles.eyebrow}>{presentation.journeyEyebrow}</p>
          <h2 id="journey-title"><DetailHeading text={presentation.journeyTitle}/></h2>
        </motion.div>
        <div className={styles.journeyFlow}>
          {presentation.journey.map((step, index) => (
            <motion.div {...sectionReveal} transition={{ delay: reduce ? 0 : index * .08 }} key={step.title} className={styles.journeyStep}>
              <div className={styles.stepIcon}><Icon name={step.icon} /></div>
              <div><span>{String(index + 1).padStart(2, "0")}</span><h3>{step.title}</h3><p>{step.description}</p></div>
              {index < presentation.journey.length - 1 && <i aria-hidden="true" />}
            </motion.div>
          ))}
        </div>
      </section>

      <section id="industry-intelligence" className={styles.intelligence} aria-labelledby="intelligence-title">
        <div className={styles.intelligenceInner}>
          <motion.div {...sectionReveal} className={styles.intelligenceCopy}>
            <p className={styles.eyebrow}>Operational Intelligence</p>
            <h2 id="intelligence-title"><DetailHeading text={presentation.operationsTitle}/></h2>
            <p>{presentation.operationsCopy}</p>
            <div className={styles.operationPoints}>
              {presentation.operationsPoints.map((point) => <div key={point.title}><Icon name={point.icon} /><span><strong>{point.title}</strong><small>{point.description}</small></span></div>)}
            </div>
            <Link href="/technology" className={styles.primaryButton}>Explore All Features <Icon name="arrowRight" /></Link>
          </motion.div>
          <motion.div {...sectionReveal} className={styles.controlRoom}>
            <div className={styles.operationsScreens}><AppScreen name="overview" label="Fleet overview"/><AppScreen name="vehicle-detail" label="Vehicle information"/></div>
          </motion.div>
        </div>
      </section>

      <section id="industry-mobile" className={styles.mobileSection} aria-labelledby="mobile-title">
        <div className={styles.mobileInner}>
          <motion.div {...sectionReveal} className={styles.mobileCopy}>
            <p className={styles.eyebrow}>Mobile first</p>
            <h2 id="mobile-title"><DetailHeading text={presentation.mobileTitle}/></h2>
            <p>{presentation.mobileCopy}</p>
            <div className={styles.mobilePoints}>
              {presentation.mobilePoints.map((point) => <span key={point.title}><Icon name={point.icon} />{point.title}</span>)}
            </div>
          </motion.div>
          <div className={styles.mobileDevices}>
            <AppScreen name="fleet-map" label="Live tracking"/>
            <AppScreen name="track-history" label="Journey history"/>
            <AppScreen name="vehicle-detail" label="Vehicle details"/>
          </div>
          <p className={styles.mobileScript} aria-hidden="true">Full control.<br />In your hands.</p>
        </div>
      </section>

      <section id="industry-why" className={styles.why} aria-labelledby="why-title">
        <motion.div {...sectionReveal} className={styles.whyTitle}>
          <p className={styles.eyebrow}>Why teams choose RoadLenz</p>
          <h2 id="why-title"><DetailHeading text={presentation.whyTitle}/></h2>
        </motion.div>
        <div className={styles.whyGrid}>
          {presentation.why.map((item) => <div key={item.title}><span><Icon name={item.icon} /></span><div><strong>{item.title}</strong><p>{item.description}</p></div></div>)}
        </div>
      </section>

      <section id="industry-cta" className={styles.cta} aria-labelledby="detail-cta-title">
        <img src={presentation.sceneImage} alt="" className={styles.ctaImage} />
        <div className={styles.ctaShade} />
        <div className={styles.ctaInner}>
          <div>
            <p className={styles.eyebrow}>{presentation.ctaEyebrow}</p>
            <h2 id="detail-cta-title"><DetailHeading text={presentation.ctaTitle}/></h2>
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
    </div>
  );
}

function DetailHeading({ text }: { text: string }) {
  const split = text.lastIndexOf(" ");
  return split < 0 ? <>{text}</> : <>{text.slice(0,split + 1)}<em>{text.slice(split + 1)}</em></>;
}

function AppScreen({ name, label }: { name: string; label: string }) {
  return <figure className={styles.appScreen}><img src={"/media/technology/software/" + name + ".png"} alt={label + " in the RoadLenz app"} width={895} height={2000} loading="lazy"/><figcaption>{label}</figcaption></figure>;
}

function MiniSoftwarePanel({ type, industry }: { type: number; industry: string }) {
  const panels = [
    [["fleet-map", "Fleet map"], ["vehicle-detail", "Vehicle details"]],
    [["live-video", "Camera views"], ["video-map", "Video with location"]],
    [["ai-events", "Safety events"], ["alerts", "Fleet alerts"]],
    [["reports", "Report catalogue"], ["track-history", "Journey history"]],
  ];
  return <div className={styles.actualSoftwarePanel} aria-label={industry + " RoadLenz app screens"}>{(panels[type] ?? panels[0]).map(([name,label]) => <AppScreen key={name} name={name} label={label}/>)}</div>;
}
