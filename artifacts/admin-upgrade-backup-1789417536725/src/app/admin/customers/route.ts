import { NextRequest } from "next/server";

import {
  jsonErr,
  jsonOk,
  requireRole,
} from "@/lib/api";

import {
  readDb,
} from "@/lib/db";

/* =========================================================
   GET ALL CUSTOMERS

   ADMIN ONLY

   No hardcoded customer rows.
   Everything comes from:
   - db.users
   - db.customers
   - db.orders
   - customer quotations
========================================================= */

export async function GET(
  req: NextRequest,
) {
  const auth =
    requireRole(
      req,
      "admin",
    );

  if (!auth.ok) {
    return auth.res;
  }

  const db =
    readDb();

  /* =======================================================
     CUSTOMER USERS ONLY
  ======================================================= */

  const customerUsers =
    db.users.filter(
      (user) =>
        user.role ===
        "customer",
    );

  /* =======================================================
     BUILD CUSTOMER LIST
  ======================================================= */

  const customers =
    customerUsers
      .map(
        (user) => {
          const profile =
            db.customers[
              user.id
            ];

          const customerOrders =
            db.orders.filter(
              (order) =>
                order.customerUserId ===
                user.id,
            );

          const orderValue =
            customerOrders
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

          const pendingOrders =
            customerOrders.filter(
              (order) =>
                ![
                  "delivered",
                  "cancelled",
                ].includes(
                  order.status,
                ),
            ).length;

          const deliveredOrders =
            customerOrders.filter(
              (order) =>
                order.status ===
                "delivered",
            ).length;

          const quotes =
            profile?.quotes ??
            [];

          const pendingQuotes =
            quotes.filter(
              (quote) =>
                quote.status ===
                "pending",
            ).length;

          const tickets =
            profile?.tickets ??
            [];

          const openTickets =
            tickets.filter(
              (ticket) =>
                ticket.status !==
                "resolved",
            ).length;

          const notifications =
            profile?.notifications ??
            [];

          const unreadNotifications =
            notifications.filter(
              (notification) =>
                !notification.read,
            ).length;

          return {
            id:
              user.id,

            name:
              profile?.name ||
              user.name,

            company:
              profile?.company ||
              user.company,

            email:
              profile?.email ||
              user.email,

            phone:
              profile?.phone ||
              user.phone,

            plan:
              profile?.plan ||
              "",

            memberSince:
              profile?.memberSince ||
              user.createdAt,

            orderCount:
              customerOrders.length,

            pendingOrders,

            deliveredOrders,

            orderValue,

            quoteCount:
              quotes.length,

            pendingQuotes,

            ticketCount:
              tickets.length,

            openTickets,

            unreadNotifications,

            savedProducts:
              profile
                ?.savedProductSlugs
                ?.length ??
              0,

            registeredProducts:
              profile
                ?.registeredProducts
                ?.length ??
              0,

            addressCount:
              profile
                ?.addresses
                ?.length ??
              0,

            createdAt:
              user.createdAt,
          };
        },
      )
      .sort(
        (a, b) =>
          b.createdAt.localeCompare(
            a.createdAt,
          ),
      );

  /* =======================================================
     SUMMARY

     Real values only.
  ======================================================= */

  const summary = {
    totalCustomers:
      customers.length,

    customersWithOrders:
      customers.filter(
        (customer) =>
          customer.orderCount >
          0,
      ).length,

    customersWithOpenOrders:
      customers.filter(
        (customer) =>
          customer.pendingOrders >
          0,
      ).length,

    customersWithPendingQuotes:
      customers.filter(
        (customer) =>
          customer.pendingQuotes >
          0,
      ).length,

    totalOrderValue:
      customers.reduce(
        (
          sum,
          customer,
        ) =>
          sum +
          customer.orderValue,
        0,
      ),
  };

  return jsonOk({
    customers,
    summary,
  });
}