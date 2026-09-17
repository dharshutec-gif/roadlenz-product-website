import type { NextRequest } from "next/server";

import { NextResponse } from "next/server";

import {
  readDb,
  mutateDb,
} from "./db";

import {
  sessionFromRequest,
} from "./auth";

import type {
  Db,
  EntityKey,
} from "./types";

/* =========================================================
   RESPONSE HELPERS
========================================================= */

export function jsonOk(
  data: unknown,
  init?: ResponseInit,
) {
  return NextResponse.json(
    data,
    init,
  );
}

export function jsonErr(
  status: number,
  error: string,
) {
  return NextResponse.json(
    {
      error,
    },
    {
      status,
    },
  );
}

/* =========================================================
   AUTH
========================================================= */

export type AuthResult =
  | {
      ok: true;

      session: NonNullable<
        ReturnType<
          typeof sessionFromRequest
        >
      >;
    }
  | {
      ok: false;

      res: NextResponse;
    };

export function requireAuth(
  req: NextRequest,
): AuthResult {
  const session =
    sessionFromRequest(
      req,
    );

  if (!session) {
    return {
      ok: false,

      res: jsonErr(
        401,
        "Unauthorized. Please sign in again.",
      ),
    };
  }

  return {
    ok: true,
    session,
  };
}

export function requireRole(
  req: NextRequest,
  role:
    | "admin"
    | "customer",
): AuthResult {
  const auth =
    requireAuth(
      req,
    );

  if (!auth.ok) {
    return auth;
  }

  if (
    auth.session.role !==
    role
  ) {
    return {
      ok: false,

      res: jsonErr(
        403,
        "You do not have permission for this action.",
      ),
    };
  }

  return {
    ok: true,

    session:
      auth.session,
  };
}

/* =========================================================
   SAFE JSON FIELD PICKER
========================================================= */

export function pickJson(
  data: Record<
    string,
    unknown
  >,
  keys: string[],
): Record<
  string,
  unknown
> {
  const out: Record<
    string,
    unknown
  > = {};

  for (
    const key
    of keys
  ) {
    if (
      key in data
    ) {
      out[key] =
        data[key];
    }
  }

  return out;
}

/* =========================================================
   ADMIN WRITABLE FIELDS

   IMPORTANT:
   brand + faqs are saved into the SAME existing
   products collection used by Admin and public pages.
========================================================= */

export const ENTITY_FIELDS:
  Record<
    EntityKey,
    string[]
  > = {
    heroSlides: [
      "title",
      "subtitle",
      "primaryCta",
      "primaryHref",
      "secondaryCta",
      "secondaryHref",
      "media",
      "overlay",
      "duration",
      "published",
      "order",
    ],

    stats: [
      "label",
      "value",
      "counter",
      "suffix",
      "icon",
      "published",
      "order",
    ],

    products: [
      "slug",
      "name",

      /*
       * Product brand is optional.
       * Never automatically add RoadLenz.
       */
      "brand",

      "sku",
      "category",
      "tagline",
      "description",

      "image",
      "gallery",
      "video",

      "badges",
      "specs",
      "features",
      "compatibility",
      "inBox",

      /*
       * Stored as:
       * [
       *   { label: "Question", value: "Answer" }
       * ]
       */
      "faqs",

      "documents",
      "installationGuide",
      "warranty",

      "relatedProductSlugs",

      "price",
      "priceNote",

      "stockQuantity",
      "stockStatus",
      "lowStockThreshold",
      "trackInventory",

      "featured",

      "published",
      "order",
    ],

    productCategories: [
      "name",
      "slug",
      "description",
      "published",
      "order",
    ],

    industries: [
      "slug",
      "name",
      "shortName",
      "tagline",
      "summary",
      "image",
      "vehicleImage",
      "challenges",
      "outcomes",
      "capabilities",
      "relatedProductSlugs",
      "stat",
      "published",
      "order",
    ],

    caseStudies: [
      "client",
      "title",
      "location",
      "image",
      "video",
      "challenge",
      "solution",
      "technology",
      "results",
      "approved",
      "published",
      "order",
    ],

    customerLogos: [
      "name",
      "image",
      "approved",
      "published",
      "order",
    ],

    resources: [
      "type",
      "title",
      "description",
      "image",
      "media",
      "file",
      "meta",
      "published",
      "order",
    ],

    locations: [
      "name",
      "city",
      "region",
      "country",
      "international",
      "type",
      "lat",
      "lng",
      "address",
      "phone",
      "email",
      "timings",
      "mapsLink",
      "image",
      "verified",
      "published",
      "order",
    ],

    whyPoints: [
      "title",
      "text",
      "icon",
      "published",
      "order",
    ],

    ecosystemNodes: [
      "label",
      "text",
      "icon",
      "published",
      "order",
    ],

    engineeringItems: [
      "title",
      "text",
      "image",
      "icon",
      "published",
      "order",
    ],

    solutionFinder: [
      "option",
      "icon",
      "headline",
      "body",
      "recommendation",
      "links",
      "published",
      "order",
    ],

    solutions: [
      "name",
      "slug",
      "industry",

      "heroTitle",
      "heroSummary",
      "heroMedia",
      "heroCtaLabel",
      "heroCtaHref",

      "trustLine",

      "mapMedia",
      "vehicleImage",
      "abstractPreviewImage",

      "relatedProductSlugs",

      "keyOutcomes",
      "productCallouts",
      "platformOutcomes",
      "bestFor",

      "journeyStages",

      "capabilityTitle",
      "capabilities",

      "technologyTitle",
      "technologyDescription",

      "blueprintMedia",
      "deviceConsoleMedia",

      "recommendedProducts",
      "benefits",

      "outcomeTitle",
      "outcomeSummary",
      "outcomeMedia",

      "ctaTitle",
      "ctaSummary",
      "ctaMedia",

      "ctaPrimaryLabel",
      "ctaPrimaryHref",

      "ctaSecondaryLabel",
      "ctaSecondaryHref",

      "sequenceNumber",
      "featured",

      "published",
      "order",
    ],

    quotes: [
      "name",
      "company",
      "email",
      "phone",
      "fleetSize",
      "vehicleTypes",
      "products",
      "message",
      "status",
      "published",
      "order",
    ],

    demos: [
      "name",
      "company",
      "email",
      "phone",
      "date",
      "duration",
      "topics",
      "message",
      "status",
      "published",
      "order",
    ],

    messages: [
      "name",
      "email",
      "phone",
      "subject",
      "message",
      "status",
      "published",
      "order",
    ],
  };

/* =========================================================
   ENTITY VALIDATION
========================================================= */

export function isEntityKey(
  key: string,
): key is EntityKey {
  return [
    "heroSlides",
    "stats",
    "products",
    "productCategories",
    "industries",
    "caseStudies",
    "customerLogos",
    "resources",
    "locations",
    "whyPoints",
    "ecosystemNodes",
    "engineeringItems",
    "solutionFinder",
    "solutions",
    "quotes",
    "demos",
    "messages",
  ].includes(
    key,
  );
}

/* =========================================================
   SANITIZE ADMIN DATA
========================================================= */

export function sanitizedEntityData(
  key: EntityKey,
  data: Record<
    string,
    unknown
  >,
) {
  const allowed =
    ENTITY_FIELDS[
      key
    ];

  const out: Record<
    string,
    unknown
  > = {};

  for (
    const field
    of allowed
  ) {
    if (
      field in data
    ) {
      out[field] =
        data[field];
    }
  }

  return out;
}

/* =========================================================
   DATABASE
========================================================= */

export function getDb(): Db {
  return readDb();
}

export function mutate(
  fn: (
    db: Db,
  ) => unknown,
): void {
  mutateDb(
    fn,
  );
}