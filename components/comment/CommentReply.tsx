"use client"
import {
  GetCommentRepliesQueryResult,
  GetPostCommentsQueryResult,
} from "@/sanity.types";
import { useUser } from "@clerk/nextjs";
import React, { useState } from "react";
import CommentInput from "./CommentInput";
import { MessageCircle } from "lucide-react";

function CommentReply({
  postId,
  comment,
}: {
  postId: string;
  comment:
    | GetPostCommentsQueryResult[number]
    | GetCommentRepliesQueryResult[number];
}) {
  const { isSignedIn } = useUser();
  const [isReplying, setIsReplying] = useState(false);

  return (
    <div>
      <div className="flex items-center gap-2">
        <button 
        onClick={() => setIsReplying(!isReplying)}
        disabled={!isSignedIn}
        className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-green-500 transition-colors mt-1 disabled:opacity-50 disabled:cursor-not-allowed">
          <MessageCircle className="w-3.5 h-3.5" />
          {isReplying ? "Cancel" : isSignedIn ? "Reply" : "Sign in to reply"}
        </button>

        {/* <ReportButton contentId = {comment._id} />
        {
            comment.author?._id && (
                <DeleteButton 
                contentOwnerId={comment.author?._id}
                contentId={comment._id}
                contentType="comment"
                />
            )
        } */}
      </div>
      {isReplying && (
        <div className="mt-3 ps-2 border-s-2 border-gray-100">
          <CommentInput postId={postId} parentCommentId={comment._id} />
        </div>
      )}
    </div>
  );
}

export default CommentReply;
