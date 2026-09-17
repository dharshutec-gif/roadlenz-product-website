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
   OFFICE COORDINATES
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

/* =========================================================
   ICONS
========================================================= */

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

function GlobeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.2 2.4 3.3 5.4 3.3 9s-1.1 6.6-3.3 9c-2.2-2.4-3.3-5.4-3.3-9S9.8 5.4 12 3Z" />
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

/* =========================================================
   COMPONENT
========================================================= */

export default function GlobalGlobe({
  offices,
}: {
  offices: Office[];
}) {
  const globeOffices = useMemo<GlobeOffice[]>(
    () =>
      offices
        .map((office) => {
          const geo = GEO[office.id];

          if (!geo) {
            return null;
          }

          return {
            ...office,
            ...geo,
          };
        })
        .filter(Boolean) as GlobeOffice[],
    [offices],
  );

  const defaultOffice =
    globeOffices.find(
      (office) => office.id === "chennai-headquarters",
    ) ?? globeOffices[0];

  const [selectedId, setSelectedId] = useState(
    defaultOffice?.id ?? "",
  );

  const [hoveredId, setHoveredId] = useState<string | null>(
    null,
  );

  const [rotation, setRotation] = useState(76);
  const [dragging, setDragging] = useState(false);
  const [pauseRotation, setPauseRotation] = useState(false);

  const lastPointerX = useRef(0);
  const rafRef = useRef<number | null>(null);
  const lastFrame = useRef<number | null>(null);

  const selected =
    globeOffices.find(
      (office) => office.id === selectedId,
    ) ?? defaultOffice;

  /* =======================================================
     AUTO ROTATION
  ======================================================= */

  useEffect(() => {
    const tick = (time: number) => {
      if (lastFrame.current == null) {
        lastFrame.current = time;
      }

      const delta =
        time - (lastFrame.current ?? time);

      lastFrame.current = time;

      if (!dragging && !pauseRotation) {
        setRotation((current) =>
          normalizeRotation(
            current + delta * 0.0032,
          ),
        );
      }

      rafRef.current =
        window.requestAnimationFrame(tick);
    };

    rafRef.current =
      window.requestAnimationFrame(tick);

    return () => {
      if (rafRef.current != null) {
        window.cancelAnimationFrame(
          rafRef.current,
        );
      }
    };
  }, [dragging, pauseRotation]);

  /* =======================================================
     MAP TRACK
  ======================================================= */

  const centeredMapShift =
    ((rotation + 180) / 720 - 0.1136363636) %
    0.5;

  const trackShift =
    ((centeredMapShift + 0.5) % 0.5) * 100;

  const trackStyle = {
    "--track-shift": `${trackShift}%`,
    "--map-scale": MAP_SCALE,
  } as CSSProperties;

  /* =======================================================
     FOCUS LOCATION
  ======================================================= */

  const focusOffice = (
    office: GlobeOffice,
  ) => {
    setSelectedId(office.id);

    setRotation(
      normalizeRotation(office.lon),
    );

    setPauseRotation(true);

    window.setTimeout(() => {
      setPauseRotation(false);
    }, 2600);
  };

  /* =======================================================
     POINTER DRAG
  ======================================================= */

  const handlePointerDown = (
    event: ReactPointerEvent<HTMLDivElement>,
  ) => {
    setDragging(true);
    setPauseRotation(true);

    lastPointerX.current =
      event.clientX;

    event.currentTarget.setPointerCapture(
      event.pointerId,
    );
  };

  const handlePointerMove = (
    event: ReactPointerEvent<HTMLDivElement>,
  ) => {
    if (!dragging) {
      return;
    }

    const dx =
      event.clientX -
      lastPointerX.current;

    lastPointerX.current =
      event.clientX;

    setRotation((current) =>
      normalizeRotation(
        current - dx * 0.32,
      ),
    );
  };

  const handlePointerUp = (
    event: ReactPointerEvent<HTMLDivElement>,
  ) => {
    setDragging(false);

    try {
      event.currentTarget.releasePointerCapture(
        event.pointerId,
      );
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
          className={`${styles.globeStage} ${
            dragging ? styles.dragging : ""
          }`}
          onPointerDown={
            handlePointerDown
          }
          onPointerMove={
            handlePointerMove
          }
          onPointerUp={
            handlePointerUp
          }
          onPointerCancel={() => {
            setDragging(false);
            setPauseRotation(false);
          }}
          onMouseEnter={() =>
            setPauseRotation(true)
          }
          onMouseLeave={() => {
            if (!dragging) {
              setPauseRotation(false);
            }
          }}
          aria-label="Interactive RoadLenz office globe"
        >
          <div
            className={styles.orbitRingOne}
          />

          <div
            className={styles.orbitRingTwo}
          />

          <div
            className={styles.globeSphere}
          >
            <div
              className={styles.mapViewport}
            >
              <div
                className={styles.mapTrack}
                style={trackStyle}
              >
                {[0, 1].map(
                  (copyIndex) => (
                    <div
                      className={
                        styles.mapPage
                      }
                      key={`map-copy-${copyIndex}`}
                    >
                      <img
                        src="/home-assets/world-map.png"
                        alt=""
                        draggable={false}
                        className={
                          styles.worldMap
                        }
                      />

                      {globeOffices.map(
                        (office) => {
                          const selectedPin =
                            selectedId ===
                            office.id;

                          const hoveredPin =
                            hoveredId ===
                            office.id;

                          return (
                            <button
                              key={`${copyIndex}-${office.id}`}
                              type="button"
                              className={`${styles.geoPin} ${
                                selectedPin
                                  ? styles.geoPinSelected
                                  : ""
                              }`}
                              style={
                                {
                                  left: `${lonPercent(
                                    office.lon,
                                  )}%`,
                                  top: `${latPercent(
                                    office.lat,
                                  )}%`,
                                  "--pin-color":
                                    office.color,
                                } as CSSProperties
                              }
                              onPointerDown={(
                                event,
                              ) =>
                                event.stopPropagation()
                              }
                              onPointerEnter={() => {
                                setHoveredId(
                                  office.id,
                                );

                                setSelectedId(
                                  office.id,
                                );
                              }}
                              onPointerLeave={() =>
                                setHoveredId(null)
                              }
                              onClick={(event) => {
                                event.stopPropagation();

                                focusOffice(
                                  office,
                                );
                              }}
                              aria-label={`Show ${office.title}`}
                            >
                              <span
                                className={
                                  styles.pinPulse
                                }
                              />

                              <span
                                className={
                                  styles.pinMarker
                                }
                              >
                                <PinIcon />
                              </span>

                              <AnimatePresence>
                                {(
                                  selectedPin ||
                                  hoveredPin
                                ) && (
                                  <motion.span
                                    className={
                                      styles.pinLabel
                                    }
                                    initial={{
                                      opacity: 0,
                                      y: 7,
                                      scale: 0.96,
                                    }}
                                    animate={{
                                      opacity: 1,
                                      y: 0,
                                      scale: 1,
                                    }}
                                    exit={{
                                      opacity: 0,
                                      y: 5,
                                      scale: 0.97,
                                    }}
                                    transition={{
                                      duration: 0.18,
                                    }}
                                  >
                                    <strong>
                                      {
                                        office.shortLabel
                                      }
                                    </strong>

                                    <small>
                                      {office.id ===
                                      "chennai-production-unit"
                                        ? "India · Production Unit"
                                        : office.country}
                                    </small>
                                  </motion.span>
                                )}
                              </AnimatePresence>
                            </button>
                          );
                        },
                      )}
                    </div>
                  ),
                )}
              </div>
            </div>

            <div
              className={styles.globeGrid}
            />

            <div
              className={
                styles.globeHighlight
              }
            />

            <div
              className={styles.globeShade}
            />

            <div
              className={styles.globeEdge}
            />
          </div>
        </div>

        <p className={styles.globeHelp}>
          Drag the globe or select a
          location pin to view office
          details.
        </p>
      </div>


      {/* ===================================================
          LOCATION DETAILS
          No duplicate GLOBAL PRESENCE heading here.
      =================================================== */}

      <div className={styles.detailColumn}>
        <AnimatePresence mode="wait">

          {selected && (
            <motion.article
              key={selected.id}
              className={
                styles.premiumCard
              }
              initial={{
                opacity: 0,
                x: 18,
                scale: 0.985,
              }}
              animate={{
                opacity: 1,
                x: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                x: -14,
                scale: 0.99,
              }}
              transition={{
                duration: 0.34,
                ease: [
                  0.22,
                  1,
                  0.36,
                  1,
                ],
              }}
            >

              <div
                className={styles.cardAccent}
              />

              <div
                className={styles.cardGlow}
              />


              {/* LOCATION HEADER */}

              <div
                className={
                  styles.locationHeader
                }
              >
                <div
                  className={
                    styles.headerPin
                  }
                >
                  <PinIcon />
                </div>

                <div
                  className={
                    styles.headerCopy
                  }
                >
                  <span
                    className={
                      styles.headerEyebrow
                    }
                  >
                    {selected.officeType ||
                      "OFFICE"}
                  </span>

                  <h3>
                    {selected.title}
                  </h3>

                  <p>
                    {[
                      selected.city,
                      selected.region,
                      selected.country,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                </div>

                <div
                  className={
                    styles.locationNumber
                  }
                >
                  <span>
                    LOCATION
                  </span>

                  <strong>
                    {String(
                      globeOffices.findIndex(
                        (office) =>
                          office.id ===
                          selected.id,
                      ) + 1,
                    ).padStart(2, "0")}
                  </strong>
                </div>
              </div>


              {/* GEOGRAPHIC POSITION */}

              <div
                className={
                  styles.coordinateCard
                }
              >
                <span
                  className={
                    styles.coordinateIcon
                  }
                >
                  <GlobeIcon />
                </span>

                <div
                  className={
                    styles.coordinateContent
                  }
                >
                  <span
                    className={
                      styles.metaLabel
                    }
                  >
                    GEOGRAPHIC POSITION
                  </span>

                  <strong>
                    {Math.abs(
                      selected.lat,
                    ).toFixed(5)}
                    °{" "}
                    {selected.lat >= 0
                      ? "N"
                      : "S"}

                    <span>
                      {" "}
                      /
                    </span>

                    {" "}

                    {Math.abs(
                      selected.lon,
                    ).toFixed(5)}
                    °{" "}
                    {selected.lon >= 0
                      ? "E"
                      : "W"}
                  </strong>
                </div>
              </div>


              {/* OFFICE ADDRESS */}

              <div
                className={
                  styles.addressCard
                }
              >
                <div
                  className={
                    styles.addressHeader
                  }
                >
                  <span
                    className={
                      styles.addressIcon
                    }
                  >
                    <BuildingIcon />
                  </span>

                  <div>
                    <span
                      className={
                        styles.metaLabel
                      }
                    >
                      OFFICE ADDRESS
                    </span>

                    <h4>
                      {selected.title}
                    </h4>
                  </div>
                </div>

                <div
                  className={
                    styles.addressBody
                  }
                >
                  {selected.address.map(
                    (line, index) => (
                      <p
                        key={`${selected.id}-address-${index}`}
                        className={
                          index === 0
                            ? styles.addressPrimary
                            : styles.addressLine
                        }
                      >
                        {line}
                      </p>
                    ),
                  )}
                </div>
              </div>


              {/* CONTACT INFORMATION */}

              {(selected.phone ||
                selected.email) && (
                <div
                  className={
                    styles.contactGrid
                  }
                >

                  {selected.phone && (
                    <a
                      href={`tel:${selected.phone.replace(
                        /\s/g,
                        "",
                      )}`}
                      className={
                        styles.contactCard
                      }
                    >
                      <span
                        className={
                          styles.contactIcon
                        }
                      >
                        <PhoneIcon />
                      </span>

                      <span
                        className={
                          styles.contactContent
                        }
                      >
                        <span
                          className={
                            styles.metaLabel
                          }
                        >
                          PHONE
                        </span>

                        <strong>
                          {selected.phone}
                        </strong>
                      </span>
                    </a>
                  )}

                  {selected.email && (
                    <a
                      href={`mailto:${selected.email}`}
                      className={
                        styles.contactCard
                      }
                    >
                      <span
                        className={
                          styles.contactIcon
                        }
                      >
                        <MailIcon />
                      </span>

                      <span
                        className={
                          styles.contactContent
                        }
                      >
                        <span
                          className={
                            styles.metaLabel
                          }
                        >
                          EMAIL
                        </span>

                        <strong>
                          {selected.email}
                        </strong>
                      </span>
                    </a>
                  )}

                </div>
              )}


              {/* GOOGLE MAPS */}

              <a
                href={selected.mapsUrl}
                target="_blank"
                rel="noreferrer"
                className={
                  styles.mapsButton
                }
              >
                <span
                  className={
                    styles.mapsIcon
                  }
                >
                  <PinIcon />
                </span>

                <span
                  className={
                    styles.mapsText
                  }
                >
                  <small>
                    GET DIRECTIONS
                  </small>

                  <strong>
                    Open in Google Maps
                  </strong>
                </span>

                <span
                  className={
                    styles.mapsArrow
                  }
                >
                  <MapArrowIcon />
                </span>
              </a>


              {/* ALL LOCATIONS */}

              <div
                className={
                  styles.otherLocationsHeader
                }
              >
                <div>
                  <span
                    className={
                      styles.metaLabel
                    }
                  >
                    OUR GLOBAL NETWORK
                  </span>

                  <h4>
                    Six locations.
                    <span>
                      {" "}
                      One team.
                    </span>
                  </h4>
                </div>

                <strong>
                  06
                </strong>
              </div>


              <div
                className={
                  styles.otherLocations
                }
              >
                {globeOffices.map(
                  (office, index) => {
                    const active =
                      office.id ===
                      selected.id;

                    return (
                      <button
                        type="button"
                        key={`location-${office.id}`}
                        onClick={() =>
                          focusOffice(
                            office,
                          )
                        }
                        className={
                          active
                            ? styles.otherLocationActive
                            : ""
                        }
                      >
                        <span
                          className={
                            styles.locationIndex
                          }
                        >
                          {String(
                            index + 1,
                          ).padStart(2, "0")}
                        </span>

                        <span
                          className={
                            styles.miniPin
                          }
                        >
                          <PinIcon />
                        </span>

                        <span
                          className={
                            styles.locationText
                          }
                        >
                          <strong>
                            {
                              office.shortLabel
                            }
                          </strong>

                          <small>
                            {
                              office.country
                            }
                          </small>
                        </span>

                        <span
                          className={
                            styles.locationArrow
                          }
                        >
                          <MapArrowIcon />
                        </span>
                      </button>
                    );
                  },
                )}
              </div>

            </motion.article>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}