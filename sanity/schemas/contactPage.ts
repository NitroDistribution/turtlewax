import { defineField, defineType } from "sanity";

export const contactPageType = defineType({
  name: "contactPage",
  title: "Contact Page",
  type: "document",
  fields: [
    defineField({
      name: "titleAz",
      title: "Title (AZ)",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "titleRu",
      title: "Title (RU)",
      type: "string",
    }),
    defineField({
      name: "subtitleAz",
      title: "Subtitle (AZ)",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "subtitleRu",
      title: "Subtitle (RU)",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "heroImage",
      title: "Hero Image",
      type: "image",
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: "altAz",
          title: "Alt Text (AZ)",
          type: "string",
        }),
        defineField({
          name: "altRu",
          title: "Alt Text (RU)",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "phone",
      title: "Phone",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "phoneLabelAz",
      title: "Phone Label (AZ)",
      type: "string",
    }),
    defineField({
      name: "phoneLabelRu",
      title: "Phone Label (RU)",
      type: "string",
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      validation: (rule) => rule.email(),
    }),
    defineField({
      name: "emailLabelAz",
      title: "Email Label (AZ)",
      type: "string",
    }),
    defineField({
      name: "emailLabelRu",
      title: "Email Label (RU)",
      type: "string",
    }),
    defineField({
      name: "infoTitleAz",
      title: "Hours Title (AZ)",
      type: "string",
    }),
    defineField({
      name: "infoTitleRu",
      title: "Hours Title (RU)",
      type: "string",
    }),
    defineField({
      name: "infoTextAz",
      title: "Hours Line 1 (AZ)",
      type: "string",
    }),
    defineField({
      name: "infoTextAzSecondary",
      title: "Hours Line 2 (AZ)",
      type: "string",
    }),
    defineField({
      name: "infoTextRu",
      title: "Hours Line 1 (RU)",
      type: "string",
    }),
    defineField({
      name: "infoTextRuSecondary",
      title: "Hours Line 2 (RU)",
      type: "string",
    }),
    defineField({
      name: "socialsTitleAz",
      title: "Socials Title (AZ)",
      type: "string",
    }),
    defineField({
      name: "socialsTitleRu",
      title: "Socials Title (RU)",
      type: "string",
    }),
    defineField({
      name: "socialsSubtitleAz",
      title: "Socials Subtitle (AZ)",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "socialsSubtitleRu",
      title: "Socials Subtitle (RU)",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "socialLinks",
      title: "Social Links",
      type: "array",
      of: [
        defineField({
          name: "socialLink",
          type: "object",
          fields: [
            defineField({
              name: "platform",
              title: "Platform",
              type: "string",
              options: {
                list: [
                  { title: "Telegram", value: "telegram" },
                  { title: "Instagram", value: "instagram" },
                  { title: "WhatsApp", value: "whatsapp" },
                ],
                layout: "radio",
              },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "label",
              title: "Label",
              type: "string",
            }),
            defineField({
              name: "url",
              title: "URL",
              type: "url",
              validation: (rule) => rule.required().uri({ scheme: ["http", "https"] }),
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: "retailLocationsCard",
      title: "Retail Locations Card",
      type: "object",
      fields: [
        defineField({
          name: "titleAz",
          title: "Card Title (AZ)",
          type: "string",
        }),
        defineField({
          name: "titleRu",
          title: "Card Title (RU)",
          type: "string",
        }),
        defineField({
          name: "subtitleAz",
          title: "Card Subtitle (AZ)",
          type: "text",
          rows: 3,
        }),
        defineField({
          name: "subtitleRu",
          title: "Card Subtitle (RU)",
          type: "text",
          rows: 3,
        }),
        defineField({
          name: "locations",
          title: "Store Addresses",
          type: "array",
          of: [
            defineField({
              name: "storeAddress",
              type: "object",
              fields: [
                defineField({
                  name: "locationName",
                  title: "Location Name",
                  type: "string",
                }),
                defineField({
                  name: "addressAz",
                  title: "Address (AZ)",
                  type: "text",
                  rows: 3,
                }),
                defineField({
                  name: "addressRu",
                  title: "Address (RU)",
                  type: "text",
                  rows: 3,
                }),
                defineField({
                  name: "phone",
                  title: "Contact Phone",
                  type: "string",
                }),
                defineField({
                  name: "mapUrl",
                  title: "Map URL",
                  type: "url",
                  validation: (rule) => rule.uri({ scheme: ["http", "https"] }),
                }),
              ],
            }),
          ],
        }),
      ],
    }),
  ],
  preview: {
    select: {
      titleAz: "titleAz",
      media: "heroImage",
    },
    prepare({ titleAz, media }) {
      return {
        title: titleAz || "Contact Page",
        media,
      };
    },
  },
});
