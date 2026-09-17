import "server-only";
import fs from "node:fs";
import path from "node:path";
import { readDb } from "./db";
import { getCapabilityProducts, getTechnologyCapabilities, type TechnologyCapability } from "./technology-capabilities";

export function getTechnologyPageProps(capability: TechnologyCapability) {
  const products = getCapabilityProducts(capability, readDb().products).map(product => ({
    slug: product.slug, name: product.name, category: product.category, tagline: product.tagline,
    image: product.image && (!product.image.startsWith("/") || fs.existsSync(path.join(process.cwd(), "public", product.image))) ? product.image : "",
  }));
  const navigation = getTechnologyCapabilities().map(({ slug, name, shortName, icon }) => ({ slug, name, shortName, icon }));
  return { capability, products, navigation };
}
