"use client";

import Link from "next/link";
import { useCustomerCart } from "@/components/customer/useCustomerCart";

import {
  useEffect,
  useState,
} from "react";

import {
  Icon,
} from "@/components/ui";

type CartState =
  Record<
    string,
    {
      quantity:
        number;
    }
  >;

type Props = {
  productId?: string;

  name: string;

  slug: string;

  price: string;

  priceNote: string;

  stockStatus?: string;

  stockQuantity?: number;

  trackInventory?: boolean;
};

function isQuotePrice(
  price:
    string,
) {
  return (
    !price?.trim() ||
    /request|quote|on\s*request|contact/i.test(
      price,
    )
  );
}

function stockLabel(
  value?: string,
) {
  switch (
    value
  ) {
    case "in-stock":
      return "In Stock";

    case "low-stock":
      return "Low Stock";

    case "out-of-stock":
      return "Out of Stock";

    case "available-on-order":
      return "Available on Order";

    case "discontinued":
      return "Discontinued";

    default:
      return "";
  }
}

function CartIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <circle
        cx="9"
        cy="20"
        r="1.5"
      />

      <circle
        cx="18"
        cy="20"
        r="1.5"
      />

      <path d="M3 4h2l2.4 10.2a2 2 0 0 0 1.95 1.55h7.85a2 2 0 0 0 1.92-1.45L21 8H7" />
    </svg>
  );
}

export default function ProductPurchasePanel({
  productId,
  name,
  slug,
  price,
  priceNote,
  stockStatus,
  stockQuantity,
  trackInventory,
}: Props) {
  const cartKey =
    productId ||
    slug;

  const [
    selectedQuantity,
    setSelectedQuantity,
  ] =
    useState(
      1,
    );

  const { cart, change, busy, error } = useCustomerCart();
  const cartQuantity = cart[cartKey]?.quantity || 0;
  const addToCart = () => change(cartKey, "add", selectedQuantity);

  const quotePrice =
    isQuotePrice(
      price,
    );

  const outOfStock =
    stockStatus ===
      "out-of-stock" ||
    stockStatus ===
      "discontinued";

  const availability =
    stockLabel(
      stockStatus,
    );

  const quoteHref =
    `/request-quote?product=${encodeURIComponent(
      name,
    )}&qty=${selectedQuantity}`;

  return (
    <aside className="rounded-2xl border border-line bg-white p-5 shadow-card">
      {/* PRICE */}

      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-display text-3xl font-extrabold tracking-tight text-ink">
            {quotePrice
              ? "Price on Request"
              : price}
          </p>

          <p className="mt-1 text-xs text-ink-muted">
            {priceNote ||
              (quotePrice
                ? "GST and installation confirmed in quotation."
                : "Inclusive of GST")}
          </p>
        </div>

        {availability && (
          <div className="text-right">
            <span
              className={`
                inline-flex
                items-center
                gap-1.5
                text-[11px]
                font-black
                ${
                  stockStatus ===
                  "out-of-stock"
                    ? "text-red-600"
                    : stockStatus ===
                        "low-stock"
                      ? "text-amber-600"
                      : "text-emerald-600"
                }
              `}
            >
              <span className="h-2 w-2 rounded-full bg-current" />

              {
                availability
              }
            </span>

            {trackInventory &&
              stockQuantity !==
                undefined && (
                <p className="mt-1 text-[10px] text-ink-faint">
                  {
                    stockQuantity
                  }{" "}
                  available
                </p>
              )}
          </div>
        )}
      </div>

      {/* QUANTITY */}

      {!quotePrice &&
        !outOfStock && (
          <div className="mt-5 grid grid-cols-[124px_minmax(0,1fr)] gap-3">
            <div className="grid min-h-12 grid-cols-[40px_1fr_40px] overflow-hidden rounded-lg border border-line bg-white">
              <button
                type="button"
                onClick={() =>
                  setSelectedQuantity(
                    (
                      current,
                    ) =>
                      Math.max(
                        1,
                        current -
                          1,
                      ),
                  )
                }
                className="grid place-items-center transition hover:bg-mist-50"
                aria-label="Decrease quantity"
              >
                <Icon
                  name="minus"
                  className="h-4 w-4"
                />
              </button>

              <div className="grid place-items-center border-x border-line text-sm font-black">
                {
                  selectedQuantity
                }
              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedQuantity(
                    (
                      current,
                    ) =>
                      Math.min(
                        99,
                        current +
                          1,
                      ),
                  )
                }
                className="grid place-items-center transition hover:bg-mist-50"
                aria-label="Increase quantity"
              >
                <Icon
                  name="plus"
                  className="h-4 w-4"
                />
              </button>
            </div>

            <button
              type="button"
              onClick={
                addToCart
              }
              className="flex min-h-12 items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 text-sm font-bold text-white transition hover:bg-brand-700"
            >
              <CartIcon />

              Add to Cart
            </button>
          </div>
        )}

      {error && <p role="alert" className="mt-3 text-sm text-red-600">{error}</p>}
      <Link href="/cart" className="mt-3 block text-sm font-semibold text-blue-700">View your cart</Link>
      {cartQuantity >
        0 && (
        <p className="mt-2 text-right text-[11px] font-bold text-emerald-600">
          {
            cartQuantity
          }{" "}
          in your cart
        </p>
      )}

      <Link
        href={
          quoteHref
        }
        className="mt-3 flex min-h-11 items-center justify-center rounded-lg border border-brand-500 px-4 text-sm font-bold text-brand-700 transition hover:bg-brand-50"
      >
        Request Quote
      </Link>

      <Link
        href={`/book-demo?product=${encodeURIComponent(
          slug,
        )}`}
        className="mt-2 flex min-h-11 items-center justify-center rounded-lg border border-line px-4 text-sm font-bold text-ink transition hover:bg-mist-50"
      >
        <Icon
          name="calendar"
          className="mr-2 h-4 w-4"
        />

        Request Demo
      </Link>

      {/* SUPPORT / TRUST */}

      <div className="mt-5 space-y-3 border-t border-line pt-4 text-xs font-semibold text-ink-muted">
        <div className="flex items-center gap-2">
          <Icon
            name="shield"
            className="h-4 w-4 text-brand-600"
          />

          Warranty support
        </div>

        <div className="flex items-center gap-2">
          <Icon
            name="wrench"
            className="h-4 w-4 text-brand-600"
          />

          Pan-India installation support
        </div>

        <div className="flex items-center gap-2">
          <Icon
            name="headset"
            className="h-4 w-4 text-brand-600"
          />

          Customer support
        </div>

        <div className="flex items-center gap-2">
          <Icon
            name="doc"
            className="h-4 w-4 text-brand-600"
          />

          GST invoice
        </div>
      </div>
    </aside>
  );
}