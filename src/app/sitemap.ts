import type { MetadataRoute } from "next";

import { locales } from "@/lib/i18n";
import { createAbsoluteUrl } from "@/lib/site";
import { getAllCategorySlugs, getAllProductSlugs } from "@/sanity/queries";

const STATIC_SEGMENTS = ["", "/about", "/contact", "/products", "/categories", "/policy", "/terms"];

function withLocale(locale: string, segment: string): string {
  return segment ? `/${locale}${segment}` : `/${locale}`;
}

function toSitemapEntries(paths: string[]): MetadataRoute.Sitemap {
  return paths.map((path) => ({ url: createAbsoluteUrl(path) }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categorySlugs, productSlugs] = await Promise.all([
    getAllCategorySlugs(),
    getAllProductSlugs(),
  ]);

  const localizedStaticPaths = locales.flatMap((locale) =>
    STATIC_SEGMENTS.map((segment) => withLocale(locale, segment)),
  );

  const categoryPaths = locales.flatMap((locale) =>
    categorySlugs.map((slug) => `/${locale}/categories/${slug}`),
  );

  const productPaths = locales.flatMap((locale) =>
    productSlugs.map((slug) => `/${locale}/products/${slug}`),
  );

  const allPaths = ["/", ...localizedStaticPaths, ...categoryPaths, ...productPaths];
  const uniquePaths = Array.from(new Set(allPaths));

  return toSitemapEntries(uniquePaths);
}

export const revalidate = 3600;
