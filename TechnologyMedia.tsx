"use client";

import { useId, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { Icon } from "@/components/ui";
import { technologySettings, type TechnologyMedia as Media, type WorkspaceKind } from "@/lib/technology-capabilities";
import styles from "./TechnologyExperience.module.css";

const labels: Record<WorkspaceKind, string> = { fleet: "Live Fleet", video: "Video Telematics", safety: "AI Safety", playback: "Playback", reports: "Reports & Insights", health: "Vehicle Health" };
const icons: Record<WorkspaceKind, string> = { fleet: "pin", video: "video", safety: "shield", playback: "clock", reports: "doc", health: "gauge" };

function MapView({ selected, onSelect }: { selected: number; onSelect: (index: number) => void }) {
  return <div className={styles.mapView}>
    <svg viewBox="0 0 600 400" preserveAspectRatio="none" aria-hidden="true" className={styles.mapRoads}>
      <path className={styles.mapLand} d="M0 50 100 0 130 140 260 200 200 400H0ZM420 0H600V400L440 340 510 250 380 100Z" />
      <g className={styles.minorRoads}><path d="M0 90 600 270M0 280 600 80M100 0 380 400M460 0 240 400M0 190 600 360M0 340 600 130M210 0 70 400M320 0 570 400M0 50 600 210" /></g>
      <path className={styles.majorRoads} d="M0 380C230 230 140 110 600 20M30 0C300 90 250 300 600 370M0 200C200 290 420 65 600 140" />
      <path className={styles.mapRoute} d="M115 290 170 220 275 200 340 125 465 100" />
      <path className={styles.mapPulse} d="M115 290 170 220 275 200 340 125 465 100" />
    </svg>
    <span className={styles.mapLabel}>Illustrative route</span>
    {[[22,67],[48,49],[77,29]].map(([left,top],index) => <button key={index} type="button" className={`${styles.marker} ${selected === index ? styles.markerSelected : ""}`} style={{ left: `${left}%`, top: `${top}%` }} onClick={() => onSelect(index)} aria-label={`Preview vehicle ${String.fromCharCode(65+index)}`} aria-pressed={selected === index}><Icon name="car" /></button>)}
    <div className={styles.mapKey}><i />Vehicle location <span>Preview map</span></div>
  </div>;
}

function CameraView({ cabin = false, alert = false }: { cabin?: boolean; alert?: boolean }) {
  return <div className={`${styles.cameraView} ${cabin ? styles.cabinView : ""}`}>
    {cabin ? <><Icon name="driver" /><span>Cabin camera placeholder</span></> : <><svg viewBox="0 0 520 270" preserveAspectRatio="none" aria-hidden="true"><path fill="#7e9cae" d="M0 0H520V150H0Z" /><path fill="#405767" d="M0 140 50 100 120 144 210 110 300 140 420 90 520 135V270H0Z" /><path fill="#263b4e" d="M225 135H295L480 270H40Z" /><path stroke="#b7cedc" strokeWidth="3" strokeDasharray="12 12" d="M258 142 232 270M275 142 330 270" /><path fill="#89a3b7" stroke="#c1d4df" d="M243 135H285V184H243ZM247 184V191M281 184V191" />{alert && <rect x="232" y="125" width="64" height="76" fill="none" stroke="#ff664f" strokeWidth="2" />}</svg><span>Road camera placeholder</span></>}
  </div>;
}

function Placeholder({ kind, label }: { kind: WorkspaceKind; label: string }) {
  const [selected, setSelected] = useState(0);
  const [view, setView] = useState("Road");
  const [progress, setProgress] = useState(35);
  const id = useId();
  const choices = kind === "reports" ? ["Fleet", "Safety", "Activity"] : kind === "health" ? ["Fuel", "Temperature", "I/O", "Battery", "Device"] : ["Road", "Cabin"];
  return <div className={styles.console} aria-label={label}>
    <div className={styles.consoleHeader}><span className={styles.consoleBrand}><Icon name="layers" /> RoadLenz</span><span>{labels[kind]}</span><span className={styles.previewBadge}>UI preview</span></div>
    <div className={styles.consoleBody}>
      <aside className={styles.consoleRail} aria-hidden="true">{(Object.keys(labels) as WorkspaceKind[]).map(key => <span key={key} className={kind === key ? styles.railActive : ""}><Icon name={icons[key]} /><span>{labels[key]}</span></span>)}</aside>
      <div className={styles.consoleMain}>
        <div className={styles.consoleToolbar}><span><i className={styles.statusDot} />{kind === "safety" ? "Event review preview" : "Workspace preview"}</span><span>Illustrative data</span></div>
        {kind === "fleet" ? <div className={styles.fleetGrid}><div className={styles.vehicleList}><p>Vehicle selection</p>{["A","B","C"].map((letter,index) => <button type="button" key={letter} onClick={() => setSelected(index)} aria-pressed={selected === index} className={selected === index ? styles.listSelected : ""}><Icon name="car" /><span>Vehicle {letter}<small>Example vehicle</small></span><Icon name="chevronRight" /></button>)}<div className={styles.vehicleDetail} aria-live="polite"><Icon name="gps" /><strong>Vehicle {String.fromCharCode(65+selected)}</strong><span>Location and state appear here when a source is connected.</span></div></div><MapView selected={selected} onSelect={setSelected} /></div> : null}
        {kind === "video" || kind === "safety" ? <><div className={styles.previewControls} role="group" aria-label="Preview camera view">{choices.map(choice => <button type="button" key={choice} aria-pressed={view === choice} onClick={() => setView(choice)}>{choice}</button>)}</div><div className={styles.videoGrid}><CameraView cabin={view === "Cabin"} alert={kind === "safety"} /><div className={styles.evidencePanel}><Icon name={kind === "safety" ? "shield" : "video"} /><h4>{kind === "safety" ? "Alert evidence" : "Journey context"}</h4><p>{kind === "safety" ? "Example risk event" : "Selected camera view"}</p><dl><dt>Vehicle</dt><dd>Example vehicle</dd><dt>Event time</dt><dd>Awaiting source</dd><dt>Location</dt><dd>Awaiting source</dd></dl><span className={styles.evidenceNote}>{kind === "safety" ? "For review, with supporting evidence" : "Road and cabin, aligned in time"}</span></div></div><div className={styles.timeline}><span>Event timeline</span><div><i /></div><Icon name="clock" /></div></> : null}
        {kind === "playback" ? <><div className={styles.playbackGrid}><MapView selected={selected} onSelect={setSelected} /><div><CameraView /><div className={styles.playbackEvents}><Icon name="pin" /><span>Route position</span><Icon name="video" /><span>Matching video</span></div></div></div><label className={styles.replayControl} htmlFor={`${id}-replay`}><Icon name="clock" /><span>Preview timeline</span><input id={`${id}-replay`} aria-label="Preview journey position" type="range" min="0" max="100" value={progress} onChange={event => setProgress(Number(event.target.value))} /><output>{progress}%</output></label><p className={styles.replayNote}>Timeline position is illustrative; no recorded journey is loaded.</p></> : null}
        {kind === "reports" ? <><div className={styles.reportToolbar}><h4>{view === "Road" ? "Fleet" : view} overview</h4><div className={styles.previewControls} role="group" aria-label="Preview report type">{choices.map(choice => <button type="button" key={choice} aria-pressed={(view === "Road" ? "Fleet" : view) === choice} onClick={() => setView(choice)}>{choice}</button>)}</div></div><div className={styles.chart} aria-label="Illustrative chart layout, no real metrics"><div className={styles.chartBars} aria-hidden="true">{[30,48,37,65,43,75,57,38,66,80,50,71,43,61,83,70].map((n,index) => <i key={index} style={{ height: `${view === "Safety" ? 100-n : view === "Activity" ? Math.max(15,n-18) : n}%` }} />)}</div><span>Reporting period</span></div><div className={styles.reportMetrics}>{["Fleet activity","Safety events","Journey patterns"].map(text => <div key={text}><span>{text}</span><strong>—</strong><small>Connect a report source</small></div>)}</div></> : null}
        {kind === "health" ? <div className={styles.healthGrid}><div className={styles.signalList} role="group" aria-label="Preview sensor signal">{choices.map((choice,index) => <button type="button" key={choice} aria-pressed={selected === index} onClick={() => setSelected(index)}><Icon name={index === 0 ? "fuel" : index === 4 ? "chip" : "gauge"} /><span>{choice}</span><i /></button>)}</div><div className={styles.sensorDetail} aria-live="polite"><div className={styles.sensorRing}><Icon name={selected === 0 ? "fuel" : selected === 4 ? "chip" : "gauge"} /></div><h4>{choices[selected]} signal</h4><p>Reading appears here when a compatible source is connected.</p><div className={styles.signalTrack}><i /></div><span>Sensor and device-health preview</span></div></div> : null}
      </div>
    </div>
    <div className={styles.consoleFooter}><span>{technologySettings.placeholderLabel}</span><span>No live connection</span></div>
  </div>;
}

export default function TechnologyMedia({ media, compact = false }: { media: Media; compact?: boolean }) {
  const [failed, setFailed] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref, { amount: .1 });
  const placeholder = media.type === "placeholder" || !media.src || failed;
  return <figure className={`${styles.mediaFigure} ${compact ? styles.compactMedia : ""}`}>
    <div ref={ref} className={styles.mediaFrame} data-visible={visible} data-workspace={media.workspace}>
      {placeholder ? <div className={styles.mediaScroll} tabIndex={0} role="region" aria-label={`${labels[media.workspace]} preview. Scroll horizontally on smaller screens.`}><Placeholder kind={media.workspace} label={media.alt} /></div> : media.type === "video" ? <video key={media.src} className={styles.realMedia} controls playsInline preload="metadata" poster={media.poster || undefined} aria-label={media.alt} onError={() => setFailed(true)}><source src={media.src} /></video> : <img key={media.src} className={styles.realMedia} src={media.src} alt={media.alt} loading="lazy" onError={() => setFailed(true)} />}
    </div>
    {placeholder && <figcaption>{failed ? "Media unavailable. " : ""}{technologySettings.placeholderNote}</figcaption>}
  </figure>;
}
