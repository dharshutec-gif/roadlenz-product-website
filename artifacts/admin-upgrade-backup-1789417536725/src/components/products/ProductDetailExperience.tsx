"use client";

import Link from "next/link";
import {
  useEffect,
  useMemo,
  useState,
} from "react";

import type {
  MediaRef,
  Product,
} from "@/lib/types";

/* =========================================================
   TYPES
========================================================= */

type StorefrontProduct =
  Product & {
    brand?: string;

    faqs?: Array<{
      label?: string;
      value?: string;
      question?: string;
      answer?: string;
    }>;
  };

type Props = {
  product:
    StorefrontProduct;

  relatedProducts:
    StorefrontProduct[];

  /*
   * Kept optional because the parent page may already
   * pass support settings. We are no longer displaying
   * a separate support section.
   */
  support?: {
    phone: string;
    email: string;
    address: string;
    hours: string;
  };
};

type CartState =
  Record<
    string,
    {
      quantity:
        number;
    }
  >;

type GalleryItem = {
  type:
    | "image"
    | "video";

  src:
    string;

  thumb:
    string;

  poster?:
    string;
};

type FaqItem = {
  question:
    string;

  answer:
    string;
};

/* =========================================================
   CART
========================================================= */

function readCart(): CartState {
  if (
    typeof window ===
    "undefined"
  ) {
    return {};
  }

  try {
    const raw =
      window.localStorage.getItem(
        "roadlenz-cart",
      );

    if (!raw) {
      return {};
    }

    const parsed =
      JSON.parse(
        raw,
      ) as unknown;

    return parsed &&
      typeof parsed ===
        "object"
      ? (
          parsed as CartState
        )
      : {};
  } catch {
    return {};
  }
}

function writeCart(
  cart:
    CartState,
) {
  if (
    typeof window ===
    "undefined"
  ) {
    return;
  }

  window.localStorage.setItem(
    "roadlenz-cart",
    JSON.stringify(
      cart,
    ),
  );

  window.dispatchEvent(
    new CustomEvent(
      "roadlenz-cart-updated",
    ),
  );
}

/* =========================================================
   HELPERS
========================================================= */

function quoteOnly(
  price?: string,
) {
  return (
    !String(
      price ??
        "",
    ).trim() ||
    /request|quote|on\s*request|contact/i.test(
      String(
        price ??
          "",
      ),
    )
  );
}

function displayName(
  name:
    string,
) {
  return name
    .replace(
      /^roadlenz\s+/i,
      "",
    )
    .trim();
}

function buildGallery(
  product:
    Product,
): GalleryItem[] {
  const rows:
    GalleryItem[] =
    [];

  const primary =
    String(
      product.image ??
        "",
    ).trim();

  if (primary) {
    rows.push({
      type:
        "image",

      src:
        primary,

      thumb:
        primary,
    });
  }

  for (
    const source
    of product.gallery ??
    []
  ) {
    const src =
      String(
        source ??
          "",
      ).trim();

    if (src) {
      rows.push({
        type:
          "image",

        src,

        thumb:
          src,
      });
    }
  }

  const video =
    product.video as
      | MediaRef
      | undefined;

  if (
    video?.src?.trim()
  ) {
    rows.push({
      type:
        "video",

      src:
        video.src,

      poster:
        video.poster,

      thumb:
        video.poster ||
        primary ||
        video.src,
    });
  }

  return rows.filter(
    (
      item,
      index,
      all,
    ) =>
      all.findIndex(
        (
          candidate,
        ) =>
          candidate.src ===
          item.src,
      ) === index,
  );
}

function stockInfo(
  product:
    StorefrontProduct,
) {
  switch (
    product.stockStatus
  ) {
    case "low-stock":
      return {
        label:
          "Low Stock",

        text:
          "text-amber-600",

        dot:
          "bg-amber-500",
      };

    case "out-of-stock":
      return {
        label:
          "Out of Stock",

        text:
          "text-red-600",

        dot:
          "bg-red-500",
      };

    case "available-on-order":
      return {
        label:
          "Available on Order",

        text:
          "text-sky-600",

        dot:
          "bg-sky-500",
      };

    case "discontinued":
      return {
        label:
          "Discontinued",

        text:
          "text-slate-500",

        dot:
          "bg-slate-400",
      };

    default:
      return {
        label:
          "In Stock",

        text:
          "text-emerald-600",

        dot:
          "bg-emerald-500",
      };
  }
}

function splitFeature(
  feature:
    string,
) {
  const value =
    feature.trim();

  const colon =
    value.indexOf(
      ":",
    );

  if (
    colon >
    0
  ) {
    return {
      title:
        value
          .slice(
            0,
            colon,
          )
          .trim(),

      text:
        value
          .slice(
            colon +
              1,
          )
          .trim(),
    };
  }

  const dash =
    value.indexOf(
      " - ",
    );

  if (
    dash >
    0
  ) {
    return {
      title:
        value
          .slice(
            0,
            dash,
          )
          .trim(),

      text:
        value
          .slice(
            dash +
              3,
          )
          .trim(),
    };
  }

  return {
    title:
      value,

    text:
      "",
  };
}

function getPrimaryDocument(
  product:
    Product,
) {
  const docs =
    product.documents ??
    [];

  return (
    docs.find(
      (
        item,
      ) =>
        /data.?sheet|brochure|catalog|catalogue/i.test(
          item.name,
        ),
    ) ||
    docs[
      0
    ] ||
    product.installationGuide ||
    null
  );
}

function getSpecValue(
  product:
    StorefrontProduct,

  label:
    string,
) {
  return (
    (
      product.specs ??
      []
    ).find(
      (
        item,
      ) =>
        item.label
          .trim()
          .toLowerCase() ===
        label
          .trim()
          .toLowerCase(),
    )?.value ||
    "—"
  );
}

function comparisonHeading(
  product:
    StorefrontProduct,
) {
  if (
    /gps/i.test(
      product.category,
    )
  ) {
    return "Compare GPS Models";
  }

  return `Compare ${product.category} Models`;
}

function buildFaqs(
  product:
    StorefrontProduct,
): FaqItem[] {
  const configured =
    (
      product.faqs ??
      []
    )
      .map(
        (
          item,
        ) => ({
          question:
            String(
              item.question ??
                item.label ??
                "",
            ).trim(),

          answer:
            String(
              item.answer ??
                item.value ??
                "",
            ).trim(),
        }),
      )
      .filter(
        (
          item,
        ) =>
          item.question &&
          item.answer,
      );

  if (
    configured.length
  ) {
    return configured.slice(
      0,
      8,
    );
  }

  const specs =
    product.specs ??
    [];

  const compatibility =
    product.compatibility ??
    [];

  const inBox =
    product.inBox ??
    [];

  const installation =
    specs.find(
      (
        item,
      ) =>
        /installation|mount/i.test(
          item.label,
        ),
    )?.value;

  const power =
    specs.find(
      (
        item,
      ) =>
        /battery|power|voltage/i.test(
          item.label,
        ),
    )?.value;

  const protection =
    specs.find(
      (
        item,
      ) =>
        /water|ip|protection|temperature/i.test(
          item.label,
        ),
    )?.value;

  return [
    {
      question:
        `What is ${displayName(
          product.name,
        )} best suited for?`,

      answer:
        compatibility.length
          ? `This model is suitable for ${compatibility.join(
              ", ",
            )}.`
          : "Suitability depends on the vehicle type and deployment requirement. Contact our team for confirmation.",
    },

    {
      question:
        "How is this product installed?",

      answer:
        installation ||
        "Installation depends on the product configuration and vehicle. Our installation team can recommend the correct mounting and wiring method.",
    },

    {
      question:
        "What power or battery requirement does it have?",

      answer:
        power ||
        "Power requirements depend on the selected model and configuration. Please review the technical specification or request confirmation.",
    },

    {
      question:
        "Can it be used in demanding environments?",

      answer:
        protection ||
        "Environmental suitability depends on the product rating and installation method.",
    },

    {
      question:
        "What comes in the box?",

      answer:
        inBox.length
          ? inBox.join(
              ", ",
            )
          : "Package contents will be confirmed in the quotation and supplied documentation.",
    },

    {
      question:
        "Where can I get full product documentation?",

      answer:
        product.documents?.length
          ? `Available documents include ${product.documents
              .map(
                (
                  item,
                ) =>
                  item.name,
              )
              .join(
                ", ",
              )}.`
          : "Use Request Quote or Request Demo and our team can share the available product documentation.",
    },
  ];
}

/* =========================================================
   ICONS
========================================================= */

function CartIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle
        cx="9"
        cy="20"
        r="1.5"
      />

      <circle
        cx="18"
        cy="20"
        r="1.5"
      />

      <path d="M3 4h2l2.4 10.2a2 2 0 0 0 1.95 1.55h7.85a2 2 0 0 0 1.92-1.45L21 8H7" />
    </svg>
  );
}

function Chevron({
  direction,
}: {
  direction:
    | "left"
    | "right";
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {direction ===
      "left" ? (
        <path d="m15 18-6-6 6-6" />
      ) : (
        <path d="m9 18 6-6-6-6" />
      )}
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <circle
        cx="11"
        cy="11"
        r="7"
      />

      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 3v11" />

      <path d="m7 10 5 5 5-5" />

      <path d="M4 21h16" />
    </svg>
  );
}

function FeatureIcon({
  index,
}: {
  index:
    number;
}) {
  const values = [
    "◉",
    "◎",
    "△",
    "⌁",
  ];

  return (
    <span>
      {
        values[
          index %
            values.length
        ]
      }
    </span>
  );
}

/* =========================================================
   SAFE IMAGE
========================================================= */

function SafeImage({
  sources,
  alt,
  className,
}: {
  sources:
    Array<
      | string
      | undefined
    >;

  alt:
    string;

  className:
    string;
}) {
  const available =
    sources.filter(
      (
        item,
      ): item is string =>
        Boolean(
          item?.trim(),
        ),
    );

  const [
    index,
    setIndex,
  ] =
    useState(
      0,
    );

  const source =
    available[
      index
    ];

  if (!source) {
    return (
      <div className="grid h-full w-full place-items-center text-center text-xs font-semibold text-slate-400">
        Product image
        unavailable
      </div>
    );
  }

  return (
    <img
      src={
        source
      }
      alt={
        alt
      }
      className={
        className
      }
      onError={() => {
        if (
          index <
          available.length -
            1
        ) {
          setIndex(
            (
              current,
            ) =>
              current +
              1,
          );
        }
      }}
    />
  );
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function ProductDetailExperience({
  product,
  relatedProducts,
}: Props) {
  const name =
    displayName(
      product.name,
    );

  const gallery =
    useMemo(
      () =>
        buildGallery(
          product,
        ),
      [
        product,
      ],
    );

  const description =
    product.description ??
    [];

  const features =
    product.features ??
    [];

  const specs =
    product.specs ??
    [];

  const badges =
    product.badges ??
    [];

  const compatibility =
    product.compatibility ??
    [];

  const inBox =
    product.inBox ??
    [];

  const brand =
    product.brand?.trim() ||
    "";

  const stock =
    stockInfo(
      product,
    );

  const primaryDocument =
    getPrimaryDocument(
      product,
    );

  const faqs =
    useMemo(
      () =>
        buildFaqs(
          product,
        ),
      [
        product,
      ],
    );

  const [
    selected,
    setSelected,
  ] =
    useState(
      0,
    );

  const [
    quantity,
    setQuantity,
  ] =
    useState(
      1,
    );

  const [
    cart,
    setCart,
  ] =
    useState<CartState>(
      () =>
        readCart(),
    );

  const [
    openFaq,
    setOpenFaq,
  ] =
    useState(
      0,
    );

  const [
    activeTab,
    setActiveTab,
  ] =
    useState(
      "overview",
    );

  /* =======================================================
     SCROLL MOTION
  ======================================================= */

  useEffect(
    () => {
      const elements =
        document.querySelectorAll<HTMLElement>(
          "[data-reveal]",
        );

      const observer =
        new IntersectionObserver(
          (
            entries,
          ) => {
            entries.forEach(
              (
                entry,
              ) => {
                if (
                  entry.isIntersecting
                ) {
                  entry.target.classList.add(
                    "reveal-active",
                  );
                }
              },
            );
          },
          {
            threshold:
              0.1,
          },
        );

      elements.forEach(
        (
          element,
        ) =>
          observer.observe(
            element,
          ),
      );

      return () =>
        observer.disconnect();
    },
    [
      product.id,
    ],
  );

  const activeMedia =
    gallery[
      selected
    ] ??
    null;

  const heroBadges = [
    ...badges,
    ...specs,
  ].slice(
    0,
    4,
  );

  const keyFeatures =
    features.slice(
      0,
      4,
    );

  const overviewVisual =
    product.gallery?.[
      1
    ] ||
    product.video?.poster ||
    product.gallery?.[
      0
    ] ||
    product.image;

  /* =======================================================
     COMPARISON TABLE
  ======================================================= */

  const comparisonProducts =
    useMemo(
      () => {
        const category =
          (
            product.category ??
            ""
          )
            .trim()
            .toLowerCase();

        const sameCategory =
          relatedProducts.filter(
            (
              item,
            ) =>
              (
                item.category ??
                ""
              )
                .trim()
                .toLowerCase() ===
              category,
          );

        return [
          product,
          ...sameCategory,
        ]
          .filter(
            (
              item,
              index,
              all,
            ) =>
              all.findIndex(
                (
                  candidate,
                ) =>
                  candidate.id ===
                  item.id,
              ) === index,
          )
          .slice(
            0,
            5,
          );
      },
      [
        product,
        relatedProducts,
      ],
    );

  const comparisonRows =
    useMemo(
      () => {
        const labels =
          comparisonProducts
            .flatMap(
              (
                item,
              ) =>
                item.specs ??
                [],
            )
            .map(
              (
                item,
              ) =>
                item.label,
            )
            .filter(
              Boolean,
            );

        return Array.from(
          new Map(
            labels.map(
              (
                label,
              ) => [
                label
                  .trim()
                  .toLowerCase(),

                label,
              ],
            ),
          ).values(),
        ).slice(
          0,
          8,
        );
      },
      [
        comparisonProducts,
      ],
    );

  const tabs = [
    [
      "overview",
      "Overview",
    ],

    [
      "features",
      "Features",
    ],

    [
      "detail",
      "Specifications",
    ],

    [
      "comparison",
      "Compare",
    ],

    [
      "before-buy",
      "Before You Buy",
    ],

    [
      "related",
      "Related Products",
    ],
  ] as const;

  /* =======================================================
     CART
  ======================================================= */

  function updateCart(
    next:
      CartState,
  ) {
    setCart(
      next,
    );

    writeCart(
      next,
    );
  }

  function addMainCart() {
    const current =
      cart[
        product.id
      ]?.quantity ??
      0;

    updateCart({
      ...cart,

      [product.id]: {
        quantity:
          current +
          quantity,
      },
    });
  }

  function relatedCart(
    item:
      StorefrontProduct,

    delta:
      number,
  ) {
    const current =
      cart[
        item.id
      ]?.quantity ??
      0;

    const nextQty =
      current +
      delta;

    const next = {
      ...cart,
    };

    if (
      nextQty <=
      0
    ) {
      delete next[
        item.id
      ];
    } else {
      next[
        item.id
      ] = {
        quantity:
          nextQty,
      };
    }

    updateCart(
      next,
    );
  }

  function changeMedia(
    delta:
      number,
  ) {
    if (
      gallery.length <
      2
    ) {
      return;
    }

    setSelected(
      (
        current,
      ) =>
        (
          current +
          delta +
          gallery.length
        ) %
        gallery.length,
    );
  }

  function goTo(
    id:
      string,
  ) {
    setActiveTab(
      id,
    );

    document
      .getElementById(
        id,
      )
      ?.scrollIntoView({
        behavior:
          "smooth",

        block:
          "start",
      });
  }

  return (
    <main className="overflow-x-hidden bg-[#f8fafc] text-[#0b1f3a]">
      {/* ===================================================
          BREADCRUMB
      =================================================== */}

      <div className="border-b border-slate-200 bg-white">
        <nav className="mx-auto flex min-h-11 max-w-[1400px] items-center gap-2 px-5 text-[11px] text-slate-500 lg:px-7">
          <Link href="/">
            Home
          </Link>

          <span>
            ›
          </span>

          <Link href="/products">
            Products
          </Link>

          <span>
            ›
          </span>

          <span>
            {
              product.category
            }
          </span>

          <span>
            ›
          </span>

          <strong className="truncate font-semibold text-slate-800">
            {
              name
            }
          </strong>
        </nav>
      </div>

      {/* ===================================================
          PRODUCT TOP
      =================================================== */}

      <section className="relative py-6">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_5%_5%,rgba(37,99,235,.08),transparent_28%),radial-gradient(circle_at_95%_12%,rgba(14,165,233,.06),transparent_28%)]" />

        <div className="relative mx-auto max-w-[1400px] px-5 lg:px-7">
          <div className="overflow-hidden rounded-[26px] border border-slate-200 bg-white p-5 shadow-[0_20px_65px_rgba(15,23,42,.07)]">
            {/* IMAGE + DETAILS */}

            <div className="grid gap-6 xl:grid-cols-[1.05fr_.95fr]">
              {/* IMAGE */}

              <div className="min-w-0">
                <div className="group relative flex h-[410px] items-center justify-center overflow-hidden rounded-[20px] border border-slate-200 bg-[#f5f8fc] p-7">
                  {product.featured ? (
                    <span className="absolute left-4 top-4 z-10 rounded-full bg-emerald-600 px-4 py-2 text-[11px] font-bold text-white shadow-md">
                      Best Seller
                    </span>
                  ) : null}

                  {gallery.length >
                  1 ? (
                    <>
                      <button
                        type="button"
                        onClick={() =>
                          changeMedia(
                            -1,
                          )
                        }
                        className="absolute left-4 top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-slate-200 bg-white/95 shadow-md"
                      >
                        <Chevron
                          direction="left"
                        />
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          changeMedia(
                            1,
                          )
                        }
                        className="absolute right-4 top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-slate-200 bg-white/95 shadow-md"
                      >
                        <Chevron
                          direction="right"
                        />
                      </button>
                    </>
                  ) : null}

                  {activeMedia?.type ===
                  "video" ? (
                    <video
                      src={
                        activeMedia.src
                      }
                      poster={
                        activeMedia.poster
                      }
                      controls
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <SafeImage
                      sources={[
                        activeMedia?.src,
                        product.image,
                        ...(
                          product.gallery ??
                          []
                        ),
                      ]}
                      alt={
                        name
                      }
                      className="h-full w-full object-contain transition duration-500 group-hover:scale-[1.02]"
                    />
                  )}

                  {activeMedia?.type ===
                    "image" &&
                  activeMedia.src ? (
                    <button
                      type="button"
                      onClick={() =>
                        window.open(
                          activeMedia.src,
                          "_blank",
                          "noopener,noreferrer",
                        )
                      }
                      className="absolute bottom-4 right-4 grid h-9 w-9 place-items-center rounded-full border border-slate-200 bg-white shadow-md"
                    >
                      <SearchIcon />
                    </button>
                  ) : null}
                </div>

                {/* THUMBNAILS */}

                {gallery.length ? (
                  <div className="mt-3 flex gap-2.5 overflow-x-auto">
                    {gallery.map(
                      (
                        item,
                        index,
                      ) => (
                        <button
                          key={`${item.src}-${index}`}
                          type="button"
                          onClick={() =>
                            setSelected(
                              index,
                            )
                          }
                          className={`flex h-[66px] w-[76px] shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white p-2 ${
                            selected ===
                            index
                              ? "border-2 border-blue-500"
                              : "border border-slate-200"
                          }`}
                        >
                          <img
                            src={
                              item.thumb
                            }
                            alt=""
                            className="h-full w-full object-contain"
                          />
                        </button>
                      ),
                    )}
                  </div>
                ) : null}
              </div>

              {/* INFO */}

              <div className="min-w-0 p-2">
                {brand ? (
                  <p className="text-[11px] font-extrabold uppercase tracking-[.14em] text-blue-600">
                    {
                      brand
                    }
                  </p>
                ) : null}

                {/* ONLY THIS HEADING ITALIC */}

                <h1 className="mt-2 text-[36px] font-black italic leading-[1.04] tracking-[-.04em] text-[#071b39]">
                  {
                    name
                  }
                </h1>

                {product.tagline ? (
                  <p className="mt-2 text-[14px] leading-6 text-slate-500">
                    {
                      product.tagline
                    }
                  </p>
                ) : null}

                {description[
                  0
                ] ? (
                  <p className="mt-4 max-w-2xl text-[13px] leading-6 text-slate-600">
                    {
                      description[
                        0
                      ]
                    }
                  </p>
                ) : null}

                {heroBadges.length ? (
                  <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {heroBadges.map(
                      (
                        item,
                        index,
                      ) => (
                        <div
                          key={`${item.label}-${index}`}
                          className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-center"
                        >
                          <span className="mx-auto grid h-9 w-9 place-items-center rounded-xl bg-blue-50 text-xs font-black text-blue-600">
                            <FeatureIcon
                              index={
                                index
                              }
                            />
                          </span>

                          <strong className="mt-2 block text-[11px] font-extrabold text-slate-800">
                            {
                              item.value
                            }
                          </strong>

                          <span className="mt-1 block text-[9px] leading-3 text-slate-500">
                            {
                              item.label
                            }
                          </span>
                        </div>
                      ),
                    )}
                  </div>
                ) : null}

                {compatibility.length ? (
                  <div className="mt-5">
                    <p className="text-[11px] font-extrabold text-slate-800">
                      Suitable For
                    </p>

                    <div className="mt-2 flex flex-wrap gap-2">
                      {compatibility
                        .slice(
                          0,
                          7,
                        )
                        .map(
                          (
                            item,
                          ) => (
                            <span
                              key={
                                item
                              }
                              className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[10px] font-bold text-slate-600"
                            >
                              {
                                item
                              }
                            </span>
                          ),
                        )}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>

            {/* PRICE / ACTION BAR */}

            <div className="mt-5 grid gap-4 rounded-[18px] border border-slate-200 bg-gradient-to-r from-white to-blue-50/40 p-5 lg:grid-cols-[.7fr_1.2fr_.9fr] lg:items-center">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[.12em] text-slate-400">
                  Price
                </p>

                <p className="mt-1 text-[25px] font-black tracking-[-.03em] text-[#071a35]">
                  {quoteOnly(
                    product.price,
                  )
                    ? "Price on Request"
                    : product.price}
                </p>

                <p className="mt-1 text-[10px] leading-4 text-slate-500">
                  {product.priceNote ||
                    (quoteOnly(
                      product.price,
                    )
                      ? "GST and installation are confirmed at quotation."
                      : "Inclusive of GST")}
                </p>
              </div>

              <div className="flex flex-wrap gap-2.5">
                {!quoteOnly(
                  product.price,
                ) ? (
                  <>
                    <div className="grid h-10 w-[90px] grid-cols-3 overflow-hidden rounded-lg border border-slate-200 bg-white">
                      <button
                        type="button"
                        onClick={() =>
                          setQuantity(
                            (
                              current,
                            ) =>
                              Math.max(
                                1,
                                current -
                                  1,
                              ),
                          )
                        }
                      >
                        −
                      </button>

                      <span className="grid place-items-center border-x border-slate-200 text-xs font-extrabold">
                        {
                          quantity
                        }
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          setQuantity(
                            (
                              current,
                            ) =>
                              current +
                              1,
                          )
                        }
                      >
                        +
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={
                        addMainCart
                      }
                      className="flex h-10 items-center gap-2 rounded-lg bg-blue-600 px-5 text-[11px] font-extrabold text-white"
                    >
                      <CartIcon />

                      Add to Cart
                    </button>
                  </>
                ) : null}

                <Link
                  href={`/request-quote?product=${encodeURIComponent(
                    name,
                  )}&qty=${quantity}`}
                  className="flex h-10 items-center rounded-lg border border-blue-500 bg-white px-5 text-[11px] font-extrabold text-slate-800"
                >
                  Request Quote
                </Link>

                <Link
                  href={`/book-demo?product=${encodeURIComponent(
                    product.slug,
                  )}`}
                  className="flex h-10 items-center rounded-lg border border-blue-500 bg-white px-5 text-[11px] font-extrabold text-slate-800"
                >
                  Request Demo
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[10px] font-semibold text-slate-600">
                <span
                  className={`col-span-2 flex items-center gap-2 font-extrabold ${stock.text}`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${stock.dot}`}
                  />

                  {
                    stock.label
                  }
                </span>

                <span>
                  ◆ Warranty
                </span>

                <span>
                  ◆ Installation
                </span>

                <span>
                  ◆ Support
                </span>

                <span>
                  ◆ GST Invoice
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================
          TABS
      =================================================== */}

      <div className="sticky top-[72px] z-30 border-y border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1400px] overflow-x-auto px-5 lg:px-7">
          {tabs.map(
            ([
              id,
              label,
            ]) => (
              <button
                key={
                  id
                }
                type="button"
                onClick={() =>
                  goTo(
                    id,
                  )
                }
                className={`relative min-h-[52px] shrink-0 px-4 text-[11px] font-bold ${
                  activeTab ===
                  id
                    ? "bg-blue-50 text-blue-600 after:absolute after:inset-x-0 after:bottom-0 after:h-[2px] after:bg-blue-600"
                    : "text-slate-500"
                }`}
              >
                {
                  label
                }
              </button>
            ),
          )}
        </div>
      </div>

      {/* ===================================================
          OVERVIEW
          SPACIOUS TEXT LEFT / IMAGE RIGHT
      =================================================== */}

      <section
        id="overview"
        data-reveal
        className="reveal-block scroll-mt-36 bg-white py-10"
      >
        <div className="mx-auto max-w-[1400px] px-5 lg:px-7">
          <div className="mb-5 flex items-center gap-3">
            <span className="h-[3px] w-7 rounded-full bg-blue-600" />

            <p className="text-[10px] font-extrabold uppercase tracking-[.18em] text-blue-600">
              Overview
            </p>
          </div>

          <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_.95fr]">
            <div className="max-w-[680px]">
              <h2 className="text-[27px] font-black leading-[1.15] tracking-[-.025em] text-[#0b2342]">
                {product.tagline ||
                  name}
              </h2>

              <div className="mt-5 space-y-4 text-[13px] leading-7 text-slate-600">
                {description.length ? (
                  description
                    .slice(
                      0,
                      3,
                    )
                    .map(
                      (
                        paragraph,
                      ) => (
                        <p
                          key={
                            paragraph
                          }
                        >
                          {
                            paragraph
                          }
                        </p>
                      ),
                    )
                ) : (
                  <p>
                    Explore the
                    capabilities
                    and deployment
                    options of this
                    product.
                  </p>
                )}
              </div>

              {primaryDocument
                ?.url ? (
                <a
                  href={
                    primaryDocument.url
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="mt-6 inline-flex h-10 items-center gap-2 rounded-lg bg-blue-600 px-5 text-[11px] font-extrabold text-white shadow-md"
                >
                  <DownloadIcon />

                  Download
                  Datasheet
                </a>
              ) : null}
            </div>

            <div className="group relative min-h-[300px] overflow-hidden rounded-[22px] bg-gradient-to-br from-blue-50 to-slate-100">
              <SafeImage
                sources={[
                  overviewVisual,
                  product.image,
                  ...(
                    product.gallery ??
                    []
                  ),
                ]}
                alt={
                  name
                }
                className="absolute inset-0 h-full w-full object-contain p-7 transition duration-700 group-hover:scale-[1.025]"
              />

              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,.07),transparent_55%)]" />
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================
          KEY FEATURES
      =================================================== */}

      <section
        id="features"
        data-reveal
        className="reveal-block scroll-mt-36 py-9"
      >
        <div className="mx-auto max-w-[1400px] px-5 lg:px-7">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3">
                <span className="h-[3px] w-7 rounded-full bg-blue-600" />

                <p className="text-[10px] font-extrabold uppercase tracking-[.18em] text-blue-600">
                  Key Features
                </p>
              </div>

              <h2 className="mt-2 text-[24px] font-black tracking-[-.025em] text-[#0b2342]">
                Engineered for
                safer,
                connected
                operations
              </h2>
            </div>
          </div>

          {keyFeatures.length ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {keyFeatures.map(
                (
                  feature,
                  index,
                ) => {
                  const item =
                    splitFeature(
                      feature,
                    );

                  return (
                    <article
                      key={`${feature}-${index}`}
                      className="feature-card group rounded-[18px] border border-slate-200 bg-white p-5 shadow-sm"
                    >
                      <span className="grid h-11 w-11 place-items-center rounded-xl bg-blue-50 text-sm font-black text-blue-600 transition group-hover:scale-110">
                        <FeatureIcon
                          index={
                            index
                          }
                        />
                      </span>

                      <h3 className="mt-4 text-[15px] font-extrabold leading-5 text-slate-800">
                        {
                          item.title
                        }
                      </h3>

                      <p className="mt-2 text-[12px] leading-5 text-slate-500">
                        {item.text ||
                          "Professional fleet-ready functionality."}
                      </p>
                    </article>
                  );
                },
              )}
            </div>
          ) : null}
        </div>
      </section>

      {/* ===================================================
          DETAIL
          TWO-COLUMN FORMAT
      =================================================== */}

      <section
        id="detail"
        data-reveal
        className="reveal-block scroll-mt-36 bg-white py-12"
      >
        <div className="mx-auto max-w-[1400px] px-5 lg:px-7">
          <div className="mb-7">
            <div className="flex items-center gap-3">
              <span className="h-[3px] w-7 rounded-full bg-blue-600" />

              <p className="text-[10px] font-extrabold uppercase tracking-[.18em] text-blue-600">
                Product Essentials
              </p>
            </div>

            <h2 className="mt-2 text-[26px] font-black tracking-[-.025em] text-[#0b2342]">
              Everything you
              need to know
            </h2>

            <p className="mt-2 text-[13px] text-slate-500">
              Detailed technical
              specifications and
              standard package
              contents.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            {/* SPECS */}

            <article className="detail-card rounded-[20px] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-3 border-b border-slate-200 pb-4">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-lg text-blue-600">
                  ⚙
                </span>

                <h3 className="text-[17px] font-black text-slate-800">
                  Technical
                  specifications
                </h3>
              </div>

              {specs.length ? (
                <div className="overflow-hidden rounded-xl border border-slate-200">
                  {specs.map(
                    (
                      spec,
                      index,
                    ) => (
                      <div
                        key={`${spec.label}-${index}`}
                        className="grid min-h-10 grid-cols-[42%_58%] border-b border-slate-200 last:border-0"
                      >
                        <div className="flex items-center bg-slate-50 px-4 text-[11px] font-bold text-slate-600">
                          {
                            spec.label
                          }
                        </div>

                        <div className="flex items-center px-4 text-[11px] font-semibold text-slate-700">
                          {
                            spec.value
                          }
                        </div>
                      </div>
                    ),
                  )}
                </div>
              ) : (
                <p className="text-sm text-slate-500">
                  Add
                  specifications
                  in Admin.
                </p>
              )}
            </article>

            {/* BOX */}

            <article className="detail-card rounded-[20px] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-3 border-b border-slate-200 pb-4">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-lg text-blue-600">
                  ◇
                </span>

                <h3 className="text-[17px] font-black text-slate-800">
                  What&apos;s in
                  the box
                </h3>
              </div>

              <div className="grid gap-3 lg:grid-cols-[1fr_160px]">
                <ul className="grid content-start gap-2.5">
                  {inBox.length ? (
                    inBox.map(
                      (
                        item,
                      ) => (
                        <li
                          key={
                            item
                          }
                          className="flex items-start gap-2.5 text-[12px] font-semibold text-slate-600"
                        >
                          <span className="font-black text-blue-600">
                            ✓
                          </span>

                          {
                            item
                          }
                        </li>
                      ),
                    )
                  ) : (
                    <li className="text-[12px] text-slate-500">
                      Package
                      contents
                      confirmed in
                      quotation.
                    </li>
                  )}
                </ul>

                <div className="flex min-h-[140px] items-center justify-center rounded-xl bg-slate-50 p-3">
                  <SafeImage
                    sources={[
                      product.image,
                      ...(
                        product.gallery ??
                        []
                      ),
                    ]}
                    alt={
                      name
                    }
                    className="h-full w-full object-contain"
                  />
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* ===================================================
          COMPARISON — TABLE ONLY
      =================================================== */}

      <section
        id="comparison"
        data-reveal
        className="reveal-block scroll-mt-36 py-12"
      >
        <div className="mx-auto max-w-[1400px] px-5 lg:px-7">
          <div className="mb-6">
            <div className="flex items-center gap-3">
              <span className="h-[3px] w-7 rounded-full bg-blue-600" />

              <p className="text-[10px] font-extrabold uppercase tracking-[.18em] text-blue-600">
                Find Your Fit
              </p>
            </div>

            <h2 className="mt-2 text-[25px] font-black tracking-[-.025em] text-[#0b2342]">
              {comparisonHeading(
                product,
              )}
            </h2>

            <p className="mt-2 max-w-2xl text-[12px] leading-5 text-slate-500">
              Compare models
              side by side and
              identify the best
              fit for your fleet
              and operating
              requirements.
            </p>
          </div>

          {comparisonProducts.length >
          1 ? (
            <div className="overflow-x-auto rounded-[18px] border border-slate-200 bg-white shadow-sm">
              <table className="w-full min-w-[900px] border-collapse text-[11px]">
                <thead>
                  <tr>
                    <th className="w-[185px] border-b border-r border-slate-200 bg-slate-50 p-4 text-left font-bold text-slate-500">
                      Feature
                    </th>

                    {comparisonProducts.map(
                      (
                        item,
                      ) => (
                        <th
                          key={
                            item.id
                          }
                          className={`border-b border-r border-slate-200 p-4 text-center last:border-r-0 ${
                            item.id ===
                            product.id
                              ? "border-t-[3px] border-t-blue-600 bg-blue-50"
                              : ""
                          }`}
                        >
                          <Link
                            href={`/products/${item.slug}`}
                            className="block text-inherit no-underline"
                          >
                            <strong className="block text-[12px] text-slate-800">
                              {displayName(
                                item.name,
                              )}
                            </strong>

                            {item.id ===
                            product.id ? (
                              <span className="mt-1.5 inline-flex rounded-full bg-blue-600 px-2.5 py-1 text-[8px] font-extrabold uppercase text-white">
                                Selected
                              </span>
                            ) : null}
                          </Link>
                        </th>
                      ),
                    )}
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <th className="border-b border-r border-slate-200 bg-slate-50 p-3.5 text-left font-bold text-slate-500">
                      Price
                    </th>

                    {comparisonProducts.map(
                      (
                        item,
                      ) => (
                        <td
                          key={`${item.id}-price`}
                          className={`border-b border-r border-slate-200 p-3.5 text-center last:border-r-0 ${
                            item.id ===
                            product.id
                              ? "bg-blue-50"
                              : ""
                          }`}
                        >
                          {item.price ||
                            "On request"}
                        </td>
                      ),
                    )}
                  </tr>

                  {comparisonRows.map(
                    (
                      label,
                    ) => (
                      <tr
                        key={
                          label
                        }
                      >
                        <th className="border-b border-r border-slate-200 bg-slate-50 p-3.5 text-left font-bold text-slate-500">
                          {
                            label
                          }
                        </th>

                        {comparisonProducts.map(
                          (
                            item,
                          ) => (
                            <td
                              key={`${item.id}-${label}`}
                              className={`border-b border-r border-slate-200 p-3.5 text-center last:border-r-0 ${
                                item.id ===
                                product.id
                                  ? "bg-blue-50"
                                  : ""
                              }`}
                            >
                              {getSpecValue(
                                item,
                                label,
                              )}
                            </td>
                          ),
                        )}
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-white p-7 text-center text-sm text-slate-500">
              Publish another
              product under{" "}
              <strong>
                {
                  product.category
                }
              </strong>{" "}
              to enable model
              comparison.
            </div>
          )}
        </div>
      </section>

      {/* ===================================================
          FAQ — SINGLE COLUMN ONLY
      =================================================== */}

      <section
        id="before-buy"
        data-reveal
        className="reveal-block scroll-mt-36 bg-white py-12"
      >
        <div className="mx-auto max-w-[1000px] px-5 lg:px-7">
          <div className="mb-7">
            <div className="flex items-center gap-3">
              <span className="h-[3px] w-7 rounded-full bg-blue-600" />

              <p className="text-[10px] font-extrabold uppercase tracking-[.18em] text-blue-600">
                Before You Buy
              </p>
            </div>

            <h2 className="mt-2 text-[25px] font-black tracking-[-.025em] text-[#0b2342]">
              Questions,
              answered.
            </h2>

            <p className="mt-2 text-[12px] text-slate-500">
              Everything you
              need to know before
              choosing this
              product.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map(
              (
                faq,
                index,
              ) => {
                const open =
                  openFaq ===
                  index;

                return (
                  <article
                    key={`${faq.question}-${index}`}
                    className={`overflow-hidden rounded-[15px] border bg-white transition duration-300 ${
                      open
                        ? "border-blue-200 shadow-md"
                        : "border-slate-200 shadow-sm hover:border-blue-200"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setOpenFaq(
                          open
                            ? -1
                            : index,
                        )
                      }
                      className="flex min-h-[62px] w-full items-center justify-between gap-4 px-5 text-left"
                    >
                      <span className="text-[13px] font-extrabold text-slate-800">
                        {
                          faq.question
                        }
                      </span>

                      <span
                        className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border text-base ${
                          open
                            ? "border-blue-600 bg-blue-600 text-white"
                            : "border-blue-200 bg-blue-50 text-blue-600"
                        }`}
                      >
                        {open
                          ? "−"
                          : "+"}
                      </span>
                    </button>

                    <div
                      className={`grid transition-all duration-300 ${
                        open
                          ? "grid-rows-[1fr] opacity-100"
                          : "grid-rows-[0fr] opacity-0"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <p className="border-t border-slate-100 px-5 pb-5 pt-4 text-[13px] leading-7 text-slate-500">
                          {
                            faq.answer
                          }
                        </p>
                      </div>
                    </div>
                  </article>
                );
              },
            )}
          </div>
        </div>
      </section>

      {/* ===================================================
          RELATED — PREMIUM BLUE FLOATING CARDS
      =================================================== */}

      <section
        id="related"
        data-reveal
        className="reveal-block scroll-mt-36 py-12"
      >
        <div className="mx-auto max-w-[1400px] px-5 lg:px-7">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <span className="h-[3px] w-7 rounded-full bg-blue-600" />

                <p className="text-[10px] font-extrabold uppercase tracking-[.18em] text-blue-600">
                  Related Products
                </p>
              </div>

              <h2 className="mt-2 text-[25px] font-black tracking-[-.025em] text-[#0b2342]">
                You may also like
              </h2>
            </div>

            <Link
              href="/products"
              className="text-[11px] font-extrabold text-blue-600"
            >
              View All →
            </Link>
          </div>

          {relatedProducts.length ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts
                .slice(
                  0,
                  4,
                )
                .map(
                  (
                    item,
                  ) => {
                    const qty =
                      cart[
                        item.id
                      ]?.quantity ??
                      0;

                    return (
                      <article
                        key={
                          item.id
                        }
                        className="blue-product-card group relative overflow-hidden rounded-[20px] border border-blue-400/40 bg-gradient-to-br from-[#1169d5] via-[#1979e8] to-[#0754bb] p-4 text-white shadow-[0_18px_40px_rgba(17,105,213,.22)]"
                      >
                        <div className="absolute -right-14 -top-14 h-40 w-40 rounded-full bg-white/10 blur-2xl" />

                        <Link
                          href={`/products/${item.slug}`}
                          className="relative block"
                        >
                          <div className="flex h-[145px] items-center justify-center rounded-2xl bg-white/90 p-4">
                            <SafeImage
                              sources={[
                                item.image,
                                ...(
                                  item.gallery ??
                                  []
                                ),
                              ]}
                              alt={
                                item.name
                              }
                              className="h-full w-full object-contain transition duration-500 group-hover:scale-[1.06]"
                            />
                          </div>
                        </Link>

                        <div className="relative mt-4">
                          {item.brand ? (
                            <p className="text-[9px] font-extrabold uppercase tracking-[.14em] text-blue-100">
                              {
                                item.brand
                              }
                            </p>
                          ) : null}

                          <Link
                            href={`/products/${item.slug}`}
                            className="no-underline"
                          >
                            <h3 className="mt-1 min-h-10 text-[15px] font-extrabold leading-5 text-white">
                              {displayName(
                                item.name,
                              )}
                            </h3>
                          </Link>

                          <p className="mt-1 line-clamp-2 min-h-9 text-[11px] leading-4 text-blue-100">
                            {item.tagline ||
                              item.category}
                          </p>

                          <div className="mt-4 flex items-end justify-between gap-3">
                            <div>
                              <p className="text-[15px] font-black text-white">
                                {quoteOnly(
                                  item.price,
                                )
                                  ? "On Request"
                                  : item.price}
                              </p>

                              {!quoteOnly(
                                item.price,
                              ) ? (
                                <p className="mt-0.5 text-[8px] text-blue-100">
                                  {
                                    item.priceNote
                                  }
                                </p>
                              ) : null}
                            </div>

                            {!quoteOnly(
                              item.price,
                            ) ? (
                              qty ? (
                                <div className="flex h-9 overflow-hidden rounded-lg border border-white/30 bg-white/10">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      relatedCart(
                                        item,
                                        -1,
                                      )
                                    }
                                    className="w-8 text-white"
                                  >
                                    −
                                  </button>

                                  <span className="grid w-8 place-items-center border-x border-white/20 text-[10px] font-black">
                                    {
                                      qty
                                    }
                                  </span>

                                  <button
                                    type="button"
                                    onClick={() =>
                                      relatedCart(
                                        item,
                                        1,
                                      )
                                    }
                                    className="w-8 text-white"
                                  >
                                    +
                                  </button>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() =>
                                    relatedCart(
                                      item,
                                      1,
                                    )
                                  }
                                  className="grid h-10 w-10 place-items-center rounded-xl bg-white text-blue-700 shadow-lg transition hover:-translate-y-1"
                                >
                                  <CartIcon />
                                </button>
                              )
                            ) : (
                              <Link
                                href={`/products/${item.slug}`}
                                className="grid h-10 w-10 place-items-center rounded-xl bg-white text-blue-700 shadow-lg"
                              >
                                →
                              </Link>
                            )}
                          </div>
                        </div>
                      </article>
                    );
                  },
                )}
            </div>
          ) : null}
        </div>
      </section>

      {/* ===================================================
          FINAL CTA
          CONTACT SUPPORT SECTION REMOVED
      =================================================== */}

      <section className="relative mt-3 overflow-hidden bg-[#03203e] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_120%,rgba(0,139,255,.42),transparent_45%)]" />

        <div className="absolute inset-0 opacity-[.05] [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:44px_44px]" />

        <div className="relative mx-auto flex min-h-[135px] max-w-[1400px] flex-col justify-between gap-6 px-5 py-8 md:flex-row md:items-center lg:px-7">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[.2em] text-cyan-300">
              Ready to get started?
            </p>

            <h2 className="mt-2 text-[25px] font-black tracking-[-.03em]">
              Let&apos;s build a
              safer, smarter fleet
              together.
            </h2>

            <p className="mt-2 text-[13px] text-white/70">
              Talk to our experts
              or request a demo
              to explore the
              right product for
              your operation.
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              href={`/book-demo?product=${encodeURIComponent(
                product.slug,
              )}`}
              className="flex h-11 min-w-[145px] items-center justify-center rounded-xl bg-white px-5 text-[12px] font-extrabold text-[#05264a] transition hover:-translate-y-0.5"
            >
              Request a Demo
            </Link>

            <Link
              href={`/request-quote?product=${encodeURIComponent(
                name,
              )}`}
              className="flex h-11 min-w-[145px] items-center justify-center rounded-xl bg-blue-600 px-5 text-[12px] font-extrabold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-blue-700"
            >
              Get a Quote
            </Link>
          </div>
        </div>
      </section>

      {/* ===================================================
          ANIMATION CSS
      =================================================== */}

      <style jsx global>{`
        .reveal-block {
          opacity: 0;
          transform: translateY(24px);
          transition:
            opacity 0.72s
              cubic-bezier(
                0.22,
                0.78,
                0.22,
                1
              ),
            transform 0.72s
              cubic-bezier(
                0.22,
                0.78,
                0.22,
                1
              );
        }

        .reveal-block.reveal-active {
          opacity: 1;
          transform: translateY(0);
        }

        .feature-card,
        .detail-card,
        .blue-product-card {
          transition:
            transform 0.32s
              ease,
            box-shadow 0.32s
              ease,
            border-color 0.32s
              ease;
        }

        .feature-card:hover,
        .detail-card:hover {
          transform: translateY(-5px);
          border-color:
            rgba(
              59,
              130,
              246,
              0.22
            );
          box-shadow:
            0 18px 42px
            rgba(
              15,
              23,
              42,
              0.09
            );
        }

        .blue-product-card:hover {
          transform:
            translateY(-7px)
            scale(1.01);
          box-shadow:
            0 26px 55px
            rgba(
              17,
              105,
              213,
              0.3
            );
        }

        @media (
          prefers-reduced-motion:
            reduce
        ) {
          .reveal-block,
          .reveal-block.reveal-active {
            opacity: 1;
            transform: none;
            transition: none;
          }

          .feature-card,
          .detail-card,
          .blue-product-card {
            transition: none;
          }
        }
      `}</style>
    </main>
  );
}