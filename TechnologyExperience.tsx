"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { Icon } from "@/components/ui";
import { technologySettings as settings, type TechnologyCapability } from "@/lib/technology-capabilities";
import TechnologyMedia from "./TechnologyMedia";
import styles from "./TechnologyExperience.module.css";

export interface TechnologyProduct { slug: string; name: string; image: string; category: string; tagline: string }
export interface TechnologyNavItem { slug: string; name: string; shortName: string; icon: string }
const reveal = { "data-reveal": "", initial: { opacity: 0, y: 14 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: .12 }, transition: { duration: .45 } };

function ProductVisual({ product }: { product: TechnologyProduct }) {
  const [failed, setFailed] = useState(false);
  const icon = /GPS/.test(product.category) ? "gps" : /MDVR/.test(product.category) ? "video" : /Camera|Dashcam/i.test(product.category) ? "camera" : "chip";
  return product.image && !failed ? <img src={product.image} alt={product.name} loading="lazy" onError={() => setFailed(true)} /> : <Icon name={icon} />;
}

function CapabilityNav({ items, current, label }: { items: TechnologyNavItem[]; current: string; label: string }) {
  return <nav className={styles.capabilityNav} aria-label={label}>{items.map(item => <Link key={item.slug} href={`/technology/${item.slug}`} aria-current={current === item.slug ? "page" : undefined}><Icon name={item.icon} /><span>{item.shortName}<small>{item.name}</small></span><Icon name="arrowUpRight" /></Link>)}</nav>;
}

export default function TechnologyExperience({ capability, navigation, products }: { capability: TechnologyCapability; navigation: TechnologyNavItem[]; products: TechnologyProduct[] }) {
  const overview = capability.slug === "overview";
  const bridge = useRef<HTMLElement>(null);
  const bridgeVisible = useInView(bridge, { amount: .15 });
  return <div className={`${styles.page} ${capability.theme === "dark" ? styles.darkHero : ""}`}>
    <section className={styles.hero} aria-labelledby="technology-heading">
      <div className={styles.heroRoutes} aria-hidden="true"><svg viewBox="0 0 1000 550" preserveAspectRatio="none"><path d="M-50 480C200 500 150 80 500 200S750 500 1100 100M-50 500C200 520 150 100 500 220S750 520 1100 120M-50 520C200 540 150 120 500 240S750 540 1100 140" /></svg></div>
      <div className={styles.heroInner}><div className={styles.heroText}>
        <motion.p {...reveal} className={styles.eyebrow}>{settings.eyebrow}</motion.p>
        {!overview && <motion.p {...reveal} className={styles.capabilityName}>{capability.name}</motion.p>}
        <motion.h1 {...reveal} transition={{ delay: .06, duration: .4 }} id="technology-heading">{capability.heading}</motion.h1>
        <motion.p {...reveal} transition={{ delay: .12, duration: .4 }} className={styles.heroDescription}>{capability.description}</motion.p>
        <motion.div {...reveal} transition={{ delay: .18, duration: .4 }} className={styles.heroActions}><Link href={settings.demo.href} className={styles.primaryButton}>{settings.demo.label}<Icon name="arrowRight" /></Link><Link href={settings.expert.href} className={styles.textButton}>{settings.expert.label}<Icon name="arrowUpRight" /></Link></motion.div>
        <motion.p {...reveal} className={styles.heroFootnote}><i />Real vehicles. Real roads. Clearer decisions.</motion.p>
      </div><motion.div data-reveal="" initial={{ opacity: 0, scale: .975 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: .6, delay: .1 }} className={styles.heroMedia}><TechnologyMedia media={capability.hero} compact /></motion.div></div>
    </section>
    <div className={styles.topNav}><CapabilityNav items={navigation} current={capability.slug} label="Technology capabilities" /></div>
    {!overview && <section className={styles.outcomes} aria-labelledby="outcomes-heading"><div className={styles.sectionIntro}><p className={styles.eyebrow}>What you can do</p><h2 id="outcomes-heading">A clearer view. A more informed next step.</h2></div><div className={styles.outcomeList}>{capability.outcomes.map((outcome,index) => <motion.article {...reveal} transition={{ delay: index*.045 }} key={outcome.title}><Icon key="icon" name={outcome.icon} /><h3 key="title">{outcome.title}</h3><p key="text">{outcome.text}</p></motion.article>)}</div></section>}
    {!overview && <section className={styles.workspace} aria-labelledby="workspace-heading"><motion.div {...reveal} className={styles.workspaceHeading}><p className={styles.eyebrow}>Featured workspace</p><h2 id="workspace-heading">{capability.workspaceTitle}</h2><p>{capability.workspaceDescription}</p></motion.div><motion.div {...reveal} className={styles.workspaceStage}><TechnologyMedia media={capability.workspace} /><div className={styles.callouts}>{capability.callouts.map((callout,index) => <div key={callout.title}><span className={styles.calloutNumber}>0{index+1}</span><Icon name={callout.icon} /><div><h3>{callout.title}</h3><p>{callout.text}</p></div></div>)}</div></motion.div></section>}
    <section id="video" className={styles.editorial} aria-labelledby="editorial-heading"><div className={styles.editorialIntro}><div><p className={styles.eyebrow}>{overview ? "From signal to decision" : "How it helps"}</p><h2 id="editorial-heading">{overview ? capability.workspaceTitle : "Context for the decisions that matter."}</h2><p>{overview ? capability.workspaceDescription : "A connected view of the journey, with practical value at every step."}</p></div><span>Same roads. A clearer tomorrow.</span></div>
      <div className={styles.storyRows}>{capability.stories.map((story,index) => <motion.article {...reveal} className={styles.story} key={story.title}><div key="visual" className={styles.storyVisual}><TechnologyMedia media={story.media} compact /></div><div key="text" className={styles.storyText}><span className={styles.step}>{String(index+1).padStart(2,"0")}</span><h3>{story.title}</h3><p>{story.text}</p>{story.href ? <Link className={styles.storyLink} href={story.href}><i />{story.status}<Icon name="arrowRight" /></Link> : <span className={styles.storyStatus}><i />{story.status}</span>}</div><span key="node" className={styles.storyNode} aria-hidden="true" /></motion.article>)}</div>
    </section>
    <section ref={bridge} data-visible={bridgeVisible} className={styles.hardware} aria-labelledby="hardware-heading"><div className={styles.hardwareIntro}><div><p className={styles.eyebrow}>Connected hardware</p><h2 id="hardware-heading">{settings.hardwareTitle}</h2><p>{settings.hardwareDescription}</p></div><span>Vehicle signals → operational context</span></div>
      {products.length ? <div className={styles.hardwareGrid}><div className={styles.hardwareLine} aria-hidden="true"><i /></div>{products.map((product,index) => <motion.div {...reveal} transition={{ delay: index*.05 }} className={styles.hardwareProduct} key={product.slug}><Link href={`/products/${product.slug}`}><div className={styles.productVisual}><ProductVisual product={product} /></div><span>{product.category}</span><h3>{product.name}</h3><Icon name="arrowUpRight" /></Link></motion.div>)}</div> : <div className={styles.hardwareEmpty}><Icon name="chip" /><p>Relevant hardware is being prepared for this capability.</p><Link href={settings.expert.href}>Talk to the team about a compatible setup <Icon name="arrowRight" /></Link></div>}
      <p className={styles.hardwareNote}>Available signals depend on compatible hardware, connectivity and configuration.</p>
    </section>
    <section className={styles.related} aria-labelledby="related-heading"><p className={styles.eyebrow}>Related technology</p><h2 id="related-heading">One platform. More ways to see clearly.</h2><CapabilityNav items={navigation} current={capability.slug} label="Related technology" />{!overview && <Link href="/technology" className={styles.overviewLink}>Explore the RoadLenz technology overview <Icon name="arrowRight" /></Link>}</section>
    <section className={styles.cta} style={{ backgroundImage: `linear-gradient(90deg,rgba(1,15,29,.96),rgba(1,15,29,.6)),url("${settings.ctaBackground}")` }} aria-labelledby="technology-cta-heading"><div><p className={styles.eyebrow}>Put every journey in view</p><h2 id="technology-cta-heading">{settings.ctaTitle}</h2><p>{settings.ctaDescription}</p><div><Link href={settings.demo.href} className={styles.primaryButton}>{settings.demo.label}<Icon name="arrowRight" /></Link><Link href={settings.quote.href} className={styles.outlineButton}>{settings.quote.label}</Link></div></div></section>
  </div>;
}
