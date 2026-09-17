"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  motion,
  useReducedMotion,
} from "framer-motion";

import { Logo } from "./ui";

export default function Footer() {
  const reduceMotion = useReducedMotion();
  const pathname = usePathname();

  if (pathname === "/book-demo") return null;

  return (
    <footer className="relative overflow-hidden bg-[#061b2e] text-white">

      {/* ============================================================
          BACKGROUND
      ============================================================ */}

      <div className="pointer-events-none absolute inset-0">

        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.3) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
          }}
        />

        <motion.div
          animate={
            reduceMotion
              ? undefined
              : {
                  x: [0, 100, 0],
                  y: [0, 30, 0],
                }
          }
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -left-[260px] -top-[260px] h-[620px] w-[620px] rounded-full bg-[#0a85cf]/10 blur-[160px]"
        />

        <motion.div
          animate={
            reduceMotion
              ? undefined
              : {
                  x: [0, -70, 0],
                }
          }
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -right-[240px] bottom-[-260px] h-[560px] w-[560px] rounded-full bg-[#33bed8]/[0.07] blur-[160px]"
        />

      </div>

      {/* ============================================================
          MAIN FOOTER
      ============================================================ */}

      <div className="relative mx-auto w-full max-w-[1400px] px-6 pb-12 pt-16 sm:px-8 lg:px-12 lg:pb-14 lg:pt-20">

        <div className="grid gap-x-10 gap-y-12 md:grid-cols-2 lg:grid-cols-[1.35fr_.75fr_.9fr_1.15fr_.75fr]">

          {/* ========================================================
              BRAND
          ======================================================== */}

          <div className="md:col-span-2 lg:col-span-1">

            <Link
              href="/"
              aria-label="RoadLenz Home"
              className="inline-flex"
            >
              <Logo dark />
            </Link>

            <p className="mt-6 max-w-[335px] text-[13px] font-normal leading-7 text-white/58">
              Intelligent fleet management, GPS tracking,
              video telematics and AI-powered vehicle safety
              solutions for connected fleet operations.
            </p>

            {/* POWERED BY */}

            <div className="mt-5 inline-flex items-center gap-2.5 rounded-full border border-white/[0.09] bg-white/[0.045] px-4 py-2.5">

              <span className="h-2 w-2 rounded-full bg-[#43c6de] shadow-[0_0_10px_rgba(67,198,222,.4)]" />

              <span className="text-[10px] font-semibold tracking-[0.04em] text-white/55">
                Powered by Bigfox Engineering
              </span>

            </div>

            {/* CONTACT */}

            <div className="mt-8 space-y-4">

              <div className="flex items-start gap-3.5">

                <span className="mt-[2px] flex h-9 w-9 shrink-0 items-center justify-center rounded-[11px] border border-white/[0.07] bg-white/[0.045] text-[#55c4d9]">
                  <LocationIcon />
                </span>

                <p className="max-w-[255px] text-[12px] leading-6 text-white/46">
                  Thirumudivakkam, Chennai,
                  Tamil Nadu, India
                </p>

              </div>

              <a
                href="tel:+919841600444"
                className="group flex w-fit items-center gap-3.5"
              >

                <span className="flex h-9 w-9 items-center justify-center rounded-[11px] border border-white/[0.07] bg-white/[0.045] text-[#55c4d9] transition group-hover:bg-white/[0.08]">
                  <PhoneIcon />
                </span>

                <span className="text-[12px] font-medium text-white/48 transition group-hover:text-white">
                  +91 98416 00444
                </span>

              </a>

              <a
                href="mailto:bigfoxinfo@gmail.com"
                className="group flex w-fit items-center gap-3.5"
              >

                <span className="flex h-9 w-9 items-center justify-center rounded-[11px] border border-white/[0.07] bg-white/[0.045] text-[#55c4d9] transition group-hover:bg-white/[0.08]">
                  <MailIcon />
                </span>

                <span className="text-[12px] font-medium text-white/48 transition group-hover:text-white">
                  bigfoxinfo@gmail.com
                </span>

              </a>

            </div>

          </div>

          {/* ========================================================
              PRODUCTS
          ======================================================== */}

          <div>

            <FooterTitle>
              Products
            </FooterTitle>

            <div className="mt-7 space-y-[17px]">

              <FooterLink href="/products">
                AI Dashcams
              </FooterLink>

              <FooterLink href="/products">
                MDVR Systems
              </FooterLink>

              <FooterLink href="/products">
                Vehicle CCTV Cameras
              </FooterLink>

              <FooterLink href="/products">
                GPS Tracking Devices
              </FooterLink>

              <FooterLink href="/products">
                Passenger & RFID
              </FooterLink>

            </div>

          </div>

          {/* ========================================================
              INDUSTRIES
          ======================================================== */}

          <div>

            <FooterTitle>
              Industries
            </FooterTitle>

            <div className="mt-7 space-y-[17px]">

              <FooterLink href="/solutions/employee-transport">
                Employee Transport
              </FooterLink>

              <FooterLink href="/solutions/school-transport">
                School Transport
              </FooterLink>

              <FooterLink href="/solutions/public-transport">
                Public Transport
              </FooterLink>

              <FooterLink href="/solutions/trucking-logistics">
                Trucking & Logistics
              </FooterLink>

              <FooterLink href="/solutions/agriculture">
                Agriculture
              </FooterLink>

              <FooterLink href="/solutions/cab-taxi">
                Cab & Taxi
              </FooterLink>

              <FooterLink href="/solutions/mining">
                Mining
              </FooterLink>

            </div>

          </div>

          {/* ========================================================
              ROADLENZ SOFTWARE
          ======================================================== */}

          <div>

            <FooterTitle>
              RoadLenz Software
            </FooterTitle>

            {/* SOFTWARE FEATURE */}

            <Link
              href="/technology"
              className="group mt-6 block rounded-[18px] border border-white/[0.09] bg-white/[0.045] p-4 transition duration-300 hover:-translate-y-1 hover:border-[#41bdd6]/20 hover:bg-white/[0.07]"
            >

              <div className="flex items-center gap-3.5">

                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-[#0c80ba]/15 text-[#52c2d9]">

                  <SoftwareIcon />

                </span>

                <div>

                  <p className="text-[12px] font-semibold text-white/85">
                    Fleet Intelligence Platform
                  </p>

                  <p className="mt-1 text-[10px] leading-4 text-white/35">
                    One connected operations platform
                  </p>

                </div>

              </div>

              <div className="mt-4 flex items-center justify-between border-t border-white/[0.07] pt-3">

                <span className="text-[9px] font-medium uppercase tracking-[0.12em] text-[#4ebfd5]">
                  Explore Software
                </span>

                <span className="text-white/30 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-white">
                  →
                </span>

              </div>

            </Link>

            <div className="mt-6 space-y-[17px]">

              <FooterLink href="/technology">
                Live Fleet Tracking
              </FooterLink>

              <FooterLink href="/technology">
                Video Telematics
              </FooterLink>

              <FooterLink href="/technology">
                AI Safety & Alerts
              </FooterLink>

              <FooterLink href="/technology">
                Route & Playback
              </FooterLink>

              <FooterLink href="/technology">
                Reports & Analytics
              </FooterLink>

            </div>

          </div>

          {/* ========================================================
              COMPANY
          ======================================================== */}

          <div>

            <FooterTitle>
              Company
            </FooterTitle>

            <div className="mt-7 space-y-[17px]">

              <FooterLink href="/about">
                About Us
              </FooterLink>

              <FooterLink href="/about#global-presence">
                Global Presence
              </FooterLink>

              <FooterLink href="/contact">
                Contact Us
              </FooterLink>

              <FooterLink href="/customer-login">
                Customer Login
              </FooterLink>

            </div>

          </div>

        </div>

      </div>

      {/* ============================================================
          CONTACT + SOCIAL STRIP
      ============================================================ */}

      <div className="relative border-y border-white/[0.075] bg-[#051725]/70">

        <div className="mx-auto grid w-full max-w-[1400px] gap-7 px-6 py-7 sm:px-8 lg:grid-cols-[1fr_auto] lg:items-center lg:px-12">

          {/* SUPPORT */}

          <div className="flex flex-col gap-5 md:flex-row md:items-center md:gap-8">

            <div>

              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#5fc5d9]">
                Need Assistance?
              </p>

              <p className="mt-1.5 text-[13px] font-medium text-white/70">
                Connect directly with our RoadLenz support team.
              </p>

            </div>

            <div className="flex flex-wrap gap-2.5">

              <a
                href="tel:+919841600444"
                className="group flex h-[44px] items-center gap-3 rounded-full border border-white/[0.09] bg-white/[0.045] px-5 text-[11px] font-medium text-white/58 transition hover:border-white/[0.15] hover:bg-white/[0.075] hover:text-white"
              >

                <PhoneIcon />

                +91 98416 00444

              </a>

              <a
                href="mailto:bigfoxinfo@gmail.com"
                className="group flex h-[44px] items-center gap-3 rounded-full border border-white/[0.09] bg-white/[0.045] px-5 text-[11px] font-medium text-white/58 transition hover:border-white/[0.15] hover:bg-white/[0.075] hover:text-white"
              >

                <MailIcon />

                bigfoxinfo@gmail.com

              </a>

            </div>

          </div>

          {/* ======================================================
              SOCIAL
          ====================================================== */}

          <div>

            <p className="mb-3 text-[9px] font-semibold uppercase tracking-[0.18em] text-white/28 lg:text-right">
              Follow RoadLenz
            </p>

            <div className="flex gap-2.5">

              <SocialLink
                href="https://www.youtube.com/"
                label="YouTube"
              >
                <YouTubeIcon />
              </SocialLink>

              <SocialLink
                href="https://www.instagram.com/"
                label="Instagram"
              >
                <InstagramIcon />
              </SocialLink>

              <SocialLink
                href="https://www.facebook.com/"
                label="Facebook"
              >
                <FacebookIcon />
              </SocialLink>

              <SocialLink
                href="https://www.linkedin.com/"
                label="LinkedIn"
              >
                <LinkedInIcon />
              </SocialLink>

            </div>

          </div>

        </div>

      </div>

      {/* ============================================================
          BOTTOM BAR
      ============================================================ */}

      <div className="relative">

        <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-4 px-6 py-5 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-12">

          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">

            <p className="text-[10px] text-white/32">
              © 2026 RoadLenz Intelligent Mobility
            </p>

            <span className="hidden h-3 w-px bg-white/10 sm:block" />

            <p className="text-[10px] text-white/24">
              Powered by Bigfox Engineering Private Limited
            </p>

          </div>

          <div className="flex flex-wrap gap-x-5 gap-y-2">

            <Link
              href="/privacy-policy"
              className="text-[10px] text-white/30 transition hover:text-white"
            >
              Privacy Policy
            </Link>

            <Link
              href="/terms"
              className="text-[10px] text-white/30 transition hover:text-white"
            >
              Terms & Conditions
            </Link>

            <Link
              href="/contact"
              className="text-[10px] text-white/30 transition hover:text-white"
            >
              Support
            </Link>

          </div>

        </div>

      </div>

    </footer>
  );
}

/* ================================================================
   TITLE
================================================================ */

function FooterTitle({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="text-[11px] font-semibold uppercase tracking-[0.17em] text-white/62">
        {children}
      </h3>

      <div className="mt-3 h-[2px] w-7 rounded-full bg-[#43bdd5]/60" />
    </div>
  );
}

/* ================================================================
   LINK
================================================================ */

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group flex w-fit items-center gap-2.5 text-[12px] font-normal text-white/48 transition-all duration-300 hover:translate-x-1 hover:text-white"
    >

      <span className="h-1 w-1 rounded-full bg-[#4fc2d8] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      {children}

    </Link>
  );
}

/* ================================================================
   SOCIAL LINK
================================================================ */

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      whileHover={{
        y: -4,
      }}
      className="flex h-11 w-11 items-center justify-center rounded-[13px] border border-white/[0.09] bg-white/[0.04] text-white/42 transition-colors duration-300 hover:border-[#45bfd7]/25 hover:bg-[#0c779f]/15 hover:text-white"
    >
      {children}
    </motion.a>
  );
}

/* ================================================================
   ICONS
================================================================ */

function SoftwareIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-[17px] w-[17px]"
    >
      <rect
        x="4"
        y="5"
        width="16"
        height="14"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
      />

      <path
        d="m8 15 3-3 2 2 3-4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-4 w-4"
    >
      <path
        d="M12 21s6-5.2 6-11a6 6 0 1 0-12 0c0 5.8 6 11 6 11Z"
        stroke="currentColor"
        strokeWidth="1.55"
      />

      <circle
        cx="12"
        cy="10"
        r="2"
        stroke="currentColor"
        strokeWidth="1.55"
      />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-4 w-4"
    >
      <path
        d="M7 3h3l1.5 4-2 1.5a15 15 0 0 0 6 6l1.5-2L21 14v3c0 2.2-1.8 4-4 4C9.3 21 3 14.7 3 7a4 4 0 0 1 4-4Z"
        stroke="currentColor"
        strokeWidth="1.55"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-4 w-4"
    >
      <path
        d="M4 6h16v12H4V6Zm0 1 8 6 8-6"
        stroke="currentColor"
        strokeWidth="1.55"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-[18px] w-[18px]"
    >
      <rect
        x="3"
        y="6"
        width="18"
        height="12"
        rx="4"
        stroke="currentColor"
        strokeWidth="1.5"
      />

      <path
        d="m10 9 5 3-5 3V9Z"
        fill="currentColor"
      />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-[18px] w-[18px]"
    >
      <rect
        x="4"
        y="4"
        width="16"
        height="16"
        rx="5"
        stroke="currentColor"
        strokeWidth="1.5"
      />

      <circle
        cx="12"
        cy="12"
        r="3.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />

      <circle
        cx="17.2"
        cy="6.9"
        r=".9"
        fill="currentColor"
      />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-[18px] w-[18px]"
    >
      <path d="M13.8 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.5 1.6-1.5H17V3.9c-.3 0-1.4-.1-2.6-.1-2.6 0-4.4 1.6-4.4 4.6V10H7v3h3v8h3.8Z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-[18px] w-[18px]"
    >
      <path d="M6.5 8.2H3.2V21h3.3V8.2ZM4.8 3A1.9 1.9 0 1 0 4.8 6.8 1.9 1.9 0 0 0 4.8 3ZM21 13.7c0-3.9-2.1-5.8-4.9-5.8-2.3 0-3.3 1.2-3.8 2V8.2H9V21h3.3v-6.3c0-1.7.3-3.4 2.5-3.4 2.2 0 2.2 2 2.2 3.5V21H20v-7.3Z" />
    </svg>
  );
}
