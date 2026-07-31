import { defineField, defineType } from "sanity";

export const organisation = defineType({
  name: "organisation",
  title: "Organisation",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Official name",
      type: "string",
      validation: (rule) => rule.required().min(2).max(180),
    }),
    defineField({
      name: "shortName",
      title: "Short name",
      type: "string",
      validation: (rule) => rule.max(40),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "governmentLevel",
      title: "Government level",
      type: "string",
      options: {
        list: [
          { title: "Central", value: "central" },
          { title: "State / UT", value: "state" },
          { title: "Local", value: "local" },
          { title: "University / institution", value: "institution" },
          { title: "Other", value: "other" },
        ],
      },
    }),
    defineField({
      name: "officialWebsite",
      title: "Official website",
      type: "url",
      validation: (rule) => rule.required().uri({ scheme: ["https"] }),
    }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 4,
      validation: (rule) => rule.max(800),
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "shortName", media: "logo" },
  },
});
