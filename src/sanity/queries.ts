import { cache } from "react";

import { groq } from "next-sanity";

import type { Locale } from "@/lib/i18n";
import type {
  AboutPageContent,
  Category,
  ContactPageContent,
  HeroContent,
  HomeSectionsCopy,
  LegalPageContent,
  Product,
  ProductDetail,
} from "./types";
import { sanityClient } from "./client";

export const heroQuery = groq`
  *[_type == "homeHeroSection"][0]{
    _id,
    "title": coalesce(select($locale == "az" => titleAz, titleRu), titleAz),
    "subtitle": coalesce(select($locale == "az" => subtitleAz, subtitleRu), subtitleAz),
    "backgroundImage": backgroundImage{
      "url": asset->url,
      "lqip": asset->metadata.lqip,
      "dimensions": asset->metadata.dimensions,
      "alt": coalesce(select($locale == "az" => altAz, altRu), altAz)
    }
  }
`;

export const getHeroSection = cache(async (locale: Locale) => {
  const hero = await sanityClient.fetch<HeroContent | null>(heroQuery, { locale });
  return hero;
});

const homeSectionsCopyQuery = groq`
  *[_type == "homeHeroSection"][0]{
    "featured": {
      "eyebrow": coalesce(select($locale == "az" => featuredSection.taglineAz, featuredSection.taglineRu), featuredSection.taglineAz),
      "title": coalesce(select($locale == "az" => featuredSection.titleAz, featuredSection.titleRu), featuredSection.titleAz),
      "subtitle": coalesce(select($locale == "az" => featuredSection.subtitleAz, featuredSection.subtitleRu), featuredSection.subtitleAz)
    },
    "categories": {
      "eyebrow": coalesce(select($locale == "az" => categoriesSection.taglineAz, categoriesSection.taglineRu), categoriesSection.taglineAz),
      "title": coalesce(select($locale == "az" => categoriesSection.titleAz, categoriesSection.titleRu), categoriesSection.titleAz),
      "subtitle": coalesce(select($locale == "az" => categoriesSection.subtitleAz, categoriesSection.subtitleRu), categoriesSection.subtitleAz),
      "viewAll": coalesce(select($locale == "az" => categoriesSection.viewAllAz, categoriesSection.viewAllRu), categoriesSection.viewAllAz)
    },
    "collection": {
      "eyebrow": coalesce(select($locale == "az" => collectionSection.taglineAz, collectionSection.taglineRu), collectionSection.taglineAz),
      "title": coalesce(select($locale == "az" => collectionSection.titleAz, collectionSection.titleRu), collectionSection.titleAz),
      "subtitle": coalesce(select($locale == "az" => collectionSection.subtitleAz, collectionSection.subtitleRu), collectionSection.subtitleAz),
      "viewAll": coalesce(select($locale == "az" => collectionSection.viewAllAz, collectionSection.viewAllRu), collectionSection.viewAllAz)
    }
  }
`;

export const getHomeSectionsCopy = cache(async (locale: Locale) => {
  const copy = await sanityClient.fetch<HomeSectionsCopy | null>(homeSectionsCopyQuery, { locale });
  return copy;
});

const aboutPageQuery = groq`
  *[_type == "aboutPage"][0]{
    _id,
    "title": coalesce(select($locale == "az" => titleAz, titleRu), titleAz),
    "heroImage": heroImage{
      "url": asset->url,
      "alt": coalesce(select($locale == "az" => altAz, altRu), altAz)
    },
    "paragraphs": coalesce(select($locale == "az" => paragraphsAz, paragraphsRu), paragraphsAz),
    "videoTitle": coalesce(select($locale == "az" => videoTitleAz, videoTitleRu), videoTitleAz),
    videoUrl
  }
`;

export const getAboutPage = cache(async (locale: Locale) => {
  const about = await sanityClient.fetch<AboutPageContent | null>(aboutPageQuery, { locale });
  return about;
});

const contactPageQuery = groq`
  *[_type == "contactPage"][0]{
    _id,
    "title": coalesce(select($locale == "az" => titleAz, titleRu), titleAz),
    "subtitle": coalesce(select($locale == "az" => subtitleAz, subtitleRu), subtitleAz),
    "heroImage": heroImage{
      "url": asset->url,
      "alt": coalesce(select($locale == "az" => altAz, altRu), altAz)
    },
    phone,
    email,
    "phoneLabel": coalesce(select($locale == "az" => phoneLabelAz, phoneLabelRu), phoneLabelAz),
    "emailLabel": coalesce(select($locale == "az" => emailLabelAz, emailLabelRu), emailLabelAz),
    "infoTitle": coalesce(select($locale == "az" => infoTitleAz, infoTitleRu), infoTitleAz),
    "infoPrimary": coalesce(select($locale == "az" => infoTextAz, infoTextRu), infoTextAz),
    "infoSecondary": coalesce(select($locale == "az" => infoTextAzSecondary, infoTextRuSecondary), infoTextAzSecondary),
    "socialsTitle": coalesce(select($locale == "az" => socialsTitleAz, socialsTitleRu), socialsTitleAz),
    "socialsSubtitle": coalesce(select($locale == "az" => socialsSubtitleAz, socialsSubtitleRu), socialsSubtitleAz)
    ,
    "socials": socialLinks[]{
      platform,
      label,
      url
    }
  }
`;

export const getContactPage = cache(async (locale: Locale) => {
  const contact = await sanityClient.fetch<ContactPageContent | null>(contactPageQuery, { locale });
  return contact;
});

const legalPageFields = `{
  _id,
  "title": coalesce(select($locale == "az" => titleAz, titleRu), titleAz),
  "content": coalesce(select($locale == "az" => contentAz, contentRu), contentAz)
}`;

const privacyPageQuery = groq`
  *[_type == "privacyPage"][0]
  ${legalPageFields}
`;

export const getPrivacyPage = cache(async (locale: Locale) => {
  const page = await sanityClient.fetch<LegalPageContent | null>(privacyPageQuery, { locale });
  return page;
});

const termsPageQuery = groq`
  *[_type == "termsPage"][0]
  ${legalPageFields}
`;

export const getTermsPage = cache(async (locale: Locale) => {
  const page = await sanityClient.fetch<LegalPageContent | null>(termsPageQuery, { locale });
  return page;
});

const whatsappDefaultsQuery = groq`
  *[_type == "contactPage"][0]{
    phone
  }
`;

export const getWhatsappDefaults = cache(async () => {
  const defaults = await sanityClient.fetch<{ phone?: string | null } | null>(whatsappDefaultsQuery);
  return defaults;
});

export const categoriesQuery = groq`
  *[_type == "category"] | order(order asc) {
    _id,
    order,
    slug,
    "title": coalesce(select($locale == "az" => titleAz, titleRu), titleAz),
    "image": image{
      "url": asset->url,
      "alt": coalesce(select($locale == "az" => altAz, altRu), altAz)
    }
  }
`;

export async function getCategories(locale: Locale) {
  const categories = await sanityClient.fetch<Category[]>(categoriesQuery, { locale });
  return categories;
}

const categorySlugsQuery = groq`
  *[_type == "category" && defined(slug)]{ slug }
`;

const categoryBySlugQuery = groq`
  *[_type == "category" && slug == $slug][0]{
    _id,
    slug,
    order,
    "title": coalesce(select($locale == "az" => titleAz, titleRu), titleAz),
    "image": image{
      "url": asset->url,
      "alt": coalesce(select($locale == "az" => altAz, altRu), altAz)
    }
  }
`;

export async function getAllCategorySlugs() {
  const slugs = await sanityClient.fetch<Array<{ slug: string }>>(categorySlugsQuery);
  return slugs.map((item) => item.slug).filter((slug): slug is string => Boolean(slug));
}

export async function getCategoryBySlug(slug: string, locale: Locale) {
  const category = await sanityClient.fetch<Category | null>(categoryBySlugQuery, {
    slug,
    locale,
  });

  return category;
}

export const featuredProductsQuery = groq`
  *[_type == "product" && featured == true] | order(order asc) {
    _id,
    slug,
    order,
    price,
    discountPrice,
    size,
    whatsappLink,
    "title": coalesce(select($locale == "az" => titleAz, titleRu), titleAz),
    "image": image{
      "url": asset->url,
      "alt": coalesce(select($locale == "az" => altAz, altRu), altAz)
    }
  }
`;

export async function getFeaturedProducts(locale: Locale) {
  const products = await sanityClient.fetch<Product[]>(featuredProductsQuery, { locale });
  return products;
}

const collectionHighlightProductsQuery = groq`
  *[_type == "product" && collectionHighlight == true] | order(order asc) [0...$limit] {
    _id,
    slug,
    order,
    price,
    discountPrice,
    size,
    whatsappLink,
    collectionHighlight,
    "title": coalesce(select($locale == "az" => titleAz, titleRu), titleAz),
    "image": image{
      "url": asset->url,
      "alt": coalesce(select($locale == "az" => altAz, altRu), altAz)
    },
    "categorySlug": category->slug,
    "categoryTitle": coalesce(select($locale == "az" => category->titleAz, category->titleRu), category->titleAz)
  }
`;

export async function getCollectionHighlightProducts(locale: Locale, limit: number) {
  const products = await sanityClient.fetch<Product[]>(collectionHighlightProductsQuery, {
    locale,
    limit,
  });

  return products;
}

const productBySlugQuery = groq`
  *[_type == "product" && slug == $slug][0]{
    _id,
    slug,
    price,
    discountPrice,
    size,
    whatsappLink,
    "title": coalesce(select($locale == "az" => titleAz, titleRu), titleAz),
    "excerpt": coalesce(select($locale == "az" => excerptAz, excerptRu), excerptAz),
    "body": coalesce(select($locale == "az" => bodyAz, bodyRu), bodyAz),
    "image": image{
      "url": asset->url,
      "alt": coalesce(select($locale == "az" => altAz, altRu), altAz)
    },
    "media": {
      "sectionTitle": coalesce(select($locale == "az" => media.sectionTitleAz, media.sectionTitleRu), media.sectionTitleAz),
      "sectionSubtitle": coalesce(select($locale == "az" => media.sectionSubtitleAz, media.sectionSubtitleRu), media.sectionSubtitleAz),
      "youtubeVideoId": media.youtubeVideoId,
      "instagramPostUrl": media.instagramPostUrl
    }
  }
`;

const productSlugsQuery = groq`
  *[_type == "product" && defined(slug)]{ slug }
`;

const productsByCategorySlugQuery = groq`
  *[_type == "product" && references(*[_type == "category" && slug == $slug]._id)] | order(order asc) {
    _id,
    slug,
    order,
    price,
    discountPrice,
    size,
    whatsappLink,
    collectionHighlight,
    "title": coalesce(select($locale == "az" => titleAz, titleRu), titleAz),
    "image": image{
      "url": asset->url,
      "alt": coalesce(select($locale == "az" => altAz, altRu), altAz)
    },
    "categorySlug": category->slug,
    "categoryTitle": coalesce(select($locale == "az" => category->titleAz, category->titleRu), category->titleAz)
  }
`;

const productsListQuery = groq`
  *[_type == "product" && defined(slug) && ($categorySlug == null || category->slug == $categorySlug) && ($highlightOnly == null || collectionHighlight == true)]
    | order(category->order asc, order asc)
    [$offset...$end]{
      _id,
      slug,
      order,
      price,
      discountPrice,
      size,
      whatsappLink,
      collectionHighlight,
      "title": coalesce(select($locale == "az" => titleAz, titleRu), titleAz),
      "image": image{
        "url": asset->url,
        "alt": coalesce(select($locale == "az" => altAz, altRu), altAz)
      },
      "categorySlug": category->slug,
      "categoryTitle": coalesce(select($locale == "az" => category->titleAz, category->titleRu), category->titleAz)
    }
`;

export async function getProductBySlug(slug: string, locale: Locale) {
  const product = await sanityClient.fetch<ProductDetail | null>(productBySlugQuery, {
    slug,
    locale,
  });

  return product;
}

export async function getAllProductSlugs() {
  const slugs = await sanityClient.fetch<Array<{ slug: string }>>(productSlugsQuery);
  return slugs.map((item) => item.slug).filter((value): value is string => Boolean(value));
}

export async function getProductsByCategorySlug(slug: string, locale: Locale) {
  const products = await sanityClient.fetch<Product[]>(productsByCategorySlugQuery, {
    slug,
    locale,
  });

  return products;
}

export type ProductsListOptions = {
  locale: Locale;
  limit: number;
  offset?: number;
  categorySlug?: string;
  highlightOnly?: boolean;
};

export async function getProductsList({
  locale,
  limit,
  offset = 0,
  categorySlug,
  highlightOnly,
}: ProductsListOptions) {
  const end = offset + limit + 1;

  const results = await sanityClient.fetch<Product[]>(productsListQuery, {
    locale,
    categorySlug: categorySlug ?? null,
    highlightOnly: typeof highlightOnly === "boolean" ? highlightOnly : null,
    offset,
    end,
  });

  const products = results.slice(0, limit);
  const hasMore = results.length > limit;

  return { products, hasMore };
}
