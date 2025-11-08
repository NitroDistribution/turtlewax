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

async function main() {
  console.log("Clearing product-specific WhatsApp links...");

  const products = await client.fetch(`*[_type == "product" && defined(whatsappLink)]._id`);

  if (!products.length) {
    console.log("No products with custom WhatsApp links found.");
    return;
  }

  for (const id of products) {
    await client.patch(id).unset(["whatsappLink"]).commit();
    console.log(`Cleared whatsappLink on ${id}`);
  }

  console.log("Done.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
