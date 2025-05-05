import { defineField, defineType } from "sanity";
import { FileText } from "lucide-react";

export const postType = defineType({
  name: "post",
  title: "Post",
  type: "document",
  icon: FileText,
  description: "A user-submitted post in a subverse",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "The title of the post",
      validation: (rule) => rule.required().max(300),
    }),
    defineField({
      name: "originalTitle",
      title: "Original Title",
      type: "string",
      description: "Stores the original title if the piost is deleted",
      hidden: true,
    }),
    defineField({
      name: "author",
      title: "Author",
      type: "reference",
      description: "The user who created this post",
      to: [{ type: "user" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "subverse",
      title: "Subverse",
      type: "reference",
      description: "The subverse this post belongs to",
      to: [{ type: "subverse" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      description: "The main content of the post",
      of: [{ type: "block" }],
    }),
    // defineField({
    //     name: "originalBody",
    //     title: "Original Body",
    //     type: "array",
    //     description: "Stores the original content if the post is deleted",
    //     of: [{type: "block"}],
    //     hidden: true,
    // }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      description: "Optional image for the post",
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alt text",
          description: "Alternative text for screen readers and SEO",
        },
      ],
    }),
    defineField({
      name: "isReported",
      title: "Is Reported",
      type: "boolean",
      description: "Indicates if this post has been reported by users",
      initialValue: false,
    }),
    defineField({
      name: "publishedAt",
      title: "Published At",
      type: "datetime",
      description: "When this post was published",
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
    defineField({
        name: "isDeleted",
        title: "Is Deleted",
        type: "boolean",
        description: "Indicates if this post was deleted",
        initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "author.username",
      media: "image",
    },
    prepare({ title, subtitle, media }) {
      return {
        title,
        subtitle,
        media,
      };
    },
  },
});
