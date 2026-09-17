"use client";

import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import type { MouseEvent, ReactNode } from "react";
import { Icon } from "@/components/ui";
import styles from "./TechnologyExperience.module.css";

const EASE = [0.16, 1, 0.3, 1] as const;

const media = {
  heroBg: "/media/technology/hero/road-bg.jpg",
  ctaBg: "/media/technology/hero/roadlenz-cta-map.jpg",
  overviewDesktop: "/media/technology/software/overview-desktop.png",
  overviewMobile: "/media/technology/software/overview-mobile.png",
  liveFleetMobile: "/media/technology/software/live-fleet-mobile.png",
  mobile: "/media/technology/software/mobile.png",
  fleetMap: "/media/technology/software/fleet-map.png",
  vehicleDetail: "/media/technology/software/vehicle-detail.png",
  vehiclesList: "/media/technology/software/vehicles-list.png",
  liveVideo: "/media/technology/software/live-video.png",
  driverCamera: "/media/technology/software/driver-camera.png",
  roadCamera: "/media/technology/software/road-camera.png",
  trackHistory: "/media/technology/software/track-history.png",
  alerts: "/media/technology/software/alerts.png",
  workspaceList: "/media/technology/software/workspace-list.png",
  workspaceModules: "/media/technology/software/workspace-modules.png",
  aiSafetyList: "/media/technology/software/ai-safety-list.png",
  aiSafetyEvents: "/media/technology/software/ai-safety-events.png",
  reports: "/media/technology/software/reports.png",
};

const navItems = [
  { id: "live-gps", label: "Live GPS Tracking", icon: "pin" },
  { id: "live-video", label: "Live Camera", icon: "video" },
  { id: "track-history", label: "Track History", icon: "map" },
  { id: "vehicle-details", label: "Locate Vehicle", icon: "gps" },
  { id: "alerts", label: "Alerts & Notifications", icon: "alert" },
  { id: "recordings", label: "Recordings & Playback", icon: "play" },
  { id: "ai-safety", label: "AI Safety", icon: "brain" },
  { id: "fuel", label: "Fuel Monitoring", icon: "fuel" },
  { id: "reports", label: "Reports & Analytics", icon: "doc" },
  { id: "groups", label: "Multi-Fleet Management", icon: "users" },
] as const;

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.22 },
  transition: { duration: 0.7, ease: EASE },
};

function CheckList({ items, light = false }: { items: string[]; light?: boolean }) {
  return (
    <ul className={`${styles.checkList} ${light ? styles.checkListLight : ""}`}>
      {items.map((item) => (
        <li key={item}>
          <span className={styles.checkIcon}><Icon name="check" className="h-3.5 w-3.5" /></span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function SectionHeading({
  kicker,
  title,
  italic,
  description,
  light = false,
}: {
  kicker: string;
  title: string;
  italic?: string;
  description: string;
  light?: boolean;
}) {
  return (
    <div className={`${styles.sectionHeading} ${light ? styles.sectionHeadingLight : ""}`}>
      <span className={styles.kicker}>{kicker}</span>
      <h2>
        {title} {italic ? <em>{italic}</em> : null}
      </h2>
      <p>{description}</p>
    </div>
  );
}

function BrowserFrame({ children, dark = false, label = "RoadLenz Intelligence" }: { children: ReactNode; dark?: boolean; label?: string }) {
  return (
    <div className={`${styles.browserFrame} ${dark ? styles.browserFrameDark : ""}`}>
      <div className={styles.browserBar}>
        <div className={styles.browserDots}><i /><i /><i /></div>
        <span>{label}</span>
        <small>LIVE</small>
      </div>
      <div className={styles.browserBody}>{children}</div>
    </div>
  );
}

function PhoneFrame({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  return (
    <div className={`${styles.phoneFrame} ${className}`}>
      <div className={styles.phoneSpeaker} />
      <img src={src} alt={alt} />
    </div>
  );
}

function HeroDeviceStage() {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 90, damping: 22 });
  const sy = useSpring(my, { stiffness: 90, damping: 22 });
  const rotateY = useTransform(sx, [-0.5, 0.5], [-5, 5]);
  const rotateX = useTransform(sy, [-0.5, 0.5], [4, -4]);
  const shiftX = useTransform(sx, [-0.5, 0.5], [-9, 9]);

  const handleMove = (event: MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    mx.set((event.clientX - rect.left) / rect.width - 0.5);
    my.set((event.clientY - rect.top) / rect.height - 0.5);
  };

  const reset = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <motion.div
      className={styles.heroStage}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={{ rotateX, rotateY, x: shiftX }}
      initial={{ opacity: 0, y: 26, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.95, delay: 0.08, ease: EASE }}
    >
      <div className={styles.heroDeviceGlow} />

      <motion.div
        className={styles.heroDesktop}
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <BrowserFrame dark>
          <img src={media.overviewDesktop} alt="RoadLenz fleet overview desktop" />
        </BrowserFrame>
      </motion.div>

      <motion.div className={styles.heroPhoneOne} animate={{ y: [0, -7, 0] }} transition={{ duration: 5.4, repeat: Infinity, ease: "easeInOut" }}>
        <PhoneFrame src={media.overviewMobile} alt="RoadLenz mobile overview" />
      </motion.div>
      <motion.div className={styles.heroPhoneTwo} animate={{ y: [0, -11, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}>
        <PhoneFrame src={media.liveFleetMobile} alt="RoadLenz live fleet mobile" />
      </motion.div>
      <motion.div className={styles.heroPhoneThree} animate={{ y: [0, -6, 0] }} transition={{ duration: 6.1, repeat: Infinity, ease: "easeInOut" }}>
        <PhoneFrame src={media.mobile} alt="RoadLenz live video mobile" />
      </motion.div>

      <motion.div className={`${styles.heroFloatCard} ${styles.heroFloatTracking}`} animate={{ y: [0, -5, 0] }} transition={{ duration: 4.4, repeat: Infinity, ease: "easeInOut" }}>
        <span className={styles.heroFloatIcon}><Icon name="pin" className="h-[18px] w-[18px]" /></span>
        <div><strong>Live Tracking</strong><small>Connected fleet visibility</small></div>
      </motion.div>

      <motion.div className={`${styles.heroFloatCard} ${styles.heroFloatAlerts}`} animate={{ y: [0, 6, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}>
        <span className={`${styles.heroFloatIcon} ${styles.heroFloatIconRed}`}><Icon name="alert" className="h-[18px] w-[18px]" /></span>
        <div><strong>Real-Time Alerts</strong><small>Events that need attention</small></div>
      </motion.div>
    </motion.div>
  );
}

export default function TechnologyExperience() {
  return (
    <main className={styles.page}>
      <section className={styles.hero} style={{ backgroundImage: `url(${media.heroBg})` }}>
        <div className={styles.heroOverlay} />
        <div className={styles.heroGlow} />
        <div className="shell">
          <div className={styles.heroGrid}>
            <motion.div className={styles.heroCopy} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75, ease: EASE }}>
              <span className={styles.heroKicker}>FLEET INTELLIGENCE PLATFORM</span>
              <h1>Your fleet.<br />One <em>intelligent</em> view.</h1>
              <p>
                Track, watch, analyse and manage your fleet in real time. RoadLenz brings GPS tracking,
                live video, AI safety, fuel monitoring, reports and multi-company operations into one software platform.
              </p>
              <div className={styles.heroActions}>
                <a href="#live-gps" className={styles.heroPrimary}>Explore Platform <Icon name="arrowRight" className="h-4 w-4" /></a>
                <Link href="/book-demo" className={styles.heroSecondary}>Request a Demo</Link>
              </div>
              <div className={styles.heroStats}>
                <div><Icon name="fleet" className="h-6 w-6" /><strong>2,000+</strong><span>Vehicles Connected</span></div>
                <div><Icon name="shield" className="h-6 w-6" /><strong>10+</strong><span>Years of Experience</span></div>
                <div><Icon name="headset" className="h-6 w-6" /><strong>24/7</strong><span>Customer Support</span></div>
                <div><Icon name="globe" className="h-6 w-6" /><strong>Pan India</strong><span>Operations</span></div>
              </div>
            </motion.div>
            <HeroDeviceStage />
          </div>
        </div>
      </section>

      <section className={styles.capabilityNav} aria-label="RoadLenz technology capabilities">
        <div className="shell">
          <div className={styles.capabilityGrid}>
            {navItems.map((item, index) => (
              <motion.a
                key={item.id}
                href={`#${item.id}`}
                className={styles.capabilityItem}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.14 + index * 0.035 }}
              >
                <span><Icon name={item.icon} className="h-[20px] w-[20px]" /></span>
                <strong>{item.label}</strong>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      <section id="live-gps" className={`${styles.featureSection} ${styles.lightSection}`}>
        <div className="shell">
          <div className={styles.twoColumn}>
            <motion.div className={styles.copyColumn} {...fadeUp}>
              <SectionHeading
                kicker="LIVE GPS TRACKING"
                title="Real-time tracking."
                italic="Total control."
                description="See the live position and operating status of connected vehicles, then move directly into the vehicle details your team needs."
              />
              <CheckList items={[
                "Live fleet map with moving, stopped and offline status",
                "Vehicle speed, last update and current location",
                "Company-wise vehicle visibility and fleet grouping",
                "Locate, recenter and map controls",
                "Live traffic view and latest GPS position",
              ]} />
            </motion.div>
            <motion.div className={styles.visualColumn} {...fadeUp}>
              <div className={styles.softGlow} />
              <BrowserFrame>
                <img src={media.fleetMap} alt="RoadLenz live GPS fleet map" />
              </BrowserFrame>
              <motion.div className={`${styles.floatingScreen} ${styles.vehicleDetailFloat}`} animate={{ y: [0, -6, 0] }} transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}>
                <img src={media.vehicleDetail} alt="RoadLenz vehicle details" />
              </motion.div>
              <div className={styles.metricRow}>
                <div><i className={styles.dotGreen} /><strong>Moving</strong><span>Live vehicle state</span></div>
                <div><i className={styles.dotAmber} /><strong>Stopped</strong><span>Operational status</span></div>
                <div><i className={styles.dotRed} /><strong>Offline</strong><span>Needs attention</span></div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section id="live-video" className={`${styles.featureSection} ${styles.darkSection}`}>
        <div className="shell">
          <div className={`${styles.twoColumn} ${styles.reverseVisual}`}>
            <motion.div className={styles.copyColumn} {...fadeUp}>
              <SectionHeading
                kicker="LIVE CAMERA"
                title="See more."
                italic="Stay in control."
                description="Open the connected vehicle camera workspace and watch multiple channels without leaving the RoadLenz fleet environment."
                light
              />
              <CheckList light items={[
                "Live video streaming from connected cameras",
                "Multi-channel front, cabin and road views",
                "Vehicle and company context beside the camera feed",
                "Camera channel selection and live status",
                "Visual evidence for safer fleet operations",
              ]} />
            </motion.div>
            <motion.div className={styles.visualColumn} {...fadeUp}>
              <div className={styles.darkGlow} />
              <BrowserFrame dark label="RoadLenz Live Video">
                <img src={media.liveVideo} alt="RoadLenz live video cameras" />
              </BrowserFrame>
              <motion.div className={`${styles.floatingScreen} ${styles.cameraFloat}`} animate={{ y: [0, -5, 0] }} transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut" }}>
                <img src={media.driverCamera} alt="RoadLenz driver camera view" />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      <section id="track-history" className={`${styles.featureSection} ${styles.lightSection}`}>
        <div className="shell">
          <div className={styles.twoColumn}>
            <motion.div className={styles.copyColumn} {...fadeUp}>
              <SectionHeading
                kicker="TRACK HISTORY"
                title="Replay every"
                italic="journey."
                description="Review a previous journey on the map and understand where the vehicle travelled, how long the trip took and the route it followed."
              />
              <CheckList items={[
                "Historical route playback on map",
                "Trip distance and duration",
                "Maximum speed and route context",
                "Journey timeline and playback controls",
                "Useful historical evidence for fleet review",
              ]} />
            </motion.div>
            <motion.div className={styles.visualColumn} {...fadeUp}>
              <div className={styles.routeGlow} />
              <div className={styles.mapStage}>
                <img src={media.trackHistory} alt="RoadLenz track history route" />
                <svg className={styles.routeAccent} viewBox="0 0 500 220" aria-hidden="true">
                  <path d="M40 178 C120 150 110 84 196 108 S310 48 456 60" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeDasharray="14 12" />
                </svg>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section id="vehicle-details" className={`${styles.featureSection} ${styles.softBlueSection}`}>
        <div className="shell">
          <div className={`${styles.twoColumn} ${styles.reverseVisual}`}>
            <motion.div className={styles.copyColumn} {...fadeUp}>
              <SectionHeading
                kicker="LOCATE & VEHICLE DETAILS"
                title="One vehicle."
                italic="Complete context."
                description="Open a vehicle to understand its current state, GPS position, assigned company and available RoadLenz actions from one focused view."
              />
              <CheckList items={[
                "Locate a selected vehicle from the fleet",
                "Current movement and GPS information",
                "Vehicle identity and device details",
                "Quick access to live cameras, history, alerts and fuel",
                "Company and fleet assignment context",
              ]} />
            </motion.div>
            <motion.div className={styles.visualColumn} {...fadeUp}>
              <div className={styles.softGlow} />
              <div className={styles.portraitStage}>
                <img src={media.vehicleDetail} alt="RoadLenz vehicle detail screen" />
              </div>
              <motion.div className={`${styles.floatingScreen} ${styles.vehicleListFloat}`} animate={{ y: [0, -6, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}>
                <img src={media.vehiclesList} alt="RoadLenz vehicle list" />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      <section id="alerts" className={`${styles.featureSection} ${styles.darkSection}`}>
        <div className="shell">
          <div className={styles.twoColumn}>
            <motion.div className={styles.copyColumn} {...fadeUp}>
              <SectionHeading
                kicker="ALERTS & NOTIFICATIONS"
                title="Stay informed."
                italic="Act faster."
                description="Surface the fleet events that need attention and keep the affected vehicle close to the operator’s next action."
                light
              />
              <CheckList light items={[
                "SOS and device-offline alerts",
                "Open-event visibility for the fleet team",
                "Vehicle-level alert context",
                "Fast movement from alert to investigation",
                "Operational warning and critical-event visibility",
              ]} />
            </motion.div>
            <motion.div className={styles.visualColumn} {...fadeUp}>
              <div className={styles.alertHalo} />
              <div className={styles.portraitStageDark}>
                <img src={media.alerts} alt="RoadLenz alerts screen" />
              </div>
              <motion.div className={styles.alertPulseCard} animate={{ scale: [1, 1.03, 1] }} transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}>
                <span><Icon name="alert" className="h-6 w-6" /></span>
                <div><strong>Real-time alerts</strong><small>Keep critical events visible</small></div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      <section id="recordings" className={`${styles.featureSection} ${styles.lightSection}`}>
        <div className="shell">
          <div className={`${styles.twoColumn} ${styles.reverseVisual}`}>
            <motion.div className={styles.copyColumn} {...fadeUp}>
              <SectionHeading
                kicker="RECORDINGS & PLAYBACK"
                title="Find the right"
                italic="video."
                description="Use the RoadLenz recording workspace to move from live monitoring into historical video evidence when an event needs review."
              />
              <CheckList items={[
                "Dedicated recordings workspace",
                "Vehicle and company selection",
                "Recorded-video access from the same platform",
                "Supports incident and journey review",
                "Keeps video evidence connected to fleet context",
              ]} />
            </motion.div>
            <motion.div className={styles.visualColumn} {...fadeUp}>
              <div className={styles.softGlow} />
              <div className={styles.workspaceStage}>
                <img src={media.workspaceModules} alt="RoadLenz workspaces including recordings" />
              </div>
              <motion.div className={`${styles.floatingScreen} ${styles.roadCameraFloat}`} animate={{ y: [0, -5, 0] }} transition={{ duration: 5.4, repeat: Infinity, ease: "easeInOut" }}>
                <img src={media.roadCamera} alt="RoadLenz recorded road camera view" />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      <section id="ai-safety" className={`${styles.featureSection} ${styles.aiSection}`}>
        <div className="shell">
          <div className={styles.twoColumn}>
            <motion.div className={styles.copyColumn} {...fadeUp}>
              <SectionHeading
                kicker="AI SAFETY — ADAS / DMS"
                title="Smarter safety."
                italic="Clearer action."
                description="For enabled companies and compatible AI video devices, RoadLenz brings safety-event visibility into the same fleet software."
                light
              />
              <CheckList light items={[
                "ADAS / DMS enabled vehicle visibility",
                "Vehicle-level AI safety events",
                "Recorded event history",
                "Company-enabled safety configuration",
                "Connected video context for investigation",
              ]} />
            </motion.div>
            <motion.div className={styles.visualColumn} {...fadeUp}>
              <div className={styles.aiGlow} />
              <div className={styles.aiScreens}>
                <div><img src={media.aiSafetyList} alt="RoadLenz AI Safety fleet list" /></div>
                <div><img src={media.aiSafetyEvents} alt="RoadLenz AI Safety events" /></div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section id="fuel" className={`${styles.featureSection} ${styles.lightSection}`}>
        <div className="shell">
          <div className={`${styles.twoColumn} ${styles.reverseVisual}`}>
            <motion.div className={styles.copyColumn} {...fadeUp}>
              <SectionHeading
                kicker="FUEL MONITORING"
                title="Track fuel."
                italic="Prevent misuse."
                description="RoadLenz can bring compatible fuel-sensor data into the fleet operating picture, where it can be reviewed alongside vehicle and trip context."
              />
              <CheckList items={[
                "Compatible fuel-level sensor integration",
                "Vehicle-level fuel visibility",
                "Fuel activity reviewed beside fleet movement",
                "Useful trip and operational context",
                "Supports exception review and fleet efficiency",
              ]} />
            </motion.div>
            <motion.div className={styles.visualColumn} {...fadeUp}>
              <div className={styles.fuelPanel}>
                <div className={styles.fuelPanelHead}><span>Fuel Level</span><strong>78%</strong></div>
                <div className={styles.chartWrap}>
                  <svg viewBox="0 0 620 250" role="img" aria-label="Illustrative fuel monitoring trend">
                    <defs>
                      <linearGradient id="fuelFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2A72EC" stopOpacity="0.28"/><stop offset="1" stopColor="#2A72EC" stopOpacity="0"/></linearGradient>
                    </defs>
                    <path d="M20 62 L110 68 L185 78 L245 82 L290 96 L345 88 L400 112 L455 118 L510 145 L590 154 L590 230 L20 230 Z" fill="url(#fuelFill)" />
                    <path d="M20 62 L110 68 L185 78 L245 82 L290 96 L345 88 L400 112 L455 118 L510 145 L590 154" fill="none" stroke="#1259D6" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="345" cy="88" r="8" fill="#1259D6" /><circle cx="590" cy="154" r="8" fill="#1259D6" />
                  </svg>
                </div>
                <div className={styles.fuelStats}>
                  <div><small>Sensor status</small><strong>Connected</strong></div>
                  <div><small>Current level</small><strong>78%</strong></div>
                  <div><small>Fleet context</small><strong>Vehicle + Trip</strong></div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section id="reports" className={`${styles.featureSection} ${styles.softBlueSection}`}>
        <div className="shell">
          <div className={styles.twoColumn}>
            <motion.div className={styles.copyColumn} {...fadeUp}>
              <SectionHeading
                kicker="REPORTS & ANALYTICS"
                title="Turn data into"
                italic="decisions."
                description="RoadLenz provides a dedicated report catalogue for recurring fleet review, helping operations teams move from raw activity to structured information."
              />
              <CheckList items={[
                "Trip Summary",
                "GPS Distance Report",
                "Ignition Idle Report",
                "Stop Report",
                "Online & Offline Session Detail",
                "Fleet Online Rate",
              ]} />
            </motion.div>
            <motion.div className={styles.visualColumn} {...fadeUp}>
              <div className={styles.softGlow} />
              <div className={styles.portraitStageWide}>
                <img src={media.reports} alt="RoadLenz reports catalogue" />
              </div>
              <div className={styles.reportCallout}>
                <Icon name="doc" className="h-6 w-6" />
                <div><strong>Operational reports</strong><span>Trip, GPS, idle, stops and connectivity</span></div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section id="groups" className={`${styles.featureSection} ${styles.darkSection}`}>
        <div className="shell">
          <div className={`${styles.twoColumn} ${styles.reverseVisual}`}>
            <motion.div className={styles.copyColumn} {...fadeUp}>
              <SectionHeading
                kicker="COMPANY & VEHICLE GROUPS"
                title="Manage multiple fleets."
                italic="Your way."
                description="RoadLenz is built for operators who manage more than one customer, company or fleet. Company context keeps the right vehicles and features organised."
                light
              />
              <CheckList light items={[
                "Group vehicles company-wise",
                "Move between companies from one platform",
                "Keep fleet access and features in the correct context",
                "Useful for transport operators and multi-client fleets",
                "One RoadLenz environment for multiple fleet groups",
              ]} />
            </motion.div>
            <motion.div className={styles.visualColumn} {...fadeUp}>
              <div className={styles.darkGlow} />
              <div className={styles.companyScreens}>
                <div><img src={media.workspaceList} alt="RoadLenz company and vehicle groups" /></div>
                <div><img src={media.workspaceModules} alt="RoadLenz workspace modules" /></div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section id="mobile" className={`${styles.featureSection} ${styles.lightSection}`}>
        <div className="shell">
          <div className={styles.mobileLayout}>
            <motion.div className={styles.copyColumn} {...fadeUp}>
              <SectionHeading
                kicker="ROADLENZ MOBILE APP"
                title="Your fleet goes"
                italic="with you."
                description="Keep fleet overview, live tracking, vehicle information, live camera access, alerts and reports close to the operating team on mobile."
              />
              <CheckList items={[
                "Fleet overview on mobile",
                "Live map and vehicle status",
                "Live camera access",
                "Alerts and safety-event visibility",
                "Reports and operational information on the go",
              ]} />
            </motion.div>
            <motion.div className={styles.mobileStage} {...fadeUp}>
              <div className={styles.mobileGlow} />
              <motion.div className={`${styles.mobilePhone} ${styles.mobilePhoneA}`} animate={{ y: [0, -6, 0] }} transition={{ duration: 5.4, repeat: Infinity, ease: "easeInOut" }}><img src={media.overviewMobile} alt="RoadLenz mobile overview" /></motion.div>
              <motion.div className={`${styles.mobilePhone} ${styles.mobilePhoneB}`} animate={{ y: [0, -10, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}><img src={media.liveFleetMobile} alt="RoadLenz live tracking mobile" /></motion.div>
              <motion.div className={`${styles.mobilePhone} ${styles.mobilePhoneC}`} animate={{ y: [0, -5, 0] }} transition={{ duration: 6.1, repeat: Infinity, ease: "easeInOut" }}><img src={media.mobile} alt="RoadLenz live video mobile" /></motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      <section id="white-label" className={styles.whiteLabelSection}>
        <div className="shell">
          <div className={styles.whiteLabelGrid}>
            <motion.div className={styles.whiteLabelCopy} {...fadeUp}>
              <span className={styles.kicker}>WHITE LABEL PLATFORM</span>
              <h2>Your brand. <em>Our technology.</em></h2>
              <p>Discuss a branded RoadLenz fleet software experience with your company identity, required modules and deployment structure.</p>
              <CheckList items={[
                "Custom branding and domain discussion",
                "Selected RoadLenz software modules",
                "Company and user structure",
                "Video, AI and reporting capabilities",
              ]} />
              <div className={styles.whiteLabelActions}>
                <Link href="/contact" className={styles.lightPrimary}>Send Enquiry <Icon name="arrowRight" className="h-4 w-4" /></Link>
                <Link href="/book-demo" className={styles.lightSecondary}>Book a Demo</Link>
                <Link href="/contact" className={styles.lightSecondary}>Contact Us</Link>
              </div>
            </motion.div>
            <motion.div className={styles.whiteLabelVisual} {...fadeUp}>
              <div className={styles.whiteLabelGlow} />
              <div className={styles.brandLaptop}>
                <div className={styles.brandLaptopBar}><i /><i /><i /><span>Your Fleet Platform</span></div>
                <div className={styles.brandLaptopBody}>
                  <div className={styles.brandMark}><small>YOUR</small><strong>BRAND</strong><span>Fleet Intelligence Platform</span></div>
                  <img src={media.overviewDesktop} alt="RoadLenz white label platform example" />
                </div>
              </div>
              <div className={styles.brandPhone}><span>YOUR</span><strong>BRAND</strong></div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className={styles.finalCta} style={{ backgroundImage: `url(${media.ctaBg})` }}>
        <div className={styles.finalCtaOverlay} />
        <div className="shell">
          <motion.div className={styles.finalCtaGrid} {...fadeUp}>
            <div>
              <span className={styles.heroKicker}>READY TO CONNECT YOUR FLEET?</span>
              <h2>Build a safer, <em>smarter tomorrow.</em></h2>
              <p>See how RoadLenz software can connect your fleet, video, safety and operational intelligence.</p>
            </div>
            <div className={styles.finalActions}>
              <Link href="/book-demo" className={styles.heroPrimary}>Request a Demo <Icon name="arrowRight" className="h-4 w-4" /></Link>
              <Link href="/contact" className={styles.heroSecondary}>Contact Our Team</Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
