import { GetCommentRepliesQueryResult, GetPostCommentsQueryResult } from "@/sanity.types";
import React from "react";
import Comment from "./Comment";

async function CommentList({
  postId,
  comments,
  userId,
}: {
  postId: string;
  comments: GetPostCommentsQueryResult | GetCommentRepliesQueryResult;
  userId: string | null;
}) {
  const isRootComment = !comments.some((comment) => 'parentComment' in comment);

  return (
    <section className="mt-8">
      <div className="flex items-center justify-between">
        {isRootComment && (
          <h2 className="text-lg font-semibold text-gray-900">
            Comments({comments.length})
          </h2>
        )}
      </div>

      <div className="divide-y divide-gray-100 rounded-lg bg-white">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <Comment
              key={comment._id}
              postId={postId}
              comment={comment}
              userId={userId}
            />
          ))
        ) : (
          <div className="py-8 text-center">
            <p className="text-gray-500">
              No comments yet. Be the first to comment
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

export default CommentList;
