import Link from "next/link";
import { Phone, Mail, MessageCircle, Instagram, Download } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { getContactPage, getSiteSettings } from "@/sanity/queries";

type FooterProps = {
  locale: Locale;
};

const SOCIAL_ICON_MAP: Record<string, LucideIcon> = {
  telegram: MessageCircle,
  instagram: Instagram,
  whatsapp: MessageCircle,
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
    phone: contactContent?.phone || "+994558944511",
    phoneLabel: contactContent?.phoneLabel || (isAz ? "Telefon" : "Телефон"),
    email: contactContent?.email || "office@turtlewax.az",
    emailLabel: contactContent?.emailLabel || (isAz ? "E-poçt" : "Почта"),
  };

  const socialLinks = (contactContent?.socials || [])
    .map((social) => {
      if (!social?.url || !social.platform) return null;
      const Icon = SOCIAL_ICON_MAP[social.platform] || MessageCircle;
      return {
        name: social.label || social.platform,
        href: social.url,
        icon: Icon,
      };
    })
    .filter(Boolean) as Array<{ name: string; href: string; icon: LucideIcon }>;

  const catalog = {
    title: siteSettings?.catalogTitle || (isAz ? "Kataloq" : "Каталог"),
    cta: siteSettings?.catalogCta || (isAz ? "Yüklə" : "Скачать"),
    fileUrl: siteSettings?.catalogFile?.url,
  };

  return (
    <footer className="bg-gray-900 text-gray-300" lang={locale}>
      <div className="container py-12 md:py-16 px-4">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {/* Pages Section */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">
              {footerSections.pages.title}
            </h3>
            <ul className="space-y-3">
              {footerSections.pages.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Section */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">
              {footerSections.support.title}
            </h3>
            <ul className="space-y-3">
              {footerSections.support.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">
              {isAz ? "Əlaqə" : "Контакты"}
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <p className="text-gray-400 mb-1">{contactInfo.phoneLabel}</p>
                <a
                  href={`tel:${contactInfo.phone}`}
                  className="flex items-center gap-2 hover:text-white transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  {contactInfo.phone}
                </a>
              </li>
              <li>
                <p className="text-gray-400 mb-1">{contactInfo.emailLabel}</p>
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="flex items-center gap-2 hover:text-white transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  {contactInfo.email}
                </a>
              </li>
            </ul>
          </div>

          {/* Social Media Section */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">
              {isAz ? "Sosial şəbəkə" : "Социальные сети"}
            </h3>
            <div className="flex gap-4">
              {(socialLinks.length > 0 ? socialLinks : [
                {
                  name: "Telegram",
                  href: "https://t.me/turtlewax_az",
                  icon: MessageCircle,
                },
              ]).map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                    aria-label={social.name}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Catalog Download */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">{catalog.title}</h3>
            <p className="text-sm text-gray-400 mb-4">
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
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-400">
              Copyright © {new Date().getFullYear()} Turtle Wax.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
