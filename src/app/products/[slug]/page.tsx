import type { Metadata } from "next";
import { notFound } from "next/navigation";

import ProductDetailExperience from "@/components/products/ProductDetailExperience";
import {
  listEntity,
  publishedOf,
  readDb,
} from "@/lib/db";
import type { Product } from "@/lib/types";

type StorefrontProduct =
  Product & {
    brand?: string;

    faqs?: Array<{
      label?: string;
      value?: string;
      question?: string;
      answer?: string;
    }>;
  };

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const dynamic =
  "force-dynamic";

export const revalidate =
  0;

function publishedProducts() {
  const db =
    readDb();

  return publishedOf(
    listEntity<StorefrontProduct>(
      db,
      "products",
    ),
  );
}

function relatedProducts(
  product:
    StorefrontProduct,

  products:
    StorefrontProduct[],
) {
  const selected =
    new Set(
      product.relatedProductSlugs ??
        [],
    );

  const category =
    (
      product.category ??
      ""
    )
      .trim()
      .toLowerCase();

  const explicit =
    products.filter(
      (
        item,
      ) =>
        item.id !==
          product.id &&
        selected.has(
          item.slug,
        ),
    );

  const sameCategory =
    products.filter(
      (
        item,
      ) =>
        item.id !==
          product.id &&
        (
          item.category ??
          ""
        )
          .trim()
          .toLowerCase() ===
          category,
    );

  return [
    ...explicit,
    ...sameCategory,
  ]
    .filter(
      (
        item,
        index,
        array,
      ) =>
        array.findIndex(
          (
            candidate,
          ) =>
            candidate.id ===
            item.id,
        ) === index,
    )
    .slice(
      0,
      8,
    );
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const {
    slug,
  } =
    await params;

  const product =
    publishedProducts().find(
      (
        item,
      ) =>
        item.slug ===
        slug,
    );

  if (!product) {
    return {
      title:
        "Product not found | RoadLenz",
    };
  }

  const description =
    product.tagline ||
    product.description?.[
      0
    ] ||
    product.name;

  return {
    title:
      `${product.name} | Products | RoadLenz`,

    description,

    openGraph: {
      title:
        product.name,

      description,

      images:
        product.image
          ? [
              {
                url:
                  product.image,
              },
            ]
          : [],
    },
  };
}

export default async function ProductPage({
  params,
}: PageProps) {
  const {
    slug,
  } =
    await params;

  const db =
    readDb();

  const products =
    publishedOf(
      listEntity<StorefrontProduct>(
        db,
        "products",
      ),
    );

  const product =
    products.find(
      (
        item,
      ) =>
        item.slug ===
        slug,
    );

  if (!product) {
    notFound();
  }

  return (
    <div
      style={{
        paddingTop:
          72,
      }}
    >
      <ProductDetailExperience
        product={
          product
        }
        relatedProducts={relatedProducts(
          product,
          products,
        )}
        support={
          db.settings
            .contact
        }
      />
    </div>
  );
}