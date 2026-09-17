import Link from "next/link";
import { ArrowRight } from "lucide-react";
import styles from "./FleetForwardCTA.module.css";

export default function FleetForwardCTA() {
  return (
    <section
      className={styles.section}
      aria-labelledby="fleet-forward-heading"
    >
      <div className={styles.panel}>

        <div className={styles.copy}>
          <p className={styles.eyebrow}>
            LET&apos;S BUILD A SAFER TOMORROW
          </p>

          <h2 id="fleet-forward-heading">
            Partner with <span>RoadLenz</span>
          </h2>

          <p className={styles.description}>
            Intelligent solutions for a safer, smarter and more connected
            world.
          </p>
        </div>

        <div className={styles.actions}>
          <Link
            href="/contact"
            className={styles.action}
          >
            <span>Get in Touch</span>

            <span className={styles.arrow}>
              <ArrowRight aria-hidden="true" />
            </span>
          </Link>
        </div>

      </div>
    </section>
  );
}