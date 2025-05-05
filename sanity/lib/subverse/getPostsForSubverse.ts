import { defineQuery } from "groq";
import { sanityFetch } from "../live";

export default async function getPostsForSubverse(id: string) {
  const getPostsForSubverseQuery = defineQuery(`
    *[_type == "post" && subverse._ref == $id]{
      ...,
      "slug": slug.current,
      "author": author->,
      "subverse": subverse->,
      "category": category->,
      "upvotes": count(*[_type == "vote" && post._ref == ^._id && voteType == "upvote"]),
      "downvotes": count(*[_type == "vote" && post._ref == ^._id && voteType == "downvote"]),
      "netScore": count(*[_type == "vote" && post._ref == ^._id && voteType == "upvote"])
                 - 
                 count(*[_type == "vote" && post._ref == ^._id && voteType == "downvote"]),
      "commentCount": count(*[_type == "comment" && post._ref == ^._id])
    } | order(publishedAt desc)
  `);

  const result = await sanityFetch({
    query: getPostsForSubverseQuery,
    params: { id },
  });

  return result.data;
}
