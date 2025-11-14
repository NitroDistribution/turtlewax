import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { isLocale, locales, type Locale } from "@/lib/i18n";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next"

type LocaleLayoutProps = {
  children: ReactNode;
  params?: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const resolvedParams = params ? await params : undefined;
  const localeParam = resolvedParams?.locale;

  if (!localeParam || !isLocale(localeParam)) {
    notFound();
  }

  const locale: Locale = localeParam;

  return (
    <>
      <Header locale={locale} />
      <main>{children}</main>
      <Footer locale={locale} />
      <Analytics />
      <SpeedInsights />
    </>
  );
}
