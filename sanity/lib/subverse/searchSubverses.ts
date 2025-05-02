import { defineQuery } from "groq";
import { sanityFetch } from "../live";

export async function searchSubverses(searchTerm: string) {
  // Skip any empty search terms
  if (!searchTerm || searchTerm.trim() === "") {
    return [];
  }

  const searchSubVersesQuery = defineQuery(`
    *[_type == "subverse" && title match $searchTerm + "*"]{
      _id,
      title,
      "slug": slug.current,
      description,
      image,
      "moderator": moderator->,
      createdAt
    } | order(createdAt desc)
  `);

  const results = await sanityFetch({
    query: searchSubVersesQuery,
    params: { searchTerm: searchTerm.toLowerCase() },
  });

  return results.data;
}
