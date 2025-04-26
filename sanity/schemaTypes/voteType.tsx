import { defineField, defineType } from "sanity";
import { ArrowDown, ArrowUp } from "lucide-react";

export const voteType = defineType({
  name: "vote",
  title: "Vote",
  type: "document",
  icon: ArrowUp,
  description: "Tracks user votes on posts and comments",
  fields: [
    defineField({
      name: "user",
      title: "User",
      type: "reference",
      description: "The user who cast this vote",
      to: [{ type: "user" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "voteType",
      title: "Vote Type",
      type: "string",
      description: "Whether this is an upvote or downvote",
      options: {
        list: [
          { title: "Upvote", value: "upvote" },
          { title: "Downvote", value: "downvote" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "post",
      title: "Post",
      type: "reference",
      description: "The post being voted on (if applicable)",
      to: [{ type: "post" }],
    }),
    // defineField({
    //   name: "user",
    //   title: "User",
    //   type: "reference",
    //   description: "The user who cast this vote",
    //   to: [{ type: "user" }],
    //   validation: (rule) => rule.required(),
    // }),
    defineField({
      name: "comment",
      title: "Comment",
      type: "reference",
      description: "The comment being voted on (if applicable)",
      to: [{ type: "comment" }],
    }),
    defineField({
      name: "createdAt",
      title: "Created At",
      type: "datetime",
      description: "When this vote was cast",
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      voteType: "voteType",
      postTitle: "post.title",
      commentTitle: "comment.ttile",
      username: "user.username",
    },
    prepare(selection) {
      const { voteType, postTitle, commentTitle, username } = selection;
      return {
        title: postTitle || commentTitle,
        subtitle: username,
        media: voteType === "upvote" ? <ArrowUp /> : <ArrowDown />,
      };
    },
  },
  validation: (rule) =>
    rule.custom((fields) => {
      //Either post or comment must be set but not both
      if (fields?.post && fields?.comment) {
        return "Cannot comment on both a post and comment simultaneously";
      }
      if (!fields?.post && !fields?.comment) {
        return "Must vote on either a post or comment";
      }
      return true;
    }),
});
