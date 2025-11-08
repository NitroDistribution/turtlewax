import { defineField, defineType } from "sanity";

export const siteSettingsType = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({
      name: "catalogTitleAz",
      title: "Catalog Title (AZ)",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "catalogTitleRu",
      title: "Catalog Title (RU)",
      type: "string",
    }),
    defineField({
      name: "catalogCtaAz",
      title: "Catalog CTA Label (AZ)",
      type: "string",
      initialValue: "Yüklə",
    }),
    defineField({
      name: "catalogCtaRu",
      title: "Catalog CTA Label (RU)",
      type: "string",
      initialValue: "Скачать",
    }),
    defineField({
      name: "catalogFile",
      title: "Catalog PDF",
      type: "file",
      options: {
        accept: "application/pdf",
      },
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "catalogTitleAz",
    },
    prepare({ title }) {
      return {
        title: title || "Site Settings",
      };
    },
  },
});
