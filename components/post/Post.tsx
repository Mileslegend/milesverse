import {
  GetAllPostsQueryResult,
  GetPostsForSubverseQueryResult,
} from "@/sanity.types";
import Image from "next/image";
import React from "react";
import TimeAgo from "../TimeAgo";
import { urlFor } from "@/sanity/lib/image";
import { MessageSquare } from "lucide-react";
import { getPostComments } from "@/sanity/lib/vote/getPostComments";
import { getUserPostVoteStatus } from "@/sanity/lib/vote/getUserPostVoteStatus";
import { getPostVotes } from "@/sanity/lib/vote/getPostVotes";
import CommentInput from "../comment/CommentInput";
import CommentList from "../comment/CommentList";
import PostVoteButtons from "./PostVoteButtons";
import ReportButton from "../ReportButton";

interface PostProps {
  post: GetAllPostsQueryResult[number] | GetPostsForSubverseQueryResult[number];
  userId: string | null;
}

async function Post({ post, userId }: PostProps) {
  const votes = await getPostVotes(post._id);
  const vote = await getUserPostVoteStatus(post._id, userId);
  const comments = await getPostComments(post._id, userId);

  return (
    <article
      key={post._id}
      className="relative bg-white rounded-md shadow-sm border border-gray-700 hover:border-gray-300 transition-colors"
    >
      <div className="flex ">
        {/* vote buttons */}

        <PostVoteButtons
          contentId={post._id}
          votes={votes}
          vote={vote}
          contentType="post"
        />

        {/* Post Content */}
        <div className="flex-1 p-3">
          <div className="flex items-center text-xs mb-2 text-gray-500 gap-2">
            {post.subverse && (
              <>
                <a
                  href={`/community/${post.subverse.slug}`}
                  className="font-medium hover:underline"
                >
                  c/{post.subverse.title}
                </a>
                <span>*</span>
                <span>Posted by</span>
                {post.author && (
                  <a
                    href={`/u/${post.author.username}`}
                    className="hover:underline"
                  >
                    u/{post.author.username}
                  </a>
                )}
                <span>*</span>
                {post.publishedAt && (
                  <TimeAgo date={new Date(post.publishedAt)} />
                )}
              </>
            )}
          </div>
          {post.subverse && (
            <div>
              <h2 className="text-lg font-medium text-gray-9oo mb-2">
                {post.title}
              </h2>
            </div>
          )}

          {post.body && post.body[0]?.children?.[0].text && (
            <div className="prose prose-sm max-w-none text-gray-700 mb-3">
              {post.body[0].children[0].text}
            </div>
          )}

          {post.image && post.image.asset?._ref && (
            <div className="relative w-full h-64 mb-3 px-2 bg-gray-100/30">
              <Image
                src={urlFor(post.image).url()}
                alt={post.image.alt || "Post image"}
                fill
                className="object-contain rounded-md p-2"
              />
            </div>
          )}
          <button className="flex items-center px-1 py-2 gap-1 text-sm text-gray-500">
            <MessageSquare className="w-4 h-4" />
            <span className="space-x-2">{comments.length} Comments</span>
          </button>
          {/* Comment Input */}
          <CommentInput postId={post._id} />
          {/* CommentList */}
          <CommentList postId={post._id} comments={comments} userId={userId} />
        </div>
      </div>

      {/* Buttons */}
      {/* Report Button */}
      <div className="absolute top-2 right-2 ">
        <div className="flex items-center gap-2">
          <ReportButton contentId={post._id} />
        </div>
      </div>
      {/* Delete Button */}
    </article>
  );
}

export default Post;
