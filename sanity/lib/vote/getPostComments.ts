import { defineQuery } from "groq";
import { sanityFetch } from "../live";

// Get all top-level comments for a post
export async function getPostComments(postId: string, userId: string | null) {

  if (!userId) userId = ""; // optional fallback if you want to send blank instead of blocking

  const getPostCommentsQuery = defineQuery(`
    *[_type == "comment" && post._ref == $postId && !defined(parentComment)] {
      _id,
      content,
      createdAt,
      "author": author->,
      "replies": *[_type == "comment" && parentComment._ref == ^._id] {
        _id,
        content,
        createdAt,
        "author": author->,
      },
      "votes": {
        "upvotes": count(*[_type == "vote" && comment._ref == ^._id && voteType == "upvote"]),
        "downvotes": count(*[_type == "vote" && comment._ref == ^._id && voteType == "downvote"]),
        "netscore": count(*[_type == "vote" && comment._ref == ^._id && voteType == "upvote"])
                    - 
                    count(*[_type == "vote" && comment._ref == ^._id && voteType == "downvote"]),
        "voteStatus": *[_type == "vote" && comment._ref == ^._id && user._ref == $userId][0].voteType
      }
    } | order(createdAt desc)
  `);

  const result = await sanityFetch({
    query: getPostCommentsQuery,
    params: { postId, userId },
  });

  return result.data;
}
