import { defineField, defineType } from "sanity";

export const categoryType = defineType({
  name: "category",
  title: "Category",
  type: "document",
  fields: [
    defineField({
      name: "titleAz",
      title: "Name (AZ)",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "titleRu",
      title: "Name (RU)",
      type: "string",
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "string",
      description: "Lowercase English slug used in URLs. Changing it will break links.",
      validation: (rule) =>
        rule
          .required()
          .regex(/^[a-z0-9\-/]+$/, { name: "slug" })
          .error("Use lowercase English letters, numbers, dashes, or forward slashes."),
    }),
    defineField({
      name: "order",
      title: "Order",
      type: "number",
      description: "Items with a lower number appear first.",
      validation: (rule) => rule.required().min(0),
    }),
    defineField({
      name: "image",
      title: "Image",
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
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "titleAz",
      media: "image",
      order: "order",
    },
    prepare({ title, media, order }) {
      return {
        title: title || "Untitled category",
        subtitle: typeof order === "number" ? `Order ${order}` : undefined,
        media,
      };
    },
  },
});
