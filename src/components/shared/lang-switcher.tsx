"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { localeLabels, locales, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type LangSwitcherProps = {
  locale: Locale;
  className?: string;
};

export const LangSwitcher = ({ locale, className }: LangSwitcherProps) => {
  const pathname = usePathname() ?? "/";
  const segments = pathname.split("/").filter(Boolean);
  const restSegments = segments.slice(1);

  return (
    <nav className={cn("flex items-center gap-2 text-xs font-semibold uppercase", className)}>
      {locales.map((targetLocale) => {
        const hrefSegments = [targetLocale, ...restSegments];
        const hrefPath = `/${hrefSegments.join("/")}`;
        const isActive = targetLocale === locale;

        return (
          <Link
            key={targetLocale}
            href={hrefPath}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "rounded-md px-2.5 py-1 transition-colors",
              isActive
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-foreground/70 hover:text-foreground"
            )}
          >
            {localeLabels[targetLocale]}
          </Link>
        );
      })}
    </nav>
  );
};
