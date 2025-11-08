export const locales = ["az", "ru"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "az";

export const localeLabels: Record<Locale, string> = {
  az: "AZ",
  ru: "RU",
};

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function getLocaleFromParams(localeParam: string | string[] | undefined) {
  if (!localeParam) {
    return defaultLocale;
  }

  const locale = Array.isArray(localeParam) ? localeParam[0] : localeParam;
  return isLocale(locale) ? locale : defaultLocale;
}

export function getBuyNowLabel(locale?: Locale) {
  switch (locale) {
    case "az":
      return "İndi al";
    case "ru":
      return "Купить сейчас";
    default:
      return "Buy Now";
  }
}

export function getProductDetailCopy(locale?: Locale) {
  switch (locale) {
    case "az":
      return {
        backToHome: "← Ana səhifəyə qayıt",
        sizeLabel: "Ölçü",
        imageFallback: "Məhsul şəkli tezliklə",
      };
    case "ru":
      return {
        backToHome: "← Вернуться на главную",
        sizeLabel: "Объём",
        imageFallback: "Изображение товара скоро появится",
      };
    default:
      return {
        backToHome: "← Back to Home",
        sizeLabel: "Size",
        imageFallback: "Product image coming soon",
      };
  }
}

export function getCategoriesPageCopy(locale?: Locale) {
  switch (locale) {
    case "az":
      return {
        title: "Kateqoriyalar",
        subtitle: "Turtle Wax məhsullarını araşdırmaq üçün kateqoriya seçin.",
        empty: "Hələ kateqoriyalar dərc edilməyib.",
      };
    case "ru":
      return {
        title: "Категории",
        subtitle: "Выберите категорию, чтобы познакомиться с продуктами Turtle Wax.",
        empty: "Категории пока не опубликованы.",
      };
    default:
      return {
        title: "Categories",
        subtitle: "Choose a category to explore Turtle Wax products.",
        empty: "No categories published yet.",
      };
  }
}

export function getCategoryDetailCopy(locale?: Locale) {
  switch (locale) {
    case "az":
      return {
        eyebrow: "Kateqoriya",
        productListTitle: "Bu kateqoriyada məhsullar",
        empty: "Bu kateqoriyada hələ məhsul əlavə edilməyib.",
        backLabel: "Kateqoriyalara qayıt",
      };
    case "ru":
      return {
        eyebrow: "Категория",
        productListTitle: "Товары этой категории",
        empty: "В эту категорию ещё не добавлены товары.",
        backLabel: "Вернуться к категориям",
      };
    default:
      return {
        eyebrow: "Category",
        productListTitle: "Products in this category",
        empty: "No products have been added to this category yet.",
        backLabel: "Back to categories",
      };
  }
}

export function getAllProductsPageCopy(locale?: Locale) {
  switch (locale) {
    case "az":
      return {
        title: "Bütün məhsullar",
        subtitle: "Turtle Wax kataloqunu tam şəkildə araşdırın və avtomobiliniz üçün lazım olan hər şeyi tapın.",
        loadMore: "Daha çox məhsul",
        empty: "Hazırda göstəriləcək məhsul yoxdur.",
      };
    case "ru":
      return {
        title: "Все продукты",
        subtitle: "Изучайте полный каталог Turtle Wax и находите нужные средства ухода.",
        loadMore: "Показать больше товаров",
        empty: "Сейчас нечего показывать.",
      };
    default:
      return {
        title: "All products",
        subtitle: "Browse the complete Turtle Wax catalog and find the right care for every surface.",
        loadMore: "Show more products",
        empty: "No products available right now.",
      };
  }
}

type WhatsAppMessageOptions = {
  productName: string;
  price?: number | null;
  discountPrice?: number | null;
  size?: string | null;
  sizeLabel?: string | null;
};

function formatPrice(value?: number | null) {
  if (typeof value !== "number") {
    return null;
  }

  return `${value.toFixed(2)} AZN`;
}

export function getWhatsAppOrderMessage(
  locale: Locale | undefined,
  { productName, price, discountPrice, size, sizeLabel }: WhatsAppMessageOptions,
) {
  const formattedPrice = formatPrice(price);
  const formattedDiscount = formatPrice(discountPrice);
  const hasDiscount = formattedDiscount !== null && (!!formattedPrice ? discountPrice! < price! : true);

  if (locale === "az") {
    const lines = [`Salam! ${productName} sifariş etmək istəyirəm.`];

    if (hasDiscount && formattedDiscount) {
      lines.push(`Qiymət: ${formattedDiscount}.`);
      if (formattedPrice) {
        lines.push(`Köhnə qiymət: ${formattedPrice}.`);
      }
    } else if (formattedPrice) {
      lines.push(`Qiymət: ${formattedPrice}.`);
    }

    if (size) {
      lines.push(`${sizeLabel ?? "Ölçü"}: ${size}`);
    }

    return lines.join("\n");
  }

  if (locale === "ru") {
    const lines = [`Здравствуйте! Хочу заказать ${productName}.`];

    if (hasDiscount && formattedDiscount) {
      lines.push(`Цена: ${formattedDiscount}.`);
      if (formattedPrice) {
        lines.push(`Старая цена: ${formattedPrice}.`);
      }
    } else if (formattedPrice) {
      lines.push(`Цена: ${formattedPrice}.`);
    }

    if (size) {
      lines.push(`${sizeLabel ?? "Объём"}: ${size}`);
    }

    return lines.join("\n");
  }

  const lines = [`Hello! I'd like to order ${productName}.`];

  if (hasDiscount && formattedDiscount) {
    lines.push(`Price: ${formattedDiscount}.`);
    if (formattedPrice) {
      lines.push(`Original price: ${formattedPrice}.`);
    }
  } else if (formattedPrice) {
    lines.push(`Price: ${formattedPrice}.`);
  }

  if (size) {
    lines.push(`${sizeLabel ?? "Size"}: ${size}`);
  }

  return lines.join("\n");
}
