import "server-only";

import {
  hashPassword,
  verifyPassword,
} from "@/lib/auth";

import {
  mutateDb,
  newId,
  readDb,
} from "@/lib/db";

export type PrimaryAdminPublicConfig = {
  username: string;
  email: string;
  name: string;
};

type PrimaryAdminConfig =
  PrimaryAdminPublicConfig & {
    password: string;
  };

function getPrimaryAdminConfig(): PrimaryAdminConfig {
  const username =
    process.env
      .ROADLENZ_SUPERADMIN_USERNAME
      ?.trim()
      .toLowerCase() ||
    "superadmin";

  const email =
    process.env
      .ROADLENZ_SUPERADMIN_EMAIL
      ?.trim()
      .toLowerCase() ||
    "superadmin@roadlenz.local";

  const name =
    process.env
      .ROADLENZ_SUPERADMIN_NAME
      ?.trim() ||
    "RoadLenz Super Admin";

  const password =
    process.env
      .ROADLENZ_SUPERADMIN_PASSWORD ??
    "";

  if (username.length < 3) {
    throw new Error(
      "ROADLENZ_SUPERADMIN_USERNAME must contain at least 3 characters.",
    );
  }

  if (!email.includes("@")) {
    throw new Error(
      "ROADLENZ_SUPERADMIN_EMAIL must contain a valid email address.",
    );
  }

  if (password.length < 8) {
    throw new Error(
      "ROADLENZ_SUPERADMIN_PASSWORD must contain at least 8 characters.",
    );
  }

  return {
    username,
    email,
    name,
    password,
  };
}

function passwordMatches(
  password: string,
  passwordHash: string,
): boolean {
  try {
    return verifyPassword(
      password,
      passwordHash,
    );
  } catch {
    return false;
  }
}

/**
 * Creates the fixed primary administrator if it does not exist.
 *
 * If the account already exists, the role/name/password are kept in
 * sync with the values stored in .env.local.
 *
 * This uses the EXISTING RoadLenz db.json authentication architecture.
 */
export function ensurePrimaryAdmin(): PrimaryAdminPublicConfig {
  const config =
    getPrimaryAdminConfig();

  const db =
    readDb();

  const current =
    db.users.find(
      (user) =>
        user.email
          .trim()
          .toLowerCase() ===
        config.email,
    );

  const alreadySynced =
    current?.role === "admin" &&
    current.name ===
      config.name &&
    passwordMatches(
      config.password,
      current.passwordHash,
    );

  if (!alreadySynced) {
    mutateDb((next) => {
      const existing =
        next.users.find(
          (user) =>
            user.email
              .trim()
              .toLowerCase() ===
            config.email,
        );

      if (existing) {
        existing.name =
          config.name;

        existing.role =
          "admin";

        existing.company =
          existing.company ||
          "RoadLenz Intelligent Mobility";

        if (
          !passwordMatches(
            config.password,
            existing.passwordHash,
          )
        ) {
          existing.passwordHash =
            hashPassword(
              config.password,
            );
        }

        return;
      }

      next.users.push({
        id: newId("user"),

        email:
          config.email,

        passwordHash:
          hashPassword(
            config.password,
          ),

        name:
          config.name,

        company:
          "RoadLenz Intelligent Mobility",

        phone: "",

        role:
          "admin",

        createdAt:
          new Date().toISOString(),
      });
    });
  }

  return {
    username:
      config.username,

    email:
      config.email,

    name:
      config.name,
  };
}

/**
 * The fixed environment-based admin is treated as the primary
 * Super Admin. Other admin accounts remain normal administrators.
 */
export function isPrimaryAdminEmail(
  email: string,
): boolean {
  const configuredEmail =
    process.env
      .ROADLENZ_SUPERADMIN_EMAIL
      ?.trim()
      .toLowerCase() ||
    "superadmin@roadlenz.local";

  return (
    email
      .trim()
      .toLowerCase() ===
    configuredEmail
  );
}