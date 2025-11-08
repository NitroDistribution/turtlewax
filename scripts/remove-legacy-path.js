#!/usr/bin/env node

const path = require("path");
const fs = require("fs");
const { createClient } = require("@sanity/client");

const repoRoot = path.resolve(__dirname, "..");

function loadEnvFile(fileName) {
  const filePath = path.join(repoRoot, fileName);
  if (!fs.existsSync(filePath)) return;

  const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    if (!line || line.trim().startsWith("#")) continue;
    const [key, ...rest] = line.split("=");
    if (!key || rest.length === 0) continue;
    const value = rest.join("=").trim();
    if (value && !process.env[key.trim()]) {
      process.env[key.trim()] = value;
    }
  }
}

loadEnvFile(".env");
loadEnvFile(".env.local");

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_STUDIO_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || process.env.SANITY_STUDIO_DATASET;
const apiVersion = process.env.SANITY_STUDIO_API_VERSION || process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-01-01";
const token = process.env.SANITY_STUDIO_WRITE_TOKEN;

if (!projectId || !dataset || !token) {
  console.error("Missing Sanity configuration. Check project ID, dataset, and write token in .env.local.");
  process.exit(1);
}

const client = createClient({ projectId, dataset, apiVersion, token, useCdn: false });

async function main() {
  const productsWithLegacyPath = await client.fetch(
    `*[_type == "product" && defined(legacyPath)]{ _id }`
  );

  if (!productsWithLegacyPath.length) {
    console.log("No products still contain legacyPath.");
    return;
  }

  const tx = client.transaction();
  for (const doc of productsWithLegacyPath) {
    tx.patch(doc._id, { unset: ["legacyPath"] });
  }

  await tx.commit();
  console.log(`Removed legacyPath from ${productsWithLegacyPath.length} product(s).`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
