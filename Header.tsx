"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";

import { Icon, Logo } from "./ui";

interface HeaderProps {
  session: {
    name: string;
    role: string;
  } | null;
}

function useScrolled(offset = 40) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > offset);
    };

    onScroll();

    window.addEventListener("scroll", onScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [offset]);

  return scrolled;
}

export default function Header({ session }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();

  const scrolled = useScrolled();

  const onHome = pathname === "/";
  const solid = scrolled || !onHome;

  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  const searchInputRef = useRef<HTMLInputElement>(null);
  const headerRef = useRef<HTMLElement>(null);

  const reduce = useReducedMotion();

  /*
   * ----------------------------------------------------------
   * HEADER HEIGHT
   * ----------------------------------------------------------
   */

  useEffect(() => {
    const header = headerRef.current;

    if (!header) return;

    const updateHeight = () => {
      document.documentElement.style.setProperty(
        "--site-header-height",
        `${header.getBoundingClientRect().height}px`,
      );
    };

    updateHeight();

    const observer = new ResizeObserver(updateHeight);
    observer.observe(header);

    return () => observer.disconnect();
  }, []);

  /*
   * ----------------------------------------------------------
   * ESCAPE KEY
   * ----------------------------------------------------------
   */

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSearchOpen(false);
        setMobileOpen(false);
      }
    };

    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  /*
   * ----------------------------------------------------------
   * SEARCH FOCUS
   * ----------------------------------------------------------
   */

  useEffect(() => {
    if (!searchOpen) return;

    const timer = window.setTimeout(() => {
      searchInputRef.current?.focus();
    }, 50);

    return () => window.clearTimeout(timer);
  }, [searchOpen]);

  /*
   * ----------------------------------------------------------
   * MOBILE BODY LOCK
   * ----------------------------------------------------------
   */

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  /*
   * ----------------------------------------------------------
   * CLOSE MOBILE MENU WHEN ROUTE CHANGES
   * ----------------------------------------------------------
   */

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  /*
   * ----------------------------------------------------------
   * SEARCH
   * ----------------------------------------------------------
   */

  const submitSearch = (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedQuery = query.trim();

    if (!trimmedQuery) return;

    setSearchOpen(false);
    setQuery("");

    router.push(
      `/search?q=${encodeURIComponent(trimmedQuery)}`,
    );
  };

  /*
   * ----------------------------------------------------------
   * ACCOUNT
   * ----------------------------------------------------------
   */

  const accountHref = session
    ? session.role === "admin"
      ? "/admin"
      : "/dashboard"
    : "/customer-login";

  /*
   * ----------------------------------------------------------
   * ACTIVE ROUTE
   * ----------------------------------------------------------
   */

  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === "/";
    }

    return (
      pathname === path ||
      pathname.startsWith(`${path}/`)
    );
  };

  /*
   * ----------------------------------------------------------
   * NAV STYLES
   * ----------------------------------------------------------
   */

  const navBase =
    "relative flex items-center px-3 py-2 text-[13px] font-semibold tracking-[-0.01em] transition-all duration-300";

  const navNormal = solid
    ? "text-[#50657b] hover:text-[#006bff]"
    : "text-white/85 hover:text-white";

  const navActive = solid
    ? "text-[#006bff]"
    : "text-white";

  const activeLine = solid
    ? "bg-[#006bff]"
    : "bg-white";

  return (
    <header
      ref={headerRef}
      className={[
        onHome ? "fixed" : "sticky",
        "inset-x-0 top-0 z-[100]",
        "transition-all duration-500",
        solid
          ? "border-b border-[#dbe7f3]/80 bg-white/95 shadow-[0_8px_30px_rgba(5,30,60,0.07)] backdrop-blur-xl"
          : "border-b border-white/10 bg-transparent",
      ].join(" ")}
    >
      <div className="mx-auto flex h-[74px] w-full max-w-[1440px] items-center justify-between gap-5 px-5 sm:px-7 lg:px-10">

        {/* ====================================================
            LOGO
        ==================================================== */}

        <Link
          href="/"
          aria-label="RoadLenz Home"
          className="shrink-0"
          onClick={() => {
            setMobileOpen(false);
          }}
        >
          <Logo dark={!solid} />
        </Link>

        {/* ====================================================
            DESKTOP NAVIGATION
        ==================================================== */}

        <nav
          className="hidden h-full items-center xl:flex"
          aria-label="Primary navigation"
        >

          {/* HOME */}

          <DesktopNavLink
            href="/"
            label="HOME"
            active={isActive("/")}
            navBase={navBase}
            navNormal={navNormal}
            navActive={navActive}
            activeLine={activeLine}
          />

          {/* PRODUCTS */}

          <DesktopNavLink
            href="/products"
            label="PRODUCTS"
            active={isActive("/products")}
            navBase={navBase}
            navNormal={navNormal}
            navActive={navActive}
            activeLine={activeLine}
          />

          {/* SOLUTIONS */}

          <DesktopNavLink
            href="/solutions"
            label="SOLUTIONS"
            active={isActive("/solutions")}
            navBase={navBase}
            navNormal={navNormal}
            navActive={navActive}
            activeLine={activeLine}
          />

          {/* TECHNOLOGY */}

          <DesktopNavLink
            href="/technology"
            label="TECHNOLOGY"
            active={isActive("/technology")}
            navBase={navBase}
            navNormal={navNormal}
            navActive={navActive}
            activeLine={activeLine}
          />

          {/* INDUSTRIES */}

          <DesktopNavLink
            href="/industries"
            label="INDUSTRIES"
            active={isActive("/industries")}
            navBase={navBase}
            navNormal={navNormal}
            navActive={navActive}
            activeLine={activeLine}
          />

          {/* ==================================================
              ABOUT US
              DIRECT LINK — NO DROPDOWN
          ================================================== */}

          <DesktopNavLink
            href="/about"
            label="ABOUT US"
            active={isActive("/about")}
            navBase={navBase}
            navNormal={navNormal}
            navActive={navActive}
            activeLine={activeLine}
          />
        </nav>

        {/* ====================================================
            RIGHT SIDE
        ==================================================== */}

        <div className="flex items-center gap-1.5">

          {/* SEARCH */}

          <div className="relative hidden md:block">
            <AnimatePresence mode="wait">
              {searchOpen ? (
                <motion.form
                  key="search-form"
                  initial={{
                    opacity: 0,
                    width: 0,
                  }}
                  animate={{
                    opacity: 1,
                    width: 260,
                  }}
                  exit={{
                    opacity: 0,
                    width: 0,
                  }}
                  transition={{
                    duration: 0.22,
                  }}
                  onSubmit={submitSearch}
                  role="search"
                  className="overflow-hidden"
                >
                  <div
                    className={[
                      "flex h-[40px] items-center gap-2 rounded-full border px-4",
                      solid
                        ? "border-[#d8e4ef] bg-white"
                        : "border-white/20 bg-white/10 backdrop-blur",
                    ].join(" ")}
                  >
                    <Icon
                      name="search"
                      className={`h-4 w-4 shrink-0 ${
                        solid
                          ? "text-[#006bff]"
                          : "text-white/80"
                      }`}
                    />

                    <input
                      ref={searchInputRef}
                      value={query}
                      onChange={(event) =>
                        setQuery(event.target.value)
                      }
                      placeholder="Search..."
                      aria-label="Search"
                      className={`w-full bg-transparent text-[12px] outline-none ${
                        solid
                          ? "text-[#102d4e] placeholder:text-[#8b9bad]"
                          : "text-white placeholder:text-white/50"
                      }`}
                    />

                    <button
                      type="button"
                      onClick={() => {
                        setSearchOpen(false);
                        setQuery("");
                      }}
                      aria-label="Close search"
                      className={`shrink-0 text-[13px] ${
                        solid
                          ? "text-[#8190a0] hover:text-[#102d4e]"
                          : "text-white/60 hover:text-white"
                      }`}
                    >
                      ×
                    </button>
                  </div>
                </motion.form>
              ) : (
                <motion.button
                  key="search-button"
                  initial={{
                    opacity: 0,
                  }}
                  animate={{
                    opacity: 1,
                  }}
                  type="button"
                  onClick={() =>
                    setSearchOpen(true)
                  }
                  className={[
                    "group flex h-[40px] items-center gap-2 rounded-full px-3 transition-all duration-300",
                    solid
                      ? "text-[#50657b] hover:bg-[#f1f6fb] hover:text-[#006bff]"
                      : "text-white/80 hover:bg-white/10 hover:text-white",
                  ].join(" ")}
                  aria-label="Open search"
                >
                  <Icon
                    name="search"
                    className="h-[17px] w-[17px] transition-transform duration-300 group-hover:scale-110"
                  />

                  <span className="text-[11px] font-bold tracking-[0.04em]">
                    SEARCH
                  </span>
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          {/* LOGIN */}

          <Link
            href={accountHref}
            className={[
              "hidden h-[40px] items-center gap-2 rounded-full px-3.5 text-[11px] font-bold tracking-[0.04em] transition-all duration-300 sm:flex",
              solid
                ? "text-[#173b62] hover:bg-[#f1f6fb] hover:text-[#006bff]"
                : "text-white/90 hover:bg-white/10 hover:text-white",
            ].join(" ")}
          >
            <Icon
              name="user"
              className="h-[16px] w-[16px]"
            />

            LOGIN
          </Link>

          {/* MOBILE MENU */}

          <button
            type="button"
            onClick={() => {
              setMobileOpen(true);
              setSearchOpen(false);
            }}
            className={[
              "flex h-[40px] w-[40px] items-center justify-center rounded-full transition-all xl:hidden",
              solid
                ? "text-[#173b62] hover:bg-[#f1f6fb]"
                : "text-white hover:bg-white/10",
            ].join(" ")}
            aria-label="Open navigation menu"
            aria-expanded={mobileOpen}
          >
            <Icon
              name="menu"
              className="h-5 w-5"
            />
          </button>
        </div>
      </div>

      {/* ======================================================
          MOBILE NAVIGATION
      ====================================================== */}

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.2,
            }}
            className="fixed inset-0 z-[120] bg-[#04182e]/50 backdrop-blur-sm xl:hidden"
            onClick={() => setMobileOpen(false)}
          >
            <motion.div
              initial={
                reduce
                  ? false
                  : {
                      x: "100%",
                    }
              }
              animate={{
                x: 0,
              }}
              exit={
                reduce
                  ? undefined
                  : {
                      x: "100%",
                    }
              }
              transition={{
                type: "tween",
                duration: 0.3,
                ease: [
                  0.22,
                  0.61,
                  0.36,
                  1,
                ],
              }}
              className="absolute right-0 top-0 flex h-full w-[92%] max-w-[410px] flex-col overflow-y-auto bg-white shadow-2xl"
              onClick={(event) =>
                event.stopPropagation()
              }
            >

              {/* MOBILE HEADER */}

              <div className="flex h-[74px] shrink-0 items-center justify-between border-b border-[#e2eaf2] px-5">
                <Link
                  href="/"
                  aria-label="RoadLenz Home"
                  onClick={() =>
                    setMobileOpen(false)
                  }
                >
                  <Logo />
                </Link>

                <button
                  type="button"
                  onClick={() =>
                    setMobileOpen(false)
                  }
                  className="flex h-9 w-9 items-center justify-center rounded-full text-[#173b62] transition hover:bg-[#f2f6fa]"
                  aria-label="Close menu"
                >
                  <Icon
                    name="x"
                    className="h-5 w-5"
                  />
                </button>
              </div>

              <div className="flex flex-1 flex-col px-5 py-5">

                {/* MOBILE SEARCH */}

                <form
                  onSubmit={submitSearch}
                  role="search"
                  className="mb-4 flex items-center gap-2 rounded-[12px] border border-[#dce6ef] bg-[#f8fbfe] px-4 py-3"
                >
                  <Icon
                    name="search"
                    className="h-4 w-4 text-[#006bff]"
                  />

                  <input
                    value={query}
                    onChange={(event) =>
                      setQuery(event.target.value)
                    }
                    placeholder="Search..."
                    aria-label="Search"
                    className="w-full bg-transparent text-[13px] text-[#173b62] outline-none placeholder:text-[#8a99a9]"
                  />
                </form>

                {/* MOBILE HOME */}

                <MobileNavLink
                  href="/"
                  label="HOME"
                  active={pathname === "/"}
                  onClick={() =>
                    setMobileOpen(false)
                  }
                />

                {/* MOBILE PRODUCTS */}

                <MobileNavLink
                  href="/products"
                  label="PRODUCTS"
                  active={isActive("/products")}
                  onClick={() =>
                    setMobileOpen(false)
                  }
                />

                {/* MOBILE SOLUTIONS */}

                <MobileNavLink
                  href="/solutions"
                  label="SOLUTIONS"
                  active={isActive("/solutions")}
                  onClick={() =>
                    setMobileOpen(false)
                  }
                />

                {/* MOBILE TECHNOLOGY */}

                <MobileNavLink
                  href="/technology"
                  label="TECHNOLOGY"
                  active={isActive("/technology")}
                  onClick={() =>
                    setMobileOpen(false)
                  }
                />

                {/* MOBILE INDUSTRIES */}

                <MobileNavLink
                  href="/industries"
                  label="INDUSTRIES"
                  active={isActive("/industries")}
                  onClick={() =>
                    setMobileOpen(false)
                  }
                />

                {/* MOBILE ABOUT US
                    DIRECT LINK — NO DROPDOWN */}

                <MobileNavLink
                  href="/about"
                  label="ABOUT US"
                  active={isActive("/about")}
                  onClick={() =>
                    setMobileOpen(false)
                  }
                />

                {/* LOGIN */}

                <Link
                  href={accountHref}
                  onClick={() =>
                    setMobileOpen(false)
                  }
                  className="mt-5 flex h-[46px] items-center justify-center gap-2 rounded-full bg-[#006bff] text-[12px] font-bold tracking-[0.04em] text-white shadow-[0_10px_25px_rgba(0,107,255,0.22)] transition hover:bg-[#0058d4]"
                >
                  <Icon
                    name="user"
                    className="h-4 w-4"
                  />

                  LOGIN
                </Link>

                {/* MOBILE FOOTER */}

                <div className="mt-auto pt-8">
                  <div className="h-px bg-[#e5ecf3]" />

                  <p className="pt-4 text-[9px] font-bold tracking-[0.14em] text-[#8998a8]">
                    ROADLENZ
                  </p>

                  <p className="mt-1 text-[10px] leading-5 text-[#9ba8b6]">
                    Powered by BigFox Engineering
                    Private Limited
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

/* ============================================================
   DESKTOP NAV LINK
============================================================ */

function DesktopNavLink({
  href,
  label,
  active,
  navBase,
  navNormal,
  navActive,
  activeLine,
}: {
  href: string;
  label: string;
  active?: boolean;
  navBase: string;
  navNormal: string;
  navActive: string;
  activeLine: string;
}) {
  return (
    <Link
      href={href}
      aria-current={
        active ? "page" : undefined
      }
      className={`${navBase} ${
        active ? navActive : navNormal
      }`}
    >
      {label}

      {active && (
        <motion.span
          layoutId="header-active"
          className={`absolute bottom-[7px] left-3 right-3 h-[2px] rounded-full ${activeLine}`}
        />
      )}
    </Link>
  );
}

/* ============================================================
   MOBILE NAV LINK
============================================================ */

function MobileNavLink({
  href,
  label,
  active,
  onClick,
}: {
  href: string;
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={
        active ? "page" : undefined
      }
      className={`flex items-center justify-between border-b border-[#e5ecf3] px-2 py-4 text-[13px] font-bold tracking-[0.02em] transition ${
        active
          ? "text-[#006bff]"
          : "text-[#173b62] hover:text-[#006bff]"
      }`}
    >
      <span>{label}</span>

      {active && (
        <span className="h-1.5 w-1.5 rounded-full bg-[#006bff]" />
      )}
    </Link>
  );
}