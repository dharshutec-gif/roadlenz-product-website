import Link from "next/link";
import { CarFront, GraduationCap, UsersRound, Package, Mountain, Sprout, ArrowRight } from "lucide-react";
import { industryGallery } from "./industryGalleryMedia";
import styles from "./IndustriesActionGallery.module.css";

const icons = [CarFront, GraduationCap, UsersRound, UsersRound, Package, Mountain, Sprout];

export default function IndustriesActionGallery({ industries }: { industries: { slug: string; presentation: { navName: string } }[] }) {
  return (
    <div className={styles.gallery}>
      {industries.map(industry => {
        const item = industryGallery[industry.slug];
        if (!item) return null;
        const wide = item.panel === 6;
        const IndustryIcon = icons[item.panel];
        return (
          <Link href={`/industries/${industry.slug}`} key={industry.slug} className={`${styles.card} ${wide ? styles.wide : ""}`}>
            <div className={styles.photo} aria-hidden="true" style={{ backgroundPosition: wide ? "center bottom" : `${(item.panel % 3) * 50}% ${Math.floor(item.panel / 3) * 50}%` }} />
            <div className={styles.content}>
              <IndustryIcon aria-hidden="true" />
              <h3>{industry.presentation.navName}</h3>
              <p>{item.description}</p>
              <span className={styles.arrow}><ArrowRight aria-hidden="true" /></span>
            </div>
            {wide && <span className={styles.promise}>From Fields<br />to a Better Future<span /></span>}
          </Link>
        );
      })}
    </div>
  );
}
