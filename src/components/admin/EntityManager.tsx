"use client";

import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  AnimatePresence,
  motion,
} from "framer-motion";

import {
  Icon,
} from "../ui";

/* =========================================================
   FIELD TYPES
========================================================= */

type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "select"
  | "categorySelect"
  | "productSelect"
  | "bool"
  | "image"
  | "imageList"
  | "mediaRef"
  | "kvList"
  | "faqList"
  | "strList"
  | "docList"
  | "docRef"
  | "linkList"
  | "resultList"
  | "journeyList"
  | "capabilityList"
  | "recommendedProductList"
  | "benefitList"
  | "statPair";

interface Field {
  key: string;

  label: string;

  type: FieldType;

  options?: string[];

  hint?: string;
}

/* =========================================================
   OPTIONS
========================================================= */

const ICON_OPTIONS = [
  "compass",
  "fleet",
  "headset",
  "map",
  "chip",
  "wrench",
  "shield",
  "brain",
  "video",
  "pin",
  "driver",
  "fuel",
  "route",
  "leaf",
  "bus",
  "truck",
  "car",
  "box",
  "users",
  "sparkle",
  "gauge",
  "alert",
  "calendar",
  "bell",
  "doc",
  "download",
  "globe",
  "building",
  "layers",
  "sliders",
  "flask",
  "plug",
  "refresh",
  "zap",
  "eye",
  "link",
  "camera",
  "gps",
];

const RES_TYPES = [
  "case-study",
  "video",
  "guide",
  "insight",
  "download",
  "warranty",
];

const LOC_TYPES = [
  "headquarters",
  "production",
  "regional",
  "office",
];

/* =========================================================
   ADMIN SCHEMAS
========================================================= */

const SCHEMAS:
  Record<
    string,
    Field[]
  > = {
    heroSlides: [
      {
        key:
          "title",

        label:
          "Heading",

        type:
          "text",
      },

      {
        key:
          "subtitle",

        label:
          "Description",

        type:
          "textarea",
      },

      {
        key:
          "primaryCta",

        label:
          "Primary button",

        type:
          "text",
      },

      {
        key:
          "primaryHref",

        label:
          "Primary link",

        type:
          "text",
      },

      {
        key:
          "secondaryCta",

        label:
          "Secondary button",

        type:
          "text",
      },

      {
        key:
          "secondaryHref",

        label:
          "Secondary link",

        type:
          "text",
      },

      {
        key:
          "media",

        label:
          "Media (image or video)",

        type:
          "mediaRef",
      },

      {
        key:
          "overlay",

        label:
          "Overlay darkness (0–1)",

        type:
          "number",

        hint:
          "0.4–0.6 recommended",
      },

      {
        key:
          "duration",

        label:
          "Slide duration (seconds)",

        type:
          "number",
      },
    ],

    stats: [
      {
        key:
          "label",

        label:
          "Label",

        type:
          "text",
      },

      {
        key:
          "value",

        label:
          "Display value",

        type:
          "text",
      },

      {
        key:
          "counter",

        label:
          "Counter target",

        type:
          "number",
      },

      {
        key:
          "suffix",

        label:
          "Suffix",

        type:
          "text",
      },

      {
        key:
          "icon",

        label:
          "Icon",

        type:
          "select",

        options:
          ICON_OPTIONS,
      },
    ],

    /* =====================================================
       PRODUCTS
    ===================================================== */

    products: [
      {
        key:
          "name",

        label:
          "Product Name",

        type:
          "text",

        hint:
          "Enter the exact product name. RoadLenz will NOT be automatically added.",
      },

      {
        key:
          "brand",

        label:
          "Brand / Manufacturer",

        type:
          "text",

        hint:
          "Optional. Example: Streamax, Howen, Jimi IoT, Hikvision, 70mai, etc.",
      },

      {
        key:
          "slug",

        label:
          "Slug",

        type:
          "text",

        hint:
          "URL path, for example 2ch-ai-dashcam",
      },

      {
        key:
          "sku",

        label:
          "SKU / Model Code",

        type:
          "text",
      },

      {
        key:
          "category",

        label:
          "Category",

        type:
          "categorySelect",
      },

      {
        key:
          "tagline",

        label:
          "Short Tagline",

        type:
          "text",
      },

      {
        key:
          "description",

        label:
          "Full Description",

        type:
          "textarea",

        hint:
          "Blank line creates another paragraph.",
      },

      {
        key:
          "price",

        label:
          "Price",

        type:
          "text",

        hint:
          "Example: ₹24,999 or On request",
      },

      {
        key:
          "priceNote",

        label:
          "GST / Price Note",

        type:
          "text",

        hint:
          "Example: Inclusive of GST",
      },

      {
        key:
          "trackInventory",

        label:
          "Track Inventory",

        type:
          "bool",
      },

      {
        key:
          "stockQuantity",

        label:
          "Stock Quantity",

        type:
          "number",
      },

      {
        key:
          "stockStatus",

        label:
          "Availability",

        type:
          "select",

        options: [
          "in-stock",
          "low-stock",
          "out-of-stock",
          "available-on-order",
          "discontinued",
        ],
      },

      {
        key:
          "lowStockThreshold",

        label:
          "Low Stock Alert At",

        type:
          "number",
      },

      {
        key:
          "order",

        label:
          "Display Order",

        type:
          "number",
      },

      {
        key:
          "image",

        label:
          "Primary Product Image",

        type:
          "image",

        hint:
          "Paste a URL or upload JPG / PNG / WebP.",
      },

      {
        key:
          "gallery",

        label:
          "Gallery Images",

        type:
          "imageList",
      },

      {
        key:
          "video",

        label:
          "Optional Product Video",

        type:
          "mediaRef",
      },

      {
        key:
          "badges",

        label:
          "Key Specification Tiles",

        type:
          "kvList",

        hint:
          "Example: 4G Connectivity / LTE, Battery / 7500mAh, Protection / IP68.",
      },

      {
        key:
          "features",

        label:
          "Features",

        type:
          "strList",

        hint:
          "Enter one feature per line.",
      },

      {
        key:
          "specs",

        label:
          "Technical Specifications",

        type:
          "kvList",
      },

      {
        key:
          "compatibility",

        label:
          "Suitable For / Compatibility",

        type:
          "strList",
      },

      {
        key:
          "inBox",

        label:
          "What's In The Box",

        type:
          "strList",
      },

      {
        key:
          "faqs",

        label:
          "Frequently Asked Questions",

        type:
          "faqList",

        hint:
          "These questions appear in the Fleettrack-style FAQ section of the product page.",
      },

      {
        key:
          "documents",

        label:
          "Documents / Datasheets",

        type:
          "docList",
      },

      {
        key:
          "installationGuide",

        label:
          "Installation Guide",

        type:
          "docRef",
      },

      {
        key:
          "warranty",

        label:
          "Warranty Details",

        type:
          "docRef",
      },

      {
        key:
          "relatedProductSlugs",

        label:
          "Related Products",

        type:
          "productSelect",
      },

      {
        key:
          "featured",

        label:
          "Featured",

        type:
          "bool",
      },
    ],

    productCategories: [
      {
        key:
          "name",

        label:
          "Category Name",

        type:
          "text",
      },

      {
        key:
          "slug",

        label:
          "Slug",

        type:
          "text",
      },

      {
        key:
          "description",

        label:
          "Description",

        type:
          "textarea",
      },
    ],

    solutions: [
      {
        key: "name",
        label: "Solution Name",
        type: "text",
      },

      {
        key: "slug",
        label: "Slug",
        type: "text",
      },

      {
        key: "industry",
        label: "Industry / Category",
        type: "text",
      },

      {
        key: "heroTitle",
        label: "Hero Title",
        type: "text",
      },

      {
        key: "heroSummary",
        label: "Hero Summary",
        type: "textarea",
      },

      {
        key: "heroMedia",
        label: "Hero Image / Video",
        type: "mediaRef",
      },

      {
        key: "heroCtaLabel",
        label: "Hero Button Label",
        type: "text",
      },

      {
        key: "heroCtaHref",
        label: "Hero Button Link",
        type: "text",
      },

      {
        key: "trustLine",
        label: "Trust Line",
        type: "text",
      },

      {
        key: "mapMedia",
        label: "Map Background",
        type: "mediaRef",
      },

      {
        key: "vehicleImage",
        label: "Vehicle Image",
        type: "image",
      },

      {
        key: "abstractPreviewImage",
        label: "Preview Image",
        type: "image",
      },

      {
        key: "relatedProductSlugs",
        label: "Related Products",
        type: "productSelect",
      },

      {
        key: "keyOutcomes",
        label: "Key Outcomes",
        type: "strList",
      },

      {
        key: "productCallouts",
        label: "Product Callouts",
        type: "kvList",
      },

      {
        key: "platformOutcomes",
        label: "Platform Outcomes",
        type: "strList",
      },

      {
        key: "bestFor",
        label: "Best For",
        type: "strList",
      },

      {
        key: "journeyStages",
        label: "Journey Stages",
        type: "journeyList",
      },

      {
        key: "capabilityTitle",
        label: "Capability Title",
        type: "text",
      },

      {
        key: "capabilities",
        label: "Capabilities",
        type: "capabilityList",
      },

      {
        key: "technologyTitle",
        label: "Technology Title",
        type: "text",
      },

      {
        key: "technologyDescription",
        label: "Technology Description",
        type: "textarea",
      },

      {
        key: "blueprintMedia",
        label: "Vehicle Blueprint",
        type: "mediaRef",
      },

      {
        key: "deviceConsoleMedia",
        label: "Device Console Visual",
        type: "mediaRef",
      },

      {
        key: "recommendedProducts",
        label: "Recommended Products",
        type: "recommendedProductList",
      },

      {
        key: "benefits",
        label: "Benefits",
        type: "benefitList",
      },

      {
        key: "outcomeTitle",
        label: "Outcome Title",
        type: "text",
      },

      {
        key: "outcomeSummary",
        label: "Outcome Summary",
        type: "textarea",
      },

      {
        key: "outcomeMedia",
        label: "Outcome Media",
        type: "mediaRef",
      },

      {
        key: "ctaTitle",
        label: "CTA Title",
        type: "text",
      },

      {
        key: "ctaSummary",
        label: "CTA Summary",
        type: "textarea",
      },

      {
        key: "ctaMedia",
        label: "CTA Media",
        type: "mediaRef",
      },

      {
        key: "ctaPrimaryLabel",
        label: "Primary CTA Label",
        type: "text",
      },

      {
        key: "ctaPrimaryHref",
        label: "Primary CTA Link",
        type: "text",
      },

      {
        key: "ctaSecondaryLabel",
        label: "Secondary CTA Label",
        type: "text",
      },

      {
        key: "ctaSecondaryHref",
        label: "Secondary CTA Link",
        type: "text",
      },

      {
        key: "sequenceNumber",
        label: "Sequence Number",
        type: "number",
      },

      {
        key: "featured",
        label: "Featured",
        type: "bool",
      },

      {
        key: "order",
        label: "Display Order",
        type: "number",
      },
    ],

    industries: [
      {
        key: "slug",
        label: "Slug",
        type: "text",
      },

      {
        key: "name",
        label: "Name",
        type: "text",
      },

      {
        key: "shortName",
        label: "Short Name",
        type: "text",
      },

      {
        key: "tagline",
        label: "Tagline",
        type: "text",
      },

      {
        key: "summary",
        label: "Summary",
        type: "textarea",
      },

      {
        key: "vehicleImage",
        label: "Vehicle Render",
        type: "image",
      },

      {
        key: "image",
        label: "Detail Image",
        type: "image",
      },

      {
        key: "challenges",
        label: "Challenges",
        type: "strList",
      },

      {
        key: "outcomes",
        label: "Outcomes",
        type: "strList",
      },

      {
        key: "capabilities",
        label: "Capabilities",
        type: "strList",
      },

      {
        key: "relatedProductSlugs",
        label: "Related Product Slugs",
        type: "strList",
      },

      {
        key: "stat",
        label: "Stat",
        type: "statPair",
      },
    ],

    caseStudies: [
      {
        key: "client",
        label: "Client Name",
        type: "text",
      },

      {
        key: "title",
        label: "Title",
        type: "text",
      },

      {
        key: "location",
        label: "Location",
        type: "text",
      },

      {
        key: "image",
        label: "Image",
        type: "image",
      },

      {
        key: "challenge",
        label: "Challenge",
        type: "textarea",
      },

      {
        key: "solution",
        label: "Solution",
        type: "textarea",
      },

      {
        key: "technology",
        label: "Technology",
        type: "strList",
      },

      {
        key: "results",
        label: "Results",
        type: "resultList",
      },

      {
        key: "approved",
        label: "Customer Approved",
        type: "bool",
      },
    ],

    customerLogos: [
      {
        key: "name",
        label: "Customer Name",
        type: "text",
      },

      {
        key: "image",
        label: "Logo",
        type: "image",
      },

      {
        key: "approved",
        label: "Approved",
        type: "bool",
      },
    ],

    resources: [
      {
        key: "type",
        label: "Type",
        type: "select",
        options:
          RES_TYPES,
      },

      {
        key: "title",
        label: "Title",
        type: "text",
      },

      {
        key: "description",
        label: "Description",
        type: "textarea",
      },

      {
        key: "image",
        label: "Thumbnail",
        type: "image",
      },

      {
        key: "media",
        label: "Media",
        type: "mediaRef",
      },

      {
        key: "file",
        label: "File",
        type: "docList",
      },

      {
        key: "meta",
        label: "Meta",
        type: "text",
      },
    ],

    locations: [
      {
        key: "name",
        label: "Name",
        type: "text",
      },

      {
        key: "city",
        label: "City",
        type: "text",
      },

      {
        key: "region",
        label: "Region",
        type: "text",
      },

      {
        key: "country",
        label: "Country",
        type: "text",
      },

      {
        key: "type",
        label: "Type",
        type: "select",
        options:
          LOC_TYPES,
      },

      {
        key: "international",
        label: "International",
        type: "bool",
      },

      {
        key: "lat",
        label: "Latitude",
        type: "number",
      },

      {
        key: "lng",
        label: "Longitude",
        type: "number",
      },

      {
        key: "address",
        label: "Address",
        type: "text",
      },

      {
        key: "phone",
        label: "Phone",
        type: "text",
      },

      {
        key: "email",
        label: "Email",
        type: "text",
      },

      {
        key: "timings",
        label: "Office Timings",
        type: "text",
      },

      {
        key: "mapsLink",
        label: "Maps Link",
        type: "text",
      },

      {
        key: "image",
        label: "Image",
        type: "image",
      },

      {
        key: "verified",
        label: "Verified",
        type: "bool",
      },
    ],

    whyPoints: [
      {
        key: "title",
        label: "Title",
        type: "text",
      },

      {
        key: "text",
        label: "Text",
        type: "textarea",
      },

      {
        key: "icon",
        label: "Icon",
        type: "select",
        options:
          ICON_OPTIONS,
      },
    ],

    ecosystemNodes: [
      {
        key: "label",
        label: "Label",
        type: "text",
      },

      {
        key: "text",
        label: "Description",
        type: "textarea",
      },

      {
        key: "icon",
        label: "Icon",
        type: "select",
        options:
          ICON_OPTIONS,
      },
    ],

    engineeringItems: [
      {
        key: "title",
        label: "Title",
        type: "text",
      },

      {
        key: "text",
        label: "Text",
        type: "text",
      },

      {
        key: "image",
        label: "Image",
        type: "image",
      },

      {
        key: "icon",
        label: "Icon",
        type: "select",
        options:
          ICON_OPTIONS,
      },
    ],

    solutionFinder: [
      {
        key: "option",
        label: "Option",
        type: "text",
      },

      {
        key: "icon",
        label: "Icon",
        type: "select",
        options:
          ICON_OPTIONS,
      },

      {
        key: "headline",
        label: "Headline",
        type: "text",
      },

      {
        key: "body",
        label: "Body",
        type: "textarea",
      },

      {
        key: "recommendation",
        label: "Recommendation",
        type: "text",
      },

      {
        key: "links",
        label: "Links",
        type: "linkList",
      },
    ],
  };

/* =========================================================
   TITLES
========================================================= */

const TITLES:
  Record<
    string,
    (
      item: any,
    ) => string
  > = {
    heroSlides:
      (item) =>
        item.title,

    stats:
      (item) =>
        `${item.value} — ${item.label}`,

    products:
      (item) =>
        item.name,

    productCategories:
      (item) =>
        item.name,

    solutions:
      (item) =>
        item.name,

    industries:
      (item) =>
        item.name,

    caseStudies:
      (item) =>
        item.title,

    customerLogos:
      (item) =>
        item.name ||
        "Untitled logo",

    resources:
      (item) =>
        item.title,

    locations:
      (item) =>
        item.name,

    whyPoints:
      (item) =>
        item.title,

    ecosystemNodes:
      (item) =>
        item.label,

    engineeringItems:
      (item) =>
        item.title,

    solutionFinder:
      (item) =>
        item.option,
  };

const SUBTITLES:
  Record<
    string,
    (
      item: any,
    ) => string
  > = {
    heroSlides:
      (item) =>
        item.subtitle,

    stats:
      (item) =>
        item.label,

    products:
      (item) =>
        [
          item.brand,
          item.category,
        ]
          .filter(
            Boolean,
          )
          .join(
            " · ",
          ),

    productCategories:
      (item) =>
        item.description,

    solutions:
      (item) =>
        item.industry,

    industries:
      (item) =>
        item.tagline,

    caseStudies:
      (item) =>
        item.client,

    customerLogos:
      () =>
        "Customer logo",

    resources:
      (item) =>
        item.type,

    locations:
      (item) =>
        `${item.city}, ${item.country}`,

    whyPoints:
      (item) =>
        item.text,

    ecosystemNodes:
      (item) =>
        item.text,

    engineeringItems:
      (item) =>
        item.text,

    solutionFinder:
      (item) =>
        item.headline,
  };

const PREVIEW:
  Record<
    string,
    (
      item: any,
    ) => string
  > = {
    products:
      (item) =>
        `/products/${item.slug}`,

    solutions:
      (item) =>
        `/solutions/${item.slug}`,

    industries:
      (item) =>
        `/industries/${item.slug}`,
  };

/* =========================================================
   FORM TRANSFORMS
========================================================= */

function toForm(
  entity: string,
  item: Record<
    string,
    any
  >,
) {
  const form:
    Record<
      string,
      any
    > = {
      ...item,
    };

  if (
    entity ===
      "products" &&
    Array.isArray(
      form.description,
    )
  ) {
    form.description =
      form.description.join(
        "\n\n",
      );
  }

  if (
    entity ===
      "industries" &&
    Array.isArray(
      form.summary,
    )
  ) {
    form.summary =
      form.summary.join(
        "\n\n",
      );
  }

  return form;
}

function fromForm(
  entity: string,
  form: Record<
    string,
    any
  >,
) {
  const out:
    Record<
      string,
      any
    > = {
      ...form,
    };

  if (
    entity ===
      "products" &&
    typeof out.description ===
      "string"
  ) {
    out.description =
      out.description
        .split(
          /\n{2,}/,
        )
        .map(
          (
            value: string,
          ) =>
            value.trim(),
        )
        .filter(
          Boolean,
        );
  }

  if (
    entity ===
    "industries"
  ) {
    if (
      typeof out.summary ===
      "string"
    ) {
      out.summary =
        out.summary
          .split(
            /\n{2,}/,
          )
          .map(
            (
              value: string,
            ) =>
              value.trim(),
          )
          .filter(
            Boolean,
          );
    }
  }

  return out;
}

/* =========================================================
   UPLOAD
========================================================= */

function UploadButton({
  value,
  onDone,
  accept =
    "image/*,video/mp4,video/webm,application/pdf",
}: {
  value?: string;

  onDone:
    (
      url: string,
    ) => void;

  accept?: string;
}) {
  const inputRef =
    useRef<HTMLInputElement>(
      null,
    );

  const [
    busy,
    setBusy,
  ] =
    useState(
      false,
    );

  const [
    error,
    setError,
  ] =
    useState(
      "",
    );

  async function onFile(
    event:
      React.ChangeEvent<HTMLInputElement>,
  ) {
    const file =
      event.target
        .files?.[0];

    if (!file) {
      return;
    }

    setBusy(
      true,
    );

    setError(
      "",
    );

    try {
      const formData =
        new FormData();

      formData.append(
        "file",
        file,
      );

      const response =
        await fetch(
          "/api/upload",
          {
            method:
              "POST",

            body:
              formData,
          },
        );

      const body =
        await response.json();

      if (
        !response.ok
      ) {
        throw new Error(
          body.error ||
            "Upload failed.",
        );
      }

      onDone(
        body.url,
      );
    } catch (
      reason
    ) {
      setError(
        reason instanceof
          Error
          ? reason.message
          : "Upload failed.",
      );
    } finally {
      setBusy(
        false,
      );

      if (
        inputRef.current
      ) {
        inputRef.current.value =
          "";
      }
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          disabled={
            busy
          }
          onClick={() =>
            inputRef.current?.click()
          }
          className="btn-ghost !py-2 text-xs disabled:opacity-60"
        >
          <Icon
            name="upload"
            className="h-3.5 w-3.5"
          />

          {busy
            ? "Uploading…"
            : value
              ? "Replace file"
              : "Upload file"}
        </button>

        {value && (
          <span className="max-w-[260px] truncate text-xs font-semibold text-ink-muted">
            {value}
          </span>
        )}
      </div>

      {error && (
        <p className="mt-1.5 text-xs font-semibold text-red-600">
          {error}
        </p>
      )}

      <input
        ref={
          inputRef
        }
        type="file"
        accept={
          accept
        }
        className="hidden"
        onChange={
          onFile
        }
      />
    </div>
  );
}

/* =========================================================
   KEY / VALUE
========================================================= */

function KvListEditor({
  value,
  onChange,
}: {
  value?: {
    label: string;

    value: string;
  }[];

  onChange:
    (
      value: {
        label: string;

        value: string;
      }[],
    ) => void;
}) {
  const rows =
    value ?? [];

  const update =
    (
      index:
        number,

      key:
        | "label"
        | "value",

      nextValue:
        string,
    ) => {
      onChange(
        rows.map(
          (
            row,
            rowIndex,
          ) =>
            rowIndex ===
            index
              ? {
                  ...row,

                  [key]:
                    nextValue,
                }
              : row,
        ),
      );
    };

  return (
    <div className="space-y-2">
      {rows.map(
        (
          row,
          index,
        ) => (
          <div
            key={
              index
            }
            className="flex items-center gap-2"
          >
            <input
              value={
                row.label
              }
              onChange={(
                event,
              ) =>
                update(
                  index,
                  "label",
                  event.target
                    .value,
                )
              }
              placeholder="Label"
              className="field !py-2 text-xs"
            />

            <input
              value={
                row.value
              }
              onChange={(
                event,
              ) =>
                update(
                  index,
                  "value",
                  event.target
                    .value,
                )
              }
              placeholder="Value"
              className="field !py-2 text-xs"
            />

            <button
              type="button"
              onClick={() =>
                onChange(
                  rows.filter(
                    (
                      _,
                      rowIndex,
                    ) =>
                      rowIndex !==
                      index,
                  ),
                )
              }
              className="rounded-full p-2 text-ink-faint hover:bg-red-50 hover:text-red-600"
            >
              <Icon
                name="x"
                className="h-3.5 w-3.5"
              />
            </button>
          </div>
        ),
      )}

      <button
        type="button"
        onClick={() =>
          onChange([
            ...rows,

            {
              label:
                "",

              value:
                "",
            },
          ])
        }
        className="text-xs font-bold text-brand-700"
      >
        + Add row
      </button>
    </div>
  );
}

/* =========================================================
   FAQ EDITOR
========================================================= */

function FaqListEditor({
  value,
  onChange,
}: {
  value?: {
    label: string;

    value: string;
  }[];

  onChange:
    (
      value: {
        label: string;

        value: string;
      }[],
    ) => void;
}) {
  const rows =
    value ?? [];

  function update(
    index:
      number,

    key:
      | "label"
      | "value",

    nextValue:
      string,
  ) {
    onChange(
      rows.map(
        (
          row,
          rowIndex,
        ) =>
          rowIndex ===
          index
            ? {
                ...row,

                [key]:
                  nextValue,
              }
            : row,
      ),
    );
  }

  return (
    <div className="space-y-3">
      {rows.map(
        (
          row,
          index,
        ) => (
          <div
            key={
              index
            }
            className="rounded-2xl border border-line bg-mist-50 p-3"
          >
            <div className="flex items-start justify-between gap-3">
              <strong className="text-xs text-ink">
                Question{" "}
                {index +
                  1}
              </strong>

              <button
                type="button"
                onClick={() =>
                  onChange(
                    rows.filter(
                      (
                        _,
                        rowIndex,
                      ) =>
                        rowIndex !==
                        index,
                    ),
                  )
                }
                className="text-xs font-bold text-red-600"
              >
                Remove
              </button>
            </div>

            <input
              value={
                row.label
              }
              onChange={(
                event,
              ) =>
                update(
                  index,
                  "label",
                  event.target
                    .value,
                )
              }
              placeholder="Question"
              className="field mt-3 !py-2 text-xs"
            />

            <textarea
              rows={
                3
              }
              value={
                row.value
              }
              onChange={(
                event,
              ) =>
                update(
                  index,
                  "value",
                  event.target
                    .value,
                )
              }
              placeholder="Answer"
              className="field mt-2 resize-y !py-2 text-xs"
            />
          </div>
        ),
      )}

      <button
        type="button"
        onClick={() =>
          onChange([
            ...rows,

            {
              label:
                "",

              value:
                "",
            },
          ])
        }
        className="btn-ghost !py-2 text-xs"
      >
        <Icon
          name="plus"
          className="h-4 w-4"
        />

        Add FAQ
      </button>
    </div>
  );
}

/* =========================================================
   STRING LIST
========================================================= */

function StrListEditor({
  value,
  onChange,
}: {
  value?: string[];

  onChange:
    (
      value:
        string[],
    ) => void;
}) {
  const [
    text,
    setText,
  ] =
    useState(
      (
        value ??
        []
      ).join(
        "\n",
      ),
    );

  useEffect(
    () => {
      setText(
        (
          value ??
          []
        ).join(
          "\n",
        ),
      );
    },
    [
      value,
    ],
  );

  return (
    <textarea
      rows={
        5
      }
      value={
        text
      }
      onChange={(
        event,
      ) => {
        const next =
          event.target
            .value;

        setText(
          next,
        );

        onChange(
          next
            .split(
              "\n",
            )
            .map(
              (
                row,
              ) =>
                row.trim(),
            )
            .filter(
              Boolean,
            ),
        );
      }}
      className="field resize-y text-xs"
      placeholder={
        "Item one\nItem two\nItem three"
      }
    />
  );
}

/* =========================================================
   IMAGE LIST
========================================================= */

function ImageListEditor({
  value,
  onChange,
}: {
  value?: string[];

  onChange:
    (
      value:
        string[],
    ) => void;
}) {
  const images =
    value ?? [];

  return (
    <div className="space-y-3">
      {images.map(
        (
          url,
          index,
        ) => (
          <div
            key={`${url}-${index}`}
            className="flex items-center gap-3 rounded-xl border border-line p-2"
          >
            <img
              src={
                url
              }
              alt=""
              className="h-16 w-20 rounded-lg bg-mist-50 object-contain p-1"
            />

            <span className="min-w-0 flex-1 truncate text-xs text-ink-muted">
              {url}
            </span>

            <button
              type="button"
              onClick={() =>
                onChange(
                  images.filter(
                    (
                      _,
                      itemIndex,
                    ) =>
                      itemIndex !==
                      index,
                  ),
                )
              }
              className="rounded-full p-2 text-ink-faint hover:bg-red-50 hover:text-red-600"
            >
              <Icon
                name="x"
                className="h-4 w-4"
              />
            </button>
          </div>
        ),
      )}

      <UploadButton
        accept="image/jpeg,image/png,image/webp,image/gif"
        onDone={(
          url,
        ) =>
          onChange([
            ...images,
            url,
          ])
        }
      />
    </div>
  );
}

/* =========================================================
   DOCUMENT LIST
========================================================= */

function DocListEditor({
  value,
  onChange,
}: {
  value?: {
    name: string;

    url: string;

    size?: string;
  }[];

  onChange:
    (
      value: {
        name:
          string;

        url:
          string;

        size?:
          string;
      }[],
    ) => void;
}) {
  const rows =
    value ?? [];

  function update(
    index:
      number,

    key:
      string,

    nextValue:
      string,
  ) {
    onChange(
      rows.map(
        (
          row,
          rowIndex,
        ) =>
          rowIndex ===
          index
            ? {
                ...row,

                [key]:
                  nextValue,
              }
            : row,
      ),
    );
  }

  return (
    <div className="space-y-3">
      {rows.map(
        (
          row,
          index,
        ) => (
          <div
            key={
              index
            }
            className="rounded-2xl border border-line p-3"
          >
            <div className="flex gap-2">
              <input
                value={
                  row.name
                }
                onChange={(
                  event,
                ) =>
                  update(
                    index,
                    "name",
                    event.target
                      .value,
                  )
                }
                placeholder="Document name"
                className="field !py-2 text-xs"
              />

              <button
                type="button"
                onClick={() =>
                  onChange(
                    rows.filter(
                      (
                        _,
                        rowIndex,
                      ) =>
                        rowIndex !==
                        index,
                    ),
                  )
                }
                className="rounded-full p-2 text-red-600"
              >
                <Icon
                  name="x"
                />
              </button>
            </div>

            <input
              value={
                row.url
              }
              onChange={(
                event,
              ) =>
                update(
                  index,
                  "url",
                  event.target
                    .value,
                )
              }
              placeholder="PDF URL"
              className="field mt-2 !py-2 text-xs"
            />

            <div className="mt-2">
              <UploadButton
                accept="application/pdf"
                value={
                  row.url
                }
                onDone={(
                  url,
                ) =>
                  update(
                    index,
                    "url",
                    url,
                  )
                }
              />
            </div>
          </div>
        ),
      )}

      <button
        type="button"
        onClick={() =>
          onChange([
            ...rows,

            {
              name:
                "",

              url:
                "",
            },
          ])
        }
        className="text-xs font-bold text-brand-700"
      >
        + Add document
      </button>
    </div>
  );
}

/* =========================================================
   DOCUMENT REF
========================================================= */

function DocRefEditor({
  value,
  onChange,
}: {
  value?: {
    name:
      string;

    url:
      string;

    size?:
      string;
  };

  onChange:
    (
      value:
        | {
            name:
              string;

            url:
              string;

            size?:
              string;
          }
        | undefined,
    ) => void;
}) {
  const doc =
    value ?? {
      name:
        "",

      url:
        "",
    };

  return (
    <div className="space-y-2 rounded-2xl border border-line p-3">
      <input
        value={
          doc.name
        }
        onChange={(
          event,
        ) =>
          onChange({
            ...doc,

            name:
              event.target
                .value,
          })
        }
        placeholder="Document name"
        className="field !py-2 text-xs"
      />

      <input
        value={
          doc.url
        }
        onChange={(
          event,
        ) =>
          onChange({
            ...doc,

            url:
              event.target
                .value,
          })
        }
        placeholder="Optional document URL"
        className="field !py-2 text-xs"
      />

      <div className="flex items-center justify-between gap-2">
        <UploadButton
          accept="application/pdf"
          value={
            doc.url
          }
          onDone={(
            url,
          ) =>
            onChange({
              ...doc,

              url,
            })
          }
        />

        {value && (
          <button
            type="button"
            onClick={() =>
              onChange(
                undefined,
              )
            }
            className="text-xs font-bold text-red-600"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
}

/* =========================================================
   LINKS / RESULTS
========================================================= */

function LinkListEditor({
  value,
  onChange,
}: {
  value?: {
    label:
      string;

    href:
      string;
  }[];

  onChange:
    (
      value: {
        label:
          string;

        href:
          string;
      }[],
    ) => void;
}) {
  const rows =
    value ?? [];

  return (
    <div className="space-y-2">
      {rows.map(
        (
          row,
          index,
        ) => (
          <div
            key={
              index
            }
            className="flex gap-2"
          >
            <input
              value={
                row.label
              }
              onChange={(
                event,
              ) =>
                onChange(
                  rows.map(
                    (
                      item,
                      rowIndex,
                    ) =>
                      rowIndex ===
                      index
                        ? {
                            ...item,

                            label:
                              event.target
                                .value,
                          }
                        : item,
                  ),
                )
              }
              placeholder="Label"
              className="field !py-2 text-xs"
            />

            <input
              value={
                row.href
              }
              onChange={(
                event,
              ) =>
                onChange(
                  rows.map(
                    (
                      item,
                      rowIndex,
                    ) =>
                      rowIndex ===
                      index
                        ? {
                            ...item,

                            href:
                              event.target
                                .value,
                          }
                        : item,
                  ),
                )
              }
              placeholder="/link"
              className="field !py-2 text-xs"
            />
          </div>
        ),
      )}

      <button
        type="button"
        onClick={() =>
          onChange([
            ...rows,

            {
              label:
                "",

              href:
                "",
            },
          ])
        }
        className="text-xs font-bold text-brand-700"
      >
        + Add link
      </button>
    </div>
  );
}

function ResultListEditor({
  value,
  onChange,
}: {
  value?: any[];

  onChange:
    (
      value:
        any[],
    ) => void;
}) {
  const rows =
    value ?? [];

  return (
    <div className="space-y-2">
      {rows.map(
        (
          row,
          index,
        ) => (
          <div
            key={
              index
            }
            className="flex gap-2"
          >
            <input
              value={
                row.metric ??
                ""
              }
              onChange={(
                event,
              ) =>
                onChange(
                  rows.map(
                    (
                      item,
                      rowIndex,
                    ) =>
                      rowIndex ===
                      index
                        ? {
                            ...item,

                            metric:
                              event.target
                                .value,
                          }
                        : item,
                  ),
                )
              }
              placeholder="Metric"
              className="field !py-2 text-xs"
            />

            <input
              value={
                row.note ??
                ""
              }
              onChange={(
                event,
              ) =>
                onChange(
                  rows.map(
                    (
                      item,
                      rowIndex,
                    ) =>
                      rowIndex ===
                      index
                        ? {
                            ...item,

                            note:
                              event.target
                                .value,
                          }
                        : item,
                  ),
                )
              }
              placeholder="Note"
              className="field !py-2 text-xs"
            />
          </div>
        ),
      )}

      <button
        type="button"
        onClick={() =>
          onChange([
            ...rows,

            {
              metric:
                "",

              note:
                "",
            },
          ])
        }
        className="text-xs font-bold text-brand-700"
      >
        + Add result
      </button>
    </div>
  );
}

/* =========================================================
   MEDIA
========================================================= */

function MediaRefEditor({
  value,
  onChange,
}: {
  value?: {
    type:
      | "image"
      | "video";

    src:
      string;

    poster?:
      string;
  };

  onChange:
    (
      value:
        any,
    ) => void;
}) {
  const current =
    value ?? {
      type:
        "image",

      src:
        "",

      poster:
        "",
    };

  return (
    <div className="space-y-3 rounded-2xl border border-line p-3">
      <div className="flex gap-4">
        <label className="flex items-center gap-2 text-xs font-semibold">
          <input
            type="radio"
            checked={
              current.type ===
              "image"
            }
            onChange={() =>
              onChange({
                ...current,

                type:
                  "image",
              })
            }
          />

          Image
        </label>

        <label className="flex items-center gap-2 text-xs font-semibold">
          <input
            type="radio"
            checked={
              current.type ===
              "video"
            }
            onChange={() =>
              onChange({
                ...current,

                type:
                  "video",
              })
            }
          />

          Video
        </label>
      </div>

      <input
        value={
          current.src
        }
        onChange={(
          event,
        ) =>
          onChange({
            ...current,

            src:
              event.target
                .value,
          })
        }
        placeholder="Media URL"
        className="field !py-2 text-xs"
      />

      <UploadButton
        value={
          current.src
        }
        accept={
          current.type ===
          "video"
            ? "video/mp4,video/webm"
            : "image/jpeg,image/png,image/webp,image/gif"
        }
        onDone={(
          url,
        ) =>
          onChange({
            ...current,

            src:
              url,
          })
        }
      />

      {current.type ===
        "video" && (
        <>
          <input
            value={
              current.poster ??
              ""
            }
            onChange={(
              event,
            ) =>
              onChange({
                ...current,

                poster:
                  event.target
                    .value,
              })
            }
            placeholder="Poster image URL"
            className="field !py-2 text-xs"
          />

          <UploadButton
            value={
              current.poster
            }
            accept="image/jpeg,image/png,image/webp"
            onDone={(
              url,
            ) =>
              onChange({
                ...current,

                poster:
                  url,
              })
            }
          />
        </>
      )}
    </div>
  );
}

/* =========================================================
   STAT
========================================================= */

function StatPairEditor({
  value,
  onChange,
}: {
  value?: {
    value:
      string;

    label:
      string;
  };

  onChange:
    (
      value:
        any,
    ) => void;
}) {
  const current =
    value ?? {
      value:
        "",

      label:
        "",
    };

  return (
    <div className="grid gap-2 sm:grid-cols-2">
      <input
        value={
          current.value
        }
        onChange={(
          event,
        ) =>
          onChange({
            ...current,

            value:
              event.target
                .value,
          })
        }
        placeholder="Value"
        className="field !py-2 text-xs"
      />

      <input
        value={
          current.label
        }
        onChange={(
          event,
        ) =>
          onChange({
            ...current,

            label:
              event.target
                .value,
          })
        }
        placeholder="Label"
        className="field !py-2 text-xs"
      />
    </div>
  );
}

/* =========================================================
   GENERIC COMPLEX LISTS
========================================================= */

function JsonListEditor({
  value,
  onChange,
}: {
  value?: any[];

  onChange:
    (
      value:
        any[],
    ) => void;
}) {
  const [
    text,
    setText,
  ] =
    useState(
      JSON.stringify(
        value ??
          [],
        null,
        2,
      ),
    );

  useEffect(
    () => {
      setText(
        JSON.stringify(
          value ??
            [],
          null,
          2,
        ),
      );
    },
    [
      value,
    ],
  );

  return (
    <textarea
      rows={
        8
      }
      value={
        text
      }
      onChange={(
        event,
      ) => {
        const next =
          event.target
            .value;

        setText(
          next,
        );

        try {
          const parsed =
            JSON.parse(
              next,
            );

          if (
            Array.isArray(
              parsed,
            )
          ) {
            onChange(
              parsed,
            );
          }
        } catch {
          // Keep typing.
        }
      }}
      className="field resize-y font-mono text-xs"
    />
  );
}

/* =========================================================
   MAIN MANAGER
========================================================= */

export default function EntityManager({
  entity,
}: {
  entity:
    string;
}) {
  const [
    items,
    setItems,
  ] =
    useState<
      Record<
        string,
        any
      >[]
    >([]);

  const [
    loading,
    setLoading,
  ] =
    useState(
      true,
    );

  const [
    editing,
    setEditing,
  ] =
    useState<
      Record<
        string,
        any
      > | null
    >(
      null,
    );

  const [
    isNew,
    setIsNew,
  ] =
    useState(
      false,
    );

  const [
    busy,
    setBusy,
  ] =
    useState(
      false,
    );

  const [
    error,
    setError,
  ] =
    useState(
      "",
    );

  const [
    confirmDelete,
    setConfirmDelete,
  ] =
    useState<
      string | null
    >(
      null,
    );

  const [
    categoryOptions,
    setCategoryOptions,
  ] =
    useState<
      Record<
        string,
        any
      >[]
    >([]);

  const [
    productOptions,
    setProductOptions,
  ] =
    useState<
      Record<
        string,
        any
      >[]
    >([]);

  const schema =
    SCHEMAS[
      entity
    ] ?? [];

  const titleOf =
    TITLES[
      entity
    ] ??
    ((
      item:
        any,
    ) =>
      item.name ??
      item.title ??
      "Item");

  const subOf =
    SUBTITLES[
      entity
    ];

  const previewOf =
    PREVIEW[
      entity
    ];

  /* =======================================================
     LOAD
  ======================================================= */

  const load =
    useCallback(
      async () => {
        setLoading(
          true,
        );

        setError(
          "",
        );

        try {
          const response =
            await fetch(
              `/api/c/${entity}`,
              {
                cache:
                  "no-store",
              },
            );

          const body =
            await response.json();

          if (
            !response.ok
          ) {
            throw new Error(
              body.error ||
                "Failed to load.",
            );
          }

          setItems(
            body.items ??
              [],
          );
        } catch (
          reason
        ) {
          setError(
            reason instanceof
              Error
              ? reason.message
              : "Failed to load.",
          );
        } finally {
          setLoading(
            false,
          );
        }
      },
      [
        entity,
      ],
    );

  useEffect(
    () => {
      load();
    },
    [
      load,
    ],
  );

  /* Categories */

  useEffect(
    () => {
      if (
        entity !==
        "products"
      ) {
        return;
      }

      fetch(
        "/api/c/productCategories",
        {
          cache:
            "no-store",
        },
      )
        .then(
          (
            response,
          ) =>
            response.json(),
        )
        .then(
          (
            body,
          ) =>
            setCategoryOptions(
              body.items ??
                [],
            ),
        )
        .catch(
          () =>
            setCategoryOptions(
              [],
            ),
        );
    },
    [
      entity,
    ],
  );

  /* Products */

  useEffect(
    () => {
      if (
        !schema.some(
          (
            field,
          ) =>
            field.type ===
              "productSelect" ||
            field.type ===
              "recommendedProductList",
        )
      ) {
        return;
      }

      fetch(
        "/api/c/products",
        {
          cache:
            "no-store",
        },
      )
        .then(
          (
            response,
          ) =>
            response.json(),
        )
        .then(
          (
            body,
          ) =>
            setProductOptions(
              body.items ??
                [],
            ),
        )
        .catch(
          () =>
            setProductOptions(
              [],
            ),
        );
    },
    [
      entity,
      schema,
    ],
  );

  /* =======================================================
     SAVE
  ======================================================= */

  async function save() {
    if (
      !editing
    ) {
      return;
    }

    setBusy(
      true,
    );

    setError(
      "",
    );

    try {
      const payload =
        fromForm(
          entity,
          editing,
        );

      const response =
        await fetch(
          isNew
            ? `/api/c/${entity}`
            : `/api/c/${entity}/${editing.id}`,
          {
            method:
              isNew
                ? "POST"
                : "PUT",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify(
                payload,
              ),
          },
        );

      const body =
        await response.json();

      if (
        !response.ok
      ) {
        throw new Error(
          body.error ||
            "Save failed.",
        );
      }

      setEditing(
        null,
      );

      await load();
    } catch (
      reason
    ) {
      setError(
        reason instanceof
          Error
          ? reason.message
          : "Save failed.",
      );
    } finally {
      setBusy(
        false,
      );
    }
  }

  /* =======================================================
     DELETE
  ======================================================= */

  async function remove(
    id:
      string,
  ) {
    const response =
      await fetch(
        `/api/c/${entity}/${id}`,
        {
          method:
            "DELETE",
        },
      );

    if (
      response.ok
    ) {
      setConfirmDelete(
        null,
      );

      await load();
    }
  }

  /* =======================================================
     REORDER
  ======================================================= */

  async function reorder(
    id:
      string,

    direction:
      | -1
      | 1,
  ) {
    const index =
      items.findIndex(
        (
          item,
        ) =>
          item.id ===
          id,
      );

    const swap =
      index +
      direction;

    if (
      index <
        0 ||
      swap <
        0 ||
      swap >=
        items.length
    ) {
      return;
    }

    const next = [
      ...items,
    ];

    [
      next[
        index
      ],
      next[
        swap
      ],
    ] = [
      next[
        swap
      ],
      next[
        index
      ],
    ];

    setItems(
      next,
    );

    await fetch(
      `/api/c/${entity}/reorder`,
      {
        method:
          "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body:
          JSON.stringify({
            ids:
              next.map(
                (
                  item,
                ) =>
                  item.id,
              ),
          }),
      },
    );
  }

  /* =======================================================
     PUBLISH
  ======================================================= */

  async function togglePublish(
    item:
      Record<
        string,
        any
      >,
  ) {
    const response =
      await fetch(
        `/api/c/${entity}/${item.id}`,
        {
          method:
            "PUT",

          headers: {
            "Content-Type":
              "application/json",
          },

          body:
            JSON.stringify({
              published:
                !item.published,
            }),
        },
      );

    if (
      response.ok
    ) {
      await load();
    }
  }

  /* =======================================================
     NEW
  ======================================================= */

  function openNew() {
    const base:
      Record<
        string,
        any
      > = {
        published:
          true,
      };

    for (
      const field
      of schema
    ) {
      if (
        field.type ===
        "bool"
      ) {
        base[
          field.key
        ] =
          false;
      } else if (
        field.type ===
        "number"
      ) {
        base[
          field.key
        ] =
          0;
      } else if (
        field.type ===
        "mediaRef"
      ) {
        base[
          field.key
        ] = {
          type:
            "image",

          src:
            "",

          poster:
            "",
        };
      } else if (
        [
          "kvList",
          "faqList",
          "strList",
          "docList",
          "imageList",
          "linkList",
          "resultList",
          "productSelect",
          "journeyList",
          "capabilityList",
          "recommendedProductList",
          "benefitList",
        ].includes(
          field.type,
        )
      ) {
        base[
          field.key
        ] =
          [];
      } else if (
        field.type ===
        "statPair"
      ) {
        base[
          field.key
        ] = {
          value:
            "",

          label:
            "",
        };
      } else if (
        field.type ===
        "select"
      ) {
        base[
          field.key
        ] =
          field.options?.[
            0
          ] ??
          "";
      } else {
        base[
          field.key
        ] =
          "";
      }
    }

    setIsNew(
      true,
    );

    setEditing(
      base,
    );
  }

  function openEdit(
    item:
      Record<
        string,
        any
      >,
  ) {
    setIsNew(
      false,
    );

    setEditing(
      toForm(
        entity,
        {
          ...item,
        },
      ),
    );
  }

  function setField(
    key:
      string,

    value:
      any,
  ) {
    setEditing(
      (
        current,
      ) =>
        current
          ? {
              ...current,

              [key]:
                value,
            }
          : current,
    );
  }

  return (
    <div>
      {/* HEADER */}

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-semibold text-ink-muted">
          {
            items.length
          }{" "}
          item
          {items.length ===
          1
            ? ""
            : "s"}
        </p>

        <button
          type="button"
          onClick={
            openNew
          }
          className="btn-primary !py-2.5 text-xs"
        >
          <Icon
            name="plus"
            className="h-4 w-4"
          />

          Add new
        </button>
      </div>

      {error && (
        <div className="mb-4 flex items-center justify-between rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}

          <button
            type="button"
            onClick={
              load
            }
            className="underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* LIST */}

      <div className="overflow-hidden rounded-3xl border border-line bg-white shadow-card">
        {loading ? (
          <div className="p-8 text-sm font-semibold text-ink-muted">
            Loading…
          </div>
        ) : items.length ===
          0 ? (
          <div className="p-10 text-center text-sm font-semibold text-ink-muted">
            Nothing here yet.
          </div>
        ) : (
          <ul className="divide-y divide-line/70">
            {items.map(
              (
                item,
                index,
              ) => (
                <li
                  key={
                    item.id
                  }
                  className={`flex items-center gap-3 px-4 py-3.5 sm:px-5 ${
                    item.published
                      ? ""
                      : "opacity-55"
                  }`}
                >
                  <div className="hidden flex-col sm:flex">
                    <button
                      type="button"
                      disabled={
                        index ===
                        0
                      }
                      onClick={() =>
                        reorder(
                          item.id,
                          -1,
                        )
                      }
                    >
                      <Icon
                        name="up"
                        className="h-3.5 w-3.5"
                      />
                    </button>

                    <button
                      type="button"
                      disabled={
                        index ===
                        items.length -
                          1
                      }
                      onClick={() =>
                        reorder(
                          item.id,
                          1,
                        )
                      }
                    >
                      <Icon
                        name="down"
                        className="h-3.5 w-3.5"
                      />
                    </button>
                  </div>

                  {entity ===
                    "products" &&
                    item.image && (
                      <img
                        src={
                          item.image
                        }
                        alt=""
                        className="hidden h-12 w-14 rounded-lg bg-mist-50 object-contain p-1 sm:block"
                      />
                    )}

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-ink">
                      {titleOf(
                        item,
                      )}
                    </p>

                    {subOf && (
                      <p className="truncate text-xs text-ink-muted">
                        {subOf(
                          item,
                        )}
                      </p>
                    )}
                  </div>

                  {entity ===
                    "products" &&
                    item.featured && (
                      <span className="hidden rounded-full bg-brand-50 px-2 py-1 text-[9px] font-bold uppercase text-brand-700 md:inline">
                        Featured
                      </span>
                    )}

                  <button
                    type="button"
                    onClick={() =>
                      togglePublish(
                        item,
                      )
                    }
                    className={`relative h-6 w-11 rounded-full ${
                      item.published
                        ? "bg-brand-600"
                        : "bg-mist-300"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow ${
                        item.published
                          ? "left-[22px]"
                          : "left-0.5"
                      }`}
                    />
                  </button>

                  <div className="flex items-center gap-1">
                    {previewOf && (
                      <a
                        href={previewOf(
                          item,
                        )}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-full p-2 text-ink-faint hover:bg-mist-100"
                      >
                        <Icon
                          name="eye"
                          className="h-4 w-4"
                        />
                      </a>
                    )}

                    <button
                      type="button"
                      onClick={() =>
                        openEdit(
                          item,
                        )
                      }
                      className="rounded-full p-2"
                    >
                      <Icon
                        name="edit"
                        className="h-4 w-4"
                      />
                    </button>

                    {confirmDelete ===
                    item.id ? (
                      <button
                        type="button"
                        onClick={() =>
                          remove(
                            item.id,
                          )
                        }
                        className="rounded-lg bg-red-600 px-3 py-1.5 text-[11px] font-bold text-white"
                      >
                        Confirm
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() =>
                          setConfirmDelete(
                            item.id,
                          )
                        }
                        className="rounded-full p-2 text-red-500"
                      >
                        <Icon
                          name="trash"
                          className="h-4 w-4"
                        />
                      </button>
                    )}
                  </div>
                </li>
              ),
            )}
          </ul>
        )}
      </div>

      {/* DRAWER */}

      <AnimatePresence>
        {editing && (
          <motion.div
            initial={{
              opacity:
                0,
            }}
            animate={{
              opacity:
                1,
            }}
            exit={{
              opacity:
                0,
            }}
            className="fixed inset-0 z-[120] bg-ink/45 backdrop-blur-sm"
            onClick={() =>
              setEditing(
                null,
              )
            }
          >
            <motion.div
              initial={{
                x:
                  "100%",
              }}
              animate={{
                x:
                  0,
              }}
              exit={{
                x:
                  "100%",
              }}
              transition={{
                type:
                  "tween",

                duration:
                  0.28,
              }}
              className="absolute right-0 top-0 flex h-full w-full max-w-2xl flex-col bg-white shadow-2xl"
              onClick={(
                event,
              ) =>
                event.stopPropagation()
              }
            >
              <div className="flex items-center justify-between border-b border-line px-6 py-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[.18em] text-ink-faint">
                    {isNew
                      ? "Create"
                      : "Edit"}
                  </p>

                  <h2 className="font-display text-lg font-extrabold text-ink">
                    {isNew
                      ? entity ===
                        "products"
                        ? "Add Product"
                        : "New Item"
                      : titleOf(
                          editing,
                        )}
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setEditing(
                      null,
                    )
                  }
                  className="rounded-full p-2 hover:bg-mist-100"
                >
                  <Icon
                    name="x"
                    className="h-5 w-5"
                  />
                </button>
              </div>

              <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
                {schema.map(
                  (
                    field,
                  ) => (
                    <div
                      key={
                        field.key
                      }
                    >
                      <label className="block">
                        <span className="field-label">
                          {
                            field.label
                          }
                        </span>

                        {field.type ===
                          "text" && (
                          <input
                            value={
                              editing[
                                field
                                  .key
                              ] ??
                              ""
                            }
                            onChange={(
                              event,
                            ) =>
                              setField(
                                field.key,
                                event.target
                                  .value,
                              )
                            }
                            className="field"
                          />
                        )}

                        {field.type ===
                          "textarea" && (
                          <textarea
                            rows={
                              field.key ===
                                "description" ||
                              field.key ===
                                "summary"
                                ? 6
                                : 3
                            }
                            value={
                              editing[
                                field
                                  .key
                              ] ??
                              ""
                            }
                            onChange={(
                              event,
                            ) =>
                              setField(
                                field.key,
                                event.target
                                  .value,
                              )
                            }
                            className="field resize-y"
                          />
                        )}

                        {field.type ===
                          "number" && (
                          <input
                            type="number"
                            step="any"
                            value={
                              editing[
                                field
                                  .key
                              ] ??
                              0
                            }
                            onChange={(
                              event,
                            ) =>
                              setField(
                                field.key,
                                Number(
                                  event.target
                                    .value,
                                ),
                              )
                            }
                            className="field"
                          />
                        )}

                        {field.type ===
                          "select" && (
                          <select
                            value={
                              editing[
                                field
                                  .key
                              ] ??
                              ""
                            }
                            onChange={(
                              event,
                            ) =>
                              setField(
                                field.key,
                                event.target
                                  .value,
                              )
                            }
                            className="field"
                          >
                            {field.options?.map(
                              (
                                option,
                              ) => (
                                <option
                                  key={
                                    option
                                  }
                                  value={
                                    option
                                  }
                                >
                                  {
                                    option
                                  }
                                </option>
                              ),
                            )}
                          </select>
                        )}

                        {field.type ===
                          "categorySelect" && (
                          <select
                            value={
                              editing[
                                field
                                  .key
                              ] ??
                              ""
                            }
                            onChange={(
                              event,
                            ) =>
                              setField(
                                field.key,
                                event.target
                                  .value,
                              )
                            }
                            className="field"
                          >
                            <option value="">
                              Select category
                            </option>

                            {categoryOptions.map(
                              (
                                category,
                              ) => (
                                <option
                                  key={
                                    category.id
                                  }
                                  value={
                                    category.name
                                  }
                                >
                                  {
                                    category.name
                                  }
                                </option>
                              ),
                            )}
                          </select>
                        )}

                        {field.type ===
                          "productSelect" && (
                          <div className="grid gap-2 rounded-xl border border-line p-3 sm:grid-cols-2">
                            {productOptions
                              .filter(
                                (
                                  product,
                                ) =>
                                  entity !==
                                    "products" ||
                                  product.id !==
                                    editing.id,
                              )
                              .map(
                                (
                                  product,
                                ) => {
                                  const selected =
                                    (
                                      editing[
                                        field
                                          .key
                                      ] ??
                                      []
                                    ).includes(
                                      product.slug,
                                    );

                                  return (
                                    <label
                                      key={
                                        product.id
                                      }
                                      className="flex items-center gap-2 rounded-lg p-2 text-xs font-semibold"
                                    >
                                      <input
                                        type="checkbox"
                                        checked={
                                          selected
                                        }
                                        onChange={() =>
                                          setField(
                                            field.key,
                                            selected
                                              ? (
                                                  editing[
                                                    field
                                                      .key
                                                  ] ??
                                                  []
                                                ).filter(
                                                  (
                                                    slug: string,
                                                  ) =>
                                                    slug !==
                                                    product.slug,
                                                )
                                              : [
                                                  ...(
                                                    editing[
                                                      field
                                                        .key
                                                    ] ??
                                                    []
                                                  ),
                                                  product.slug,
                                                ],
                                          )
                                        }
                                      />

                                      {
                                        product.name
                                      }
                                    </label>
                                  );
                                },
                              )}
                          </div>
                        )}

                        {field.type ===
                          "bool" && (
                          <button
                            type="button"
                            onClick={() =>
                              setField(
                                field.key,
                                !editing[
                                  field
                                    .key
                                ],
                              )
                            }
                            className={`relative h-7 w-12 rounded-full ${
                              editing[
                                field
                                  .key
                              ]
                                ? "bg-brand-600"
                                : "bg-mist-300"
                            }`}
                          >
                            <span
                              className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow ${
                                editing[
                                  field
                                    .key
                                ]
                                  ? "left-[22px]"
                                  : "left-0.5"
                              }`}
                            />
                          </button>
                        )}

                        {field.type ===
                          "image" && (
                          <div className="space-y-3">
                            {editing[
                              field
                                .key
                            ] && (
                              <img
                                src={
                                  editing[
                                    field
                                      .key
                                  ]
                                }
                                alt=""
                                className="h-32 rounded-xl border border-line bg-mist-50 object-contain p-2"
                              />
                            )}

                            <input
                              type="url"
                              value={
                                editing[
                                  field
                                    .key
                                ] ??
                                ""
                              }
                              onChange={(
                                event,
                              ) =>
                                setField(
                                  field.key,
                                  event.target
                                    .value,
                                )
                              }
                              placeholder="Image URL"
                              className="field font-mono text-xs"
                            />

                            <UploadButton
                              value={
                                editing[
                                  field
                                    .key
                                ]
                              }
                              accept="image/jpeg,image/png,image/webp,image/gif"
                              onDone={(
                                url,
                              ) =>
                                setField(
                                  field.key,
                                  url,
                                )
                              }
                            />
                          </div>
                        )}

                        {field.type ===
                          "imageList" && (
                          <ImageListEditor
                            value={
                              editing[
                                field
                                  .key
                              ]
                            }
                            onChange={(
                              value,
                            ) =>
                              setField(
                                field.key,
                                value,
                              )
                            }
                          />
                        )}

                        {field.type ===
                          "mediaRef" && (
                          <MediaRefEditor
                            value={
                              editing[
                                field
                                  .key
                              ]
                            }
                            onChange={(
                              value,
                            ) =>
                              setField(
                                field.key,
                                value,
                              )
                            }
                          />
                        )}

                        {field.type ===
                          "kvList" && (
                          <KvListEditor
                            value={
                              editing[
                                field
                                  .key
                              ]
                            }
                            onChange={(
                              value,
                            ) =>
                              setField(
                                field.key,
                                value,
                              )
                            }
                          />
                        )}

                        {field.type ===
                          "faqList" && (
                          <FaqListEditor
                            value={
                              editing[
                                field
                                  .key
                              ]
                            }
                            onChange={(
                              value,
                            ) =>
                              setField(
                                field.key,
                                value,
                              )
                            }
                          />
                        )}

                        {field.type ===
                          "strList" && (
                          <StrListEditor
                            value={
                              editing[
                                field
                                  .key
                              ]
                            }
                            onChange={(
                              value,
                            ) =>
                              setField(
                                field.key,
                                value,
                              )
                            }
                          />
                        )}

                        {field.type ===
                          "docList" && (
                          <DocListEditor
                            value={
                              editing[
                                field
                                  .key
                              ]
                            }
                            onChange={(
                              value,
                            ) =>
                              setField(
                                field.key,
                                value,
                              )
                            }
                          />
                        )}

                        {field.type ===
                          "docRef" && (
                          <DocRefEditor
                            value={
                              editing[
                                field
                                  .key
                              ]
                            }
                            onChange={(
                              value,
                            ) =>
                              setField(
                                field.key,
                                value,
                              )
                            }
                          />
                        )}

                        {field.type ===
                          "linkList" && (
                          <LinkListEditor
                            value={
                              editing[
                                field
                                  .key
                              ]
                            }
                            onChange={(
                              value,
                            ) =>
                              setField(
                                field.key,
                                value,
                              )
                            }
                          />
                        )}

                        {field.type ===
                          "resultList" && (
                          <ResultListEditor
                            value={
                              editing[
                                field
                                  .key
                              ]
                            }
                            onChange={(
                              value,
                            ) =>
                              setField(
                                field.key,
                                value,
                              )
                            }
                          />
                        )}

                        {[
                          "journeyList",
                          "capabilityList",
                          "recommendedProductList",
                          "benefitList",
                        ].includes(
                          field.type,
                        ) && (
                          <JsonListEditor
                            value={
                              editing[
                                field
                                  .key
                              ]
                            }
                            onChange={(
                              value,
                            ) =>
                              setField(
                                field.key,
                                value,
                              )
                            }
                          />
                        )}

                        {field.type ===
                          "statPair" && (
                          <StatPairEditor
                            value={
                              editing[
                                field
                                  .key
                              ]
                            }
                            onChange={(
                              value,
                            ) =>
                              setField(
                                field.key,
                                value,
                              )
                            }
                          />
                        )}

                        {field.hint && (
                          <p className="mt-1.5 text-[11px] leading-5 text-ink-faint">
                            {
                              field.hint
                            }
                          </p>
                        )}
                      </label>
                    </div>
                  ),
                )}

                {/* PRODUCT PREVIEW */}

                {entity ===
                  "products" && (
                  <div className="overflow-hidden rounded-2xl border border-line bg-mist-50">
                    <div className="border-b border-line px-4 py-3">
                      <p className="text-sm font-bold text-ink">
                        Product Preview
                      </p>
                    </div>

                    <div className="grid gap-4 p-4 sm:grid-cols-[130px_1fr]">
                      {editing.image ? (
                        <img
                          src={
                            editing.image
                          }
                          alt=""
                          className="h-32 w-full rounded-xl bg-white object-contain p-3"
                        />
                      ) : (
                        <div className="flex h-32 items-center justify-center rounded-xl bg-white">
                          <Icon
                            name="box"
                          />
                        </div>
                      )}

                      <div>
                        {editing.brand && (
                          <p className="text-[10px] font-black uppercase tracking-[.15em] text-brand-600">
                            {
                              editing.brand
                            }
                          </p>
                        )}

                        <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-ink-faint">
                          {editing.category ||
                            "Category"}
                        </p>

                        <h3 className="mt-1 text-xl font-black text-ink">
                          {editing.name ||
                            "Product Name"}
                        </h3>

                        {editing.sku && (
                          <p className="mt-1 text-xs text-ink-muted">
                            Model:{" "}
                            {
                              editing.sku
                            }
                          </p>
                        )}

                        <p className="mt-3 text-base font-black text-ink">
                          {editing.price ||
                            "Price"}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* PUBLISHED */}

                <div className="flex items-center justify-between rounded-2xl border border-line p-4">
                  <div>
                    <p className="text-sm font-bold">
                      Published
                    </p>

                    <p className="text-xs text-ink-muted">
                      Show this item
                      publicly.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setField(
                        "published",
                        !editing.published,
                      )
                    }
                    className={`relative h-7 w-12 rounded-full ${
                      editing.published
                        ? "bg-brand-600"
                        : "bg-mist-300"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow ${
                        editing.published
                          ? "left-[22px]"
                          : "left-0.5"
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* SAVE */}

              <div className="flex justify-end gap-2 border-t border-line bg-white px-6 py-4">
                <button
                  type="button"
                  onClick={() =>
                    setEditing(
                      null,
                    )
                  }
                  className="btn-ghost !py-2.5 text-xs"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  disabled={
                    busy
                  }
                  onClick={
                    save
                  }
                  className="btn-primary !py-2.5 text-xs disabled:opacity-60"
                >
                  {busy
                    ? "Saving…"
                    : isNew
                      ? "Create Item"
                      : "Save Changes"}

                  <Icon
                    name="check"
                    className="h-4 w-4"
                  />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}