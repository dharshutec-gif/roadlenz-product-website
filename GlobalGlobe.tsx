"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
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
  shortLabel: string;
};

/* =========================================================
   EXACT OFFICE COORDINATES
   ---------------------------------------------------------
   Pins are positioned by latitude / longitude on the SAME
   equirectangular map layer that moves inside the globe.
   The globe/map layer moves; the pin artwork stays upright.
========================================================= */

const GEO: Record<
  string,
  Pick<GlobeOffice, "lat" | "lon" | "color" | "shortLabel">
> = {
  "chennai-headquarters": {
    lat: 12.97204,
    lon: 80.08971,
    color: "#087EEA",
    shortLabel: "Chennai",
  },
  "chennai-production-unit": {
    lat: 12.91738,
    lon: 80.08588,
    color: "#087EEA",
    shortLabel: "Old Perungalathur",
  },
  bangalore: {
    lat: 13.007516,
    lon: 77.695935,
    color: "#087EEA",
    shortLabel: "Bangalore",
  },
  "germany-office": {
    lat: 49.5701,
    lon: 10.9992,
    color: "#087EEA",
    shortLabel: "Erlangen",
  },
  "netherlands-office": {
    lat: 51.420994,
    lon: 5.394675,
    color: "#087EEA",
    shortLabel: "Veldhoven",
  },
  "usa-office": {
    lat: 37.7836,
    lon: -121.5473,
    color: "#087EEA",
    shortLabel: "Mountain House",
  },
};

const MAP_SCALE = 2.2;
const BASE_TRACK_SHIFT = ((MAP_SCALE - 1) / 2 / (MAP_SCALE * 2)) * 100;

function normalizeRotation(value: number) {
  const result = value % 360;
  return result < 0 ? result + 360 : result;
}

function lonPercent(lon: number) {
  return ((lon + 180) / 360) * 100;
}

function latPercent(lat: number) {
  return ((90 - lat) / 180) * 100;
}

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 21s7-6.1 7-12A7 7 0 1 0 5 9c0 5.9 7 12 7 12Z" />
      <circle cx="12" cy="9" r="2.4" />
    </svg>
  );
}

function BuildingIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 21V6l8-3 8 3v15M8 9h2M14 9h2M8 13h2M14 13h2M8 17h2M14 17h2M2 21h20" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 3H4a1 1 0 0 0-1 1c0 9.4 7.6 17 17 17a1 1 0 0 0 1-1v-3l-4-2-2 2c-4-1.7-6.3-4-8-8l2-2-2-4Z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  );
}

function MapArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
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
    [offices],
  );

  const defaultOffice =
    globeOffices.find((office) => office.id === "chennai-headquarters") ??
    globeOffices[0];

  const [selectedId, setSelectedId] = useState(defaultOffice?.id ?? "");
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  /*
    Start with India near the centre of the visible globe.
    The value is the centre longitude of the rotating map.
  */
  const [rotation, setRotation] = useState(76);
  const [dragging, setDragging] = useState(false);
  const [pauseRotation, setPauseRotation] = useState(false);

  const lastPointerX = useRef(0);
  const rafRef = useRef<number | null>(null);
  const lastFrame = useRef<number | null>(null);

  const selected =
    globeOffices.find((office) => office.id === selectedId) ?? defaultOffice;

  /* =======================================================
     AUTO ROTATION
     Only the map/globe moves. Pin icons remain upright.
  ======================================================= */

  useEffect(() => {
    const tick = (time: number) => {
      if (lastFrame.current == null) {
        lastFrame.current = time;
      }

      const delta = time - (lastFrame.current ?? time);
      lastFrame.current = time;

      if (!dragging && !pauseRotation) {
        setRotation((current) => normalizeRotation(current + delta * 0.0032));
      }

      rafRef.current = window.requestAnimationFrame(tick);
    };

    rafRef.current = window.requestAnimationFrame(tick);

    return () => {
      if (rafRef.current != null) {
        window.cancelAnimationFrame(rafRef.current);
      }
    };
  }, [dragging, pauseRotation]);

  /* =======================================================
     MAP TRACK POSITION
     -------------------------------------------------------
     Each world-map page is 220% of the globe viewport so the
     circle behaves more like a hemisphere than a flat map.
     Two copies provide seamless wraparound rotation.
  ======================================================= */

  const trackShift = BASE_TRACK_SHIFT + (normalizeRotation(rotation) / 360) * 50;

  const trackStyle = {
    "--track-shift": `${trackShift}%`,
    "--map-scale": MAP_SCALE,
  } as CSSProperties;

  const focusOffice = (office: GlobeOffice) => {
    setSelectedId(office.id);
    setRotation(normalizeRotation(office.lon));
    setPauseRotation(true);

    window.setTimeout(() => {
      setPauseRotation(false);
    }, 2600);
  };

  /* =======================================================
     DRAG
  ======================================================= */

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    setDragging(true);
    setPauseRotation(true);
    lastPointerX.current = event.clientX;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragging) return;

    const dx = event.clientX - lastPointerX.current;
    lastPointerX.current = event.clientX;

    setRotation((current) => normalizeRotation(current - dx * 0.32));
  };

  const handlePointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    setDragging(false);

    try {
      event.currentTarget.releasePointerCapture(event.pointerId);
    } catch {
      // Pointer may already be released.
    }

    window.setTimeout(() => {
      setPauseRotation(false);
    }, 1000);
  };

  return (
    <div className={styles.globalWrap}>
      {/* ===================================================
          GLOBE
      =================================================== */}

      <div className={styles.globeColumn}>
        <div
          className={`${styles.globeStage} ${dragging ? styles.dragging : ""}`}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={() => {
            setDragging(false);
            setPauseRotation(false);
          }}
          onMouseEnter={() => setPauseRotation(true)}
          onMouseLeave={() => {
            if (!dragging) setPauseRotation(false);
          }}
          aria-label="Interactive RoadLenz office globe"
        >
          <div className={styles.orbitRingOne} />
          <div className={styles.orbitRingTwo} />

          <div className={styles.globeSphere}>
            <div className={styles.mapViewport}>
              <div className={styles.mapTrack} style={trackStyle}>
                {[0, 1].map((copyIndex) => (
                  <div className={styles.mapPage} key={`map-copy-${copyIndex}`}>
                    <img
                      src="/home-assets/world-map.png"
                      alt=""
                      draggable={false}
                      className={styles.worldMap}
                    />

                    {globeOffices.map((office) => {
                      const selectedPin = selectedId === office.id;
                      const hoveredPin = hoveredId === office.id;

                      return (
                        <button
                          key={`${copyIndex}-${office.id}`}
                          type="button"
                          className={`${styles.geoPin} ${
                            selectedPin ? styles.geoPinSelected : ""
                          }`}
                          style={
                            {
                              left: `${lonPercent(office.lon)}%`,
                              top: `${latPercent(office.lat)}%`,
                              "--pin-color": office.color,
                            } as CSSProperties
                          }
                          onPointerDown={(event) => event.stopPropagation()}
                          onPointerEnter={() => {
                            setHoveredId(office.id);
                            setSelectedId(office.id);
                          }}
                          onPointerLeave={() => setHoveredId(null)}
                          onClick={(event) => {
                            event.stopPropagation();
                            focusOffice(office);
                          }}
                          aria-label={`Show ${office.title}`}
                        >
                          <span className={styles.pinPulse} />

                          <span className={styles.pinMarker}>
                            <PinIcon />
                          </span>

                          <AnimatePresence>
                            {(selectedPin || hoveredPin) && (
                              <motion.span
                                className={styles.pinLabel}
                                initial={{ opacity: 0, y: 7, scale: 0.96 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 5, scale: 0.97 }}
                                transition={{ duration: 0.18 }}
                              >
                                <strong>{office.shortLabel}</strong>
                                <small>
                                  {office.id === "chennai-production-unit"
                                    ? "India · Production Unit"
                                    : office.country}
                                </small>
                              </motion.span>
                            )}
                          </AnimatePresence>
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            {/* These effects stay stationary while the map rotates. */}
            <div className={styles.globeGrid} />
            <div className={styles.globeHighlight} />
            <div className={styles.globeShade} />
            <div className={styles.globeEdge} />
          </div>
        </div>
        <p className={styles.globeHelp}>
          Drag the globe or select a location pin to view office details.
        </p>
      </div>

      {/* ===================================================
          PREMIUM OFFICE DETAILS
      =================================================== */}

      <div className={styles.detailColumn}>
        <AnimatePresence mode="wait">
          {selected && (
            <motion.article
              key={selected.id}
              className={styles.premiumCard}
              initial={{ opacity: 0, x: 18, scale: 0.985 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -14, scale: 0.99 }}
              transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className={styles.cardAccent} />
              <div className={styles.cardGlow} />

              <div className={styles.cardHeader}>
                <span className={styles.headerPin}>
                  <PinIcon />
                </span>

                <div className={styles.headerCopy}>
                  <small>{selected.officeType}</small>
                  <h3>{selected.title}</h3>
                  <p>
                    {[selected.city, selected.region, selected.country]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                </div>

                <div className={styles.locationBadge}>
                  <span>
                    {selected.lat.toFixed(2)}°N
                    <br />
                    {Math.abs(selected.lon).toFixed(2)}°
                    {selected.lon >= 0 ? "E" : "W"}
                  </span>
                </div>
              </div>

              <div className={styles.detailDivider} />

              <div className={styles.detailRows}>
                <div className={styles.detailRow}>
                  <span className={styles.detailIcon}>
                    <BuildingIcon />
                  </span>

                  <div>
                    <small>ADDRESS</small>
                    <div className={styles.addressLines}>
                      {selected.address.map((line) => (
                        <p key={line}>{line}</p>
                      ))}
                    </div>
                  </div>
                </div>

                {selected.phone && (
                  <a
                    href={`tel:${selected.phone.replace(/\s/g, "")}`}
                    className={styles.detailRow}
                  >
                    <span className={styles.detailIcon}>
                      <PhoneIcon />
                    </span>

                    <div>
                      <small>PHONE</small>
                      <strong>{selected.phone}</strong>
                    </div>
                  </a>
                )}

                {selected.email && (
                  <a href={`mailto:${selected.email}`} className={styles.detailRow}>
                    <span className={styles.detailIcon}>
                      <MailIcon />
                    </span>

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
                className={styles.mapsButton}
              >
                <PinIcon />
                <span>Open in Google Maps</span>
                <MapArrowIcon />
              </a>

              <div className={styles.otherLocationsTitle}>
                <span />
                OUR OTHER LOCATIONS
                <span />
              </div>

              <div className={styles.otherLocations}>
                {globeOffices
                  .filter((office) => office.id !== selected.id)
                  .slice(0, 4)
                  .map((office) => (
                    <button
                      type="button"
                      key={`other-${office.id}`}
                      onClick={() => focusOffice(office)}
                    >
                      <span className={styles.miniPin}>
                        <PinIcon />
                      </span>

                      <span>
                        <strong>{office.shortLabel}</strong>
                        <small>{office.country}</small>
                      </span>
                    </button>
                  ))}
              </div>
            </motion.article>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
