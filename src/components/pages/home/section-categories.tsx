import type { Locale } from "@/lib/i18n";
import { getCategories, getHomeSectionsCopy } from "@/sanity/queries";

import { CategoryCarousel } from "./section-categories/category-carousel";

type SectionCategoriesProps = {
  locale: Locale;
};

export const SectionCategories = async ({ locale }: SectionCategoriesProps) => {
  const [categories, homeCopy] = await Promise.all([
    getCategories(locale),
    getHomeSectionsCopy(locale),
  ]);

  if (!categories.length) {
    return null;
  }

  const copy = {
    eyebrow: homeCopy?.categories?.eyebrow ?? "",
    title: homeCopy?.categories?.title ?? "",
    subtitle: homeCopy?.categories?.subtitle ?? "",
    viewAll: homeCopy?.categories?.viewAll ?? "",
  };

  return (
    <section className="section bg-secondary/10">
      <div className="container">
        <CategoryCarousel categories={categories} locale={locale} copy={copy} />
      </div>
    </section>
  );
};
