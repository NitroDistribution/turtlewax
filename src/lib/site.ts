const SITE_URL = "https://www.turtlewax.az";

export function getBaseUrl(): string {
  return SITE_URL;
}

export function createAbsoluteUrl(path = "/"): string {
  const trimmed = path.trim();

  if (!trimmed || trimmed === "/") {
    return SITE_URL;
  }

  const normalized = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  return `${SITE_URL}${normalized}`;
}
