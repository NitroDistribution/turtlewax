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

const ABOUT_PAGE_DOCUMENT_ID = "aboutPage";

async function main() {
  console.log("Seeding About Page copy...");

  await client.createIfNotExists({
    _id: ABOUT_PAGE_DOCUMENT_ID,
    _type: "aboutPage",
    titleAz: "Haqqımızda",
    paragraphsAz: [],
    paragraphsRu: [],
  });

  await client
    .patch(ABOUT_PAGE_DOCUMENT_ID)
    .setIfMissing({ heroImage: undefined })
    .set({
      titleAz: "Haqqımızda",
      titleRu: "О нас",
      paragraphsAz: [
        "Turtle Wax brendinin Azərbaycandaki rəsmi web səhifəsinə xoş gəlmisiniz!",
        "Turtle Wax avtomobil kosmetikasını icad edən və onun istehsalına başlayan ilk şirkətlərdən biridir. 1944-cü ildə Turtle Wax ilk qablaşdırılmış maye avtomobil cilasını icad edir.",
        "75 il sonra avtomobilə qulluq sahəsində \"Ən İnnovativ Brend\"™ adına layiq görülərək və satışlarda liderliyi qoruyaraq (wax spray, yuyucu vasitələr, interyerə qulluq və s) avtomobil peşəkarlarını və həvəskarlarını uğurla cəlb etməyə davam edir.",
      ],
      paragraphsRu: [
        "Добро пожаловать на официальную веб-страницу бренда Turtle Wax в Азербайджане!",
        "Turtle Wax — одна из первых компаний, изобретших автомобильную косметику и начавших её производство. В 1944 году Turtle Wax изобрела первый упакованный жидкий автомобильный полироль.",
        "75 лет спустя, удостоившись звания \"Самый инновационный бренд\"™ в области ухода за автомобилями и сохраняя лидерство в продажах (wax spray, моющие средства, уход за интерьером и т.д.), продолжает успешно привлекать как профессионалов, так и любителей автомобилей.",
      ],
      videoTitleAz: "Hybrid Solutions",
      videoTitleRu: "Hybrid Solutions",
      videoUrl: "https://www.youtube.com/embed/pm818IM4vt8?rel=0",
    })
    .commit({ autoGenerateArrayKeys: true });

  console.log("About Page copy synced.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
