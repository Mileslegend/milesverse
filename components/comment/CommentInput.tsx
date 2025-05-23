"use client";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import React, { useState, useTransition } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { createComment } from "@/actions/createComment";

function CommentInput({
  postId,
  parentCommentId,
}: {
  postId: string;
  parentCommentId?: string;
}) {
  const [content, setContent] = useState("");
  const [isPending, startTransition] = useTransition();
  //const router = useRouter();

  //Get user
  const { user } = useUser();

  //Handle Submit button
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    startTransition(async () => {
      try {
        const result = await createComment(postId, content, parentCommentId);
    
        if (result.error) {
          console.error("Error adding comment:", result.error);
        } else {
          setContent(""); // Clear input after success
          // router.refresh(); // optionally refresh
        }
      } catch (error) {
        console.error("Failed to add comment:", error);
      }
    });
  };

  return (
    <form className="flex gap-2 mt-2" onSubmit={handleSubmit}>
      <Input
        value={content}
        onChange={(e) => setContent(e.target.value)}
        type="text"
        placeholder={user ? "Add a comment..." : "Sign in to comment"}
        disabled={isPending || !user}
      />
      <Button
        variant="outline"
        type="submit"
        disabled={isPending || !user || content.length === 0}
      >
        {isPending ? "Commenting..." : "Comment"}
      </Button>
    </form>
  );
}

export default CommentInput;
