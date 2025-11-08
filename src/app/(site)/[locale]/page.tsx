import { notFound } from "next/navigation";

import { SectionCategories } from "@/components/pages/home/section-categories";
import { SectionFeaturesProducts } from "@/components/pages/home/section-features-products";
import { SectionHero } from "@/components/pages/home/section-hero";
import { SectionProducts } from "@/components/pages/home/section-products";
import { isLocale, type Locale } from "@/lib/i18n";

type HomePageProps = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: HomePageProps) {
  const { locale: localeParam } = await params;

  if (!isLocale(localeParam)) {
    notFound();
  }

  const locale: Locale = localeParam;

  return (
    <>
      <SectionHero locale={locale} />
      <SectionFeaturesProducts locale={locale} />
      <SectionCategories locale={locale} />
      <SectionProducts locale={locale} />
    </>
  );
}

export const revalidate = 60;
