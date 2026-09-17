"use client";

import React, { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Logo } from "@/components/ui";

type Mode = "signin" | "signup";
type SubmitState = {
  status: "idle" | "loading" | "error";
  message?: string;
};

const SUPPORT_PHONE = "9841600444";
const SUPPORT_TEL = "+919841600444";

function Glyph({
  name,
  className = "",
}: {
  name: "pin" | "shield" | "chart" | "users" | "mail" | "lock" | "eye" | "eyeOff" | "phone" | "arrow" | "check" | "truck" | "clock" | "globe" | "headset";
  className?: string;
}) {
  const common = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
    "aria-hidden": true,
  };

  if (name === "pin") return <svg {...common}><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.4"/></svg>;
  if (name === "shield") return <svg {...common}><path d="M12 3 5 6v5c0 4.6 2.9 8.1 7 10 4.1-1.9 7-5.4 7-10V6z"/><path d="m9 12 2 2 4-5"/></svg>;
  if (name === "chart") return <svg {...common}><path d="M4 20V11M10 20V5M16 20v-8M22 20H2"/></svg>;
  if (name === "users") return <svg {...common}><circle cx="9" cy="8" r="3.5"/><path d="M2.5 20v-1.5a6.5 6.5 0 0 1 13 0V20M16 5.5a3.5 3.5 0 0 1 0 6.5M18 15a5 5 0 0 1 3.5 5"/></svg>;
  if (name === "mail") return <svg {...common}><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/></svg>;
  if (name === "lock") return <svg {...common}><rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>;
  if (name === "eye") return <svg {...common}><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z"/><circle cx="12" cy="12" r="2.5"/></svg>;
  if (name === "eyeOff") return <svg {...common}><path d="m3 3 18 18M10.7 6.2A11 11 0 0 1 12 6c6.5 0 10 6 10 6a18 18 0 0 1-2.2 2.9M6.2 6.2C3.5 8 2 12 2 12s3.5 6 10 6a10 10 0 0 0 4.2-.9"/><path d="M9.8 9.8a3 3 0 0 0 4.4 4.4"/></svg>;
  if (name === "phone") return <svg {...common}><path d="M7 3H4a1 1 0 0 0-1 1c0 9.4 7.6 17 17 17a1 1 0 0 0 1-1v-3l-4-2-2 2c-4-1.7-6.3-4-8-8l2-2z"/></svg>;
  if (name === "arrow") return <svg {...common}><path d="M5 12h14M13 6l6 6-6 6"/></svg>;
  if (name === "check") return <svg {...common}><path d="m5 12 4 4L19 6"/></svg>;
  if (name === "truck") return <svg {...common}><path d="M3 7h11v9H3zM14 10h4l3 3v3h-7z"/><circle cx="7" cy="18" r="2"/><circle cx="18" cy="18" r="2"/></svg>;
  if (name === "clock") return <svg {...common}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>;
  if (name === "globe") return <svg {...common}><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></svg>;
  return <svg {...common}><path d="M4 13v-1a8 8 0 0 1 16 0v1M4 13h3v6H5a1 1 0 0 1-1-1zM20 13h-3v6h2a1 1 0 0 0 1-1zM17 19c-1 2-3 2-5 2"/></svg>;
}

const featureItems = [
  { icon: "pin" as const, title: "Track", text: "Live fleet visibility" },
  { icon: "shield" as const, title: "Protect", text: "Safer operations" },
  { icon: "chart" as const, title: "Optimize", text: "Better decisions" },
];

export default function CustomerPortalAuth() {
  const router = useRouter();
  const reduce = useReducedMotion();
  const [mode, setMode] = useState<Mode>("signin");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [state, setState] = useState<SubmitState>({ status: "idle" });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [signup, setSignup] = useState({
    name: "",
    company: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const changeMode = (next: Mode) => {
    setMode(next);
    setState({ status: "idle" });
    setShowPassword(false);
  };

  const signIn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setState({ status: "loading" });

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          password,
          intent: "customer",
          remember,
        }),
      });

      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(body.error ?? "Sign in failed.");

      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      setState({
        status: "error",
        message: error instanceof Error ? error.message : "Sign in failed.",
      });
    }
  };

  const createAccount = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (signup.password !== signup.confirmPassword) {
      setState({ status: "error", message: "Passwords do not match." });
      return;
    }

    setState({ status: "loading" });

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: signup.name,
          company: signup.company,
          phone: signup.phone,
          email: signup.email,
          password: signup.password,
        }),
      });

      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(body.error ?? "Account creation failed.");

      const loginResponse = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: signup.email.trim(),
          password: signup.password,
          intent: "customer",
          remember: true,
        }),
      });

      const loginBody = await loginResponse.json().catch(() => ({}));
      if (!loginResponse.ok) {
        throw new Error(loginBody.error ?? "Account created, but automatic sign in failed.");
      }

      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      setState({
        status: "error",
        message: error instanceof Error ? error.message : "Account creation failed.",
      });
    }
  };

  return (
    <section className="fixed inset-0 z-[150] overflow-y-auto bg-[#edf6fc] text-[#0b315b]">
      <div className="grid min-h-[100svh] lg:grid-cols-[1.08fr_.92fr]">
        <aside className="relative hidden min-h-[100svh] overflow-hidden bg-[#061d33] lg:block">
          <video
            className="absolute inset-0 h-full w-full object-cover object-center"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster="/media/hero/hero-2.jpg"
          >
            <source src="/home-assets/hero-video.mp4" type="video/mp4" />
          </video>

          <div className="absolute inset-0 bg-[linear-gradient(100deg,rgba(3,21,40,.94)_0%,rgba(4,31,56,.74)_54%,rgba(5,40,66,.32)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_58%,rgba(54,205,255,.14),transparent_30%)]" />
          <div className="absolute inset-x-0 bottom-0 h-[38%] bg-[linear-gradient(180deg,transparent,rgba(3,23,41,.78))]" />

          <div className="relative z-10 flex min-h-[100svh] flex-col px-10 py-8 xl:px-14 xl:py-10">
            <Link href="/" aria-label="RoadLenz Home" className="w-max">
              <Logo dark />
            </Link>

            <motion.div
              initial={reduce ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              className="my-auto max-w-[560px] py-10"
            >
              <p className="text-[9px] font-extrabold uppercase tracking-[0.30em] text-cyan-200">
                Connected fleet intelligence
              </p>

              <h1 className="mt-4 text-[clamp(34px,3.6vw,54px)] font-black italic leading-[0.98] tracking-[-0.048em] text-white">
                Smarter Fleets.
                <span className="mt-1 block bg-gradient-to-r from-[#5bdcff] to-[#18b8ee] bg-clip-text text-transparent">
                  Safer Journeys.
                </span>
              </h1>

              <div className="mt-5 h-[3px] w-14 rounded-full bg-cyan-300" />

              <p className="mt-5 max-w-[520px] text-[14px] leading-6 text-white/80 xl:text-[15px]">
                Real-time tracking, AI-powered safety and connected fleet intelligence — built to keep every journey visible and every operation moving.
              </p>
            </motion.div>

            <div className="pb-4">
              <div className="grid grid-cols-3 overflow-hidden rounded-[18px] border border-white/12 bg-[#041d33]/66 backdrop-blur-md">
                {featureItems.map((item, index) => (
                  <div
                    key={item.title}
                    className={`flex items-center gap-3 px-4 py-4 ${index ? "border-l border-white/12" : ""}`}
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-300/10 text-cyan-200">
                      <Glyph name={item.icon} className="h-5 w-5" />
                    </span>
                    <div>
                      <strong className="block text-[12px] font-extrabold text-white">{item.title}</strong>
                      <span className="mt-1 block text-[9px] leading-4 text-white/62">{item.text}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex items-center gap-3 text-[9px] font-bold uppercase tracking-[0.20em] text-white/55">
                <span className="h-px w-10 bg-cyan-300" />
                Drive Smart. Record Every Mile.
              </div>
            </div>
          </div>
        </aside>

        <main className="relative flex min-h-[100svh] flex-col overflow-hidden bg-[linear-gradient(145deg,#f8fcff_0%,#edf7ff_48%,#ffffff_100%)] px-5 py-6 sm:px-8 lg:px-10 xl:px-14">
          <div className="pointer-events-none absolute -right-36 -top-40 h-[430px] w-[430px] rounded-full bg-cyan-200/25 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-44 -left-44 h-[420px] w-[420px] rounded-full bg-blue-200/20 blur-3xl" />

          <div className="relative z-10 flex items-center justify-between gap-4 text-[11px] font-semibold text-[#173b62]">
            <Link href="/" className="inline-flex items-center gap-2 transition hover:text-[#006bff]">
              <span aria-hidden="true">←</span> Back to Website
            </Link>
            <a href={`tel:${SUPPORT_TEL}`} className="inline-flex items-center gap-2 transition hover:text-[#006bff]">
              <Glyph name="phone" className="h-4 w-4 text-[#006bff]" />
              <span className="hidden sm:inline">Need help?</span>
              <strong>{SUPPORT_PHONE}</strong>
            </a>
          </div>

          <div className="relative z-10 my-auto mx-auto w-full max-w-[570px] py-6">
            <div className="mb-6 lg:hidden">
              <Logo />
            </div>

            <motion.div
              initial={reduce ? false : { opacity: 0, y: 20, scale: 0.99 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-[26px] border border-white/85 bg-white/94 p-6 shadow-[0_30px_80px_rgba(27,86,128,0.12)] backdrop-blur-xl sm:p-7 lg:p-8"
            >
              <p className="text-[9px] font-bold uppercase tracking-[0.19em] text-[#7890a6]">
                Secure Customer Access
              </p>

              <h2 className="mt-2 font-['Inter',sans-serif] text-[clamp(24px,2.3vw,32px)] font-semibold leading-[1.12] tracking-[-0.025em] text-[#123d63]">
                Welcome to{" "}
                <span className="bg-gradient-to-r from-[#087ff4] to-[#20b9e8] bg-clip-text font-bold text-transparent">
                  RoadLenz
                </span>
              </h2>
              <p className="mt-3 max-w-[520px] text-[13px] leading-5 text-[#647f98]">
                Sign in to manage your orders, quotations, fleet solutions and RoadLenz support.
              </p>

              <div className="mt-6 grid grid-cols-2 rounded-[16px] border border-[#cfe2f1] bg-[#f4f9fd] p-1">
                {(["signin", "signup"] as Mode[]).map((item) => {
                  const active = mode === item;
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => changeMode(item)}
                      className={`relative min-h-[48px] rounded-[13px] text-[13px] font-extrabold transition ${active ? "text-white" : "text-[#173b62] hover:text-[#006bff]"}`}
                    >
                      {active && (
                        <motion.span
                          layoutId="customer-auth-tab"
                          className="absolute inset-0 rounded-[13px] bg-[linear-gradient(135deg,#087ff4,#006bff_52%,#17b9e8)] shadow-[0_8px_22px_rgba(0,107,255,.20)]"
                        />
                      )}
                      <span className="relative z-10">{item === "signin" ? "Sign In" : "Create Account"}</span>
                    </button>
                  );
                })}
              </div>

              <AnimatePresence mode="wait" initial={false}>
                {mode === "signin" ? (
                  <motion.form
                    key="signin"
                    initial={reduce ? false : { opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={reduce ? undefined : { opacity: 0, x: 12 }}
                    transition={{ duration: 0.22 }}
                    onSubmit={signIn}
                    className="mt-6 space-y-4"
                  >
                    <Field label="Email Address" icon="mail">
                      <input
                        type="email"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="Enter your email address"
                        className="w-full bg-transparent text-[13px] text-[#173b62] outline-none placeholder:text-[#879bad]"
                      />
                    </Field>

                    <Field label="Password" icon="lock">
                      <input
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        required
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        placeholder="Enter your password"
                        className="w-full bg-transparent text-[13px] text-[#173b62] outline-none placeholder:text-[#879bad]"
                      />
                      <button type="button" onClick={() => setShowPassword((value) => !value)} className="text-[#244e70] hover:text-[#006bff]" aria-label={showPassword ? "Hide password" : "Show password"}>
                        <Glyph name={showPassword ? "eyeOff" : "eye"} className="h-5 w-5" />
                      </button>
                    </Field>

                    <div className="flex items-center justify-between gap-4 text-[11px]">
                      <label className="inline-flex cursor-pointer items-center gap-2 font-semibold text-[#42627d]">
                        <input type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} className="h-4 w-4 rounded accent-[#087ff4]" />
                        Remember me
                      </label>
                      <Link href="/contact" className="font-bold text-[#006bff] hover:underline">Forgot Password?</Link>
                    </div>

                    <FormError state={state} />

                    <button disabled={state.status === "loading"} className="group flex min-h-[52px] w-full items-center justify-center gap-3 rounded-[15px] bg-[linear-gradient(135deg,#087ff4,#006bff_48%,#16b7e7)] text-[13px] font-extrabold text-white shadow-[0_14px_30px_rgba(0,107,255,.22)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_36px_rgba(0,107,255,.30)] disabled:cursor-wait disabled:opacity-65">
                      {state.status === "loading" ? "Signing In…" : "Sign In"}
                      {state.status !== "loading" && <Glyph name="arrow" className="h-4 w-4 transition-transform group-hover:translate-x-1" />}
                    </button>

                    <p className="pt-1 text-center text-[12px] text-[#516f88]">New to RoadLenz? <button type="button" onClick={() => changeMode("signup")} className="font-extrabold text-[#006bff] hover:underline">Create an Account</button></p>
                  </motion.form>
                ) : (
                  <motion.form
                    key="signup"
                    initial={reduce ? false : { opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={reduce ? undefined : { opacity: 0, x: -12 }}
                    transition={{ duration: 0.22 }}
                    onSubmit={createAccount}
                    className="mt-6"
                  >
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field label="Full Name" icon="users"><input required autoComplete="name" value={signup.name} onChange={(e) => setSignup({ ...signup, name: e.target.value })} placeholder="Your full name" className="w-full bg-transparent text-[13px] outline-none placeholder:text-[#879bad]" /></Field>
                      <Field label="Company / Organization" icon="globe"><input autoComplete="organization" value={signup.company} onChange={(e) => setSignup({ ...signup, company: e.target.value })} placeholder="Company name" className="w-full bg-transparent text-[13px] outline-none placeholder:text-[#879bad]" /></Field>
                      <Field label="Phone Number" icon="phone"><input required autoComplete="tel" value={signup.phone} onChange={(e) => setSignup({ ...signup, phone: e.target.value })} placeholder="Phone number" className="w-full bg-transparent text-[13px] outline-none placeholder:text-[#879bad]" /></Field>
                      <Field label="Email Address" icon="mail"><input required type="email" autoComplete="email" value={signup.email} onChange={(e) => setSignup({ ...signup, email: e.target.value })} placeholder="Email address" className="w-full bg-transparent text-[13px] outline-none placeholder:text-[#879bad]" /></Field>
                      <Field label="Password" icon="lock"><input required minLength={8} type={showPassword ? "text" : "password"} autoComplete="new-password" value={signup.password} onChange={(e) => setSignup({ ...signup, password: e.target.value })} placeholder="Minimum 8 characters" className="w-full bg-transparent text-[13px] outline-none placeholder:text-[#879bad]" /></Field>
                      <Field label="Confirm Password" icon="lock"><input required minLength={8} type={showPassword ? "text" : "password"} autoComplete="new-password" value={signup.confirmPassword} onChange={(e) => setSignup({ ...signup, confirmPassword: e.target.value })} placeholder="Repeat password" className="w-full bg-transparent text-[13px] outline-none placeholder:text-[#879bad]" /><button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Hide passwords" : "Show passwords"} className="text-[#244e70] hover:text-[#006bff]"><Glyph name={showPassword ? "eyeOff" : "eye"} className="h-5 w-5"/></button></Field>
                    </div>

                    <p className="mt-3 flex items-start gap-2 text-[10px] leading-4 text-[#6f879c]"><Glyph name="check" className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600"/> Your account becomes active immediately and is securely linked to your RoadLenz customer profile.</p>

                    <FormError state={state} />

                    <button disabled={state.status === "loading"} className="group mt-5 flex min-h-[52px] w-full items-center justify-center gap-3 rounded-[15px] bg-[linear-gradient(135deg,#087ff4,#006bff_48%,#16b7e7)] text-[13px] font-extrabold text-white shadow-[0_14px_30px_rgba(0,107,255,.22)] transition hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-65">
                      {state.status === "loading" ? "Creating Account…" : "Create Account"}
                      {state.status !== "loading" && <Glyph name="arrow" className="h-4 w-4 transition-transform group-hover:translate-x-1"/>}
                    </button>

                    <p className="mt-4 text-center text-[12px] text-[#516f88]">Already have an account? <button type="button" onClick={() => changeMode("signin")} className="font-extrabold text-[#006bff] hover:underline">Sign In</button></p>
                  </motion.form>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pb-1 text-[9px] text-[#70869a]">
            <span>© 2026 RoadLenz. Powered by Bigfox Engineering Pvt. Ltd.</span>
            <span className="flex gap-4"><Link href="/privacy">Privacy Policy</Link><Link href="/terms">Terms of Service</Link><Link href="/contact">Support</Link></span>
          </div>
        </main>
      </div>
    </section>
  );
}

function Field({ label, icon, children }: { label: string; icon: Parameters<typeof Glyph>[0]["name"]; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-[11px] font-extrabold text-[#173b62]">{label}</span>
      <span className="flex min-h-[50px] items-center gap-3 rounded-[14px] border border-[#cedfec] bg-white px-4 shadow-[inset_0_1px_0_rgba(255,255,255,.8)] transition focus-within:border-[#62b9f3] focus-within:ring-4 focus-within:ring-[#0a8df3]/[0.07]">
        <Glyph name={icon} className="h-[18px] w-[18px] shrink-0 text-[#315a79]" />
        {children}
      </span>
    </label>
  );
}

function FormError({ state }: { state: SubmitState }) {
  if (state.status !== "error") return null;
  return <p role="alert" className="rounded-[12px] border border-red-200 bg-red-50 px-4 py-3 text-[11px] font-semibold text-red-700">{state.message}</p>;
}

