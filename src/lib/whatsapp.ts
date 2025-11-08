import { getWhatsAppOrderMessage, type Locale } from "./i18n";

type BuildWhatsAppLinkOptions = {
  phone?: string | null;
  productName?: string | null;
  locale?: Locale;
  overrideUrl?: string | null;
  price?: number | null;
  discountPrice?: number | null;
  size?: string | null;
  sizeLabel?: string | null;
};

const WHATSAPP_BASE_URL = "https://api.whatsapp.com/send";

function normalizePhone(rawPhone?: string | null) {
  if (!rawPhone) return null;
  const digits = rawPhone.replace(/[^0-9+]/g, "");
  if (!digits) return null;
  return digits.startsWith("+") ? digits.slice(1) : digits;
}

export function buildWhatsAppLink({
  phone,
  productName,
  locale,
  overrideUrl,
  price,
  discountPrice,
  size,
  sizeLabel,
}: BuildWhatsAppLinkOptions) {
  const trimmedOverride = overrideUrl?.trim();
  if (trimmedOverride) {
    return trimmedOverride;
  }

  const normalizedPhone = normalizePhone(phone);
  if (!normalizedPhone) {
    return undefined;
  }

  const message = getWhatsAppOrderMessage(locale, {
    productName: productName ?? "Turtle Wax product",
    price,
    discountPrice,
    size,
    sizeLabel,
  });
  const encodedMessage = encodeURIComponent(message);

  return `${WHATSAPP_BASE_URL}?phone=${normalizedPhone}&text=${encodedMessage}`;
}
