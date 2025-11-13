import { defineArrayMember, defineField, defineType } from "sanity";

export const productType = defineType({
  name: "product",
  title: "Product",
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
      description: "URL-safe slug. Do not edit unless you also update the website URLs.",
      validation: (rule) =>
        rule
          .required()
          .regex(/^[a-z0-9\-/]+$/, { name: "slug" })
          .error("Use lowercase English letters, numbers, dashes, or forward slashes."),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "category" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "order",
      title: "Order",
      type: "number",
      description: "Lower numbers appear first within a category.",
      validation: (rule) => rule.required().min(0),
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      description: "Enable to surface this product in the featured products section.",
      initialValue: false,
    }),
    defineField({
      name: "collectionHighlight",
      title: "Collection Highlight",
      type: "boolean",
      description: "Enable to include this product in the home collection grid.",
      initialValue: false,
    }),
    defineField({
      name: "excerptAz",
      title: "Excerpt (AZ)",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "excerptRu",
      title: "Excerpt (RU)",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "price",
      title: "Price (AZN)",
      type: "number",
    }),
    defineField({
      name: "discountPrice",
      title: "Discounted Price (AZN)",
      type: "number",
      description: "Optional discounted price. Must be lower than the base price to display in the store.",
      validation: (rule) =>
        rule.min(0).custom((value, context) => {
          if (value === undefined || value === null) {
            return true;
          }

          const parent = context.parent as { price?: number } | undefined;
          if (parent?.price === undefined || parent.price === null) {
            return "Set a base price before adding a discount.";
          }

          if (value >= parent.price) {
            return "Discounted price must be lower than the base price.";
          }

          return true;
        }),
    }),
    defineField({
      name: "size",
      title: "Size",
      type: "string",
    }),
    defineField({
      name: "whatsappLink",
      title: "WhatsApp Link",
      type: "url",
      description:
        "Optional override. Leave empty to auto-generate from the store WhatsApp number and product title.",
      validation: (rule) => rule.uri({ scheme: ["http", "https"] }),
    }),
    defineField({
      name: "bodyAz",
      title: "Description (AZ)",
      type: "text",
      rows: 10,
    }),
    defineField({
      name: "bodyRu",
      title: "Description (RU)",
      type: "text",
      rows: 10,
    }),
    defineField({
      name: "image",
      title: "Primary Image",
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
    defineField({
      name: "galleryImages",
      title: "Gallery Images",
      type: "array",
      description: "Optional additional images for the product detail gallery (displayed under the main image).",
      of: [
        defineArrayMember({
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
      ],
    }),
    defineField({
      name: "media",
      title: "Media",
      type: "object",
      options: {
        collapsible: true,
        collapsed: true,
      },
      fields: [
        defineField({
          name: "sectionTitleAz",
          title: "Section Title (AZ)",
          type: "string",
        }),
        defineField({
          name: "sectionTitleRu",
          title: "Section Title (RU)",
          type: "string",
        }),
        defineField({
          name: "sectionSubtitleAz",
          title: "Section Subtitle (AZ)",
          type: "text",
          rows: 3,
        }),
        defineField({
          name: "sectionSubtitleRu",
          title: "Section Subtitle (RU)",
          type: "text",
          rows: 3,
        }),
        defineField({
          name: "youtubeVideoId",
          title: "YouTube Video ID",
          type: "string",
          description: "Only the ID portion of the YouTube URL (the characters after v=)",
        }),
        defineField({
          name: "instagramPostUrl",
          title: "Instagram Post URL",
          type: "url",
          validation: (rule) => rule.uri({ scheme: ["http", "https"] }),
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "titleAz",
      media: "image",
      category: "category.titleAz",
      order: "order",
    },
    prepare({ title, media, category, order }) {
      return {
        title: title || "Untitled product",
        subtitle: [category, typeof order === "number" ? `Order ${order}` : undefined]
          .filter(Boolean)
          .join(" • "),
        media,
      };
    },
  },
});
