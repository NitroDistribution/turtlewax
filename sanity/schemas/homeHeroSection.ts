import { defineField, defineType } from "sanity";

export const homeHeroSectionType = defineType({
  name: "homeHeroSection",
  title: "Home Page",
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
      rows: 4,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "subtitleRu",
      title: "Subtitle (RU)",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "backgroundImage",
      title: "Background Image",
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
      name: "featuredSection",
      title: "Featured Products Section",
      type: "object",
      options: {
        collapsible: true,
        collapsed: false,
      },
      fields: [
        defineField({
          name: "taglineAz",
          title: "Tagline (AZ)",
          type: "string",
        }),
        defineField({
          name: "taglineRu",
          title: "Tagline (RU)",
          type: "string",
        }),
        defineField({
          name: "titleAz",
          title: "Title (AZ)",
          type: "string",
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
        }),
        defineField({
          name: "subtitleRu",
          title: "Subtitle (RU)",
          type: "text",
          rows: 3,
        }),
      ],
    }),
    defineField({
      name: "categoriesSection",
      title: "Categories Section",
      type: "object",
      options: {
        collapsible: true,
        collapsed: true,
      },
      fields: [
        defineField({
          name: "taglineAz",
          title: "Tagline (AZ)",
          type: "string",
        }),
        defineField({
          name: "taglineRu",
          title: "Tagline (RU)",
          type: "string",
        }),
        defineField({
          name: "titleAz",
          title: "Title (AZ)",
          type: "string",
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
        }),
        defineField({
          name: "subtitleRu",
          title: "Subtitle (RU)",
          type: "text",
          rows: 3,
        }),
        defineField({
          name: "viewAllAz",
          title: "View All Label (AZ)",
          type: "string",
        }),
        defineField({
          name: "viewAllRu",
          title: "View All Label (RU)",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "collectionSection",
      title: "Collection Highlight Section",
      type: "object",
      options: {
        collapsible: true,
        collapsed: true,
      },
      fields: [
        defineField({
          name: "taglineAz",
          title: "Tagline (AZ)",
          type: "string",
        }),
        defineField({
          name: "taglineRu",
          title: "Tagline (RU)",
          type: "string",
        }),
        defineField({
          name: "titleAz",
          title: "Title (AZ)",
          type: "string",
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
        }),
        defineField({
          name: "subtitleRu",
          title: "Subtitle (RU)",
          type: "text",
          rows: 3,
        }),
        defineField({
          name: "viewAllAz",
          title: "View All Label (AZ)",
          type: "string",
        }),
        defineField({
          name: "viewAllRu",
          title: "View All Label (RU)",
          type: "string",
        }),
      ],
    }),
  ],
  preview: {
    select: {
      titleAz: "titleAz",
      media: "backgroundImage",
    },
    prepare({ titleAz, media }) {
      return {
        title: titleAz || "Home Page",
        media,
      };
    },
  },
});
