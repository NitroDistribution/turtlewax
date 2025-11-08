"use client";

import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { getBuyNowLabel, getProductDetailCopy, type Locale } from "@/lib/i18n";
import { buildWhatsAppLink } from "@/lib/whatsapp";

type ProductCardProps = {
  locale?: Locale;
  id: number | string;
  name: string;
  price?: number | null;
  discountPrice?: number | null;
  size?: string | null;
  image?: string;
  slug?: string;
  whatsappLink?: string | null;
  fallbackWhatsappPhone?: string | null;
};

export const ProductCard = ({
  locale,
  id,
  name,
  price,
  discountPrice,
  size,
  image,
  slug,
  whatsappLink,
  fallbackWhatsappPhone,
}: ProductCardProps) => {
  const slugOrId = slug || String(id);
  const href = locale ? `/${locale}/products/${slugOrId}` : `/products/${slugOrId}`;
  const { sizeLabel: detailSizeLabel } = getProductDetailCopy(locale);

  const whatsappHref = buildWhatsAppLink({
    overrideUrl: whatsappLink ?? undefined,
    phone: fallbackWhatsappPhone ?? undefined,
    productName: name,
    locale,
    price,
    discountPrice,
    size,
    sizeLabel: detailSizeLabel,
  });
  const buyNowHref = whatsappHref ?? href;
  const isExternalLink = /^https?:\/\//.test(buyNowHref) && buyNowHref !== href;
  const hasDiscount =
    typeof discountPrice === "number" && discountPrice > 0 &&
    (typeof price === "number" ? discountPrice < price : true);
  const effectivePrice = hasDiscount ? discountPrice : price;
  const formattedEffectivePrice =
    typeof effectivePrice === "number" ? `${effectivePrice.toFixed(2)} AZN` : null;
  const formattedOriginalPrice =
    hasDiscount && typeof price === "number" ? `${price.toFixed(2)} AZN` : null;
  const buyNowLabel = getBuyNowLabel(locale);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-white">
      <Link
        href={href}
        className="aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100/50"
        aria-label={name}
      >
        {image ? (
          <Image
            src={image}
            alt={name}
            width={400}
            height={400}
            className="h-full w-full object-contain p-8 transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-muted to-secondary/50">
            <span className="text-sm text-muted-foreground">Product Image</span>
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col justify-between space-y-4 bg-white p-4">
        <div className="space-y-1.5">
          <Link
            href={href}
            className="text-base font-medium text-gray-900 transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          >
            <span className="line-clamp-2">{name}</span>
          </Link>

          <div className="flex items-baseline justify-between gap-2">
            <div className="flex items-baseline gap-2">
              {formattedEffectivePrice ? (
                <p className="text-lg font-bold text-primary">{formattedEffectivePrice}</p>
              ) : null}
              {formattedOriginalPrice ? (
                <span className="text-sm font-medium text-muted-foreground line-through">
                  {formattedOriginalPrice}
                </span>
              ) : null}
            </div>
            {size ? <p className="text-sm font-medium text-gray-600">{size}</p> : null}
          </div>
        </div>

        <div>
          <Button asChild size="lg" shape="pill" width="full">
            {isExternalLink ? (
              <a href={buyNowHref} target="_blank" rel="noreferrer">
                {buyNowLabel}
              </a>
            ) : (
              <Link href={buyNowHref}>{buyNowLabel}</Link>
            )}
          </Button>
        </div>
      </div>
    </article>
  );
};
