"use client";
import { motion,useReducedMotion } from "framer-motion";
import { schoolTransport as data } from "@/data/schoolTransport";

export function SchoolBenefits(){
  const r=useReducedMotion();
  return <section className="benefits section"><motion.div className="shell benefit-grid" initial="hidden" whileInView="show" viewport={{once:true,amount:.3}} variants={{show:{transition:{staggerChildren:r?0:.1}}}}>
    {data.benefits.map((b,i)=><motion.article key={b.title} variants={{hidden:{opacity:0,y:r?0:12},show:{opacity:1,y:0}}}><motion.span initial={{scale:r?1:.85}} whileInView={{scale:1}} viewport={{once:true}}>{i===0?"♢":i===1?"◷":i===2?"▥":"♧"}</motion.span><div><h3>{b.title}</h3><p>{b.text}</p></div></motion.article>)}
  </motion.div></section>;
}
