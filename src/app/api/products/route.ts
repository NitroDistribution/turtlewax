import { NextRequest, NextResponse } from "next/server";

import { defaultLocale, isLocale, type Locale } from "@/lib/i18n";
import { getProductsList, getWhatsappDefaults } from "@/sanity/queries";

const DEFAULT_LIMIT = 9;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const localeParam = searchParams.get("locale") ?? defaultLocale;
  const locale: Locale = isLocale(localeParam) ? localeParam : defaultLocale;

  const limitParam = Number.parseInt(searchParams.get("limit") ?? "", 10);
  const offsetParam = Number.parseInt(searchParams.get("offset") ?? "", 10);
  const categorySlug = searchParams.get("category") ?? undefined;
  const highlightOnlyParam = searchParams.get("highlight");

  const limit = Number.isFinite(limitParam) && limitParam > 0 ? Math.min(limitParam, 24) : DEFAULT_LIMIT;
  const offset = Number.isFinite(offsetParam) && offsetParam >= 0 ? offsetParam : 0;

  const [defaults, { products, hasMore }] = await Promise.all([
    getWhatsappDefaults(),
    getProductsList({
      locale,
      limit,
      offset,
      categorySlug,
      highlightOnly: highlightOnlyParam === null ? undefined : highlightOnlyParam === "true",
    }),
  ]);

  return NextResponse.json({ products, hasMore, whatsappPhone: defaults?.phone ?? null });
}
