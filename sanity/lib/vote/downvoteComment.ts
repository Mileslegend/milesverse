import { defineQuery } from "groq";
import { sanityFetch } from "../live";
import { adminClient } from "../adminClient";

// Toggle or set upvote on a post by a user
export async function downvoteComment(commentId: string, userId: string) {
  // Check for existing vote
  const existingVoteDownvoteCommentQuery = defineQuery(`
    *[_type == "vote" && comment._ref == $commentId && user._ref == $userId][0]
  `);

  const existingVote = await sanityFetch({
    query: existingVoteDownvoteCommentQuery,
    params: { commentId, userId },
  });

  
  if (existingVote.data) {
      const vote = existingVote?.data;
    // if there is already an downvote remove it(toggle off)
    if (vote.voteType === "downvote") {
      return await adminClient.delete(vote._id);
    }

    //If there is a up vote Change it to downvote
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
    comment: {
      _type: "reference",
      _ref: commentId,
    },
    user: {
      _type: "reference",
      _ref: userId,
    },
    voteType: "downvote",
    createdAt: new Date().toISOString(),
  });
}
