import "server-only";

import {
  redirect,
} from "next/navigation";

import {
  getCurrentSession,
} from "@/lib/auth";

import {
  isPrimaryAdminEmail,
} from "@/lib/admin-primary";

export type CurrentAdmin = {
  id: string;

  name: string;

  email: string;

  role:
    | "ADMIN"
    | "SUPER_ADMIN";

  active: true;

  lastLoginAt: null;
};

/**
 * Compatibility layer for admin pages.
 *
 * RoadLenz already has one session system in src/lib/auth.ts.
 * We therefore do NOT create a second admin authentication system.
 */
export async function getCurrentAdmin(): Promise<CurrentAdmin | null> {
  const session =
    await getCurrentSession();

  if (
    !session ||
    session.role !== "admin"
  ) {
    return null;
  }

  return {
    id:
      session.userId,

    name:
      session.name,

    email:
      session.email,

    role:
      isPrimaryAdminEmail(
        session.email,
      )
        ? "SUPER_ADMIN"
        : "ADMIN",

    active:
      true,

    lastLoginAt:
      null,
  };
}

export async function getAdminSession(): Promise<CurrentAdmin | null> {
  return getCurrentAdmin();
}

export async function requireAdmin(): Promise<CurrentAdmin> {
  const admin =
    await getCurrentAdmin();

  if (!admin) {
    redirect(
      "/admin/login",
    );
  }

  return admin;
}

export async function requireSuperAdmin(): Promise<CurrentAdmin> {
  const admin =
    await requireAdmin();

  if (
    admin.role !==
    "SUPER_ADMIN"
  ) {
    redirect(
      "/admin",
    );
  }

  return admin;
}