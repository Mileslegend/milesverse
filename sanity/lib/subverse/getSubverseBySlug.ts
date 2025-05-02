import { defineQuery } from "groq";
import { sanityFetch } from "../live";

export default async function getSubverseBySlug(slug: string) {
  const getSubverseBySlugQuery = defineQuery(`
    *[_type == "subverse" && slug.current == $slug][0]{
      ...,
      "slug": slug.current,
      "moderator": moderator->,
    }
  `);

  const subverse = await sanityFetch({
    query: getSubverseBySlugQuery,
    params: { slug },
  });

  return subverse.data;
}
