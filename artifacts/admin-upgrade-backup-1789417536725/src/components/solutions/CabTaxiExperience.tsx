"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, animate, motion, useMotionValue, useMotionValueEvent } from "framer-motion";
import { createContext, useCallback, useContext, useEffect, useId, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { Icon } from "@/components/ui";
import { taxiCtaHref } from "@/lib/taxi-links";
import type { MediaRef, Product, Solution, SolutionJourneyStage, SolutionRecommendedProduct } from "@/lib/types";
import styles from "./CabTaxiExperience.module.css";

const TaxiMotionPreference = createContext(false);

type Device = { product: Product; recommendation?: SolutionRecommendedProduct };
type Point = { x: number; y: number };
type Connector = { key: string; start: Point; end: Point };
const ordered = <T extends { order?: number }>(items: T[] | undefined): T[] =>
  (Array.isArray(items) ? items : []).slice().sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
const usableSrc = (src?: string) => !!src && (/^\/(?!\/)/.test(src) || /^https?:\/\//.test(src));

function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduce = useContext(TaxiMotionPreference);
  return <motion.div className={`${styles.reveal} ${className}`} initial={reduce ? false : { opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .12 }} transition={{ duration: .5, delay: reduce ? 0 : delay, ease: "easeOut" }}>{children}</motion.div>;
}

function Media({ media, alt, contain = false, priority = false, decorative = false, onAvailability }: {
  media?: MediaRef; alt: string; contain?: boolean; priority?: boolean; decorative?: boolean;
  onAvailability?: (src: string, available: boolean) => void;
}) {
  const reduce = useContext(TaxiMotionPreference);
  const [failed, setFailed] = useState<string>();
  const [loaded, setLoaded] = useState<string>();
  const video = useRef<HTMLVideoElement>(null);
  const src = media?.src ?? "";
  useEffect(() => { if (reduce) video.current?.pause(); }, [reduce]);
  if (!usableSrc(src) || failed === src) return <div className={styles.mediaFallback} role={!decorative && alt ? "img" : undefined} aria-label={!decorative && alt ? alt : undefined}>{!decorative && <Icon name="image" className="h-7 w-7" />}</div>;
  const fail = () => { setFailed(src); onAvailability?.(src, false); };
  if (media?.type === "video") return <video ref={video} className={styles.media} muted playsInline controls={!decorative} autoPlay={decorative && !reduce} loop={decorative && !reduce} poster={media.poster || undefined} preload="metadata" onError={fail}><source src={src} /></video>;
  return <>
    {loaded !== src && <div className={styles.mediaFallback} aria-hidden><Icon name="image" className="h-7 w-7" /></div>}
    <Image src={src} alt={decorative ? "" : alt} fill priority={priority} loading={contain ? "eager" : undefined} sizes={contain ? "(max-width: 640px) 80vw, (max-width: 1024px) 40vw, 28vw" : "100vw"} unoptimized={!src.startsWith("/")} className={styles.media} style={{ objectFit: contain ? "contain" : "cover", opacity: loaded === src ? 1 : 0 }} onLoad={() => { setLoaded(src); onAvailability?.(src, true); }} onError={fail} />
  </>;
}

function SectionHeading({ title, summary }: { title?: string; summary?: string }) {
  return <div className={styles.sectionHeading}>{title && <h2>{title}</h2>}{summary && <p>{summary}</p>}</div>;
}

function Hero({ solution }: { solution: Solution }) {
  const reduce = useContext(TaxiMotionPreference);
  const reveal = { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } };
  return <section className={styles.hero}>
    <motion.div className={styles.heroMedia} animate={reduce ? undefined : { scale: [1, 1.035, 1], x: [0, -6, 0] }} transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}><Media media={solution.heroMedia} alt={solution.name} priority decorative /></motion.div>
    <div className={styles.heroShade} />
    <div className="shell">
      <motion.div className={styles.heroContent} initial={reduce ? false : "hidden"} animate="visible" variants={{ visible: { transition: { staggerChildren: reduce ? 0 : .09 } } }}>
        <motion.p variants={reveal} className={styles.eyebrow}>{solution.taxiContent?.heroEyebrow}</motion.p>
        <motion.h1 variants={reveal}>{solution.heroTitle}</motion.h1>
        <motion.p variants={reveal} className={styles.heroSummary}>{solution.heroSummary}</motion.p>
        <motion.div variants={reveal} className={styles.actions}>
          {solution.heroCtaLabel && <Link className="btn-primary !rounded-lg" href={taxiCtaHref(solution.heroCtaHref, "/request-quote")}>{solution.heroCtaLabel}<Icon name="arrowRight" className="h-4 w-4" /></Link>}
          {solution.ctaPrimaryLabel && <Link className={styles.outlineButton} href={taxiCtaHref(solution.ctaPrimaryHref, "/contact")}>{solution.ctaPrimaryLabel}</Link>}
        </motion.div>
        {solution.trustLine && <motion.p variants={reveal} className={styles.trust}>{solution.trustLine}</motion.p>}
      </motion.div>
    </div>
    {!!solution.liveStatus?.length && <div className={styles.heroStrip}><div className="shell">{solution.liveStatus.map((item, index) => <span key={index}><i /><small>{item.label}</small>{item.value}</span>)}<small>{solution.taxiContent?.demoLabel}</small></div>{!reduce && <motion.b className={styles.statusSignal} animate={{ scaleX: [.1, 1], opacity: [.2, .7, .2] }} transition={{ duration: 4, repeat: Infinity }} />}</div>}
  </section>;
}

function TripRoute({ stages, active, paused }: { stages: SolutionJourneyStage[]; active: number; paused: boolean }) {
  const reduce = useContext(TaxiMotionPreference);
  const routeRef = useRef<SVGPathElement>(null);
  const segmentRefs = useRef<(SVGPathElement | null)[]>([]);
  const progress = useMotionValue(0);
  const markerX = useMotionValue(0);
  const markerY = useMotionValue(0);
  const [stops, setStops] = useState<number[]>([]);
  const nodes = useMemo(() => stages.map((stage, index) => ({
    x: Math.max(8, Math.min(92, Number.isFinite(stage.nodeX) ? stage.nodeX! : 12 + index * 76 / Math.max(1, stages.length - 1))) * 6,
    y: Math.max(20, Math.min(80, Number.isFinite(stage.nodeY) ? stage.nodeY! : 72 - index * 46 / Math.max(1, stages.length - 1))) * 3.2,
  })), [stages]);
  const segments = useMemo(() => nodes.slice(1).map((end, index) => {
    const start = nodes[index], midX = (start.x + end.x) / 2;
    return { start, curve: `C ${midX} ${start.y}, ${midX} ${end.y}, ${end.x} ${end.y}` };
  }), [nodes]);
  const path = nodes.length ? `M ${nodes[0].x} ${nodes[0].y} ${segments.map((segment) => segment.curve).join(" ")}` : "";
  useMotionValueEvent(progress, "change", (value) => {
    if (!routeRef.current || nodes.length < 2) return;
    const point = routeRef.current.getPointAtLength(value * routeRef.current.getTotalLength());
    markerX.set(point.x); markerY.set(point.y);
  });
  useEffect(() => {
    const lengths = segments.map((_, index) => segmentRefs.current[index]?.getTotalLength() ?? 0);
    const total = lengths.reduce((sum, value) => sum + value, 0);
    let accumulated = 0;
    setStops([0, ...lengths.map((length) => { accumulated += length; return total ? accumulated / total : 0; })]);
    markerX.set(nodes[0]?.x ?? 0); markerY.set(nodes[0]?.y ?? 0); progress.set(0);
  }, [segments, nodes, markerX, markerY, progress]);
  useEffect(() => {
    const animation = animate(progress, stops[active] ?? 0, { duration: reduce ? 0 : 1.2, ease: [.22, 1, .36, 1] });
    return () => animation.stop();
  }, [active, stops, progress, reduce]);
  return <div className={styles.routeCanvas}>
    <svg viewBox="0 0 600 320" aria-hidden className={styles.routeSvg}>
      <g className={styles.cityBlocks} fill="none" stroke="currentColor" strokeWidth="1">
        <rect x="70" y="55" width="90" height="64" rx="10" /><rect x="196" y="30" width="72" height="70" rx="10" /><rect x="330" y="208" width="93" height="70" rx="10" /><rect x="454" y="160" width="72" height="110" rx="10" />
        <path d="M 0 148 H 165 V 320 M 309 0 V 95 H 600 M 0 280 H 250 V 182 H 600" />
      </g>
      <path d={path} fill="none" stroke="#248bfb" strokeWidth="13" opacity=".12" />
      <motion.path initial={reduce ? false : { pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.3 }} ref={routeRef} d={path} fill="none" stroke="#409aff" strokeWidth="3" strokeLinecap="round" />
      {segments.map((segment, index) => <path key={index} ref={(element) => { segmentRefs.current[index] = element; }} d={`M ${segment.start.x} ${segment.start.y} ${segment.curve}`} fill="none" stroke="none" />)}
      {nodes.map((node, index) => <g key={index}>
        {index === active && !reduce && !paused && <motion.circle cx={node.x} cy={node.y} r="8" fill="none" stroke="#72b8ff" animate={{ r: [8, 18], opacity: [.6, 0] }} transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }} />}
        <circle cx={node.x} cy={node.y} r="6" fill={index <= active ? "#74bcff" : "#102942"} stroke="#74bcff" strokeWidth="2" />
        <text x={node.x} y={node.y + 26} textAnchor="middle" fontSize="12" fill="#b7cce3">{String(index + 1).padStart(2, "0")}</text>
      </g>)}
      {nodes.length > 0 && <motion.g style={{ x: markerX, y: markerY }} data-taxi-marker>
        <g transform="translate(-17 -20)"><rect width="34" height="17" rx="5" fill="#f2c65e" /><path d="M 7 0 L 11 -7 H 24 L 28 0" fill="#f2c65e" /><path d="M 12 -5 H 22 L 25 0 H 10 Z" fill="#14324b" /><circle cx="8" cy="17" r="4" fill="#03152b" /><circle cx="27" cy="17" r="4" fill="#03152b" /></g>
      </motion.g>}
    </svg>
  </div>;
}

function TripControlRoom({ solution }: { solution: Solution }) {
  const reduce = useContext(TaxiMotionPreference);
  const stages = useMemo(() => ordered(solution.journeyStages), [solution.journeyStages]);
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [manualPause, setManualPause] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [selection, setSelection] = useState(0);
  const stageIndex = Math.min(active, Math.max(0, stages.length - 1));
  const current = stages[stageIndex];
  const paused = hovered || focused || manualPause || hidden || !!reduce;
  const content = solution.taxiContent;
  const panelId = useId();
  const touch = useRef<{ x: number; y: number } | undefined>(undefined);
  useEffect(() => {
    const update = () => setHidden(document.hidden);
    update(); document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);
  useEffect(() => {
    if (paused || stages.length < 2) return;
    const timer = window.setTimeout(() => setActive((previous) => (previous + 1) % stages.length), 5000);
    return () => window.clearTimeout(timer);
  }, [paused, stages.length, active, selection]);
  const choose = (index: number) => { setActive(index); setSelection((value) => value + 1); };
  return <section className={`${styles.section} ${styles.controlRoom}`} data-trip-control-room onTouchStart={e => { touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }; }} onTouchEnd={e => { const start = touch.current; touch.current = undefined; if (!start || !stages.length) return; const dx = e.changedTouches[0].clientX - start.x, dy = e.changedTouches[0].clientY - start.y; if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) choose((stageIndex + (dx < 0 ? 1 : -1) + stages.length) % stages.length); }} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onFocusCapture={() => setFocused(true)} onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}>
    <div className="shell">
      <Reveal className={styles.controlHeading}><SectionHeading title={content?.journeyTitle} summary={content?.journeySummary} /><div className={styles.controlTools}>
        {content?.demoLabel && <span className={styles.demoBadge}><i />{content.demoLabel}</span>}
        {!reduce && stages.length > 1 && <button className={styles.pauseButton} type="button" aria-pressed={manualPause} onClick={() => setManualPause((value) => !value)}>{manualPause ? content?.resumeLabel : content?.pauseLabel}</button>}
      </div></Reveal>
      <div className={styles.controlGrid}>
        <Reveal className={styles.capabilities}>
          <div className={styles.tripVehicle}><Media media={{ type: "image", src: solution.vehicleImage }} alt={solution.name} contain /></div>
          <dl className={styles.tripDetails}>{current?.details?.map((item, index) => <div key={index}><dt>{item.label}</dt><dd>{item.value}</dd></div>)}</dl>
        </Reveal>
        <Reveal className={styles.mapPanel} delay={.06}><TripRoute stages={stages} active={stageIndex} paused={paused} />
          {current && <div className={styles.stageDetail} id={panelId} aria-live={paused ? "polite" : "off"} aria-atomic="true">
            <div className={styles.stageTextStack}>{stages.map((stage, index) => <div key={index} aria-hidden className={`${styles.stageText} ${styles.stageSizer}`}><span>{stage.status}</span><h3>{stage.title}</h3><p>{stage.description}</p></div>)}
              <AnimatePresence initial={false}><motion.div key={stageIndex} className={styles.stageText} initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduce ? 0 : .3 }}><span>{current.status}</span><h3>{current.title}</h3><p>{current.description}</p></motion.div></AnimatePresence>
            </div>
          </div>}
        </Reveal>
        <Reveal className={styles.timeline} delay={.12}>
          {stages.map((stage, index) => <button key={index} type="button" className={`${styles.stageButton} ${index === stageIndex ? styles.activeStage : ""}`} aria-pressed={index === stageIndex} aria-controls={panelId} onClick={() => choose(index)}><span className={styles.stageNumber}>{index < stageIndex ? <Icon name="check" className="h-4 w-4" /> : String(index + 1).padStart(2, "0")}</span><span><strong>{stage.label || stage.title}</strong>{stage.status && <small>{stage.status}</small>}</span></button>)}
        </Reveal>
      </div>
    </div>
  </section>;
}

function Signal({ start, end, delay = 0, reduce }: { start: Point; end: Point; delay?: number; reduce: boolean }) {
  return <g><path d={`M ${start.x} ${start.y} L ${end.x} ${end.y}`} stroke="#3895ed" strokeWidth="1.2" opacity=".45" fill="none" />{!reduce && <motion.circle r="2.5" fill="#379bff" animate={{ cx: [start.x, end.x], cy: [start.y, end.y], opacity: [0, .8, 0] }} transition={{ duration: 2.8, repeat: Infinity, repeatDelay: .6, delay, ease: "linear" }} />}</g>;
}

function ConnectedTechnology({ solution, devices, available }: { solution: Solution; devices: Device[]; available: Record<string, string> }) {
  const reduce = useContext(TaxiMotionPreference);
  const canvas = useRef<HTMLDivElement>(null);
  const vehicle = useRef<HTMLDivElement>(null);
  const cards = useRef(new Map<string, HTMLElement>());
  const measureConnectors = useRef<() => void>(() => {});
  const [connectors, setConnectors] = useState<Connector[]>([]);
  const [canvasSize, setCanvasSize] = useState({ width: 1, height: 1 });
  const [failed, setFailed] = useState<Record<string, string>>({});

  const visible = devices;
  const signature = visible.map(({ product }) => `${product.slug}:${product.image}`).join("|");
  useEffect(() => {
    const root = canvas.current, car = vehicle.current;
    if (!root || !car) return;
    const measure = () => {
      const bounds = root.getBoundingClientRect(), carBounds = car.getBoundingClientRect();
      setCanvasSize({ width: bounds.width, height: bounds.height });
      if (window.innerWidth < 1024) { setConnectors([]); return; }
      const center = { x: carBounds.left - bounds.left + carBounds.width / 2, y: carBounds.top - bounds.top + carBounds.height / 2 };
      setConnectors([...cards.current.entries()].map(([key, element]) => {
        const box = element.getBoundingClientRect();
        const left = box.left + box.width / 2 < carBounds.left + carBounds.width / 2;
        return { key, start: { x: (left ? box.right : box.left) - bounds.left, y: box.top - bounds.top + box.height / 2 }, end: { x: center.x + (left ? -carBounds.width * .25 : carBounds.width * .25), y: center.y } };
      }));
    };
    const observer = new ResizeObserver(measure);
    measureConnectors.current = measure;
    observer.observe(root); observer.observe(car); cards.current.forEach((element) => observer.observe(element));
    window.addEventListener("resize", measure); measure();
    return () => { observer.disconnect(); window.removeEventListener("resize", measure); measureConnectors.current = () => {}; };
  }, [signature]);
  const card = ({ product, recommendation }: Device, index: number) => <motion.article key={product.slug} ref={(element) => { if (element) cards.current.set(product.slug, element); else cards.current.delete(product.slug); }} className={styles.deviceCard} initial={reduce ? false : { opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: .45, delay: reduce ? 0 : index * .08 }} onAnimationComplete={() => measureConnectors.current()}>
    <div className={styles.deviceImage}><Media media={{ type: "image", src: product.image }} alt={product.name} contain onAvailability={(src, ok) => { if (!ok) setFailed((previous) => ({ ...previous, [product.slug]: src })); }} /></div>
    {(!product.image || available[product.slug] !== product.image || failed[product.slug] === product.image) && <small className={styles.imageNote}>{solution.taxiContent?.mediaFallback}</small>}
    <h3><Link href={`/products/${product.slug}`}>{product.name}</Link></h3><p>{recommendation?.explanation || product.description?.[0] || product.tagline}</p>
  </motion.article>;
  return <section className={`${styles.section} ${styles.connected}`}>
    <div className="shell"><Reveal><SectionHeading title={solution.technologyTitle} summary={solution.technologyDescription} /></Reveal>
      <div className={styles.connectedCanvas} ref={canvas}>
        <svg aria-hidden className={styles.connectors} viewBox={`0 0 ${canvasSize.width} ${canvasSize.height}`} preserveAspectRatio="none">{connectors.map((connector, index) => <Signal key={connector.key} start={connector.start} end={connector.end} delay={index * .3} reduce={!!reduce} />)}</svg>
        <div className={styles.deviceColumn}>{visible.filter((_, index) => index % 2 === 0).map(card)}</div>
        <div className={styles.vehicle} ref={vehicle}><Media media={{ type: "image", src: solution.vehicleImage }} alt={solution.name} contain /></div>
        <div className={styles.deviceColumn}>{visible.filter((_, index) => index % 2 === 1).map(card)}</div>
      </div>
      {visible.length === 0 && <div className={styles.emptyDevices}><Icon name="image" className="h-5 w-5" /><p>{solution.taxiContent?.mediaFallback}</p></div>}
    </div>
  </section>;
}

function SetupConsole({ solution, devices, onAvailability }: { solution: Solution; devices: Device[]; onAvailability: (slug: string, src: string, ok: boolean) => void }) {
  const reduce = useContext(TaxiMotionPreference);
  const [selected, setSelected] = useState<string>();
  const current = devices.find(item => item.product.slug === selected) ?? devices[0];
  return <section className={styles.setupSection}><div className="shell"><Reveal className={styles.setupConsole}>
    <div className={styles.setupMain}><SectionHeading title={solution.taxiContent?.setupTitle} summary={solution.taxiContent?.setupSummary} /><div className={styles.setupDevices}>{devices.map(({ product }, index) => <div className={styles.setupDevice} key={product.slug}>
      <button className={styles.selectProduct} aria-label={product.name} aria-pressed={current?.product.slug === product.slug} onClick={() => setSelected(product.slug)}><div className={styles.setupMedia}><Media media={{ type: "image", src: product.image }} alt={product.name} contain onAvailability={(src, ok) => onAvailability(product.slug, src, ok)} /></div><strong>{product.name}</strong></button>
      {index < devices.length - 1 && <div className={styles.setupSignal} aria-hidden>{!reduce && <motion.i animate={{ left: ["0%", "100%"], opacity: [0, .8, 0] }} transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 1, delay: index * .5, ease: "linear" }} />}</div>}
    </div>)}</div></div>
    <aside className={styles.setupAside}><h3>{solution.taxiContent?.setupReasonsTitle}</h3>{current && <motion.div key={current.product.slug} initial={reduce ? false : { opacity: .2 }} animate={{ opacity: 1 }}><p className={styles.selectedName}>{current.product.name}</p><p className={styles.selectedReason}>{current.recommendation?.explanation || current.product.description?.[0] || current.product.tagline}</p><div className={styles.actions}><Link className={styles.productAction} href={`/products/${current.product.slug}`}>{solution.taxiContent?.productActionLabel}<Icon name="arrowRight" className="h-4 w-4" /></Link><Link className="btn-primary !rounded-md" href={`/request-quote?solution=taxi&product=${encodeURIComponent(current.product.slug)}`}>{solution.taxiContent?.enquiryLabel}</Link></div></motion.div>}</aside>
  </Reveal></div></section>;
}

function Faq({ solution }: { solution: Solution }) {
  const [open, setOpen] = useState<number | null>(null);
  const reduce = useContext(TaxiMotionPreference);
  const id = useId();
  if (!solution.faqs?.length) return null;
  return <section className={`${styles.section} ${styles.faq}`}><div className="shell"><Reveal><SectionHeading title={solution.taxiContent?.faqTitle} /></Reveal><div className={styles.faqGrid}>{solution.faqs.map((faq, index) => <div className={styles.faqItem} key={index}>
    <h3><button type="button" onClick={() => setOpen(open === index ? null : index)} aria-expanded={open === index} aria-controls={`${id}-${index}`} id={`${id}-button-${index}`}>{faq.label}<span aria-hidden>{open === index ? "−" : "+"}</span></button></h3>
    <div id={`${id}-${index}`} role="region" aria-labelledby={`${id}-button-${index}`} hidden={open !== index}><motion.p initial={false} animate={{ opacity: open === index ? 1 : 0 }} transition={{ duration: reduce ? 0 : .2 }}>{faq.value}</motion.p></div>
  </div>)}</div></div></section>;
}

export default function CabTaxiExperience({ solution, products }: { solution: Solution; products: Product[] }) {
  // The server and first client render must agree before using the OS preference.
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduce(preference.matches);
    update(); preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);
  const [available, setAvailable] = useState<Record<string, string>>({});
  const devices = useMemo(() => {
    const bySlug = new Map(products.filter((product) => product.published).map((product) => [product.slug, product]));
    const recommendations = ordered(solution.recommendedProducts);
    const slugs = [...new Set([...recommendations.map((item) => item.productSlug), ...(solution.relatedProductSlugs ?? [])])];
    return slugs.flatMap((slug): Device[] => { const product = bySlug.get(slug); return product ? [{ product, recommendation: recommendations.find((item) => item.productSlug === slug) }] : []; });
  }, [products, solution.recommendedProducts, solution.relatedProductSlugs]);
  const onAvailability = useCallback((slug: string, src: string, ok: boolean) => setAvailable((previous) => {
    const next = ok ? src : "";
    return previous[slug] === next ? previous : { ...previous, [slug]: next };
  }), []);
  return <TaxiMotionPreference.Provider value={reduce}><div className={styles.page} data-cab-taxi>
    <Hero solution={solution} />
    {!!solution.painPoints?.length && <section className={styles.section}><div className="shell"><Reveal><SectionHeading title={solution.taxiContent?.challengeTitle} summary={solution.taxiContent?.challengeSummary} /></Reveal><div className={styles.challengeGrid}>{ordered(solution.painPoints).slice(0, 3).map((item, index) => <Reveal key={index} delay={index * .06} className={styles.challenge}><Icon name={item.icon} className="h-6 w-6" /><h3>{item.title}</h3><p>{item.description}</p></Reveal>)}</div></div></section>}
    <TripControlRoom solution={solution} />
    <ConnectedTechnology solution={solution} devices={devices} available={available} />
    <SetupConsole solution={solution} devices={devices} onAvailability={onAvailability} />
    {!!solution.benefits?.length && <section className={styles.section}><div className="shell"><Reveal><SectionHeading title={solution.outcomeTitle} summary={solution.outcomeSummary} /></Reveal><div className={styles.benefitGrid}>{ordered(solution.benefits).map((benefit, index) => <Reveal key={index} delay={index * .06} className={styles.benefit}><Icon name={benefit.icon} className="h-6 w-6" /><h3>{benefit.title}</h3><p>{benefit.description}</p></Reveal>)}</div></div></section>}
    <Faq solution={solution} />
    <section className={styles.finalCta}><div className={styles.ctaMedia}>{solution.ctaMedia?.src && <Media media={solution.ctaMedia} alt="" decorative />}</div><div className={`shell ${styles.ctaInner}`}><div><h2>{solution.ctaTitle}</h2><p>{solution.ctaSummary}</p></div><div className={styles.actions}>{solution.ctaPrimaryLabel && <Link className="btn-primary !rounded-lg" href={taxiCtaHref(solution.ctaPrimaryHref, "/contact")}>{solution.ctaPrimaryLabel}</Link>}{solution.ctaSecondaryLabel && <Link className={styles.outlineButton} href={taxiCtaHref(solution.ctaSecondaryHref, "/request-quote")}>{solution.ctaSecondaryLabel}</Link>}</div></div></section>
  </div></TaxiMotionPreference.Provider>;
}
