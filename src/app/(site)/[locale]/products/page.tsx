import { notFound } from "next/navigation";

import { ProductsGrid } from "@/components/pages/products/products-grid";
import { getAllProductsPageCopy, isLocale, type Locale } from "@/lib/i18n";
import { getProductsList, getWhatsappDefaults } from "@/sanity/queries";

const PAGE_SIZE = 16;

type ProductsPageProps = {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<Record<string, string | string[]>>;
};

export default async function ProductsPage({ params }: ProductsPageProps) {
  const { locale: localeParam } = await params;

  if (!isLocale(localeParam)) {
    notFound();
  }

  const locale: Locale = localeParam;
  const [defaults, { products, hasMore }] = await Promise.all([
    getWhatsappDefaults(),
    getProductsList({
      locale,
      limit: PAGE_SIZE,
    }),
  ]);

  const copy = getAllProductsPageCopy(locale);

  return (
    <section className="section">
      <div className="container space-y-10">
        <header className="space-y-3">
          <h1 className="heading-2">{copy.title}</h1>
          <p className="max-w-2xl text-muted-foreground">{copy.subtitle}</p>
        </header>

        {products.length ? (
          <ProductsGrid
            initialProducts={products}
            locale={locale}
            pageSize={PAGE_SIZE}
            initialHasMore={hasMore}
            loadMoreLabel={copy.loadMore}
            whatsappPhone={defaults?.phone ?? null}
          />
        ) : (
          <p className="text-muted-foreground">{copy.empty}</p>
        )}
      </div>
    </section>
  );
}

export const revalidate = 60;
