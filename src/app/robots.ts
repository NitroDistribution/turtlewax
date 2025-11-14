import type { MetadataRoute } from "next";

import { createAbsoluteUrl, getBaseUrl } from "@/lib/site";

const DISALLOWED_PATHS = ["/api", "/api/*", "/studio", "/studio/*"];

export default function robots(): MetadataRoute.Robots {
  const host = getBaseUrl();

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: DISALLOWED_PATHS,
    },
    sitemap: [createAbsoluteUrl("/sitemap.xml")],
    host,
  };
}
