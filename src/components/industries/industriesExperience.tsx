"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ShieldCheck, ChartNoAxesCombined, Leaf, Headset, MapPin, Truck, CarFront, BusFront, UsersRound, HardHat, Bell, Route, Quote, type LucideIcon } from "lucide-react";
import type { Industry } from "@/lib/types";
import { getIndustryPresentation, getOrderedIndustryRecords } from "./industryPresentation";
import styles from "./IndustriesExperience.module.css";

const icons: Record<string, LucideIcon> = { "cab-taxi": CarFront, "school-transport": BusFront, "public-transport": BusFront, "employee-transport": UsersRound, "trucking-logistics": Truck, mining: HardHat, agriculture: Leaf };
const industryBenefits: Record<string, string[]> = {
  "cab-taxi": ["Passenger safety", "Live trip tracking", "Driver visibility", "Trip reports"],
  "school-transport": ["Student safety", "Live tracking", "Route & stop visibility", "Fleet notifications"],
  "public-transport": ["Passenger safety", "Route visibility", "Fleet utilisation", "Service reliability"],
  "employee-transport": ["Employee safety", "Live trip visibility", "Pickup & drop-off context", "Operational alerts"],
  "trucking-logistics": ["Live shipment visibility", "Journey history", "Driver safety", "Fleet reporting"],
  mining: ["Equipment visibility", "Site safety", "Operating hours", "Exception alerts"],
  agriculture: ["Equipment tracking", "Field visibility", "Fleet utilisation", "Operating insights"],
};
const values = [
  { Icon: ShieldCheck, title: "Safer Operations", copy: "Protect people, vehicles and assets with connected safety intelligence." },
  { Icon: ChartNoAxesCombined, title: "Higher Efficiency", copy: "Understand fleet usage and reduce avoidable operating costs." },
  { Icon: Leaf, title: "Sustainable Growth", copy: "Make better use of your fleet for a cleaner, greener tomorrow." },
  { Icon: Headset, title: "24/7 Support", copy: "Stay supported with assistance for your fleet operations across India." },
];
const stories = [
  { title: "One connected view. A clearer way forward.", copy: "Bring vehicle movement, safety alerts, video and reporting together so your team can make informed decisions throughout the day.", image: "/media/solutions/employee-transport-hero.jpg" },
  { title: "Every journey deserves a safer tomorrow.", copy: "Keep people at the centre of your operation, with vehicle visibility and event context that help teams understand what needs attention.", image: "/media/solutions/school-transport-hero.jpg" },
  { title: "Built around the way your industry moves.", copy: "From city streets to remote worksites, connect your vehicles and equipment to the information your operation needs.", image: "/media/solutions/logistics-hero.jpg" },
];

export default function IndustriesExperience({ industries }: { industries: Industry[] }) {
  const ordered = useMemo(() => getOrderedIndustryRecords(industries).flatMap(industry => { const presentation = getIndustryPresentation(industry.slug); return presentation ? [{ ...industry, presentation }] : []; }), [industries]);
  const [selected, setSelected] = useState("school-transport");
  const [story, setStory] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const active = ordered.find(industry => industry.slug === selected) ?? ordered[0];
  const activeIndex = ordered.findIndex(industry => industry.slug === active?.slug);
  const selectNext = (direction: number) => setSelected(ordered[(activeIndex + direction + ordered.length) % ordered.length].slug);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { if (!media.matches) entry.target.animate([{ opacity: .5, transform: "translateY(14px)" }, { opacity: 1, transform: "translateY(0)" }], { duration: 550, easing: "ease-out" }); observer.unobserve(entry.target); } }), { threshold: .12 });
    root.current?.querySelectorAll("[data-reveal]").forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  if (!active) return <section className={styles.emptyState}><h1>Explore our industries.</h1><Link href="/contact">Contact our team <ArrowRight /></Link></section>;
  const benefits = industryBenefits[active.slug] ?? [];

  return <div ref={root} className={styles.page}>
    <section className={styles.hero} aria-labelledby="industries-title">
      <img className={styles.heroImage} src="/media/industries/hero/industries-hero.png" alt="Connected roads linking city transport, logistics, schools, mining and agriculture" fetchPriority="high" />
      <div className={`${styles.shell} ${styles.heroGrid}`}>
        <div className={styles.heroCopy}>
          <span className={styles.eyebrow}>Industries</span>
          <h1 id="industries-title">Different Industries.<br /><em>A Smarter Tomorrow.</em></h1>
          <p>RoadLenz delivers industry-focused fleet intelligence that keeps people, assets and businesses moving safely, efficiently and sustainably.</p>
          <div className={styles.actions}><a href="#industry-explorer" className={styles.primaryButton}>Explore Industries <ArrowRight /></a></div>
        </div>
      </div>
      <div className={styles.heroLine} aria-hidden="true" />
    </section>

    <section id="industry-explorer" className={styles.explorerSection} aria-labelledby="explorer-title">
      <div className={`${styles.shell} ${styles.explorer}`}>
        <header className={styles.sectionHeader}><div><span className={styles.eyebrow}>Explore by industry</span><h2 id="explorer-title">One Platform. <em>Every Journey.</em></h2></div><div className={styles.explorerControls}><p>Select an industry to see how<br />RoadLenz makes a difference.</p><button aria-label="Previous industry" className={styles.circleButton} onClick={() => selectNext(-1)}><ArrowLeft /></button><button aria-label="Next industry" className={`${styles.circleButton} ${styles.blueCircle}`} onClick={() => selectNext(1)}><ArrowRight /></button></div></header>
        <div id="industry-panel" role="tabpanel" aria-labelledby={`industry-tab-${active.slug}`} className={styles.featured}>
          <img key={active.slug} className={styles.featuredImage} src={active.presentation.sceneImage} alt={`${active.presentation.navName} operating environment`} />
          <div className={styles.featuredCopy} key={`${active.slug}-copy`}><span className={styles.featuredLabel}>Featured industry</span><h3>{active.presentation.navName}</h3><p>{active.presentation.shortLine}</p><Link href={`/industries/${active.slug}`} className={styles.whiteButton}>Explore {active.presentation.navName} <ArrowRight /></Link></div>
          <ul className={styles.featuredBenefits}>{benefits.map((label, index) => { const Symbol = [ShieldCheck, MapPin, Route, Bell][index]; return <li key={label}><Symbol />{label}</li>; })}</ul>
        </div>
        <div role="tablist" aria-label="Choose an industry" className={styles.industryTabs}>{ordered.map(industry => { const Symbol = icons[industry.slug] ?? Truck; return <button key={industry.slug} id={`industry-tab-${industry.slug}`} type="button" role="tab" aria-selected={industry.slug === active.slug} aria-controls="industry-panel" tabIndex={industry.slug === active.slug ? 0 : -1} onClick={() => setSelected(industry.slug)} onKeyDown={event => { const keys = ["ArrowLeft", "ArrowRight", "Home", "End"]; if (!keys.includes(event.key)) return; event.preventDefault(); const index = event.key === "Home" ? 0 : event.key === "End" ? ordered.length - 1 : (ordered.findIndex(i => i.slug === industry.slug) + (event.key === "ArrowRight" ? 1 : -1) + ordered.length) % ordered.length; setSelected(ordered[index].slug); document.getElementById(`industry-tab-${ordered[index].slug}`)?.focus(); }}><Symbol /><span>{industry.presentation.navName}</span></button>; })}</div>
      </div>
    </section>

    <section className={styles.valueSection} aria-labelledby="values-title"><div className={styles.shell}><header className={styles.centered}><span className={styles.eyebrow}>Why industry focused</span><h2 id="values-title">Real Challenges. <em>Practical Solutions.</em></h2><p>Every industry has unique operational needs. RoadLenz brings technology, insights and support together to solve real-world challenges — on road and beyond.</p></header><div className={styles.valueGrid}>{values.map(({ Icon, title, copy }) => <article key={title} data-reveal><Icon /><h3>{title}</h3><p>{copy}</p></article>)}</div></div></section>

    <section id="industries-in-action" className={styles.gallerySection} aria-labelledby="gallery-title"><div className={styles.shell}><header className={styles.sectionHeader}><div><span className={styles.eyebrow}>Our industries</span><h2 id="gallery-title">Driving Progress Across <em>Every Sector.</em></h2></div><a href="#industry-explorer" className={styles.textLink}>Explore Industries <ArrowRight /></a></header><div className={styles.industryGrid}>{ordered.map(industry => { const Symbol = icons[industry.slug] ?? Truck; return <Link href={`/industries/${industry.slug}`} key={industry.slug} className={styles.industryCard} data-reveal><div className={styles.cardImage}><img src={industry.presentation.sceneImage} alt={`${industry.presentation.navName} fleet`} loading="lazy" /></div><div className={styles.cardBody}><Symbol /><div><h3>{industry.presentation.navName}</h3><p>{industry.presentation.shortLine}</p></div><span className={styles.cardArrow}><ArrowRight /></span></div></Link>; })}</div>
      <div className={styles.trustStrip}><span className={styles.eyebrow}>Trusted across India</span><div>{[[Truck, "2,000+", "Vehicles Connected"], [ShieldCheck, "10+", "Years of Experience"], [Headset, "24/7", "Customer Support"], [MapPin, "Pan India", "Service Network"]].map(([Symbol, value, label]) => { const MetricIcon = Symbol as LucideIcon; return <div key={String(value)}><span className={styles.metricIcon}><MetricIcon /></span><div><strong>{String(value)}</strong><p>{String(label)}</p></div></div>; })}</div></div>
    </div></section>

    <section className={styles.storySection} aria-label="Connected operations"><img key={story} src={stories[story].image} alt="" loading="lazy" /><div className={`${styles.shell} ${styles.storyInner}`}><button className={styles.storyArrow} aria-label="Previous platform story" onClick={() => setStory((story + stories.length - 1) % stories.length)}><ArrowLeft /></button><div className={styles.storyCopy}><Quote /><div aria-live="polite"><span className={styles.eyebrow}>The RoadLenz advantage</span><h2>{stories[story].title}</h2><p>{stories[story].copy}</p><small>RoadLenz Fleet Intelligence Platform</small></div></div><button className={styles.storyArrow} aria-label="Next platform story" onClick={() => setStory((story + 1) % stories.length)}><ArrowRight /></button></div><div className={styles.storyDots}>{stories.map((item, index) => <button key={item.title} aria-label={`Show platform story ${index + 1}`} aria-current={index === story ? "true" : undefined} onClick={() => setStory(index)} />)}</div></section>

    <section className={styles.ctaSection} aria-labelledby="industries-cta-title"><div className={styles.shell}><div className={styles.ctaCopy}><span className={styles.eyebrow}>Ready to move forward</span><h2 id="industries-cta-title">Let’s Build a Safer, Smarter and <em>More Connected Tomorrow.</em></h2><p>Partner with RoadLenz to power your fleet operations.</p><div className={styles.actions}><Link href="/book-demo" className={styles.primaryButton}>Book a Demo <ArrowRight /></Link><Link href="/contact" className={styles.secondaryButton}>Contact Us</Link></div></div></div></section>

  </div>;
}
