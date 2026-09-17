import { NextRequest } from "next/server";

import {
  jsonOk,
  requireRole,
} from "@/lib/api";

import { readDb } from "@/lib/db";

/* =========================================================
   CUSTOMER ORDERS

   IMPORTANT:
   - Customer authentication required
   - Returns only the logged-in customer's orders
   - No demo/sample orders
   - Reads directly from current database
========================================================= */

export async function GET(
  req: NextRequest,
) {
  /* =======================================================
     AUTHENTICATION
  ======================================================= */

  const auth =
    requireRole(
      req,
      "customer",
    );

  if (!auth.ok) {
    return auth.res;
  }

  const db =
    readDb();

  const userId =
    auth.session.userId;

  /* =======================================================
     CUSTOMER'S ORDERS ONLY
  ======================================================= */

  const orders =
    db.orders
      .filter(
        (order) =>
          order.customerUserId ===
          userId,
      )
      .sort(
        (a, b) =>
          b.createdAt.localeCompare(
            a.createdAt,
          ),
      );

  /* =======================================================
     REAL ORDER COUNTS
  ======================================================= */

  const counts = {
    total:
      orders.length,

    pending:
      orders.filter(
        (order) =>
          order.status ===
          "pending",
      ).length,

    confirmed:
      orders.filter(
        (order) =>
          order.status ===
          "confirmed",
      ).length,

    processing:
      orders.filter(
        (order) =>
          order.status ===
          "processing",
      ).length,

    shipped:
      orders.filter(
        (order) =>
          order.status ===
          "shipped",
      ).length,

    delivered:
      orders.filter(
        (order) =>
          order.status ===
          "delivered",
      ).length,

    cancelled:
      orders.filter(
        (order) =>
          order.status ===
          "cancelled",
      ).length,
  };

  /* =======================================================
     REAL ORDER VALUE
  ======================================================= */

  const totalOrderValue =
    orders
      .filter(
        (order) =>
          order.status !==
          "cancelled",
      )
      .reduce(
        (
          sum,
          order,
        ) =>
          sum +
          order.total,
        0,
      );

  /* =======================================================
     ACTIVE ORDERS

     Used by Amazon / Flipkart style
     "Track your orders" account section.
  ======================================================= */

  const activeOrders =
    orders.filter(
      (order) =>
        ![
          "delivered",
          "cancelled",
        ].includes(
          order.status,
        ),
    );

  /* =======================================================
     COMPLETED ORDERS
  ======================================================= */

  const completedOrders =
    orders.filter(
      (order) =>
        order.status ===
        "delivered",
    );

  /* =======================================================
     RESPONSE
  ======================================================= */

  return jsonOk({
    orders,

    activeOrders,

    completedOrders,

    counts,

    totalOrderValue,
  });
}