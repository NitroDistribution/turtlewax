"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

import { cn } from "@/lib/utils";

type GalleryImage = {
  url?: string | null;
  alt?: string | null;
};

type NormalizedGalleryImage = {
  id: string;
  url: string;
  thumbnailUrl: string;
  alt: string;
};

type ProductGalleryProps = {
  primaryImage?: GalleryImage | null;
  galleryImages?: Array<GalleryImage | null> | null;
  fallbackLabel: string;
  fallbackAlt: string;
};

const appendParams = (url: string, params: string) => {
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}${params}`;
};

export function ProductGallery({
  primaryImage,
  galleryImages,
  fallbackLabel,
  fallbackAlt,
}: ProductGalleryProps) {
  const normalizedImages = useMemo(() => {
    const seen = new Set<string>();
    const candidates = [primaryImage, ...(galleryImages ?? [])];
    const parsed: NormalizedGalleryImage[] = [];

    candidates.forEach((image, index) => {
      const url = image?.url?.trim();
      if (!url || seen.has(url)) {
        return;
      }

      seen.add(url);
      const id = `${url}-${index}`;

      parsed.push({
        id,
        url: appendParams(url, "auto=format&fit=max"),
        thumbnailUrl: appendParams(url, "auto=format&w=200&h=200&fit=crop"),
        alt: image?.alt?.trim() || fallbackAlt,
      });
    });

    return parsed;
  }, [primaryImage, galleryImages, fallbackAlt]);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const hasImages = normalizedImages.length > 0;
  const activeIndex = hasImages ? Math.min(selectedIndex, normalizedImages.length - 1) : -1;
  const activeImage = activeIndex >= 0 ? normalizedImages[activeIndex] : null;

  return (
    <div className="space-y-4">
      <div className="relative aspect-square overflow-hidden rounded-xl border border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100/50">
        {activeImage ? (
          <Image
            key={activeImage.id}
            src={activeImage.url}
            alt={activeImage.alt}
            fill
            className="object-contain p-8"
            sizes="(min-width: 1024px) 50vw, 100vw"
            priority={activeIndex === 0}
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="text-sm text-muted-foreground">{fallbackLabel}</span>
          </div>
        )}
      </div>

      {normalizedImages.length > 1 ? (
        <div className="flex flex-wrap gap-3">
          {normalizedImages.map((image, index) => (
            <button
              key={image.id}
              type="button"
              onClick={() => setSelectedIndex(index)}
              aria-pressed={index === activeIndex}
              className={cn(
                "group relative h-20 w-20 overflow-hidden rounded-lg border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                index === activeIndex
                  ? "border-primary shadow-sm"
                  : "border-gray-200 hover:border-primary/60",
              )}
            >
              <Image
                src={image.thumbnailUrl}
                alt={image.alt}
                fill
                className="object-contain p-2"
                sizes="80px"
              />
              <span className="sr-only">Select product image {index + 1}</span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
