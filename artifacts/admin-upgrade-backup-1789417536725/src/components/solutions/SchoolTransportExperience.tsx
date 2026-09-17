"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Icon } from "@/components/ui";
import type { Product, Solution } from "@/lib/types";

type Device = {
  recommendation: NonNullable<Solution["recommendedProducts"]>[number];
  product: Product;
};

const reveal = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export default function PremiumSolutionExperience({
  solution,
  products,
}: {
  solution: Solution;
  products: Product[];
}) {
  const reduceMotion = useReducedMotion();
  const devices = (solution.recommendedProducts ?? [])
    .slice()
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .map((recommendation) => ({
      recommendation,
      product: products.find((product) => product.slug === recommendation.productSlug),
    }))
    .filter((item): item is Device => Boolean(item.product));
  const featured =
    devices.find(({ product }) => product.name.toLowerCase().includes("mdvr")) ??
    devices[0];
  const reasons = (solution.benefits ?? []).map((benefit) => benefit.description);

  return (
    <main className="overflow-x-clip bg-white">
      <section className="relative isolate overflow-hidden bg-[#031329] text-white lg:h-[430px]">
        <motion.div
          className="absolute inset-0 -z-20"
          animate={reduceMotion ? undefined : { scale: [1, 1.045, 1], x: [0, -8, 0] }}
          transition={{ duration: 18, ease: "easeInOut", repeat: Infinity }}
        >
          {solution.heroMedia.type === "video" ? (
            <video muted playsInline autoPlay loop poster={solution.heroMedia.poster} className="h-full w-full object-cover">
              <source src={solution.heroMedia.src} />
            </video>
          ) : (
            <Image src={solution.heroMedia.src} alt="" fill priority sizes="100vw" className="object-cover" />
          )}
        </motion.div>
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(2,14,31,.98)_0%,rgba(3,20,42,.90)_40%,rgba(3,20,42,.45)_68%,rgba(3,20,42,.18)_100%)]" />
        <motion.div
          className="absolute bottom-0 left-0 h-px w-full origin-left bg-gradient-to-r from-transparent via-[#138ff7] to-transparent"
          animate={reduceMotion ? undefined : { scaleX: [0.15, 1, 0.15], opacity: [0.25, 0.9, 0.25] }}
          transition={{ duration: 4.5, ease: "easeInOut", repeat: Infinity }}
        />
        <div className="shell flex min-h-[365px] items-center py-12 sm:min-h-[400px] lg:h-[430px] lg:min-h-0 lg:py-0">
          <motion.div
            className="max-w-[560px]"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
          >
            <motion.p variants={reveal} transition={{ duration: 0.55 }} className="text-[10px] font-extrabold uppercase tracking-[.2em] text-[#49b4ff]">
              {solution.industry || "RoadLenz Solution"}
            </motion.p>
            <motion.p variants={reveal} transition={{ duration: 0.55 }} className="mt-2 text-sm font-semibold text-white/72">{solution.name}</motion.p>
            <motion.h1 variants={reveal} transition={{ duration: 0.62 }} className="mt-3 max-w-[540px] font-display text-3xl font-extrabold leading-[1.08] sm:text-4xl lg:text-[2.65rem]">{solution.heroTitle}</motion.h1>
            <motion.p variants={reveal} transition={{ duration: 0.62 }} className="mt-4 max-w-[500px] line-clamp-2 text-sm leading-6 text-white/72">{solution.heroSummary}</motion.p>
            <motion.div variants={reveal} transition={{ duration: 0.62 }}>
              <Link href={solution.heroCtaHref || "#capabilities"} className="btn-primary mt-6 w-fit !min-h-10 !rounded-md !px-5 !text-xs">
                {solution.heroCtaLabel || "Explore the solution"} <Icon name="arrowRight" className="h-4 w-4" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="relative overflow-hidden border-b border-[#dbe8f5] bg-[#f8fbfd] py-10 sm:py-14">
        <div className="pointer-events-none absolute inset-0 opacity-50 [background-image:linear-gradient(rgba(30,130,255,.06)_1px,transparent_1px),linear-gradient(90deg,rgba(30,130,255,.06)_1px,transparent_1px)] [background-size:52px_52px]" />
        <div className="shell relative grid items-center gap-7 lg:grid-cols-[.8fr_1.2fr]">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={reveal} transition={{ duration: 0.6 }}>
            <p className="eyebrow">Connected operation <span className="text-red-500">•</span></p>
            <h2 className="max-w-sm font-display text-2xl font-extrabold leading-tight text-[#071a35]">{solution.name}, connected from every angle.</h2>
            {solution.trustLine ? <p className="mt-4 max-w-sm text-xs leading-5 text-[#58697d]">{solution.trustLine}</p> : null}
            <div className="mt-6 flex flex-wrap gap-2">
              {devices.slice(0, 5).map(({ product }) => <span key={product.id} className="rounded-full border border-[#a7cbed] bg-white px-3 py-1.5 text-[9px] font-bold text-[#17679d]">{product.name}</span>)}
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 36 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: 0.8 }} className="relative min-h-[245px] overflow-hidden rounded-2xl border border-[#c9e0f3] bg-[radial-gradient(circle_at_50%_80%,#d7edff_0,transparent_45%),linear-gradient(135deg,#fafdff,#eaf5ff)] shadow-[0_18px_45px_rgba(5,58,110,.10)] sm:min-h-[290px]">
            <motion.div className="absolute inset-x-[6%] bottom-5 h-px bg-gradient-to-r from-transparent via-[#1394ff] to-transparent" animate={reduceMotion ? undefined : { scaleX: [0.7, 1, 0.7], opacity: [0.35, 0.95, 0.35] }} transition={{ duration: 4, repeat: Infinity }} />
            <motion.div className="absolute inset-x-[6%] bottom-2 h-1 rounded-full bg-[#bcdff9]" animate={reduceMotion ? undefined : { x: [0, 18, 0] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }} />
            <motion.div className="absolute inset-0" animate={reduceMotion ? undefined : { x: [0, 14, 0], y: [0, -4, 0] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}>
              <Image src={solution.vehicleImage} alt={`${solution.name} vehicle`} fill sizes="(max-width:1024px) 100vw, 60vw" className="object-contain p-4 sm:p-6" />
            </motion.div>
            <motion.span className="absolute bottom-7 left-7 inline-flex items-center gap-2 rounded-full border border-[#9bcdf5] bg-white/90 px-3 py-1.5 text-[9px] font-extrabold uppercase tracking-[.13em] text-[#087ad5] shadow-sm" animate={reduceMotion ? undefined : { opacity: [0.65, 1, 0.65] }} transition={{ duration: 2.4, repeat: Infinity }}><span className="h-1.5 w-1.5 rounded-full bg-[#0ca2ff]" /> Live operation</motion.span>
          </motion.div>
        </div>
      </section>

      <section id="capabilities" className="relative scroll-mt-20 overflow-hidden bg-[#f8fbfd] py-16 sm:py-24">
        <span id="school-technology" className="absolute top-0" />
        <div className="pointer-events-none absolute inset-0 opacity-[.5] [background-image:linear-gradient(rgba(30,130,255,.06)_1px,transparent_1px),linear-gradient(90deg,rgba(30,130,255,.06)_1px,transparent_1px)] [background-size:56px_56px]" />
        <div className="shell relative">
          <div className="relative min-h-[760px] xl:min-h-[870px]">
            <motion.div className="relative z-10 max-w-[290px] pt-20 sm:pt-28" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.25 }} variants={reveal} transition={{ duration: 0.65 }}>
              <p className="eyebrow">Intelligence Inside <span className="text-red-500">•</span></p>
              <h2 className="font-display text-3xl font-extrabold leading-[1.08] text-[#071a35]">{solution.technologyTitle}<span className="text-red-500">.</span></h2>
              <p className="mt-5 text-xs leading-5 text-[#58697d]">{solution.technologyDescription}</p>
              <a href="#recommended-setup" className="mt-7 inline-flex items-center gap-2 text-xs font-bold text-[#078af1]">Explore Technologies <span className="grid h-4 w-4 place-items-center rounded-full border border-current">›</span></a>
            </motion.div>

            <div className="absolute inset-x-0 top-0 hidden lg:block">
              {devices.slice(0, 3).map(({ product, recommendation }, index) => (
                <motion.article key={product.id} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={reveal} transition={{ duration: 0.55, delay: index * 0.13 }} className={`absolute top-0 w-[210px] ${index === 0 ? "left-[30%]" : index === 1 ? "left-[54%]" : "right-0"}`}>
                  <div className="flex items-start gap-3">
                    <motion.span animate={reduceMotion ? undefined : { y: [0, -5, 0] }} transition={{ duration: 4.5 + index, repeat: Infinity, ease: "easeInOut" }} className="relative h-16 w-20 shrink-0">
                      <Image src={product.image || solution.deviceConsoleMedia?.src || solution.vehicleImage} alt="" fill sizes="80px" className="object-contain" />
                    </motion.span>
                    <div><h3 className="text-xs font-extrabold text-[#078af1]">{product.name}</h3><p className="mt-1 text-[9px] leading-4 text-[#43546a]">{product.tagline}</p></div>
                  </div>
                  <p className="mt-3 text-[9px] leading-4"><strong>Why:</strong> {recommendation.explanation}</p>
                  <p className="mt-2 text-[9px] leading-4"><strong>What:</strong> {recommendation.performance}</p>
                </motion.article>
              ))}
            </div>

            <motion.div className="relative mx-auto mt-12 h-[350px] w-full max-w-[1050px] lg:absolute lg:left-[18%] lg:top-[245px] lg:mt-0 lg:h-[460px] lg:w-[82%]" initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.9 }}>
              <motion.div className="absolute inset-[12%] rounded-full border border-[#138ff7]/20" animate={reduceMotion ? undefined : { scale: [0.94, 1.04, 0.94], opacity: [0.25, 0.65, 0.25] }} transition={{ duration: 5.5, repeat: Infinity }} />
              <Image src={solution.blueprintMedia?.src || solution.vehicleImage} alt={`${solution.name} technology placement`} fill sizes="(max-width:1024px) 100vw, 82vw" className="relative object-contain" />
            </motion.div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:absolute lg:inset-x-[12%] lg:bottom-0 lg:grid-cols-2 lg:gap-[40%]">
              {devices.slice(3, 5).map(({ product, recommendation }, index) => (
                <motion.article key={product.id} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={reveal} transition={{ duration: 0.55, delay: index * 0.14 }} className="grid grid-cols-[78px_1fr] gap-3 rounded-xl border border-[#168ef4]/10 bg-white/80 p-4 shadow-[0_14px_35px_rgba(6,48,88,.06)] lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none">
                  <span className="relative h-20 w-[78px]"><Image src={product.image || solution.deviceConsoleMedia?.src || solution.vehicleImage} alt="" fill sizes="78px" className="object-contain" /></span>
                  <div><h3 className="text-xs font-extrabold text-[#078af1]">{product.name}</h3><p className="mt-2 text-[9px] leading-4"><strong>Why:</strong> {recommendation.explanation}</p><p className="mt-2 text-[9px] leading-4"><strong>What:</strong> {recommendation.performance}</p></div>
                </motion.article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="recommended-setup" className="bg-[#f8fbfd] pb-20 sm:pb-24">
        <div className="shell">
          <motion.div initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.7 }} className="overflow-hidden rounded-xl bg-[radial-gradient(circle_at_34%_45%,#073b70_0,#052442_24%,#02162c_62%,#011126_100%)] text-white shadow-[0_22px_55px_rgba(3,21,46,.22)]">
            <div className="grid lg:grid-cols-[1.25fr_.55fr]">
              <div className="relative p-7 sm:p-9">
                <motion.span className="pointer-events-none absolute left-0 top-0 h-px w-1/3 bg-[#159bff]" animate={reduceMotion ? undefined : { x: ["-120%", "400%"] }} transition={{ duration: 3.7, repeat: Infinity, ease: "linear" }} />
                <h2 className="text-sm font-semibold">Recommended RoadLenz Setup <span className="text-red-500">•</span></h2>
                <div className="mt-8 grid gap-8 md:grid-cols-[180px_1fr]">
                  {featured ? <div><div className="relative h-36"><motion.div className="absolute inset-0" animate={reduceMotion ? undefined : { y: [0, -5, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}><Image src={featured.product.image || solution.deviceConsoleMedia?.src || solution.vehicleImage} alt={featured.product.name} fill sizes="180px" className="object-contain drop-shadow-[0_15px_16px_rgba(0,145,255,.45)]" /></motion.div></div><h3 className="mt-3 font-display text-base font-bold">{featured.product.name}</h3><p className="mt-2 text-[10px] leading-4 text-white/65">{featured.product.tagline}</p><Link href={`/products/${featured.product.slug}`} className="btn-primary mt-6 !min-h-10 !rounded !px-5 !text-xs">View Product <Icon name="arrowRight" className="h-3.5 w-3.5" /></Link></div> : null}
                  <div className="flex items-center gap-3 overflow-x-auto pb-3">{devices.map(({ product }, index) => <motion.div key={product.id} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="min-w-[86px] text-center"><span className="relative mx-auto block h-20 w-20"><Image src={product.image || solution.deviceConsoleMedia?.src || solution.vehicleImage} alt="" fill sizes="80px" className="object-contain" /></span><strong className="mt-2 block text-[10px] leading-4">{product.name}</strong><span className="mt-1 block text-[8px] leading-3 text-white/55">{product.tagline}</span></motion.div>)}</div>
                </div>
              </div>
              <aside className="border-t border-white/20 p-7 sm:p-9 lg:border-l lg:border-t-0"><h2 className="text-sm font-semibold">Why this setup works <span className="text-red-500">•</span></h2><p className="mt-5 text-[10px] leading-5 text-white/65">This connected combination brings operational visibility, verifiable evidence and proactive safety into one RoadLenz setup.</p><ul className="mt-5 space-y-3">{reasons.map((reason, index) => <motion.li key={reason} initial={{ opacity: 0, x: 10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.08 }} className="flex gap-2 text-[10px] text-white/80"><span className="grid h-4 w-4 shrink-0 place-items-center rounded-full border border-[#0799ff] text-[#0799ff]">✓</span>{reason}</motion.li>)}</ul><Link href={`/request-quote?solution=${encodeURIComponent(solution.slug)}`} className="btn-primary mt-7 w-full justify-center !rounded">Add to Enquiry <Icon name="arrowRight" className="h-4 w-4" /></Link><Link href="/products" className="mt-3 flex min-h-11 items-center justify-center rounded border border-white/35 text-xs font-semibold">View All Products</Link></aside>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-white py-16 sm:py-20">
        <div className="shell relative">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.35 }} variants={reveal} transition={{ duration: 0.6 }}><p className="text-center text-[10px] font-extrabold uppercase tracking-[.2em] text-[#078df4]">Operational outcomes</p><h2 className="mt-3 text-center font-display text-2xl font-extrabold text-[#071a35]">What this delivers</h2></motion.div>
          <div className="mt-10 grid divide-y divide-line md:grid-cols-2 md:divide-x md:divide-y-0 xl:grid-cols-4">{(solution.benefits ?? []).map((benefit, index) => <motion.article key={benefit.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.5, delay: index * 0.1 }} className="flex gap-4 px-5 py-6 first:pl-0 last:pr-0"><motion.span animate={reduceMotion ? undefined : { y: [0, -3, 0] }} transition={{ duration: 3.6 + index * 0.45, repeat: Infinity, ease: "easeInOut" }}><Icon name={benefit.icon} className="h-9 w-9 shrink-0 text-[#078df4]" /></motion.span><div><h3 className="text-xs font-extrabold text-[#078df4]">{benefit.title}</h3><p className="mt-2 text-[10px] leading-5 text-ink-muted">{benefit.description}</p></div></motion.article>)}</div>
        </div>
      </section>

      <section className="relative min-h-[380px] overflow-hidden bg-[#03152e] text-white">
        <motion.div className="absolute inset-0" animate={reduceMotion ? undefined : { scale: [1, 1.04, 1], x: [0, -8, 0] }} transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}><Image src={solution.ctaMedia?.src || "/media/solutions/roadlenz-cta-map.jpg"} alt="Connected route map" fill sizes="100vw" className="object-cover" /></motion.div>
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,17,36,.98),rgba(3,22,45,.76)_48%,rgba(3,21,46,.08))]" />
        <div className="shell relative flex min-h-[380px] items-center py-16"><motion.div className="max-w-xl" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={{ visible: { transition: { staggerChildren: 0.12 } } }}><motion.h2 variants={reveal} transition={{ duration: 0.6 }} className="font-display text-4xl font-extrabold leading-[1.04] sm:text-5xl">{solution.ctaTitle}<span className="text-red-500">.</span></motion.h2><motion.p variants={reveal} transition={{ duration: 0.6 }} className="mt-5 max-w-md text-sm leading-6 text-white/70">{solution.ctaSummary}</motion.p><motion.div variants={reveal} transition={{ duration: 0.6 }} className="mt-8 flex flex-wrap gap-4"><Link href={solution.ctaPrimaryHref || `/contact?solution=${solution.slug}`} className="btn-primary !rounded-md">{solution.ctaPrimaryLabel || "Talk to an Expert"}<Icon name="arrowRight" className="h-4 w-4" /></Link><Link href={solution.ctaSecondaryHref || `/request-quote?solution=${solution.slug}`} className="inline-flex min-h-12 items-center gap-3 rounded-md border border-white/35 px-6 text-sm font-bold">{solution.ctaSecondaryLabel || "Request a Quote"}<Icon name="arrowRight" className="h-4 w-4" /></Link></motion.div></motion.div></div>
      </section>
    </main>
  );
}
