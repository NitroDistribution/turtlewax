import { defineArrayMember, defineField, defineType } from "sanity";

export const aboutPageType = defineType({
  name: "aboutPage",
  title: "About Page",
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
      name: "paragraphsAz",
      title: "Paragraphs (AZ)",
      type: "array",
      of: [defineArrayMember({ type: "text" })],
      validation: (rule) => rule.min(1),
    }),
    defineField({
      name: "paragraphsRu",
      title: "Paragraphs (RU)",
      type: "array",
      of: [defineArrayMember({ type: "text" })],
    }),
    defineField({
      name: "videoTitleAz",
      title: "Video Title (AZ)",
      type: "string",
    }),
    defineField({
      name: "videoTitleRu",
      title: "Video Title (RU)",
      type: "string",
    }),
    defineField({
      name: "videoUrl",
      title: "YouTube URL",
      type: "url",
      validation: (rule) => rule.uri({ scheme: ["http", "https"] }),
    }),
  ],
  preview: {
    select: {
      titleAz: "titleAz",
      media: "heroImage",
    },
    prepare({ titleAz, media }) {
      return {
        title: titleAz || "About Page",
        media,
      };
    },
  },
});
