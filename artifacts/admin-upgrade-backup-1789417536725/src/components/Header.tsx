"use client";

import { CalendarDays, MessageCircle } from "lucide-react";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

/* =========================================================
   NAVIGATION
========================================================= */

const NAVIGATION = [
  {
    label: "HOME",
    href: "/",
  },
  {
    label: "PRODUCTS",
    href: "/products",
  },
  {
    label: "SOLUTIONS",
    href: "/solutions",
  },
  {
    label: "TECHNOLOGY",
    href: "/technology",
  },
  {
    label: "INDUSTRIES",
    href: "/industries",
  },
  {
    label: "ABOUT US",
    href: "/about-us",
  },
  {
    label: "CONTACT US",
    href: "/contact",
  },
];

/* =========================================================
   ICONS
========================================================= */

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-[19px] w-[19px]"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-[18px] w-[18px]"
      aria-hidden="true"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4.5 21a7.5 7.5 0 0 1 15 0" />
    </svg>
  );
}



function CloseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      className="h-6 w-6"
      aria-hidden="true"
    >
      <path d="M6 6 18 18" />
      <path d="M18 6 6 18" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      className="h-6 w-6"
      aria-hidden="true"
    >
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h16" />
    </svg>
  );
}

/* =========================================================
   HEADER
========================================================= */

export default function Header() {
  const pathname = usePathname();

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  /* =======================================================
     SCROLL
  ======================================================= */

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 18);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  /* =======================================================
     CLOSE MENU ON ROUTE CHANGE
  ======================================================= */

  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  /* =======================================================
     BODY SCROLL
  ======================================================= */

  useEffect(() => {
    if (mobileOpen || searchOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen, searchOpen]);

  /* =======================================================
     ACTIVE LINK
  ======================================================= */

  function isActive(href: string) {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname.startsWith(href);
  }

  if (pathname === "/book-demo") return null;

  return (
    <>
      {/* ===================================================
          HEADER
      =================================================== */}

      <header
        className={`
          fixed
          inset-x-0
          top-0
          z-[9999]
          w-full
          border-b
          transition-all
          duration-300

          ${
            scrolled
              ? `
                border-slate-200
                bg-white/[0.98]
                shadow-[0_10px_35px_rgba(15,23,42,0.12)]
                backdrop-blur-xl
              `
              : `
                border-slate-200/70
                bg-white/[0.96]
                shadow-[0_5px_22px_rgba(15,23,42,0.08)]
                backdrop-blur-xl
              `
          }
        `}
      >
        {/* =================================================
            HEADER CONTAINER
        ================================================= */}

        <div
          className="
            relative
            mx-auto
            flex
            h-[94px]
            w-full
            max-w-[1600px]
            items-center
            justify-between
            gap-4
            px-5
            sm:px-7
            lg:px-8
            xl:px-8
            2xl:px-10
          "
        >
          {/* =================================================
              LOGO
          ================================================= */}

          <Link
            href="/"
            aria-label="RoadLenz Home"
            className="
              flex
              shrink-0
              items-center
            "
          >
            <Image
              src="/images/brand/roadlenz-header-logo.png"
              alt="RoadLenz - Drive Smart. Record Every Mile."
              width={600}
              height={200}
              priority
              className="
                h-auto
                w-[180px]
                object-contain
                sm:w-[190px]
                lg:w-[195px]
                xl:w-[200px]
                2xl:w-[215px]
              "
            />
          </Link>

          {/* =================================================
              DESKTOP NAVIGATION
          ================================================= */}

          <nav
            className="
              hidden
              min-w-0
              flex-1
              items-center
              justify-center
              gap-[15px]
              xl:flex
              2xl:gap-[22px]
            "
          >
            {NAVIGATION.map((item) => {
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    group
                    relative
                    flex
                    h-[94px]
                    items-center
                    whitespace-nowrap
                    text-[12px]
                    font-bold
                    tracking-[0.04em]
                    transition-colors
                    duration-300
                    2xl:text-[13px]

                    ${
                      active
                        ? "text-[#0789e8]"
                        : "text-[#172f4d] hover:text-[#0789e8]"
                    }
                  `}
                >
                  {item.label}

                  <span
                    className={`
                      absolute
                      bottom-[19px]
                      left-0
                      h-[2.5px]
                      rounded-full
                      bg-[#0aa8f4]
                      transition-all
                      duration-300

                      ${
                        active
                          ? "w-full"
                          : "w-0 group-hover:w-full"
                      }
                    `}
                  />
                </Link>
              );
            })}
          </nav>

          {/* =================================================
              RIGHT ACTIONS
          ================================================= */}

          <div
            className="
              hidden
              shrink-0
              items-center
              gap-2.5
              md:flex
            "
          >
            {/* SEARCH */}

            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="
                grid
                h-[46px]
                w-[46px]
                place-items-center
                rounded-full
                border
                border-slate-200
                bg-white
                text-[#183653]
                shadow-sm
                transition-all
                duration-300
                hover:-translate-y-[1px]
                hover:border-sky-300
                hover:bg-sky-50
                hover:text-[#0789e8]
              "
              aria-label="Search"
            >
              <SearchIcon />
            </button>

            {/* LOGIN */}

            <Link
              href="/customer-login"
              className="
                flex
                h-[46px]
                items-center
                gap-2
                rounded-full
                border
                border-slate-300
                bg-white
                px-5
                text-[12px]
                font-bold
                tracking-[0.03em]
                text-[#172f4d]
                shadow-sm
                transition-all
                duration-300
                hover:-translate-y-[1px]
                hover:border-sky-400
                hover:bg-sky-50
                hover:text-[#0789e8]
              "
            >
              <UserIcon />

              <span>LOGIN</span>
            </Link>

            {/* =================================================
                REQUEST DEMO → DEMO BOOKING
            ================================================= */}

            <Link
              href="/book-demo"
              aria-label="Book a RoadLenz demo"
              className="
                hidden
                h-[48px]
                items-center
                justify-center
                gap-2.5
                whitespace-nowrap
                rounded-full
                bg-gradient-to-r
                from-[#0878d9]
                to-[#079ce7]
                px-6
                text-[12px]
                font-bold
                tracking-[0.035em]
                text-white
                shadow-[0_8px_24px_rgba(8,119,218,0.28)]
                transition-all
                duration-300
                hover:-translate-y-[2px]
                hover:shadow-[0_12px_30px_rgba(8,119,218,0.40)]
                lg:flex
              "
            >
              <span
                className="
                  flex
                  h-[28px]
                  w-[28px]
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-white/20
                  text-white
                  shadow-[0_3px_8px_rgba(0,0,0,0.15)]
                "
              >
                <CalendarDays className="h-[19px] w-[19px]" aria-hidden="true" />
              </span>

              <span>REQUEST DEMO</span>
            </Link>
          </div>

          {/* =================================================
              MOBILE MENU BUTTON
          ================================================= */}

          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="
              grid
              h-[46px]
              w-[46px]
              shrink-0
              place-items-center
              rounded-full
              border
              border-slate-300
              bg-white
              text-[#172f4d]
              shadow-sm
              xl:hidden
            "
            aria-label="Open menu"
          >
            <MenuIcon />
          </button>
        </div>
      </header>

      {/* ===================================================
          MOBILE MENU
      =================================================== */}

      <div
        className={`
          fixed
          inset-0
          z-[10000]
          transition-all
          duration-300
          xl:hidden

          ${
            mobileOpen
              ? "visible opacity-100"
              : "invisible opacity-0"
          }
        `}
      >
        {/* BACKDROP */}

        <button
          type="button"
          aria-label="Close menu"
          onClick={() => setMobileOpen(false)}
          className="
            absolute
            inset-0
            bg-black/55
            backdrop-blur-sm
          "
        />

        {/* MOBILE PANEL */}

        <div
          className={`
            absolute
            right-0
            top-0
            flex
            h-full
            w-[min(91vw,420px)]
            flex-col
            bg-white
            shadow-2xl
            transition-transform
            duration-300

            ${
              mobileOpen
                ? "translate-x-0"
                : "translate-x-full"
            }
          `}
        >
          {/* MOBILE HEADER */}

          <div
            className="
              flex
              h-[94px]
              items-center
              justify-between
              border-b
              border-slate-200
              px-5
            "
          >
            <Link href="/" aria-label="RoadLenz Home">
              <Image
                src="/images/brand/roadlenz-header-logo.png"
                alt="RoadLenz"
                width={600}
                height={200}
                priority
                className="
                  h-auto
                  w-[185px]
                  object-contain
                "
              />
            </Link>

            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="
                grid
                h-[44px]
                w-[44px]
                place-items-center
                rounded-full
                border
                border-slate-200
                bg-white
                text-[#172f4d]
              "
              aria-label="Close menu"
            >
              <CloseIcon />
            </button>
          </div>

          {/* =================================================
              MOBILE NAVIGATION
          ================================================= */}

          <div
            className="
              flex-1
              overflow-y-auto
              px-5
              py-6
            "
          >
            <nav className="space-y-1.5">
              {NAVIGATION.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    flex
                    min-h-[56px]
                    items-center
                    justify-between
                    rounded-[14px]
                    px-4
                    text-[14px]
                    font-bold
                    tracking-[0.035em]
                    transition

                    ${
                      isActive(item.href)
                        ? "bg-sky-50 text-sky-600"
                        : "text-[#172f4d] hover:bg-slate-50"
                    }
                  `}
                >
                  {item.label}

                  <span className="text-slate-400">
                    →
                  </span>
                </Link>
              ))}
            </nav>

            {/* =================================================
                MOBILE ACTIONS
            ================================================= */}

            <div className="mt-7 grid gap-3">
              {/* REQUEST DEMO */}

              <Link
                href="/book-demo"
                className="
                  flex
                  min-h-[56px]
                  items-center
                  justify-center
                  gap-3
                  rounded-full
                  bg-gradient-to-r
                  from-[#0878d9]
                  to-[#079ce7]
                  px-6
                  text-[13px]
                  font-bold
                  tracking-[0.04em]
                  text-white
                  shadow-[0_8px_24px_rgba(8,119,218,0.25)]
                "
              >
                <span
                  className="
                    flex
                    h-[30px]
                    w-[30px]
                    items-center
                    justify-center
                    rounded-full
                    bg-white/20
                  "
                >
                  <CalendarDays className="h-[19px] w-[19px]" aria-hidden="true" />
                </span>

                REQUEST DEMO
              </Link>

              {/* LOGIN */}

              <Link
                href="/customer-login"
                className="
                  flex
                  min-h-[54px]
                  items-center
                  justify-center
                  gap-2
                  rounded-full
                  border
                  border-slate-300
                  bg-white
                  px-6
                  text-[13px]
                  font-bold
                  tracking-[0.04em]
                  text-[#172f4d]
                "
              >
                <UserIcon />

                CUSTOMER LOGIN
              </Link>

              {/* SEARCH */}

              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  setSearchOpen(true);
                }}
                className="
                  flex
                  min-h-[54px]
                  items-center
                  justify-center
                  gap-2
                  rounded-full
                  border
                  border-slate-300
                  bg-white
                  px-6
                  text-[13px]
                  font-bold
                  tracking-[0.04em]
                  text-[#172f4d]
                "
              >
                <SearchIcon />

                SEARCH
              </button>
            </div>

            {/* WHATSAPP CONTACT */}

            <div
              className="
                mt-6
                rounded-[20px]
                border
                border-slate-200
                bg-slate-50
                p-5
              "
            >
              <p
                className="
                  text-[11px]
                  font-bold
                  uppercase
                  tracking-[0.12em]
                  text-slate-400
                "
              >
                WhatsApp RoadLenz
              </p>

              <a
                href="https://wa.me/919841600444"
                target="_blank"
                rel="noopener noreferrer"
                className="
                  mt-3
                  flex
                  items-center
                  gap-2.5
                  text-[16px]
                  font-bold
                  text-[#1da851]
                "
              >
                <MessageCircle className="h-[19px] w-[19px]" aria-hidden="true" />

                +91 98416 00444
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ===================================================
          SEARCH OVERLAY
      =================================================== */}

      <div
        className={`
          fixed
          inset-0
          z-[11000]
          bg-white/[0.98]
          backdrop-blur-xl
          transition-all
          duration-300

          ${
            searchOpen
              ? "visible opacity-100"
              : "invisible opacity-0"
          }
        `}
      >
        <div
          className="
            mx-auto
            flex
            min-h-screen
            max-w-[1000px]
            flex-col
            px-5
            pt-[110px]
          "
        >
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setSearchOpen(false)}
              className="
                grid
                h-[48px]
                w-[48px]
                place-items-center
                rounded-full
                border
                border-slate-300
                bg-white
                text-[#172f4d]
                shadow-sm
              "
              aria-label="Close search"
            >
              <CloseIcon />
            </button>
          </div>

          <div
            className="
              mx-auto
              mt-14
              w-full
              max-w-[760px]
            "
          >
            <p
              className="
                text-[13px]
                font-bold
                uppercase
                tracking-[0.17em]
                text-sky-600
              "
            >
              Search RoadLenz
            </p>

            <div
              className="
                mt-5
                flex
                items-center
                gap-4
                border-b
                border-slate-300
                pb-5
                text-[#172f4d]
              "
            >
              <SearchIcon />

              <input
                autoFocus={searchOpen}
                type="search"
                placeholder="Search products, solutions, technology..."
                className="
                  min-w-0
                  flex-1
                  bg-transparent
                  text-[22px]
                  font-medium
                  text-[#172f4d]
                  outline-none
                  placeholder:text-slate-400
                  sm:text-[26px]
                "
              />
            </div>

            <p
              className="
                mt-4
                text-[13px]
                leading-6
                text-slate-500
              "
            >
              Search products, fleet solutions, industries and
              RoadLenz technology.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
