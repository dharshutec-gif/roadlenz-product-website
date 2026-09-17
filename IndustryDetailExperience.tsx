"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import styles from "./IndustryDetailExperience.module.css";

export type IndustryDetail = {
  slug: string;
  name: string;
  eyebrow: string;
  heroTitle: string;
  heroDescription: string;
  heroImage: string;
  vehicleImage: string;
  challenge: string;
  solution: string;
  workflow: { step: string; title: string; text: string }[];
  capabilities: { title: string; text: string }[];
  software: { title: string; text: string; image: string }[];
  products: string[];
  stats: { value: string; label: string }[];
};

export const INDUSTRY_DETAILS: Record<string, IndustryDetail> = {
  "trucking-logistics": {
    slug: "trucking-logistics",
    name: "Trucking & Logistics",
    eyebrow: "ROADLENZ FOR LOGISTICS",
    heroTitle: "Every Load. Every Kilometre. In View.",
    heroDescription:
      "Connect long-haul and distribution fleets with live location, driver intelligence, video evidence, fuel visibility and route performance.",
    heroImage: "/logistics-hero.jpg",
    vehicleImage: "/home-assets/industry-trucking.png",
    challenge:
      "Logistics teams need dependable visibility across long routes, multiple drivers, delivery commitments, fuel usage and vehicle events without switching between disconnected tools.",
    solution:
      "RoadLenz combines live tracking, route history, video telematics, driver safety, fuel monitoring and reporting in one operational workspace.",
    workflow: [
      { step: "01", title: "Connect the vehicle", text: "GPS, video and supported sensors bring each truck into the RoadLenz platform." },
      { step: "02", title: "Monitor the journey", text: "Follow location, route progress, driver events and operational alerts in real time." },
      { step: "03", title: "Review evidence", text: "Use route history, reports and available video context to investigate events." },
      { step: "04", title: "Improve operations", text: "Turn fleet data into safer journeys, better utilisation and clearer cost control." },
    ],
    capabilities: [
      { title: "Live Route Visibility", text: "Track vehicles, stops, delays and trip progress across long-distance operations." },
      { title: "Driver Safety", text: "Use ADAS/DMS and event context to support safer driving behaviour." },
      { title: "Fuel Intelligence", text: "Monitor fuel usage, refill activity and supported theft alerts." },
      { title: "Video Evidence", text: "Review road and cabin footage around important journey events." },
      { title: "Trip & Stop Reports", text: "Analyse distance, stop duration, ignition and route history." },
      { title: "Fleet Alerts", text: "Surface important exceptions so teams can respond faster." },
    ],
    software: [
      { title: "Track History", text: "Review recorded routes, distance, duration and playback.", image: "/media/industries/software/track-history.webp" },
      { title: "Live Cameras", text: "View vehicle location alongside available camera channels.", image: "/media/industries/software/live-cameras-map.webp" },
      { title: "Fleet Map", text: "Locate vehicles and inspect visible status across the fleet.", image: "/media/industries/software/fleet-map.webp" },
    ],
    products: ["GPS Tracking", "AI Dashcams", "MDVR Systems", "ADAS + DMS", "Fuel Monitoring"],
    stats: [
      { value: "Live", label: "Fleet visibility" },
      { value: "24/7", label: "Operational monitoring" },
      { value: "One", label: "Connected platform" },
    ],
  },
  mining: {
    slug: "mining",
    name: "Mining",
    eyebrow: "ROADLENZ FOR MINING",
    heroTitle: "Connected Intelligence for Demanding Worksites.",
    heroDescription:
      "Give mining and heavy-equipment teams clearer vehicle visibility, operator safety context and event evidence across rugged operations.",
    heroImage: "/mining-hero.jpg",
    vehicleImage: "/home-assets/industry-mining.png",
    challenge:
      "Heavy vehicles operate in high-risk environments where blind spots, operator behaviour, route deviations and delayed incident review can impact safety and productivity.",
    solution:
      "RoadLenz brings vehicle status, camera visibility, driver events, alerts and route history into a single connected monitoring environment.",
    workflow: [
      { step: "01", title: "Connect equipment", text: "Bring heavy vehicles online with tracking, cameras and supported safety devices." },
      { step: "02", title: "Watch critical movement", text: "Monitor location, vehicle status and high-risk operational events." },
      { step: "03", title: "Review incidents", text: "Use available video and event history to understand what happened." },
      { step: "04", title: "Strengthen safety", text: "Use evidence and reports to improve operator awareness and site discipline." },
    ],
    capabilities: [
      { title: "Vehicle Status", text: "See connected heavy-equipment status and latest telemetry." },
      { title: "Multi-Camera Visibility", text: "Review road, side, rear and cabin views where configured." },
      { title: "Safety Alerts", text: "Surface important driver and device events for follow-up." },
      { title: "Route History", text: "Review movement, stoppages and operating patterns." },
      { title: "Driver Monitoring", text: "Support operator accountability with configured DMS events." },
      { title: "Recorded Evidence", text: "Use stored video around incidents and safety reviews." },
    ],
    software: [
      { title: "Vehicle Details", text: "Inspect ignition, camera count and latest telemetry.", image: "/media/industries/software/vehicle-details.webp" },
      { title: "Live Cameras", text: "Review location and available camera channels.", image: "/media/industries/software/live-cameras-map.webp" },
      { title: "Fleet Alerts", text: "Investigate SOS and device events with vehicle context.", image: "/media/industries/software/fleet-alerts.webp" },
    ],
    products: ["MDVR Systems", "Vehicle CCTV Cameras", "ADAS + DMS", "GPS Tracking", "Fuel Monitoring"],
    stats: [
      { value: "360°", label: "Operational visibility" },
      { value: "AI", label: "Driver safety intelligence" },
      { value: "Live", label: "Vehicle monitoring" },
    ],
  },
  agriculture: {
    slug: "agriculture",
    name: "Agriculture",
    eyebrow: "ROADLENZ FOR AGRICULTURE",
    heroTitle: "Connected Equipment. Clearer Field Operations.",
    heroDescription:
      "Track agricultural vehicles and equipment with live location, route history, utilisation context, fuel visibility and operational reports.",
    heroImage: "/agriculture-hero.jpg",
    vehicleImage: "/home-assets/industry-agriculture.png",
    challenge:
      "Agricultural assets often operate across large field areas, making it difficult to know where equipment is, how it is being used and when attention is required.",
    solution:
      "RoadLenz creates a connected view of vehicles and equipment through tracking, telemetry, route history, reports and supported sensor data.",
    workflow: [
      { step: "01", title: "Connect assets", text: "Bring tractors and utility vehicles into one fleet environment." },
      { step: "02", title: "See field movement", text: "Track location, routes and working patterns across large operating areas." },
      { step: "03", title: "Measure utilisation", text: "Use trip and status history to understand asset activity." },
      { step: "04", title: "Plan better", text: "Use reports and alerts to support maintenance and operational planning." },
    ],
    capabilities: [
      { title: "Asset Tracking", text: "See connected tractors and utility vehicles on one map." },
      { title: "Route History", text: "Review movement and working patterns over time." },
      { title: "Fuel Monitoring", text: "Use supported sensors to monitor usage and refill activity." },
      { title: "Geofencing", text: "Create operational boundaries and review movement exceptions." },
      { title: "Utilisation Reports", text: "Understand distance, trips and activity." },
      { title: "Alerts", text: "Surface important device and operational events." },
    ],
    software: [
      { title: "Fleet Map", text: "Locate equipment and review visible vehicle status.", image: "/media/industries/software/fleet-map.webp" },
      { title: "Vehicle Details", text: "Inspect latest reported telemetry and device context.", image: "/media/industries/software/vehicle-details.webp" },
      { title: "Track History", text: "Review recorded movement and operating history.", image: "/media/industries/software/track-history.webp" },
    ],
    products: ["GPS Tracking", "Fuel Monitoring", "Vehicle Cameras", "Fleet Sensors"],
    stats: [
      { value: "Live", label: "Equipment visibility" },
      { value: "Geo", label: "Operational boundaries" },
      { value: "Data", label: "Utilisation insight" },
    ],
  },
  "employee-transport": {
    slug: "employee-transport",
    name: "Employee Transport",
    eyebrow: "ROADLENZ FOR EMPLOYEE TRANSPORT",
    heroTitle: "Reliable Journeys for Every Shift.",
    heroDescription:
      "Connect shuttle location, driver behaviour, passenger events and video context for safer, more dependable employee mobility.",
    heroImage: "/employee-transport-hero.jpg",
    vehicleImage: "/home-assets/industry-employee.png",
    challenge:
      "Transport teams need to coordinate multiple employee routes, boarding points, drivers and shift timings while maintaining safety and accountability.",
    solution:
      "RoadLenz combines live fleet visibility, video telematics, driver safety, alerts, route history and supported passenger-identification data.",
    workflow: [
      { step: "01", title: "Assign the fleet", text: "Connect vehicles, devices and routes to the RoadLenz operating environment." },
      { step: "02", title: "Monitor every shift", text: "Follow vehicles, route progress and driver events in real time." },
      { step: "03", title: "Verify events", text: "Use video, alerts and route history when questions arise." },
      { step: "04", title: "Improve service", text: "Use reports to support punctuality, safety and fleet planning." },
    ],
    capabilities: [
      { title: "Live Shuttle Tracking", text: "See route progress and current vehicle location." },
      { title: "Driver Behaviour", text: "Review configured safety events and driving context." },
      { title: "Video Telematics", text: "Access road and cabin evidence where available." },
      { title: "Passenger Events", text: "Connect supported attendance or RFID records with journeys." },
      { title: "Fleet Alerts", text: "Surface exceptions that need operational attention." },
      { title: "Trip History", text: "Review route, stop and journey records." },
    ],
    software: [
      { title: "Live Cameras", text: "Monitor vehicle location and configured camera channels.", image: "/media/industries/software/live-cameras-map.webp" },
      { title: "Fleet Alerts", text: "Review reported safety and device exceptions.", image: "/media/industries/software/fleet-alerts.webp" },
      { title: "Track History", text: "Review completed journey routes and playback.", image: "/media/industries/software/track-history.webp" },
    ],
    products: ["GPS Tracking", "AI Dashcams", "MDVR Systems", "RFID", "ADAS + DMS"],
    stats: [
      { value: "24/7", label: "Fleet visibility" },
      { value: "Video", label: "Journey evidence" },
      { value: "Safer", label: "Employee mobility" },
    ],
  },
  "school-transport": {
    slug: "school-transport",
    name: "School Transport",
    eyebrow: "ROADLENZ FOR SCHOOL TRANSPORT",
    heroTitle: "Safer School Journeys. Clearer Visibility.",
    heroDescription:
      "Bring live bus tracking, video visibility, driver safety, student boarding context and operational alerts into one connected environment.",
    heroImage: "/school-transport-hero.jpg",
    vehicleImage: "/home-assets/industry-school.png",
    challenge:
      "Schools need reliable visibility across pickup, travel and drop-off while maintaining driver accountability and a clear record of important journey events.",
    solution:
      "RoadLenz connects live tracking, multi-camera video, AI safety, alerts and supported RFID/people-counting workflows for school transport operations.",
    workflow: [
      { step: "01", title: "Pickup visibility", text: "Track the bus and review supported boarding events at pickup points." },
      { step: "02", title: "Journey monitoring", text: "Follow route progress, driver events and available live video." },
      { step: "03", title: "Drop-off verification", text: "Review route and recorded evidence when confirmation is needed." },
      { step: "04", title: "Incident review", text: "Use alerts, video and journey history to investigate concerns." },
    ],
    capabilities: [
      { title: "Live Bus Tracking", text: "See school-bus location and route progress." },
      { title: "Boarding Visibility", text: "Review supported boarding and exit events." },
      { title: "Driver Safety", text: "Use configured ADAS/DMS events to support safer driving." },
      { title: "Multi-Camera Video", text: "Review road, cabin, door and other configured camera views." },
      { title: "Student Counting", text: "Use supported people-counting data for occupancy visibility." },
      { title: "Journey Alerts", text: "Surface important route, safety and device events." },
    ],
    software: [
      { title: "Fleet Map", text: "Track connected school buses and visible status.", image: "/media/industries/software/fleet-map.webp" },
      { title: "Live Cameras", text: "Review location and configured camera channels together.", image: "/media/industries/software/live-cameras-map.webp" },
      { title: "Safety Events", text: "Review recorded AI safety events and timestamps.", image: "/media/industries/software/ai-safety-events.webp" },
    ],
    products: ["GPS Tracking", "MDVR Systems", "AI Dashcams", "RFID", "People Counting", "ADAS + DMS"],
    stats: [
      { value: "Live", label: "Bus visibility" },
      { value: "AI", label: "Safety events" },
      { value: "Video", label: "Journey evidence" },
    ],
  },
  "public-transport": {
    slug: "public-transport",
    name: "Public Transport",
    eyebrow: "ROADLENZ FOR PUBLIC TRANSPORT",
    heroTitle: "A Clearer View of Every Route.",
    heroDescription:
      "Connect bus location, passenger environments, driver events and recorded evidence across public transport operations.",
    heroImage: "/public-transport-hero.jpg",
    vehicleImage: "/home-assets/industry-public-bus.png",
    challenge:
      "Public transport teams manage high passenger volumes, multiple routes and frequent operational events where fast access to location and video context matters.",
    solution:
      "RoadLenz gives control rooms a connected view of fleet location, camera visibility, safety events, route history and operational reporting.",
    workflow: [
      { step: "01", title: "Connect the fleet", text: "Bring buses, cameras and tracking devices into one monitoring environment." },
      { step: "02", title: "Monitor service", text: "Follow routes, vehicle status and configured live video." },
      { step: "03", title: "Review incidents", text: "Use alerts and recorded evidence to understand events." },
      { step: "04", title: "Improve planning", text: "Use reports and available passenger data to support operations." },
    ],
    capabilities: [
      { title: "Fleet Overview", text: "See connected bus status across the network." },
      { title: "Live Fleet Map", text: "Monitor routes and vehicle location." },
      { title: "Video Surveillance", text: "Review configured camera channels for passenger environments." },
      { title: "Safety Events", text: "Surface important vehicle and driver events." },
      { title: "Operational Reports", text: "Review trip and service information." },
      { title: "Passenger Insight", text: "Use supported counting data to understand boarding patterns." },
    ],
    software: [
      { title: "Fleet Overview", text: "See fleet totals and vehicle status in one view.", image: "/media/industries/software/fleet-overview.webp" },
      { title: "Fleet Map", text: "Locate buses and review visible operating status.", image: "/media/industries/software/fleet-map.webp" },
      { title: "Reports", text: "Review trip, distance and stop reports.", image: "/media/industries/software/reports.webp" },
    ],
    products: ["MDVR Systems", "Vehicle CCTV Cameras", "GPS Tracking", "People Counting", "ADAS + DMS"],
    stats: [
      { value: "Multi", label: "Route visibility" },
      { value: "Live", label: "Video monitoring" },
      { value: "Data", label: "Operational reports" },
    ],
  },
  "cab-taxi": {
    slug: "cab-taxi",
    name: "Cab / Taxi",
    eyebrow: "ROADLENZ FOR CAB & TAXI",
    heroTitle: "Every Trip Connected. Every Journey Accountable.",
    heroDescription:
      "Give cab and taxi operators live trip visibility, driver-safety context, video evidence and route history in one connected platform.",
    heroImage: "/taxi-hero.jpg",
    vehicleImage: "/home-assets/industry-cab.png",
    challenge:
      "Taxi operations depend on trip visibility, driver accountability and fast incident review while vehicles move continuously across the city.",
    solution:
      "RoadLenz combines tracking, trip history, vehicle details, available road/cabin video and safety events for clearer daily fleet operations.",
    workflow: [
      { step: "01", title: "Start the trip", text: "Connect the vehicle and begin capturing location and configured video context." },
      { step: "02", title: "Monitor movement", text: "See live vehicle location, route progress and important events." },
      { step: "03", title: "Review the journey", text: "Use trip history and video evidence when an event needs investigation." },
      { step: "04", title: "Improve service", text: "Use operational data to support safer drivers and reliable passenger journeys." },
    ],
    capabilities: [
      { title: "Live Tracking", text: "See cab location and current movement." },
      { title: "Trip History", text: "Review completed routes and playback." },
      { title: "Driver Safety", text: "Use configured safety events for coaching and review." },
      { title: "Road & Cabin Video", text: "Access available footage for incident context." },
      { title: "Vehicle Details", text: "Review ignition, camera and telemetry context." },
      { title: "Alerts", text: "Surface important journey and device exceptions." },
    ],
    software: [
      { title: "Fleet Map", text: "Locate vehicles and review latest visible status.", image: "/media/industries/software/fleet-map.webp" },
      { title: "Vehicle Details", text: "Inspect vehicle, ignition, camera and telemetry context.", image: "/media/industries/software/vehicle-details.webp" },
      { title: "Track History", text: "Review recorded route and playback timeline.", image: "/media/industries/software/track-history.webp" },
    ],
    products: ["GPS Tracking", "AI Dashcams", "ADAS + DMS", "Vehicle Cameras"],
    stats: [
      { value: "Live", label: "Trip visibility" },
      { value: "Video", label: "Incident evidence" },
      { value: "AI", label: "Driver safety" },
    ],
  },
};

export function getIndustryDetail(slug: string) {
  return INDUSTRY_DETAILS[slug];
}

function Reveal({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export default function IndustryDetailExperience({
  detail,
}: {
  detail: IndustryDetail;
}) {
  return (
    <main className={styles.page}>
      <section
        className={styles.hero}
        style={{ backgroundImage: `url("${detail.heroImage}")` }}
      >
        <div className={styles.heroOverlay} />
        <div className={styles.heroGlow} />

        <div className={styles.shell}>
          <motion.div
            className={styles.heroCopy}
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
          >
            <span>{detail.eyebrow}</span>
            <h1>{detail.heroTitle}</h1>
            <p>{detail.heroDescription}</p>

            <div className={styles.heroActions}>
              <Link href="/book-demo" className={styles.primaryButton}>
                Request a Demo <b>→</b>
              </Link>
              <Link href="/contact" className={styles.secondaryButton}>
                Talk to Our Experts
              </Link>
            </div>
          </motion.div>

          <motion.div
            className={styles.heroVehicleStage}
            initial={{ opacity: 0, x: 34, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.85, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className={styles.vehicleRing} />
            <img src={detail.vehicleImage} alt={detail.name} />
          </motion.div>
        </div>
      </section>

      <nav className={styles.stickyNav}>
        <div className={styles.shell}>
          <a href="#overview">Overview</a>
          <a href="#workflow">How It Works</a>
          <a href="#capabilities">Capabilities</a>
          <a href="#software">RoadLenz Software</a>
          <a href="#products">Products</a>
        </div>
      </nav>

      <section className={styles.statsBand}>
        <div className={styles.shell}>
          {detail.stats.map((item) => (
            <div key={item.label}>
              <strong>{item.value}</strong>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section} id="overview">
        <div className={styles.shell}>
          <Reveal>
            <div className={styles.sectionHead}>
              <span>INDUSTRY OVERVIEW</span>
              <h2>Built Around the Way Your Operation Actually Moves.</h2>
            </div>
          </Reveal>

          <div className={styles.overviewGrid}>
            <Reveal>
              <article className={styles.storyCard}>
                <small>THE CHALLENGE</small>
                <h3>Operational visibility should not be fragmented.</h3>
                <p>{detail.challenge}</p>
              </article>
            </Reveal>

            <Reveal delay={0.08}>
              <article className={`${styles.storyCard} ${styles.storyCardAccent}`}>
                <small>THE ROADLENZ APPROACH</small>
                <h3>One connected operating layer.</h3>
                <p>{detail.solution}</p>
              </article>
            </Reveal>
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.workflowSection}`} id="workflow">
        <div className={styles.shell}>
          <Reveal>
            <div className={styles.sectionHead}>
              <span>HOW IT WORKS</span>
              <h2>From Vehicle Data to Operational Action.</h2>
              <p>A simple connected flow that supports everyday fleet decisions.</p>
            </div>
          </Reveal>

          <div className={styles.workflowGrid}>
            {detail.workflow.map((step, index) => (
              <Reveal key={step.step} delay={index * 0.06}>
                <article className={styles.workflowCard}>
                  <span>{step.step}</span>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section} id="capabilities">
        <div className={styles.shell}>
          <Reveal>
            <div className={styles.sectionHead}>
              <span>CONNECTED CAPABILITIES</span>
              <h2>Everything the Team Needs to See, Review and Act.</h2>
            </div>
          </Reveal>

          <div className={styles.capabilityGrid}>
            {detail.capabilities.map((capability, index) => (
              <Reveal key={capability.title} delay={(index % 3) * 0.05}>
                <article className={styles.capabilityCard}>
                  <i>{String(index + 1).padStart(2, "0")}</i>
                  <h3>{capability.title}</h3>
                  <p>{capability.text}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.softwareSection}`} id="software">
        <div className={styles.shell}>
          <Reveal>
            <div className={styles.sectionHead}>
              <span>ROADLENZ SOFTWARE</span>
              <h2>The Operational View Behind the Journey.</h2>
              <p>
                Real RoadLenz software screens selected for this industry workflow.
              </p>
            </div>
          </Reveal>

          <div className={styles.softwareGrid}>
            {detail.software.map((screen, index) => (
              <Reveal key={screen.title} delay={index * 0.07}>
                <article className={styles.softwareCard}>
                  <div className={styles.softwareWindow}>
                    <div className={styles.windowBar}>
                      <span /><span /><span />
                      <small>ROADLENZ / {screen.title.toUpperCase()}</small>
                    </div>
                    <img src={screen.image} alt={screen.title} />
                  </div>
                  <h3>{screen.title}</h3>
                  <p>{screen.text}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section} id="products">
        <div className={styles.shell}>
          <Reveal>
            <div className={styles.sectionHead}>
              <span>RECOMMENDED TECHNOLOGY</span>
              <h2>Hardware That Supports This Operation.</h2>
            </div>
          </Reveal>

          <div className={styles.productRail}>
            {detail.products.map((product) => (
              <Link href="/products" key={product} className={styles.productChip}>
                <span>+</span>
                {product}
                <b>→</b>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.ctaSection}>
        <div className={styles.shell}>
          <Reveal>
            <div className={styles.ctaCard}>
              <div>
                <span>BUILD YOUR {detail.name.toUpperCase()} SOLUTION</span>
                <h2>Ready to Connect the Operation?</h2>
                <p>
                  Tell us about your fleet size, vehicle mix and operational priorities.
                </p>
              </div>

              <div className={styles.ctaActions}>
                <Link href="/book-demo" className={styles.primaryButton}>
                  Request a Demo <b>→</b>
                </Link>
                <Link href="/contact" className={styles.secondaryButton}>
                  Talk to Our Experts
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
