#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const { createClient } = require("@sanity/client");
const dotenv = require("dotenv");

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
dotenv.config();

const getEnv = (keys, fallback) => {
  for (const key of keys) {
    const value = process.env[key];
    if (value) return value;
  }
  if (fallback !== undefined) return fallback;
  throw new Error(`Missing required env variable. Tried keys: ${keys.join(", ")}`);
};

const getOptionalEnv = (keys) => {
  for (const key of keys) {
    const value = process.env[key];
    if (value) return value;
  }
  return undefined;
};

const projectId = getEnv([
  "SANITY_PROJECT_ID",
  "SANITY_STUDIO_PROJECT_ID",
  "NEXT_PUBLIC_SANITY_PROJECT_ID",
], "c5fppl0v");

const dataset = getEnv([
  "SANITY_DATASET",
  "SANITY_STUDIO_DATASET",
  "NEXT_PUBLIC_SANITY_DATASET",
], "production");

const apiVersion = getEnv([
  "SANITY_API_VERSION",
  "SANITY_STUDIO_API_VERSION",
  "NEXT_PUBLIC_SANITY_API_VERSION",
], "2025-01-01");

const token = getOptionalEnv([
  "SANITY_API_TOKEN",
  "SANITY_WRITE_TOKEN",
  "SANITY_STUDIO_API_WRITE_TOKEN",
  "SANITY_API_READ_TOKEN",
]);

if (!token) {
  console.error("\n⚠️  Missing Sanity API token. Set SANITY_API_TOKEN before running this script.\n");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
});

const pdfRelativePath = "old-html-site/public_html/Hybrid_Solutions_Brochure.pdf";
const pdfAbsolutePath = path.resolve(process.cwd(), pdfRelativePath);

if (!fs.existsSync(pdfAbsolutePath)) {
  console.error(`\n❌ Catalog PDF not found at ${pdfRelativePath}.\n`);
  process.exit(1);
}

async function seedSiteSettings() {
  console.log("Uploading catalog PDF to Sanity...");
  const asset = await client.assets.upload(
    "file",
    fs.createReadStream(pdfAbsolutePath),
    {
      filename: "Hybrid_Solutions_Brochure.pdf",
      contentType: "application/pdf",
    }
  );

  console.log("Creating/Updating site settings document...");
  const result = await client.createOrReplace({
    _id: "siteSettings",
    _type: "siteSettings",
    catalogTitleAz: "Kataloq",
    catalogTitleRu: "Каталог",
    catalogCtaAz: "Yüklə",
    catalogCtaRu: "Скачать",
    catalogFile: {
      _type: "file",
      asset: {
        _type: "reference",
        _ref: asset._id,
      },
    },
  });

  console.log("\n✅ Site settings updated:", result._id);
}

seedSiteSettings().catch((error) => {
  console.error("\n❌ Failed to seed site settings:\n", error);
  process.exit(1);
});
