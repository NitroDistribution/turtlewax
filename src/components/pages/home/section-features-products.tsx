import { ProductCard } from "@/components/shared/product-card";
import type { Locale } from "@/lib/i18n";
import { getFeaturedProducts, getHomeSectionsCopy, getWhatsappDefaults } from "@/sanity/queries";

type SectionFeaturesProductsProps = {
  locale: Locale;
};

export const SectionFeaturesProducts = async ({ locale }: SectionFeaturesProductsProps) => {
  const [featuredProducts, homeCopy, whatsappDefaults] = await Promise.all([
    getFeaturedProducts(locale),
    getHomeSectionsCopy(locale),
    getWhatsappDefaults(),
  ]);

  if (!featuredProducts.length) {
    return null;
  }

  const copy = {
    eyebrow: homeCopy?.featured?.eyebrow ?? "",
    title: homeCopy?.featured?.title ?? "",
    subtitle: homeCopy?.featured?.subtitle ?? "",
  };

  const fallbackWhatsappPhone = whatsappDefaults?.phone ?? null;

  return (
    <section className="section">
      <div className="container space-y-12">
        <header className="space-y-3 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.15em] text-primary/70">
            {copy.eyebrow}
          </p>
          <h2 className="heading-2 text-balance">{copy.title}</h2>
          <p className="mx-auto max-w-2xl text-base text-muted-foreground">
            {copy.subtitle}
          </p>
        </header>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredProducts.map((product) => (
            <ProductCard
              locale={locale}
              key={product._id}
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
