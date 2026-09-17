import { NextRequest } from "next/server";

import {
  jsonErr,
  jsonOk,
  requireRole,
} from "@/lib/api";

import {
  mutateDb,
  readDb,
} from "@/lib/db";

import type {
  CustomerOrderStatus,
  CustomerPaymentStatus,
} from "@/lib/types";

const ORDER_STATUSES:
  CustomerOrderStatus[] = [
    "pending",
    "confirmed",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
  ];

const PAYMENT_STATUSES:
  CustomerPaymentStatus[] = [
    "pending",
    "paid",
    "failed",
    "refunded",
  ];

/* =========================================================
   GET SINGLE ORDER
========================================================= */

export async function GET(
  req: NextRequest,
  ctx: {
    params: Promise<{
      id: string;
    }>;
  },
) {
  const auth =
    requireRole(
      req,
      "admin",
    );

  if (!auth.ok) {
    return auth.res;
  }

  const { id } =
    await ctx.params;

  const db =
    readDb();

  const order =
    db.orders.find(
      (item) =>
        item.id === id,
    );

  if (!order) {
    return jsonErr(
      404,
      "Order not found.",
    );
  }

  return jsonOk({
    order,
  });
}

/* =========================================================
   UPDATE ORDER

   ADMIN ONLY

   Supports:
   - order status
   - payment status
   - tracking number
   - courier
   - expected delivery
   - shipping address
   - notes
========================================================= */

export async function PATCH(
  req: NextRequest,
  ctx: {
    params: Promise<{
      id: string;
    }>;
  },
) {
  const auth =
    requireRole(
      req,
      "admin",
    );

  if (!auth.ok) {
    return auth.res;
  }

  const { id } =
    await ctx.params;

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

  /* =======================================================
     VALIDATE ORDER STATUS
  ======================================================= */

  if (
    body.status !==
      undefined &&
    !ORDER_STATUSES.includes(
      body.status,
    )
  ) {
    return jsonErr(
      400,
      "Invalid order status.",
    );
  }

  /* =======================================================
     VALIDATE PAYMENT STATUS
  ======================================================= */

  if (
    body.paymentStatus !==
      undefined &&
    !PAYMENT_STATUSES.includes(
      body.paymentStatus,
    )
  ) {
    return jsonErr(
      400,
      "Invalid payment status.",
    );
  }

  /* =======================================================
     UPDATE DATABASE
  ======================================================= */

  const result =
    mutateDb(
      (db) => {
        const order =
          db.orders.find(
            (item) =>
              item.id ===
              id,
          );

        if (!order) {
          return null;
        }

        /* Order status */

        if (
          body.status !==
          undefined
        ) {
          order.status =
            body.status;
        }

        /* Payment status */

        if (
          body.paymentStatus !==
          undefined
        ) {
          order.paymentStatus =
            body.paymentStatus;
        }

        /* Shipping / tracking fields */

        for (const key of [
          "trackingNumber",
          "courier",
          "expectedDelivery",
          "shippingAddress",
          "notes",
        ] as const) {
          if (
            body[key] !==
            undefined
          ) {
            const value =
              String(
                body[key] ??
                  "",
              ).trim();

            order[key] =
              value ||
              undefined;
          }
        }

        /* Delivered timestamp */

        if (
          body.status ===
            "delivered" &&
          !order.deliveredAt
        ) {
          order.deliveredAt =
            new Date()
              .toISOString();
        }

        /*
         * If Admin changes an order away from
         * delivered, clear deliveredAt.
         */
        if (
          body.status !==
            undefined &&
          body.status !==
            "delivered"
        ) {
          order.deliveredAt =
            undefined;
        }

        order.updatedAt =
          new Date()
            .toISOString();

        return order;
      },
    );

  if (!result) {
    return jsonErr(
      404,
      "Order not found.",
    );
  }

  return jsonOk({
    order: result,
  });
}