import { BiTerminal } from "react-icons/bi";
import { defineField, defineType } from "sanity";

export default defineType({
  name: "ctfWriteup",
  title: "CTF Writeups",
  type: "document",
  icon: BiTerminal,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "Recommend 40 - 80 characters.",
      validation: (rule) => rule.required().min(12),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description: "Add a slug or generate one from the title.",
      options: { source: "title" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 4,
      description: "Summarize the challenge and key takeaway.",
      validation: (rule) => rule.required().min(80).max(180),
    }),
    defineField({
      name: "date",
      title: "Date",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
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
      name: "platform",
      title: "Platform",
      type: "string",
      description: "Examples: Hack The Box, picoCTF, TryHackMe.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      description: "Examples: Web, Crypto, Forensics, Pwn.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "difficulty",
      title: "Difficulty",
      type: "string",
      description: "Optional challenge difficulty label.",
    }),
    defineField({
      name: "points",
      title: "Points",
      type: "number",
      description: "Optional challenge points score.",
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      description: "Add relevant tags for the challenge or techniques used.",
      of: [{ type: "string" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "body",
      title: "Writeup Body",
      type: "blockContent",
      description: "Walk through the challenge and your solution.",
    }),
    defineField({
      name: "featured",
      title: "Feature Writeup",
      type: "boolean",
      description: "Add this writeup to the featured section.",
    }),
    defineField({
      name: "isPublished",
      title: "Publish Writeup",
      type: "boolean",
      description: "Tick this when the writeup is ready to be visible.",
    }),
  ],
  preview: {
    select: {
      title: "title",
      platform: "platform",
      category: "category",
      isPublished: "isPublished",
      media: "coverImage",
    },
    prepare(selection) {
      const { platform, category, isPublished } = selection;
      return {
        ...selection,
        subtitle: isPublished
          ? `${platform} • ${category}`
          : `Draft • ${platform} • ${category}`,
      };
    },
  },
});
