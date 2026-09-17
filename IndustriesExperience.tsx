"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { Icon } from "@/components/ui";
import type { IndustryPanel, IntelligenceProduct } from "@/lib/industries-content";
import styles from "./IndustriesExperience.module.css";

function SceneImage({ src, className, eager = false }: { src: string; className: string; eager?: boolean }) {
  const [failed, setFailed] = useState(false);
  return src && !failed ? <img src={src} alt="" className={className} loading={eager ? "eager" : "lazy"} onError={() => setFailed(true)} /> : <div className={`${className} ${styles.sceneFallback}`} aria-hidden="true" />;
}

function Highway() {
  return <svg className={styles.highway} viewBox="0 0 850 450" fill="none" aria-hidden="true">
    {[0, 24, 48, 180, 204, 228].map((offset) => <g key={offset} transform={`translate(${offset} 0)`}>
      <path d="M70 490C-80 200 660 265 435-80" stroke="currentColor" strokeWidth="12" />
      <path d="M70 490C-80 200 660 265 435-80" stroke="white" strokeWidth="2" strokeDasharray="12 10" />
    </g>)}
    <path d="M-40 320 890 20M-30 350 900 50" stroke="currentColor" strokeWidth="16" />
    <path d="M-40 335 890 35" stroke="white" strokeWidth="2" strokeDasharray="14 10" />
  </svg>;
}

export default function IndustriesExperience({ panels, products }: { panels: IndustryPanel[]; products: IntelligenceProduct[] }) {
  const defaultIndex = Math.max(0, panels.findIndex(panel => panel.slug === "logistics"));
  const [activeIndex, setActiveIndex] = useState(defaultIndex);
  const active = panels[activeIndex] ?? panels[0];
  const gallery = useRef<HTMLDivElement>(null);
  const intelligence = useRef<HTMLElement>(null);
  const galleryVisible = useInView(gallery, { amount: .05 });
  const intelligenceVisible = useInView(intelligence, { amount: .1 });
  const reduce = useReducedMotion();

  useEffect(() => {
    const element = gallery.current;
    if (!element) return;
    const media = window.matchMedia("(max-width: 900px)");
    let frame = 0;
    const centerSelected = () => {
      if (!media.matches) return;
      const item = element.children[defaultIndex] as HTMLElement | undefined;
      if (item) element.scrollLeft = item.offsetLeft - element.offsetLeft - (element.clientWidth - item.clientWidth) / 2;
    };
    centerSelected();
    const onScroll = () => {
      if (!media.matches) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const center = element.getBoundingClientRect().left + element.clientWidth / 2;
        const distances = Array.from(element.children).map(child => {
          const bounds = child.getBoundingClientRect();
          return Math.abs(bounds.left + bounds.width / 2 - center);
        });
        setActiveIndex(distances.indexOf(Math.min(...distances)));
      });
    };
    element.addEventListener("scroll", onScroll, { passive: true });
    media.addEventListener("change", centerSelected);
    return () => { cancelAnimationFrame(frame); element.removeEventListener("scroll", onScroll); media.removeEventListener("change", centerSelected); };
  }, [defaultIndex]);

  const selectPanel = (index: number, scroll = false) => {
    setActiveIndex(index);
    if (scroll && window.matchMedia("(max-width: 900px)").matches) {
      const element = gallery.current;
      const item = element?.children[index] as HTMLElement | undefined;
      if (element && item) element.scrollTo({ left: item.offsetLeft - element.offsetLeft - (element.clientWidth - item.clientWidth) / 2, behavior: reduce ? "instant" : "smooth" });
    }
  };
  // Keep the first server and client render identical. CSS reveals these immediately
  // for reduced motion, including before hydration has read the media preference.
  const reveal = { "data-reveal": "", initial: { opacity: 0, y: 15 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: 0.12 } };

  return <div className={styles.page}>
    <section className={styles.hero} aria-labelledby="industries-heading">
      <Highway />
      <div className={styles.heroContent}>
        <motion.p {...reveal} className={styles.eyebrow}>Real vehicles. Real industries. A smarter tomorrow.</motion.p>
        <motion.h1 {...reveal} transition={{ delay: reduce ? 0 : .08 }} id="industries-heading">Seven industries.<br /><span>Seven ways to move smarter.</span></motion.h1>
        <motion.p {...reveal} transition={{ delay: reduce ? 0 : .16 }} className={styles.heroCopy}>Different roads. A common purpose. RoadLenz delivers intelligent vehicle technology for the industries that keep our world moving.</motion.p>
        <motion.div {...reveal} transition={{ delay: reduce ? 0 : .24 }}><a className={styles.button} href="#industry-gallery">Discover Industries <Icon name="arrowRight" /></a></motion.div>
      </div>
      <div className={styles.marginNotes} aria-hidden="true"><p>Vehicles<br />People<br />Industries<br />A smarter tomorrow</p><p>Built for<br />a more connected<br />world</p></div>
    </section>

    {active ? <>
      <section id="industry-gallery" className={styles.gallerySection} aria-label="Explore industries">
        <div ref={gallery} data-visible={galleryVisible} className={styles.gallery}>
          {panels.map((panel, index) => <motion.a key={panel.id} href={panel.href} {...reveal} transition={{ delay: reduce ? 0 : index * .045 }}
            className={`${styles.panel} ${index === activeIndex ? styles.selected : ""}`}
            onMouseEnter={() => { if (window.matchMedia("(hover: hover) and (min-width: 901px)").matches) selectPanel(index); }}
            onFocus={() => selectPanel(index, true)} aria-label={`${panel.name}: ${panel.title}. Explore solution`}>
            <SceneImage src={panel.image} className={styles.scene} eager />
            <div className={styles.shade} />
            <div className={styles.panelCopy}>
              <span className={styles.number}>{String(index + 1).padStart(2, "0")}</span>
              <p className={styles.phrase}>{index === activeIndex ? panel.title : panel.phrase}</p>
              <div className={styles.panelDetail} aria-hidden={index !== activeIndex}>
                <p>{panel.summary}</p><span className={styles.panelAction}>{panel.action} <Icon name="arrowRight" /></span>
              </div>
            </div>
            <div className={styles.route} aria-hidden="true"><span /></div>
            <div className={styles.panelLabel}>{panel.name}<i /></div>
          </motion.a>)}
        </div>
        <div className={styles.mobileNav} aria-label="Select industry">
          <p>Swipe to explore <Icon name="arrowRight" /></p>
          <div>{panels.map((panel, index) => <button key={panel.id} onClick={() => selectPanel(index, true)} aria-label={`Select ${panel.name}`} aria-pressed={index === activeIndex}><span /></button>)}</div>
        </div>
      </section>

      <section className={styles.impact} aria-label="Selected industry impact">
        <AnimatePresence initial={false} mode="wait">
          <motion.div className={styles.impactInner} key={active.id} initial={reduce ? false : { opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={reduce ? undefined : { opacity: 0 }} transition={{ duration: .16 }}>
            <div className={styles.impactVisual}><SceneImage key={active.image} src={active.image} className={styles.impactImage} /></div>
            <div className={styles.impactContent}>
              <div className={styles.impactHeading}><div aria-live="polite" aria-atomic="true"><p className={styles.eyebrow}>Selected industry</p><h2>{active.name}</h2><i className={styles.redLine} /></div><p>Turning every journey into greater<br className={styles.desktopBreak} /> safety, efficiency and trust.</p></div>
              <div className={styles.benefits}>{active.benefits.map(benefit => <div className={styles.benefit} key={benefit.title}><Icon name={benefit.icon} /><div><h3>{benefit.title}</h3><p>{benefit.description}</p></div></div>)}
                <Link className={styles.impactLink} href={active.href}><span><Icon name="arrowRight" /></span><span>{active.action}</span></Link>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </section>
    </> : <section id="industry-gallery" className={styles.empty}><Icon name="route" /><h2>New roads are ahead.</h2><p>Our industry solutions are being prepared. Talk to RoadLenz about your fleet.</p><Link href="/request-quote" className={styles.button}>Request Quote <Icon name="arrowRight" /></Link></section>}

    <div className={styles.darkWorld}>
      <section ref={intelligence} data-visible={intelligenceVisible} className={styles.intelligence} aria-labelledby="intelligence-heading">
        <motion.div {...reveal} className={styles.layerHeading}><p className={styles.eyebrow}>The RoadLenz layer</p><h2 id="intelligence-heading">Intelligence that moves the world.</h2><p>A connected system. A safer, smarter tomorrow.</p></motion.div>
        {products.length > 0 ? <div className={styles.products}>
          <motion.div className={styles.connection} initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: reduce ? 0 : 1.3 }} aria-hidden="true"><span /></motion.div>
          {products.map((product, index) => <motion.div {...reveal} transition={{ delay: reduce ? 0 : index * .12 }} key={product.href} className={styles.product}>
            <Link href={product.href} aria-label={`${product.label}: ${product.name}`}>
              <div className={styles.productVisual}>{product.image ? <SceneImage src={product.image} className={styles.productImage} /> : <Icon name={product.icon} className={styles.productIcon} />}</div>
              <h3>{product.label}</h3><p>{product.copy}</p>
            </Link>
          </motion.div>)}
        </div> : <p className={styles.productEmpty}>Our connected product range is being updated. <Link href="/contact">Talk to the team <span aria-hidden="true">→</span></Link></p>}
        <motion.div {...reveal} className={styles.outcomes}>
          <svg viewBox="0 0 800 75" preserveAspectRatio="none" aria-hidden="true"><path d="M400 0V15Q400 38 370 38H50Q20 38 20 70M400 15Q400 38 430 38H750Q780 38 780 70M400 20V75" /></svg>
          {[{ title: "Safety", icon: "shield", text: "Fewer risks. Brighter tomorrows." }, { title: "Visibility", icon: "eye", text: "A clearer picture. Further possibilities." }, { title: "Insight", icon: "gauge", text: "Data that drives a better tomorrow." }].map(outcome => <div key={outcome.title}><Icon name={outcome.icon} /><h3>{outcome.title}</h3><p>{outcome.text}</p></div>)}
        </motion.div>
      </section>
      <section className={styles.cta} aria-labelledby="industries-cta-heading"><div><p className={styles.eyebrow}>Different industries. A brighter tomorrow.</p><h2 id="industries-cta-heading">What is moving in your world?</h2></div><div className={styles.ctaActions}><a href="#industry-gallery" className={styles.button}>Find your industry <Icon name="arrowRight" /></a><Link href="/request-quote" className={styles.outlineButton}>Request Quote</Link></div><p className={styles.ctaNote}>Same roads<br />A smarter<br />tomorrow<i className={styles.redLine} /></p></section>
    </div>
  </div>;
}
