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

const PRIVACY_PAGE_DOCUMENT_ID = "privacyPage";
const TERMS_PAGE_DOCUMENT_ID = "termsPage";

const privacyContent = [
  "We respect your privacy and are committed to protecting your personal information. This privacy policy will inform you as to how we look after your personal data when you visit our website turtlewax.az (regardless of where you visit it from) and tell you about your privacy rights and how the law protects you.",
  "We may collect, use, store and transfer different kinds of personal data about you. This may include your name, address, email address, and other contact information. We will only use your personal data for the purposes for which we collected it, unless we reasonably consider that we need to use it for another reason and that reason is compatible with the original purpose.",
  "We will not share your personal data with third parties for marketing purposes. We may, however, share your personal data with other companies in our group or with our service providers in order to provide you with the services you have requested.",
  "We will keep your personal data for as long as necessary to fulfil the purposes we collected it for, including for the purposes of satisfying any legal, accounting, or reporting requirements.",
  "If you have any questions or concerns about our privacy policy or the handling of your personal data, please contact us at office@turtlewax.az.",
];

const termsContent = [
  "By using our website turtlewax.az, you agree to these terms and conditions in full. If you disagree with these terms and conditions or any part of these terms and conditions, you must not use our website.",
  "The content of the pages of this website is for your general information and use only. It is subject to change without notice.",
  "This website uses cookies to monitor browsing preferences. If you do allow cookies to be used, the following personal information may be stored by us for use by third parties: [insert list of information].",
  "Neither we nor any third parties provide any warranty or guarantee as to the accuracy, timeliness, performance, completeness, or suitability of the information and materials found or offered on this website for any particular purpose. You acknowledge that such information and materials may contain inaccuracies or errors and we expressly exclude liability for any such inaccuracies or errors to the fullest extent permitted by law.",
  "Your use of any information or materials on this website is entirely at your own risk, for which we shall not be liable. It shall be your own responsibility to ensure that any products, services, or information available through this website meet your specific requirements.",
  "This website contains material which is owned by or licensed to us. This material includes, but is not limited to, the design, layout, look, appearance, and graphics. Reproduction is prohibited other than in accordance with the copyright notice, which forms part of these terms and conditions.",
  "Unauthorized use of this website may give rise to a claim for damages and/or be a criminal offense.",
  "Your use of this website and any dispute arising out of such use of the website is subject to the laws of Azerbaijan.",
];

async function seedLegalPage({ documentId, schemaType, title }) {
  const content = schemaType === "privacyPage" ? privacyContent : termsContent;

  const baseDoc = {
    _type: schemaType,
    titleAz: title,
    titleRu: title,
    contentAz: content,
    contentRu: content,
  };

  await client.createOrReplace({
    ...baseDoc,
    _id: documentId,
  });

  await client.createOrReplace({
    ...baseDoc,
    _id: `drafts.${documentId}`,
  });

  console.log(`${title} synced.`);
}

async function main() {
  console.log("Seeding legal pages...");

  await seedLegalPage({
    documentId: PRIVACY_PAGE_DOCUMENT_ID,
    schemaType: "privacyPage",
    title: "Privacy Policy",
  });

  await seedLegalPage({
    documentId: TERMS_PAGE_DOCUMENT_ID,
    schemaType: "termsPage",
    title: "Terms & Conditions",
  });

  console.log("Legal pages synced.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
