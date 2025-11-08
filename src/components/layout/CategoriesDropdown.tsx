"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import type { Category } from "@/sanity/types";
import type { Locale } from "@/lib/i18n";

type CategoriesDropdownProps = {
  categories: Category[];
  locale: Locale;
};

export const CategoriesDropdown = ({ categories, locale }: CategoriesDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 text-gray-700 hover:text-primary transition-colors"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {locale === "az" ? "Kateqoriyalar" : "Категории"}
        <ChevronDown
          className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-56 bg-white shadow-lg rounded-lg py-2 z-50 border border-gray-100">
          <Link
            href={`/${locale}/categories`}
            className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors font-medium"
            onClick={() => setIsOpen(false)}
          >
            {locale === "az" ? "Bütün kateqoriyalar" : "Все категории"}
          </Link>
          <div className="h-px bg-gray-200 my-1" />
          {categories.map((category) => (
            <Link
              key={category._id}
              href={`/${locale}/categories/${category.slug}`}
              className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              {category.title}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
