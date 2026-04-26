import { BiBadgeCheck } from "react-icons/bi";
import { defineField, defineType } from "sanity";

export default defineType({
  name: "certificate",
  title: "Certificates",
  type: "document",
  icon: BiBadgeCheck,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "The name of the certificate or certification.",
      validation: (rule) => rule.required().min(6),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description: "Add a custom slug or generate one from the title.",
      options: { source: "title" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 4,
      description: "A short summary used on the card and detail page.",
      validation: (rule) => rule.required().min(60).max(180),
    }),
    defineField({
      name: "issuer",
      title: "Issuer",
      type: "string",
      description: "The organization that issued this certificate.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "issueDate",
      title: "Issue Date",
      type: "date",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "expiryDate",
      title: "Expiry Date",
      type: "date",
      description: "Leave blank if this certificate does not expire.",
    }),
    defineField({
      name: "credentialId",
      title: "Credential ID",
      type: "string",
      description: "Optional provider-issued credential identifier.",
    }),
    defineField({
      name: "credentialUrl",
      title: "Credential URL",
      type: "url",
      description: "Optional verification link for this certificate.",
    }),
    defineField({
      name: "logo",
      title: "Issuer Logo",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "coverImage",
      title: "Cover Image",
      type: "image",
      description: "Recommended size 1200 x 750.",
      options: {
        hotspot: true,
        metadata: ["lqip"],
      },
      fields: [
        defineField({
          name: "alt",
          title: "Alt",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "string" }],
      description: "Optional tags like platform, focus area, or level.",
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "blockContent",
      description: "Add notes, context, or what this certificate covers.",
    }),
  ],
  preview: {
    select: {
      title: "title",
      issuer: "issuer",
      issueDate: "issueDate",
      media: "logo",
    },
    prepare(selection) {
      const { issuer, issueDate } = selection;
      return {
        ...selection,
        subtitle: issueDate
          ? `${issuer} • ${new Date(issueDate).toDateString()}`
          : issuer,
      };
    },
  },
});
