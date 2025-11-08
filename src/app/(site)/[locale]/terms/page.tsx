import { notFound } from "next/navigation";

import { isLocale, type Locale } from "@/lib/i18n";
import { getTermsPage } from "@/sanity/queries";

type TermsPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function TermsPage({ params }: TermsPageProps) {
  const { locale: localeParam } = await params;

  if (!isLocale(localeParam)) {
    notFound();
  }

  const locale: Locale = localeParam;
  const terms = await getTermsPage(locale);

  if (!terms) {
    notFound();
  }

  const paragraphs = Array.isArray(terms.content)
    ? terms.content.filter((paragraph): paragraph is string => Boolean(paragraph && paragraph.trim()))
    : [];

  return (
    <section className="section">
      <div className="container max-w-3xl">
        <h1 className="heading-2 mb-6 text-center">{terms.title}</h1>
        <div className="space-y-4 text-base leading-relaxed text-gray-700">
          {paragraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </div>
    </section>
  );
}

export const revalidate = 60;
