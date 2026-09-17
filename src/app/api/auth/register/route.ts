import { NextRequest } from "next/server";
import { recordAdminActivity } from "@/lib/admin-store";

import {
  hashPassword,
} from "@/lib/auth";

import {
  mutateDb,
  newId,
  readDb,
} from "@/lib/db";

import {
  jsonErr,
  jsonOk,
} from "@/lib/api";

import type {
  AppUser,
  CustomerProfile,
} from "@/lib/types";

const EMAIL_PATTERN =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clean(
  value: unknown,
) {
  return String(
    value ?? "",
  ).trim();
}

export async function POST(
  req: NextRequest,
) {
  const body =
    await req
      .json()
      .catch(
        () =>
          null,
      );

  if (
    !body
  ) {
    return jsonErr(
      400,
      "Invalid request body.",
    );
  }

  const name =
    clean(
      body.name,
    );

  const company =
    clean(
      body.company,
    );

  const phone =
    clean(
      body.phone,
    );

  const email =
    clean(
      body.email,
    ).toLowerCase();

  const password =
    String(
      body.password ??
        "",
    );

  if (
    name.length <
    2
  ) {
    return jsonErr(
      400,
      "Enter your full name.",
    );
  }

  if (
    !phone
  ) {
    return jsonErr(
      400,
      "Enter your phone number.",
    );
  }

  if (
    !EMAIL_PATTERN.test(
      email,
    )
  ) {
    return jsonErr(
      400,
      "Enter a valid email address.",
    );
  }

  if (
    password.length <
    8
  ) {
    return jsonErr(
      400,
      "Password must be at least 8 characters.",
    );
  }

  const current =
    readDb();

  const duplicate =
    current.users.some(
      (
        user,
      ) =>
        user.email.toLowerCase() ===
        email,
    );

  if (
    duplicate
  ) {
    return jsonErr(
      409,
      "An account is already registered with this email.",
    );
  }

  const now =
    new Date();

  const createdAt =
    now.toISOString();

  const userId =
    newId(
      "user",
    );

  const user:
    AppUser = {
      id:
        userId,

      email,

      passwordHash:
        hashPassword(
          password,
        ),

      name,

      company,

      phone,

      role:
        "customer",

      createdAt,
    };

  const profile:
    CustomerProfile = {
      userId,

      name,

      company,

      email,

      phone,

      plan:
        "",

      memberSince:
        new Intl.DateTimeFormat(
          "en-IN",
          {
            month:
              "long",

            year:
              "numeric",
          },
        ).format(
          now,
        ),

      registeredProducts:
        [],

      savedProductSlugs:
        [],

      quotes:
        [],

      tickets:
        [],

      installations:
        [],

      warranties:
        [],

      notifications:
        [],

      addresses:
        [],

      fleetPlatformUrl:
        "",
    };

  const created = mutateDb(
    (
      db,
    ) => {
      const exists =
        db.users.some(
          (
            item,
          ) =>
            item.email.toLowerCase() ===
            email,
        );

      if (
        exists
      ) {
        return false;
      }

      db.users.push(
        user,
      );

      db.customers[
        userId
      ] =
        profile;
      recordAdminActivity(db, { userId, name }, "customer-register", "customers", userId, "Customer registered an account.");
      return true;
    },
  );

  if (!created) return jsonErr(409, "An account is already registered with this email.");
  return jsonOk(
    {
      ok:
        true,

      customer: {
        id:
          userId,

        name,

        company,

        phone,

        email,

        createdAt,
      },
    },
    {
      status:
        201,
    },
  );
}