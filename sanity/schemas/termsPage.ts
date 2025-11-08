import { defineArrayMember, defineField, defineType } from "sanity";

export const termsPageType = defineType({
  name: "termsPage",
  title: "Terms & Conditions",
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
      name: "contentAz",
      title: "Content (AZ)",
      type: "array",
      of: [defineArrayMember({ type: "text" })],
      validation: (rule) => rule.min(1),
    }),
    defineField({
      name: "contentRu",
      title: "Content (RU)",
      type: "array",
      of: [defineArrayMember({ type: "text" })],
    }),
  ],
  preview: {
    select: {
      titleAz: "titleAz",
    },
    prepare({ titleAz }) {
      return {
        title: titleAz || "Terms & Conditions",
      };
    },
  },
});
