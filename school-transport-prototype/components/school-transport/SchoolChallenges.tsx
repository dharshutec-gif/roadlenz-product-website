"use client";
import { motion, useReducedMotion } from "framer-motion";
import { schoolTransport as data } from "@/data/schoolTransport";

export function SchoolChallenges(){const r=useReducedMotion();return <section className="challenges section"><div className="shell"><h2 className="section-title">Built around the school run.</h2><motion.div className="challenge-grid" initial="hidden" whileInView="show" viewport={{once:true,amount:.25}} variants={{show:{transition:{staggerChildren:r?0:.12}}}}>{data.challenges.map((c,i)=><motion.article key={c.title} variants={{hidden:{opacity:0,y:r?0:14},show:{opacity:1,y:0}}}><motion.span className={`line-icon icon-${c.icon}`} initial={{opacity:0,scale:r?1:.82}} whileInView={{opacity:1,scale:1}} viewport={{once:true}} transition={{delay:r?0:i*.1}} aria-hidden>{i===0?"◉":i===1?"♢":"▤"}</motion.span><div><h3>{c.title}</h3><p>{c.text}</p></div></motion.article>)}</motion.div></div></section>}
