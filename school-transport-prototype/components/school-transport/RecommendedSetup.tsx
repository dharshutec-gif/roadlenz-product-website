"use client";
import Image from "next/image";
import { motion,useReducedMotion } from "framer-motion";
import { schoolTransport as data } from "@/data/schoolTransport";

export function RecommendedSetup(){
  const r=useReducedMotion();
  return <section className="setup-wrap"><motion.div className="shell setup" initial={{opacity:0,y:r?0:16}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.2}}>
    <div className="setup-main"><h2><i/>Recommended RoadLenz Setup</h2>
      <motion.div className="setup-products" initial="hidden" whileInView="show" viewport={{once:true}} variants={{show:{transition:{staggerChildren:r?0:.1}}}}>
        <div className="setup-line" aria-hidden/><motion.div className="setup-pulse" aria-hidden animate={r?{opacity:0}:{x:["-100%","580%"],opacity:[0,1,1,0]}} transition={r?{duration:0}:{duration:1.6,repeat:Infinity,repeatDelay:2.4}}/>
        {data.devices.map((d,i)=><motion.article key={d.name} variants={{hidden:{opacity:0,y:r?0:12},show:{opacity:1,y:0}}} whileHover={r?undefined:{y:-4,filter:"drop-shadow(0 8px 12px rgba(31,142,255,.35))"}}><Image src={d.image} alt="" width={92} height={72}/><strong>{d.name}</strong><span>{i===0?"Smart video capture with AI alerts":i===1?"Multi-channel recording with remote access":i===2?"Real-time tracking and geofence alerts":i===3?"Detects fatigue & distractions":"Automated student attendance"}</span></motion.article>)}
      </motion.div>
    </div>
    <aside><h3>Why this setup works</h3><ul>{data.setupReasons.map(x=><li key={x}><i>✓</i>{x}</li>)}</ul><a className="button primary" href="#quote">Request Quote</a></aside>
  </motion.div></section>;
}
