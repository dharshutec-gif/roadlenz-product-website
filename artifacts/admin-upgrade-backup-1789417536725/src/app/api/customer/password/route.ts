import { NextRequest } from "next/server";

import {
  requireRole,
  jsonErr,
  jsonOk,
} from "@/lib/api";

import {
  hashPassword,
  verifyPassword,
} from "@/lib/auth";

import {
  mutateDb,
  readDb,
} from "@/lib/db";

export async function POST(
  req: NextRequest,
) {
  const auth =
    requireRole(
      req,
      "customer",
    );

  if (!auth.ok) {
    return auth.res;
  }

  const body =
    await req
      .json()
      .catch(
        () => null,
      );

  const currentPassword =
    String(
      body?.currentPassword ??
        "",
    );

  const newPassword =
    String(
      body?.newPassword ??
        "",
    );

  if (
    !currentPassword ||
    newPassword.length <
      8
  ) {
    return jsonErr(
      400,
      "Enter your current password and a new password of at least 8 characters.",
    );
  }

  const user =
    readDb().users.find(
      (item) =>
        item.id ===
        auth.session.userId,
    );

  if (!user) {
    return jsonErr(
      404,
      "Account not found.",
    );
  }

  if (
    !verifyPassword(
      currentPassword,
      user.passwordHash,
    )
  ) {
    return jsonErr(
      400,
      "Current password is incorrect.",
    );
  }

  mutateDb(
    (db) => {
      const target =
        db.users.find(
          (item) =>
            item.id ===
            auth.session
              .userId,
        );

      if (target) {
        target.passwordHash =
          hashPassword(
            newPassword,
          );
      }
    },
  );

  return jsonOk({
    ok: true,
  });
}