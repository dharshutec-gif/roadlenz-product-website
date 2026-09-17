"use client";

import type {
  FormEvent,
} from "react";

import {
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  Eye,
  EyeOff,
  LockKeyhole,
  ShieldCheck,
  UserRound,
} from "lucide-react";

type AdminLoginFormProps = {
  primaryUsername: string;
  primaryEmail: string;
};

type SubmitState =
  | {
      status:
        "idle";
    }
  | {
      status:
        "loading";
    }
  | {
      status:
        "error";
      message:
        string;
    };

export default function AdminLoginForm({
  primaryUsername,
  primaryEmail,
}: AdminLoginFormProps) {
  const router =
    useRouter();

  const [
    identifier,
    setIdentifier,
  ] =
    useState("");

  const [
    password,
    setPassword,
  ] =
    useState("");

  const [
    showPassword,
    setShowPassword,
  ] =
    useState(false);

  const [
    state,
    setState,
  ] =
    useState<SubmitState>({
      status:
        "idle",
    });

  async function onSubmit(
    event:
      FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setState({
      status:
        "loading",
    });

    const normalizedIdentifier =
      identifier
        .trim()
        .toLowerCase();

    /*
     * The fixed username is mapped to the primary admin email
     * because the existing RoadLenz authentication API uses email.
     *
     * Example:
     * superadmin
     *      ↓
     * superadmin@roadlenz.local
     */
    const email =
      normalizedIdentifier ===
      primaryUsername
        .trim()
        .toLowerCase()
        ? primaryEmail
            .trim()
            .toLowerCase()
        : normalizedIdentifier;

    try {
      const response =
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

                intent:
                  "admin",

                remember:
                  true,
              }),
          },
        );

      const body =
        await response
          .json()
          .catch(
            () => ({}),
          );

      if (!response.ok) {
        throw new Error(
          typeof body.error ===
            "string"
            ? body.error
            : "Administrator sign in failed.",
        );
      }

      router.push(
        "/admin",
      );

      router.refresh();
    } catch (
      error
    ) {
      setState({
        status:
          "error",

        message:
          error instanceof
          Error
            ? error.message
            : "Administrator sign in failed.",
      });
    }
  }

  const loading =
    state.status ===
    "loading";

  return (
    <form
      onSubmit={
        onSubmit
      }
      className="mt-7 space-y-4"
    >
      {/* ================================================
          USERNAME / EMAIL
      ================================================= */}

      <div>
        <label
          htmlFor="admin-identifier"
          className="text-[11px] font-bold text-[#173b62]"
        >
          Admin Username / Email
        </label>

        <div
          className="
            mt-2
            flex
            h-12
            items-center
            gap-3
            rounded-xl
            border
            border-[#d7e4ef]
            bg-white
            px-4
            transition
            focus-within:border-blue-400
            focus-within:ring-4
            focus-within:ring-blue-500/10
          "
        >
          <UserRound
            size={
              17
            }
            className="shrink-0 text-[#52708c]"
          />

          <input
            id="admin-identifier"
            name="identifier"
            type="text"
            autoComplete="username"
            required
            value={
              identifier
            }
            onChange={(
              event,
            ) =>
              setIdentifier(
                event
                  .target
                  .value,
              )
            }
            placeholder={`${primaryUsername} or admin email`}
            className="
              w-full
              bg-transparent
              text-[13px]
              text-[#0d3157]
              outline-none
              placeholder:text-[#91a1b0]
            "
          />
        </div>
      </div>

      {/* ================================================
          PASSWORD
      ================================================= */}

      <div>
        <label
          htmlFor="admin-password"
          className="text-[11px] font-bold text-[#173b62]"
        >
          Password
        </label>

        <div
          className="
            mt-2
            flex
            h-12
            items-center
            gap-3
            rounded-xl
            border
            border-[#d7e4ef]
            bg-white
            px-4
            transition
            focus-within:border-blue-400
            focus-within:ring-4
            focus-within:ring-blue-500/10
          "
        >
          <LockKeyhole
            size={
              17
            }
            className="shrink-0 text-[#52708c]"
          />

          <input
            id="admin-password"
            name="password"
            type={
              showPassword
                ? "text"
                : "password"
            }
            autoComplete="current-password"
            required
            value={
              password
            }
            onChange={(
              event,
            ) =>
              setPassword(
                event
                  .target
                  .value,
              )
            }
            placeholder="Enter administrator password"
            className="
              w-full
              bg-transparent
              text-[13px]
              text-[#0d3157]
              outline-none
              placeholder:text-[#91a1b0]
            "
          />

          <button
            type="button"
            onClick={() =>
              setShowPassword(
                (
                  value,
                ) =>
                  !value,
              )
            }
            className="
              grid
              h-8
              w-8
              shrink-0
              place-items-center
              rounded-lg
              text-[#52708c]
              transition
              hover:bg-blue-50
              hover:text-blue-600
            "
            aria-label={
              showPassword
                ? "Hide password"
                : "Show password"
            }
          >
            {showPassword ? (
              <EyeOff
                size={
                  16
                }
              />
            ) : (
              <Eye
                size={
                  16
                }
              />
            )}
          </button>
        </div>
      </div>

      {/* ================================================
          ERROR
      ================================================= */}

      {state.status ===
      "error" ? (
        <div
          role="alert"
          className="
            rounded-xl
            border
            border-red-200
            bg-red-50
            px-4
            py-3
            text-[11px]
            font-semibold
            leading-5
            text-red-700
          "
        >
          {
            state.message
          }
        </div>
      ) : null}

      {/* ================================================
          LOGIN
      ================================================= */}

      <button
        type="submit"
        disabled={
          loading
        }
        className="
          group
          flex
          h-[50px]
          w-full
          items-center
          justify-center
          gap-2.5
          rounded-xl
          bg-[linear-gradient(135deg,#087ff4,#006bff_52%,#16b7e7)]
          text-[12px]
          font-extrabold
          tracking-[0.04em]
          text-white
          shadow-[0_13px_28px_rgba(0,107,255,.24)]
          transition
          hover:-translate-y-0.5
          hover:shadow-[0_17px_34px_rgba(0,107,255,.3)]
          disabled:cursor-wait
          disabled:opacity-60
        "
      >
        <ShieldCheck
          size={
            17
          }
        />

        {loading
          ? "SIGNING IN…"
          : "SIGN IN TO ADMIN CONSOLE"}
      </button>
    </form>
  );
}