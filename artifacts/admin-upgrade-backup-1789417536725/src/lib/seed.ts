import type {
  Db,
  Product,
  ProductCategory,
  Solution,
} from "./types";

/*
 * =========================================================
 * ROADLENZ DATABASE SEED
 * =========================================================
 *
 * IMPORTANT:
 *
 * This file DOES NOT contain:
 * - sample products
 * - sample prices
 * - sample customers
 * - sample orders
 * - sample quotations
 * - sample invoices
 * - sample inventory
 * - demo customer accounts
 * - demo admin accounts
 *
 * Existing data must come from:
 *
 * data/db.json
 *
 * Admin-created records are stored through the existing
 * RoadLenz API/database layer.
 *
 * This seed is used only when db.json does not exist.
 * =========================================================
 */

const now = () => new Date().toISOString();

/* =========================================================
   PRODUCTS
========================================================= */

export function getProductCatalog(): {
  productCategories: ProductCategory[];
  products: Product[];
} {
  return {
    productCategories: [],
    products: [],
  };
}

/* =========================================================
   SOLUTIONS
========================================================= */

export function getSolutions(): Solution[] {
  return [];
}

/* =========================================================
   EMPTY DATABASE
========================================================= */

export function buildSeedDb(): Db {
  const timestamp = now();

  return {
    version: 14,

    updatedAt: timestamp,

    /* =====================================================
       COMPANY SETTINGS

       These are only initial application settings.

       They are subsequently editable/read through db.json.
    ===================================================== */

    settings: {
      name: "RoadLenz",

      legalName: "RoadLenz",

      tagline: "Drive Smart. Record Every Mile.",

      parentCompany:
        "Bigfox Engineering Private Limited",

      description: "",

      contact: {
        phone: "",
        email: "",
        address: "",
        hours: "",
      },

      social: [],

      seo: {
        title: "RoadLenz",

        description:
          "RoadLenz fleet intelligence and vehicle safety solutions.",

        ogImage: "",
      },

      solutionsHero: {
        video: "",
        poster: "",
      },

      footerNote: "",
    },

    /* =====================================================
       WEBSITE CONTENT
    ===================================================== */

    heroSlides: [],

    stats: [],

    /* =====================================================
       PRODUCT CATALOGUE
    ===================================================== */

    products: [],

    productCategories: [],

    /* =====================================================
       INDUSTRIES / SOLUTIONS
    ===================================================== */

    industries: [],

    solutions: [],

    /* =====================================================
       CASE STUDIES
    ===================================================== */

    caseStudies: [],

    /* =====================================================
       CUSTOMERS / LOGOS
    ===================================================== */

    customerLogos: [],

    /* =====================================================
       RESOURCES
    ===================================================== */

    resources: [],

    /* =====================================================
       LOCATIONS
    ===================================================== */

    locations: [],

    /* =====================================================
       HOME PAGE CONTENT
    ===================================================== */

    whyPoints: [],

    ecosystemNodes: [],

    engineeringItems: [],

    solutionFinder: [],

    /* =====================================================
       WEBSITE REQUESTS
    ===================================================== */

    quotes: [],

    demos: [],

    messages: [],

    /* =====================================================
       AUTHENTICATION

       No hardcoded users.
       Existing users remain inside data/db.json.
    ===================================================== */

    users: [],

    sessions: [],

    /* =====================================================
       CUSTOMER PORTAL

       Key = authenticated user ID.
    ===================================================== */

    customers: {},

    /* =====================================================
       ORDERS
    ===================================================== */

    orders: [],

    /* =====================================================
       INVOICES
    ===================================================== */

    invoices: [],
  };
}