"use client";

import { useState } from "react";

import { ProductCard } from "@/components/shared/product-card";
import { Button } from "@/components/ui/button";
import type { Locale } from "@/lib/i18n";
import type { Product } from "@/sanity/types";

type ProductsGridProps = {
  initialProducts: Product[];
  locale: Locale;
  pageSize: number;
  initialHasMore: boolean;
  loadMoreLabel: string;
  whatsappPhone?: string | null;
};

export const ProductsGrid = ({
  initialProducts,
  locale,
  pageSize,
  initialHasMore,
  loadMoreLabel,
  whatsappPhone,
}: ProductsGridProps) => {
  const [products, setProducts] = useState(initialProducts);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(initialProducts.length);
  const [contactPhone, setContactPhone] = useState(whatsappPhone ?? null);

  const handleLoadMore = async () => {
    if (!hasMore || loading) {
      return;
    }

    setLoading(true);

    try {
      const params = new URLSearchParams({
        locale,
        offset: offset.toString(),
        limit: pageSize.toString(),
      });

      const response = await fetch(`/api/products?${params.toString()}`, {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch more products");
      }

      const data = (await response.json()) as {
        products: Product[];
        hasMore: boolean;
        whatsappPhone?: string | null;
      };

      setProducts((prev) => [...prev, ...data.products]);
      setHasMore(data.hasMore);
      setOffset((prev) => prev + data.products.length);
      if (data.whatsappPhone) {
        setContactPhone(data.whatsappPhone);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard
            key={`${product._id}-${product.slug}`}
            locale={locale}
            id={product._id}
            name={product.title || "Untitled product"}
            price={product.price ?? undefined}
            discountPrice={product.discountPrice ?? undefined}
            size={product.size ?? undefined}
            image={product.image?.url ? `${product.image.url}?auto=format` : undefined}
            slug={product.slug}
            whatsappLink={product.whatsappLink ?? undefined}
            fallbackWhatsappPhone={contactPhone}
          />
        ))}
      </div>

      {hasMore ? (
        <div className="flex justify-center">
          <Button
            onClick={handleLoadMore}
            variant="link"
            textCase="uppercase"
            className="text-base font-semibold"
            disabled={loading}
          >
            {loading ? `${loadMoreLabel}…` : loadMoreLabel}
          </Button>
        </div>
      ) : null}
    </div>
  );
};
