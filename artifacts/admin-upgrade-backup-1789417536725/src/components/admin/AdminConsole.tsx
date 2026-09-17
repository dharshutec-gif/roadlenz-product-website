"use client";

import React, {
  useState,
} from "react";

import Link from "next/link";

import {
  useRouter,
} from "next/navigation";

import {
  motion,
  useReducedMotion,
} from "framer-motion";

import {
  Icon,
  Logo,
} from "../ui";

import EntityManager from "./EntityManager";
import SettingsForm from "./SettingsForm";
import RequestsView from "./RequestsView";
import Overview from "./Overview";
import OrdersManager from "./OrdersManager";
import CustomersManager from "./CustomersManager";

type Section =
  | "overview"
  | "orders"
  | "customers"
  | "requests"
  | "products"
  | "productCategories"
  | "resources"
  | "solutions"
  | "industries"
  | "heroSlides"
  | "stats"
  | "whyPoints"
  | "ecosystemNodes"
  | "solutionFinder"
  | "engineeringItems"
  | "caseStudies"
  | "customerLogos"
  | "locations"
  | "settings";

type NavItem = {
  id:
    Section;

  label:
    string;

  icon:
    string;
};

const NAV: {
  group:
    string;

  items:
    NavItem[];
}[] = [
  {
    group:
      "Workspace",

    items: [
      {
        id:
          "overview",

        label:
          "Dashboard",

        icon:
          "gauge",
      },
    ],
  },

  {
    group:
      "Commerce",

    items: [
      {
        id:
          "orders",

        label:
          "Orders",

        icon:
          "box",
      },

      {
        id:
          "customers",

        label:
          "Customers",

        icon:
          "users",
      },

      {
        id:
          "requests",

        label:
          "Quotations / Requests",

        icon:
          "mail",
      },
    ],
  },

  {
    group:
      "Catalogue",

    items: [
      {
        id:
          "products",

        label:
          "Products",

        icon:
          "box",
      },

      {
        id:
          "productCategories",

        label:
          "Product Categories",

        icon:
          "layers",
      },

      {
        id:
          "resources",

        label:
          "Brochures / Resources",

        icon:
          "doc",
      },

      {
        id:
          "solutions",

        label:
          "Solutions",

        icon:
          "route",
      },

      {
        id:
          "industries",

        label:
          "Industries",

        icon:
          "fleet",
      },
    ],
  },

  {
    group:
      "Website Content",

    items: [
      {
        id:
          "heroSlides",

        label:
          "Hero Slides",

        icon:
          "video",
      },

      {
        id:
          "stats",

        label:
          "Statistics",

        icon:
          "chart",
      },

      {
        id:
          "whyPoints",

        label:
          "Why RoadLenz",

        icon:
          "chip",
      },

      {
        id:
          "ecosystemNodes",

        label:
          "Ecosystem",

        icon:
          "layers",
      },

      {
        id:
          "solutionFinder",

        label:
          "Solution Finder",

        icon:
          "compass",
      },

      {
        id:
          "engineeringItems",

        label:
          "Engineering",

        icon:
          "wrench",
      },

      {
        id:
          "caseStudies",

        label:
          "Case Studies",

        icon:
          "doc",
      },

      {
        id:
          "customerLogos",

        label:
          "Customer Logos",

        icon:
          "building",
      },

      {
        id:
          "locations",

        label:
          "Locations",

        icon:
          "pin",
      },
    ],
  },

  {
    group:
      "Administration",

    items: [
      {
        id:
          "settings",

        label:
          "Settings & SEO",

        icon:
          "settings",
      },
    ],
  },
];

const CMS_SECTIONS: Section[] =
  [
    "products",
    "productCategories",
    "resources",
    "solutions",
    "industries",
    "heroSlides",
    "stats",
    "whyPoints",
    "ecosystemNodes",
    "solutionFinder",
    "engineeringItems",
    "caseStudies",
    "customerLogos",
    "locations",
  ];

export default function AdminConsole({
  session,
}: {
  session: {
    name:
      string;

    email:
      string;
  };
}) {
  const [
    section,
    setSection,
  ] =
    useState<Section>(
      "overview",
    );

  const [
    navOpen,
    setNavOpen,
  ] =
    useState(false);

  const router =
    useRouter();

  const reduce =
    useReducedMotion();

  const label =
    NAV.flatMap(
      (
        group,
      ) =>
        group.items,
    ).find(
      (
        item,
      ) =>
        item.id ===
        section,
    )?.label ??
    "Admin";

  const go = (
    target:
      Section,
  ) => {
    setSection(
      target,
    );

    setNavOpen(
      false,
    );
  };

  const logout =
    async () => {
      await fetch(
        "/api/auth/logout",
        {
          method:
            "POST",
        },
      );

      router.push(
        "/",
      );

      router.refresh();
    };

  return (
    <div className="min-h-screen bg-[#f4f7fb] pt-[72px] text-slate-900">
      {/* MOBILE BACKDROP */}

      {navOpen && (
        <button
          type="button"
          aria-label="Close admin navigation"
          onClick={() =>
            setNavOpen(
              false,
            )
          }
          className="fixed inset-0 z-40 bg-slate-950/45 lg:hidden"
        />
      )}

      {/* ================================================
          SIDEBAR
      ================================================= */}

      <aside
        className={`
          fixed
          bottom-0
          left-0
          top-[72px]
          z-50
          w-[270px]
          border-r
          border-white/10
          bg-[#07182e]
          text-white
          transition-transform
          duration-300
          ${
            navOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
          lg:translate-x-0
        `}
      >
        <div className="flex h-full flex-col">
          <div className="border-b border-white/10 px-5 py-5">
            <Logo
              dark
            />

            <p
              className="
                mt-3
                text-[10px]
                font-bold
                uppercase
                tracking-[.22em]
                text-cyan-300
              "
            >
              Administration Portal
            </p>
          </div>

          <nav className="flex-1 overflow-y-auto px-3 py-4">
            {NAV.map(
              (
                group,
              ) => (
                <div
                  key={
                    group.group
                  }
                  className="mb-5"
                >
                  <p
                    className="
                      px-3
                      pb-2
                      text-[10px]
                      font-bold
                      uppercase
                      tracking-[.18em]
                      text-slate-500
                    "
                  >
                    {
                      group.group
                    }
                  </p>

                  <div className="space-y-1">
                    {group.items.map(
                      (
                        item,
                      ) => (
                        <button
                          key={
                            item.id
                          }
                          type="button"
                          onClick={() =>
                            go(
                              item.id,
                            )
                          }
                          className={`
                            flex
                            w-full
                            items-center
                            gap-3
                            rounded-xl
                            px-3
                            py-2.5
                            text-left
                            text-[13px]
                            font-semibold
                            transition
                            ${
                              section ===
                              item.id
                                ? "bg-blue-600 text-white shadow-lg shadow-blue-950/30"
                                : "text-slate-300 hover:bg-white/7 hover:text-white"
                            }
                          `}
                        >
                          <Icon
                            name={
                              item.icon
                            }
                            className="h-4 w-4"
                          />

                          <span className="flex-1">
                            {
                              item.label
                            }
                          </span>

                          {section ===
                            item.id && (
                            <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />
                          )}
                        </button>
                      ),
                    )}
                  </div>
                </div>
              ),
            )}
          </nav>

          <div className="border-t border-white/10 p-3">
            <Link
              href="/"
              target="_blank"
              className="
                flex
                items-center
                gap-3
                rounded-xl
                px-3
                py-2.5
                text-sm
                font-semibold
                text-slate-300
                hover:bg-white/7
                hover:text-white
              "
            >
              <Icon
                name="external"
                className="h-4 w-4"
              />

              Open website
            </Link>

            <button
              type="button"
              onClick={
                logout
              }
              className="
                mt-1
                flex
                w-full
                items-center
                gap-3
                rounded-xl
                px-3
                py-2.5
                text-left
                text-sm
                font-semibold
                text-slate-300
                hover:bg-red-500/10
                hover:text-red-200
              "
            >
              <Icon
                name="logout"
                className="h-4 w-4"
              />

              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* ================================================
          MAIN WORKSPACE
      ================================================= */}

      <div className="lg:ml-[270px]">
        <header
          className="
            sticky
            top-[72px]
            z-30
            border-b
            border-slate-200
            bg-white/95
            backdrop-blur
          "
        >
          <div
            className="
              flex
              h-[68px]
              items-center
              justify-between
              gap-4
              px-4
              sm:px-6
              xl:px-8
            "
          >
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                onClick={() =>
                  setNavOpen(
                    true,
                  )
                }
                className="rounded-xl border border-slate-200 p-2 lg:hidden"
                aria-label="Open admin navigation"
              >
                <Icon
                  name="menu"
                  className="h-5 w-5"
                />
              </button>

              <div className="min-w-0">
                <p
                  className="
                    truncate
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-[.18em]
                    text-slate-400
                  "
                >
                  RoadLenz /{" "}
                  {label}
                </p>

                <h1
                  className="
                    truncate
                    text-lg
                    font-black
                    tracking-tight
                    text-slate-950
                  "
                >
                  {label}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/"
                target="_blank"
                className="
                  hidden
                  rounded-xl
                  border
                  border-slate-200
                  px-3
                  py-2
                  text-xs
                  font-bold
                  text-slate-600
                  hover:bg-slate-50
                  sm:inline-flex
                "
              >
                Preview site
              </Link>

              <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2">
                <span
                  className="
                    flex
                    h-8
                    w-8
                    items-center
                    justify-center
                    rounded-full
                    bg-[#07182e]
                    text-xs
                    font-black
                    text-white
                  "
                >
                  {session.name
                    .slice(
                      0,
                      1,
                    )
                    .toUpperCase()}
                </span>

                <div className="hidden md:block">
                  <p className="max-w-[160px] truncate text-xs font-bold text-slate-800">
                    {
                      session.name
                    }
                  </p>

                  <p className="max-w-[160px] truncate text-[10px] text-slate-400">
                    {
                      session.email
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <motion.main
          key={
            section
          }
          initial={
            reduce
              ? false
              : {
                  opacity:
                    0,

                  y:
                    8,
                }
          }
          animate={{
            opacity:
              1,

            y:
              0,
          }}
          transition={{
            duration:
              0.22,
          }}
          className="
            mx-auto
            max-w-[1560px]
            p-4
            sm:p-6
            xl:p-8
          "
        >
          {section ===
            "overview" && (
            <Overview
              onGoAction={
                go
              }
            />
          )}

          {section ===
            "orders" && (
            <OrdersManager />
          )}

          {section ===
            "customers" && (
            <CustomersManager />
          )}

          {section ===
            "requests" && (
            <RequestsView />
          )}

          {section ===
            "settings" && (
            <SettingsForm />
          )}

          {CMS_SECTIONS.includes(
            section,
          ) && (
            <EntityManager
              entity={
                section
              }
              key={
                section
              }
            />
          )}
        </motion.main>
      </div>
    </div>
  );
}