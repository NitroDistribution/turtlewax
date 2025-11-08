import Link from "next/link";
import { LangSwitcher } from "@/components/shared/lang-switcher";
import { CategoriesDropdown } from "./CategoriesDropdown";
import { MobileMenu } from "./MobileMenu";
import { getCategories } from "@/sanity/queries";
import type { Locale } from "@/lib/i18n";

type HeaderProps = {
  locale: Locale;
};

export const Header = async ({ locale }: HeaderProps) => {
  const categories = await getCategories(locale);

  const navigationLinks = [
    { href: `/${locale}/about`, label: locale === "az" ? "Haqqımızda" : "О нас" },
    { href: `/${locale}/contact`, label: locale === "az" ? "Əlaqə" : "Контакты" },
  ];

  return (
    <header className="sticky top-0 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100/50 z-30 py-4">
      <div className="container flex items-center justify-between gap-8 px-4">
        {/* Logo */}
        <Link
          href={`/${locale}`}
          className="text-xl font-bold text-primary hover:opacity-80 transition-opacity"
        >
          TurtleWax
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 flex-1">
          {navigationLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-gray-700 hover:text-primary transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <CategoriesDropdown categories={categories} locale={locale} />
        </nav>

        {/* Right side - Language switcher */}
        <div className="flex items-center gap-4">
          <LangSwitcher locale={locale} />
          <MobileMenu categories={categories} locale={locale} />
        </div>
      </div>
    </header>
  );
};
