import Image from "next/image";
import Link from "next/link";

import type { Locale } from "@/lib/i18n";
import type { Category } from "@/sanity/types";

import { cn } from "@/lib/utils";

type CategoryCardVariant = "carousel" | "grid";

type CategoryCardProps = {
  category: Category;
  variant?: CategoryCardVariant;
  className?: string;
  locale: Locale;
};

const variantContainer: Record<CategoryCardVariant, string> = {
  carousel: "min-w-[340px] max-w-[400px] lg:min-w-[400px] lg:max-w-[460px]",
  grid: "w-full",
};

const variantImageWrapper: Record<CategoryCardVariant, string> = {
  carousel: "h-[480px]",
  grid: "h-[480px] sm:h-[520px] lg:h-[560px]",
};

export const CategoryCard = ({
  category,
  variant = "grid",
  className,
  locale,
}: CategoryCardProps) => {
  const containerClasses = cn(
    "relative isolate flex snap-start flex-col overflow-hidden rounded-3xl border border-border bg-card",
    variantContainer[variant],
    className,
  );

  const imageWrapperClasses = cn("relative w-full overflow-hidden", variantImageWrapper[variant]);

  const imageSizes =
    variant === "grid"
      ? "(min-width: 1280px) 28vw, (min-width: 1024px) 35vw, (min-width: 640px) 45vw, 90vw"
      : "(min-width: 1280px) 26vw, (min-width: 1024px) 32vw, (min-width: 640px) 60vw, 80vw";

  const href = `/${locale}/categories/${category.slug}`;

  return (
    <Link
      href={href}
      className="group block rounded-3xl focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      aria-label={category.title}
    >
      <article className={containerClasses}>
        <div className={imageWrapperClasses}>
          {category.image?.url ? (
            <Image
              src={`${category.image.url}?auto=format`}
              alt={category.image.alt ?? category.title}
              fill
              className="object-cover transition duration-500 group-hover:scale-105"
              sizes={imageSizes}
              priority={false}
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-muted">
              <span className="text-sm text-muted-foreground">{category.title}</span>
            </div>
          )}
        </div>

        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/65 via-black/10 to-transparent transition group-hover:from-black/75" />

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 p-6">
          <p className="text-2xl font-semibold uppercase tracking-[0.2em] text-white">
            {category.title}
          </p>
        </div>
      </article>
    </Link>
  );
};
