import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Button } from "@/components/ui/button";
import { ProductGallery } from "@/components/pages/products/ProductGallery";
import { ProductMedia } from "@/components/pages/products/ProductMedia";
import { getBuyNowLabel, getProductDetailCopy, isLocale, locales, type Locale } from "@/lib/i18n";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { getAllProductSlugs, getProductBySlug, getWhatsappDefaults } from "@/sanity/queries";

type ProductPageParams = {
  locale: string;
  slug: string;
};

type ProductPageProps = {
  params: Promise<ProductPageParams>;
};

export async function generateStaticParams() {
  const slugs = await getAllProductSlugs();

  return locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { locale: localeParam, slug } = await params;

  if (!isLocale(localeParam)) {
    return {};
  }

  const product = await getProductBySlug(slug, localeParam);

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  const description = product.excerpt || product.body || undefined;

  return {
    title: `${product.title} | Turtle Wax`,
    description,
    openGraph: {
      title: `${product.title} | Turtle Wax`,
      description,
      images: product.image?.url ? [`${product.image.url}?auto=format&fit=max`] : undefined,
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { locale: localeParam, slug } = await params;

  if (!isLocale(localeParam)) {
    notFound();
  }

  const locale: Locale = localeParam;
  const [product, whatsappDefaults] = await Promise.all([
    getProductBySlug(slug, locale),
    getWhatsappDefaults(),
  ]);

  if (!product) {
    notFound();
  }

  const hasDiscount =
    typeof product.discountPrice === "number" && product.discountPrice > 0 &&
    (typeof product.price === "number" ? product.discountPrice < product.price : true);
  const displayPrice = hasDiscount ? product.discountPrice : product.price;
  const formattedDisplayPrice =
    typeof displayPrice === "number" ? `${displayPrice.toFixed(2)} AZN` : null;
  const formattedOriginalPrice =
    hasDiscount && typeof product.price === "number" ? `${product.price.toFixed(2)} AZN` : null;
  const fallbackWhatsappPhone = whatsappDefaults?.phone ?? null;
  const { backToHome, sizeLabel, imageFallback } = getProductDetailCopy(locale);
  const generatedWhatsappLink = buildWhatsAppLink({
    overrideUrl: product.whatsappLink ?? undefined,
    phone: fallbackWhatsappPhone ?? undefined,
    productName: product.title,
    locale,
    price: product.price ?? undefined,
    discountPrice: product.discountPrice ?? undefined,
    size: product.size ?? undefined,
    sizeLabel,
  });
  const fallbackContactHref = `/${locale}/contact`;
  const buyNowHref = generatedWhatsappLink ?? fallbackContactHref;
  const buyNowIsExternal = /^https?:\/\//.test(buyNowHref);
  const buyNowLabel = getBuyNowLabel(locale);
  const descriptionParagraphs = product.body
    ? product.body
        .split(/\n{2,}/)
        .map((paragraph) => paragraph.trim())
        .filter(Boolean)
    : [];

  return (
    <>
      <section className="section">
        <div className="container space-y-10">
          <Link
            href={`/${locale}`}
            className="inline-flex items-center text-sm font-medium text-primary transition-colors hover:text-primary/80"
          >
            {backToHome}
          </Link>

          <div className="grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-start">
            <ProductGallery
              primaryImage={product.image}
              galleryImages={product.galleryImages}
              fallbackLabel={imageFallback}
              fallbackAlt={product.image?.alt || product.title}
            />

            <div className="space-y-6">
              <header className="space-y-3">
                <h1 className="heading-2">{product.title}</h1>
              </header>

              <div className="flex flex-wrap items-center gap-4 text-gray-800">
                {formattedDisplayPrice ? (
                  <p className="text-2xl font-semibold text-primary">{formattedDisplayPrice}</p>
                ) : null}
                {formattedOriginalPrice ? (
                  <span className="text-lg font-medium text-muted-foreground line-through">
                    {formattedOriginalPrice}
                  </span>
                ) : null}
                {product.size ? (
                  <p className="text-sm font-medium">{sizeLabel}: {product.size}</p>
                ) : null}
              </div>

              <Button asChild size="lg" shape="pill">
                {buyNowIsExternal ? (
                  <a href={buyNowHref} target="_blank" rel="noreferrer">
                    {buyNowLabel}
                  </a>
                ) : (
                  <Link href={buyNowHref}>{buyNowLabel}</Link>
                )}
              </Button>

              {descriptionParagraphs.length ? (
                <div className="space-y-4 text-base leading-relaxed text-gray-700">
                  {descriptionParagraphs.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {Boolean(product.media?.youtubeVideoId || product.media?.instagramPostUrl) ? (
        <ProductMedia
          youtubeVideoId={product.media?.youtubeVideoId ?? undefined}
          instagramPostUrl={product.media?.instagramPostUrl ?? undefined}
          sectionTitle={product.media?.sectionTitle ?? product.title}
          sectionSubtitle={
            product.media?.sectionSubtitle ??
            (locale === "ru"
              ? "Инструкции по применению и демонстрации"
              : "İstifadə təlimatları və nümayişlər")
          }
        />
      ) : null}
    </>
  );
}

export const revalidate = 60;
