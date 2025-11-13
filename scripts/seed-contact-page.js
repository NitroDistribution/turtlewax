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

const CONTACT_PAGE_DOCUMENT_ID = "contactPage";

async function main() {
  console.log("Seeding Contact Page copy...");

  await client.createIfNotExists({
    _id: CONTACT_PAGE_DOCUMENT_ID,
    _type: "contactPage",
    titleAz: "Əlaqə",
    subtitleAz: "Bizimlə əlaqə saxlayın. Hər hansı sualınız varsa, biz kömək etməkdən məmnun olarıq.",
    phone: "+994558944511",
  });

  await client
    .patch(CONTACT_PAGE_DOCUMENT_ID)
    .set({
      titleAz: "Əlaqə",
      titleRu: "Контакты",
      subtitleAz: "Bizimlə əlaqə saxlayın. Hər hansı sualınız varsa, biz kömək etməkdən məmnun olarıq.",
      subtitleRu: "Свяжитесь с нами. Мы будем рады помочь вам с любыми вопросами.",
      phone: "+994558944511",
      phoneLabelAz: "Telefon",
      phoneLabelRu: "Телефон",
      email: "office@turtlewax.az",
      emailLabelAz: "E-poçt",
      emailLabelRu: "Эл. почта",
      infoTitleAz: "İş saatları",
      infoTitleRu: "Рабочие часы",
      infoTextAz: "Bazar ertəsi - Cümə: 09:00 - 18:00",
      infoTextAzSecondary: "Şənbə - Bazar: İstirahət",
      infoTextRu: "Понедельник - Пятница: 09:00 - 18:00",
      infoTextRuSecondary: "Суббота - Воскресенье: Выходной",
      socialsTitleAz: "Sosial şəbəkə",
      socialsTitleRu: "Социальные сети",
      socialsSubtitleAz: "Bizi sosial şəbəkələrdə izləyin və son yeniliklərdən xəbərdar olun.",
      socialsSubtitleRu: "Следите за нами в социальных сетях и будьте в курсе последних новостей.",
      socialLinks: [
        {
          _key: "telegram",
          platform: "telegram",
          label: "Telegram",
          url: "https://t.me/turtlewax_az",
        },
        {
          _key: "instagram",
          platform: "instagram",
          label: "Instagram",
          url: "https://www.instagram.com/turtlewax.az/",
        },
        {
          _key: "whatsapp",
          platform: "whatsapp",
          label: "WhatsApp",
          url: "https://api.whatsapp.com/send?phone=994558944511",
        },
      ],
      retailLocationsCard: {
        titleAz: "Haradan ala bilərsiniz",
        titleRu: "Где купить",
        subtitleAz: "Rəsmi Turtle Wax tərəfdaşlarından məhsullarımızı əldə edin.",
        subtitleRu: "Покупайте продукты Turtle Wax у официальных партнёров.",
        locations: [
          {
            _key: "port-baku",
            locationName: "Port Baku Mall",
            addressAz: "Neftçilər pr. 153, Bakı",
            addressRu: "пр. Нефтчиляр 153, Баку",
            phone: "+994124040404",
            mapUrl: "https://maps.google.com/?q=Port+Baku+Mall",
          },
          {
            _key: "ganja-store",
            locationName: "Gəncə Showroom",
            addressAz: "Atatürk pr. 21, Gəncə",
            addressRu: "пр. Ататюрка 21, Гянджа",
            phone: "+994222020202",
            mapUrl: "https://maps.google.com/?q=Ataturk+prospekti+21+Ganja",
          },
        ],
      },
    })
    .commit();

  console.log("Contact Page copy synced.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
