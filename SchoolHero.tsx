"use client";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { schoolTransport as data } from "@/data/schoolTransport";

export function SchoolHero() {
  const reduced = useReducedMotion();
  const item = { hidden:{opacity:0,y:reduced?0:18}, show:{opacity:1,y:0} };
  return <section className="hero">
    <motion.div className="hero-media" animate={reduced?{scale:1}:{scale:[1,1.045,1],x:[0,-8,0]}} transition={reduced?{duration:0}:{duration:28,repeat:Infinity,ease:"easeInOut"}}><Image src="/images/school-hero.jpg" alt="Yellow school bus arriving at a school" fill priority sizes="100vw"/></motion.div>
    <div className="hero-shade"/><motion.div className="shell hero-copy" initial="hidden" animate="show" variants={{show:{transition:{staggerChildren:reduced?0:.1}}}}>
      <motion.p variants={item} className="eyebrow">{data.hero.eyebrow}</motion.p><motion.h1 variants={item}>{data.hero.title}</motion.h1><motion.p variants={item} className="hero-description">{data.hero.description}</motion.p>
      <motion.div variants={item} className="button-row"><a className="button primary" href="#quote">Request Quote</a><a className="button secondary" href="#contact">Talk to an Expert</a></motion.div>
    </motion.div>
    <motion.div className="status-strip" initial={{opacity:0,y:reduced?0:12}} animate={{opacity:1,y:0}} transition={{delay:reduced?0:.55}}>{data.hero.status.map((value,i)=><span key={value} className={i===1?"moving":""}>{i===1&&<i/>}{value}</span>)}<motion.b aria-hidden animate={reduced?{opacity:.35}:{opacity:[.2,.9,.2],scaleX:[.2,1,.2]}} transition={reduced?{duration:0}:{duration:4,repeat:Infinity}}/></motion.div>
  </section>;
}
