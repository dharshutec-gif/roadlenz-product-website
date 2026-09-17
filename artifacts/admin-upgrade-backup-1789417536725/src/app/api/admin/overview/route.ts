import {
  NextRequest,
} from "next/server";

import {
  requireRole,
  jsonOk,
} from "@/lib/api";

import {
  listEntity,
  publishedOf,
  readDb,
} from "@/lib/db";

export async function GET(
  req:
    NextRequest,
) {
  const auth =
    requireRole(
      req,
      "admin",
    );

  if (
    !auth.ok
  ) {
    return auth.res;
  }

  const db =
    readDb();

  const customerUsers =
    db.users.filter(
      (
        user,
      ) =>
        user.role ===
        "customer",
    );

  const openRequests =
    db.quotes.filter(
      (
        item,
      ) =>
        item.status ===
        "new",
    ).length +
    db.demos.filter(
      (
        item,
      ) =>
        item.status ===
        "new",
    ).length +
    db.messages.filter(
      (
        item,
      ) =>
        item.status ===
        "new",
    ).length +
    Object.values(
      db.customers,
    ).reduce(
      (
        sum,
        profile,
      ) =>
        sum +
        profile.quotes.filter(
          (
            quote,
          ) =>
            quote.status ===
            "pending",
        ).length,

      0,
    );

  const counts = {
    products:
      db.products.length,

    publishedProducts:
      db.products.filter(
        (
          product,
        ) =>
          product.published,
      ).length,

    customers:
      customerUsers.length,

    orders:
      db.orders.length,

    requests:
      openRequests,

    industries:
      db.industries.length,

    heroSlides:
      db.heroSlides.length,

    resources:
      db.resources.length,

    locations:
      db.locations.length,

    caseStudies:
      db.caseStudies.length,

    customerLogos:
      db.customerLogos.length,
  };

  const orderValue =
    db.orders
      .filter(
        (
          order,
        ) =>
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

  const customerMap =
    new Map(
      customerUsers.map(
        (
          user,
        ) => [
          user.id,
          db.customers[
            user.id
          ],
        ],
      ),
    );

  const recentCustomers =
    [
      ...customerUsers,
    ]
      .sort(
        (
          a,
          b,
        ) =>
          b.createdAt.localeCompare(
            a.createdAt,
          ),
      )
      .slice(
        0,
        5,
      )
      .map(
        (
          user,
        ) => ({
          id:
            user.id,

          name:
            db.customers[
              user.id
            ]?.name ||
            user.name,

          company:
            db.customers[
              user.id
            ]?.company ||
            user.company ||
            "",

          email:
            db.customers[
              user.id
            ]?.email ||
            user.email,

          createdAt:
            user.createdAt,
        }),
      );

  const recentOrders =
    [
      ...db.orders,
    ]
      .sort(
        (
          a,
          b,
        ) =>
          b.createdAt.localeCompare(
            a.createdAt,
          ),
      )
      .slice(
        0,
        6,
      )
      .map(
        (
          order,
        ) => ({
          id:
            order.id,

          orderNumber:
            order.orderNumber,

          customer:
            customerMap.get(
              order.customerUserId,
            )?.name ||
            "Customer",

          company:
            customerMap.get(
              order.customerUserId,
            )?.company ||
            "",

          total:
            order.total,

          status:
            order.status,

          paymentStatus:
            order.paymentStatus,

          createdAt:
            order.createdAt,
        }),
      );

  const stockAlerts =
    db.products
      .filter(
        (
          product,
        ) =>
          product.trackInventory,
      )
      .filter(
        (
          product,
        ) => {
          const quantity =
            product.stockQuantity ??
            0;

          const threshold =
            product.lowStockThreshold ??
            0;

          return (
            product.stockStatus ===
              "low-stock" ||
            product.stockStatus ===
              "out-of-stock" ||
            quantity <=
              threshold
          );
        },
      )
      .sort(
        (
          a,
          b,
        ) =>
          (a.stockQuantity ??
            0) -
          (b.stockQuantity ??
            0),
      )
      .slice(
        0,
        6,
      )
      .map(
        (
          product,
        ) => ({
          id:
            product.id,

          name:
            product.name,

          sku:
            product.sku ??
            "",

          quantity:
            product.stockQuantity ??
            0,

          status:
            product.stockStatus ??
            "in-stock",
        }),
      );

  const fmt = (
    date:
      string,
  ) =>
    date.slice(
      0,
      10,
    );

  const recent =
    [
      ...db.quotes.map(
        (
          quote,
        ) => ({
          kind:
            "quote",

          text:
            `Quote — ${
              quote.company ||
              quote.name
            }`,

          at:
            fmt(
              quote.createdAt,
            ),

          ref:
            quote.ref,
        }),
      ),

      ...db.demos.map(
        (
          demo,
        ) => ({
          kind:
            "demo",

          text:
            `Demo — ${
              demo.company ||
              demo.name
            }`,

          at:
            fmt(
              demo.createdAt,
            ),

          ref:
            demo.ref,
        }),
      ),

      ...db.messages.map(
        (
          message,
        ) => ({
          kind:
            "message",

          text:
            `Message — ${message.name}`,

          at:
            fmt(
              message.createdAt,
            ),

          ref:
            message.ref,
        }),
      ),
    ]
      .sort(
        (
          a,
          b,
        ) =>
          a.at <
          b.at
            ? 1
            : -1,
      )
      .slice(
        0,
        8,
      );

  return jsonOk({
    counts,

    orderValue,

    newQuotes:
      db.quotes.filter(
        (
          quote,
        ) =>
          quote.status ===
          "new",
      ).length,

    newDemos:
      db.demos.filter(
        (
          demo,
        ) =>
          demo.status ===
          "new",
      ).length,

    newMessages:
      db.messages.filter(
        (
          message,
        ) =>
          message.status ===
          "new",
      ).length,

    pendingCustomerQuotes:
      Object.values(
        db.customers,
      ).reduce(
        (
          sum,
          profile,
        ) =>
          sum +
          profile.quotes.filter(
            (
              quote,
            ) =>
              quote.status ===
              "pending",
          ).length,

        0,
      ),

    recentOrders,

    recentCustomers,

    stockAlerts,

    recent,

    unapproved:
      publishedOf(
        listEntity(
          db,
          "caseStudies",
        ),
      ).filter(
        (
          caseStudy,
        ) =>
          !caseStudy.approved,
      ).length,
  });
}