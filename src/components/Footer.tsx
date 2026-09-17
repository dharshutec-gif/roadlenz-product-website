"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { Logo } from "./ui";

export default function Footer() {
  const reduceMotion = useReducedMotion();
  const pathname = usePathname();

  if (pathname === "/book-demo" || pathname === "/dashboard") return null;

  return (
    <footer className="relative overflow-hidden bg-[#061b2e] text-white">
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0 opacity-[0.018]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.28) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.28) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
          }}
        />
        <motion.div
          animate={reduceMotion ? undefined : { x: [0, 60, 0], y: [0, 20, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -left-[280px] -top-[300px] h-[620px] w-[620px] rounded-full bg-[#0a85cf]/10 blur-[170px]"
        />
        <motion.div
          animate={reduceMotion ? undefined : { x: [0, -55, 0], y: [0, 15, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -right-[260px] bottom-[-280px] h-[580px] w-[580px] rounded-full bg-[#33bed8]/[0.06] blur-[170px]"
        />
      </div>

      <div className="relative mx-auto w-full max-w-[1500px] px-6 pb-7 pt-8 sm:px-8 lg:px-10 xl:px-12">
        <div className="grid gap-x-10 gap-y-8 md:grid-cols-2 lg:grid-cols-[1.45fr_.9fr_.95fr_1.3fr_.8fr]">
          <div className="md:col-span-2 lg:col-span-1">
            <Link href="/" aria-label="RoadLenz Home" className="inline-flex scale-[0.9] origin-left">
              <Logo dark />
            </Link>

            <p className="mt-3 max-w-[360px] text-[12px] font-normal leading-[1.55] text-white/65">
              Intelligent fleet management, GPS tracking, video telematics and AI-powered vehicle safety solutions for connected fleet operations.
            </p>

            <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-white/[0.12] bg-white/[0.035] px-3 py-1.5">
              <span className="h-2 w-2 rounded-full bg-[#43c6de] shadow-[0_0_8px_rgba(67,198,222,.4)]" />
              <span className="text-[9px] font-medium text-white/60">Powered by Bigfox Engineering</span>
            </div>

            <div className="mt-4 space-y-2.5">
              <div className="flex items-start gap-2.5">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px] border border-white/[0.11] bg-white/[0.035] text-[#55c4d9]"><LocationIcon /></span>
                <p className="max-w-[300px] text-[12px] leading-[1.45] text-white/65">Thirumudivakkam, Chennai,<br />Tamil Nadu, India</p>
              </div>
              <a href="tel:+919841600444" className="group flex w-fit items-center gap-2.5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px] border border-white/[0.11] bg-white/[0.035] text-[#55c4d9]"><PhoneIcon /></span>
                <span className="text-[11px] text-white/65 transition group-hover:text-white">+91 98416 00444</span>
              </a>
              <a href="mailto:bigfoxinfo@gmail.com" className="group flex w-fit items-center gap-2.5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px] border border-white/[0.11] bg-white/[0.035] text-[#55c4d9]"><MailIcon /></span>
                <span className="text-[11px] text-white/65 transition group-hover:text-white">bigfoxinfo@gmail.com</span>
              </a>
            </div>
          </div>

          <FooterColumn title="Products">
            <FooterLink href="/products">AI Dashcams</FooterLink>
            <FooterLink href="/products">MDVR Systems</FooterLink>
            <FooterLink href="/products">Vehicle CCTV Cameras</FooterLink>
            <FooterLink href="/products">GPS Tracking Devices</FooterLink>
            <FooterLink href="/products">Passenger & RFID</FooterLink>
            <FooterLink href="/products">Fuel Monitoring</FooterLink>
            <FooterLink href="/products">CCTV Cameras</FooterLink>
          </FooterColumn>

          <FooterColumn title="Industries">
            <FooterLink href="/solutions/employee-transport">Employee Transport</FooterLink>
            <FooterLink href="/solutions/school-transport">School Transport</FooterLink>
            <FooterLink href="/solutions/public-transport">Public Transport</FooterLink>
            <FooterLink href="/solutions/trucking-logistics">Trucking & Logistics</FooterLink>
            <FooterLink href="/solutions/agriculture">Agriculture</FooterLink>
            <FooterLink href="/solutions/cab-taxi">Cab & Taxi</FooterLink>
            <FooterLink href="/solutions/mining">Mining</FooterLink>
          </FooterColumn>

          <div>
            <FooterTitle>RoadLenz Software</FooterTitle>
            <Link href="/technology" className="group mt-3 block rounded-[13px] border border-white/[0.12] bg-white/[0.035] p-3 transition duration-300 hover:-translate-y-0.5 hover:border-[#41bdd6]/30 hover:bg-white/[0.055]">
              <div className="flex items-start gap-2.5">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px] bg-[#0c80ba]/15 text-[#52c2d9]"><SoftwareIcon /></span>
                <div>
                  <p className="text-[13px] font-medium leading-[1.3] text-white/90">RoadLenz Fleet Platform</p>
                  <p className="mt-1 text-[10px] leading-[1.35] text-white/55">Connected fleet operations, intelligence & safety</p>
                </div>
              </div>
              <div className="mt-2.5 flex items-center justify-between border-t border-white/[0.08] pt-2">
                <span className="text-[8px] font-semibold uppercase tracking-[0.12em] text-[#4ebfd5]">Explore Platform</span>
                <span className="text-[14px] text-white/35 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-white">→</span>
              </div>
            </Link>
            <div className="mt-3 space-y-2">
              <FooterLink href="/technology">Live Fleet Tracking</FooterLink>
              <FooterLink href="/technology">Video Telematics</FooterLink>
              <FooterLink href="/technology">AI Safety & Alerts</FooterLink>
              <FooterLink href="/technology">Routes & Playback</FooterLink>
              <FooterLink href="/technology">Reports & Analytics</FooterLink>
            </div>
          </div>

          <div>
            <FooterTitle>Company</FooterTitle>
            <div className="mt-4 space-y-2">
              <FooterLink href="/about">About Us</FooterLink>
              <FooterLink href="/about">About Company</FooterLink>
              <FooterLink href="/about#global-presence">Global Presence</FooterLink>
              <FooterLink href="/contact">Connect Us</FooterLink>
            </div>
            <div className="mt-7">
              <FooterTitle>Follow RoadLenz</FooterTitle>
              <div className="mt-3 flex gap-2">
                <SocialLink href="https://youtube.com/@bigfoxengineering?si=gBS29ZpnS1-LWi56" label="YouTube"><YouTubeIcon /></SocialLink>
                <SocialLink href="https://www.instagram.com/bigfox_engineering?igsh=aGV2dWd3amhseHhw" label="Instagram"><InstagramIcon /></SocialLink>
                <SocialLink href="https://www.facebook.com/61586554280765/" label="Facebook"><FacebookIcon /></SocialLink>
                <SocialLink href="https://www.linkedin.com/company/bigfox-engineering-private-limited/" label="LinkedIn"><LinkedInIcon /></SocialLink>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative border-t border-white/[0.09]">
        <div className="mx-auto flex w-full max-w-[1500px] flex-col gap-2 px-6 py-3.5 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-10 xl:px-12">
          <div className="flex flex-wrap items-center gap-2.5">
            <p className="text-[10px] text-white/60">© 2026 RoadLenz Intelligent Mobility</p>
            <span className="h-3 w-px bg-white/15" />
            <p className="text-[10px] text-white/48">Powered by Bigfox Engineering Private Limited</p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <Link href="/privacy-policy" className="text-[10px] text-white/48 transition hover:text-white">Privacy Policy</Link>
            <span className="h-3 w-px bg-white/15" />
            <Link href="/terms" className="text-[10px] text-white/48 transition hover:text-white">Terms & Conditions</Link>
            <span className="h-3 w-px bg-white/15" />
            <Link href="/contact" className="text-[10px] text-white/48 transition hover:text-white">Support</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return <div><FooterTitle>{title}</FooterTitle><div className="mt-4 space-y-2">{children}</div></div>;
}

function FooterTitle({ children }: { children: React.ReactNode }) {
  return <div><h3 className="text-[14px] font-semibold uppercase leading-tight tracking-[-0.01em] text-white/90">{children}</h3><div className="mt-2 h-px w-7 rounded-full bg-[#43bdd5]" /></div>;
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return <Link href={href} className="group flex w-fit items-center gap-1.5 text-[11px] font-normal leading-5 text-white/62 transition-all duration-200 hover:translate-x-0.5 hover:text-white"><span className="h-[3px] w-[3px] shrink-0 rounded-full bg-[#4fc2d8] opacity-0 transition-opacity group-hover:opacity-100" />{children}</Link>;
}

function SocialLink({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return <motion.a href={href} target="_blank" rel="noreferrer" aria-label={label} whileHover={{ y: -2 }} className="flex h-8 w-8 items-center justify-center rounded-[9px] border border-white/[0.12] bg-white/[0.035] text-white/60 transition-all duration-200 hover:border-[#45bfd7]/35 hover:bg-[#0c779f]/15 hover:text-white">{children}</motion.a>;
}

function SoftwareIcon() { return <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4"><rect x="4" y="5" width="16" height="14" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="m8 15 3-3 2 2 3-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>; }
function LocationIcon() { return <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4"><path d="M12 21s6-5.2 6-11a6 6 0 1 0-12 0c0 5.8 6 11 6 11Z" stroke="currentColor" strokeWidth="1.55"/><circle cx="12" cy="10" r="2" stroke="currentColor" strokeWidth="1.55"/></svg>; }
function PhoneIcon() { return <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4"><path d="M7 3h3l1.5 4-2 1.5a15 15 0 0 0 6 6l1.5-2L21 14v3c0 2.2-1.8 4-4 4C9.3 21 3 14.7 3 7a4 4 0 0 1 4-4Z" stroke="currentColor" strokeWidth="1.55" strokeLinecap="round" strokeLinejoin="round"/></svg>; }
function MailIcon() { return <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4"><path d="M4 6h16v12H4V6Zm0 1 8 6 8-6" stroke="currentColor" strokeWidth="1.55" strokeLinejoin="round"/></svg>; }
function YouTubeIcon() { return <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4"><rect x="3" y="6" width="18" height="12" rx="4" stroke="currentColor" strokeWidth="1.5"/><path d="m10 9 5 3-5 3V9Z" fill="currentColor"/></svg>; }
function InstagramIcon() { return <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4"><rect x="4" y="4" width="16" height="16" rx="5" stroke="currentColor" strokeWidth="1.5"/><circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="1.5"/><circle cx="17.2" cy="6.9" r=".9" fill="currentColor"/></svg>; }
function FacebookIcon() { return <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4"><path d="M13.8 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.5 1.6-1.5H17V3.9c-.3 0-1.4-.1-2.6-.1-2.6 0-4.4 1.6-4.4 4.6V10H7v3h3v8h3.8Z"/></svg>; }
function LinkedInIcon() { return <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4"><path d="M6.5 8.2H3.2V21h3.3V8.2ZM4.8 3A1.9 1.9 0 1 0 4.8 6.8 1.9 1.9 0 0 0 4.8 3ZM21 13.7c0-3.9-2.1-5.8-4.9-5.8-2.3 0-3.3 1.2-3.8 2V8.2H9V21h3.3v-6.3c0-1.7.3-3.4 2.5-3.4 2.2 0 2.2 2 2.2 3.5V21H20v-7.3Z"/></svg>; }
