import { defineArrayMember, defineField, defineType } from "sanity";

const categories = [
  { title: "Latest Jobs", value: "latest-jobs" },
  { title: "Results", value: "results" },
  { title: "Admit Cards and Exam Dates", value: "admit-cards" },
  { title: "Answer Keys", value: "answer-keys" },
  { title: "Syllabus", value: "syllabus" },
  { title: "Admissions", value: "admissions" },
  { title: "Scholarships", value: "scholarships" },
] as const;

const linkTypes = [
  { title: "Apply online", value: "apply" },
  { title: "Official notification", value: "notification" },
  { title: "Result / score card", value: "result" },
  { title: "Admit card / exam city", value: "admit-card" },
  { title: "Answer key / response sheet", value: "answer-key" },
  { title: "Syllabus", value: "syllabus" },
  { title: "Organisation website", value: "organisation" },
  { title: "Other official resource", value: "other" },
] as const;

export const notification = defineType({
  name: "notification",
  title: "Notification",
  type: "document",
  groups: [
    { name: "overview", title: "Overview", default: true },
    { name: "requirements", title: "Dates & requirements" },
    { name: "posts", title: "Vacancies / posts" },
    { name: "actions", title: "Instructions & links" },
    { name: "publishing", title: "Publishing & SEO" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Notification title",
      type: "string",
      group: "overview",
      validation: (rule) => rule.required().min(10).max(160),
    }),
    defineField({
      name: "slug",
      title: "URL slug",
      type: "slug",
      group: "overview",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "category",
      title: "Section",
      type: "string",
      group: "overview",
      options: { list: [...categories], layout: "dropdown" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "organisation",
      title: "Organisation",
      type: "reference",
      group: "overview",
      to: [{ type: "organisation" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "updateMetadata",
      title: "Update metadata",
      type: "object",
      group: "overview",
      fields: [
        defineField({
          name: "referenceNumber",
          title: "Advertisement / reference number",
          type: "string",
          validation: (rule) => rule.max(100),
        }),
        defineField({
          name: "updateLabel",
          title: "Update label",
          description: 'For example: "Applications open" or "Result released".',
          type: "string",
          validation: (rule) => rule.max(80),
        }),
        defineField({
          name: "publishedAt",
          title: "Originally published",
          type: "datetime",
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "updatedAt",
          title: "Last verified / updated",
          type: "datetime",
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "sourceVerified",
          title: "Verified against an official source",
          type: "boolean",
          initialValue: false,
          validation: (rule) =>
            rule.custom((verified, context) => {
              const status = (context.document as { editorialStatus?: string })
                ?.editorialStatus;
              return status !== "published" || verified === true
                ? true
                : "Verification is required before publishing.";
            }),
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "shortInformation",
      title: "Short information",
      type: "text",
      rows: 5,
      group: "overview",
      validation: (rule) => rule.required().min(40).max(1200),
    }),
    defineField({
      name: "importantDates",
      title: "Important dates",
      type: "array",
      group: "requirements",
      of: [
        defineArrayMember({
          type: "object",
          name: "importantDate",
          fields: [
            defineField({
              name: "label",
              title: "Event",
              type: "string",
              validation: (rule) => rule.required().max(100),
            }),
            defineField({ name: "date", title: "Date", type: "date" }),
            defineField({
              name: "displayText",
              title: "Display text",
              description: 'Use for values such as "As per schedule".',
              type: "string",
              validation: (rule) =>
                rule.custom((value, context) => {
                  const parent = context.parent as { date?: string };
                  return value || parent?.date
                    ? true
                    : "Provide either a date or display text.";
                }),
            }),
            defineField({
              name: "isTentative",
              title: "Tentative",
              type: "boolean",
              initialValue: false,
            }),
            defineField({ name: "note", title: "Note", type: "string" }),
          ],
          preview: {
            select: { title: "label", date: "date", text: "displayText" },
            prepare: ({ title, date, text }) => ({
              title,
              subtitle: date || text || "Date pending",
            }),
          },
        }),
      ],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "applicationFees",
      title: "Application fees",
      type: "array",
      group: "requirements",
      of: [
        defineArrayMember({
          type: "object",
          name: "applicationFee",
          fields: [
            defineField({
              name: "category",
              title: "Applicant category",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "amount",
              title: "Amount (INR)",
              type: "number",
              validation: (rule) => rule.required().integer().min(0),
            }),
            defineField({ name: "note", title: "Note", type: "string" }),
          ],
          preview: {
            select: { title: "category", amount: "amount" },
            prepare: ({ title, amount }) => ({
              title,
              subtitle: amount === 0 ? "No fee" : `₹${amount}`,
            }),
          },
        }),
      ],
    }),
    defineField({
      name: "feePaymentMethods",
      title: "Fee payment methods",
      type: "array",
      group: "requirements",
      of: [defineArrayMember({ type: "string" })],
      options: { layout: "tags" },
    }),
    defineField({
      name: "ageLimits",
      title: "Age limits",
      type: "array",
      group: "requirements",
      of: [
        defineArrayMember({
          type: "object",
          name: "ageLimit",
          fields: [
            defineField({
              name: "label",
              title: "Rule / post",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "minimumYears",
              title: "Minimum age",
              type: "number",
              validation: (rule) => rule.integer().min(0).max(100),
            }),
            defineField({
              name: "maximumYears",
              title: "Maximum age",
              type: "number",
              validation: (rule) => rule.integer().min(0).max(100),
            }),
            defineField({ name: "calculatedOn", title: "Age calculated on", type: "date" }),
            defineField({
              name: "relaxation",
              title: "Relaxation / notes",
              type: "text",
              rows: 3,
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: "eligibility",
      title: "Eligibility",
      type: "array",
      group: "requirements",
      of: [
        defineArrayMember({
          type: "object",
          name: "eligibilityRule",
          fields: [
            defineField({
              name: "title",
              title: "Requirement",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "details",
              title: "Details",
              type: "text",
              rows: 4,
              validation: (rule) => rule.required(),
            }),
          ],
        }),
      ],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "vacancies",
      title: "Vacancy / post table",
      type: "array",
      group: "posts",
      of: [
        defineArrayMember({
          type: "object",
          name: "vacancy",
          fields: [
            defineField({
              name: "postName",
              title: "Post / course / exam",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "totalPosts",
              title: "Total posts",
              type: "number",
              validation: (rule) => rule.integer().min(0),
            }),
            defineField({
              name: "totalDisplay",
              title: "Total display text",
              description: 'Use when the total is unknown, such as "See notice".',
              type: "string",
            }),
            defineField({
              name: "categoryBreakdown",
              title: "Category-wise posts",
              type: "array",
              of: [
                defineArrayMember({
                  type: "object",
                  name: "vacancyCategory",
                  fields: [
                    defineField({
                      name: "category",
                      title: "Category",
                      type: "string",
                      validation: (rule) => rule.required(),
                    }),
                    defineField({
                      name: "posts",
                      title: "Posts",
                      type: "number",
                      validation: (rule) => rule.required().integer().min(0),
                    }),
                  ],
                }),
              ],
            }),
            defineField({
              name: "eligibilitySummary",
              title: "Eligibility summary",
              type: "text",
              rows: 3,
            }),
            defineField({ name: "payScale", title: "Pay scale", type: "string" }),
          ],
          preview: {
            select: { title: "postName", total: "totalPosts", display: "totalDisplay" },
            prepare: ({ title, total, display }) => ({
              title,
              subtitle: total ?? display ?? "Total not specified",
            }),
          },
        }),
      ],
    }),
    defineField({
      name: "instructionsTitle",
      title: "Instructions heading",
      type: "string",
      group: "actions",
      initialValue: "How to apply or check the update",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "instructions",
      title: "Application / result instructions",
      type: "array",
      group: "actions",
      of: [
        defineArrayMember({
          type: "object",
          name: "instruction",
          fields: [
            defineField({
              name: "title",
              title: "Step title",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "details",
              title: "Step details",
              type: "text",
              rows: 3,
              validation: (rule) => rule.required(),
            }),
          ],
        }),
      ],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "officialLinks",
      title: "Official links",
      type: "array",
      group: "actions",
      of: [
        defineArrayMember({
          type: "object",
          name: "officialLink",
          fields: [
            defineField({
              name: "label",
              title: "Link label",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "linkType",
              title: "Link type",
              type: "string",
              options: { list: [...linkTypes] },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "url",
              title: "Official URL",
              type: "url",
              validation: (rule) =>
                rule.required().uri({ scheme: ["https"] }),
            }),
            defineField({ name: "note", title: "Note", type: "string" }),
          ],
          preview: {
            select: { title: "label", subtitle: "url" },
          },
        }),
      ],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "faqs",
      title: "Frequently asked questions",
      type: "array",
      group: "actions",
      of: [
        defineArrayMember({
          type: "object",
          name: "faq",
          fields: [
            defineField({
              name: "question",
              title: "Question",
              type: "string",
              validation: (rule) => rule.required().min(10).max(180),
            }),
            defineField({
              name: "answer",
              title: "Answer",
              type: "text",
              rows: 4,
              validation: (rule) => rule.required().min(10).max(1200),
            }),
          ],
          preview: { select: { title: "question", subtitle: "answer" } },
        }),
      ],
    }),
    defineField({
      name: "editorialStatus",
      title: "Editorial status",
      type: "string",
      group: "publishing",
      initialValue: "draft",
      options: {
        list: [
          { title: "Draft", value: "draft" },
          { title: "In review", value: "review" },
          { title: "Ready / published", value: "published" },
          { title: "Archived", value: "archived" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "featured",
      title: "Feature on homepage",
      type: "boolean",
      group: "publishing",
      initialValue: false,
    }),
    defineField({
      name: "seo",
      title: "Search metadata",
      type: "object",
      group: "publishing",
      fields: [
        defineField({
          name: "title",
          title: "SEO title",
          type: "string",
          validation: (rule) => rule.max(65),
        }),
        defineField({
          name: "description",
          title: "SEO description",
          type: "text",
          rows: 3,
          validation: (rule) => rule.max(160),
        }),
        defineField({ name: "image", title: "Social image", type: "image" }),
        defineField({
          name: "noIndex",
          title: "Hide from search engines",
          type: "boolean",
          initialValue: false,
        }),
      ],
    }),
  ],
  orderings: [
    {
      title: "Recently updated",
      name: "updatedAtDesc",
      by: [{ field: "updateMetadata.updatedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      category: "category",
      organisation: "organisation.shortName",
      status: "editorialStatus",
    },
    prepare: ({ title, category, organisation, status }) => ({
      title,
      subtitle: [organisation, category, status].filter(Boolean).join(" · "),
    }),
  },
});
