export type HeroContent = {
  _id: string;
  title: string;
  subtitle: string;
  buttonLabel?: string;
  buttonSlug?: string;
  backgroundImage?: {
    url?: string;
    lqip?: string;
    dimensions?: {
      width: number;
      height: number;
      aspectRatio: number;
    };
    alt?: string;
  };
};

export type AboutPageContent = {
  _id: string;
  title: string;
  heroImage?: {
    url?: string;
    alt?: string;
  } | null;
  paragraphs: string[];
  videoTitle?: string | null;
  videoUrl?: string | null;
};

export type LegalPageContent = {
  _id: string;
  title: string;
  content: string[];
};

export type ProductMediaContent = {
  sectionTitle?: string | null;
  sectionSubtitle?: string | null;
  youtubeVideoId?: string | null;
  instagramPostUrl?: string | null;
};

export type ContactPageContent = {
  _id: string;
  title: string;
  subtitle: string;
  heroImage?: {
    url?: string;
    alt?: string;
  } | null;
  phone?: string | null;
  email?: string | null;
  phoneLabel?: string | null;
  emailLabel?: string | null;
  infoTitle?: string | null;
  infoPrimary?: string | null;
  infoSecondary?: string | null;
  socialsTitle?: string | null;
  socialsSubtitle?: string | null;
  socials?: Array<{
    _key?: string;
    platform?: string | null;
    label?: string | null;
    url?: string | null;
  }> | null;
  retailLocationsCard?: {
    title?: string | null;
    subtitle?: string | null;
    locations?: Array<{
      _key?: string;
      locationName?: string | null;
      address?: string | null;
      phone?: string | null;
      mapUrl?: string | null;
    }> | null;
  } | null;
};

export type SiteSettingsContent = {
  _id: string;
  catalogTitle?: string | null;
  catalogCta?: string | null;
  catalogFile?: {
    url?: string;
    originalFilename?: string;
  } | null;
};

export type HomeSectionCopy = {
  eyebrow?: string | null;
  title?: string | null;
  subtitle?: string | null;
  viewAll?: string | null;
};

export type HomeSectionsCopy = {
  featured?: HomeSectionCopy | null;
  categories?: HomeSectionCopy | null;
  collection?: HomeSectionCopy | null;
};

export type Category = {
  _id: string;
  title: string;
  slug: string;
  order: number;
  image?: {
    url?: string;
    alt?: string;
  };
};


export type Product = {
  _id: string;
  title: string;
  slug: string;
  price?: number | null;
  discountPrice?: number | null;
  size?: string | null;
  whatsappLink?: string | null;
  collectionHighlight?: boolean | null;
  image?: {
    url?: string;
    alt?: string;
  };
  galleryImages?: Array<{
    url?: string;
    alt?: string;
  }> | null;
  categorySlug?: string | null;
  categoryTitle?: string | null;
  media?: ProductMediaContent | null;
};

export type ProductDetail = Product & {
  excerpt?: string | null;
  body?: string | null;
};
