"use server";

import bcrypt from "bcryptjs";

import { redirect } from "next/navigation";

import {
  clearAdminSession,
  createAdminSession,
} from "@/lib/admin-auth";

import {
  ensurePrimarySuperAdmin,
  isPrimaryAdminIdentifier,
  resolveAdminEmail,
} from "@/lib/admin-primary";

import {
  prisma,
} from "@/lib/prisma";

export type AdminLoginState = {
  success: boolean;

  message: string;

  errors: {
    identifier?: string;
    email?: string;
    password?: string;
  };
};

export const initialAdminLoginState: AdminLoginState =
  {
    success: false,
    message: "",
    errors: {},
  };

/*
 * =========================================================
 * LOGIN
 * =========================================================
 */

export async function loginAdmin(
  _previousState:
    AdminLoginState,

  formData:
    FormData,
): Promise<AdminLoginState> {
  const identifier =
    String(
      formData.get(
        "identifier",
      ) ??
        formData.get(
          "email",
        ) ??
        "",
    )
      .trim()
      .toLowerCase();

  const password =
    String(
      formData.get(
        "password",
      ) ?? "",
    );

  const errors: AdminLoginState["errors"] =
    {};

  /*
   * VALIDATION
   */

  if (!identifier) {
    errors.identifier =
      "Enter your administrator username or email.";
  }

  if (!password) {
    errors.password =
      "Enter your password.";
  }

  if (
    Object.keys(
      errors,
    ).length > 0
  ) {
    return {
      success: false,

      message:
        "Enter your administrator credentials.",

      errors,
    };
  }

  try {
    /*
     * FIXED PRIMARY
     * SUPER ADMIN
     */

    if (
      isPrimaryAdminIdentifier(
        identifier,
      )
    ) {
      await ensurePrimarySuperAdmin();
    }

    /*
     * USERNAME -> EMAIL
     */

    const email =
      resolveAdminEmail(
        identifier,
      );

    /*
     * ADMIN DATABASE
     */

    const admin =
      await prisma.adminUser.findUnique({
        where: {
          email,
        },

        select: {
          id:
            true,

          passwordHash:
            true,

          active:
            true,
        },
      });

    if (
      !admin ||
      !admin.active
    ) {
      return invalidCredentials();
    }

    /*
     * PASSWORD VERIFY
     */

    const validPassword =
      await bcrypt.compare(
        password,
        admin.passwordHash,
      );

    if (!validPassword) {
      return invalidCredentials();
    }

    /*
     * LAST LOGIN
     */

    await prisma.adminUser.update({
      where: {
        id:
          admin.id,
      },

      data: {
        lastLoginAt:
          new Date(),
      },
    });

    /*
     * SESSION
     */

    await createAdminSession(
      admin.id,
    );
  } catch (
    error
  ) {
    console.error(
      "RoadLenz admin login failed:",
      error,
    );

    return {
      success: false,

      message:
        error instanceof
        Error
          ? error.message
          : "The admin portal could not complete sign in.",

      errors: {},
    };
  }

  /*
   * SUCCESS
   */

  redirect(
    "/admin",
  );
}

/*
 * =========================================================
 * LOGOUT
 * =========================================================
 */

export async function logoutAdmin() {
  await clearAdminSession();

  redirect(
    "/admin/login",
  );
}

/*
 * =========================================================
 * INVALID LOGIN
 * =========================================================
 */

function invalidCredentials(): AdminLoginState {
  return {
    success: false,

    message:
      "The administrator username/email or password is incorrect.",

    errors: {},
  };
}