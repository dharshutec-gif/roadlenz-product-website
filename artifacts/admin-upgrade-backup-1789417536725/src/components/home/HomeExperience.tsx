"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { motion } from "framer-motion";
import styles from "./HomeExperience.module.css";
import GlobalGlobe from "./GlobalGlobe";
import FleetForwardCTA from "./FleetForwardCTA";

type MediaLike = {
  type: "image" | "video";
  src: string;
  poster?: string;
};

type HeroSlideLike = {
  id: string;
  order: number;
  published?: boolean;
  duration?: number;
  media: MediaLike;
};

type StatLike = {
  id: string;
  order: number;
  published?: boolean;
  label: string;
  value: string;
  icon?: string;
};

type IndustryLike = {
  id: string;
  order: number;
  published?: boolean;
  slug: string;
  name: string;
  shortName?: string;
  vehicleImage?: string;
  image?: string;
};

type ProductLike = {
  id: string;
  order: number;
  published?: boolean;
  slug: string;
  name: string;
  category: string;
  tagline?: string;
  image?: string;
};

type CustomerLogoLike = {
  id: string;
  order: number;
  published?: boolean;
  approved?: boolean;
  name: string;
  image?: string;
};

type LocationLike = {
  id: string;
  order: number;
  published?: boolean;
  name?: string;
  title?: string;
  officeType?: string;
  type?: string;
  city?: string;
  region?: string;
  country?: string;
  address?: string | string[];
  phone?: string;
  email?: string;
  mapsUrl?: string;
  mapsLink?: string;
};

type WhyPointLike = {
  id: string;
  order: number;
  published?: boolean;
  title: string;
  text: string;
  icon?: string;
};

type Props = {
  heroSlides: HeroSlideLike[];
  stats: StatLike[];
  industries: IndustryLike[];
  products: ProductLike[];
  customerLogos: CustomerLogoLike[];
  locations: LocationLike[];
  whyPoints: WhyPointLike[];
};

type IconName =
  | "truck"
  | "shield"
  | "pin"
  | "headset"
  | "video"
  | "fuel"
  | "chart"
  | "bell"
  | "route"
  | "cloud"
  | "chip"
  | "mail"
  | "phone"
  | "map"
  | "spark"
  | "wrench"
  | "layers"
  | "users"
  | "arrow"
  | "building";

const iconPaths: Record<IconName, ReactNode> = {
  truck: (
    <>
      <path d="M3 7h11v9H3z" />
      <path d="M14 10h4l3 3v3h-7z" />
      <circle cx="7" cy="18" r="2" />
      <circle cx="18" cy="18" r="2" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3 5 6v5c0 4.6 2.9 8.1 7 10 4.1-1.9 7-5.4 7-10V6z" />
      <path d="m9.5 12 1.8 1.8 3.7-4" />
    </>
  ),
  pin: (
    <>
      <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  headset: (
    <>
      <path d="M4 13v-1a8 8 0 0 1 16 0v1" />
      <path d="M4 13h3v6H5a1 1 0 0 1-1-1zM20 13h-3v6h2a1 1 0 0 0 1-1z" />
      <path d="M17 19c-1 2-3 2-5 2" />
    </>
  ),
  video: (
    <>
      <rect x="3" y="6" width="12" height="12" rx="2" />
      <path d="m15 10 5-3v10l-5-3z" />
    </>
  ),
  fuel: (
    <>
      <path d="M5 3h9v18H5z" />
      <path d="M7 7h5" />
      <path d="M14 8h2l3 3v7a2 2 0 0 0 2 2" />
    </>
  ),
  chart: (
    <>
      <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
    </>
  ),
  bell: (
    <>
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9Z" />
      <path d="M10 21h4" />
    </>
  ),
  route: (
    <>
      <circle cx="5" cy="6" r="2" />
      <circle cx="19" cy="18" r="2" />
      <path d="M7 6h4a3 3 0 0 1 3 3v1a3 3 0 0 1-3 3H9a3 3 0 0 0-3 3" />
    </>
  ),
  cloud: (
    <>
      <path d="M7 18h11a4 4 0 0 0 .4-8 6.5 6.5 0 0 0-12.3-1.5A4.8 4.8 0 0 0 7 18Z" />
      <path d="M12 11v5M9.5 13.5 12 11l2.5 2.5" />
    </>
  ),
  chip: (
    <>
      <rect x="6" y="6" width="12" height="12" rx="2" />
      <path d="M9 1v3M15 1v3M9 20v3M15 20v3M1 9h3M1 15h3M20 9h3M20 15h3" />
      <rect x="9" y="9" width="6" height="6" rx="1" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </>
  ),
  phone: (
    <>
      <path d="M7 3H4a1 1 0 0 0-1 1c0 9.4 7.6 17 17 17a1 1 0 0 0 1-1v-3l-4-2-2 2c-4-1.7-6.3-4-8-8l2-2z" />
    </>
  ),
  map: (
    <>
      <path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3z" />
      <path d="M9 3v15M15 6v15" />
    </>
  ),
  spark: (
    <>
      <path d="m12 2 1.8 5.2L19 9l-5.2 1.8L12 16l-1.8-5.2L5 9l5.2-1.8z" />
      <path d="m19 15 .9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9z" />
    </>
  ),
  wrench: (
    <>
      <path d="M14.5 6.5a4 4 0 0 0-5-5l2.2 2.2-3 3-2.2-2.2a4 4 0 0 0 5 5L20 18l-2 2-8.5-8.5" />
    </>
  ),
  layers: (
    <>
      <path d="m12 2 9 5-9 5-9-5z" />
      <path d="m3 12 9 5 9-5M3 17l9 5 9-5" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8" r="4" />
      <path d="M2 21v-2a7 7 0 0 1 14 0v2" />
      <path d="M16 5a4 4 0 0 1 0 7M18 15a6 6 0 0 1 4 6" />
    </>
  ),
  arrow: (
    <>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </>
  ),
  building: (
    <>
      <path d="M4 21V5l8-3 8 3v16" />
      <path d="M8 8h2M14 8h2M8 12h2M14 12h2M8 16h2M14 16h2M2 21h20" />
    </>
  ),
};

function Icon({ name, className = "" }: { name: IconName; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {iconPaths[name]}
    </svg>
  );
}

const HOME_SECTION_HEADING_STYLE: CSSProperties = {
  color: "#0A2E5A",
  fontSize: "clamp(24px, 2.35vw, 34px)",
  lineHeight: 1.12,
  letterSpacing: "-0.035em",
  fontWeight: 800,
  fontStyle: "normal",
  margin: 0,
};

const HOME_SECTION_DESCRIPTION_STYLE: CSSProperties = {
  color: "#6A84A2",
  fontSize: "clamp(14px, 1.1vw, 16px)",
  lineHeight: 1.6,
  fontWeight: 400,
  marginTop: "8px",
  marginBottom: 0,
};

function Reveal({
  children,
  delay = 0,
  className = "",
  style,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <motion.div
      className={className}
      style={style}
      initial={{ opacity: 0, y: 28, scale: 0.985, filter: "blur(5px)" }}
      whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.72, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function SafeImage({
  sources,
  alt,
  className = "",
  eager = false,
}: {
  sources: (string | undefined)[];
  alt: string;
  className?: string;
  eager?: boolean;
}) {
  const usable = sources.filter(Boolean) as string[];
  const [index, setIndex] = useState(0);
  const src = usable[index];

  if (!src) {
    return <div className={`${styles.imageFallback} ${className}`}>{alt}</div>;
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading={eager ? "eager" : "lazy"}
      onError={() => setIndex((current) => current + 1)}
    />
  );
}


/* =========================================================
   HOME HERO VIDEO PLAYLIST

   Put the four files in:
   public/video/hero-1.mp4
   public/video/hero-2.mp4
   public/video/hero-3.mp4
   public/video/hero-4.mp4

   Next.js serves them as:
   /video/hero-1.mp4 ... /video/hero-4.mp4
========================================================= */

const LOCAL_HERO_VIDEOS: HeroSlideLike[] = [
  {
    id: "hero-video-1",
    order: 1,
    media: {
      type: "video",
      src: "/video/hero-1.mp4",
    },
  },
  {
    id: "hero-video-2",
    order: 2,
    media: {
      type: "video",
      src: "/video/hero-2.mp4",
    },
  },
  {
    id: "hero-video-3",
    order: 3,
    media: {
      type: "video",
      src: "/video/hero-3.mp4",
    },
  },
  {
    id: "hero-video-4",
    order: 4,
    media: {
      type: "video",
      src: "/video/hero-4.mp4",
    },
  },
];

function Hero({ slides }: { slides: HeroSlideLike[] }) {
  const usable = useMemo(() => {
    /*
      The four local videos are intentionally used first.
      This prevents a single admin/database hero slide from
      replacing the four-video homepage sequence.

      If you later want to return to admin-managed hero slides,
      replace this return with the publishedSlides fallback below.
    */
    const publishedSlides = slides
      .filter((slide) => slide.published !== false && slide.media?.src)
      .sort((a, b) => a.order - b.order);

    if (LOCAL_HERO_VIDEOS.length) {
      return LOCAL_HERO_VIDEOS;
    }

    return publishedSlides.length
      ? publishedSlides
      : [
          {
            id: "hero-fallback-video",
            order: 1,
            media: {
              type: "video" as const,
              src: "/home-assets/hero-video.mp4",
              poster: "/home-assets/hero-video-poster.jpg",
            },
          },
        ];
  }, [slides]);

  const [active, setActive] = useState(0);
  const videoRefs = useRef<Array<HTMLVideoElement | null>>([]);

  const showNextSlide = useCallback(() => {
    setActive((current) => (current + 1) % usable.length);
  }, [usable.length]);

  /*
    When a slide becomes active:
    - pause/reset every inactive video
    - restart and play the active video
  */
  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (!video) return;

      if (index === active) {
        video.currentTime = 0;

        const playPromise = video.play();

        if (playPromise) {
          playPromise.catch(() => {
            // Muted + playsInline normally allows autoplay.
            // If a browser still blocks it, the video remains ready.
          });
        }
      } else {
        video.pause();

        try {
          video.currentTime = 0;
        } catch {
          // Ignore while media metadata is still loading.
        }
      }
    });
  }, [active]);

  /*
    Video slides advance through onEnded.
    This timer is only used if an image slide is introduced later.
  */
  useEffect(() => {
    const currentSlide = usable[active];

    if (!currentSlide || currentSlide.media.type === "video") {
      return;
    }

    const timer = window.setTimeout(() => {
      showNextSlide();
    }, Math.max(5, currentSlide.duration || 7) * 1000);

    return () => window.clearTimeout(timer);
  }, [active, usable, showNextSlide]);

  /*
    Keep active index valid if the playlist changes.
  */
  useEffect(() => {
    if (active >= usable.length) {
      setActive(0);
    }
  }, [active, usable.length]);

  return (
    <section
      className={styles.hero}
      aria-label="RoadLenz Smart Fleet Intelligence"
    >
      <div className={styles.heroSlides}>
        {usable.map((slide, index) => {
          const isActive = index === active;
          const isNext =
            usable.length > 1 &&
            index === (active + 1) % usable.length;

          return (
            <div
              key={slide.id}
              className={`${styles.heroSlide} ${
                isActive ? styles.heroSlideActive : ""
              }`}
              aria-hidden={!isActive}
            >
              {slide.media.type === "video" ? (
                <video
                  ref={(node) => {
                    videoRefs.current[index] = node;
                  }}
                  className={styles.heroMedia}
                  src={slide.media.src}
                  poster={slide.media.poster}
                  autoPlay={isActive}
                  muted
                  playsInline
                  loop={false}
                  preload={isActive || isNext ? "auto" : "metadata"}
                  onEnded={showNextSlide}
                  onError={() => {
                    if (isActive) {
                      showNextSlide();
                    }
                  }}
                />
              ) : (
                <img
                  className={styles.heroMedia}
                  src={slide.media.src}
                  alt="RoadLenz connected fleet"
                  loading={isActive || isNext ? "eager" : "lazy"}
                />
              )}
            </div>
          );
        })}
      </div>

      <div className={styles.heroOverlay} />

      <div className={styles.heroContent}>
        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1],
          }}
          style={{
            color: "#FFFFFF",
            fontSize: "clamp(34px, 4vw, 52px)",
            lineHeight: "1.08",
          }}
        >
          Smarter Fleets.{" "}
          <span style={{ color: "#13A9E8" }}>
            Safer Journeys.
          </span>
        </motion.h1>
      </div>

      {usable.length > 1 && (
        <div className={styles.heroDots}>
          {usable.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              aria-label={`Play hero video ${index + 1}`}
              aria-current={index === active ? "true" : undefined}
              onClick={() => setActive(index)}
              className={
                index === active ? styles.heroDotActive : ""
              }
            />
          ))}
        </div>
      )}
    </section>
  );
}


const fallbackStats: StatLike[] = [
  { id: "stat-1", order: 1, value: "2,000+", label: "Vehicles Connected" },
  { id: "stat-2", order: 2, value: "10+", label: "Years Experience" },
  { id: "stat-3", order: 3, value: "Pan-India", label: "Operations" },
  { id: "stat-4", order: 4, value: "24/7", label: "Service & Support" },
];

function TrustStrip({ stats }: { stats: StatLike[] }) {
  const source = stats.filter((item) => item.published !== false).slice(0, 4);
  const items = source.length === 4 ? source : fallbackStats;
  const icons: IconName[] = ["truck", "users", "pin", "headset"];

  return (
    <div className={styles.trustWrap}>
      <div className={styles.trustStrip}>
        {items.map((item, index) => (
          <div className={styles.trustItem} key={item.id}>
            <span className={styles.trustIcon}>
              <Icon name={icons[index]} />
            </span>
            <div>
              <strong>{item.value}</strong>
              <small>{item.label}</small>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const industryOrder = [
  "trucking-logistics",
  "mining",
  "agriculture",
  "employee-transport",
  "school-transport",
  "public-transport",
  "cab-taxi",
];

const industryNameMap: Record<string, string> = {
  "trucking-logistics": "Trucking & Logistics",
  mining: "Mining",
  agriculture: "Agriculture",
  "employee-transport": "Employee Transport",
  "school-transport": "School Transport",
  "public-transport": "Public Bus",
  "cab-taxi": "Cab / Taxi",
};

const industryAssetMap: Record<string, string[]> = {
  "trucking-logistics": ["/home-assets/industry-trucking.png"],
  mining: ["/home-assets/industry-mining.png"],
  agriculture: ["/home-assets/industry-agriculture.png"],
  "employee-transport": ["/home-assets/industry-employee.png"],
  "school-transport": ["/home-assets/industry-school.png"],
  "public-transport": ["/home-assets/industry-public-bus.png"],
  "cab-taxi": ["/home-assets/industry-cab.png"],
};




function Industries({ industries }: { industries: IndustryLike[] }) {
  const items = industryOrder.map((slug, index) => {
    const existing = industries.find(
      (item) => item.slug === slug && item.published !== false
    );

    return (
      existing || {
        id: `industry-${slug}`,
        order: index + 1,
        slug,
        name: industryNameMap[slug],
        published: true,
      }
    );
  });

  return (
    <section
      className={`${styles.section} ${styles.fleetCleanSection}`}
      id="industries"
    >
      <div className={styles.shell}>
        <Reveal className={styles.fleetCleanHeader}>
          <div>
            <span className={styles.eyebrow}>OUR FLEET</span>
            <h2 style={HOME_SECTION_HEADING_STYLE}>
              Powering Every Industry on the Move
            </h2>
            <p style={HOME_SECTION_DESCRIPTION_STYLE}>
              From highways to worksites — RoadLenz keeps every vehicle connected.
            </p>
          </div>

          <Link href="/industries" className={styles.textLink}>
            Explore All Industries <Icon name="arrow" />
          </Link>
        </Reveal>

        <Reveal delay={0.06} className={styles.fleetRunway}>
          <div className={styles.fleetRunwayInner}>
            <div className={styles.fleetGround} />

            {items.map((industry) => {
              const name = industryNameMap[industry.slug] || industry.name;

              return (
                <Link
                  href={`/industries/${industry.slug}`}
                  key={industry.id}
                  className={styles.fleetRunwayItem}
                >
                  <div className={styles.fleetVehicleWrap}>
                    <SafeImage
                      sources={[
                        ...(industryAssetMap[industry.slug] || []),
                        industry.vehicleImage,
                        industry.image,
                      ]}
                      alt={name}
                      className={styles.fleetVehicle}
                    />
                  </div>

                  <span className={styles.fleetVehicleLabel}>{name}</span>
                </Link>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

type ShowcaseProduct = {
  key: string;
  category: string;
  title: string;
  tagline: string;
  href: string;
  sources: string[];
  icon: IconName;
};

function findProduct(
  products: ProductLike[],
  matcher: (product: ProductLike) => boolean
) {
  return products.find(
    (product) => product.published !== false && matcher(product)
  );
}

function productShowcase(products: ProductLike[]): ShowcaseProduct[] {
  /*
    TEMPORARY PRODUCT IMAGE MODE
    ----------------------------
    Product images are loaded directly from /public/home-assets for now.
    Later this can be switched back to product.image from the Admin/DB.

    Save the files exactly as:
      public/home-assets/product-gps.png
      public/home-assets/product-ais140.png
      public/home-assets/product-dashcam.png
      public/home-assets/product-mdvr.png
      public/home-assets/product-cctv.png
      public/home-assets/product-adas-dms.png
      public/home-assets/product-fuel.png
  */

  const gps = findProduct(
    products,
    (p) => p.slug.includes("gps") || p.category === "GPS Tracking Devices"
  );

  const dash = findProduct(
    products,
    (p) => p.slug.includes("dashcam") || p.category === "AI Dashcams"
  );

  const mdvr = findProduct(
    products,
    (p) => p.slug.includes("mdvr") || p.category === "MDVR Systems"
  );

  const cctv = findProduct(
    products,
    (p) => p.category === "Vehicle CCTV Cameras" || p.slug.includes("camera")
  );

  const dms = findProduct(
    products,
    (p) =>
      p.slug.includes("driver-monitoring") ||
      p.category === "AI Safety Systems"
  );

  return [
    {
      key: "gps",
      category: "GPS TRACKING",
      title: "GPS Tracking",
      tagline: "Live location, vehicle status and real-time fleet visibility.",
      href: gps ? `/products/${gps.slug}` : "/products",
      sources: ["/home-assets/product-gps.png"],
      icon: "pin",
    },
    {
      key: "ais",
      category: "AIS-140",
      title: "AIS-140 GPS",
      tagline: "Commercial vehicle tracking built for reliable compliance.",
      href: "/products",
      sources: ["/home-assets/product-ais140.png"],
      icon: "shield",
    },
    {
      key: "dash",
      category: "AI VIDEO",
      title: "AI Dashcams",
      tagline: "Road and driver video intelligence with AI-powered safety.",
      href: dash ? `/products/${dash.slug}` : "/products",
      sources: ["/home-assets/product-dashcam.png"],
      icon: "video",
    },
    {
      key: "mdvr",
      category: "MOBILE VIDEO",
      title: "MDVR Systems",
      tagline: "Multi-channel vehicle recording, live video and remote playback.",
      href: mdvr ? `/products/${mdvr.slug}` : "/products",
      sources: ["/home-assets/product-mdvr.png"],
      icon: "layers",
    },
    {
      key: "cctv",
      category: "VEHICLE CCTV",
      title: "Vehicle CCTV",
      tagline: "Rugged vehicle cameras for complete visibility around the fleet.",
      href: cctv ? `/products/${cctv.slug}` : "/products",
      sources: ["/home-assets/product-cctv.png"],
      icon: "video",
    },
    {
      key: "adas",
      category: "AI SAFETY",
      title: "ADAS + DMS",
      tagline: "Road-risk and driver-behaviour intelligence for safer journeys.",
      href: dms ? `/products/${dms.slug}` : "/products",
      sources: ["/home-assets/product-adas-dms.png"],
      icon: "spark",
    },
    {
      key: "fuel",
      category: "FUEL INTELLIGENCE",
      title: "Fuel Monitoring",
      tagline: "Monitor fuel usage, refuelling, drainage and abnormal consumption.",
      href: "/products",
      sources: ["/home-assets/product-fuel.png"],
      icon: "fuel",
    },
  ];
}

function FeaturedProducts({ products }: { products: ProductLike[] }) {
  const items = productShowcase(products);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const productPauseRef = useRef(false);
  const [activeProduct, setActiveProduct] = useState(2);

  const scrollProducts = useCallback((direction: 1 | -1) => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const firstCard = viewport.querySelector<HTMLElement>("[data-product-card]");
    if (!firstCard) return;

    const style = window.getComputedStyle(viewport);
    const gap = Number.parseFloat(style.columnGap || style.gap || "14") || 14;
    const step = firstCard.getBoundingClientRect().width + gap;
    const maxScroll = Math.max(0, viewport.scrollWidth - viewport.clientWidth);

    let next = viewport.scrollLeft + direction * step;
    if (direction > 0 && next >= maxScroll - 4) next = 0;
    if (direction < 0 && next <= 0) next = maxScroll;

    viewport.scrollTo({ left: next, behavior: "smooth" });
  }, []);

  const syncActiveProduct = () => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const cards = Array.from(
      viewport.querySelectorAll<HTMLElement>("[data-product-card]")
    );
    if (!cards.length) return;

    const viewportCenter = viewport.getBoundingClientRect().left + viewport.clientWidth / 2;
    let closest = 0;
    let distance = Number.POSITIVE_INFINITY;

    cards.forEach((card, index) => {
      const rect = card.getBoundingClientRect();
      const cardCenter = rect.left + rect.width / 2;
      const currentDistance = Math.abs(cardCenter - viewportCenter);
      if (currentDistance < distance) {
        distance = currentDistance;
        closest = index;
      }
    });

    setActiveProduct(closest);
  };

  useEffect(() => {
    const timer = window.setInterval(() => {
      if (!productPauseRef.current) scrollProducts(1);
    }, 5000);

    return () => window.clearInterval(timer);
  }, [scrollProducts]);

  return (
    <section
      className={`${styles.section} ${styles.productsSection} ${styles.productReferenceSection}`}
      id="products"
    >
      <div className={styles.productReferenceGlow} />

      <div className={styles.shell}>
        <Reveal className={styles.productReferenceHeader}>
          <div>
            <span className={styles.eyebrow}>FEATURED PRODUCTS</span>
            <h2 style={HOME_SECTION_HEADING_STYLE}>
              Advanced Hardware for Smarter Operations.
            </h2>
            <p style={HOME_SECTION_DESCRIPTION_STYLE}>
              Connected devices designed to work directly with RoadLenz
              Intelligence.
            </p>
          </div>

          <div className={styles.productReferenceHeaderAside}>
            <Link href="/products" className={styles.productReferenceAllButton}>
              View All Products <Icon name="arrow" />
            </Link>
            <span>CONNECT · DETECT · PROTECT · PERFORM</span>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div
            ref={viewportRef}
            className={styles.productReferenceViewport}
            onScroll={syncActiveProduct}
            onMouseEnter={() => { productPauseRef.current = true; }}
            onMouseLeave={() => { productPauseRef.current = false; }}
          >
            {items.map((product, index) => (
              <motion.article
                key={product.key}
                data-product-card
                className={`${styles.productReferenceCard} ${
                  index === activeProduct ? styles.productReferenceCardActive : ""
                }`}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.22 }}
                transition={{
                  duration: 0.55,
                  delay: index * 0.055,
                  ease: [0.22, 1, 0.36, 1],
                }}
                whileHover={{ y: -9 }}
              >
                <span className={styles.productReferenceHalo} />
                <span className={styles.productReferenceGrid} />

                <div className={styles.productReferenceMeta}>
                  <span>
                    <Icon name={product.icon} />
                    {product.category}
                  </span>
                  <small>ROADLENZ</small>
                </div>

                <div className={styles.productReferenceImageStage}>
                  <SafeImage
                    sources={product.sources}
                    alt={product.title}
                    className={styles.productReferenceImage}
                  />
                </div>

                <div className={styles.productReferenceCopy}>
                  <h3>{product.title}</h3>
                  <p>{product.tagline}</p>
                </div>

                <Link href={product.href} className={styles.productReferenceExplore}>
                  <span>Explore</span>
                  <Icon name="arrow" />
                </Link>
              </motion.article>
            ))}
          </div>

          <div className={styles.productCarouselControls}>
            <button
              type="button"
              onClick={() => scrollProducts(-1)}
              aria-label="Previous featured products"
            >
              <span>←</span>
            </button>

            <div className={styles.productCarouselDots}>
              {items.map((product, index) => (
                <button
                  key={product.key}
                  type="button"
                  aria-label={`Focus ${product.title}`}
                  className={index === activeProduct ? styles.productCarouselDotActive : ""}
                  onClick={() => {
                    const viewport = viewportRef.current;
                    const card = viewport?.querySelectorAll<HTMLElement>("[data-product-card]")[index];
                    card?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
                    setActiveProduct(index);
                  }}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={() => scrollProducts(1)}
              aria-label="Next featured products"
            >
              <span>→</span>
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}


const connectedFleetCards: {
  icon: IconName;
  number: string;
  lead: string;
  accent: string;
  text: string;
  action: string;
}[] = [
  {
    icon: "pin",
    number: "01",
    lead: "Live",
    accent: "Tracking",
    text: "Location, trips & route visibility.",
    action: "Learn More",
  },
  {
    icon: "video",
    number: "02",
    lead: "Video",
    accent: "Telematics",
    text: "Live video, playback & event evidence.",
    action: "Learn More",
  },
  {
    icon: "shield",
    number: "03",
    lead: "AI",
    accent: "Safety",
    text: "ADAS, DMS & driver-risk alerts.",
    action: "Learn More",
  },
  {
    icon: "fuel",
    number: "04",
    lead: "Fuel",
    accent: "Intelligence",
    text: "Fuel usage, refuelling & theft insights.",
    action: "Learn More",
  },
  {
    icon: "bell",
    number: "05",
    lead: "Smart",
    accent: "Alerts",
    text: "Instant visibility of critical fleet events.",
    action: "Learn More",
  },
  {
    icon: "chart",
    number: "06",
    lead: "Reports &",
    accent: "Analytics",
    text: "Actionable data for smarter decisions.",
    action: "Learn More",
  },
];


const connectedFleetMetrics: {
  icon: IconName;
  value: string;
  label: string;
}[] = [
  { icon: "shield", value: "5L+", label: "Lives Saved" },
  { icon: "users", value: "10+", label: "Years of Experience" },
  { icon: "truck", value: "1000+", label: "Vehicles Connected" },
  { icon: "pin", value: "Pan India", label: "Operations" },
];

function EndToEnd() {
  return (
    <section className={`${styles.section} ${styles.connectedFleetSection}`}>
      <div className={styles.connectedFleetAtmosphere} />

      <div className={styles.shell}>
        {/* =====================================================
            CONNECTED FLEET FEATURE PANEL
        ===================================================== */}

        <div
          className={styles.connectedFleetLead}
          style={{
            position: "relative",
            overflow: "hidden",
            borderRadius: "30px",
            border: "1px solid rgba(45, 151, 255, 0.20)",
            backgroundImage:
              "linear-gradient(90deg, rgba(255,255,255,0.99) 0%, rgba(255,255,255,0.96) 36%, rgba(255,255,255,0.28) 64%, rgba(255,255,255,0.06) 100%), url('/home-assets/connected-fleet-bg.png')",
            backgroundSize: "cover",
            backgroundPosition: "center right",
            backgroundRepeat: "no-repeat",
            boxShadow: "0 20px 60px rgba(44, 132, 214, 0.12)",
            minHeight: "430px",
          }}
        >
          <Reveal
            className={styles.connectedFleetCopy}
          >
            <span className={styles.eyebrow}>END-TO-END FLEET SOLUTIONS</span>

            <h2
              style={{
                ...HOME_SECTION_HEADING_STYLE,
                marginTop: "12px",
                maxWidth: "560px",
              }}
            >
              A Smarter, Connected Fleet.
            </h2>

            <p
              style={{
                ...HOME_SECTION_DESCRIPTION_STYLE,
                maxWidth: "570px",
              }}
            >
              From real-time tracking to AI-powered safety, RoadLenz brings
              everything your fleet needs into one intelligent operating layer.
            </p>

            {/* SMALLER CTA BUTTONS */}

            <div
              className={styles.connectedFleetActions}
              style={{
                marginTop: "22px",
                gap: "10px",
              }}
            >
              <Link
                href="/solutions"
                className={styles.connectedFleetPrimary}
                style={{
                  minHeight: "42px",
                  padding: "10px 18px",
                  borderRadius: "999px",
                  fontSize: "12px",
                  fontWeight: 700,
                }}
              >
                Explore Our Solutions <Icon name="arrow" />
              </Link>

              <Link
                href="/technology"
                className={styles.connectedFleetSecondary}
                style={{
                  minHeight: "42px",
                  padding: "10px 18px",
                  borderRadius: "999px",
                  fontSize: "12px",
                  fontWeight: 700,
                }}
              >
                <span
                  className={styles.connectedFleetPlay}
                  style={{
                    width: "25px",
                    height: "25px",
                    fontSize: "9px",
                  }}
                >
                  ▶
                </span>
                Watch Platform
              </Link>
            </div>

            {/* TRUST / IMPACT METRICS */}

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "0",
                marginTop: "34px",
                maxWidth: "720px",
              }}
            >
              {connectedFleetMetrics.map((metric, index) => (
                <div
                  key={metric.label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    minWidth: "145px",
                    padding: "2px 18px 2px 0",
                    marginRight: "18px",
                    marginBottom: "12px",
                    borderRight:
                      index < connectedFleetMetrics.length - 1
                        ? "1px solid rgba(31, 104, 180, 0.16)"
                        : "none",
                  }}
                >
                  <span
                    style={{
                      display: "grid",
                      placeItems: "center",
                      width: "38px",
                      height: "38px",
                      flex: "0 0 auto",
                      borderRadius: "50%",
                      color: "#0789E8",
                      background: "rgba(7, 137, 232, 0.08)",
                      border: "1px solid rgba(7, 137, 232, 0.18)",
                    }}
                  >
                    <Icon name={metric.icon} className="h-[18px] w-[18px]" />
                  </span>

                  <div>
                    <strong
                      style={{
                        display: "block",
                        color: "#092B57",
                        fontSize: "18px",
                        lineHeight: 1.05,
                        fontWeight: 800,
                      }}
                    >
                      {metric.value}
                    </strong>

                    <small
                      style={{
                        display: "block",
                        marginTop: "4px",
                        color: "#6A84A2",
                        fontSize: "10px",
                        lineHeight: 1.2,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {metric.label}
                    </small>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          {/* RIGHT SIDE — NO VEHICLE IMAGE */}

          <Reveal
            delay={0.08}
            className={styles.connectedFleetScene}
            style={{
              minHeight: "390px",
              position: "relative",
              background: "transparent",
            }}
          >
            <motion.div
              className={`${styles.connectedFleetFloatChip} ${styles.connectedFleetChipOne}`}
              animate={{ y: [0, -5, 0] }}
              transition={{
                duration: 5.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{
                background: "rgba(255,255,255,0.90)",
                border: "1px solid rgba(7,137,232,0.14)",
              }}
            >
              <span>
                <Icon name="shield" />
              </span>
              <div>
                <strong>Safer Fleets</strong>
                <small>Stronger Tomorrow</small>
              </div>
            </motion.div>

            <motion.div
              className={`${styles.connectedFleetFloatChip} ${styles.connectedFleetChipTwo}`}
              animate={{ y: [0, 5, 0] }}
              transition={{
                duration: 6.2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{
                background: "rgba(255,255,255,0.90)",
                border: "1px solid rgba(7,137,232,0.14)",
              }}
            >
              <span>
                <Icon name="chart" />
              </span>
              <div>
                <strong>Real Data</strong>
                <small>Real Impact</small>
              </div>
            </motion.div>
          </Reveal>
        </div>

        {/* =====================================================
            SIX FLEET INTELLIGENCE CARDS
            Single RoadLenz dark-blue visual language
        ===================================================== */}

        <div className={styles.connectedFleetCards}>
          {connectedFleetCards.map((feature, index) => (
            <motion.article
              key={feature.number}
              className={styles.connectedFleetCard}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.62,
                delay: index * 0.075,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={{
                y: -7,
                boxShadow: "0 18px 40px rgba(17, 76, 133, 0.14)",
              }}
              style={{
                borderColor: "rgba(14, 101, 184, 0.20)",
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(245,250,255,0.98))",
              }}
            >
              <div className={styles.connectedFleetCardTop}>
                <span
                  className={styles.connectedFleetIcon}
                  style={{
                    color: "#0A78D1",
                    background: "rgba(10,120,209,0.08)",
                    borderColor: "rgba(10,120,209,0.16)",
                  }}
                >
                  <Icon name={feature.icon} />
                </span>

                <small
                  style={{
                    color: "#79A9D4",
                    fontStyle: "normal",
                    fontWeight: 800,
                  }}
                >
                  {feature.number}
                </small>
              </div>

              <div className={styles.connectedFleetCardCopy}>
                <h3
                  style={{
                    color: "#092B57",
                    fontStyle: "normal",
                    fontSize: "18px",
                    lineHeight: 1.2,
                    fontWeight: 800,
                  }}
                >
                  {feature.lead} {feature.accent}
                </h3>

                <p
                  style={{
                    color: "#66809D",
                    fontSize: "12px",
                    lineHeight: 1.55,
                    marginTop: "8px",
                  }}
                >
                  {feature.text}
                </p>
              </div>

              <Link
                href="/technology"
                className={styles.connectedFleetCardLink}
                style={{
                  color: "#0A78D1",
                  fontSize: "12px",
                  fontWeight: 700,
                }}
              >
                <span>{feature.action}</span>
                <Icon name="arrow" />
              </Link>

              {index < connectedFleetCards.length - 1 && (
                <span className={styles.connectedFleetConnector}>
                  <Icon name="arrow" />
                </span>
              )}
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

const premiumWhyItems: {
  icon: IconName;
  metric: string;
  title: string;
  text: string;
  points: string[];
  action: string;
}[] = [
  {
    icon: "building",
    metric: "10+",
    title: "Years Experience",
    text: "Engineering and fleet technology expertise built across real-world operations.",
    points: [
      "Fleet technology experience",
      "Engineering-led implementation",
      "Built for everyday operations",
    ],
    action: "Our Experience",
  },
  {
    icon: "headset",
    metric: "24×7",
    title: "Technical Support",
    text: "Responsive assistance that stays available when your fleet keeps moving.",
    points: [
      "Round-the-clock assistance",
      "Experienced support team",
      "Faster issue resolution",
    ],
    action: "Support Network",
  },
  {
    icon: "map",
    metric: "PAN INDIA",
    title: "Deployment Coverage",
    text: "Installation and service support designed for fleet operations across India.",
    points: [
      "Pan-India deployment",
      "Installation coordination",
      "Field service coverage",
    ],
    action: "Our Coverage",
  },
  {
    icon: "layers",
    metric: "ONE STACK",
    title: "Hardware + Software",
    text: "RoadLenz devices and software working together as one connected fleet ecosystem.",
    points: [
      "Connected devices",
      "Unified RoadLenz software",
      "One operating ecosystem",
    ],
    action: "Explore Platform",
  },
];

function WhyRoadLenz() {
  return (
    <section
      className={styles.section}
      style={{
        position: "relative",
        overflow: "hidden",
        background:
          "radial-gradient(circle at 50% -20%, rgba(25, 155, 255, 0.10), transparent 40%), #ffffff",
        borderTop: "1px solid rgba(10, 120, 209, 0.08)",
        borderBottom: "1px solid rgba(10, 120, 209, 0.08)",
      }}
    >
      {/* SOFT WHITE / BLUE ATMOSPHERE */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          backgroundImage:
            "linear-gradient(rgba(15, 118, 205, 0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(15, 118, 205, 0.035) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage: "linear-gradient(to bottom, rgba(0,0,0,.8), transparent 88%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, rgba(0,0,0,.8), transparent 88%)",
        }}
      />

      <div className={styles.shell} style={{ position: "relative", zIndex: 1 }}>
        {/* =====================================================
            SECTION HEADER
        ===================================================== */}
        <Reveal>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              gap: "28px",
              flexWrap: "wrap",
              marginBottom: "42px",
            }}
          >
            <div style={{ maxWidth: "760px" }}>
              <span className={styles.eyebrow}>WHY ROADLENZ</span>

              <h2
                style={{
                  ...HOME_SECTION_HEADING_STYLE,
                  marginTop: "10px",
                  color: "#092B57",
                }}
              >
                Built for Fleets That Need Technology to Work Every Day.
              </h2>

              <p
                style={{
                  ...HOME_SECTION_DESCRIPTION_STYLE,
                  maxWidth: "650px",
                }}
              >
                Hover over each folder to open it and discover what keeps
                RoadLenz fleets connected, supported and ready to move.
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 18 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.12 }}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "12px",
                maxWidth: "340px",
                padding: "16px 18px",
                borderRadius: "18px",
                border: "1px solid rgba(10, 120, 209, 0.14)",
                background: "rgba(247, 251, 255, 0.95)",
                boxShadow: "0 12px 34px rgba(19, 93, 161, 0.08)",
              }}
            >
              <span
                style={{
                  color: "#0A86E8",
                  fontSize: "30px",
                  fontWeight: 900,
                  lineHeight: 0.8,
                }}
              >
                “
              </span>

              <p
                style={{
                  margin: 0,
                  color: "#315373",
                  fontSize: "13px",
                  lineHeight: 1.55,
                  fontWeight: 600,
                }}
              >
                Technology that keeps your fleet{" "}
                <strong style={{ color: "#0789E8" }}>moving forward.</strong>
              </p>
            </motion.div>
          </div>
        </Reveal>

        {/* =====================================================
            INTERACTIVE BLUE FOLDERS
        ===================================================== */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "22px",
            alignItems: "stretch",
          }}
        >
          {premiumWhyItems.map((item, index) => (
            <motion.article
              key={item.metric}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.18 }}
              transition={{
                duration: 0.58,
                delay: index * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover="open"
              whileTap="open"
              style={{
                position: "relative",
                minHeight: "360px",
                perspective: "1100px",
                cursor: "pointer",
              }}
            >
              {/* FOLDER BACK + TAB */}
              <motion.div
                variants={{
                  open: {
                    y: -3,
                    boxShadow: "0 26px 56px rgba(8, 89, 168, 0.22)",
                  },
                }}
                transition={{ duration: 0.3 }}
                style={{
                  position: "absolute",
                  inset: "34px 0 0 0",
                  overflow: "hidden",
                  borderRadius: "24px",
                  border: "1px solid rgba(29, 160, 255, 0.42)",
                  background:
                    "linear-gradient(145deg, #063B79 0%, #064F98 48%, #0879D0 100%)",
                  boxShadow: "0 18px 40px rgba(8, 83, 155, 0.14)",
                }}
              >
                {/* subtle folder-grid texture */}
                <div
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    inset: 0,
                    opacity: 0.12,
                    backgroundImage:
                      "radial-gradient(circle at 70% 15%, #65D5FF 0 1px, transparent 1.5px), linear-gradient(120deg, transparent 55%, rgba(255,255,255,.18) 55.5%, transparent 56%)",
                    backgroundSize: "22px 22px, 100% 100%",
                  }}
                />

                {/* REVEALED CONTENT */}
                <motion.div
                  variants={{
                    open: { opacity: 1, y: 0 },
                  }}
                  initial={{ opacity: 0, y: 18 }}
                  transition={{ duration: 0.28, delay: 0.06 }}
                  style={{
                    position: "absolute",
                    left: "22px",
                    right: "22px",
                    bottom: "22px",
                    minHeight: "150px",
                    padding: "18px",
                    borderRadius: "17px",
                    background: "rgba(2, 37, 76, 0.76)",
                    border: "1px solid rgba(129, 217, 255, 0.24)",
                    backdropFilter: "blur(12px)",
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      color: "rgba(235, 248, 255, 0.92)",
                      fontSize: "12px",
                      lineHeight: 1.55,
                    }}
                  >
                    {item.text}
                  </p>

                  <div
                    style={{
                      display: "grid",
                      gap: "8px",
                      marginTop: "13px",
                    }}
                  >
                    {item.points.map((point) => (
                      <span
                        key={point}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          color: "#CFEFFF",
                          fontSize: "11px",
                          fontWeight: 600,
                        }}
                      >
                        <i
                          aria-hidden="true"
                          style={{
                            width: "6px",
                            height: "6px",
                            flex: "0 0 auto",
                            borderRadius: "999px",
                            background: "#35C9FF",
                            boxShadow: "0 0 10px rgba(53,201,255,.75)",
                          }}
                        />
                        {point}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </motion.div>

              {/* FOLDER TAB */}
              <motion.div
                variants={{
                  open: { y: -8 },
                }}
                transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  position: "absolute",
                  top: "17px",
                  left: "24px",
                  width: "56%",
                  height: "55px",
                  borderRadius: "18px 18px 0 0",
                  background:
                    "linear-gradient(135deg, #087ED8 0%, #0B9CEC 100%)",
                  border: "1px solid rgba(83, 194, 255, 0.38)",
                  boxShadow: "0 -6px 18px rgba(10, 132, 214, 0.10)",
                }}
              />

              {/* MOVING FRONT COVER */}
              <motion.div
                variants={{
                  open: {
                    y: -118,
                    rotateX: -5,
                    boxShadow: "0 28px 46px rgba(2, 52, 105, 0.22)",
                  },
                }}
                transition={{
                  type: "spring",
                  stiffness: 250,
                  damping: 24,
                }}
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  bottom: 0,
                  height: "284px",
                  zIndex: 3,
                  transformOrigin: "top center",
                  overflow: "hidden",
                  padding: "24px",
                  borderRadius: "24px",
                  border: "1px solid rgba(51, 182, 255, 0.46)",
                  background:
                    "linear-gradient(145deg, #074789 0%, #0669B8 58%, #078CDD 100%)",
                  boxShadow: "0 18px 36px rgba(4, 77, 148, 0.18)",
                }}
              >
                <motion.div
                  aria-hidden="true"
                  variants={{
                    open: { x: "125%" },
                  }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  style={{
                    position: "absolute",
                    top: "-20%",
                    bottom: "-20%",
                    left: "-55%",
                    width: "45%",
                    transform: "skewX(-18deg)",
                    background:
                      "linear-gradient(90deg, transparent, rgba(255,255,255,.18), transparent)",
                  }}
                />

                <div
                  style={{
                    position: "relative",
                    zIndex: 1,
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    gap: "12px",
                  }}
                >
                  <span
                    style={{
                      display: "grid",
                      placeItems: "center",
                      width: "52px",
                      height: "52px",
                      flex: "0 0 auto",
                      borderRadius: "15px",
                      color: "#FFFFFF",
                      background: "rgba(255,255,255,.12)",
                      border: "1px solid rgba(255,255,255,.20)",
                      boxShadow: "inset 0 1px 0 rgba(255,255,255,.15)",
                    }}
                  >
                    <Icon name={item.icon} className="h-[24px] w-[24px]" />
                  </span>

                  <small
                    style={{
                      color: "#BDEAFF",
                      fontSize: "12px",
                      fontWeight: 800,
                      letterSpacing: "0.06em",
                    }}
                  >
                    0{index + 1}
                  </small>
                </div>

                <div
                  style={{
                    position: "absolute",
                    left: "24px",
                    right: "24px",
                    bottom: "28px",
                    zIndex: 1,
                  }}
                >
                  <strong
                    style={{
                      display: "block",
                      color: "#FFFFFF",
                      fontSize: item.metric.length > 7 ? "21px" : "34px",
                      lineHeight: 1,
                      fontWeight: 850,
                      letterSpacing: "-0.035em",
                    }}
                  >
                    {item.metric}
                  </strong>

                  <h3
                    style={{
                      margin: "9px 0 0",
                      color: "#FFFFFF",
                      fontSize: "18px",
                      lineHeight: 1.15,
                      fontWeight: 800,
                      fontStyle: "normal",
                    }}
                  >
                    {item.title}
                  </h3>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginTop: "18px",
                      paddingTop: "14px",
                      borderTop: "1px solid rgba(255,255,255,.16)",
                    }}
                  >
                    <span
                      style={{
                        color: "#AEE8FF",
                        fontSize: "10px",
                        fontWeight: 800,
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                      }}
                    >
                      {item.action}
                    </span>

                    <motion.span
                      variants={{
                        open: { x: 4, rotate: -12 },
                      }}
                      style={{
                        display: "grid",
                        placeItems: "center",
                        width: "34px",
                        height: "34px",
                        borderRadius: "50%",
                        color: "#FFFFFF",
                        border: "1px solid rgba(255,255,255,.30)",
                        background: "rgba(255,255,255,.08)",
                      }}
                    >
                      <Icon name="arrow" className="h-[15px] w-[15px]" />
                    </motion.span>
                  </div>
                </div>
              </motion.div>

              {/* HOVER HINT */}
              <motion.span
                variants={{
                  open: { opacity: 0, y: 8 },
                }}
                transition={{ duration: 0.2 }}
                style={{
                  position: "absolute",
                  left: "50%",
                  bottom: "10px",
                  zIndex: 5,
                  transform: "translateX(-50%)",
                  color: "rgba(255,255,255,.58)",
                  fontSize: "9px",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  whiteSpace: "nowrap",
                  textTransform: "uppercase",
                  pointerEvents: "none",
                }}
              >
                Hover to open
              </motion.span>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

const intelligenceInsights: {
  icon: IconName;
  title: string;
  text: string;
  value: string;
}[] = [
  {
    icon: "shield",
    title: "Risk Intelligence",
    text: "Surface driver and vehicle risk before it becomes an incident.",
    value: "Predict",
  },
  {
    icon: "chart",
    title: "Performance Intelligence",
    text: "Turn routes, fuel, utilisation and behaviour into clear operating insight.",
    value: "Understand",
  },
  {
    icon: "spark",
    title: "Action Intelligence",
    text: "Prioritise the events that need attention and act faster.",
    value: "Respond",
  },
];

function Intelligence() {
  return (
    <section
      className={`${styles.section} ${styles.intelligenceSection}`}
      id="technology"
    >
      <div className={styles.shell}>
        <div className={styles.intelligenceLayout}>
          <Reveal className={styles.intelligenceCopy}>
            <span className={styles.eyebrow}>ROADLENZ INTELLIGENCE</span>
            <h2 style={HOME_SECTION_HEADING_STYLE}>
              Turn Fleet Data Into Actionable Intelligence.
            </h2>

            <div className={styles.intelligenceInsightList}>
              {intelligenceInsights.map((insight, index) => (
                <motion.div
                  key={insight.title}
                  className={styles.intelligenceInsightCard}
                  initial={{ opacity: 0, x: -18 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.55,
                    delay: 0.08 + index * 0.08,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  whileHover={{ x: 5 }}
                >
                  <span className={styles.intelligenceInsightIcon}>
                    <Icon name={insight.icon} />
                  </span>
                  <div>
                    <small>{insight.value}</small>
                    <h3>{insight.title}</h3>
                    <p>{insight.text}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className={styles.intelligenceActions}>
              <Link href="/technology" className={styles.primaryButton}>
                Explore Intelligence <Icon name="arrow" />
              </Link>
              <Link href="/book-demo" className={styles.secondaryButton}>
                Request a Demo
              </Link>
            </div>
          </Reveal>

          <Reveal delay={0.08} className={styles.intelligenceVisual}>
            <div className={styles.commandGlow} />

            <div className={styles.intelligenceDataArcOne} />
            <div className={styles.intelligenceDataArcTwo} />

            <div className={styles.commandFrame}>
              <div className={styles.commandBar}>
                <span />
                <span />
                <span />
                <small>ROADLENZ / INTELLIGENCE VIEW</small>
              </div>

              <SafeImage
                sources={[
                  "/home-assets/software-intelligence-desktop.png",
                  "/overview-desktop.png",
                  "/live-fleet-desktop.png",
                ]}
                alt="RoadLenz Intelligence dashboard"
                className={styles.intelligenceDashboardImage}
              />

              <i className={styles.scanLine} />
            </div>

            <SafeImage
              sources={[
                "/home-assets/software-intelligence-mobile.png",
                "/overview-mobile.png",
                "/live-fleet-mobile.png",
              ]}
              alt="RoadLenz mobile intelligence"
              className={styles.intelligencePhone}
            />

            <div className={`${styles.insightMetric} ${styles.insightMetricOne}`}>
              <span className={styles.insightDotRose} />
              <div><small>DRIVER RISK</small><strong>3 vehicles need attention</strong></div>
            </div>

            <div className={`${styles.insightMetric} ${styles.insightMetricTwo}`}>
              <span className={styles.insightDotGreen} />
              <div><small>ROUTE EFFICIENCY</small><strong>+14% this week</strong></div>
            </div>

            <div className={`${styles.insightMetric} ${styles.insightMetricThree}`}>
              <span className={styles.insightDotBlue} />
              <div><small>FUEL TREND</small><strong>8.2% lower idle usage</strong></div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}



function RoadLenzSoftware() {
  return (
    <section className={`${styles.section} ${styles.softwareShowcaseSection}`}>
      <div className={styles.softwareShowcaseBackdrop} />

      <div className={styles.shell}>
        <Reveal className={styles.softwareShowcaseHeader}>
          <span className={styles.eyebrow}>ROADLENZ SOFTWARE</span>
          <h2 style={HOME_SECTION_HEADING_STYLE}>
            One Platform. Every Screen.
          </h2>
          <p style={HOME_SECTION_DESCRIPTION_STYLE}>
            Manage, monitor and understand your fleet from desktop or mobile
            with the same connected RoadLenz intelligence.
          </p>
        </Reveal>

        <Reveal delay={0.07}>
          <Link
            href="/technology"
            className={styles.softwareShowcaseCard}
            aria-label="Explore RoadLenz fleet management software"
          >
            <div className={styles.softwareShowcaseVisual}>
              <span className={styles.softwareVisualAura} />

              <div className={styles.softwareDesktopFrame}>
                <div className={styles.softwareBrowserBar}>
                  <span />
                  <span />
                  <span />
                  <small>ROADLENZ / LIVE FLEET</small>
                </div>

                <SafeImage
                  sources={[
                    "/home-assets/software-livefleet-desktop.png",
                    "/home-assets/software-intelligence-desktop.png",
                    "/overview-desktop.png",
                  ]}
                  alt="RoadLenz desktop fleet management software"
                  className={styles.softwareDesktopScreen}
                />
              </div>

              <div className={styles.softwarePhoneFrame}>
                <SafeImage
                  sources={[
                    "/home-assets/software-livefleet-mobile.png",
                    "/home-assets/software-intelligence-mobile.png",
                    "/overview-mobile.png",
                  ]}
                  alt="RoadLenz mobile fleet application"
                  className={styles.softwareMobileScreen}
                />
              </div>

              <div className={`${styles.softwareDeviceBadge} ${styles.softwareWebBadge}`}>
                <span><Icon name="layers" /></span>
                <div>
                  <small>DESKTOP / WEB</small>
                  <strong>Fleet Command</strong>
                </div>
              </div>

              <div className={`${styles.softwareDeviceBadge} ${styles.softwareMobileBadge}`}>
                <span><Icon name="pin" /></span>
                <div>
                  <small>MOBILE APP</small>
                  <strong>Fleet Anywhere</strong>
                </div>
              </div>
            </div>

            <div className={styles.softwareShowcaseCopy}>
              <span className={styles.softwareShowcasePill}>
                WEB + MOBILE
              </span>

              <h3>RoadLenz Fleet Management Software</h3>

              <p>
                Live tracking, video telematics, route history, alerts,
                reports and fleet intelligence — connected in one RoadLenz
                experience.
              </p>

              <div className={styles.softwareShowcaseFeatures}>
                <span><Icon name="pin" /> Live Fleet</span>
                <span><Icon name="video" /> Video</span>
                <span><Icon name="route" /> Track</span>
                <span><Icon name="chart" /> Intelligence</span>
              </div>

              <div className={styles.softwareShowcaseFooter}>
                <div>
                  <small>ONE ROADLENZ PLATFORM</small>
                  <strong>Desktop. Web. Mobile.</strong>
                </div>

                <span className={styles.softwareShowcaseArrow}>
                  <Icon name="arrow" />
                </span>
              </div>
            </div>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

const clientLogos = [
  { id: "ge-vernova", name: "GE Vernova", image: "/home-assets/ge-vernova.png" },
  { id: "jost", name: "JOST", image: "/home-assets/jost.png" },
  { id: "prm", name: "PRM", image: "/home-assets/prm.png" },
  {
    id: "fuji-electric",
    name: "Fuji Electric",
    image: "/home-assets/fuji%20electric.jpg",
  },
  { id: "indospace", name: "IndoSpace", image: "/home-assets/indospace.png" },
  { id: "samsung", name: "Samsung", image: "/home-assets/samsung.png" },
  {
    id: "saint-gobain",
    name: "Saint-Gobain",
    image: "/home-assets/saint-gobain.png",
  },
  {
    id: "tambaram-police",
    name: "Tambaram Police",
    image: "/home-assets/tambaram-police.png",
  },
  {
    id: "tambaram-municipality",
    name: "Tambaram Municipality",
    image: "/home-assets/tambaram-municipality.png",
  },
  {
    id: "gcc",
    name: "Greater Chennai Corporation",
    image: "/home-assets/gcc.png",
  },
  { id: "vamosys", name: "Vamosys", image: "/home-assets/vamosys.png" },
  { id: "one-alpha", name: "One Alpha", image: "/home-assets/one-alpha.png" },
  { id: "winsure", name: "Winsure", image: "/home-assets/winsure.png" },
];

function ClientLogoCard({
  client,
}: {
  client: (typeof clientLogos)[number];
}) {
  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.025 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      style={{
        display: "grid",
        placeItems: "center",
        flex: "0 0 210px",
        height: "92px",
        padding: "16px 26px",
        borderRadius: "22px",
        border: "1px solid rgba(30, 126, 205, 0.15)",
        background: "#FFFFFF",
        boxShadow: "0 12px 28px rgba(19, 78, 130, 0.08)",
      }}
    >
      <img
        src={client.image}
        alt={client.name}
        loading="lazy"
        style={{
          display: "block",
          maxWidth: "82%",
          maxHeight: "54px",
          width: "auto",
          height: "auto",
          objectFit: "contain",
        }}
      />
    </motion.div>
  );
}

function ClientMarquee({
  customerLogos,
}: {
  customerLogos: CustomerLogoLike[];
}) {
  void customerLogos;

  const split = Math.ceil(clientLogos.length / 2);
  const rowOne = clientLogos.slice(0, split);
  const rowTwo = clientLogos.slice(split).reverse();

  const rowOneLoop = [...rowOne, ...rowOne];
  const rowTwoLoop = [...rowTwo, ...rowTwo];

  return (
    <section
      className={styles.section}
      aria-label="RoadLenz trusted clients"
      style={{
        overflow: "hidden",
        background:
          "radial-gradient(circle at 50% 0%, rgba(19, 155, 242, 0.07), transparent 34%), #FFFFFF",
        borderTop: "1px solid rgba(10, 120, 209, 0.08)",
        borderBottom: "1px solid rgba(10, 120, 209, 0.08)",
      }}
    >
      <div className={styles.shell}>
        <Reveal>
          <div style={{ maxWidth: "760px", marginBottom: "34px" }}>
            <span className={styles.eyebrow}>TRUSTED BY INDUSTRY LEADERS</span>

            <h2
              style={{
                ...HOME_SECTION_HEADING_STYLE,
                marginTop: "10px",
                color: "#092B57",
              }}
            >
              Chosen by Industry Leaders.
            </h2>

            <p
              style={{
                ...HOME_SECTION_DESCRIPTION_STYLE,
                maxWidth: "680px",
              }}
            >
              Trusted across fleet, manufacturing, mobility and infrastructure
              operations.
            </p>
          </div>
        </Reveal>
      </div>

      {/* WHITE MARQUEE AREA */}
      <div
        style={{
          display: "grid",
          gap: "16px",
          width: "100%",
          padding: "8px 0 12px",
          background: "#FFFFFF",
        }}
      >
        <div
          style={{
            overflow: "hidden",
            width: "100%",
            padding: "4px 0",
            maskImage:
              "linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)",
          }}
        >
          <motion.div
            initial={{ x: "-50%" }}
            animate={{ x: "0%" }}
            transition={{
              duration: 20,
              ease: "linear",
              repeat: Infinity,
            }}
            style={{
              display: "flex",
              width: "max-content",
              gap: "16px",
              paddingLeft: "16px",
              paddingRight: "16px",
            }}
          >
            {rowOneLoop.map((client, index) => (
              <ClientLogoCard
                client={client}
                key={`client-r1-${client.id}-${index}`}
              />
            ))}
          </motion.div>
        </div>

        <div
          style={{
            overflow: "hidden",
            width: "100%",
            padding: "4px 0",
            maskImage:
              "linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)",
          }}
        >
          <motion.div
            initial={{ x: "0%" }}
            animate={{ x: "-50%" }}
            transition={{
              duration: 22,
              ease: "linear",
              repeat: Infinity,
            }}
            style={{
              display: "flex",
              width: "max-content",
              gap: "16px",
              paddingLeft: "16px",
              paddingRight: "16px",
            }}
          >
            {rowTwoLoop.map((client, index) => (
              <ClientLogoCard
                client={client}
                key={`client-r2-${client.id}-${index}`}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

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
  x: number;
  y: number;
  tone: "blue" | "cyan" | "teal" | "violet" | "orange" | "rose";
};

const officeDefaults: Office[] = [
  {
    id: "chennai-headquarters",
    title: "Bigfox Office",
    officeType: "Headquarters",
    city: "Chennai",
    region: "Tamil Nadu",
    country: "India",
    address: [
      "Plot No. 23, Women Industrial Park",
      "SIDCO Industrial Estate",
      "Thirumudivakkam",
      "Chennai, Chengalpattu",
      "Tamil Nadu – 600044",
      "India",
    ],
    phone: "+91 98416 00444",
    email: "sales@bigfox.co.in",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Plot%20No.%2023%20Women%20Industrial%20Park%20SIDCO%20Industrial%20Estate%20Thirumudivakkam%20Chennai%20600044",
    x: 66.3,
    y: 63.2,
    tone: "rose",
  },
  {
    id: "chennai-production-unit",
    title: "Production Facility",
    officeType: "Production Unit",
    city: "Old Perungalathur",
    region: "Tamil Nadu",
    country: "India",
    address: [
      "Plot No. 46, AGS Office Staff Colony",
      "Kishkintha Road",
      "Old Perungalathur",
      "Chennai, Chengalpattu District",
      "Tamil Nadu – 600063",
      "India",
    ],
    phone: "+91 98416 00444",
    email: "sales@bigfox.co.in",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Plot%20No.%2046%20AGS%20Office%20Staff%20Colony%20Kishkintha%20Road%20Old%20Perungalathur%20Chennai%20600063",
    x: 66.8,
    y: 64.7,
    tone: "cyan",
  },
  {
    id: "bangalore",
    title: "Bangalore Branch",
    officeType: "Branch Office",
    city: "Bangalore",
    region: "Karnataka",
    country: "India",
    address: [
      "BigFox Engineering Pvt Ltd",
      "No. #29, First Main, Second Cross",
      "Bachappa Layout",
      "Bangalore - 16",
      "India",
    ],
    phone: "+91 98416 00444",
    email: "sales@bigfox.co.in",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=BigFox+Engineering+Pvt+Ltd%2C+No.+29%2C+First+Main%2C+Second+Cross%2C+Bachappa+Layout%2C+Bangalore%2C+India",
    x: 64.9,
    y: 63.4,
    tone: "teal",
  },
  {
    id: "germany-office",
    title: "Germany Office",
    officeType: "European Office",
    city: "Erlangen",
    region: "Bavaria",
    country: "Germany",
    address: ["Fraunhoferstraße 27", "91058 Erlangen", "Germany"],
    email: "sales@bigfox.co.in",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Fraunhoferstra%C3%9Fe%2027%2091058%20Erlangen%20Germany",
    x: 48.1,
    y: 32.5,
    tone: "orange",
  },
  {
    id: "netherlands-office",
    title: "Netherlands Office",
    officeType: "European Office",
    city: "Veldhoven",
    region: "North Brabant",
    country: "The Netherlands",
    address: [
      "Vlierbeek 39",
      "5501 AJ",
      "Veldhoven",
      "North Brabant",
      "The Netherlands",
    ],
    email: "sales@bigfox.co.in",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Vlierbeek%2039%205501%20AJ%20Veldhoven%20Netherlands",
    x: 46.7,
    y: 31.2,
    tone: "violet",
  },
  {
    id: "usa-office",
    title: "USA Office",
    officeType: "North America Office",
    city: "Mountain House",
    region: "California",
    country: "United States",
    address: [
      "266 W Moraga St",
      "Mountain House",
      "California 95391",
      "United States",
    ],
    email: "sales@bigfox.co.in",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=266%20W%20Moraga%20St%20Mountain%20House%20CA%2095391%20United%20States",
    x: 14.2,
    y: 42.8,
    tone: "blue",
  },
];




function GlobalPresence({ locations }: { locations: LocationLike[] }) {
  void locations;

  return (
    <section
      className={styles.section}
      id="global-presence"
      style={{
        position: "relative",
        overflow: "hidden",
        background:
          "radial-gradient(circle at 50% 0%, rgba(30, 156, 238, 0.07), transparent 30%), #ffffff",
        borderTop: "1px solid rgba(10, 120, 209, 0.08)",
      }}
    >
      <div className={styles.shell}>
        <Reveal>
          <div style={{ maxWidth: "760px", marginBottom: "32px" }}>
            <span className={styles.eyebrow}>GLOBAL PRESENCE</span>

            <h2
              style={{
                ...HOME_SECTION_HEADING_STYLE,
                marginTop: "10px",
                color: "#092B57",
              }}
            >
              Where RoadLenz Keeps You Moving.
            </h2>

            <p
              style={{
                ...HOME_SECTION_DESCRIPTION_STYLE,
                maxWidth: "680px",
              }}
            >
              Explore our offices across India, Europe and North America.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <GlobalGlobe offices={officeDefaults} />
        </Reveal>
      </div>
    </section>
  );
}

export default function HomeExperience({
  heroSlides,
  stats,
  industries,
  products,
  customerLogos,
  locations,
}: Props) {
  return (
    <main className={styles.page}>
      <Hero slides={heroSlides} />
      <TrustStrip stats={stats} />
      <Industries industries={industries} />
      <FeaturedProducts products={products} />
      <EndToEnd />
      <WhyRoadLenz />
      <Intelligence />
      <RoadLenzSoftware />
      <ClientMarquee customerLogos={customerLogos} />
      <GlobalPresence locations={locations} />
      <FleetForwardCTA />
    </main>
  );
}
