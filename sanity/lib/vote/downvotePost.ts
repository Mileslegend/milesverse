import { defineQuery } from "groq";
import { sanityFetch } from "../live";
import { adminClient } from "../adminClient";

// Toggle or set upvote on a post by a user
export async function downvotePost(postId: string, userId: string) {
  // Check for existing vote
  const existingVoteQuery = defineQuery(`
    *[_type == "vote" && post._ref == $postId && user._ref == $userId][0]
  `);

  const result = await sanityFetch({
    query: existingVoteQuery,
    params: { postId, userId },
  });

  const vote = result?.data;

  if (vote) {
    // Toggle off if already an upvote
    if (vote.voteType === "downvote") {
      return await adminClient.delete(vote._id);
    }

    // Change upvote to downvote
    if (vote.voteType === "upvote") {
      return await adminClient
        .patch(vote._id)
        .set({ voteType: "downvote" })
        .commit();
    }
  }

  // Create new downvote
  return await adminClient.create({
    _type: "vote",
    post: {
      _type: "reference",
      _ref: postId,
    },
    user: {
      _type: "reference",
      _ref: userId,
    },
    voteType: "downvote",
    createdAt: new Date().toISOString(),
  });
}
