import Image from "next/image";
import { notFound } from "next/navigation";
import { Phone, Mail, Clock, MapPin } from "lucide-react";

import { isLocale, type Locale } from "@/lib/i18n";
import { getContactPage } from "@/sanity/queries";

type ContactPageProps = {
  params: Promise<{ locale: string }>;
};

const SOCIAL_ICON_MAP: Record<string, { src: string; alt: string }> = {
  telegram: { src: "/images/socials-icon/telegram.svg", alt: "Telegram" },
  instagram: { src: "/images/socials-icon/instagram.svg", alt: "Instagram" },
  whatsapp: { src: "/images/socials-icon/whatsapp.svg", alt: "WhatsApp" },
};

export default async function ContactPage({ params }: ContactPageProps) {
  const { locale: localeParam } = await params;

  if (!isLocale(localeParam)) {
    notFound();
  }

  const locale: Locale = localeParam;
  const contact = await getContactPage(locale);

  if (!contact) {
    notFound();
  }

  const heroImageUrl = contact.heroImage?.url ?? null;
  const heroImageAlt = contact.heroImage?.alt || contact.title;
  const phone = contact.phone?.trim() ?? "";
  const email = contact.email?.trim() ?? "";
  const phoneLabel = contact.phoneLabel ?? "";
  const emailLabel = contact.emailLabel ?? "";
  const infoTitle = contact.infoTitle ?? "";
  const infoPrimary = contact.infoPrimary ?? "";
  const infoSecondary = contact.infoSecondary ?? "";
  const socialsTitle = contact.socialsTitle ?? "";
  const socialsSubtitle = contact.socialsSubtitle ?? "";
  const socialLinks = Array.isArray(contact.socials)
    ? contact.socials.filter((social) => Boolean(social?.url && social.platform))
    : [];
  const retailCard = contact.retailLocationsCard;
  const retailLocations = Array.isArray(retailCard?.locations)
    ? retailCard?.locations.filter((location) => Boolean(location?.address || location?.locationName))
    : [];
  const hasRetailCard = Boolean(retailCard?.title || retailCard?.subtitle || retailLocations.length);
  const mapLabel = locale === "ru" ? "Открыть на карте" : "Xəritədə bax";
  const missingImageMessage =
    locale === "ru" ? "Загрузите изображение в Sanity" : "Sanity-də şəkil əlavə edin";

  return (
    <>
      {/* Main Contact Section with Image */}
      <section className="section">
        <div className="container">
          <h1 className="heading-2 mb-4 text-center">{contact.title}</h1>
          {contact.subtitle ? (
            <p className="text-lg text-gray-600 mb-10 text-center max-w-2xl mx-auto">
              {contact.subtitle}
            </p>
          ) : null}

          <div className="grid gap-12 md:grid-cols-2 items-center max-w-6xl mx-auto">
            {/* Image */}
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl order-2 md:order-1">
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

            {/* Contact Information */}
            <div className="space-y-6 order-1 md:order-2">
              {/* Phone */}
              {phone ? (
                <div className="flex items-start gap-4 p-6 bg-white rounded-2xl border border-gray-200 hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    {phoneLabel ? <h3 className="text-lg font-semibold mb-1">{phoneLabel}</h3> : null}
                    <a
                      href={`tel:${phone}`}
                      className="text-gray-600 hover:text-primary transition-colors"
                    >
                      {phone}
                    </a>
                  </div>
                </div>
              ) : null}

              {/* Email */}
              {email ? (
                <div className="flex items-start gap-4 p-6 bg-white rounded-2xl border border-gray-200 hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    {emailLabel ? <h3 className="text-lg font-semibold mb-1">{emailLabel}</h3> : null}
                    <a
                      href={`mailto:${email}`}
                      className="text-gray-600 hover:text-primary transition-colors break-all"
                    >
                      {email}
                    </a>
                  </div>
                </div>
              ) : null}

              {/* Business Hours */}
              {infoTitle || infoPrimary || infoSecondary ? (
                <div className="flex items-start gap-4 p-6 bg-white rounded-2xl border border-gray-200 hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    {infoTitle ? <h3 className="text-lg font-semibold mb-1">{infoTitle}</h3> : null}
                    {infoPrimary ? <p className="text-gray-600 text-sm">{infoPrimary}</p> : null}
                    {infoSecondary ? <p className="text-gray-600 text-sm">{infoSecondary}</p> : null}
                  </div>
                </div>
              ) : null}

              {/* Retail Locations */}
              {hasRetailCard ? (
                <div className="flex items-start gap-4 p-6 bg-white rounded-2xl border border-gray-200 hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    {retailCard?.title ? (
                      <h3 className="text-lg font-semibold mb-1">{retailCard.title}</h3>
                    ) : null}
                    {retailCard?.subtitle ? (
                      <p className="text-gray-600 text-sm mb-4 whitespace-pre-line">{retailCard.subtitle}</p>
                    ) : null}
                    {retailLocations.length ? (
                      <ul className="space-y-4">
                        {retailLocations.map((location) => (
                          <li key={location._key ?? location.locationName} className="text-sm text-gray-600">
                            {location.locationName ? (
                              <p className="font-semibold text-gray-900">{location.locationName}</p>
                            ) : null}
                            {location.address ? (
                              <p className="whitespace-pre-line">
                                {location.address}
                              </p>
                            ) : null}
                            {location.phone ? (
                              <a
                                href={`tel:${location.phone}`}
                                className="block text-primary mt-1 hover:underline"
                              >
                                {location.phone}
                              </a>
                            ) : null}
                            {location.mapUrl ? (
                              <a
                                href={location.mapUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-primary"
                              >
                                {mapLabel}
                              </a>
                            ) : null}
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {/* Social Media Section */}
      {socialsTitle || socialsSubtitle || socialLinks.length ? (
        <section className="section bg-secondary/10">
          <div className="container">
            {socialsTitle ? <h2 className="heading-2 mb-4 text-center">{socialsTitle}</h2> : null}
            {socialsSubtitle ? (
              <p className="text-lg text-gray-600 mb-10 text-center max-w-2xl mx-auto">
                {socialsSubtitle}
              </p>
            ) : null}
            <div className="flex flex-wrap gap-6 justify-center max-w-4xl mx-auto">
              {socialLinks.map((social, index) => {
                const platformKey = (social.platform ?? "").toLowerCase();
                const icon = SOCIAL_ICON_MAP[platformKey] ?? SOCIAL_ICON_MAP.telegram;
                const label = social.label || social.platform || `Social ${index + 1}`;
                return (
                  <a
                    key={social._key ?? `${social.platform}-${index}`}
                    href={social.url ?? "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-4 bg-white rounded-2xl border border-gray-200 px-8 py-6 hover:shadow-lg hover:border-primary transition-all"
                  >
                    <Image
                      src={icon.src}
                      alt={icon.alt}
                      width={40}
                      height={40}
                      className="transition-transform duration-200 group-hover:scale-105"
                    />
                    <span className="text-lg font-semibold text-gray-900 group-hover:text-primary">
                      {label}
                    </span>
                  </a>
                );
              })}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}

export const revalidate = 60;
