#!/usr/bin/env node

require("dotenv").config({ path: ".env.local" });
require("dotenv").config();

const { createClient } = require("@sanity/client");

const projectId =
  process.env.SANITY_STUDIO_PROJECT_ID ||
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||
  process.env.SANITY_PROJECT_ID ||
  "c5fppl0v";

const dataset =
  process.env.SANITY_STUDIO_DATASET ||
  process.env.NEXT_PUBLIC_SANITY_DATASET ||
  process.env.SANITY_DATASET ||
  "production";

const apiVersion =
  process.env.SANITY_STUDIO_API_VERSION ||
  process.env.NEXT_PUBLIC_SANITY_API_VERSION ||
  process.env.SANITY_API_VERSION ||
  "2025-01-01";

const token =
  process.env.SANITY_STUDIO_WRITE_TOKEN ||
  process.env.SANITY_WRITE_TOKEN ||
  process.env.SANITY_API_WRITE_TOKEN;

if (!token) {
  console.error("Missing SANITY write token. Set SANITY_STUDIO_WRITE_TOKEN in your env.");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
});

const TARGET_SLUG = "spot-clean";

async function main() {
  console.log(`Seeding media content for product '${TARGET_SLUG}'...`);

  const product = await client.fetch(`*[_type == "product" && slug == $slug][0]{ _id }`, {
    slug: TARGET_SLUG,
  });

  if (!product?._id) {
    console.log("Product not found; skipping.");
    return;
  }

  await client
    .patch(product._id)
    .set({
      media: {
        sectionTitleAz: "Spot Clean",
        sectionTitleRu: "Spot Clean",
        sectionSubtitleAz: "İstifadə təlimatları və nümayişlər",
        sectionSubtitleRu: "Инструкции по применению и демонстрации",
        youtubeVideoId: "tSu7uBDVdc8",
        instagramPostUrl: "https://www.instagram.com/p/Cl6vgogDfJY/?utm_source=ig_embed&utm_campaign=loading",
      },
      discountPrice: 6.5,
    })
    .commit();

  console.log("Product media seeded.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
