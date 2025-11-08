#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { createClient } = require("@sanity/client");

const repoRoot = path.resolve(__dirname, "..");
const publicHtmlDir = path.join(repoRoot, "old-html-site", "public_html");

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

const categoryConfigs = [
  { key: "interior", file: "interior.html", categoryId: "category-interior" },
  { key: "exterior", file: "exterior.html", categoryId: "category-exterior" },
  { key: "teker", file: "teker.html", categoryId: "category-tires" },
  { key: "glass", file: "glass.html", categoryId: "category-glass" },
  { key: "restoration", file: "restoration.html", categoryId: "category-restoration" },
  { key: "hybrid", file: "hybrid.html", categoryId: "category-hybrid-solutions" },
  { key: "aksesuar", file: "aksesuar.html", categoryId: "category-accessories" },
  { key: "dest", file: "dest.html", categoryId: "category-special-offers" },
];

const imageCache = new Map();

function extractDivBlocks(html, marker) {
  const blocks = [];
  let index = 0;
  while (index < html.length) {
    const start = html.indexOf(marker, index);
    if (start === -1) break;
    const divRegex = /<div\b|<\/div>/g;
    divRegex.lastIndex = start;
    let depth = 0;
    let end = html.length;
    let match;
    while ((match = divRegex.exec(html)) !== null) {
      if (match.index < start) continue;
      if (match[0].startsWith("<div")) {
        depth += 1;
      } else {
        depth -= 1;
        if (depth === 0) {
          end = match.index + match[0].length;
          break;
        }
      }
    }
    blocks.push(html.slice(start, end));
    index = end;
  }
  return blocks;
}

function decodeHtmlEntities(value) {
  if (!value) return value;
  return value
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .trim();
}

function stripHtml(value) {
  if (!value) return "";
  return decodeHtmlEntities(
    value
      .replace(/<br\s*\/?\s*>/gi, "\n")
      .replace(/<li[^>]*>/gi, "\n- ")
      .replace(/<\/li>/gi, "")
      .replace(/<p[^>]*>/gi, "")
      .replace(/<\/p>/gi, "\n\n")
      .replace(/<[^>]+>/g, "")
  )
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .join("\n");
}

function slugify(value) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function parsePrice(value) {
  if (!value) return undefined;
  const match = value.replace(/[, ]/g, "").match(/([0-9]+(?:\.[0-9]+)?)/);
  if (!match) return undefined;
  return Number(match[1]);
}

async function uploadImage(imagePath) {
  const absolutePath = path.isAbsolute(imagePath) ? imagePath : path.join(publicHtmlDir, imagePath);
  if (!fs.existsSync(absolutePath)) {
    console.warn(`⚠ Image not found: ${absolutePath}`);
    return undefined;
  }

  if (imageCache.has(absolutePath)) {
    return imageCache.get(absolutePath);
  }

  const filename = path.basename(absolutePath);
  const stream = fs.createReadStream(absolutePath);
  const asset = await client.assets.upload("image", stream, { filename });
  imageCache.set(absolutePath, asset._id);
  return asset._id;
}

async function upsertProduct(doc) {
  let assetRef = undefined;
  if (doc.__imagePath) {
    assetRef = await uploadImage(doc.__imagePath);
  }

  const imageField = assetRef
    ? {
        _type: "image",
        asset: { _type: "reference", _ref: assetRef },
        altAz: doc.titleAz,
        altRu: doc.titleRu || doc.titleAz,
      }
    : undefined;

  const document = {
    _id: doc._id,
    _type: "product",
    titleAz: doc.titleAz,
    titleRu: doc.titleRu,
    slug: doc.slug,
    category: {
      _type: "reference",
      _ref: doc.categoryId,
    },
    order: doc.order,
    price: doc.price,
    size: doc.size,
    whatsappLink: doc.whatsappLink,
    excerptAz: doc.excerptAz,
    excerptRu: doc.excerptRu,
    bodyAz: doc.bodyAz,
    bodyRu: doc.bodyRu,
    image: imageField,
  };

  if (!document.image) {
    delete document.image;
  }

  await client.createOrReplace(document);
  console.log(`✔ Seeded product: ${doc.titleAz} (${doc.slug})`);
}

function extractProductCards(html) {
  const blocks = extractDivBlocks(html, "<div class='products__card'>");
  return blocks.map((block) => {
    const hrefMatch = block.match(/<a[^>]+href=['"]([^'"#]+)['"][^>]*class="products__content"/);
    const imageMatch = block.match(/<img[^>]+src="([^"#]+)"[^>]*class="products__img"/);
    const titleMatch = block.match(/<div class="products__title">([^<]+)<\/div>/);
    const priceMatch = block.match(/<div class="(?:product__price|products__price)">\s*AZN\s*([^<]+)<\/div>/i);
    const sizeMatch = block.match(/<div class="products__size">([^<]+)<\/div>/);
    const whatsappMatch = block.match(/<a[^>]+class="products__btn"[^>]+href="([^"#]+)"/);

    return {
      href: hrefMatch ? hrefMatch[1].trim() : undefined,
      imageSrc: imageMatch ? imageMatch[1].trim() : undefined,
      title: titleMatch ? decodeHtmlEntities(titleMatch[1]) : undefined,
      priceRaw: priceMatch ? decodeHtmlEntities(priceMatch[1]) : undefined,
      size: sizeMatch ? decodeHtmlEntities(sizeMatch[1]) : undefined,
      whatsapp: whatsappMatch ? whatsappMatch[1].trim() : undefined,
    };
  });
}

function parseDetailPage(detailPath) {
  if (!fs.existsSync(detailPath)) {
    console.warn(`⚠ Missing detail page: ${detailPath}`);
    return {};
  }
  const html = fs.readFileSync(detailPath, "utf8");

  const titleMatch = html.match(/<div class="products__title[^>]*">([^<]+)<\/div>/);
  const heroImageMatch = html.match(/<img[^>]+class="products__img"[^>]+src="([^"#]+)"/);
  const descriptionMatch = html.match(/<div class="products__detail-descr">([\s\S]*?)<\/div>\s*<div class="products__detail-content">/);

  const descriptionRaw = descriptionMatch ? descriptionMatch[1] : "";
  const bodyAz = stripHtml(descriptionRaw);
  const excerptAz = bodyAz.split(/\n\n/).find((paragraph) => paragraph.trim().length > 0) || undefined;

  return {
    title: titleMatch ? decodeHtmlEntities(titleMatch[1]) : undefined,
    imageSrc: heroImageMatch ? heroImageMatch[1].trim() : undefined,
    bodyAz,
    excerptAz,
  };
}

async function seed() {
  const productMap = new Map();

  for (const category of categoryConfigs) {
    const categoryPath = path.join(publicHtmlDir, category.file);
    if (!fs.existsSync(categoryPath)) {
      console.warn(`⚠ Category HTML not found: ${categoryPath}`);
      continue;
    }

    const html = fs.readFileSync(categoryPath, "utf8");
    const cards = extractProductCards(html);

    cards.forEach((card, index) => {
      if (!card.href) return;
      const detailKey = card.href.replace(/\.html?$/i, "");
      const slugBase = detailKey.replace(/^product-/, "");
      const slug = slugify(slugBase);

      if (!slug) return;

      if (!productMap.has(slug)) {
        productMap.set(slug, {
          slug,
          legacyPath: card.href,
          categoryId: category.categoryId,
          order: index + 1,
          cardTitle: card.title,
          priceRaw: card.priceRaw,
          size: card.size,
          whatsapp: card.whatsapp,
          cardImage: card.imageSrc,
        });
      }
    });
  }

  if (productMap.size === 0) {
    console.error("No products discovered in legacy HTML.");
    process.exit(1);
  }

  for (const [slug, meta] of productMap) {
    const detailPath = path.join(publicHtmlDir, meta.legacyPath || `product-${slug}.html`);
    const detail = parseDetailPage(detailPath);

    const titleAz = detail.title || meta.cardTitle || slug.replace(/-/g, " ");
    const titleRu = titleAz;
    const bodyAz = detail.bodyAz || undefined;
    const excerptAz = detail.excerptAz || undefined;

    const price = parsePrice(meta.priceRaw);

    const imageSource = detail.imageSrc || meta.cardImage;
    const imagePath = imageSource ? path.join(publicHtmlDir, imageSource.replace(/^\//, "")) : undefined;

    const document = {
      _id: `product-${slug}`,
      slug,
      categoryId: meta.categoryId,
      order: meta.order,
      titleAz,
      titleRu,
      price,
      size: meta.size,
      whatsappLink: meta.whatsapp,
      excerptAz,
      excerptRu: excerptAz,
      bodyAz,
      bodyRu: bodyAz,
      __imagePath: imagePath,
    };

    await upsertProduct(document);
  }

  console.log(`Finished seeding ${productMap.size} products.`);
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
