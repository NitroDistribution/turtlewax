"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import type { Category } from "@/sanity/types";
import type { Locale } from "@/lib/i18n";

type MobileMenuProps = {
  categories: Category[];
  locale: Locale;
};

export const MobileMenu = ({ categories, locale }: MobileMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [menuTopOffset, setMenuTopOffset] = useState(0);
  const toggleButtonRef = useRef<HTMLButtonElement>(null);

  const calculateMenuOffset = useCallback(() => {
    const headerElement = toggleButtonRef.current?.closest("header");

    if (!headerElement) {
      return 0;
    }

    const { bottom } = headerElement.getBoundingClientRect();
    return Math.round(bottom);
  }, []);

  const closeMenu = () => {
    setIsOpen(false);
    setIsCategoriesOpen(false);
  };

  const navigationLinks = [
    { href: `/${locale}/about`, label: locale === "az" ? "Haqqımızda" : "О нас" },
    { href: `/${locale}/contact`, label: locale === "az" ? "Əlaqə" : "Контакты" },
  ];

  // Keep the menu aligned under the sticky header and lock background scroll while open.
  useEffect(() => {
    if (!isOpen) {
      document.body.style.removeProperty("overflow");
      return;
    }

    const updateOffset = () => {
      setMenuTopOffset(calculateMenuOffset());
    };

    updateOffset();
    document.body.style.overflow = "hidden";
    window.addEventListener("resize", updateOffset);

    return () => {
      window.removeEventListener("resize", updateOffset);
      document.body.style.removeProperty("overflow");
    };
  }, [calculateMenuOffset, isOpen]);

  return (
    <>
      {/* Mobile menu button */}
      <button
        ref={toggleButtonRef}
        onClick={() => {
          if (!isOpen) {
            setMenuTopOffset(calculateMenuOffset());
      }
      setIsOpen(!isOpen);
    }}
    className="md:hidden p-2 text-gray-700 hover:text-primary transition-colors"
    aria-label="Toggle menu"
  >
    {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
  </button>

      {/* Mobile menu overlay and panel */}
      {isOpen && typeof window !== "undefined"
        ? createPortal(
            <>
              {/* Backdrop overlay */}
              <div
                className="fixed left-0 right-0 bottom-0 bg-black/60 z-[80] md:hidden backdrop-blur-sm"
                style={{ top: menuTopOffset }}
                onClick={closeMenu}
              />

              {/* Menu panel - slides below header */}
              <div
                className="fixed left-0 right-0 bottom-0 bg-white z-[90] md:hidden overflow-y-auto"
                style={{ top: menuTopOffset }}
              >
                {/* Menu content */}
                <nav className="px-4 py-6">
                  {/* Main navigation links */}
                  <div className="space-y-1 mb-6">
                    {navigationLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="block px-4 py-3 text-gray-800 font-medium hover:bg-primary/5 hover:text-primary transition-all rounded-lg"
                        onClick={closeMenu}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>

                  {/* Categories section */}
                  <div className="border-t border-gray-200 pt-4">
                    <button
                      onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                      className="flex items-center justify-between w-full px-4 py-3 text-gray-800 font-medium hover:bg-primary/5 hover:text-primary transition-all rounded-lg"
                    >
                      <span>{locale === "az" ? "Kateqoriyalar" : "Категории"}</span>
                      <ChevronDown
                        className={`w-5 h-5 transition-transform duration-200 ${
                          isCategoriesOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {/* Categories dropdown */}
                    {isCategoriesOpen && (
                      <div className="mt-2 space-y-1 pl-2">
                        <Link
                          href={`/${locale}/categories`}
                          className="block px-4 py-2.5 text-gray-700 hover:text-primary hover:bg-primary/5 transition-all rounded-lg font-medium border-l-2 border-transparent hover:border-primary"
                          onClick={closeMenu}
                        >
                          {locale === "az" ? "Bütün kateqoriyalar" : "Все категории"}
                        </Link>
                        {categories.map((category) => (
                          <Link
                            key={category._id}
                            href={`/${locale}/categories/${category.slug}`}
                            className="block px-4 py-2.5 text-gray-600 hover:text-primary hover:bg-primary/5 transition-all rounded-lg border-l-2 border-transparent hover:border-primary"
                            onClick={closeMenu}
                          >
                            {category.title}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </nav>
              </div>
            </>,
            document.body
          )
        : null}
    </>
  );
};
