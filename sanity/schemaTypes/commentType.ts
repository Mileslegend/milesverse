import { MessageSquare } from "lucide-react";
import { defineField, defineType } from "sanity";

export const commentType = defineType({
  name: "comment",
  title: "Comment",
  type: "document",
  icon: MessageSquare,
  description: "A comment on a post or another comment",
  fields: [
    defineField({
      name: "content",
      title: "Content",
      type: "text",
      description: "The text content of the comment",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "author",
      title: "Author",
      type: "reference",
      description: "The user who wrote this comment",
      to: [{ type: "user" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "post",
      title: "Post",
      type: "reference",
      description: "If this is a reply, reference to the parent comment",
      to: [{ type: "comment" }],
    }),
    defineField({
      name: "parentComment",
      title: "Parent Comment",
      type: "reference",
      description: "If this is a reply , reference to parent comment",
      to: [{ type: "comment" }],
    }),
    defineField({
      name: "isReported",
      title: "Is Reported",
      type: "boolean",
      description: "Indicates if this comment has been reported by users",
      initialValue: false,
    }),
    defineField({
      name: "createdAt",
      title: "Created At",
      type: "datetime",
      description: "The time the comment was created",
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
    // defineField({
    //   name: "content",
    //   title: "Content",
    //   type: "text",
    //   description: "The text content of the comment",
    //   validation: (rule) => rule.required(),
    // }),
    defineField({
      name: "isDeleted",
      title: "Is Deleted",
      type: "boolean",
      description: "Indicates if this post has been deleted",
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: "content",
      subtitle: "author.username",
    },
    prepare({ title, subtitle }) {
      return {
        title,
        subtitle,
      };
    },
  },
});
