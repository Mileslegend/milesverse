import { defineField, defineType } from "sanity";
import { TagIcon } from "lucide-react";

export const subverseType = defineType({
    name: "subverse",
    title: "Subverse",
    type: "document",
    icon: TagIcon,
    description: "A community  where users can post and engage with content",
    fields: [
        defineField({
            name: "title",
            title: "Title",
            type: "string",
            description: "Name of the subverse",
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: "description",
            title: "Description",
            type: "text",
            description: "A brief description of what this subverse is about",
        }),
        defineField({
            name: "slug",
            title: "Slug",
            type: "slug",
            description: "The unique URL-friendly identifier for this subverse",
            options: { source: "title"},
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: "image",
            title: "Image",
            type: "image",
            description: "Icon or banner image for the subverse",
            fields: [
                {
                    name: "alt",
                    type: "string",
                    title: "Alt Text",
                    description: "Alternative text for screen readers and seo"
                }
            ]
        }),
        defineField({
            name: "moderator",
            title: "Moderator",
            type: "reference",
            description: "The user who created this subverse and has admin priviledges",
            to: [{type: "user"}],
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: "createdAt",
            title: "Created At",
            type: "datetime",
            description: "When the subverse was created",
            initialValue: () => new Date().toISOString(),
            validation: (rule) => rule.required(),
        }),
    ],
    preview: {
        select: {
            title: "title",
            media: "image"
        }
    }
})