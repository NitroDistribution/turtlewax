import Link from "next/link";

import { Button } from "@/components/ui/button";
import type { Locale } from "@/lib/i18n";
import { getHeroSection } from "@/sanity/queries";

type SectionHeroProps = {
  locale: Locale;
};

export const SectionHero = async ({ locale }: SectionHeroProps) => {
  const hero = await getHeroSection(locale);

  const backgroundUrl = hero?.backgroundImage?.url
    ? `${hero.backgroundImage.url}?auto=format`
    : undefined;

  return (
    <section className="section py-5">
      <div
        className="container min-h-[700px] overflow-hidden rounded-2xl bg-cover bg-center bg-no-repeat p-10 text-white"
        style={
          backgroundUrl
            ? {
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.55), rgba(0, 0, 0, 0.55)), url(${backgroundUrl})`,
              }
            : undefined
        }
      >
        <div className="flex min-h-[580px] flex-col justify-end space-y-8">
          <div className="max-w-3xl space-y-6">
            <h1 className="heading-2 text-white">
              {hero?.title ?? "Hero title"}
            </h1>
            <p className="max-w-2xl text-lg">
              {hero?.subtitle ?? "Add a subtitle in Sanity to replace this placeholder."}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg" shape="pill">
              <Link href={`/${locale}/categories`}>
                {locale === "ru" ? "Категории" : "Kateqoriyalar"}
              </Link>
            </Button>
            <Button asChild size="lg" shape="pill" variant="secondary">
              <Link href={`/${locale}/products`}>
                {locale === "ru" ? "Все продукты" : "Bütün məhsullar"}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
