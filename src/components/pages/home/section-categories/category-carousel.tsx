"use client";

import Link from "next/link";
import { useRef } from "react";

import { Button } from "@/components/ui/button";
import type { Locale } from "@/lib/i18n";
import type { Category } from "@/sanity/types";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { CategoryCard } from "./category-card";

type CategoryCarouselProps = {
  categories: Category[];
  locale: Locale;
  copy: {
    eyebrow: string;
    title: string;
    subtitle: string;
    viewAll: string;
  };
};

export const CategoryCarousel = ({ categories, locale, copy }: CategoryCarouselProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: "left" | "right") => {
    const container = scrollRef.current;
    if (!container) return;

    const scrollAmount = Math.max(container.clientWidth * 0.85, 280);
    const offset = direction === "left" ? -scrollAmount : scrollAmount;
    container.scrollBy({ left: offset, behavior: "smooth" });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.15em] text-primary/70">
            {copy.eyebrow}
          </p>
          <h2 className="heading-2 text-balance">{copy.title}</h2>
          <p className="max-w-2xl text-base text-muted-foreground">
            {copy.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="icon"
              className="size-10 rounded-full shadow-sm"
              onClick={() => handleScroll("left")}
              aria-label="Scroll categories left"
            >
              <ChevronLeft className="size-5" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="size-10 rounded-full shadow-sm"
              onClick={() => handleScroll("right")}
              aria-label="Scroll categories right"
            >
              <ChevronRight className="size-5" />
            </Button>
          </div>

          <Button
            asChild
            variant="default"
            size="lg"
            shape="pill"
            className="hidden whitespace-nowrap sm:inline-flex"
          >
            <Link href={`/${locale}/categories`}>{copy.viewAll}</Link>
          </Button>
        </div>
      </div>

      <div className="relative">
        <div
          ref={scrollRef}
          className="-mx-2 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 pl-2 pr-8 scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {categories.map((category) => (
            <CategoryCard key={category._id} category={category} variant="carousel" locale={locale} />
          ))}
        </div>

        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-secondary/10 via-secondary/0 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-secondary/10 via-secondary/0 to-transparent" />
      </div>

      <div className="flex justify-center sm:hidden">
        <Button asChild variant="default" size="lg" shape="pill" width="full">
          <Link href={`/${locale}/categories`}>{copy.viewAll}</Link>
        </Button>
      </div>
    </div>
  );
};
