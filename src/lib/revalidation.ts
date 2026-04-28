import { locales } from "./i18n";

const slugPattern = /^[a-z0-9]+(?:[/-][a-z0-9]+)*$/;

const singletonContentTypes = new Set([
  "homeHeroSection",
  "aboutPage",
  "contactPage",
  "privacyPage",
  "termsPage",
  "siteSettings",
]);

export type SanityRevalidationPayload = {
  _type?: string;
  slug?: string | null;
  previousSlug?: string | null;
  categorySlug?: string | null;
  previousCategorySlug?: string | null;
};

export type RevalidationTarget = {
  path: string;
  type: "page" | "layout";
};

function isSafeSlug(value: unknown): value is string {
  return typeof value === "string" && slugPattern.test(value);
}

function uniqueTargets(targets: RevalidationTarget[]) {
  const seen = new Set<string>();

  return targets.filter((target) => {
    const key = `${target.type}:${target.path}`;
    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

export function getRevalidationTargets(
  payload: SanityRevalidationPayload | null | undefined,
): RevalidationTarget[] {
  if (!payload?._type) {
    return [];
  }

  const targets: RevalidationTarget[] = [];

  if (payload._type === "product") {
    for (const locale of locales) {
      targets.push({ path: `/${locale}`, type: "page" });
    }

    for (const locale of locales) {
      targets.push({ path: `/${locale}/products`, type: "page" });
    }

    for (const locale of locales) {
      targets.push({ path: `/${locale}/categories`, type: "layout" });
    }

    for (const slug of [payload.slug, payload.previousSlug]) {
      if (!isSafeSlug(slug)) {
        continue;
      }

      for (const locale of locales) {
        targets.push({ path: `/${locale}/products/${slug}`, type: "page" });
      }
    }

    for (const categorySlug of [payload.categorySlug, payload.previousCategorySlug]) {
      if (!isSafeSlug(categorySlug)) {
        continue;
      }

      for (const locale of locales) {
        targets.push({ path: `/${locale}/categories/${categorySlug}`, type: "page" });
      }
    }

    return uniqueTargets(targets);
  }

  if (payload._type === "category") {
    for (const locale of locales) {
      targets.push({ path: `/${locale}`, type: "layout" });
    }

    for (const slug of [payload.slug, payload.previousSlug]) {
      if (!isSafeSlug(slug)) {
        continue;
      }

      for (const locale of locales) {
        targets.push({ path: `/${locale}/categories/${slug}`, type: "page" });
      }
    }

    return uniqueTargets(targets);
  }

  if (singletonContentTypes.has(payload._type)) {
    return locales.map((locale) => ({ path: `/${locale}`, type: "layout" }));
  }

  return [];
}
