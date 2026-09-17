"use client";
import Link from "next/link";
import { useState } from "react";
import { Icon } from "@/components/ui";
import { type PublicResource,resourceTypeLabels } from "@/lib/resource-content";
import ResourceMedia from "./ResourceMedia";
import styles from "./ResourcesHub.module.css";
export default function ResourceDetail({resource:r}:{resource:PublicResource}) {
  const [failed,setFailed]=useState(false);
  return <article className={`${styles.page} ${styles.detail}`}><Link href="/resources" className={styles.backLink}>Resources<Icon name="chevronRight"/>{resourceTypeLabels[r.type]}</Link><p className={styles.eyebrow}>{resourceTypeLabels[r.type]}</p><h1>{r.title}</h1><p className={styles.detailIntro}>{r.description}</p><p className={styles.meta}>{[r.meta,r.category].filter(Boolean).join(" · ")}</p>{r.video && !failed ? <video controls playsInline preload="metadata" poster={r.poster||undefined} aria-label={r.title} onError={()=>setFailed(true)}><source src={r.video}/></video> : <ResourceMedia resource={r}/>}<div className={styles.detailBody}>{(r.answer||r.body).split(/\n\s*\n/).filter(Boolean).map((paragraph,index)=><p key={index}>{paragraph}</p>)}{!r.body && !r.answer && !r.file && !r.video && <p>The full resource is being prepared. Contact the team for more information.</p>}{failed && <p>This video is temporarily unavailable. Contact the team for help accessing it.</p>}</div>{r.file && <a href={r.file.startsWith("/api/") ? `${r.file}?download=1` : r.file} download className={styles.button}>Download {r.fileType}<Icon name="download"/></a>}{r.relatedLinks.length>0 && <aside className={styles.detailRelated}><h2>Explore the connected solution</h2>{r.relatedLinks.map(link=><Link key={link.href} href={link.href}>{link.label}<Icon name="arrowRight"/></Link>)}</aside>}<div className={styles.detailFooter}><Link href="/resources">Back to resources</Link><Link href="/contact">Talk to an Expert<Icon name="arrowRight"/></Link></div></article>;
}
