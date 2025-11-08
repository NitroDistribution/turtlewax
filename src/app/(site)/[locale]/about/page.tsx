import Image from "next/image";
import { notFound } from "next/navigation";

import { isLocale, type Locale } from "@/lib/i18n";
import { getAboutPage } from "@/sanity/queries";

type AboutPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale: localeParam } = await params;

  if (!isLocale(localeParam)) {
    notFound();
  }

  const locale: Locale = localeParam;
  const about = await getAboutPage(locale);

  if (!about) {
    notFound();
  }

  const heroImageUrl = about.heroImage?.url ?? null;
  const heroImageAlt = about.heroImage?.alt || about.title;
  const paragraphs = Array.isArray(about.paragraphs)
    ? about.paragraphs.filter((paragraph): paragraph is string => Boolean(paragraph && paragraph.trim()))
    : [];
  const videoTitle = about.videoTitle ?? "";
  const videoUrl = about.videoUrl ?? "";
  const missingImageMessage = locale === "ru" ? "Загрузите изображение в Sanity" : "Sanity-də şəkil əlavə edin";

  return (
    <>
      {/* About Section */}
      <section className="section">
        <div className="container">
          <h1 className="heading-2 mb-8 md:mb-12">{about.title}</h1>
          <div className="grid gap-8 md:grid-cols-2 md:gap-12 items-center">
            {/* Image */}
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              {heroImageUrl ? (
                <Image
                  src={`${heroImageUrl}?auto=format`}
                  alt={heroImageAlt}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-muted text-muted-foreground">
                  <span>{missingImageMessage}</span>
                </div>
              )}
            </div>
            {/* Text Content */}
            <div className="space-y-6">
              {paragraphs.map((paragraph, index) => (
                <p key={index} className="text-gray-700 text-base md:text-lg leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* YouTube Video Section */}
      {videoUrl ? (
        <section className="section bg-secondary/10">
          <div className="container">
            {videoTitle ? <h2 className="heading-2 mb-8 text-center">{videoTitle}</h2> : null}
            <div className="mx-auto max-w-4xl">
              <div className="relative aspect-video overflow-hidden rounded-2xl shadow-lg">
                <iframe
                  src={videoUrl}
                  title={videoTitle || undefined}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 h-full w-full"
                />
              </div>
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}

export const revalidate = 60;
