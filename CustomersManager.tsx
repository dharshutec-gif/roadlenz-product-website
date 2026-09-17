"use client";

import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Icon,
} from "../ui";

type CustomerRow = {
  id:
    string;

  name:
    string;

  company:
    string;

  email:
    string;

  phone:
    string;

  registeredAt:
    string;

  memberSince:
    string;

  plan:
    string;

  orderCount:
    number;

  quoteCount:
    number;

  ticketCount:
    number;

  invoiceCount:
    number;

  totalSpend:
    number;
};

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

export default function CustomersManager() {
  const [
    rows,
    setRows,
  ] =
    useState<
      CustomerRow[]
    >([]);

  const [
    query,
    setQuery,
  ] =
    useState("");

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

  useEffect(
    () => {
      fetch(
        "/api/admin/customers",
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
                  "Could not load customers.",
              );
            }

            setRows(
              body.customers ??
                [],
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
                : "Could not load customers.",
            ),
        )
        .finally(
          () =>
            setLoading(
              false,
            ),
        );
    },
    [],
  );

  const filtered =
    useMemo(
      () => {
        const needle =
          query
            .trim()
            .toLowerCase();

        if (
          !needle
        ) {
          return rows;
        }

        return rows.filter(
          (
            row,
          ) =>
            [
              row.name,
              row.company,
              row.email,
              row.phone,
            ].some(
              (
                value,
              ) =>
                value
                  ?.toLowerCase()
                  .includes(
                    needle,
                  ),
            ),
        );
      },
      [
        rows,
        query,
      ],
    );

  if (
    loading
  ) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm font-semibold text-slate-500">
        Loading customers…
      </div>
    );
  }

  if (
    error
  ) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm font-semibold text-red-700">
        {
          error
        }
      </div>
    );
  }

  return (
    <div className="space-y-5">

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">

        <div>
          <p className="text-xs font-bold uppercase tracking-[.16em] text-slate-400">
            Commerce
          </p>

          <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-950">
            Customers
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Real registered customer
            accounts and their activity.
          </p>
        </div>

        <div className="relative w-full sm:w-80">

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
            placeholder="Search customer, company or email"
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-blue-400"
          />

        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        {filtered.length ? (
          <div className="overflow-x-auto">

            <table className="min-w-[1040px] w-full text-left text-sm">

              <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-400">

                <tr>
                  <th className="px-5 py-3">
                    Customer
                  </th>

                  <th className="px-4 py-3">
                    Contact
                  </th>

                  <th className="px-4 py-3">
                    Registered
                  </th>

                  <th className="px-4 py-3">
                    Orders
                  </th>

                  <th className="px-4 py-3">
                    Quotes
                  </th>

                  <th className="px-4 py-3">
                    Tickets
                  </th>

                  <th className="px-4 py-3">
                    Spend
                  </th>

                  <th className="px-5 py-3">
                    Plan
                  </th>
                </tr>

              </thead>

              <tbody className="divide-y divide-slate-100">

                {filtered.map(
                  (
                    row,
                  ) => (
                    <tr
                      key={
                        row.id
                      }
                      className="hover:bg-slate-50"
                    >

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-3">

                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 font-black text-blue-700">
                            {row.name
                              .slice(
                                0,
                                1,
                              )
                              .toUpperCase()}
                          </span>

                          <div>
                            <p className="font-bold text-slate-900">
                              {
                                row.name
                              }
                            </p>

                            <p className="text-xs text-slate-400">
                              {row.company ||
                                "—"}
                            </p>
                          </div>

                        </div>
                      </td>

                      <td className="px-4 py-4">

                        <p className="text-slate-700">
                          {
                            row.email
                          }
                        </p>

                        <p className="text-xs text-slate-400">
                          {row.phone ||
                            "No phone"}
                        </p>
                      </td>

                      <td className="px-4 py-4 text-xs font-semibold text-slate-500">

                        {row.registeredAt
                          ? new Date(
                              row.registeredAt,
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
                            )
                          : "—"}

                      </td>

                      <td className="px-4 py-4 font-bold text-slate-900">
                        {
                          row.orderCount
                        }
                      </td>

                      <td className="px-4 py-4 font-bold text-slate-900">
                        {
                          row.quoteCount
                        }
                      </td>

                      <td className="px-4 py-4 font-bold text-slate-900">
                        {
                          row.ticketCount
                        }
                      </td>

                      <td className="px-4 py-4 font-bold text-slate-900">
                        {money(
                          row.totalSpend,
                        )}
                      </td>

                      <td className="px-5 py-4 text-xs font-semibold text-slate-500">
                        {row.plan ||
                          "—"}
                      </td>

                    </tr>
                  ),
                )}

              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">

            <Icon
              name="users"
              className="mx-auto h-9 w-9 text-slate-300"
            />

            <p className="mt-3 font-bold text-slate-700">
              No customers found
            </p>

            <p className="mt-1 text-sm text-slate-400">
              Registered customer accounts
              will appear here.
            </p>

          </div>
        )}

      </div>
    </div>
  );
}