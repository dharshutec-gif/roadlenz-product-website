"use client";

import React, {
  useEffect,
  useState,
} from "react";

import {
  Icon,
} from "../ui";

interface OverviewData {
  counts: {
    products:
      number;

    publishedProducts:
      number;

    customers:
      number;

    orders:
      number;

    requests:
      number;
  };

  orderValue:
    number;

  newQuotes:
    number;

  newDemos:
    number;

  newMessages:
    number;

  pendingCustomerQuotes:
    number;

  recentCustomers: {
    id:
      string;

    name:
      string;

    company:
      string;

    email:
      string;

    createdAt:
      string;
  }[];

  recentOrders: {
    id:
      string;

    orderNumber:
      string;

    customer:
      string;

    company:
      string;

    total:
      number;

    status:
      string;

    paymentStatus:
      string;

    createdAt:
      string;
  }[];

  stockAlerts: {
    id:
      string;

    name:
      string;

    sku:
      string;

    quantity:
      number;

    status:
      string;
  }[];

  recent: {
    kind:
      string;

    text:
      string;

    at:
      string;

    ref:
      string;
  }[];
}

const money = (
  value:
    number,
) =>
  new Intl.NumberFormat(
    "en-IN",
    {
      style:
        "currency",

      currency:
        "INR",

      maximumFractionDigits:
        0,
    },
  ).format(
    value,
  );

const chip = (
  value:
    string,
) => {
  if (
    value ===
      "delivered" ||
    value ===
      "paid"
  ) {
    return "bg-emerald-50 text-emerald-700";
  }

  if (
    value ===
      "cancelled" ||
    value ===
      "failed" ||
    value ===
      "out-of-stock"
  ) {
    return "bg-red-50 text-red-700";
  }

  if (
    value ===
    "shipped"
  ) {
    return "bg-blue-50 text-blue-700";
  }

  return "bg-amber-50 text-amber-700";
};

export type OverviewSection =
  | "orders"
  | "customers"
  | "requests"
  | "products"
  | "resources";

export default function Overview({
  onGoAction,
}: {
  onGoAction: (
    section:
      OverviewSection,
  ) => void;
}) {
  const [
    data,
    setData,
  ] =
    useState<OverviewData | null>(
      null,
    );

  const [
    error,
    setError,
  ] =
    useState("");

  useEffect(() => {
    fetch(
      "/api/admin/overview",
      {
        cache:
          "no-store",
      },
    )
      .then(
        async (
          response,
        ) => {
          const body =
            await response.json();

          if (
            !response.ok
          ) {
            throw new Error(
              body.error ||
                "Could not load dashboard.",
            );
          }

          setData(
            body,
          );
        },
      )
      .catch(
        (
          reason,
        ) =>
          setError(
            reason instanceof
              Error
              ? reason.message
              : "Could not load dashboard.",
          ),
      );
  }, []);

  if (error) {
    return (
      <div
        className="
          rounded-2xl
          border
          border-red-200
          bg-red-50
          p-6
          text-sm
          font-semibold
          text-red-700
        "
      >
        {error}
      </div>
    );
  }

  if (!data) {
    return (
      <div
        className="
          rounded-2xl
          border
          border-slate-200
          bg-white
          p-10
          text-center
          text-sm
          font-semibold
          text-slate-500
        "
      >
        Loading live business data…
      </div>
    );
  }

  const metrics: {
    label:
      string;

    value:
      string;

    icon:
      string;

    go:
      OverviewSection;
  }[] = [
    {
      label:
        "Orders",

      value:
        data.counts.orders.toLocaleString(
          "en-IN",
        ),

      icon:
        "box",

      go:
        "orders",
    },

    {
      label:
        "Order value",

      value:
        money(
          data.orderValue,
        ),

      icon:
        "chart",

      go:
        "orders",
    },

    {
      label:
        "Customers",

      value:
        data.counts.customers.toLocaleString(
          "en-IN",
        ),

      icon:
        "users",

      go:
        "customers",
    },

    {
      label:
        "Pending requests",

      value:
        data.counts.requests.toLocaleString(
          "en-IN",
        ),

      icon:
        "mail",

      go:
        "requests",
    },
  ];

  return (
    <div className="space-y-6">
      {/* HEADER */}

      <div>
        <p
          className="
            text-xs
            font-bold
            uppercase
            tracking-[0.16em]
            text-slate-400
          "
        >
          Operations overview
        </p>

        <div
          className="
            mt-1
            flex
            flex-wrap
            items-end
            justify-between
            gap-3
          "
        >
          <div>
            <h2
              className="
                text-2xl
                font-extrabold
                tracking-tight
                text-slate-950
              "
            >
              Dashboard
            </h2>

            <p
              className="
                mt-1
                text-sm
                text-slate-500
              "
            >
              Live information from the
              RoadLenz database.
            </p>
          </div>

          <div
            className="
              rounded-xl
              border
              border-slate-200
              bg-white
              px-3
              py-2
              text-xs
              font-semibold
              text-slate-500
            "
          >
            {
              data.counts
                .publishedProducts
            }{" "}
            of{" "}
            {
              data.counts
                .products
            }{" "}
            products published
          </div>
        </div>
      </div>

      {/* METRICS */}

      <div
        className="
          grid
          gap-4
          sm:grid-cols-2
          xl:grid-cols-4
        "
      >
        {metrics.map(
          (
            metric,
          ) => (
            <button
              key={
                metric.label
              }
              type="button"
              onClick={() =>
                onGoAction(
                  metric.go,
                )
              }
              className="
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-5
                text-left
                shadow-sm
                transition
                hover:-translate-y-0.5
                hover:shadow-md
              "
            >
              <span
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-xl
                  bg-blue-50
                  text-blue-700
                "
              >
                <Icon
                  name={
                    metric.icon
                  }
                  className="h-5 w-5"
                />
              </span>

              <p
                className="
                  mt-4
                  text-2xl
                  font-black
                  tracking-tight
                  text-slate-950
                "
              >
                {
                  metric.value
                }
              </p>

              <p
                className="
                  mt-1
                  text-xs
                  font-bold
                  uppercase
                  tracking-wider
                  text-slate-400
                "
              >
                {
                  metric.label
                }
              </p>
            </button>
          ),
        )}
      </div>

      {/* RECENT CUSTOMERS */}

      <section
        className="
          rounded-2xl
          border
          border-slate-200
          bg-white
          p-5
          shadow-sm
        "
      >
        <div
          className="
            flex
            items-center
            justify-between
            gap-3
          "
        >
          <div>
            <h3 className="font-extrabold text-slate-950">
              Recent customer
              registrations
            </h3>

            <p className="text-xs text-slate-500">
              New Customer Portal
              accounts from the shared
              RoadLenz database
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              onGoAction(
                "customers",
              )
            }
            className="text-xs font-bold text-blue-700"
          >
            View customers →
          </button>
        </div>

        {data
          .recentCustomers
          .length ? (
          <div
            className="
              mt-4
              grid
              gap-3
              md:grid-cols-2
              xl:grid-cols-5
            "
          >
            {data.recentCustomers.map(
              (
                customer,
              ) => (
                <button
                  key={
                    customer.id
                  }
                  type="button"
                  onClick={() =>
                    onGoAction(
                      "customers",
                    )
                  }
                  className="
                    rounded-xl
                    border
                    border-slate-100
                    bg-slate-50
                    p-3
                    text-left
                    transition
                    hover:border-blue-200
                    hover:bg-blue-50
                  "
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className="
                        flex
                        h-9
                        w-9
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        bg-blue-100
                        text-sm
                        font-black
                        text-blue-700
                      "
                    >
                      {customer.name
                        .slice(
                          0,
                          1,
                        )
                        .toUpperCase()}
                    </span>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-slate-900">
                        {
                          customer.name
                        }
                      </p>

                      <p className="truncate text-[11px] text-slate-400">
                        {customer.company ||
                          customer.email}
                      </p>
                    </div>
                  </div>

                  <p
                    className="
                      mt-3
                      text-[10px]
                      font-semibold
                      uppercase
                      tracking-wide
                      text-slate-400
                    "
                  >
                    Registered{" "}
                    {new Date(
                      customer.createdAt,
                    ).toLocaleDateString(
                      "en-IN",
                      {
                        day:
                          "2-digit",

                        month:
                          "short",

                        year:
                          "numeric",
                      },
                    )}
                  </p>
                </button>
              ),
            )}
          </div>
        ) : (
          <div
            className="
              mt-4
              rounded-xl
              bg-slate-50
              p-5
              text-center
              text-sm
              text-slate-400
            "
          >
            New customer registrations
            will appear here
            automatically.
          </div>
        )}
      </section>

      {/* ORDERS + INVENTORY */}

      <div
        className="
          grid
          gap-6
          xl:grid-cols-[1.45fr_.75fr]
        "
      >
        <section
          className="
            overflow-hidden
            rounded-2xl
            border
            border-slate-200
            bg-white
            shadow-sm
          "
        >
          <div
            className="
              flex
              items-center
              justify-between
              border-b
              border-slate-100
              px-5
              py-4
            "
          >
            <div>
              <h3 className="font-extrabold text-slate-950">
                Recent orders
              </h3>

              <p className="text-xs text-slate-500">
                Latest customer orders
                and payment state
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                onGoAction(
                  "orders",
                )
              }
              className="text-xs font-bold text-blue-700"
            >
              View all →
            </button>
          </div>

          {data
            .recentOrders
            .length ? (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead
                  className="
                    bg-slate-50
                    text-[11px]
                    uppercase
                    tracking-wider
                    text-slate-400
                  "
                >
                  <tr>
                    <th className="px-5 py-3">
                      Order
                    </th>

                    <th className="px-4 py-3">
                      Customer
                    </th>

                    <th className="px-4 py-3">
                      Amount
                    </th>

                    <th className="px-4 py-3">
                      Status
                    </th>

                    <th className="px-5 py-3">
                      Payment
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {data.recentOrders.map(
                    (
                      order,
                    ) => (
                      <tr
                        key={
                          order.id
                        }
                        className="hover:bg-slate-50"
                      >
                        <td className="px-5 py-4 font-bold text-slate-900">
                          {
                            order.orderNumber
                          }

                          <div className="mt-1 text-[11px] font-medium text-slate-400">
                            {order.createdAt.slice(
                              0,
                              10,
                            )}
                          </div>
                        </td>

                        <td className="px-4 py-4 text-slate-700">
                          {
                            order.customer
                          }

                          <div className="text-[11px] text-slate-400">
                            {
                              order.company
                            }
                          </div>
                        </td>

                        <td className="px-4 py-4 font-bold text-slate-900">
                          {money(
                            order.total,
                          )}
                        </td>

                        <td className="px-4 py-4">
                          <span
                            className={`
                              rounded-full
                              px-2.5
                              py-1
                              text-[10px]
                              font-bold
                              uppercase
                              ${chip(
                                order.status,
                              )}
                            `}
                          >
                            {
                              order.status
                            }
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`
                              rounded-full
                              px-2.5
                              py-1
                              text-[10px]
                              font-bold
                              uppercase
                              ${chip(
                                order.paymentStatus,
                              )}
                            `}
                          >
                            {
                              order.paymentStatus
                            }
                          </span>
                        </td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-10 text-center">
              <Icon
                name="box"
                className="mx-auto h-8 w-8 text-slate-300"
              />

              <p className="mt-3 font-bold text-slate-700">
                No orders yet
              </p>

              <p className="mt-1 text-sm text-slate-400">
                Customer orders will
                appear here
                automatically.
              </p>
            </div>
          )}
        </section>

        <section
          className="
            rounded-2xl
            border
            border-slate-200
            bg-white
            p-5
            shadow-sm
          "
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-slate-950">
                Inventory alerts
              </h3>

              <p className="text-xs text-slate-500">
                Tracked products needing
                attention
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                onGoAction(
                  "products",
                )
              }
              className="text-xs font-bold text-blue-700"
            >
              Products
            </button>
          </div>

          {data
            .stockAlerts
            .length ? (
            <div className="mt-4 space-y-3">
              {data.stockAlerts.map(
                (
                  item,
                ) => (
                  <div
                    key={
                      item.id
                    }
                    className="
                      flex
                      items-center
                      justify-between
                      rounded-xl
                      border
                      border-slate-100
                      bg-slate-50
                      p-3
                    "
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-slate-900">
                        {
                          item.name
                        }
                      </p>

                      <p className="text-[11px] text-slate-400">
                        {item.sku ||
                          "No SKU"}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="font-black text-slate-900">
                        {
                          item.quantity
                        }
                      </p>

                      <span
                        className={`
                          text-[10px]
                          font-bold
                          uppercase
                          ${
                            item.status ===
                            "out-of-stock"
                              ? "text-red-600"
                              : "text-amber-600"
                          }
                        `}
                      >
                        {item.status.replaceAll(
                          "-",
                          " ",
                        )}
                      </span>
                    </div>
                  </div>
                ),
              )}
            </div>
          ) : (
            <div
              className="
                mt-8
                rounded-xl
                bg-emerald-50
                p-5
                text-center
              "
            >
              <Icon
                name="checkCircle"
                className="mx-auto h-7 w-7 text-emerald-600"
              />

              <p className="mt-2 text-sm font-bold text-emerald-800">
                No stock alerts
              </p>
            </div>
          )}
        </section>
      </div>

      {/* REQUESTS + QUICK ACTIONS */}

      <div className="grid gap-6 lg:grid-cols-2">
        <section
          className="
            rounded-2xl
            border
            border-slate-200
            bg-white
            p-5
            shadow-sm
          "
        >
          <h3 className="font-extrabold text-slate-950">
            Request inbox
          </h3>

          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <button
              type="button"
              onClick={() =>
                onGoAction(
                  "requests",
                )
              }
              className="rounded-xl bg-slate-50 p-3 text-left"
            >
              <span className="text-xl font-black">
                {
                  data.newQuotes
                }
              </span>

              <p className="text-xs text-slate-500">
                New quotes
              </p>
            </button>

            <button
              type="button"
              onClick={() =>
                onGoAction(
                  "requests",
                )
              }
              className="rounded-xl bg-slate-50 p-3 text-left"
            >
              <span className="text-xl font-black">
                {
                  data.pendingCustomerQuotes
                }
              </span>

              <p className="text-xs text-slate-500">
                Customer quotes
              </p>
            </button>

            <button
              type="button"
              onClick={() =>
                onGoAction(
                  "requests",
                )
              }
              className="rounded-xl bg-slate-50 p-3 text-left"
            >
              <span className="text-xl font-black">
                {
                  data.newDemos
                }
              </span>

              <p className="text-xs text-slate-500">
                Demo requests
              </p>
            </button>

            <button
              type="button"
              onClick={() =>
                onGoAction(
                  "requests",
                )
              }
              className="rounded-xl bg-slate-50 p-3 text-left"
            >
              <span className="text-xl font-black">
                {
                  data.newMessages
                }
              </span>

              <p className="text-xs text-slate-500">
                Messages
              </p>
            </button>
          </div>
        </section>

        <section
          className="
            rounded-2xl
            border
            border-slate-200
            bg-white
            p-5
            shadow-sm
          "
        >
          <h3 className="font-extrabold text-slate-950">
            Quick actions
          </h3>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() =>
                onGoAction(
                  "products",
                )
              }
              className="
                rounded-xl
                border
                border-slate-200
                p-4
                text-left
                hover:border-blue-300
                hover:bg-blue-50
              "
            >
              <Icon
                name="plus"
                className="h-5 w-5 text-blue-700"
              />

              <p className="mt-2 text-sm font-bold">
                Manage products
              </p>
            </button>

            <button
              type="button"
              onClick={() =>
                onGoAction(
                  "orders",
                )
              }
              className="
                rounded-xl
                border
                border-slate-200
                p-4
                text-left
                hover:border-blue-300
                hover:bg-blue-50
              "
            >
              <Icon
                name="box"
                className="h-5 w-5 text-blue-700"
              />

              <p className="mt-2 text-sm font-bold">
                Create order
              </p>
            </button>

            <button
              type="button"
              onClick={() =>
                onGoAction(
                  "customers",
                )
              }
              className="
                rounded-xl
                border
                border-slate-200
                p-4
                text-left
                hover:border-blue-300
                hover:bg-blue-50
              "
            >
              <Icon
                name="users"
                className="h-5 w-5 text-blue-700"
              />

              <p className="mt-2 text-sm font-bold">
                View customers
              </p>
            </button>

            <button
              type="button"
              onClick={() =>
                onGoAction(
                  "resources",
                )
              }
              className="
                rounded-xl
                border
                border-slate-200
                p-4
                text-left
                hover:border-blue-300
                hover:bg-blue-50
              "
            >
              <Icon
                name="doc"
                className="h-5 w-5 text-blue-700"
              />

              <p className="mt-2 text-sm font-bold">
                Manage resources
              </p>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}