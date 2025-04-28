import { defineQuery } from "groq";
import { sanityFetch } from "../live";

// Get user vote status for a post
export async function getUserPostVoteStatus(
  postId: string,
  userId: string | null
) {
  if (!userId) return null; // no user, no vote

  const getUserPostVoteStatusQuery = defineQuery(`
    *[_type == "vote" && post._ref == $postId && user._ref == $userId][0].voteType
  `);

  const result = await sanityFetch({
    query: getUserPostVoteStatusQuery,
    params: { postId, userId },
  });

  // Returns "upvote", "downvote", or null if no vote
  return result.data;
}
