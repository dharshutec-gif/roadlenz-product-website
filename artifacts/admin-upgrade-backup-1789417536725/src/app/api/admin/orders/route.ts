import { NextRequest } from "next/server";

import {
  jsonErr,
  jsonOk,
  requireRole,
} from "@/lib/api";

import {
  mutateDb,
  newId,
  readDb,
} from "@/lib/db";

import type {
  CustomerOrder,
  CustomerOrderItem,
} from "@/lib/types";

/* =========================================================
   ORDER NUMBER
========================================================= */

function orderNumber(
  id: string,
) {
  const date =
    new Date()
      .toISOString()
      .slice(0, 10)
      .replaceAll("-", "");

  return `RL-${date}-${id
    .slice(-6)
    .toUpperCase()}`;
}

/* =========================================================
   CUSTOMER LOOKUP
========================================================= */

function customerRows() {
  const db =
    readDb();

  return db.users
    .filter(
      (user) =>
        user.role ===
        "customer",
    )
    .map(
      (user) => ({
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
          user.company,

        email:
          db.customers[
            user.id
          ]?.email ||
          user.email,
      }),
    );
}

/* =========================================================
   GET ALL ORDERS

   ADMIN ONLY
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

  const customers =
    customerRows();

  const customerMap =
    new Map(
      customers.map(
        (customer) => [
          customer.id,
          customer,
        ],
      ),
    );

  /*
   * Orders are sorted latest first.
   */
  const orders =
    [...db.orders]
      .sort(
        (a, b) =>
          b.createdAt.localeCompare(
            a.createdAt,
          ),
      )
      .map(
        (order) => ({
          ...order,

          customer:
            customerMap.get(
              order.customerUserId,
            ) ?? null,
        }),
      );

  /*
   * Only real published products are returned
   * for Admin order creation.
   *
   * No sample product list.
   */
  const products =
    db.products
      .filter(
        (product) =>
          product.published,
      )
      .sort(
        (a, b) =>
          a.order -
          b.order,
      )
      .map(
        (product) => ({
          slug:
            product.slug,

          name:
            product.name,

          image:
            product.image,

          price:
            product.price,

          sku:
            product.sku ??
            "",

          stockQuantity:
            product.stockQuantity,

          stockStatus:
            product.stockStatus,
        }),
      );

  return jsonOk({
    orders,
    customers,
    products,
  });
}

/* =========================================================
   CREATE ORDER

   ADMIN ONLY

   Admin can create a real customer order using:
   - existing customer
   - existing product
   - quantity
   - unit price
   - GST
   - shipping
========================================================= */

export async function POST(
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

  const customerUserId =
    String(
      body.customerUserId ??
        "",
    ).trim();

  const rawItems =
    Array.isArray(
      body.items,
    )
      ? body.items
      : [];

  const shipping =
    Number(
      body.shipping ??
        0,
    );

  /* =======================================================
     BASIC VALIDATION
  ======================================================= */

  if (!customerUserId) {
    return jsonErr(
      400,
      "Select a customer.",
    );
  }

  if (
    !rawItems.length
  ) {
    return jsonErr(
      400,
      "Add at least one product.",
    );
  }

  if (
    !Number.isFinite(
      shipping,
    ) ||
    shipping < 0
  ) {
    return jsonErr(
      400,
      "Shipping must be zero or greater.",
    );
  }

  const db =
    readDb();

  /* =======================================================
     VERIFY CUSTOMER
  ======================================================= */

  const customer =
    db.users.find(
      (user) =>
        user.id ===
          customerUserId &&
        user.role ===
          "customer",
    );

  if (
    !customer ||
    !db.customers[
      customerUserId
    ]
  ) {
    return jsonErr(
      404,
      "Customer not found.",
    );
  }

  /* =======================================================
     PRODUCT LOOKUP

     Uses products from database only.
  ======================================================= */

  const productMap =
    new Map(
      db.products.map(
        (product) => [
          product.slug,
          product,
        ],
      ),
    );

  const items:
    CustomerOrderItem[] =
      [];

  /* =======================================================
     VALIDATE ORDER ITEMS
  ======================================================= */

  for (
    const raw
    of rawItems
  ) {
    const productSlug =
      String(
        raw?.productSlug ??
          "",
      ).trim();

    const quantity =
      Number(
        raw?.quantity ??
          0,
      );

    const unitAmount =
      Number(
        raw?.unitAmount ??
          0,
      );

    const gstRate =
      Number(
        raw?.gstRate ??
          0,
      );

    const product =
      productMap.get(
        productSlug,
      );

    if (!product) {
      return jsonErr(
        400,
        `Unknown product: ${
          productSlug ||
          "(blank)"
        }.`,
      );
    }

    if (
      !Number.isInteger(
        quantity,
      ) ||
      quantity <= 0
    ) {
      return jsonErr(
        400,
        "Product quantity must be a positive whole number.",
      );
    }

    if (
      !Number.isFinite(
        unitAmount,
      ) ||
      unitAmount < 0
    ) {
      return jsonErr(
        400,
        "Unit amount must be zero or greater.",
      );
    }

    if (
      !Number.isFinite(
        gstRate,
      ) ||
      gstRate < 0 ||
      gstRate > 100
    ) {
      return jsonErr(
        400,
        "GST rate must be between 0 and 100.",
      );
    }

    items.push({
      productSlug,

      name:
        product.name,

      image:
        product.image ||
        undefined,

      quantity,

      unitAmount,

      gstRate,
    });
  }

  /* =======================================================
     ORDER CALCULATION
  ======================================================= */

  const subtotal =
    items.reduce(
      (
        sum,
        item,
      ) =>
        sum +
        item.quantity *
          item.unitAmount,
      0,
    );

  const gst =
    items.reduce(
      (
        sum,
        item,
      ) =>
        sum +
        item.quantity *
          item.unitAmount *
          ((item.gstRate ??
            0) /
            100),
      0,
    );

  const id =
    newId(
      "order",
    );

  const now =
    new Date()
      .toISOString();

  /* =======================================================
     CREATE REAL ORDER RECORD
  ======================================================= */

  const order:
    CustomerOrder = {
      id,

      orderNumber:
        orderNumber(id),

      customerUserId,

      createdAt:
        now,

      updatedAt:
        now,

      status:
        "pending",

      paymentStatus:
        "pending",

      currency:
        "INR",

      items,

      subtotal,

      gst,

      shipping,

      total:
        subtotal +
        gst +
        shipping,

      shippingAddress:
        String(
          body.shippingAddress ??
            "",
        ).trim() ||
        undefined,

      notes:
        String(
          body.notes ??
            "",
        ).trim() ||
        undefined,
    };

  /* =======================================================
     SAVE TO DATABASE
  ======================================================= */

  mutateDb(
    (next) => {
      next.orders.push(
        order,
      );
    },
  );

  return jsonOk(
    {
      order,
    },
    {
      status: 201,
    },
  );
}