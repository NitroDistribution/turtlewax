#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { createClient } = require("@sanity/client");

const repoRoot = path.resolve(__dirname, "..");
const legacyIndexPath = path.join(repoRoot, "old-html-site", "public_html", "index.html");

function loadEnvFile(fileName) {
  const filePath = path.join(repoRoot, fileName);
  if (!fs.existsSync(filePath)) {
    return;
  }

  const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    if (!line || line.trim().startsWith("#")) continue;
    const [key, ...valueParts] = line.split("=");
    if (!key || valueParts.length === 0) continue;
    const value = valueParts.join("=").trim();
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

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
});

if (!fs.existsSync(legacyIndexPath)) {
  console.error(`Legacy index file not found at ${legacyIndexPath}`);
  process.exit(1);
}

const html = fs.readFileSync(legacyIndexPath, "utf8");

const categoryRegex = /<a\s+href=['"]([^'"#]+?)['"]\s+class="product__item">\s*<img\s+src="([^"#]+)"[^>]*>\s*<span>([^<]+)<\/span>/g;

const slugOverrides = {
  interior: "interior",
  exterior: "exterior",
  teker: "tires",
  glass: "glass",
  restoration: "restoration",
  hybrid: "hybrid-solutions",
  aksesuar: "accessories",
  dest: "special-offers",
};

const ruNameMap = {
  interior: "Интерьер",
  exterior: "Экстерьер",
  teker: "Шины",
  glass: "Стекло",
  restoration: "Восстановление",
  hybrid: "Hybrid Solutions",
  aksesuar: "Аксессуары",
  dest: "Спецпредложения",
};

async function uploadImage(imagePath) {
  const filename = path.basename(imagePath);
  const stream = fs.createReadStream(imagePath);
  const asset = await client.assets.upload("image", stream, { filename });
  return asset._id;
}

async function upsertCategory(doc) {
  const existing = await client.fetch(
    `*[_id == $id][0]{ _id, image{ asset->{ _id } } }`,
    { id: doc._id }
  );

  let assetRef = existing?.image?.asset?._id;
  if (!assetRef) {
    assetRef = await uploadImage(doc.__imagePath);
  }

  const imageField = {
    _type: "image",
    asset: {
      _type: "reference",
      _ref: assetRef,
    },
    altAz: doc.titleAz,
    altRu: doc.titleRu || doc.titleAz,
  };

  const document = {
    _id: doc._id,
    _type: "category",
    titleAz: doc.titleAz,
    titleRu: doc.titleRu,
    slug: doc.slug,
    order: doc.order,
    image: imageField,
  };

  await client.createOrReplace(document);
  console.log(`✔ Seeded category: ${doc.titleAz} (${doc.slug})`);
}

async function seed() {
  const categories = [];
  let match;
  while ((match = categoryRegex.exec(html)) !== null) {
    const href = match[1].trim();
    const imageSrc = match[2].trim();
    const titleAz = match[3].trim();

    const baseKey = href.replace(/\.html?$/i, "").split("/").pop();
    if (!baseKey) continue;

    const slug = slugOverrides[baseKey] || baseKey;
    const titleRu = ruNameMap[baseKey] || titleAz;

    const imagePath = path.join(repoRoot, "old-html-site", "public_html", imageSrc.replace(/^\//, ""));
    if (!fs.existsSync(imagePath)) {
      console.warn(`⚠ Image not found for ${titleAz}: ${imagePath}`);
      continue;
    }

    if (categories.find((item) => item.slug === slug)) {
      continue;
    }

    categories.push({
      _id: `category-${slug}`,
      slug,
      titleAz,
      titleRu,
      order: categories.length + 1,
      __imagePath: imagePath,
    });
  }

  if (categories.length === 0) {
    console.error("No categories found in legacy HTML.");
    process.exit(1);
  }

  for (const category of categories) {
    await upsertCategory(category);
  }

  console.log(`Finished seeding ${categories.length} categories.`);
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
