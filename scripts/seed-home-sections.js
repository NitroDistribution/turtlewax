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

const HOME_DOC_ID = "homeHeroSection";

async function main() {
  console.log("Updating home page section copy in Sanity...");

  await client
    .patch(HOME_DOC_ID)
    .setIfMissing({ featuredSection: {}, categoriesSection: {}, collectionSection: {} })
    .commit();

  await client
    .patch(HOME_DOC_ID)
    .set({
      featuredSection: {
        taglineAz: "Seçilmiş məhsullar",
        taglineRu: "Избранные товары",
        titleAz: "Daha populyar seçimlər",
        titleRu: "Популярные решения",
        subtitleAz: "Müştərilərimizin sevdiyi Turtle Wax məhsullarını kəşf edin və nəticəni dərhal görün.",
        subtitleRu: "Познакомьтесь с продуктами Turtle Wax, которые чаще всего выбирают наши клиенты.",
      },
      categoriesSection: {
        taglineAz: "Kateqoriya seç",
        taglineRu: "Выбор категории",
        titleAz: "Kateqoriya üzrə alış-veriş",
        titleRu: "Покупайте по категориям",
        subtitleAz:
          "Turtle Wax məhsullarının geniş çeşidini asanlıqla araşdırmaq üçün kateqoriyalara nəzər salın.",
        subtitleRu:
          "Изучайте ассортимент Turtle Wax по категориям и находите нужные средства быстрее.",
        viewAllAz: "Bütün kateqoriyalar",
        viewAllRu: "Все категории",
      },
      collectionSection: {
        taglineAz: "Yeni kolleksiya",
        taglineRu: "Новая подборка",
        titleAz: "Turtle Wax kolleksiyasını kəşf edin",
        titleRu: "Изучите коллекцию Turtle Wax",
        subtitleAz:
          "Kateqoriyalara görə seçilmiş məhsullarımızla avtomobiliniz üçün ideal baxım həllini tapın.",
        subtitleRu:
          "Подберите оптимальные средства ухода, подобранные по категориям специально для вас.",
        viewAllAz: "Bütün məhsullar",
        viewAllRu: "Все продукты",
      },
    })
    .commit({ autoGenerateArrayKeys: true });

  console.log("Home page copy synced. Done.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
