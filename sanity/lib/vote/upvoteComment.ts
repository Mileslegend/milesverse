import { defineQuery } from "groq";
import { sanityFetch } from "../live";
import { adminClient } from "../adminClient";

// Toggle or set upvote on a post by a user
export async function upvoteComment(commentId: string, userId: string) {
  // Check for existing vote
  const existingVoteUpvoteCommentQuery = defineQuery(`
    *[_type == "vote" && comment._ref == $commentId && user._ref == $userId][0]
  `);

  const existingVote = await sanityFetch({
    query: existingVoteUpvoteCommentQuery,
    params: { commentId, userId },
  });

  
  if (existingVote.data) {
      const vote = existingVote?.data;
    // if there is already an upvote remove it(toggle off)
    if (vote.voteType === "upvote") {
      return await adminClient.delete(vote._id);
    }

    //If there is a down vote Change it to upvote
    if (vote.voteType === "downvote") {
      return await adminClient
        .patch(vote._id)
        .set({ voteType: "upvote" })
        .commit();
    }
  }

  // Create new upvote
  return await adminClient.create({
    _type: "vote",
    comment: {
      _type: "reference",
      _ref: commentId,
    },
    user: {
      _type: "reference",
      _ref: userId,
    },
    voteType: "upvote",
    createdAt: new Date().toISOString(),
  });
}
