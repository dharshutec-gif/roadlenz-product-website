"use client";

import { motion } from "framer-motion";
import { Icon } from "@/components/ui";

const capabilities = [
  { icon: "pin", title: "Live GPS Tracking", copy: "See vehicle location, movement and route context in real time." },
  { icon: "video", title: "Live Video", copy: "Bring road and cabin visibility into daily fleet operations." },
  { icon: "shield", title: "AI Safety", copy: "Review safety events and driver-risk context where configured." },
  { icon: "alert", title: "Alerts", copy: "Surface critical fleet events so teams can respond faster." },
  { icon: "doc", title: "Reports", copy: "Turn fleet activity into practical operational reporting." },
  { icon: "fleet", title: "Fleet Management", copy: "Organize vehicles, companies and day-to-day fleet control." },
] as const;

const journey = [
  { number: "01", icon: "link", title: "Connect", copy: "Bring vehicles and RoadLenz devices onto one connected platform." },
  { number: "02", icon: "pin", title: "Track", copy: "Follow live location, movement, trips and operational status." },
  { number: "03", icon: "video", title: "Monitor", copy: "Watch video, review alerts and understand what is happening." },
  { number: "04", icon: "gauge", title: "Act", copy: "Use clear fleet intelligence to make faster operational decisions." },
] as const;

const values = [
  { icon: "shield", title: "Engineered Hardware", copy: "Purpose-built vehicle technology designed for demanding operating environments." },
  { icon: "eye", title: "Connected Visibility", copy: "Bring location, video and vehicle information together in one operational view." },
  { icon: "fleet", title: "Flexible Solutions", copy: "Adapt RoadLenz to different vehicles, fleet structures and operational requirements." },
  { icon: "headphones", title: "Expert Support", copy: "Backed by RoadLenz and Bigfox Engineering for deployment and ongoing support." },
] as const;

const reveal = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0 },
};

export default function SolutionsAdditions() {
  return (
    <>
      <section className="relative overflow-hidden border-y border-[#dce9f7] bg-[linear-gradient(180deg,#f7fbff_0%,#ffffff_100%)] py-20">
        <div className="pointer-events-none absolute inset-0 opacity-60 [background-image:linear-gradient(rgba(18,89,214,.035)_1px,transparent_1px),linear-gradient(90deg,rgba(18,89,214,.035)_1px,transparent_1px)] [background-size:52px_52px]" />
        <div className="pointer-events-none absolute -left-24 top-10 h-64 w-64 rounded-full bg-brand-100/70 blur-3xl" />
        <div className="shell relative">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
            className="mx-auto max-w-[760px] text-center"
          >
            <motion.p variants={reveal} className="text-[11px] font-bold uppercase tracking-[.18em] text-brand-700">
              One Connected Platform
            </motion.p>
            <motion.h2 variants={reveal} className="mt-3 font-display text-[clamp(2rem,3.2vw,3rem)] font-bold leading-[1.05] tracking-[-.04em] text-ink">
              One Platform. Every Operation.
            </motion.h2>
            <motion.p variants={reveal} className="mx-auto mt-4 max-w-[650px] text-[15px] leading-6 text-ink-muted">
              The operation may change, but the intelligence layer stays connected. RoadLenz brings tracking, video, safety, alerts and fleet reporting into one practical platform.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07 } } }}
            className="mt-11 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {capabilities.map((item, index) => (
              <motion.article
                key={item.title}
                variants={reveal}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.24 }}
                className="group relative min-h-[150px] overflow-hidden rounded-2xl border border-[#dce9f7] bg-white p-5 shadow-[0_12px_35px_rgba(9,33,74,.055)]"
              >
                <span className="pointer-events-none absolute inset-x-5 bottom-0 h-px origin-left scale-x-0 bg-gradient-to-r from-transparent via-brand-400 to-transparent transition-transform duration-300 group-hover:scale-x-100" />
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-brand-100 bg-brand-50 text-brand-600">
                  <Icon name={item.icon} className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-display text-lg font-bold text-ink">{item.title}</h3>
                <p className="mt-2 text-[13px] leading-5 text-ink-muted">{item.copy}</p>
                <span className="absolute right-4 top-4 font-display text-[11px] font-bold text-brand-200">0{index + 1}</span>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#041a36] py-20 text-white">
        <div className="pointer-events-none absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_50%_0%,rgba(30,146,255,.35),transparent_42%),linear-gradient(rgba(94,158,247,.13)_1px,transparent_1px),linear-gradient(90deg,rgba(94,158,247,.13)_1px,transparent_1px)] [background-size:auto,56px_56px,56px_56px]" />
        <div className="shell relative">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            className="max-w-[690px]"
          >
            <p className="text-[11px] font-bold uppercase tracking-[.18em] text-brand-300">From Vehicle Data to Fleet Action</p>
            <h2 className="mt-3 font-display text-[clamp(2rem,3vw,2.8rem)] font-bold leading-[1.08] tracking-[-.04em]">
              A simpler way to smarter operations.
            </h2>
            <p className="mt-4 max-w-[620px] text-[15px] leading-6 text-white/65">
              RoadLenz turns connected vehicle data into a clear operational flow — from onboarding and visibility to monitoring and action.
            </p>
          </motion.div>

          <div className="relative mt-12">
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 1.15, ease: [0.22, 1, 0.36, 1] }}
              className="absolute left-[8%] right-[8%] top-[31px] hidden h-px origin-left bg-gradient-to-r from-brand-400/10 via-brand-400 to-brand-400/10 lg:block"
            />
            <motion.span
              initial={{ left: "7%", opacity: 0 }}
              whileInView={{ left: "91%", opacity: [0, 1, 1, 0] }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 1.55, delay: 0.45 }}
              className="absolute top-[27px] z-20 hidden h-2 w-2 rounded-full bg-white shadow-[0_0_18px_#30c8ff] ring-4 ring-brand-400/20 lg:block"
            />

            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.15 }}
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
              className="relative grid gap-7 sm:grid-cols-2 lg:grid-cols-4"
            >
              {journey.map((item) => (
                <motion.article key={item.number} variants={reveal} className="relative">
                  <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full border border-brand-300/35 bg-[#08264c] text-brand-300 shadow-[0_0_30px_rgba(34,155,255,.08)]">
                    <Icon name={item.icon} className="h-6 w-6" />
                  </div>
                  <p className="mt-6 font-display text-sm font-bold text-brand-300">{item.number}</p>
                  <h3 className="mt-1 font-display text-xl font-bold">{item.title}</h3>
                  <p className="mt-2 max-w-[245px] text-[13px] leading-5 text-white/62">{item.copy}</p>
                </motion.article>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-white py-20">
        <div className="pointer-events-none absolute right-[-8%] top-[-30%] h-96 w-96 rounded-full bg-brand-50 blur-3xl" />
        <div className="shell relative">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            className="grid items-end gap-6 lg:grid-cols-[1fr_1fr]"
          >
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[.18em] text-brand-700">Why RoadLenz</p>
              <h2 className="mt-3 max-w-[580px] font-display text-[clamp(2rem,3vw,2.8rem)] font-bold leading-[1.08] tracking-[-.04em] text-ink">
                Built Around the Real World.
              </h2>
            </div>
            <p className="max-w-[560px] text-[15px] leading-6 text-ink-muted lg:justify-self-end">
              RoadLenz combines practical engineering, connected fleet visibility and deployment support for real operating environments — not just ideal conditions.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
            className="mt-11 grid border-y border-[#dce7f1] md:grid-cols-2 lg:grid-cols-4"
          >
            {values.map((item, index) => (
              <motion.article
                key={item.title}
                variants={reveal}
                className={`relative px-5 py-8 ${index > 0 ? "lg:border-l lg:border-[#dce7f1]" : ""}`}
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                  <Icon name={item.icon} className="h-5 w-5" />
                </span>
                <h3 className="mt-5 font-display text-[17px] font-bold text-ink">{item.title}</h3>
                <p className="mt-3 text-[13px] leading-5 text-ink-muted">{item.copy}</p>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>
    </>
  );
}
