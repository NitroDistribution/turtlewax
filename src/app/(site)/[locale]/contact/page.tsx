import Image from "next/image";
import { notFound } from "next/navigation";
import { Phone, Mail, MessageCircle, Instagram, Clock } from "lucide-react";

import { isLocale, type Locale } from "@/lib/i18n";
import { getContactPage } from "@/sanity/queries";

type ContactPageProps = {
  params: Promise<{ locale: string }>;
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
  const missingImageMessage =
    locale === "ru" ? "Загрузите изображение в Sanity" : "Sanity-də şəkil əlavə edin";

  const socialVariantMap: Record<
    string,
    { icon: typeof MessageCircle; color: string }
  > = {
    telegram: { icon: MessageCircle, color: "hover:bg-[#0088cc]" },
    instagram: {
      icon: Instagram,
      color: "hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-500",
    },
    whatsapp: { icon: Phone, color: "hover:bg-[#25D366]" },
  };

  return (
    <>
      {/* Main Contact Section with Image */}
      <section className="section">
        <div className="container">
          <h1 className="heading-2 mb-8 md:mb-12 text-center">{contact.title}</h1>
          {contact.subtitle ? (
            <p className="text-lg text-gray-600 mb-12 text-center max-w-2xl mx-auto">
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
                const variant = socialVariantMap[platformKey] ?? {
                  icon: MessageCircle,
                  color: "hover:bg-primary",
                };
                const Icon = variant.icon;
                const label = social.label || social.platform || `Social ${index + 1}`;
                return (
                  <a
                    key={social._key ?? `${social.platform}-${index}`}
                    href={social.url ?? "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group flex items-center gap-4 bg-white rounded-2xl border border-gray-200 px-8 py-6 hover:shadow-lg hover:border-transparent transition-all ${variant.color}`}
                  >
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-white/20 transition-colors">
                      <Icon className="w-6 h-6 text-gray-700 group-hover:text-white transition-colors" />
                    </div>
                    <span className="text-lg font-semibold text-gray-900 group-hover:text-white transition-colors">
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
