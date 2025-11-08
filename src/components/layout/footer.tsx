import Image from "next/image";
import Link from "next/link";
import { Phone, Mail, Download } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { getContactPage, getSiteSettings } from "@/sanity/queries";

type FooterProps = {
  locale: Locale;
};

const SOCIAL_ICON_MAP: Record<string, { src: string; alt: string }> = {
  telegram: { src: "/images/socials-icon/telegram.svg", alt: "Telegram" },
  instagram: { src: "/images/socials-icon/instagram.svg", alt: "Instagram" },
  whatsapp: { src: "/images/socials-icon/whatsapp.svg", alt: "WhatsApp" },
};

export const Footer = async ({ locale }: FooterProps) => {
  const isAz = locale === "az";

  const [contactContent, siteSettings] = await Promise.all([
    getContactPage(locale),
    getSiteSettings(locale),
  ]);

  const footerSections = {
    pages: {
      title: isAz ? "Səhifələr" : "Страницы",
      links: [
        { label: isAz ? "Ana səhifə" : "Главная", href: `/${locale}` },
        { label: isAz ? "Haqqımızda" : "О нас", href: `/${locale}/about` },
        { label: isAz ? "Kateqoriyalar" : "Категории", href: `/${locale}/categories` },
        { label: isAz ? "Əlaqə" : "Контакты", href: `/${locale}/contact` },
      ],
    },
    support: {
      title: isAz ? "Dəstək" : "Поддержка",
      links: [
        { label: isAz ? "Məxfilik siyasəti" : "Политика конфиденциальности", href: `/${locale}/policy` },
        { label: isAz ? "İstifadə şərtləri" : "Условия использования", href: `/${locale}/terms` },
      ],
    },
  };

  const contactInfo = {
    phone: contactContent?.phone || null,
    phoneLabel: contactContent?.phoneLabel || null,
    email: contactContent?.email || null,
    emailLabel: contactContent?.emailLabel || null,
  };

  const socialLinks = (contactContent?.socials || [])
    .map((social) => {
      if (!social?.url || !social.platform) return null;
      const icon = SOCIAL_ICON_MAP[social.platform] || SOCIAL_ICON_MAP.telegram;
      return {
        name: social.label || social.platform,
        href: social.url,
        icon,
      };
    })
    .filter(Boolean) as Array<{ name: string; href: string; icon: { src: string; alt: string } }>;

  const catalog = {
    title: siteSettings?.catalogTitle || (isAz ? "Kataloq" : "Каталог"),
    cta: siteSettings?.catalogCta || (isAz ? "Yüklə" : "Скачать"),
    fileUrl: siteSettings?.catalogFile?.url,
  };

  return (
    <footer className="bg-gray-100 text-gray-700" lang={locale}>
      <div className="container py-12 md:py-16 px-4">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {/* Pages Section */}
          <div>
            <h3 className="text-gray-900 font-semibold text-lg mb-4">
              {footerSections.pages.title}
            </h3>
            <ul className="space-y-3">
              {footerSections.pages.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-gray-900 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Section */}
          <div>
            <h3 className="text-gray-900 font-semibold text-lg mb-4">
              {footerSections.support.title}
            </h3>
            <ul className="space-y-3">
              {footerSections.support.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-gray-900 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h3 className="text-gray-900 font-semibold text-lg mb-4">
              {isAz ? "Əlaqə" : "Контакты"}
            </h3>
            <ul className="space-y-3 text-sm">
              {contactInfo.phone ? (
                <li>
                  {contactInfo.phoneLabel && (
                    <p className="text-gray-600 mb-1">{contactInfo.phoneLabel}</p>
                  )}
                  <a
                    href={`tel:${contactInfo.phone}`}
                    className="flex items-center gap-2 hover:text-gray-900 transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    {contactInfo.phone}
                  </a>
                </li>
              ) : (
                <li className="text-gray-500">
                  {isAz ? "Telefon məlumatı əlavə edilməyib." : "Телефон не указан в CMS."}
                </li>
              )}
              {contactInfo.email ? (
                <li>
                  {contactInfo.emailLabel && (
                    <p className="text-gray-600 mb-1">{contactInfo.emailLabel}</p>
                  )}
                  <a
                    href={`mailto:${contactInfo.email}`}
                    className="flex items-center gap-2 hover:text-gray-900 transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    {contactInfo.email}
                  </a>
                </li>
              ) : (
                <li className="text-gray-500">
                  {isAz ? "E-poçt ünvanı əlavə edilməyib." : "Email не указан в CMS."}
                </li>
              )}
            </ul>
          </div>

          {/* Social Media Section */}
          <div>
            <h3 className="text-gray-900 font-semibold text-lg mb-4">
              {isAz ? "Sosial şəbəkə" : "Социальные сети"}
            </h3>
            {socialLinks.length > 0 ? (
              <div className="flex gap-6">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center"
                    aria-label={social.name}
                  >
                    <Image
                      src={social.icon.src}
                      alt={social.icon.alt}
                      width={40}
                      height={40}
                      className="transition-transform duration-200 hover:scale-110"
                    />
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                {isAz ? "Sosial linklər hələ əlavə edilməyib." : "Ссылки на соцсети ещё не добавлены."}
              </p>
            )}
          </div>

          {/* Catalog Download */}
          <div>
            <h3 className="text-gray-900 font-semibold text-lg mb-4">{catalog.title}</h3>
            <p className="text-sm text-gray-600 mb-4">
              {isAz
                ? "Son kataloqu yükləyin və bütün məhsulları nəzərdən keçirin."
                : "Скачайте актуальный каталог со всеми продуктами."}
            </p>
            {catalog.fileUrl ? (
              <a
                href={catalog.fileUrl}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-white hover:opacity-90"
                download
                target="_blank"
                rel="noopener noreferrer"
              >
                <Download className="w-4 h-4" />
                {catalog.cta}
              </a>
            ) : (
              <p className="text-sm text-gray-500">
                {isAz ? "Tezliklə mövcud olacaq." : "Скоро будет доступно."}
              </p>
            )}
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex items-center gap-3">
            <Image
              src="/images/footer_logo.png"
              alt="Turtle Wax logo"
              width={2480}
              height={1771}
              className="h-10 w-auto"
              priority={false}
            />
            <span className="text-sm text-gray-600">
              Copyright © {new Date().getFullYear()} Turtle Wax.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
