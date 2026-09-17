"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { Icon } from "./ui";

export default function LoginForm({
  intent,
  title,
  sub,
  demoEmail,
  demoPassword,
  successHref,
}: {
  intent: "admin" | "customer";
  title: string;
  sub: string;
  demoEmail?: string;
  demoPassword?: string;
  successHref: string;
}) {
  const router = useRouter();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [state, setState] =
    useState<{
      status:
        | "idle"
        | "loading"
        | "error";
      error?: string;
    }>({
      status: "idle",
    });

  const reduce =
    useReducedMotion();

  const onSubmit =
    async (
      e: React.FormEvent,
    ) => {
      e.preventDefault();

      setState({
        status: "loading",
      });

      try {
        const res =
          await fetch(
            "/api/auth/login",
            {
              method:
                "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body:
                JSON.stringify({
                  email,
                  password,
                  intent,
                }),
            },
          );

        const body =
          await res
            .json()
            .catch(
              () => ({}),
            );

        if (!res.ok) {
          throw new Error(
            body.error ??
              "Sign-in failed.",
          );
        }

        router.push(
          successHref,
        );

        router.refresh();
      } catch (err) {
        setState({
          status:
            "error",

          error:
            err instanceof
              Error
              ? err.message
              : "Sign-in failed.",
        });
      }
    };

  return (
    <motion.div
      initial={
        reduce
          ? false
          : {
              opacity: 0,
              y: 20,
            }
      }
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.5,
      }}
      className="w-full max-w-md"
    >
      <div className="rounded-3xl border border-line bg-white p-7 shadow-lift sm:p-8">
        <h1 className="font-display text-2xl font-extrabold text-ink">
          {title}
        </h1>

        <p className="mt-2 text-sm leading-relaxed text-ink-muted">
          {sub}
        </p>

        <form
          onSubmit={
            onSubmit
          }
          className="mt-6 space-y-4"
        >
          <label className="block">
            <span className="field-label">
              Email
            </span>

            <input
              type="email"
              required
              autoComplete="email"
              value={
                email
              }
              onChange={(
                e,
              ) =>
                setEmail(
                  e.target
                    .value,
                )
              }
              className="field"
              placeholder="you@company.in"
            />
          </label>

          <label className="block">
            <span className="field-label">
              Password
            </span>

            <input
              type="password"
              required
              autoComplete="current-password"
              value={
                password
              }
              onChange={(
                e,
              ) =>
                setPassword(
                  e.target
                    .value,
                )
              }
              className="field"
              placeholder="••••••••"
            />
          </label>

          {state.status ===
            "error" && (
            <p className="flex items-start gap-2 rounded-xl bg-accent-soft px-4 py-3 text-sm font-semibold text-accent">
              <Icon
                name="alert"
                className="mt-0.5 h-4 w-4 shrink-0"
              />

              {state.error}
            </p>
          )}

          <button
            type="submit"
            disabled={
              state.status ===
              "loading"
            }
            className="btn-primary w-full justify-center disabled:opacity-60"
          >
            {state.status ===
            "loading"
              ? "Signing in…"
              : "Sign In"}

            <Icon
              name="arrowRight"
              className="h-4 w-4"
            />
          </button>
        </form>
      </div>

      {demoEmail &&
      demoPassword ? (
        <div className="mt-4 rounded-2xl border border-dashed border-brand-300 bg-brand-50 p-4">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-brand-700">
            Demo credentials
          </p>

          <p className="mt-1.5 text-[13px] font-semibold text-ink-soft">
            {demoEmail} ·{" "}
            {demoPassword}
          </p>

          <button
            type="button"
            onClick={() => {
              setEmail(
                demoEmail,
              );

              setPassword(
                demoPassword,
              );
            }}
            className="mt-2 text-xs font-bold text-brand-700 underline underline-offset-2 hover:text-brand-800"
          >
            Fill demo
            credentials
          </button>
        </div>
      ) : null}
    </motion.div>
  );
}