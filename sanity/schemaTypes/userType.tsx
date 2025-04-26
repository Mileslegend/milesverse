import { defineField, defineType } from "sanity";
import { UserIcon } from "lucide-react";
import Image from "next/image";

export const userType = defineType({
  name: "user",
  title: "User",
  type: "document",
  icon: UserIcon,

  fields: [
    defineField({
      name: "username",
      title: "Username",
      type: "string",
      description: "The unique username for this user",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      description: "User's email address",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "imageUrl",
      title: "Image Url",
      type: "string",
      description: "User's Clerk profile picture",
    }),
    defineField({
        name: "joinedAt",
        title: "Joined At",
        type: "datetime",
        description: "When this user account was created",
        initialValue: () => new Date().toISOString(),
        validation: (rule) => rule.required(),
    }),
    defineField({
        name: "isreported",
        title: "Is Reported",
        type: "boolean",
        description: "Whether this user has been reported",
        initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: "username",
      media: "imageUrl",
    },
    prepare({ title, media }) {
      return {
        title,
        media: media ? (
          <Image src={media} alt={`${title}'s avatar`} width={40} height={40} />
        ) : (
          <UserIcon />
        ),
      };
    },
  },
});
