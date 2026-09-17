import { NextRequest } from "next/server";

import {
  requireRole,
  jsonErr,
  jsonOk,
} from "@/lib/api";

import {
  mutateDb,
  newId,
} from "@/lib/db";

import type {
  CustomerAddress,
} from "@/lib/types";

/* =========================================================
   CLEAN / VALIDATE CUSTOMER ADDRESS
========================================================= */

function cleanAddress(
  input: unknown,
  index: number,
): CustomerAddress | null {
  if (
    !input ||
    typeof input !==
      "object"
  ) {
    return null;
  }

  const row =
    input as Record<
      string,
      unknown
    >;

  const fullName =
    String(
      row.fullName ??
        "",
    ).trim();

  const phone =
    String(
      row.phone ??
        "",
    ).trim();

  const line1 =
    String(
      row.line1 ??
        "",
    ).trim();

  const city =
    String(
      row.city ??
        "",
    ).trim();

  const state =
    String(
      row.state ??
        "",
    ).trim();

  const postalCode =
    String(
      row.postalCode ??
        "",
    ).trim();

  const country =
    String(
      row.country ??
        "",
    ).trim();

  if (
    !fullName ||
    !phone ||
    !line1 ||
    !city ||
    !state ||
    !postalCode ||
    !country
  ) {
    return null;
  }

  return {
    id:
      String(
        row.id ??
          "",
      ).trim() ||
      newId(
        `addr${index + 1}`,
      ),

    label:
      String(
        row.label ??
          "Address",
      ).trim() ||
      "Address",

    fullName,

    phone,

    line1,

    line2:
      String(
        row.line2 ??
          "",
      ).trim() ||
      undefined,

    city,

    state,

    postalCode,

    country,

    isDefault:
      Boolean(
        row.isDefault,
      ),
  };
}

/* =========================================================
   UPDATE CUSTOMER PROFILE

   CUSTOMER ONLY

   Updates:
   - Name
   - Company
   - Phone
   - Saved addresses

   Email is intentionally not changed here.
========================================================= */

export async function PATCH(
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

  if (!body) {
    return jsonErr(
      400,
      "Invalid request body.",
    );
  }

  const name =
    String(
      body.name ??
        "",
    ).trim();

  const company =
    String(
      body.company ??
        "",
    ).trim();

  const phone =
    String(
      body.phone ??
        "",
    ).trim();

  if (!name) {
    return jsonErr(
      400,
      "Name is required.",
    );
  }

  /* =======================================================
     ADDRESS VALIDATION
  ======================================================= */

  let addresses:
    CustomerAddress[] |
    undefined;

  if (
    body.addresses !==
    undefined
  ) {
    if (
      !Array.isArray(
        body.addresses,
      )
    ) {
      return jsonErr(
        400,
        "Addresses must be a list.",
      );
    }

    const parsed:
      (
        | CustomerAddress
        | null
      )[] =
        body.addresses.map(
          (
            item: unknown,
            index: number,
          ) =>
            cleanAddress(
              item,
              index,
            ),
        );

    if (
      parsed.some(
        (item) =>
          !item,
      )
    ) {
      return jsonErr(
        400,
        "Complete all required address fields.",
      );
    }

    addresses =
      parsed as CustomerAddress[];

    /*
     * Allow only one default address.
     */
    const defaultIndex =
      addresses.findIndex(
        (address) =>
          address.isDefault,
      );

    if (
      defaultIndex >= 0
    ) {
      addresses =
        addresses.map(
          (
            address,
            index,
          ) => ({
            ...address,

            isDefault:
              index ===
              defaultIndex,
          }),
        );
    }
  }

  /* =======================================================
     UPDATE SAME CUSTOMER RECORD USED BY PORTAL + ADMIN
  ======================================================= */

  const profile =
    mutateDb(
      (db) => {
        const current =
          db.customers[
            auth.session
              .userId
          ];

        const user =
          db.users.find(
            (item) =>
              item.id ===
              auth.session
                .userId,
          );

        if (
          !current ||
          !user
        ) {
          return null;
        }

        current.name =
          name;

        current.company =
          company;

        current.phone =
          phone;

        if (
          addresses
        ) {
          current.addresses =
            addresses;
        }

        /*
         * Keep login user record synchronized
         * with customer profile.
         */
        user.name =
          name;

        user.company =
          company;

        user.phone =
          phone;

        return current;
      },
    );

  if (!profile) {
    return jsonErr(
      404,
      "Customer profile not found.",
    );
  }

  return jsonOk({
    profile,
  });
}