import { adminClient } from "../adminClient";

interface AddCommentParams {
  content: string;
  postId: string;
  userId: string; //This should be the Sanity user document ID
  parentCommentId?: string;
}

export async function addComment({
  content,
  postId,
  parentCommentId,
  userId,
}: AddCommentParams) {
  try {
    //Create comment document
    const commentData = {
      _type: "comment",
      content,
      author: {
        _type: "reference",
        _ref: userId,
      },
      post: {
        _type: "reference",
        _ref: postId,
      },
      parentComment: parentCommentId
        ? {
            _type: "reference",
            _ref: parentCommentId,
          }
        : undefined,
      createdAt: new Date().toISOString(),
    };

    //create comment in sanity
    const comment = await adminClient.create(commentData);

    return { comment };
  } catch (error) {
    console.error("Error adding comment in sanity:", error);
    return { error: "Failed to add comment" };
  }
}
