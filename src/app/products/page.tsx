import type {
  Metadata,
} from "next";

import ProductCatalogue from "@/components/products/ProductCatalogue";

import {
  listEntity,
  publishedOf,
  readDb,
} from "@/lib/db";

import type {
  Product,
  ProductCategory,
} from "@/lib/types";

export const dynamic =
  "force-dynamic";

export const revalidate =
  0;

export const metadata:
  Metadata = {
    title:
      "Products | RoadLenz",

    description:
      "Explore fleet hardware including MDVR, AI dashcams, vehicle cameras, GPS tracking devices and vehicle safety systems.",
  };

export default function ProductsPage() {
  const db =
    readDb();

  /* Published Admin products */

  const products =
    publishedOf<Product>(
      listEntity<Product>(
        db,
        "products",
      ),
    );

  /* Published Admin categories */

  const cmsCategories =
    publishedOf<ProductCategory>(
      listEntity<ProductCategory>(
        db,
        "productCategories",
      ),
    )
      .map(
        (
          category,
        ) =>
          category.name?.trim(),
      )
      .filter(
        (
          category,
        ): category is string =>
          Boolean(
            category,
          ),
      );

  /* Categories actually used by published products */

  const productCategories =
    products
      .map(
        (
          product,
        ) =>
          product.category?.trim(),
      )
      .filter(
        (
          category,
        ): category is string =>
          Boolean(
            category,
          ),
      );

  const categories =
    Array.from(
      new Set([
        ...cmsCategories,
        ...productCategories,
      ]),
    );

  return (
    <ProductCatalogue
      products={
        products
      }
      categories={
        categories
      }
    />
  );
}