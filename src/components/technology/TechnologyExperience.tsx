"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Check, MapPin, Video, ShieldCheck, ChartNoAxesCombined, Radio, Route, Building2, Smartphone } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import styles from "./TechnologyExperience.module.css";

const base = "/media/technology/software/";
type Feature = { id: string; kicker: string; title: string; description: string; points: string[]; images: [string, string]; captions: [string, string]; icon: LucideIcon; link: string; action: string; note: string };
const features: Feature[] = [
  { id: "overview", kicker: "Overview", title: "Complete View", description: "See your fleet’s condition and activity at a glance. One clear starting point for the day ahead.", points: ["Connected, moving, stopped and offline vehicles", "Open alerts in one overview", "Quick access to maps, cameras, history and reports", "Company workspaces within easy reach"], images: ["overview", "workspace"], captions: ["Fleet overview", "Your workspaces"], icon: Radio, link: "/technology/real-time-status", action: "Explore the Platform", note: "Your fleet. One connected view." },
  { id: "live-gps", kicker: "Tracking", title: "Live Tracking", description: "Find your vehicles and follow their movement. Keep location and vehicle information together in one connected view.", points: ["Search and filter your vehicle list", "Live fleet map with vehicle locations", "Speed, ignition and GPS status", "Vehicle, device and camera details"], images: ["fleet-map", "vehicle-detail"], captions: ["Live fleet map", "Vehicle details"], icon: MapPin, link: "/technology/gps-tracking", action: "Explore Tracking", note: "Know where your fleet is." },
  { id: "live-video", kicker: "Video", title: "Live Video", description: "See the road and the cabin through your connected cameras. Bring video and location into the same fleet workflow.", points: ["Multiple camera channels in one view", "Switch between map and video layouts", "Road and cabin camera views", "Vehicle and company selection"], images: ["video-map", "live-video"], captions: ["Video with location", "Multi-camera view"], icon: Video, link: "/technology/live-video", action: "Explore Video", note: "See more. Stay in control." },
  { id: "track-history", kicker: "History", title: "Track History", description: "Look back at a journey with a clear route map and playback controls. Understand where vehicles travelled and how each trip unfolded.", points: ["Interactive route playback", "Vehicle and time-range selection", "Distance, duration and speed context", "Journey timeline and playback speed controls"], images: ["track-history", "vehicles"], captions: ["Journey playback", "Vehicle selection"], icon: Route, link: "/technology/track-history", action: "Explore History", note: "Every journey tells a story." },
  { id: "ai-safety", kicker: "Safety", title: "Smarter Safety", description: "Keep safety events and fleet alerts close at hand. Move from a vehicle to its recorded events, with the context your team needs to respond.", points: ["Dedicated AI Safety workspace", "Vehicle-level recorded safety events", "Event times and open status", "Fleet alerts in a connected workflow"], images: ["ai-events", "alerts"], captions: ["Recorded safety events", "Fleet alerts"], icon: ShieldCheck, link: "/technology/alerts", action: "Explore Safety & Alerts", note: "Safer drivers. A safer tomorrow." },
  { id: "reports", kicker: "Reports", title: "Actionable Reports", description: "Turn daily fleet activity into a clearer operational picture. Find the report you need in one searchable catalogue.", points: ["Trip summary and GPS distance reports", "Ignition idle and stop reports", "Online and offline session details", "Fleet online rate reporting"], images: ["reports", "overview"], captions: ["Report catalogue", "Fleet activity"], icon: ChartNoAxesCombined, link: "/technology/reports", action: "Explore Reports", note: "Clarity for your next decision." },
  { id: "mobile", kicker: "Mobile", title: "Fleet On The Go", description: "Stay connected to your fleet wherever the day takes you. Access your key RoadLenz tools from the mobile app.", points: ["Check fleet status and live locations", "View connected vehicle cameras", "Review journeys and fleet alerts", "Move between your company workspaces"], images: ["overview", "video-map"], captions: ["Your fleet at a glance", "Cameras on the go"], icon: Smartphone, link: "/technology/mobile-access", action: "Ask About Mobile Access", note: "Your fleet, in your hands." },
  { id: "groups", kicker: "Access", title: "Multi-Company", description: "Bring company fleets and their tools together. Switch between workspaces while keeping the right operational context.", points: ["Company selection in a shared platform", "Dedicated workspace modules", "Vehicle lists grouped by company", "Account and access settings"], images: ["companies", "workspace"], captions: ["Company selection", "Workspace modules"], icon: Building2, link: "/technology/multi-fleet", action: "Explore Multi-Company", note: "Many fleets. One platform." },
];

function Phone({ image, caption, priority = false }: { image: string; caption: string; priority?: boolean }) {
  return <figure className={styles.device}>
    <div className={styles.phone}><img src={`${base}${image}.png`} alt={`RoadLenz app: ${caption}`} width={895} height={2000} loading={priority ? "eager" : "lazy"} /></div>
    <figcaption>{caption}</figcaption>
  </figure>;
}

const desktopImages: Record<string, string> = { overview: "overview", "live-gps": "tracking", "live-video": "video", "track-history": "history", "ai-safety": "safety", reports: "reports", mobile: "overview", groups: "companies" };

function Desktop({ image, caption, priority = false }: { image: string; caption: string; priority?: boolean }) {
  return <figure className={styles.laptop}>
    <div className={styles.laptopScreen}><img src={`/media/technology/desktop/${image}.png`} alt={`RoadLenz desktop dashboard mockup: ${caption}`} width={1440} height={900} loading={priority ? "eager" : "lazy"} /></div>
    <div className={styles.laptopBase} aria-hidden="true" />
  </figure>;
}

export default function TechnologyExperience() {
  const reduced = useReducedMotion();
  const reveal = { initial: { opacity: 0, y: reduced ? 0 : 24 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: .15 }, transition: { duration: reduced ? 0 : .65 } };
  return <main className={styles.page}>
    <section className={styles.hero} aria-labelledby="technology-heading">
      <div className={styles.heroInner}>
        <motion.div className={styles.heroCopy} initial={false}>
          <p className={styles.eyebrow}>Connected fleets. Smarter operations.</p>
          <h1 id="technology-heading">Smart <em>Platform</em></h1>
          <p className={styles.heroDescription}>Track your fleet. See every journey.<br />One platform for smarter operations.</p>
          <div className={styles.actions}>
            <a href="#overview" className={styles.primary}>Explore Platform <ArrowRight size={18} /></a>
            <Link href="/book-demo" className={styles.secondary}>Request a Demo <ArrowRight size={18} /></Link>
          </div>
        </motion.div>
        <motion.div className={styles.heroVisual} initial={false}>
          <span className={styles.heroOrbit} aria-hidden="true" />
          <div className={styles.heroDeviceGroup}>
            <Desktop image="overview" caption="Fleet overview" priority />
            <div className={styles.heroPhoneGroup}>
              <Phone image="overview" caption="Fleet overview" priority />
              <Phone image="fleet-map" caption="Live fleet map" priority />
              <Phone image="video-map" caption="Connected cameras" priority />
            </div>
          </div>
        </motion.div>
      </div>
    </section>

    {features.map((feature, index) => <section id={feature.id} key={feature.id} className={`${styles.feature} ${index % 2 === 0 ? styles.tinted : ""}`} aria-labelledby={`${feature.id}-heading`}>
      <div className={`${styles.sectionInner} ${index % 2 === 0 ? styles.visualFirst : ""}`}>
        <motion.div className={styles.copy} {...reveal}>
          <p className={styles.eyebrow}>{feature.kicker}</p>
          <h2 id={`${feature.id}-heading`}>{feature.title}</h2>
          <p className={styles.description}>{feature.description}</p>
          <ul>{feature.points.map((point, pointIndex) => <motion.li key={point}
            initial={{ opacity: 0, x: reduced ? 0 : -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: .5 }}
            transition={{ duration: reduced ? 0 : .4, delay: reduced ? 0 : pointIndex * .07 }}>
            <span><Check size={13} strokeWidth={3} /></span>{point}
          </motion.li>)}</ul>
          <Link href={feature.link} className={styles.textLink}>{feature.action} <ArrowRight size={18} /></Link>
        </motion.div>
        <motion.div className={styles.visual} {...reveal}>
          <div className={styles.halo} aria-hidden="true" />
          <div className={styles.desktopMobile}><Desktop image={desktopImages[feature.id]} caption={feature.title} /><Phone image={feature.images[0]} caption={feature.captions[0]} /></div>
          <div className={styles.featureNote}><span><feature.icon size={23} /></span><p>{feature.note}</p></div>
        </motion.div>
      </div>
    </section>)}

    <section className={styles.cta} aria-labelledby="technology-cta-heading">
      <div className={styles.ctaInner}>
        <p className={styles.eyebrow}>Your next journey starts here</p>
        <h2 id="technology-cta-heading">Ready to Experience More?</h2>
        <p>See how RoadLenz can simplify your operations and bring your fleet into one connected view.</p>
        <div className={styles.actions}><Link href="/book-demo" className={styles.primary}>Request a Demo <ArrowRight size={18} /></Link><Link href="/contact" className={styles.secondary}>Contact Our Team <ArrowRight size={18} /></Link></div>
      </div>
    </section>
  </main>;
}
