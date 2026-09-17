"use client";
import { useEffect,useState } from "react";
import { animate,motion,useMotionValue,useReducedMotion,useTransform } from "framer-motion";
import { schoolTransport as data } from "@/data/schoolTransport";

export function SchoolJourneyMap(){
  const reduced=useReducedMotion(),[active,setActive]=useState(1),[paused,setPaused]=useState(false); const progress=useMotionValue<number>(data.stages[1].progress); const offsetDistance=useTransform(progress,v=>`${v}%`);
  useEffect(()=>{if(reduced||paused)return;const id=setInterval(()=>setActive(v=>(v+1)%data.stages.length),5000);return()=>clearInterval(id)},[paused,reduced]);
  useEffect(()=>{animate(progress,data.stages[active].progress,{duration:reduced?0:.9,ease:"easeInOut"})},[active,progress,reduced]);
  return <section className="route-room" onMouseEnter={()=>setPaused(true)} onMouseLeave={()=>setPaused(false)}><div className="shell route-grid">
    <div className="route-intro"><div className="title-live"><h2>The Route Room.</h2><span>LIVE</span></div><p>Live journey intelligence for every school bus—updated in real time.</p><dl>{data.journeyStats.map(([k,v])=><div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl><a href="#technology">View full trip details <span>→</span></a></div>
    <div className="map" aria-label="Animated route map for Bus 36"><div className="map-grid"/><svg viewBox="0 0 620 420" role="img" aria-label="Route from pickup to Riverside Elementary"><path className="route-shadow" d="M72 353 C95 282 210 302 220 226 S133 147 257 127 S390 183 416 101 S535 80 570 47"/><path className="route-line" d="M72 353 C95 282 210 302 220 226 S133 147 257 127 S390 183 416 101 S535 80 570 47"/><circle cx="72" cy="353" r="7"/><circle cx="220" cy="226" r="7"/><circle cx="416" cy="101" r="7"/><circle cx="570" cy="47" r="7"/></svg><motion.div className="bus-marker" style={{offsetDistance}}>BUS</motion.div></div>
    <div className="stage-list" role="tablist" aria-label="Journey stages">{data.stages.map((s,i)=><button key={s.title} role="tab" aria-selected={active===i} onClick={()=>setActive(i)} className={active===i?"active":""}><span>{s.time}</span><strong>{s.title}</strong><motion.p key={active===i?`a-${i}`:`i-${i}`} initial={{opacity:0}} animate={{opacity:1}}>{s.place}<small>{s.note}</small></motion.p></button>)}</div>
  </div></section>
}
