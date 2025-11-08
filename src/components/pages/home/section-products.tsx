import Link from "next/link";

import { ProductCard } from "@/components/shared/product-card";
import { Button } from "@/components/ui/button";
import type { Locale } from "@/lib/i18n";
import { getCollectionHighlightProducts, getHomeSectionsCopy, getWhatsappDefaults } from "@/sanity/queries";

type SectionProductsProps = {
  locale: Locale;
};

const COLLECTION_LIMIT = 9;

export const SectionProducts = async ({ locale }: SectionProductsProps) => {
  const [products, homeCopy, whatsappDefaults] = await Promise.all([
    getCollectionHighlightProducts(locale, COLLECTION_LIMIT),
    getHomeSectionsCopy(locale),
    getWhatsappDefaults(),
  ]);

  if (!products.length) {
    return null;
  }

  const copy = {
    eyebrow: homeCopy?.collection?.eyebrow ?? "",
    title: homeCopy?.collection?.title ?? "",
    subtitle: homeCopy?.collection?.subtitle ?? "",
    viewAll: homeCopy?.collection?.viewAll ?? "",
  };

  const fallbackWhatsappPhone = whatsappDefaults?.phone ?? null;

  return (
    <section className="section">
      <div className="container space-y-12">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary/70">
              {copy.eyebrow}
            </p>
            <h2 className="heading-2 text-balance">{copy.title}</h2>
            <p className="max-w-2xl text-base text-muted-foreground">{copy.subtitle}</p>
          </div>

          <Button asChild size="lg" shape="pill">
            <Link href={`/${locale}/products`}>{copy.viewAll}</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              locale={locale}
              id={product._id}
              name={product.title || "Untitled product"}
              price={product.price ?? undefined}
              discountPrice={product.discountPrice ?? undefined}
              size={product.size ?? undefined}
              image={product.image?.url ? `${product.image.url}?auto=format` : undefined}
              slug={product.slug}
              whatsappLink={product.whatsappLink ?? undefined}
              fallbackWhatsappPhone={fallbackWhatsappPhone}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
