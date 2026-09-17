"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./GlobalGlobe.module.css";

type Office = {
  id: string;
  title: string;
  officeType: string;
  city: string;
  region?: string;
  country: string;
  address: string[];
  phone?: string;
  email?: string;
  mapsUrl: string;
  tone?: string;
};

type GlobeOffice = Office & {
  lat: number;
  lon: number;
  color: string;
};

const GEO: Record<string, Pick<GlobeOffice, "lat" | "lon" | "color">> = {
  "chennai-headquarters": { lat: 12.97204, lon: 80.08971, color: "#168df2" },
  "chennai-production-unit": { lat: 12.91738, lon: 80.08588, color: "#168df2" },
  bangalore: { lat: 13.007516, lon: 77.695935, color: "#168df2" },
  "germany-office": { lat: 49.57010, lon: 10.99920, color: "#168df2" },
  "netherlands-office": { lat: 51.420994, lon: 5.394675, color: "#168df2" },
  "usa-office": { lat: 37.78360, lon: -121.54730, color: "#168df2" },
};

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

export default function GlobalGlobe({ offices }: { offices: Office[] }) {
  const globeOffices = useMemo<GlobeOffice[]>(
    () =>
      offices
        .map((office) => {
          const geo = GEO[office.id];
          return geo ? { ...office, ...geo } : null;
        })
        .filter(Boolean) as GlobeOffice[],
    [offices]
  );

  const defaultOffice =
    globeOffices.find((office) => office.id === "chennai-headquarters") ??
    globeOffices[0];

  const [selectedId, setSelectedId] = useState(defaultOffice?.id ?? "");
  const [rotation, setRotation] = useState(80);
  const [dragging, setDragging] = useState(false);
  const [hoveringPin, setHoveringPin] = useState(false);

  const lastX = useRef(0);
  const rafRef = useRef<number | null>(null);
  const lastTime = useRef<number | null>(null);

  const selected =
    globeOffices.find((office) => office.id === selectedId) ?? defaultOffice;

  useEffect(() => {
    const tick = (time: number) => {
      if (lastTime.current == null) lastTime.current = time;
      const delta = time - lastTime.current;
      lastTime.current = time;

      if (!dragging && !hoveringPin) {
        setRotation((value) => (value + delta * 0.0026) % 360);
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, [dragging, hoveringPin]);

  const project = (office: GlobeOffice) => {
    const lat = (office.lat * Math.PI) / 180;
    const relativeLon = ((office.lon - rotation) * Math.PI) / 180;

    const x = Math.cos(lat) * Math.sin(relativeLon);
    const y = Math.sin(lat);
    const z = Math.cos(lat) * Math.cos(relativeLon);

    return {
      left: `${50 + x * 43}%`,
      top: `${50 - y * 43}%`,
      opacity: clamp((z + 0.15) / 1.15, 0, 1),
      scale: 0.74 + Math.max(0, z) * 0.34,
      visible: z > 0.02,
      z,
    };
  };

  const focusOffice = (office: GlobeOffice) => {
    setSelectedId(office.id);
    setRotation(office.lon);
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    setDragging(true);
    lastX.current = event.clientX;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    const dx = event.clientX - lastX.current;
    lastX.current = event.clientX;
    setRotation((value) => value - dx * 0.35);
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    setDragging(false);
    try {
      event.currentTarget.releasePointerCapture(event.pointerId);
    } catch {
      // no-op
    }
  };

  const globeStyle = {
    "--globe-x": `${((rotation % 360) + 360) % 360}`,
  } as CSSProperties;

  return (
    <div className={styles.wrap}>
      <div className={styles.globeColumn}>
        <div
          className={`${styles.globeShell} ${dragging ? styles.dragging : ""}`}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={() => setDragging(false)}
          style={globeStyle}
          aria-label="Interactive RoadLenz global office globe"
        >
          <div className={styles.globeSphere}>
            <div className={styles.globeTexture} />
            <div className={styles.globeGrid} />
            <div className={styles.globeShade} />
            <div className={styles.globeAtmosphere} />
          </div>

          <div className={styles.pinLayer}>
            {globeOffices.map((office) => {
              const point = project(office);
              if (!point.visible) return null;

              return (
                <button
                  key={office.id}
                  type="button"
                  className={`${styles.pin} ${
                    selectedId === office.id ? styles.pinActive : ""
                  }`}
                  style={{
                    left: point.left,
                    top: point.top,
                    opacity: point.opacity,
                    transform: `translate(-50%, -50%) scale(${point.scale})`,
                    zIndex: Math.round(100 + point.z * 50),
                    "--pin-color": office.color,
                  } as CSSProperties}
                  onPointerEnter={() => {
                    setHoveringPin(true);
                    setSelectedId(office.id);
                  }}
                  onPointerLeave={() => setHoveringPin(false)}
                  onClick={(event) => {
                    event.stopPropagation();
                    focusOffice(office);
                  }}
                  aria-label={`Show ${office.title}`}
                >
                  <i />
                  <span />
                </button>
              );
            })}
          </div>
        </div>

        <div className={styles.officeSelector}>
          {globeOffices.map((office) => (
            <button
              type="button"
              key={`selector-${office.id}`}
              className={selectedId === office.id ? styles.selectorActive : ""}
              onClick={() => focusOffice(office)}
            >
              <span style={{ background: office.color }} />
              {office.city}
            </button>
          ))}
        </div>

        <p className={styles.globeHint}>
          Drag the globe or hover a location pin to view office details.
        </p>
      </div>

      <div className={styles.detailColumn}>
        <AnimatePresence mode="wait">
          {selected && (
            <motion.article
              key={selected.id}
              className={styles.detailCard}
              initial={{ opacity: 0, x: 18, scale: 0.985 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -12, scale: 0.99 }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            >
              <div
                className={styles.detailAccent}
                style={{ background: selected.color }}
              />

              <div className={styles.detailHead}>
                <span
                  className={styles.officeGlyph}
                  style={{
                    color: selected.color,
                    background: `${selected.color}14`,
                  }}
                >
                  ⦿
                </span>

                <div>
                  <small>{selected.officeType}</small>
                  <h3>{selected.title}</h3>
                  <p>
                    {[selected.city, selected.region, selected.country]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                </div>
              </div>

              <div className={styles.detailRows}>
                <div className={styles.detailRow}>
                  <span>⌖</span>
                  <div>
                    <small>ADDRESS</small>
                    {selected.address.map((line) => (
                      <p key={line}>{line}</p>
                    ))}
                  </div>
                </div>

                {selected.phone && (
                  <a
                    className={styles.detailRow}
                    href={`tel:${selected.phone.replace(/\s/g, "")}`}
                  >
                    <span>☎</span>
                    <div>
                      <small>PHONE</small>
                      <strong>{selected.phone}</strong>
                    </div>
                  </a>
                )}

                {selected.email && (
                  <a
                    className={styles.detailRow}
                    href={`mailto:${selected.email}`}
                  >
                    <span>✉</span>
                    <div>
                      <small>EMAIL</small>
                      <strong>{selected.email}</strong>
                    </div>
                  </a>
                )}
              </div>

              <a
                href={selected.mapsUrl}
                target="_blank"
                rel="noreferrer"
                className={styles.mapsLink}
                style={{ background: selected.color }}
              >
                Open in Google Maps
                <span>→</span>
              </a>
            </motion.article>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
