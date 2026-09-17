"use client";
import { useState } from "react";
import { AnimatePresence,motion,useReducedMotion } from "framer-motion";
import { schoolTransport as data } from "@/data/schoolTransport";
export function SchoolFaq(){const [open,setOpen]=useState<number|null>(0),r=useReducedMotion();return <section className="faq section"><div className="shell faq-inner"><h2 className="section-title">Frequently asked questions</h2><div className="faq-list">{data.faqs.map((f,i)=>{const active=open===i;return <article key={f.question}><button aria-expanded={active} aria-controls={`faq-${i}`} onClick={()=>setOpen(active?null:i)}><span>{f.question}</span><motion.i animate={{rotate:r?0:active?45:0}}>+</motion.i></button><AnimatePresence initial={false}>{active&&<motion.div id={`faq-${i}`} initial={{height:0,opacity:0}} animate={{height:"auto",opacity:1}} exit={{height:0,opacity:0}} transition={{duration:r?0:.25}}><p>{f.answer}</p></motion.div>}</AnimatePresence></article>})}</div></div></section>}
