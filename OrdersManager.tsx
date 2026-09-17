"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { Icon } from "../ui";

import type {
  CustomerOrderStatus,
  CustomerPaymentStatus,
} from "@/lib/types";

type CustomerOption = {
  id: string;
  name: string;
  company: string;
  email: string;
};

type ProductOption = {
  slug: string;
  name: string;
  image?: string;
  price: string;
  sku?: string;
  stockQuantity?: number;
  stockStatus?: string;
};

type OrderRow = {
  id: string;

  orderNumber: string;

  customerUserId: string;

  createdAt: string;

  status: CustomerOrderStatus;

  paymentStatus: CustomerPaymentStatus;

  total: number;

  trackingNumber?: string;

  courier?: string;

  expectedDelivery?: string;

  items: {
    productSlug: string;

    name: string;

    image?: string;

    quantity: number;

    unitAmount: number;

    gstRate?: number;
  }[];

  customer: CustomerOption | null;
};

type DraftItem = {
  productSlug: string;

  quantity: number;

  unitAmount: number;

  gstRate: number;
};

const ORDER_STATUSES: CustomerOrderStatus[] = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

const PAYMENT_STATUSES: CustomerPaymentStatus[] = [
  "pending",
  "paid",
  "failed",
  "refunded",
];

const money = (
  value: number,
) =>
  new Intl.NumberFormat(
    "en-IN",
    {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    },
  ).format(value);

function statusClass(
  value: string,
) {
  if (
    value === "delivered" ||
    value === "paid"
  ) {
    return "bg-emerald-50 text-emerald-700";
  }

  if (
    value === "cancelled" ||
    value === "failed"
  ) {
    return "bg-red-50 text-red-700";
  }

  if (
    value === "shipped"
  ) {
    return "bg-blue-50 text-blue-700";
  }

  return "bg-amber-50 text-amber-700";
}

export default function OrdersManager() {
  const [
    orders,
    setOrders,
  ] =
    useState<OrderRow[]>(
      [],
    );

  const [
    customers,
    setCustomers,
  ] =
    useState<CustomerOption[]>(
      [],
    );

  const [
    products,
    setProducts,
  ] =
    useState<ProductOption[]>(
      [],
    );

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    error,
    setError,
  ] =
    useState("");

  const [
    query,
    setQuery,
  ] =
    useState("");

  const [
    status,
    setStatus,
  ] =
    useState("all");

  const [
    creating,
    setCreating,
  ] =
    useState(false);

  const [
    busy,
    setBusy,
  ] =
    useState(false);

  const [
    draft,
    setDraft,
  ] =
    useState<{
      customerUserId: string;

      shipping: number;

      shippingAddress: string;

      notes: string;

      items: DraftItem[];
    }>({
      customerUserId: "",

      shipping: 0,

      shippingAddress: "",

      notes: "",

      items: [
        {
          productSlug: "",

          quantity: 1,

          unitAmount: 0,

          gstRate: 0,
        },
      ],
    });

  /* =======================================================
     LOAD DATABASE ORDERS
  ======================================================= */

  const load =
    useCallback(
      async () => {
        setLoading(true);

        setError("");

        try {
          const response =
            await fetch(
              "/api/admin/orders",
              {
                cache:
                  "no-store",
              },
            );

          const body =
            await response.json();

          if (
            !response.ok
          ) {
            throw new Error(
              body.error ||
                "Could not load orders.",
            );
          }

          setOrders(
            body.orders ??
              [],
          );

          setCustomers(
            body.customers ??
              [],
          );

          setProducts(
            body.products ??
              [],
          );
        } catch (
          reason
        ) {
          setError(
            reason instanceof
              Error
              ? reason.message
              : "Could not load orders.",
          );
        } finally {
          setLoading(
            false,
          );
        }
      },
      [],
    );

  useEffect(() => {
    load();
  }, [load]);

  /* =======================================================
     FILTERS
  ======================================================= */

  const filtered =
    useMemo(
      () =>
        orders.filter(
          (order) => {
            if (
              status !==
                "all" &&
              order.status !==
                status
            ) {
              return false;
            }

            const needle =
              query
                .trim()
                .toLowerCase();

            if (!needle) {
              return true;
            }

            return (
              order.orderNumber
                .toLowerCase()
                .includes(
                  needle,
                ) ||
              order.customer?.name
                .toLowerCase()
                .includes(
                  needle,
                ) ||
              order.customer?.company
                .toLowerCase()
                .includes(
                  needle,
                ) ||
              order.items.some(
                (
                  item,
                ) =>
                  item.name
                    .toLowerCase()
                    .includes(
                      needle,
                    ),
              )
            );
          },
        ),
      [
        orders,
        query,
        status,
      ],
    );

  /* =======================================================
     UPDATE ORDER
  ======================================================= */

  const patch =
    async (
      id: string,
      payload: Record<
        string,
        unknown
      >,
    ) => {
      const response =
        await fetch(
          `/api/admin/orders/${id}`,
          {
            method:
              "PATCH",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify(
                payload,
              ),
          },
        );

      const body =
        await response.json();

      if (!response.ok) {
        throw new Error(
          body.error ||
            "Update failed.",
        );
      }

      await load();
    };

  /* =======================================================
     EDIT DRAFT ITEM
  ======================================================= */

  const updateDraftItem =
    (
      index: number,
      patchValue: Partial<DraftItem>,
    ) =>
      setDraft(
        (
          current,
        ) => ({
          ...current,

          items:
            current.items.map(
              (
                item,
                itemIndex,
              ) =>
                itemIndex ===
                index
                  ? {
                      ...item,
                      ...patchValue,
                    }
                  : item,
            ),
        }),
      );

  /* =======================================================
     CREATE ORDER
  ======================================================= */

  const createOrder =
    async () => {
      setBusy(true);

      setError("");

      try {
        const response =
          await fetch(
            "/api/admin/orders",
            {
              method:
                "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body:
                JSON.stringify(
                  draft,
                ),
            },
          );

        const body =
          await response.json();

        if (
          !response.ok
        ) {
          throw new Error(
            body.error ||
              "Could not create order.",
          );
        }

        setCreating(
          false,
        );

        setDraft({
          customerUserId:
            "",

          shipping: 0,

          shippingAddress:
            "",

          notes: "",

          items: [
            {
              productSlug:
                "",

              quantity: 1,

              unitAmount:
                0,

              gstRate: 0,
            },
          ],
        });

        await load();
      } catch (
        reason
      ) {
        setError(
          reason instanceof
            Error
            ? reason.message
            : "Could not create order.",
        );
      } finally {
        setBusy(false);
      }
    };

  return (
    <div className="space-y-5">
      {/* ===================================================
          HEADER
      =================================================== */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.16em] text-slate-400">
            Commerce
          </p>

          <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-950">
            Orders
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Manage real
            customer orders,
            payment and
            delivery status.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            setCreating(
              true,
            )
          }
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-blue-700"
        >
          <Icon
            name="plus"
            className="h-4 w-4"
          />

          Create order
        </button>
      </div>

      {/* ===================================================
          ERROR
      =================================================== */}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      {/* ===================================================
          SEARCH / FILTER
      =================================================== */}

      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row">
        <div className="relative flex-1">
          <Icon
            name="search"
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
          />

          <input
            value={
              query
            }
            onChange={(
              event,
            ) =>
              setQuery(
                event
                  .target
                  .value,
              )
            }
            placeholder="Search order, customer or product"
            className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-blue-400"
          />
        </div>

        <select
          value={
            status
          }
          onChange={(
            event,
          ) =>
            setStatus(
              event
                .target
                .value,
            )
          }
          className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold"
        >
          <option value="all">
            All statuses
          </option>

          {ORDER_STATUSES.map(
            (
              item,
            ) => (
              <option
                key={
                  item
                }
                value={
                  item
                }
              >
                {item}
              </option>
            ),
          )}
        </select>
      </div>

      {/* ===================================================
          ORDERS
      =================================================== */}

      {loading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm font-semibold text-slate-500">
          Loading orders…
        </div>
      ) : filtered.length ? (
        <div className="space-y-3">
          {filtered.map(
            (
              order,
            ) => (
              <article
                key={
                  order.id
                }
                className="rounded-2xl border border-slate-200 bg-white shadow-sm"
              >
                <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-black text-slate-950">
                        {
                          order.orderNumber
                        }
                      </h3>

                      <span
                        className={`
                          rounded-full
                          px-2.5
                          py-1
                          text-[10px]
                          font-bold
                          uppercase
                          ${statusClass(
                            order.status,
                          )}
                        `}
                      >
                        {
                          order.status
                        }
                      </span>

                      <span
                        className={`
                          rounded-full
                          px-2.5
                          py-1
                          text-[10px]
                          font-bold
                          uppercase
                          ${statusClass(
                            order.paymentStatus,
                          )}
                        `}
                      >
                        {
                          order.paymentStatus
                        }
                      </span>
                    </div>

                    <p className="mt-1 text-xs text-slate-500">
                      {order.customer
                        ?.name ||
                        "Customer"}{" "}
                      ·{" "}
                      {order.customer
                        ?.company ||
                        order
                          .customer
                          ?.email ||
                        ""}{" "}
                      ·{" "}
                      {order.createdAt.slice(
                        0,
                        10,
                      )}
                    </p>
                  </div>

                  <p className="text-lg font-black text-slate-950">
                    {money(
                      order.total,
                    )}
                  </p>
                </div>

                <div className="grid gap-4 p-5 lg:grid-cols-[1fr_auto]">
                  <div className="space-y-2">
                    {order.items.map(
                      (
                        item,
                      ) => (
                        <div
                          key={`${order.id}-${item.productSlug}`}
                          className="flex items-center gap-3"
                        >
                          <div className="h-12 w-12 overflow-hidden rounded-lg bg-slate-50">
                            {item.image ? (
                              <img
                                src={
                                  item.image
                                }
                                alt=""
                                className="h-full w-full object-contain p-1"
                              />
                            ) : (
                              <span className="flex h-full items-center justify-center">
                                <Icon
                                  name="box"
                                  className="h-5 w-5 text-slate-300"
                                />
                              </span>
                            )}
                          </div>

                          <div>
                            <p className="text-sm font-bold text-slate-900">
                              {
                                item.name
                              }
                            </p>

                            <p className="text-xs text-slate-500">
                              Qty{" "}
                              {
                                item.quantity
                              }{" "}
                              ·{" "}
                              {money(
                                item.unitAmount,
                              )}{" "}
                              each
                            </p>
                          </div>
                        </div>
                      ),
                    )}
                  </div>

                  <div className="grid min-w-[270px] gap-2 sm:grid-cols-2 lg:grid-cols-1">
                    <select
                      value={
                        order.status
                      }
                      onChange={(
                        event,
                      ) =>
                        patch(
                          order.id,
                          {
                            status:
                              event
                                .target
                                .value,
                          },
                        ).catch(
                          (
                            reason,
                          ) =>
                            setError(
                              reason.message,
                            ),
                        )
                      }
                      className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold"
                    >
                      {ORDER_STATUSES.map(
                        (
                          item,
                        ) => (
                          <option
                            key={
                              item
                            }
                            value={
                              item
                            }
                          >
                            {
                              item
                            }
                          </option>
                        ),
                      )}
                    </select>

                    <select
                      value={
                        order.paymentStatus
                      }
                      onChange={(
                        event,
                      ) =>
                        patch(
                          order.id,
                          {
                            paymentStatus:
                              event
                                .target
                                .value,
                          },
                        ).catch(
                          (
                            reason,
                          ) =>
                            setError(
                              reason.message,
                            ),
                        )
                      }
                      className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold"
                    >
                      {PAYMENT_STATUSES.map(
                        (
                          item,
                        ) => (
                          <option
                            key={
                              item
                            }
                            value={
                              item
                            }
                          >
                            {
                              item
                            }
                          </option>
                        ),
                      )}
                    </select>

                    {(order.status ===
                      "shipped" ||
                      order.status ===
                        "delivered") && (
                      <div className="rounded-lg bg-slate-50 p-2 text-xs text-slate-500">
                        {order.courier ||
                          "Courier not set"}

                        {order.trackingNumber
                          ? ` · ${order.trackingNumber}`
                          : ""}
                      </div>
                    )}
                  </div>
                </div>
              </article>
            ),
          )}
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
          <Icon
            name="box"
            className="mx-auto h-10 w-10 text-slate-300"
          />

          <p className="mt-3 font-bold text-slate-700">
            No orders found
          </p>

          <p className="mt-1 text-sm text-slate-400">
            Create an order
            when a customer
            confirms a
            purchase.
          </p>
        </div>
      )}

      {/* ===================================================
          CREATE ORDER DRAWER
      =================================================== */}

      {creating && (
        <div
          className="fixed inset-0 z-[120] flex justify-end bg-slate-950/40"
          onMouseDown={(
            event,
          ) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              setCreating(
                false,
              );
            }
          }}
        >
          <div className="h-full w-full max-w-xl overflow-y-auto bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  New order
                </p>

                <h3 className="text-xl font-black text-slate-950">
                  Create customer
                  order
                </h3>
              </div>

              <button
                type="button"
                onClick={() =>
                  setCreating(
                    false,
                  )
                }
                className="rounded-full p-2 hover:bg-slate-100"
              >
                <Icon name="x" />
              </button>
            </div>

            <div className="space-y-5 p-6">
              {/* CUSTOMER */}

              <label className="block">
                <span className="mb-1.5 block text-xs font-bold text-slate-600">
                  Customer
                </span>

                <select
                  value={
                    draft.customerUserId
                  }
                  onChange={(
                    event,
                  ) =>
                    setDraft({
                      ...draft,

                      customerUserId:
                        event
                          .target
                          .value,
                    })
                  }
                  className="w-full rounded-xl border border-slate-200 p-3"
                >
                  <option value="">
                    Select customer
                  </option>

                  {customers.map(
                    (
                      customer,
                    ) => (
                      <option
                        key={
                          customer.id
                        }
                        value={
                          customer.id
                        }
                      >
                        {
                          customer.name
                        }

                        {customer.company
                          ? ` — ${customer.company}`
                          : ""}
                      </option>
                    ),
                  )}
                </select>
              </label>

              {/* PRODUCTS */}

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-600">
                    Products
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      setDraft({
                        ...draft,

                        items: [
                          ...draft.items,

                          {
                            productSlug:
                              "",

                            quantity:
                              1,

                            unitAmount:
                              0,

                            gstRate:
                              0,
                          },
                        ],
                      })
                    }
                    className="text-xs font-bold text-blue-700"
                  >
                    + Add item
                  </button>
                </div>

                <div className="space-y-3">
                  {draft.items.map(
                    (
                      item,
                      index,
                    ) => (
                      <div
                        key={
                          index
                        }
                        className="rounded-xl border border-slate-200 p-3"
                      >
                        <div className="grid gap-2 sm:grid-cols-2">
                          <select
                            value={
                              item.productSlug
                            }
                            onChange={(
                              event,
                            ) =>
                              updateDraftItem(
                                index,
                                {
                                  productSlug:
                                    event
                                      .target
                                      .value,
                                },
                              )
                            }
                            className="rounded-lg border border-slate-200 p-2.5 text-sm"
                          >
                            <option value="">
                              Select product
                            </option>

                            {products.map(
                              (
                                product,
                              ) => (
                                <option
                                  key={
                                    product.slug
                                  }
                                  value={
                                    product.slug
                                  }
                                >
                                  {
                                    product.name
                                  }
                                </option>
                              ),
                            )}
                          </select>

                          <div className="grid grid-cols-3 gap-2">
                            <input
                              type="number"
                              min="1"
                              value={
                                item.quantity
                              }
                              onChange={(
                                event,
                              ) =>
                                updateDraftItem(
                                  index,
                                  {
                                    quantity:
                                      Number(
                                        event
                                          .target
                                          .value,
                                      ),
                                  },
                                )
                              }
                              className="rounded-lg border border-slate-200 p-2.5 text-sm"
                              title="Quantity"
                            />

                            <input
                              type="number"
                              min="0"
                              value={
                                item.unitAmount
                              }
                              onChange={(
                                event,
                              ) =>
                                updateDraftItem(
                                  index,
                                  {
                                    unitAmount:
                                      Number(
                                        event
                                          .target
                                          .value,
                                      ),
                                  },
                                )
                              }
                              className="rounded-lg border border-slate-200 p-2.5 text-sm"
                              title="Unit amount"
                            />

                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={
                                item.gstRate
                              }
                              onChange={(
                                event,
                              ) =>
                                updateDraftItem(
                                  index,
                                  {
                                    gstRate:
                                      Number(
                                        event
                                          .target
                                          .value,
                                      ),
                                  },
                                )
                              }
                              className="rounded-lg border border-slate-200 p-2.5 text-sm"
                              title="GST rate"
                            />
                          </div>
                        </div>

                        {draft.items
                          .length >
                          1 && (
                          <button
                            type="button"
                            onClick={() =>
                              setDraft({
                                ...draft,

                                items:
                                  draft.items.filter(
                                    (
                                      _,
                                      itemIndex,
                                    ) =>
                                      itemIndex !==
                                      index,
                                  ),
                              })
                            }
                            className="mt-2 text-xs font-bold text-red-600"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    ),
                  )}
                </div>
              </div>

              {/* SHIPPING */}

              <label className="block">
                <span className="mb-1.5 block text-xs font-bold text-slate-600">
                  Shipping amount
                </span>

                <input
                  type="number"
                  min="0"
                  value={
                    draft.shipping
                  }
                  onChange={(
                    event,
                  ) =>
                    setDraft({
                      ...draft,

                      shipping:
                        Number(
                          event
                            .target
                            .value,
                        ),
                    })
                  }
                  className="w-full rounded-xl border border-slate-200 p-3"
                />
              </label>

              {/* SHIPPING ADDRESS */}

              <label className="block">
                <span className="mb-1.5 block text-xs font-bold text-slate-600">
                  Shipping address
                </span>

                <textarea
                  value={
                    draft.shippingAddress
                  }
                  onChange={(
                    event,
                  ) =>
                    setDraft({
                      ...draft,

                      shippingAddress:
                        event
                          .target
                          .value,
                    })
                  }
                  className="w-full rounded-xl border border-slate-200 p-3"
                  rows={3}
                />
              </label>

              {/* NOTES */}

              <label className="block">
                <span className="mb-1.5 block text-xs font-bold text-slate-600">
                  Notes
                </span>

                <textarea
                  value={
                    draft.notes
                  }
                  onChange={(
                    event,
                  ) =>
                    setDraft({
                      ...draft,

                      notes:
                        event
                          .target
                          .value,
                    })
                  }
                  className="w-full rounded-xl border border-slate-200 p-3"
                  rows={3}
                />
              </label>
            </div>

            {/* DRAWER FOOTER */}

            <div className="sticky bottom-0 flex justify-end gap-2 border-t border-slate-200 bg-white px-6 py-4">
              <button
                type="button"
                onClick={() =>
                  setCreating(
                    false,
                  )
                }
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={
                  busy
                }
                onClick={
                  createOrder
                }
                className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white disabled:opacity-60"
              >
                {busy
                  ? "Creating…"
                  : "Create order"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}