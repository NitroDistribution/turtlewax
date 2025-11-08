import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProductCard } from "@/components/shared/product-card";
import { getCategoryDetailCopy, isLocale, locales, type Locale } from "@/lib/i18n";
import {
  getAllCategorySlugs,
  getCategoryBySlug,
  getProductsByCategorySlug,
  getWhatsappDefaults,
} from "@/sanity/queries";

type CategoryPageParams = {
  locale: string;
  slug: string;
};

type CategoryPageProps = {
  params: Promise<CategoryPageParams>;
};

export async function generateStaticParams() {
  const slugs = await getAllCategorySlugs();

  return locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}

async function resolveCategoryAndProducts(slug: string, locale: Locale) {
  const [category, products] = await Promise.all([
    getCategoryBySlug(slug, locale),
    getProductsByCategorySlug(slug, locale),
  ]);

  return { category, products };
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { locale: localeParam, slug } = await params;

  if (!isLocale(localeParam)) {
    return {};
  }

  const category = await getCategoryBySlug(slug, localeParam);

  if (!category) {
    return {
      title: "Category Not Found",
    };
  }

  const title = `${category.title} | Turtle Wax`;
  const description = `${category.title} Turtle Wax products.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: category.image?.url ? [`${category.image.url}?auto=format&fit=max`] : undefined,
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { locale: localeParam, slug } = await params;

  if (!isLocale(localeParam)) {
    notFound();
  }

  const locale: Locale = localeParam;
  const copy = getCategoryDetailCopy(locale);
  const [whatsappDefaults, { category, products }] = await Promise.all([
    getWhatsappDefaults(),
    resolveCategoryAndProducts(slug, locale),
  ]);

  if (!category) {
    notFound();
  }

  const heroImage = category.image?.url ? `${category.image.url}?auto=format` : null;
  const heroAlt = category.image?.alt || category.title;
  const fallbackWhatsappPhone = whatsappDefaults?.phone ?? null;

  return (
    <section className="section">
      <div className="container space-y-12">
        <Link
          href={`/${locale}/categories`}
          className="inline-flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-primary/80"
        >
          <span aria-hidden>←</span>
          <span>{copy.backLabel}</span>
        </Link>

        <div className="relative overflow-hidden rounded-3xl border border-border bg-muted">
          {heroImage ? (
            <Image
              src={heroImage}
              alt={heroAlt}
              fill
              className="object-cover"
              sizes="(min-width: 1280px) 70vw, (min-width: 768px) 80vw, 100vw"
              priority
            />
          ) : null}

          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

          <div className="relative flex min-h-[360px] flex-col justify-end gap-4 p-10 text-white sm:min-h-[420px] lg:min-h-[520px]">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary/70">
              {copy.eyebrow}
            </p>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              {category.title}
            </h1>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="heading-3 text-balance">{copy.productListTitle}</h2>

          {products.length ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => (
                <ProductCard
                  key={product._id}
                  id={product._id}
                  name={product.title || "Untitled product"}
                  price={product.price ?? undefined}
                  discountPrice={product.discountPrice ?? undefined}
                  size={product.size ?? undefined}
                  image={product.image?.url ? `${product.image.url}?auto=format` : undefined}
                  slug={product.slug}
                  whatsappLink={product.whatsappLink ?? undefined}
                  locale={locale}
                  fallbackWhatsappPhone={fallbackWhatsappPhone}
                />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">{copy.empty}</p>
          )}
        </div>
      </div>
    </section>
  );
}

export const revalidate = 60;
