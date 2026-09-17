"use client";
import Image from "next/image";
import { useState } from "react";
import { Icon } from "@/components/ui";
import { resourceTypeLabels,type PublicResource } from "@/lib/resource-content";
import styles from "./ResourcesHub.module.css";
export default function ResourceMedia({resource,cover=false,priority=false}:{resource:PublicResource;cover?:boolean;priority?:boolean}) {
  const [failed,setFailed]=useState(false);
  return <div className={`${styles.resourceMedia} ${cover ? styles.cover : ""}`}>
    {resource.image && !failed ? <Image src={resource.image} alt={resource.title} fill sizes={cover ? "(max-width: 600px) 65vw, 300px" : "(max-width: 600px) 80vw, 480px"} priority={priority} unoptimized={resource.image.startsWith("/api/")} onError={()=>setFailed(true)} /> : <div className={styles.documentArt} aria-label={`${resource.title} — placeholder cover`} role="img"><span>RoadLenz</span><small>{resourceTypeLabels[resource.type] ?? resource.type}</small><strong>{resource.title}</strong><div aria-hidden="true"><Icon name={resource.type === "video" || resource.type === "webinar" ? "play" : "doc"} /><i /><i /><i /></div><em>Knowledge in motion</em></div>}
  </div>;
}
