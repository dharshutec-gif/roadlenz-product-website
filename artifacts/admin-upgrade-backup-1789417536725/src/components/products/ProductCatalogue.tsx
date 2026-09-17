"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

import { Icon, SmartImage } from "@/components/ui";
import type { Product } from "@/lib/types";

type ProductCatalogueProps = {
  products: Product[];
  categories: string[];
};

type CartState = Record<string, { quantity: number }>;
type SortMode = "popular" | "newest" | "price-low" | "price-high" | "name";
type PriceFilter = "all" | "priced" | "quote";

type ProductWithPopularity = Product & {
  popularityScore?: number;
  popularity?: number;
  viewCount?: number;
  cartCount?: number;
  orderCount?: number;
  salesCount?: number;
};

type HeroSlide = {
  title: string;
  eyebrow: string;
  video: string;
};

/*
 * These are HERO labels only, not catalogue products.
 * Product cards below are rendered only from the `products` prop supplied by the backend.
 */
const HERO_SLIDES: HeroSlide[] = [
  {
    title: "MDVR",
    eyebrow: "Mobile Digital Video Recorder",
    video: "/media/products/hero/slide-1.mp4",
  },
  {
    title: "DASHCAM",
    eyebrow: "AI Video Intelligence",
    video: "/media/products/hero/slide-2.mp4",
  },
  {
    title: "CAMERAS",
    eyebrow: "Vehicle CCTV Cameras",
    video: "/media/products/hero/slide-3.mp4",
  },
  {
    title: "GPS",
    eyebrow: "Live Fleet Tracking",
    video: "/media/products/hero/slide-4.mp4",
  },
  {
    title: "FIRE SUPPRESSOR",
    eyebrow: "Vehicle Fire Protection",
    video: "/media/products/hero/slide-5.mp4",
  },
];

const PAGE_SIZE = 12;

function readCart(): CartState {
  if (typeof window === "undefined") return {};

  try {
    const raw = window.localStorage.getItem("roadlenz-cart");
    if (!raw) return {};

    const parsed = JSON.parse(raw) as unknown;
    return parsed && typeof parsed === "object" ? (parsed as CartState) : {};
  } catch {
    return {};
  }
}

function numericPrice(price?: string) {
  if (!price) return null;
  if (/request|quote|on\s*request|contact/i.test(price)) return null;

  const value = Number(price.replace(/,/g, "").replace(/[^\d.]/g, ""));
  return Number.isFinite(value) && value > 0 ? value : null;
}

function popularityScore(product: ProductWithPopularity) {
  const explicit = product.popularityScore ?? product.popularity;
  if (typeof explicit === "number") return explicit;

  const orders = product.orderCount ?? product.salesCount ?? 0;
  const carts = product.cartCount ?? 0;
  const views = product.viewCount ?? 0;

  return (
    orders * 20 +
    carts * 5 +
    views * 0.05 +
    (product.featured ? 500 : 0) +
    Math.max(0, 100 - (product.order ?? 100))
  );
}

function displayPrice(product: Product) {
  const value = product.price?.trim();

  if (!value || /request|quote|on\s*request|contact/i.test(value)) {
    return {
      main: "Price on Request",
      note: product.priceNote?.trim() || "GST confirmed in quotation",
    };
  }

  return {
    main: value,
    note: product.priceNote?.trim() || "Inclusive of GST",
  };
}

function CartIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="9" cy="20" r="1.5" />
      <circle cx="18" cy="20" r="1.5" />
      <path d="M3 4h2l2.4 10.2a2 2 0 0 0 1.95 1.55h7.85a2 2 0 0 0 1.92-1.45L21 8H7" />
    </svg>
  );
}

export default function ProductCatalogue({
  products,
  categories,
}: ProductCatalogueProps) {
  const [slideIndex, setSlideIndex] = useState(0);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Products");
  const [sortMode, setSortMode] = useState<SortMode>("popular");
  const [filterOpen, setFilterOpen] = useState(false);
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [priceFilter, setPriceFilter] = useState<PriceFilter>("all");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [cart, setCart] = useState<CartState>({});

  useEffect(() => {
    setCart(readCart());

    const sync = () => setCart(readCart());
    window.addEventListener("roadlenz-cart-updated", sync);
    window.addEventListener("storage", sync);

    return () => {
      window.removeEventListener("roadlenz-cart-updated", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSlideIndex((current) => (current + 1) % HERO_SLIDES.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [search, category, sortMode, featuredOnly, priceFilter]);

  const categoryNames = useMemo(() => {
    const clean = categories.map((item) => item.trim()).filter(Boolean);
    return ["All Products", ...Array.from(new Set(clean))];
  }, [categories]);

  const result = useMemo(() => {
    const query = search.trim().toLowerCase();

    const filtered = products.filter((product) => {
      if (category !== "All Products" && product.category !== category) return false;
      if (featuredOnly && !product.featured) return false;

      const hasNumericPrice = numericPrice(product.price) !== null;
      if (priceFilter === "priced" && !hasNumericPrice) return false;
      if (priceFilter === "quote" && hasNumericPrice) return false;

      if (!query) return true;

      const searchable = [
        product.name,
        product.slug,
        product.category,
        product.tagline,
        ...(product.description ?? []),
        ...(product.features ?? []),
        ...(product.badges ?? []).map((item) => `${item.label} ${item.value}`),
        ...(product.specs ?? []).map((item) => `${item.label} ${item.value}`),
      ]
        .join(" ")
        .toLowerCase();

      return searchable.includes(query);
    });

    return [...filtered].sort((a, b) => {
      if (sortMode === "newest") {
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }

      if (sortMode === "price-low" || sortMode === "price-high") {
        const aPrice = numericPrice(a.price);
        const bPrice = numericPrice(b.price);

        if (aPrice === null && bPrice === null) return 0;
        if (aPrice === null) return 1;
        if (bPrice === null) return -1;

        return sortMode === "price-low" ? aPrice - bPrice : bPrice - aPrice;
      }

      if (sortMode === "name") return a.name.localeCompare(b.name);

      return (
        popularityScore(b as ProductWithPopularity) -
        popularityScore(a as ProductWithPopularity)
      );
    });
  }, [products, search, category, sortMode, featuredOnly, priceFilter]);

  const visibleProducts = result.slice(0, visibleCount);
  const activeSlide = HERO_SLIDES[slideIndex];
  const totalCartQuantity = Object.values(cart).reduce(
    (total, item) => total + item.quantity,
    0,
  );

  function persistCart(next: CartState) {
    setCart(next);
    window.localStorage.setItem("roadlenz-cart", JSON.stringify(next));
    window.dispatchEvent(new CustomEvent("roadlenz-cart-updated"));
  }

  function increase(productId: string) {
    const quantity = cart[productId]?.quantity ?? 0;
    persistCart({ ...cart, [productId]: { quantity: quantity + 1 } });
  }

  function decrease(productId: string) {
    const quantity = cart[productId]?.quantity ?? 0;

    if (quantity <= 1) {
      const next = { ...cart };
      delete next[productId];
      persistCart(next);
      return;
    }

    persistCart({ ...cart, [productId]: { quantity: quantity - 1 } });
  }

  function goPrevious() {
    setSlideIndex((current) => (current - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  }

  function goNext() {
    setSlideIndex((current) => (current + 1) % HERO_SLIDES.length);
  }

  return (
    <main className="min-h-screen bg-[#f8fbff]">
      {/* =====================================================
          5-SLIDE VIDEO HERO
      ===================================================== */}
      <section className="relative isolate h-[470px] overflow-hidden bg-[#020b15] pt-[72px] text-white sm:h-[520px] lg:h-[570px]">
        <div className="absolute inset-[72px_0_0] bg-[#061425]" />

        {HERO_SLIDES.map((slide, index) => (
          <video
            key={slide.video}
            src={slide.video}
            autoPlay
            muted
            loop
            playsInline
            preload={index === 0 ? "auto" : "metadata"}
            aria-hidden="true"
            className={`absolute inset-[72px_0_0] h-[calc(100%-72px)] w-full object-cover transition-opacity duration-1000 ${
              index === slideIndex ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
          />
        ))}

        <div className="absolute inset-[72px_0_0] bg-[linear-gradient(90deg,rgba(2,10,20,.92)_0%,rgba(2,10,20,.72)_35%,rgba(2,10,20,.2)_68%,rgba(2,10,20,.34)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/60 to-transparent" />

        <div className="shell relative z-10 flex h-full items-center pb-14 pt-4">
          <motion.div
            key={`${slideIndex}-${activeSlide.title}`}
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-[620px]"
          >
            <p className="text-[10px] font-extrabold uppercase tracking-[.24em] text-[#55c8ff]">
              {activeSlide.eyebrow}
            </p>

            <h1
              className="mt-4 text-5xl font-semibold italic leading-[.96] tracking-[-.045em] text-white sm:text-6xl lg:text-[70px]"
              style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
            >
              {activeSlide.title}
            </h1>
          </motion.div>
        </div>

        <button
          type="button"
          onClick={goPrevious}
          aria-label="Previous hero slide"
          className="absolute left-4 top-[55%] z-20 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-[#55c8ff]/70 bg-[#061425]/35 text-[#7bd8ff] backdrop-blur transition hover:border-[#159dff] hover:bg-[#159dff] hover:text-white sm:left-7"
        >
          <Icon name="chevronLeft" className="h-5 w-5" />
        </button>

        <button
          type="button"
          onClick={goNext}
          aria-label="Next hero slide"
          className="absolute right-4 top-[55%] z-20 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-[#55c8ff]/70 bg-[#061425]/35 text-[#7bd8ff] backdrop-blur transition hover:border-[#159dff] hover:bg-[#159dff] hover:text-white sm:right-7"
        >
          <Icon name="chevronRight" className="h-5 w-5" />
        </button>

        <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2">
          {HERO_SLIDES.map((slide, index) => (
            <button
              key={slide.title}
              type="button"
              onClick={() => setSlideIndex(index)}
              aria-label={`Show ${slide.title}`}
              className={`relative h-[3px] overflow-hidden rounded-full transition-all ${
                index === slideIndex
                  ? "w-16 bg-[#159dff]"
                  : "w-9 bg-white/35 hover:bg-[#55c8ff]/70"
              }`}
            >
              {index === slideIndex && (
                <span className="absolute inset-y-0 left-0 w-full origin-left animate-[heroProgress_5s_linear_forwards] bg-[#74dcff]" />
              )}
            </button>
          ))}
        </div>

        <div className="absolute bottom-5 right-[5%] z-20 hidden text-[10px] font-bold tracking-[.16em] text-white/65 sm:block">
          {String(slideIndex + 1).padStart(2, "0")} / {String(HERO_SLIDES.length).padStart(2, "0")}
        </div>
      </section>

      {/* =====================================================
          SEARCH / CATEGORIES / FILTER / SORT
      ===================================================== */}
      <section id="product-list" className="scroll-mt-24 py-10 sm:py-12">
        <div className="shell">
          <label className="mx-auto flex min-h-14 max-w-4xl items-center rounded-2xl border border-[#dce6f1] bg-white px-4 shadow-[0_10px_32px_rgba(20,55,90,.06)] focus-within:border-[#159dff] focus-within:ring-4 focus-within:ring-[#159dff]/10">
            <Icon name="search" className="h-5 w-5 shrink-0 text-[#159dff]" />
            <span className="sr-only">Search products</span>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search products, models or specifications..."
              className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm text-ink outline-none placeholder:text-ink-faint"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="grid h-8 w-8 place-items-center rounded-full text-ink-faint hover:bg-mist-50 hover:text-ink"
                aria-label="Clear search"
              >
                <Icon name="x" className="h-4 w-4" />
              </button>
            )}
          </label>

          <div className="-mx-5 mt-6 overflow-x-auto px-5 pb-2 sm:mx-0 sm:px-0">
            <div className="flex min-w-max gap-2.5">
              {categoryNames.map((item) => {
                const active = category === item;

                return (
                  <button
                    type="button"
                    key={item}
                    onClick={() => setCategory(item)}
                    aria-pressed={active}
                    className={`min-h-11 rounded-xl border px-4 text-xs font-bold transition ${
                      active
                        ? "border-[#159dff] bg-[#159dff] text-white shadow-[0_10px_25px_rgba(21,157,255,.2)]"
                        : "border-[#dce6f1] bg-white text-[#294661] hover:border-[#159dff]/50 hover:text-[#087bc2]"
                    }`}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="relative mt-8 flex flex-col gap-4 border-b border-[#dce6f1] pb-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[.16em] text-[#159dff]">
                Product Catalogue
              </p>
              <h2 className="mt-2 font-display text-2xl font-extrabold tracking-[-.035em] text-ink sm:text-3xl">
                {category}
                <span className="ml-2 text-base font-semibold text-ink-faint">
                  ({result.length})
                </span>
              </h2>
            </div>

            <div className="flex flex-wrap gap-2">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setFilterOpen((open) => !open)}
                  className={`inline-flex min-h-11 items-center gap-2 rounded-lg border px-4 text-xs font-bold transition ${
                    filterOpen || featuredOnly || priceFilter !== "all"
                      ? "border-[#159dff] bg-[#eef8ff] text-[#087bc2]"
                      : "border-[#d7e2ed] bg-white text-[#294661]"
                  }`}
                >
                  <Icon name="settings" className="h-4 w-4" />
                  Filters
                  {(featuredOnly || priceFilter !== "all") && (
                    <span className="grid h-5 min-w-5 place-items-center rounded-full bg-[#159dff] px-1 text-[10px] text-white">
                      {(featuredOnly ? 1 : 0) + (priceFilter !== "all" ? 1 : 0)}
                    </span>
                  )}
                  <Icon name="chevronDown" className="h-3.5 w-3.5" />
                </button>

                {filterOpen && (
                  <div className="absolute right-0 top-[calc(100%+10px)] z-40 w-[290px] rounded-2xl border border-[#dce6f1] bg-white p-4 shadow-[0_22px_60px_rgba(24,52,82,.18)]">
                    <div className="flex items-center justify-between">
                      <strong className="text-sm text-ink">Filter products</strong>
                      <button
                        type="button"
                        onClick={() => {
                          setFeaturedOnly(false);
                          setPriceFilter("all");
                        }}
                        className="text-[11px] font-bold text-[#087bc2] hover:underline"
                      >
                        Clear
                      </button>
                    </div>

                    <label className="mt-4 flex cursor-pointer items-center justify-between rounded-xl bg-mist-50 px-3 py-3 text-xs font-semibold text-ink-soft">
                      Featured products only
                      <input
                        type="checkbox"
                        checked={featuredOnly}
                        onChange={(event) => setFeaturedOnly(event.target.checked)}
                        className="h-4 w-4 accent-[#159dff]"
                      />
                    </label>

                    <div className="mt-4">
                      <p className="text-[10px] font-extrabold uppercase tracking-[.14em] text-ink-faint">
                        Pricing
                      </p>
                      <div className="mt-2 grid gap-2">
                        {(
                          [
                            ["all", "All products"],
                            ["priced", "Products with price"],
                            ["quote", "Price on request"],
                          ] as const
                        ).map(([value, label]) => (
                          <button
                            type="button"
                            key={value}
                            onClick={() => setPriceFilter(value)}
                            className={`flex min-h-10 items-center justify-between rounded-lg border px-3 text-left text-xs font-semibold ${
                              priceFilter === value
                                ? "border-[#159dff] bg-[#eef8ff] text-[#087bc2]"
                                : "border-line text-ink-soft"
                            }`}
                          >
                            {label}
                            {priceFilter === value && (
                              <Icon name="check" className="h-4 w-4" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <label className="flex min-h-11 items-center gap-2 rounded-lg border border-[#d7e2ed] bg-white px-3 text-xs font-semibold text-ink-muted">
                <span className="hidden sm:inline">Sort by:</span>
                <select
                  value={sortMode}
                  onChange={(event) => setSortMode(event.target.value as SortMode)}
                  className="cursor-pointer bg-transparent pr-1 font-bold text-ink outline-none"
                  aria-label="Sort products"
                >
                  <option value="popular">Most Popular</option>
                  <option value="newest">Newest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name: A-Z</option>
                </select>
              </label>

              <Link
                href="/cart"
                className="relative grid h-11 w-11 place-items-center rounded-lg border border-[#d7e2ed] bg-white text-[#087bc2]"
                aria-label="Open cart"
              >
                <CartIcon />
                {totalCartQuantity > 0 && (
                  <span className="absolute -right-1.5 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-[#159dff] px-1 text-[9px] font-extrabold text-white">
                    {totalCartQuantity}
                  </span>
                )}
              </Link>
            </div>
          </div>

          {/* =================================================
              ADMIN/BACKEND PRODUCTS ONLY
          ================================================= */}
          {visibleProducts.length > 0 ? (
            <>
              <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {visibleProducts.map((product, index) => {
                  const quantity = cart[product.id]?.quantity ?? 0;
                  const price = displayPrice(product);
                  const badges = (product.badges?.length
                    ? product.badges
                    : product.specs ?? []
                  ).slice(0, 3);

                  return (
                    <motion.article
                      key={product.id}
                      initial={{ opacity: 0, y: 14 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.15 }}
                      transition={{
                        duration: 0.42,
                        delay: Math.min(index * 0.035, 0.2),
                      }}
                      className="group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-[#dce6f1] bg-white shadow-[0_12px_32px_rgba(18,50,80,.055)] transition duration-300 hover:-translate-y-1.5 hover:border-[#159dff]/45 hover:shadow-[0_20px_50px_rgba(20,70,120,.11)]"
                    >
                      <Link
                        href={`/products/${product.slug}`}
                        className="relative flex h-[215px] items-center justify-center overflow-hidden bg-[linear-gradient(180deg,#fbfdff,#f1f6fa)] p-5"
                      >
                        {product.featured && (
                          <span className="absolute left-4 top-4 z-10 rounded-full bg-[#159dff] px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[.08em] text-white">
                            Popular
                          </span>
                        )}

                        <SmartImage
                          src={product.image}
                          alt={product.name}
                          className="h-full w-full object-contain mix-blend-multiply transition duration-500 group-hover:scale-[1.045]"
                          eager={index < 4}
                        />
                      </Link>

                      <div className="flex flex-1 flex-col p-4 sm:p-5">
                        <p className="text-[9px] font-extrabold uppercase tracking-[.14em] text-[#159dff]">
                          {product.category}
                        </p>

                        <Link href={`/products/${product.slug}`} className="mt-2 block">
                          <h3 className="font-display text-[17px] font-extrabold leading-[1.2] tracking-[-.025em] text-ink transition group-hover:text-[#087bc2]">
                            {product.name}
                          </h3>
                        </Link>

                        {product.tagline && (
                          <p className="mt-2 line-clamp-2 text-[11px] leading-5 text-ink-muted">
                            {product.tagline}
                          </p>
                        )}

                        {badges.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {badges.map((badge, badgeIndex) => (
                              <span
                                key={`${badge.label}-${badge.value}-${badgeIndex}`}
                                className="rounded-md bg-[#f2f6fa] px-2 py-1 text-[9px] font-bold text-[#526a80]"
                              >
                                {badge.value || badge.label}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="mt-auto pt-5">
                          <p className="font-display text-xl font-extrabold tracking-[-.025em] text-ink">
                            {price.main}
                          </p>
                          <p className="mt-0.5 text-[10px] font-medium text-ink-faint">
                            {price.note}
                          </p>
                        </div>

                        <div className="mt-4 grid grid-cols-[1fr_1.18fr] gap-2">
                          <Link
                            href={`/products/${product.slug}`}
                            className="flex min-h-11 items-center justify-center rounded-lg border border-[#159dff]/60 bg-white px-3 text-[11px] font-extrabold text-[#087bc2] transition hover:bg-[#eef8ff]"
                          >
                            View Product
                          </Link>

                          {quantity === 0 ? (
                            <button
                              type="button"
                              onClick={() => increase(product.id)}
                              className="flex min-h-11 items-center justify-center gap-1.5 rounded-lg bg-[#159dff] px-3 text-[11px] font-extrabold text-white shadow-[0_8px_18px_rgba(21,157,255,.18)] transition hover:bg-[#087bc2]"
                            >
                              <Icon name="plus" className="h-3.5 w-3.5" />
                              Add to Cart
                            </button>
                          ) : (
                            <div className="grid min-h-11 grid-cols-[40px_1fr_40px] overflow-hidden rounded-lg border border-[#159dff] bg-[#eef8ff]">
                              <button
                                type="button"
                                onClick={() => decrease(product.id)}
                                className="grid place-items-center text-[#087bc2] transition hover:bg-[#dff2ff]"
                                aria-label={`Decrease ${product.name} quantity`}
                              >
                                <Icon name="minus" className="h-4 w-4" />
                              </button>

                              <span className="grid place-items-center border-x border-[#159dff]/25 text-xs font-extrabold text-[#075b91]">
                                {quantity}
                              </span>

                              <button
                                type="button"
                                onClick={() => increase(product.id)}
                                className="grid place-items-center text-[#087bc2] transition hover:bg-[#dff2ff]"
                                aria-label={`Increase ${product.name} quantity`}
                              >
                                <Icon name="plus" className="h-4 w-4" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.article>
                  );
                })}
              </div>

              {visibleCount < result.length && (
                <div className="mt-9 flex justify-center">
                  <button
                    type="button"
                    onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
                    className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[#159dff]/50 bg-white px-6 text-xs font-extrabold text-[#087bc2] shadow-sm transition hover:border-[#159dff] hover:bg-[#eef8ff]"
                  >
                    Load More Products
                    <Icon name="plus" className="h-4 w-4" />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="mt-7 rounded-2xl border border-dashed border-[#d7e2ed] bg-white py-14 text-center">
              <Icon name="search" className="mx-auto h-7 w-7 text-ink-faint" />
              <h3 className="mt-3 font-display text-lg font-bold text-ink">
                No published products yet
              </h3>
              <p className="mx-auto mt-1 max-w-lg text-sm text-ink-muted">
                Products will appear here after you add and publish them from the Admin Dashboard.
              </p>
            </div>
          )}
        </div>
      </section>

      <style jsx global>{`
        @keyframes heroProgress {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
      `}</style>
    </main>
  );
}
