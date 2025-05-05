import {
  GetCommentRepliesQueryResult,
  GetPostCommentsQueryResult,
} from "@/sanity.types";
import { getCommentReplies } from "@/sanity/lib/comment/getCommentReplies";
import { UserCircle } from "lucide-react";
import Image from "next/image";
import React from "react";
import TimeAgo from "../TimeAgo";
import CommentList from "./CommentList";
import CommentReply from "./CommentReply";
import PostVoteButtons from "../post/PostVoteButtons";

async function Comment({
  postId,
  comment,
  userId,
}: {
  postId: string;
  comment:
    | GetPostCommentsQueryResult[number]
    | GetCommentRepliesQueryResult[number];
  userId: string | null;
}) {
  const replies = await getCommentReplies(comment._id, userId);

  const userVoteStatus = comment.votes.voteStatus;

  // Ensure consistent property naming for votes
  const normalizedVotes = {
    upvotes: comment.votes.upvotes,
    downvotes: comment.votes.downvotes,
    netScore: 'netScore' in comment.votes 
      ? (comment.votes as any).netScore 
      : (comment.votes as any).netscore,
    voteStatus: comment.votes.voteStatus
  };

  return (
    <article className="py-5 border-b border-gray-100 last:border-0">
      <div className="flex gap-4">
        {/* PostVoteButtons */}
        <PostVoteButtons 
          contentId={comment._id}
          votes={normalizedVotes}
          vote={userVoteStatus}
          contentType="comment"
        />
        <div className="flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            {comment.author?.imageUrl ? (
              <div className="flex-shrink-0">
                <Image
                  src={comment.author.imageUrl}
                  alt={`${comment.author.username}'s profile`}
                  className="w-10 h-10 rounded-full object-cover"
                  height={40}
                  width={40}
                />
              </div>
            ) : (
              <div className="flex-shrink-0">
                <UserCircle className="w-10 h-10 text-gray-300" />
              </div>
            )}

            <h3 className="font-medium text-gray-900">
              {comment.author?.username || "Anonymous"}
            </h3>
            <span className="text-xs text-gray-500 ">
              <TimeAgo date={new Date(
                ('createdAt' in comment 
                  ? (comment as any).createdAt 
                  : (comment as any)._createdAt)!
              )} />
            </span>
          </div>
          <p className="text-gray-700 leading-relaxed">{comment.content}</p>

          <CommentReply postId={postId} comment={comment}  />
          {/* Comment replies - supports infinite nesting */}
          {
            replies?.length > 0 && (
              <div className="mt-3 ps-2 border-s-2 border-gray-100">
                <CommentList postId={postId} comments={replies} userId={userId} />
              </div>
            )
          }
        </div>
      </div>
    </article>
  );
}

export default Comment;
