import type {
  Metadata,
} from "next";

import Link from "next/link";

import {
  redirect,
} from "next/navigation";

import {
  ShieldCheck,
} from "lucide-react";

import AdminLoginForm from "@/components/admin/AdminLoginForm";

import {
  getCurrentSession,
} from "@/lib/auth";

import {
  ensurePrimaryAdmin,
} from "@/lib/admin-primary";

export const dynamic =
  "force-dynamic";

export const metadata: Metadata =
  {
    title:
      "Admin Login | RoadLenz",

    description:
      "Secure RoadLenz administration access.",
  };

export default async function AdminLoginPage() {
  const session =
    await getCurrentSession();

  /*
   * Already logged in as admin.
   */
  if (
    session?.role ===
    "admin"
  ) {
    redirect(
      "/admin",
    );
  }

  /*
   * A customer should stay in
   * the customer environment.
   */
  if (
    session?.role ===
    "customer"
  ) {
    redirect(
      "/dashboard",
    );
  }

  /*
   * Create / synchronize the
   * fixed primary admin account.
   */
  const primaryAdmin =
    ensurePrimaryAdmin();

  return (
    <main
      className="
        relative
        min-h-[100svh]
        overflow-hidden
        bg-[#020817]
        text-white
      "
    >
      {/* BACKGROUND */}

      <div
        aria-hidden="true"
        className="
          absolute
          inset-0
          bg-[radial-gradient(circle_at_16%_24%,rgba(0,107,255,.18),transparent_32%),radial-gradient(circle_at_82%_72%,rgba(27,191,232,.12),transparent_31%)]
        "
      />

      <div
        aria-hidden="true"
        className="
          absolute
          inset-0
          opacity-[.035]
          [background-image:linear-gradient(rgba(96,165,250,.5)_1px,transparent_1px),linear-gradient(90deg,rgba(96,165,250,.5)_1px,transparent_1px)]
          [background-size:52px_52px]
        "
      />

      <div
        className="
          relative
          z-10
          mx-auto
          grid
          min-h-[100svh]
          w-full
          max-w-[1500px]
          lg:grid-cols-[1.05fr_.95fr]
        "
      >
        {/* ================================================
            LEFT SIDE
        ================================================= */}

        <section
          className="
            relative
            hidden
            overflow-hidden
            lg:block
          "
        >
          <div
            aria-hidden="true"
            className="
              absolute
              inset-0
              bg-[linear-gradient(115deg,rgba(3,19,37,.98),rgba(5,38,68,.77)_58%,rgba(6,55,84,.58))]
            "
          />

          <div
            aria-hidden="true"
            className="
              absolute
              inset-0
              bg-[radial-gradient(circle_at_72%_54%,rgba(36,196,244,.17),transparent_28%)]
            "
          />

          <div
            className="
              relative
              flex
              min-h-[100svh]
              flex-col
              justify-between
              px-12
              py-10
              xl:px-16
              xl:py-12
            "
          >
            <Link
              href="/"
              className="w-max"
              aria-label="Back to RoadLenz website"
            >
              <div className="flex items-center gap-3">
                <div
                  className="
                    grid
                    h-11
                    w-11
                    place-items-center
                    rounded-xl
                    bg-[linear-gradient(135deg,#087ff4,#006bff)]
                    text-lg
                    font-black
                    shadow-[0_12px_32px_rgba(0,107,255,.28)]
                  "
                >
                  R
                </div>

                <div>
                  <div
                    className="
                      text-[21px]
                      font-extrabold
                      tracking-[-.035em]
                    "
                  >
                    Road
                    <span className="text-[#168df2]">
                      Lenz
                    </span>
                  </div>

                  <div
                    className="
                      mt-0.5
                      text-[7px]
                      font-bold
                      uppercase
                      tracking-[.25em]
                      text-slate-400
                    "
                  >
                    Administration
                    Console
                  </div>
                </div>
              </div>
            </Link>

            <div className="max-w-[520px] pb-16">
              <p
                className="
                  text-[9px]
                  font-extrabold
                  uppercase
                  tracking-[.24em]
                  text-cyan-300
                "
              >
                Secure RoadLenz
                Administration
              </p>

              <h1
                className="
                  mt-4
                  text-[clamp(34px,3.5vw,52px)]
                  font-semibold
                  leading-[1.03]
                  tracking-[-.045em]
                "
              >
                Control the operation.

                <span className="mt-1 block text-[#61d8ff]">
                  Protect the access.
                </span>
              </h1>

              <p
                className="
                  mt-5
                  max-w-[460px]
                  text-[13px]
                  leading-6
                  text-slate-300
                "
              >
                Manage RoadLenz
                products, customers,
                requests, resources and
                fleet-business activity
                from one protected
                workspace.
              </p>
            </div>

            <p
              className="
                text-[8px]
                uppercase
                tracking-[.14em]
                text-slate-600
              "
            >
              RoadLenz · Intelligent
              Mobility · Powered by
              Bigfox Engineering
            </p>
          </div>
        </section>

        {/* ================================================
            RIGHT LOGIN
        ================================================= */}

        <section
          className="
            flex
            min-h-[100svh]
            items-center
            justify-center
            bg-[#f5f9fd]
            px-5
            py-10
            text-[#0b315b]
            sm:px-9
            lg:px-12
          "
        >
          <div className="w-full max-w-[465px]">
            <div className="mb-7 lg:hidden">
              <Link
                href="/"
                className="text-lg font-extrabold text-[#0b315b]"
              >
                Road
                <span className="text-[#168df2]">
                  Lenz
                </span>
              </Link>
            </div>

            <div
              className="
                rounded-[26px]
                border
                border-[#dce8f1]
                bg-white
                p-6
                shadow-[0_28px_70px_rgba(17,69,105,.13)]
                sm:p-8
              "
            >
              <div
                className="
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-xl
                  bg-[#eaf7ff]
                  text-[#087ff4]
                "
              >
                <ShieldCheck
                  size={
                    20
                  }
                />
              </div>

              <p
                className="
                  mt-5
                  text-[9px]
                  font-extrabold
                  uppercase
                  tracking-[.20em]
                  text-[#7890a6]
                "
              >
                Administrator Access
              </p>

              <h2
                className="
                  mt-2
                  text-[28px]
                  font-semibold
                  leading-[1.08]
                  tracking-[-.035em]
                  text-[#123d63]
                "
              >
                Sign in to RoadLenz Admin
              </h2>

              <p
                className="
                  mt-3
                  text-[12px]
                  leading-5
                  text-[#6e8498]
                "
              >
                Use the fixed admin
                username or the email
                address of an authorised
                administrator.
              </p>

              <AdminLoginForm
                primaryUsername={
                  primaryAdmin.username
                }
                primaryEmail={
                  primaryAdmin.email
                }
              />

              <div
                className="
                  mt-6
                  border-t
                  border-[#e4edf4]
                  pt-5
                  text-[10px]
                  leading-5
                  text-[#7c90a2]
                "
              >
                Primary Admin credentials
                remain server-side. The
                fixed account is created
                in the same RoadLenz user
                database used by the
                existing authentication
                API.
              </div>
            </div>

            <div
              className="
                mt-5
                flex
                items-center
                justify-between
                gap-4
                text-[9px]
                text-[#8193a3]
              "
            >
              <Link
                href="/"
                className="
                  font-bold
                  text-[#326a92]
                  hover:text-[#006bff]
                "
              >
                ← Back to Website
              </Link>

              <span>
                Secure Admin Portal
              </span>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}