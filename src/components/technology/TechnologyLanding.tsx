"use client";

import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import type { MouseEvent } from "react";
import { technologyMedia } from "./TechnologyMedia";
import styles from "./TechnologyLanding.module.css";

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
  | "alert"
  | "connect"
  | "capture"
  | "understand"
  | "act";

function Icon({ name }: { name: IconName }) {
  const p = {
    width: 20,
    height: 20,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  if (name === "pin") return <svg {...p}><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.4"/></svg>;
  if (name === "video") return <svg {...p}><rect x="3" y="6" width="13" height="12" rx="2"/><path d="m16 10 5-3v10l-5-3Z"/></svg>;
  if (name === "fuel") return <svg {...p}><path d="M5 21V4h9v17M5 9h9M14 8h2l3 3v7a2 2 0 0 0 2 2"/><path d="M8 13h3"/></svg>;
  if (name === "clock") return <svg {...p}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>;
  if (name === "report") return <svg {...p}><path d="M6 3h9l3 3v15H6z"/><path d="M9 11h6M9 15h6M9 7h3"/></svg>;
  if (name === "analytics") return <svg {...p}><path d="M4 20V11M10 20V5M16 20v-8M22 20V8"/></svg>;
  if (name === "record") return <svg {...p}><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="12" cy="12" r="3"/></svg>;
  if (name === "fleet") return <svg {...p}><rect x="3" y="7" width="14" height="9" rx="2"/><path d="M17 10h2l2 3v3h-4"/><circle cx="7" cy="18" r="1.5"/><circle cx="17" cy="18" r="1.5"/></svg>;
  if (name === "alert") return <svg {...p}><path d="M18 8a6 6 0 1 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/></svg>;
  if (name === "connect") return <svg {...p}><path d="M7 12a5 5 0 0 1 5-5h2M17 12a5 5 0 0 1-5 5h-2"/><path d="m14 5 2 2-2 2M10 15l-2 2 2 2"/></svg>;
  if (name === "capture") return <svg {...p}><path d="M12 3v13M7 11l5 5 5-5"/><rect x="4" y="18" width="16" height="3" rx="1.5"/></svg>;
  if (name === "understand") return <svg {...p}><path d="M4 18h16M6 15l4-5 3 3 5-7"/><circle cx="18" cy="6" r="1.5"/></svg>;
  return <svg {...p}><path d="m13 2-8 12h7l-1 8 8-12h-7Z"/></svg>;
}

const navigationItems: [IconName, string, string][] = [
  ["pin", "GPS Tracking", "/technology/gps-tracking"],
  ["video", "Live Video", "/technology/live-video"],
  ["fuel", "Fuel Monitoring", "/technology/fuel-monitoring"],
  ["clock", "Real-Time Status", "/technology/real-time-status"],
  ["report", "Reports", "/technology/reports"],
  ["analytics", "Analytics", "/technology/analytics"],
  ["record", "Recordings", "/technology/recordings"],
  ["fleet", "Multi-Fleet", "/technology/multi-fleet"],
  ["alert", "Alerts", "/technology/alerts"],
];

const capabilityCards = [
  ["pin", "Live Tracking", "See every vehicle in real time, understand movement status and open the right vehicle context immediately.", technologyMedia.liveFleetDesktop, "/technology/gps-tracking", "blue"],
  ["video", "AI Video & Telematics", "Connect road and cabin video with vehicle data, AI safety and fleet operations in one view.", technologyMedia.aiSafetyDesktop, "/technology/live-video", "violet"],
  ["analytics", "Reports & Analytics", "Turn trips, distance, idle activity, stops and connectivity into clear operational insight.", technologyMedia.overviewDesktop, "/technology/reports", "green"],
  ["fleet", "Fleet Operations", "Bring vehicles, tracking, alarms, video, recordings, reports and AI safety into one connected workspace.", technologyMedia.overviewDesktop, "/technology/multi-fleet", "orange"],
] as const;

const industries = [
  ["Employee Transport", technologyMedia.employee],
  ["School Transport", technologyMedia.school],
  ["Public Transport", technologyMedia.publicTransport],
  ["Trucking & Logistics", technologyMedia.logistics],
  ["Mining", technologyMedia.mining],
  ["Agriculture", technologyMedia.agriculture],
  ["Cab & Taxi", technologyMedia.taxi],
] as const;

function DeviceStage() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 80, damping: 20 });
  const sy = useSpring(y, { stiffness: 80, damping: 20 });
  const rotateY = useTransform(sx, [-0.5, 0.5], [-4, 4]);
  const rotateX = useTransform(sy, [-0.5, 0.5], [3, -3]);

  function handleMove(event: MouseEvent<HTMLDivElement>) {
    const r = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - r.left) / r.width - 0.5);
    y.set((event.clientY - r.top) / r.height - 0.5);
  }

  function reset() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      className={styles.heroStage}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={{ rotateX, rotateY }}
      initial={{ opacity: 0, y: 24, scale: .97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: .9, delay: .08, ease }}
    >
      <div className={styles.deviceHalo} />

      <motion.div
        className={styles.heroLaptop}
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 6.1, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className={styles.browserBar}>
          <div><i/><i/><i/></div>
          <span>RoadLenz Intelligence</span>
        </div>
        <img src={technologyMedia.overviewDesktop} alt="RoadLenz desktop fleet overview" />
      </motion.div>

      <motion.div
        className={`${styles.heroPhone} ${styles.heroPhoneOne}`}
        animate={{ y: [0, -7, 0] }}
        transition={{ duration: 5.6, repeat: Infinity, ease: "easeInOut" }}
      >
        <img src={technologyMedia.heroLeft} alt="RoadLenz mobile fleet overview" />
      </motion.div>

      <motion.div
        className={`${styles.heroPhone} ${styles.heroPhoneTwo}`}
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 5.1, repeat: Infinity, ease: "easeInOut" }}
      >
        <img src={technologyMedia.heroCenter} alt="RoadLenz mobile live tracking" />
      </motion.div>

      <motion.div
        className={`${styles.heroPhone} ${styles.heroPhoneThree}`}
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <img src={technologyMedia.heroRight} alt="RoadLenz mobile software" />
      </motion.div>

      <motion.div className={`${styles.floatPill} ${styles.floatPillBlue}`} animate={{ y: [0,-5,0] }} transition={{ duration: 4.2, repeat: Infinity }}>
        <Icon name="pin" /><span><strong>Live Tracking</strong><small>Real-time visibility</small></span>
      </motion.div>

      <motion.div className={`${styles.floatPill} ${styles.floatPillRed}`} animate={{ y: [0,6,0] }} transition={{ duration: 4.8, repeat: Infinity }}>
        <Icon name="alert" /><span><strong>Real-Time Alerts</strong><small>Instant notifications</small></span>
      </motion.div>
    </motion.div>
  );
}

const heroEase = [0.16, 1, 0.3, 1] as const;

type HeroIconName =
  | "pin"
  | "video"
  | "fuel"
  | "clock"
  | "report"
  | "analytics"
  | "record"
  | "fleet"
  | "alert";

function HeroIcon({ name }: { name: HeroIconName }) {
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

function TechnologyHero() {
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
              transition={{ duration: 0.72, heroEase }}
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
              transition={{ duration: 0.95, delay: 0.08, heroEase }}
            >
              <div className={styles.deviceGlow} />

              <motion.div
                className={styles.laptop}
                animate={{ y: [0, -7, 0] }}
                transition={{ duration: 6.2, repeat: Infinity, heroEase: "easeInOut" }}
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
                transition={{ duration: 5.6, repeat: Infinity, heroEase: "easeInOut" }}
              >
                <img src={technologyMedia.heroLeft} alt="RoadLenz fleet mobile screen" />
              </motion.div>

              <motion.div
                className={`${styles.phone} ${styles.phoneCenter}`}
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 5.0, repeat: Infinity, heroEase: "easeInOut" }}
              >
                <img src={technologyMedia.heroCenter} alt="RoadLenz live tracking mobile" />
              </motion.div>

              <motion.div
                className={`${styles.phone} ${styles.phoneRight}`}
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 6.1, repeat: Infinity, heroEase: "easeInOut" }}
              >
                <img src={technologyMedia.heroRight} alt="RoadLenz live video mobile" />
              </motion.div>

              <motion.div
                className={`${styles.floatingCard} ${styles.trackingCard}`}
                animate={{ y: [0, -7, 0] }}
                transition={{ duration: 4.4, repeat: Infinity, heroEase: "easeInOut" }}
              >
                <span className={styles.blueIcon}><HeroIcon name="pin" /></span>
                <div>
                  <strong>Live Tracking</strong>
                  <small>2,000+ Vehicles</small>
                </div>
              </motion.div>

              <motion.div
                className={`${styles.floatingCard} ${styles.alertCard}`}
                animate={{ y: [0, 7, 0] }}
                transition={{ duration: 5.1, repeat: Infinity, heroEase: "easeInOut" }}
              >
                <span className={styles.redIcon}><HeroIcon name="alert" /></span>
                <div>
                  <strong>Real-Time Alerts</strong>
                  <small>Instant Notifications</small>
                </div>
              </motion.div>

              <motion.div
                className={`${styles.floatingCard} ${styles.monitorCard}`}
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 5.5, repeat: Infinity, heroEase: "easeInOut" }}
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
                <span><HeroIcon name={icon} /></span>
                <strong>{label}</strong>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}


export default function TechnologyLanding() {
  return (
    <main className={styles.page}>
      <TechnologyHero />

{/* PLATFORM */}
      <section id="platform" className={styles.platformSection}>
        <div className={styles.shell}>
          <div className={styles.platformGrid}>
            <motion.div className={styles.sectionCopy} initial={{opacity:0,x:-20}} whileInView={{opacity:1,x:0}} viewport={{once:true,amount:.25}}>
              <span className={styles.eyebrow}>THE ROADLENZ PLATFORM</span>
              <h2>One platform.<br/><em>Complete visibility.</em></h2>
              <p>RoadLenz connects vehicle location, live video, fleet activity, safety events and operational reporting into one unified fleet management experience.</p>
              <Link href="/technology/multi-fleet" className={styles.textLink}>See how the platform works <span>→</span></Link>
            </motion.div>

            <motion.div className={styles.platformVisual} initial={{opacity:0,y:24}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.2}}>
              <div className={styles.platformGlow}/>
              <div className={styles.platformFrame}>
                <div className={styles.browserBar}><div><i/><i/><i/></div><span>RoadLenz Fleet Overview</span></div>
                <img src={technologyMedia.overviewDesktop} alt="RoadLenz platform dashboard"/>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CORE CAPABILITIES */}
      <section className={styles.capabilitiesSection}>
        <div className={styles.shell}>
          <div className={styles.sectionHeading}>
            <div><span className={styles.eyebrow}>CORE CAPABILITIES</span><h2>Technology that works together.</h2></div>
            <p>Four connected capabilities. One RoadLenz platform. Everything your team needs for a safer, more efficient fleet.</p>
          </div>

          <div className={styles.capabilityGrid}>
            {capabilityCards.map(([icon,title,copy,image,href,tone],i)=>(
              <motion.article key={title} className={`${styles.capabilityCard} ${styles[`tone_${tone}`]}`} initial={{opacity:0,y:18}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.2}} transition={{delay:i*.05}} whileHover={{y:-6}}>
                <div className={styles.capabilityTop}><span className={styles.capIcon}><Icon name={icon as IconName}/></span><small>0{i+1}</small></div>
                <h3>{title}</h3>
                <p>{copy}</p>
                <div className={styles.capabilityVisual}><img src={image} alt={title}/></div>
                <Link href={href}>Explore {title} <span>→</span></Link>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* FLOW */}
      <section className={styles.flowSection}>
        <div className={styles.shell}>
          <div className={styles.sectionHeading}>
            <div><span className={styles.eyebrow}>HOW ROADLENZ WORKS</span><h2>From vehicle data to fleet action.</h2></div>
            <p>A connected operating flow turns real-time vehicle data into clear context and faster fleet decisions.</p>
          </div>

          <div className={styles.flowGrid}>
            {[
              ["connect","01","Connect","Vehicle devices connect to the RoadLenz environment."],
              ["capture","02","Capture","Location, movement, video and fleet events are collected."],
              ["understand","03","Understand","RoadLenz brings the operating context together."],
              ["act","04","Act","Teams respond using live and historical fleet intelligence."],
            ].map(([icon,n,t,c],i)=>(
              <motion.article className={styles.flowCard} key={n} initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.3}} transition={{delay:i*.08}}>
                <span className={styles.flowIcon}><Icon name={icon as IconName}/></span>
                <div><small>{n}</small><h3>{t}</h3><p>{c}</p></div>
                {i<3 && <span className={styles.flowArrow}>→</span>}
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* INDUSTRIES */}
      <section className={styles.industriesSection}>
        <div className={styles.shell}>
          <div className={styles.sectionHeading}>
            <div><span className={styles.eyebrow}>BUILT FOR EVERY INDUSTRY</span><h2>Different fleets. One platform.</h2></div>
            <p>The vehicle and operating model may change. RoadLenz keeps tracking, video, safety and fleet intelligence connected.</p>
          </div>

          <div className={styles.industryGrid}>
            {industries.map(([name,image],i)=>(
              <motion.div className={styles.industryItem} key={name} initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.2}} transition={{delay:i*.04}} whileHover={{y:-6}}>
                <span>{String(i+1).padStart(2,"0")}</span>
                <div className={styles.industryImage}><img src={image} alt={name}/></div>
                <strong>{name}</strong>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* WHITE LABEL FIRST */}
      <section className={styles.whiteLabelSection}>
        <div className={styles.shell}>
          <div className={styles.whiteLabelGrid}>
            <motion.div className={styles.whiteLabelCopy} initial={{opacity:0,x:-20}} whileInView={{opacity:1,x:0}} viewport={{once:true,amount:.2}}>
              <span className={styles.eyebrow}>ROADLENZ WHITE LABEL</span>
              <h2>Your brand. <em>Powered by RoadLenz.</em></h2>
              <p>Launch a branded fleet software experience with your identity, selected modules, company structure and deployment requirements.</p>

              <div className={styles.checkGrid}>
                <span>Custom branding</span>
                <span>Custom domain</span>
                <span>Fleet software modules</span>
                <span>User & company structure</span>
              </div>

              <div className={styles.whiteLabelActions}>
                <Link href="/contact" className={styles.primaryButton}>Send Enquiry <span>→</span></Link>
                <Link href="/book-demo" className={styles.secondaryLight}>Book a Demo</Link>
                <Link href="/contact" className={styles.secondaryLight}>Contact Us</Link>
              </div>
            </motion.div>

            <motion.div className={styles.whiteLabelVisual} initial={{opacity:0,y:22}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.2}}>
              <div className={styles.whiteLabelGlow}/>
              <div className={styles.brandLaptop}>
                <div className={styles.browserBar}><div><i/><i/><i/></div><span>Your Brand Fleet Platform</span></div>
                <div className={styles.brandLaptopBody}>
                  <span>YOUR BRAND</span>
                  <small>Powered by RoadLenz</small>
                  <img src={technologyMedia.overviewDesktop} alt="White label RoadLenz platform"/>
                </div>
              </div>
              <div className={styles.brandPhone}>YOUR<br/><strong>BRAND</strong></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* MOBILE */}
      <section className={styles.mobileSection}>
        <div className={styles.shell}>
          <div className={styles.mobileGrid}>
            <motion.div className={styles.mobileCopy} initial={{opacity:0,x:-20}} whileInView={{opacity:1,x:0}} viewport={{once:true,amount:.2}}>
              <span className={styles.eyebrow}>ROADLENZ ON THE MOVE</span>
              <h2>Your fleet goes with you.</h2>
              <p>Access fleet overview, live tracking, vehicle context, cameras, alerts, AI safety and reports from the RoadLenz mobile experience.</p>
              <div className={styles.mobileBullets}>
                <span>Live fleet overview</span><span>Real-time video</span><span>AI safety alerts</span><span>On-the-go reporting</span>
              </div>
            </motion.div>

            <motion.div className={styles.mobileStage} initial={{opacity:0,y:22}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.2}}>
              <div className={styles.mobileGlow}/>
              {[technologyMedia.overviewMobile, technologyMedia.liveFleetMobile, technologyMedia.mobile].map((src,i)=>(
                <motion.div key={src} className={`${styles.mobilePhone} ${styles[`mobile_${i+1}`]}`} animate={{y:[0,-6-i*2,0]}} transition={{duration:5+i*.4,repeat:Infinity,ease:"easeInOut"}}>
                  <img src={src} alt={`RoadLenz mobile screen ${i+1}`}/>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.finalCta} style={{backgroundImage:`linear-gradient(90deg,rgba(1,15,27,.96),rgba(3,24,37,.52)),url("${technologyMedia.roadScene}")`}}>
        <div className={styles.shell}>
          <div className={styles.finalGrid}>
            <div><span className={styles.ctaEyebrow}>ROADLENZ TECHNOLOGY</span><h2>Ready to connect your fleet?</h2><p>Bring tracking, video, safety and fleet intelligence together with RoadLenz.</p></div>
            <div className={styles.finalActions}><Link href="/book-demo" className={styles.finalPrimary}>Request a Demo <span>→</span></Link><Link href="/contact" className={styles.finalSecondary}>Contact Our Team</Link></div>
          </div>
        </div>
      </section>
    </main>
  );
}