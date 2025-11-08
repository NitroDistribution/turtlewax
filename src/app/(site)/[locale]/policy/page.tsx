import { notFound } from "next/navigation";

import { isLocale, type Locale } from "@/lib/i18n";
import { getPrivacyPage } from "@/sanity/queries";

type PolicyPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function PolicyPage({ params }: PolicyPageProps) {
  const { locale: localeParam } = await params;

  if (!isLocale(localeParam)) {
    notFound();
  }

  const locale: Locale = localeParam;
  const policy = await getPrivacyPage(locale);

  if (!policy) {
    notFound();
  }

  const paragraphs = Array.isArray(policy.content)
    ? policy.content.filter((paragraph): paragraph is string => Boolean(paragraph && paragraph.trim()))
    : [];

  return (
    <section className="section">
      <div className="container max-w-3xl">
        <h1 className="heading-2 mb-6 text-center">{policy.title}</h1>
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
