import Link from "next/link";
import { ArrowRight, CalendarDays, ChartNoAxesColumnIncreasing, Headset, Settings, ShieldCheck, UsersRound } from "lucide-react";
import styles from "./FleetForwardCTA.module.css";

const trustItems = [
  { icon: ShieldCheck, first: "Trusted by", second: "Industry Leaders" },
  { icon: Headset, first: "24×7", second: "Support" },
  { icon: Settings, first: "End-to-End", second: "Solutions" },
  { icon: ChartNoAxesColumnIncreasing, first: "Scalable", second: "for Every Fleet" },
];

export default function FleetForwardCTA() {
  return (
    <section className={styles.section} aria-labelledby="fleet-forward-heading">
      <div className={styles.panel}>
        <div className={styles.road} aria-hidden="true" />
        <div className={styles.waves} aria-hidden="true" />
        <div className={styles.copy}>
          <p className={styles.eyebrow}>LET&apos;S MOVE YOUR FLEET FORWARD</p>
          <h2 id="fleet-forward-heading">Ready to <span>Move Smarter?</span></h2>
          <p className={styles.description}>Connect your fleet with RoadLenz or get direct support from our team.</p>
          <ul className={styles.trust}>
            {trustItems.map(({ icon: Icon, first, second }) => (
              <li key={second}><span className={styles.trustIcon}><Icon aria-hidden="true" /></span><p>{first}<br />{second}</p></li>
            ))}
          </ul>
        </div>
        <div className={styles.actions}>
          <Link href="/book-demo" className={`${styles.action} ${styles.demo}`}>
            <span className={styles.actionIcon}><CalendarDays aria-hidden="true" /></span>
            <div className={styles.actionCopy}><small>START A CONVERSATION</small><h3>Request a Demo</h3><p>See RoadLenz in action with a personalized demo.</p></div>
            <span className={styles.arrow}><ArrowRight aria-hidden="true" /></span>
            <div className={styles.devices} aria-hidden="true" />
          </Link>
          <Link href="/contact" className={`${styles.action} ${styles.experts}`}>
            <span className={styles.actionIcon}><UsersRound aria-hidden="true" /></span>
            <div className={styles.actionCopy}><small>SPEAK WITH US</small><h3>Talk to Our Experts</h3><p>Get the right solution for your fleet.</p></div>
            <span className={styles.arrow}><ArrowRight aria-hidden="true" /></span>
          </Link>
          <Link href="/about#roadlenz-about-support" className={`${styles.action} ${styles.support}`}>
            <span className={styles.actionIcon}><Headset aria-hidden="true" /></span>
            <div className={styles.actionCopy}><small>NEED HELP?</small><h3>Customer Support</h3><p>We&apos;re here 24×7 to assist you.</p></div>
            <span className={styles.arrow}><ArrowRight aria-hidden="true" /></span>
          </Link>
        </div>
        <p className={styles.caption}>SAFER FLEETS<br />BRIGHTER TOMORROW<span /></p>
      </div>
    </section>
  );
}
