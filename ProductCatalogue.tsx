"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  Search,
  ShoppingCart,
} from "lucide-react";
import { motion } from "framer-motion";

import type { Product } from "@/lib/types";

type ProductCatalogueProps = {
  products: Product[];
  categories: string[];
};

type CartItem = {
  quantity: number;
};

type CartState = Record<string, CartItem>;

const GST_RATE = 0.18;

function getNumericPrice(price: string | undefined) {
  if (!price) return null;

  const cleaned = price
    .replace(/,/g, "")
    .replace(/[^\d.]/g, "");

  const parsed = Number(cleaned);

  return Number.isFinite(parsed) && parsed > 0
    ? parsed
    : null;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function getProductPrice(product: Product) {
  const basePrice = getNumericPrice(product.price);

  if (basePrice === null) {
    return null;
  }

  const gst = basePrice * GST_RATE;
  const total = basePrice + gst;

  return {
    basePrice,
    gst,
    total,
  };
}

function getInitialCart(): CartState {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const stored = localStorage.getItem(
      "roadlenz-cart",
    );

    if (!stored) {
      return {};
    }

    const parsed = JSON.parse(stored);

    if (
      typeof parsed === "object" &&
      parsed !== null
    ) {
      return parsed;
    }

    return {};
  } catch {
    return {};
  }
}

export default function ProductCatalogue({
  products,
  categories,
}: ProductCatalogueProps) {
  const [search, setSearch] = useState("");

  const [activeCategory, setActiveCategory] =
    useState("ALL");

  const [cart, setCart] =
    useState<CartState>(getInitialCart);

  const categoryList = useMemo(() => {
    const cleanedCategories = categories
      .map((category) =>
        category.trim().toUpperCase(),
      )
      .filter(Boolean);

    return [
      "ALL",
      ...Array.from(
        new Set(cleanedCategories),
      ),
    ];
  }, [categories]);

  const filteredProducts = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    return products.filter((product) => {
      const productCategory =
        product.category
          ?.trim()
          .toUpperCase() || "";

      const matchesCategory =
        activeCategory === "ALL" ||
        productCategory === activeCategory;

      if (!matchesCategory) {
        return false;
      }

      if (!query) {
        return true;
      }

      const searchableText = [
        product.name,
        product.category,
        product.slug,
        product.tagline,
        ...(product.description || []),
        ...(product.features || []),
        ...(product.badges || []).map(
          (badge) =>
            `${badge.label} ${badge.value}`,
        ),
        ...(product.specs || []).map(
          (spec) =>
            `${spec.label} ${spec.value}`,
        ),
      ]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(query);
    });
  }, [
    products,
    search,
    activeCategory,
  ]);

  function persistCart(nextCart: CartState) {
    setCart(nextCart);

    if (typeof window !== "undefined") {
      localStorage.setItem(
        "roadlenz-cart",
        JSON.stringify(nextCart),
      );

      window.dispatchEvent(
        new CustomEvent(
          "roadlenz-cart-updated",
        ),
      );
    }
  }

  function addToCart(productId: string) {
    const currentQuantity =
      cart[productId]?.quantity || 0;

    persistCart({
      ...cart,
      [productId]: {
        quantity: currentQuantity + 1,
      },
    });
  }

  function increaseQuantity(
    productId: string,
  ) {
    const currentQuantity =
      cart[productId]?.quantity || 0;

    persistCart({
      ...cart,
      [productId]: {
        quantity: currentQuantity + 1,
      },
    });
  }

  function decreaseQuantity(
    productId: string,
  ) {
    const currentQuantity =
      cart[productId]?.quantity || 0;

    if (currentQuantity <= 1) {
      const nextCart = {
        ...cart,
      };

      delete nextCart[productId];

      persistCart(nextCart);

      return;
    }

    persistCart({
      ...cart,
      [productId]: {
        quantity: currentQuantity - 1,
      },
    });
  }

  const totalCartQuantity =
    Object.values(cart).reduce(
      (total, item) =>
        total + item.quantity,
      0,
    );

  return (
    <main className="min-h-screen bg-[#f7faff]">

      {/* =====================================================
          PRODUCT HERO
      ===================================================== */}

      <section className="relative isolate min-h-[680px] overflow-hidden bg-[#020b15] text-white lg:min-h-[760px]">

        {/* Background */}

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_48%,rgba(0,120,255,.18),transparent_28%),linear-gradient(115deg,#02070c_0%,#031522_55%,#01070d_100%)]" />

        {/* Technical grid */}

        <div
          className="absolute inset-0 opacity-[0.055]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
            backgroundSize: "90px 90px",
          }}
        />

        {/* Cinematic glow */}

        <motion.div
          animate={{
            scale: [1, 1.08, 1],
            opacity: [0.15, 0.23, 0.15],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute left-[58%] top-[35%] h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-[#006eff]/20 blur-[120px]"
        />

        {/* Breadcrumb */}

        <div className="absolute left-6 top-28 z-20 lg:left-12 lg:top-32">

          <div className="flex items-center gap-2 text-xs text-white/35">
            <Link
              href="/"
              className="transition hover:text-white/70"
            >
              Home
            </Link>

            <span>/</span>

            <span className="text-white/55">
              Products
            </span>

          </div>

        </div>

        {/* Main hero */}

        <div className="relative z-10 mx-auto flex min-h-[680px] max-w-[1500px] items-center px-6 pt-20 lg:min-h-[760px] lg:px-12">

          <div className="grid w-full items-center lg:grid-cols-[.75fr_1.25fr]">

            {/* Minimal text */}

            <motion.div
              initial={{
                opacity: 0,
                x: -25,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                duration: 0.8,
              }}
              className="relative z-20"
            >

              <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#48a7ff]">
                ROADLENZ
              </p>

              <h1 className="mt-4 max-w-[480px] font-display text-4xl font-bold tracking-[-0.04em] text-white sm:text-5xl lg:text-6xl">
                Products
              </h1>

            </motion.div>

            {/* Product visual */}

            <motion.div
              initial={{
                opacity: 0,
                scale: 0.92,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              transition={{
                duration: 1,
                ease: "easeOut",
              }}
              className="relative mt-[-20px] flex h-[450px] items-center justify-center lg:mt-0 lg:h-[600px]"
            >

              {/* Rings */}

              <div className="absolute h-[300px] w-[300px] rounded-full border border-white/[0.06]" />

              <div className="absolute h-[430px] w-[430px] rounded-full border border-white/[0.035]" />

              <div className="absolute h-[560px] w-[560px] rounded-full border border-white/[0.02]" />

              {/* Product */}

              {products[0]?.image ? (
                <motion.div
                  animate={{
                    y: [0, -8, 0],
                    scale: [1, 1.015, 1],
                  }}
                  transition={{
                    duration: 7,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="relative h-full w-full"
                >
                  <Image
                    src={products[0].image}
                    alt={products[0].name}
                    fill
                    priority
                    sizes="(max-width: 1024px) 90vw, 60vw"
                    className="object-contain drop-shadow-[0_40px_80px_rgba(0,0,0,.8)]"
                  />
                </motion.div>
              ) : (
                <div className="relative flex h-64 w-64 items-center justify-center rounded-full border border-white/10 bg-white/[0.03]">
                  <ShoppingCart
                    size={50}
                    className="text-[#168cff]"
                  />
                </div>
              )}

            </motion.div>

          </div>

        </div>

        {/* Hero bottom fade */}

        <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-[#f7faff] to-transparent" />

      </section>

      {/* =====================================================
          SEARCH + CATEGORIES + PRODUCTS
          NO INTRODUCTION SECTION
      ===================================================== */}

      <section
        id="products"
        className="relative scroll-mt-24 py-10 sm:py-14"
      >

        <div className="mx-auto max-w-[1500px] px-5 sm:px-8 lg:px-12">

          {/* SEARCH */}

          <div className="mx-auto max-w-4xl">

            <div className="flex min-h-[58px] items-center gap-3 rounded-2xl border border-[#dce6ef] bg-white px-5 shadow-[0_12px_35px_rgba(7,43,78,.07)] transition-all focus-within:border-[#62aaf5] focus-within:ring-4 focus-within:ring-[#006bff]/10">

              <Search
                size={19}
                className="shrink-0 text-[#006bff]"
              />

              <input
                type="search"
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value,
                  )
                }
                placeholder="Search products..."
                className="w-full bg-transparent text-sm text-[#173a5f] outline-none placeholder:text-[#9ba9b8]"
              />

              {search && (
                <button
                  type="button"
                  onClick={() =>
                    setSearch("")
                  }
                  className="text-[10px] font-bold uppercase tracking-wider text-[#8495a6] transition hover:text-[#006bff]"
                >
                  Clear
                </button>
              )}

            </div>

          </div>

          {/* =================================================
              CATEGORY NAVIGATION
          ================================================= */}

          <div className="mt-7 overflow-x-auto pb-2">

            <div className="flex min-w-max justify-center gap-2">

              {categoryList.map(
                (category) => {

                  const active =
                    activeCategory ===
                    category;

                  return (
                    <button
                      key={category}
                      type="button"
                      onClick={() =>
                        setActiveCategory(
                          category,
                        )
                      }
                      className={`min-h-10 rounded-full border px-5 text-[11px] font-bold tracking-[0.04em] transition-all duration-200 ${
                        active
                          ? "border-[#006bff] bg-[#006bff] text-white shadow-[0_8px_24px_rgba(0,107,255,.2)]"
                          : "border-[#dce5ed] bg-white text-[#536b82] hover:border-[#91c3f3] hover:text-[#006bff]"
                      }`}
                    >
                      {category}
                    </button>
                  );
                },
              )}

            </div>

          </div>

          {/* =================================================
              RESULTS BAR
          ================================================= */}

          <div className="mt-7 flex items-center justify-between border-b border-[#e5ebf1] pb-4">

            <p className="text-xs font-semibold text-[#77899b]">
              {filteredProducts.length}{" "}
              {filteredProducts.length ===
              1
                ? "Product"
                : "Products"}
            </p>

            <Link
              href="/cart"
              className="group flex items-center gap-2 text-xs font-bold text-[#006bff]"
            >

              <span className="relative">

                <ShoppingCart
                  size={17}
                />

                {totalCartQuantity >
                  0 && (
                  <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#006bff] px-1 text-[8px] font-bold text-white">
                    {totalCartQuantity}
                  </span>
                )}

              </span>

              Cart

              <ArrowRight
                size={13}
                className="transition-transform group-hover:translate-x-1"
              />

            </Link>

          </div>

          {/* =================================================
              PRODUCTS
          ================================================= */}

          {filteredProducts.length > 0 ? (

            <motion.div
              layout
              className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            >

              {filteredProducts.map(
                (product, index) => {

                  const quantity =
                    cart[product.id]
                      ?.quantity || 0;

                  return (
                    <ProductCard
                      key={product.id}
                      product={product}
                      quantity={quantity}
                      index={index}
                      onAdd={() =>
                        addToCart(
                          product.id,
                        )
                      }
                      onIncrease={() =>
                        increaseQuantity(
                          product.id,
                        )
                      }
                      onDecrease={() =>
                        decreaseQuantity(
                          product.id,
                        )
                      }
                    />
                  );
                },
              )}

            </motion.div>

          ) : (

            <div className="mt-8 rounded-3xl border border-[#dfe8f0] bg-white px-6 py-20 text-center">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eef5ff]">
                <Search
                  size={24}
                  className="text-[#006bff]"
                />
              </div>

              <h3 className="mt-5 font-display text-xl font-bold text-[#173a5f]">
                No products found
              </h3>

              <p className="mt-2 text-sm text-[#788a9d]">
                Try another search or
                category.
              </p>

              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setActiveCategory(
                    "ALL",
                  );
                }}
                className="mt-5 rounded-full bg-[#006bff] px-5 py-2.5 text-xs font-bold text-white"
              >
                View All
              </button>

            </div>

          )}

        </div>

      </section>

    </main>
  );
}

/* ============================================================
   PRODUCT CARD
============================================================ */

function ProductCard({
  product,
  quantity,
  index,
  onAdd,
  onIncrease,
  onDecrease,
}: {
  product: Product;
  quantity: number;
  index: number;
  onAdd: () => void;
  onIncrease: () => void;
  onDecrease: () => void;
}) {
  const pricing =
    getProductPrice(product);

  return (
    <motion.article
      layout
      initial={{
        opacity: 0,
        y: 20,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        margin: "-50px",
      }}
      transition={{
        duration: 0.4,
        delay:
          (index % 4) * 0.04,
      }}
      className="group flex min-w-0 flex-col overflow-hidden rounded-[24px] border border-[#dfe8f0] bg-white transition-all duration-300 hover:-translate-y-1 hover:border-[#acd1f4] hover:shadow-[0_22px_60px_rgba(7,47,86,.12)]"
    >

      {/* IMAGE */}

      <Link
        href={`/products/${product.slug}`}
        className="relative block aspect-[4/3] overflow-hidden bg-[#f4f8fc]"
      >

        <div className="absolute left-4 top-4 z-10 rounded-full border border-[#d9e9f8] bg-white/90 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.14em] text-[#006bff] shadow-sm backdrop-blur">
          {product.category}
        </div>

        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 90vw, (max-width: 1200px) 33vw, 25vw"
          className="object-contain p-7 transition-transform duration-700 group-hover:scale-[1.06]"
        />

      </Link>

      {/* DETAILS */}

      <div className="flex flex-1 flex-col p-5">

        <Link
          href={`/products/${product.slug}`}
        >
          <h3 className="font-display text-[17px] font-bold leading-snug tracking-[-0.025em] text-[#102f50] transition-colors group-hover:text-[#006bff]">
            {product.name}
          </h3>
        </Link>

        {product.tagline && (
          <p className="mt-2 line-clamp-2 text-[12px] leading-5 text-[#74869a]">
            {product.tagline}
          </p>
        )}

        {/* PRICE */}

        <div className="mt-5 border-t border-[#edf1f5] pt-4">

          {pricing ? (
            <>
              <div className="flex items-center justify-between">

                <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#8a9aaa]">
                  Price
                </span>

                <span className="font-display text-lg font-extrabold text-[#102f50]">
                  {formatCurrency(
                    pricing.basePrice,
                  )}
                </span>

              </div>

              <div className="mt-1 flex items-center justify-between text-[10px] text-[#8494a5]">

                <span>
                  GST 18%
                </span>

                <span>
                  +{" "}
                  {formatCurrency(
                    pricing.gst,
                  )}
                </span>

              </div>

              <div className="mt-2 flex items-center justify-between border-t border-[#edf1f5] pt-2">

                <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#536a80]">
                  Total
                </span>

                <span className="text-sm font-extrabold text-[#006bff]">
                  {formatCurrency(
                    pricing.total,
                  )}
                </span>

              </div>
            </>
          ) : (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#8a9aaa]">
                Pricing
              </p>

              <p className="mt-1 font-display text-base font-extrabold text-[#102f50]">
                Price on Request
              </p>

              <p className="mt-1 text-[10px] text-[#8a9aaa]">
                GST applicable as per
                quotation
              </p>
            </div>
          )}

        </div>

        {/* CART */}

        <div className="mt-5">

          {quantity === 0 ? (

            <button
              type="button"
              onClick={onAdd}
              className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#006bff] text-xs font-bold text-white shadow-[0_8px_22px_rgba(0,107,255,.18)] transition-all hover:bg-[#005bd7] active:scale-[.98]"
            >
              <ShoppingCart
                size={15}
              />

              Add to Cart
            </button>

          ) : (

            <div className="flex min-h-11 items-center justify-between rounded-xl border border-[#006bff] bg-[#f1f7ff]">

              <button
                type="button"
                onClick={onDecrease}
                className="flex h-11 w-12 items-center justify-center text-[#006bff] transition hover:bg-[#e2efff]"
                aria-label="Decrease quantity"
              >
                <span className="text-lg leading-none">
                  −
                </span>
              </button>

              <div className="text-center">

                <span className="block text-[8px] font-bold uppercase tracking-[0.12em] text-[#8094a8]">
                  Quantity
                </span>

                <span className="block text-sm font-extrabold text-[#102f50]">
                  {quantity}
                </span>

              </div>

              <button
                type="button"
                onClick={onIncrease}
                className="flex h-11 w-12 items-center justify-center text-[#006bff] transition hover:bg-[#e2efff]"
                aria-label="Increase quantity"
              >
                <span className="text-lg leading-none">
                  +
                </span>
              </button>

            </div>

          )}

        </div>

        {/* INDIVIDUAL PRODUCT */}

        <Link
          href={`/products/${product.slug}`}
          className="mt-3 flex items-center justify-center gap-1 text-[11px] font-bold text-[#667c91] transition-colors hover:text-[#006bff]"
        >
          View Product

          <ArrowRight
            size={13}
            className="transition-transform group-hover:translate-x-1"
          />
        </Link>

      </div>

    </motion.article>
  );
}