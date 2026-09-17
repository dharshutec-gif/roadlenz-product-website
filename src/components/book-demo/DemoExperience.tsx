import Link from "next/link";
import { ChartNoAxesCombined, Camera, Headset, Leaf, LockKeyhole, MapPin, MonitorPlay,
  Settings, ShieldCheck, Trophy, UsersRound, Video, type LucideIcon } from "lucide-react";
import DemoBookingForm from "./DemoBookingForm";
import styles from "./DemoExperience.module.css";

const services: [LucideIcon, string][] = [
  [MonitorPlay, "Live Platform Walkthrough"], [Camera, "Hardware Overview"],
  [UsersRound, "Solution Consultation"], [Settings, "Custom Demo for Your Fleet"],
];
const capabilities: [LucideIcon, string, string][] = [
  [MapPin, "Live Tracking", "Real-time visibility across your fleet"],
  [Video, "Video Telematics", "In-cabin and on-road video insights"],
  [ShieldCheck, "ADAS & DMS Alerts", "Proactive safety for your drivers"],
  [ChartNoAxesCombined, "Reports & Analytics", "Actionable insights for smarter decisions"],
];
const advantages: [LucideIcon, string, string][] = [
  [Trophy, "10+ Years Experience", "Trusted by fleet operators across India"],
  [UsersRound, "2,000+ Vehicles Connected", "Powering fleets of all sizes"],
  [Headset, "24/7 Support", "Dedicated support for ongoing success"],
];
function Benefit({ item }: { item: [LucideIcon, string, string] }) {
  const [Icon, title, description] = item;
  return <li className={styles.benefit}><span className={styles.benefitIcon}><Icon aria-hidden="true" /></span><div><h3>{title}</h3><p>{description}</p></div></li>;
}
export default function DemoExperience({ product }: { product?: string }) {
  return (
    <div className={styles.page}>
      <div className={styles.artwork} aria-hidden="true" />
      <div className={styles.layout}>
        <section className={styles.hero} aria-labelledby="demo-heading">
          <p className={styles.eyebrow}>Smart fleets. Safer roads. A better tomorrow.</p>
          <h1 id="demo-heading">See the Platform <span>Live</span></h1>
          <p className={styles.description}>Explore how fleet intelligence, GPS tracking, video telematics,<br className={styles.desktopBreak} /> AI safety and smart operations work together in action.</p>
          <div className={styles.services}>{services.map(([Icon, label]) => <div key={label}><span><Icon aria-hidden="true" /></span><p>{label}</p></div>)}</div>
          <p className={styles.imageCaption}>Technology today<br />for a safer tomorrow</p>
        </section>
        <DemoBookingForm product={product} />
        <aside className={styles.benefits} aria-label="Demo benefits">
          <h2>What You’ll See</h2><p className={styles.benefitsIntro}>Explore key capabilities during the demo.</p>
          <ul className={styles.benefitList}>{capabilities.map(item => <Benefit key={item[1]} item={item} />)}</ul>
          <div className={styles.divider} /><h2>Why Choose Us</h2>
          <ul className={styles.benefitList}>{advantages.map(item => <Benefit key={item[1]} item={item} />)}</ul>
          <div className={styles.divider} />
          <div className={styles.secure}><LockKeyhole aria-hidden="true" /><div><h3>Your Data Stays Secure</h3><p>We follow industry best practices to keep your information safe.</p></div></div>
        </aside>
        <div className={styles.bottom}>
          <div className={styles.values}>
            {([[ShieldCheck, "Safer Vehicles"], [ChartNoAxesCombined, "Smarter Operations"], [Leaf, "Greener Tomorrow"], [UsersRound, "Stronger Businesses"]] as [LucideIcon, string][]).map(([Icon, label]) => <span key={label}><Icon aria-hidden="true" />{label}</span>)}
          </div>
          <Link href="/" className={styles.signature} aria-label="Back to the RoadLenz home page"><span />A smarter, safer<br />more efficient tomorrow</Link>
        </div>
      </div>
    </div>
  );
}
