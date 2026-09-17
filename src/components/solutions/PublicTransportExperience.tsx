"use client";
import Image from "next/image";
import Link from "next/link";
import { animate, motion, useMotionValue, useMotionValueEvent } from "framer-motion";
import { createContext, useCallback, useContext, useEffect, useId, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { Icon } from "@/components/ui";
import type { MediaRef, Product, Solution, SolutionJourneyStage, SolutionRecommendedProduct } from "@/lib/types";
import styles from "./PublicTransportExperience.module.css";
const MotionPreference = createContext(false);
const ordered = <T extends { order?: number }>(items: T[] | undefined): T[] => (Array.isArray(items) ? items : []).slice().sort((a,b)=>(a.order??0)-(b.order??0));
const usableSrc = (src?: string) => !!src && (/^\/(?!\/)/.test(src) || /^https?:\/\//.test(src));
type Device = { product: Product; recommendation?: SolutionRecommendedProduct };
export function transitCtaHref(href: string | undefined, fallback: string) { const path = href?.split('?')[0]; return (path === '/contact' || path === '/request-quote' ? path : fallback) + '?solution=public-transport'; }
function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduce = useContext(MotionPreference);
  return <motion.div className={`${styles.reveal} ${className}`} initial={reduce ? false : { opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .12 }} transition={{ duration: .5, delay: reduce ? 0 : delay, ease: "easeOut" }}>{children}</motion.div>;
}

function Media({ media, alt, contain = false, priority = false, decorative = false, onAvailability }: {
  media?: MediaRef; alt: string; contain?: boolean; priority?: boolean; decorative?: boolean;
  onAvailability?: (src: string, available: boolean) => void;
}) {
  const reduce = useContext(MotionPreference);
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

function TransitRoute({ stages, active, paused }: { stages: SolutionJourneyStage[]; active: number; paused: boolean }) {
  const reduce = useContext(MotionPreference);
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
    const bendY = start.y + (end.y - start.y) * .3;
    return { start, curve: `C ${midX - 30} ${start.y}, ${midX - 30} ${bendY}, ${midX} ${bendY} S ${end.x - 22} ${end.y}, ${end.x} ${end.y}` };
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
      <rect width="600" height="320" fill="#071e34" />
      <g fill="#163650" stroke="#4c7b9e" strokeOpacity=".25" strokeWidth="1">
        {Array.from({ length: 30 }, (_, i) => <rect key={i} x={15 + (i % 6) * 100} y={14 + Math.floor(i / 6) * 61} width={55 + i % 3 * 8} height="35" rx="3" transform={`rotate(${i % 2 ? -8 : 6} ${45 + i % 6 * 100} ${32 + Math.floor(i / 6) * 61})`} />)}
      </g>
      <g fill="none" stroke="#5286ac" opacity=".2"><path d="M0 90L185 75L300 115L600 65M0 225L160 200L330 250L600 235M110 0L140 320M320 0L295 320M490 0L510 320" strokeWidth="9"/><path d="M0 156L600 175M220 0L200 320M420 0L440 320" strokeWidth="3"/></g>
      <path d="M560 0 C430 90 590 155 490 220 S420 290 440 320" fill="none" stroke="#183f59" strokeWidth="23" opacity=".8" />
      <g fill="#214b4b" opacity=".65"><ellipse cx="245" cy="64" rx="35" ry="20"/><ellipse cx="475" cy="275" rx="46" ry="21"/></g>
      <path d={path} fill="none" stroke="#248bfb" strokeWidth="13" opacity=".12" />
      <motion.path initial={reduce ? false : { pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.4 }} ref={routeRef} d={path} fill="none" stroke="#409aff" strokeWidth="3" strokeLinecap="round" />
      {segments.map((segment, index) => <path key={index} ref={(element) => { segmentRefs.current[index] = element; }} d={`M ${segment.start.x} ${segment.start.y} ${segment.curve}`} fill="none" stroke="none" />)}
      {nodes.map((node, index) => <g key={index}>
        {index === active && !reduce && !paused && <motion.circle cx={node.x} cy={node.y} r="8" fill="none" stroke="#72b8ff" animate={{ r: [8, 18], opacity: [.6, 0] }} transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }} />}
        <circle cx={node.x} cy={node.y} r="6" fill={index <= active ? "#74bcff" : "#102942"} stroke="#74bcff" strokeWidth="2" />
        <text x={node.x} y={node.y + 26} textAnchor="middle" fontSize="12" fill="#b7cce3">{String(index + 1).padStart(2, "0")}</text>
      </g>)}
      {nodes.length > 0 && <motion.g style={{ x: markerX, y: markerY }} data-bus-marker>
        <g transform="translate(-28 -20)"><rect width="56" height="26" rx="4" fill="#1686cf" stroke="#b4e1ff" strokeWidth="1.5"/><path d="M4 4H13V14H4ZM16 4H25V14H16ZM28 4H37V14H28ZM40 4H52V14H40Z" fill="#0b2c46"/><path d="M1 19H55" stroke="#cceafa" strokeWidth="3"/><path d="M39 15V25" stroke="#e1f0fa"/><circle cx="11" cy="27" r="5" fill="#10263d" stroke="#b4c6d2"/><circle cx="45" cy="27" r="5" fill="#10263d" stroke="#b4c6d2"/></g>
      </motion.g>}
    </svg>
  </div>;
}


function Heading({ eyebrow, title, summary }: { eyebrow?: string; title?: string; summary?: string }) {
  return <div className={styles.heading}><div>{eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}{title && <h2>{title}</h2>}</div>{summary && <p>{summary}</p>}</div>;
}
function Hero({ solution }: { solution: Solution }) {
  const reduce = useContext(MotionPreference);
  const reveal = { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } };
  return <section className={styles.hero}>
    <motion.div className={styles.heroMedia} animate={reduce ? { scale: 1, x: 0 } : { scale: [1, 1.035, 1], x: [0, -7, 0] }} transition={{ duration: reduce ? 0 : 28, repeat: reduce ? 0 : Infinity }}><Media media={solution.heroMedia} alt={solution.name} priority decorative /></motion.div><div className={styles.heroShade} />
    <div className="shell w-full"><motion.div className={styles.heroContent} initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: reduce ? 0 : .09 } } }}>
      <motion.p variants={reveal} className={styles.eyebrow}>{solution.name}</motion.p><motion.h1 variants={reveal}>{solution.heroTitle}</motion.h1><motion.p variants={reveal}>{solution.heroSummary}</motion.p>
      <motion.div variants={reveal} className={styles.actions}><Link className="btn-primary" href={transitCtaHref(solution.heroCtaHref, '/request-quote')}>{solution.heroCtaLabel}</Link><Link className={styles.outlineButton} href={transitCtaHref(solution.ctaPrimaryHref, '/contact')}>{solution.ctaPrimaryLabel}</Link></motion.div>
    </motion.div><div className={styles.heroStrip}>{!reduce && <motion.i className={styles.telemetrySignal} animate={{ scaleX: [.05, 1], opacity: [0, .7, 0] }} transition={{ duration: 4, repeat: Infinity }} />}{solution.liveStatus?.map((item, i) => <span key={i}><i /><small>{item.label}</small>{item.value}</span>)}{solution.transitContent?.demoLabel && <small>{solution.transitContent.demoLabel}</small>}</div></div>
  </section>;
}
function TransitOperationsRoom({ solution }: { solution: Solution }) {
  const reduce = useContext(MotionPreference), content = solution.transitContent ?? {};
  const stages = useMemo(() => ordered(solution.journeyStages), [solution.journeyStages]);
  const [active, setActive] = useState(0), [hover, setHover] = useState(false), [focus, setFocus] = useState(false), [manual, setManual] = useState(false), [hidden, setHidden] = useState(false), [revision, setRevision] = useState(0);
  const touch = useRef<{ x: number; y: number } | undefined>(undefined);
  const paused = reduce || hover || focus || manual || hidden;
  const choose = (index: number) => { setActive(stages.length ? (index + stages.length) % stages.length : 0); setRevision(v => v + 1); };
  useEffect(() => { const update = () => setHidden(document.hidden); update(); document.addEventListener('visibilitychange', update); return () => document.removeEventListener('visibilitychange', update); }, []);
  useEffect(() => { if (paused || stages.length < 2) return; const timer = window.setTimeout(() => setActive(v => (v + 1) % stages.length), 5000); return () => window.clearTimeout(timer); }, [paused, active, stages.length, revision]);
  useEffect(() => { setActive(v => Math.min(v, Math.max(0, stages.length - 1))); }, [stages.length]);
  const stage = stages[active];
  return <section id="transit-operations-room" className={`${styles.dark} ${styles.control}`} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} onFocusCapture={() => setFocus(true)} onBlurCapture={e => { if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocus(false); }} onTouchStart={e => { touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }; }} onTouchEnd={e => { const start = touch.current; touch.current = undefined; if (!start || !e.changedTouches.length) return; const dx = e.changedTouches[0].clientX - start.x, dy = e.changedTouches[0].clientY - start.y; if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) choose(active + (dx < 0 ? 1 : -1)); }}>
    <div className="shell"><Heading eyebrow={content.journeyEyebrow} title={content.journeyTitle} summary={content.journeySummary} />
      <div className={styles.controlGrid}><div className={styles.telemetry}><div className={styles.thumbnail}><Media media={{ type: 'image', src: solution.vehicleImage }} alt={solution.name} contain /></div><dl>{stage?.details?.map((item, i) => <div key={i}><dt>{item.label}</dt><dd>{item.value}</dd></div>)}</dl></div>
        <div><TransitRoute stages={stages} active={active} paused={paused} /><div className={styles.stageCopy}>{stages.map((item, i) => <motion.p key={i} aria-hidden={i !== active} initial={false} animate={{ opacity: i === active ? 1 : 0 }} transition={{ duration: reduce ? 0 : .25 }}>{item.description}</motion.p>)}</div></div>
        <div className={styles.stages}><h3>{content.stageHeading}</h3>{stages.map((item, index) => <button key={index} className={styles.stageButton} aria-pressed={index === active} onClick={() => choose(index)}><span>{String(index + 1).padStart(2, '0')}</span><span><strong>{item.label || item.title}</strong><small>{item.status}</small></span></button>)}</div>
      </div><div className={styles.controlFooter}><span>{content.demoLabel}</span>{stages.length > 1 && !reduce && <button aria-pressed={manual} onClick={() => setManual(v => !v)}>{manual ? content.resumeLabel : content.pauseLabel}</button>}</div>
    </div>
  </section>;
}
function DeviceMedia({ device, fallback }: { device: Device; fallback?: string }) {
  const [loaded, setLoaded] = useState(false);
  return <><div className={styles.deviceImage}><Media key={device.product.image} media={{ type: 'image', src: device.product.image }} alt={device.product.name} contain onAvailability={(_, available) => setLoaded(available)} /></div>{!loaded && <small className={styles.fallbackLabel}>{fallback}</small>}</>;
}
function Signal({ d, delay = 0 }: { d: string; delay?: number }) {
  const reduce = useContext(MotionPreference);
  return <><path d={d} fill="none" stroke="#1688ff" strokeWidth="1.2" opacity=".6" />{!reduce && <motion.path d={d} fill="none" stroke="#5dc5ff" strokeWidth="3" style={{ pathLength: .055, pathSpacing: .945 }} animate={{ pathOffset: [0, 1], opacity: [0, .85, 0] }} transition={{ duration: 3.2, repeat: Infinity, delay, ease: 'linear' }} />}</>;
}
function ConnectedTechnology({ solution, devices }: { solution: Solution; devices: Device[] }) {
  const content = solution.transitContent ?? {}, root = useRef<HTMLDivElement>(null), vehicle = useRef<HTMLDivElement>(null), cards = useRef<(HTMLDivElement | null)[]>([]);
  const [paths, setPaths] = useState<string[]>([]);
  const measure = useCallback(() => { if (!root.current || !vehicle.current) return; const box = root.current.getBoundingClientRect(), car = vehicle.current.getBoundingClientRect(); setPaths(cards.current.slice(0, devices.length).flatMap((card, index) => { if (!card) return []; const rect = card.getBoundingClientRect(), left = index % 2 === 0, x1 = (left ? rect.right : rect.left) - box.left, y1 = rect.top + rect.height / 2 - box.top, x2 = car.left - box.left + car.width * (left ? .2 : .8), y2 = car.top - box.top + car.height * (.38 + Math.floor(index / 2) * .16 % .4), mid = (x1 + x2) / 2; return [`M ${x1} ${y1} C ${mid} ${y1}, ${mid} ${y2}, ${x2} ${y2}`]; })); }, [devices.length]);
  useEffect(() => { const observer = new ResizeObserver(measure); [root.current, vehicle.current, ...cards.current].forEach(el => { if (el) observer.observe(el); }); measure(); return () => observer.disconnect(); }, [measure]);
  const card = (device: Device, index: number) => <div key={device.product.slug} ref={el => { cards.current[index] = el; }}><Reveal delay={index * .07}><article className={styles.device}><div><DeviceMedia device={device} fallback={content.mediaFallback} /></div><div><h3><Link href={`/products/${device.product.slug}`}>{device.product.name}</Link></h3><p>{device.recommendation?.explanation || device.product.tagline || device.product.description[0]}</p></div></article></Reveal></div>;
  return <section className={styles.light}><div className="shell"><Heading eyebrow={content.technologyEyebrow} title={solution.technologyTitle} summary={solution.technologyDescription} /><div className={styles.diagram} ref={root}><svg className={styles.connectors} aria-hidden>{paths.map((d, i) => <Signal key={i} d={d} delay={i * .3} />)}</svg><div className={styles.deviceColumn}>{devices.map((d, i) => i % 2 === 0 ? card(d, i) : null)}</div><div className={styles.vehicle} ref={vehicle}><Media media={{ type: 'image', src: solution.vehicleImage }} alt={solution.name} contain /></div><div className={styles.deviceColumn}>{devices.map((d, i) => i % 2 ? card(d, i) : null)}</div></div>{!devices.length && <p className={styles.empty}>{content.emptyProductsLabel}</p>}</div></section>;
}
function Setup({ solution, devices }: { solution: Solution; devices: Device[] }) {
  const content = solution.transitContent ?? {}, reduce = useContext(MotionPreference), [selected, setSelected] = useState<string>();
  const device = devices.find(item => item.product.slug === selected) ?? devices[0];
  return <section className={styles.dark}><div className="shell"><Heading eyebrow={content.setupEyebrow} title={content.setupTitle} /><div className={styles.console}><div className={styles.productList}>{devices.map(item => <button key={item.product.slug} aria-label={item.product.name} className={styles.productButton} aria-pressed={item === device} onClick={() => setSelected(item.product.slug)}><DeviceMedia device={item} fallback={content.mediaFallback} /><span>{item.product.name}</span></button>)}<svg viewBox="0 0 600 4" preserveAspectRatio="none" className={styles.consoleSignal} aria-hidden><Signal d="M 0 2 H 600" /></svg></div>{device ? <div className={styles.consoleDetail}><h3>{content.setupReasonsTitle}</h3><motion.div key={device.product.slug} initial={{ opacity: reduce ? 1 : .2 }} animate={{ opacity: 1 }} transition={{ duration: .25 }}><p><strong>{device.product.name}</strong></p><p>{device.recommendation?.explanation || device.product.description[0]}</p>{device.recommendation?.performance && <p>{device.recommendation.performance}</p>}<div className={styles.actions}><Link className={styles.outlineButton} href={`/products/${device.product.slug}`}>{content.productActionLabel}</Link><Link className="btn-primary" href={`/request-quote?product=${encodeURIComponent(device.product.slug)}&solution=public-transport`}>{content.enquiryLabel}</Link></div></motion.div></div> : <p className={styles.empty}>{content.emptyProductsLabel}</p>}</div></div></section>;
}
function Faq({ solution }: { solution: Solution }) {
  const [open, setOpen] = useState<number>(), id = useId();
  if (!solution.faqs?.length) return null;
  return <section className={`${styles.white} ${styles.faqSection}`}><div className="shell"><Heading title={solution.transitContent?.faqTitle} /><div className={styles.faqGrid}>{solution.faqs?.map((faq, index) => <article className={styles.faq} key={index}><button aria-expanded={open === index} aria-controls={`${id}-${index}`} onClick={() => setOpen(open === index ? undefined : index)}>{faq.label}<Icon name={open === index ? 'chevronDown' : 'plus'} /></button><div id={`${id}-${index}`} hidden={open !== index}><p>{faq.value}</p></div></article>)}</div></div></section>;
}
export default function PublicTransportExperience({ solution, products }: { solution: Solution; products: Product[] }) {
  const [reduce, setReduce] = useState(false);
  useEffect(() => { const media = matchMedia('(prefers-reduced-motion: reduce)'), update = () => setReduce(media.matches); update(); media.addEventListener('change', update); return () => media.removeEventListener('change', update); }, []);
  const devices = useMemo(() => { const recommendations = ordered(solution.recommendedProducts), slugs = [...new Set([...recommendations.map(item => item.productSlug), ...(solution.relatedProductSlugs ?? [])])]; return slugs.flatMap(slug => { const product = products.find(item => item.slug === slug && item.published); return product ? [{ product, recommendation: recommendations.find(item => item.productSlug === slug) }] : []; }); }, [solution.recommendedProducts, solution.relatedProductSlugs, products]);
  const content = solution.transitContent ?? {};
  return <MotionPreference.Provider value={reduce}><div className={styles.page}><Hero solution={solution} /><section className={styles.light}><div className="shell"><Heading eyebrow={content.challengeEyebrow} title={content.challengeTitle} summary={content.challengeSummary} /><div className={styles.three}>{ordered(solution.painPoints).slice(0, 3).map((item, i) => <Reveal key={i} delay={i * .08} className={styles.item}><Icon name={item.icon || 'pin'} /><div><h3>{item.title}</h3><p>{item.description}</p></div></Reveal>)}</div></div></section><TransitOperationsRoom solution={solution} /><ConnectedTechnology solution={solution} devices={devices} /><Setup solution={solution} devices={devices} /><section className={styles.light}><div className="shell"><Heading eyebrow={content.outcomeEyebrow} title={solution.outcomeTitle} summary={solution.outcomeSummary} /><div className={styles.four}>{ordered(solution.benefits).slice(0, 4).map((item, i) => <Reveal key={i} delay={i * .07} className={styles.item}><Icon name={item.icon || 'shield'} /><div><h3>{item.title}</h3><p>{item.description}</p></div></Reveal>)}</div></div></section><Faq solution={solution} /></div></MotionPreference.Provider>;
}

