import Link from "next/link";
import { Phone, Mail, MessageCircle, Instagram } from "lucide-react";
import type { Locale } from "@/lib/i18n";

type FooterProps = {
  locale: Locale;
};

export const Footer = ({ locale }: FooterProps) => {
  const isAz = locale === "az";

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
    phone: "+994558944511",
    email: "office@turtlewax.az",
  };

  const socialLinks = [
    {
      name: "Telegram",
      href: "https://t.me/turtlewax_az",
      icon: MessageCircle,
    },
    {
      name: "Instagram",
      href: "https://www.instagram.com/turtlewax.az/",
      icon: Instagram,
    },
    {
      name: "WhatsApp",
      href: "https://api.whatsapp.com/send?phone=994558944511",
      icon: Phone,
    },
  ];

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
            <ul className="space-y-3">
              <li>
                <a
                  href={`tel:${contactInfo.phone}`}
                  className="flex items-center gap-2 hover:text-white transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  {contactInfo.phone}
                </a>
              </li>
              <li>
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
              {socialLinks.map((social) => {
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
        </div>

        {/* Bottom Copyright Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex items-center gap-3">
            <Link href={`/${locale}`} className="text-xl font-bold text-white">
              TurtleWax
            </Link>
            <span className="text-sm text-gray-400">
              Copyright © {new Date().getFullYear()} Turtle Wax.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
