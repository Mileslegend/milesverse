"use client";
import { deleteComment } from "@/actions/deleteComment";
import { deletePost } from "@/actions/deletePost";
import { useUser } from "@clerk/nextjs";
import { Trash2 } from "lucide-react";
import React, { useState } from "react";

interface DeleteButtonProps {
  contentId: string;
  contentType: string;
  contentOwnerId: string;
}

function DeleteButton({
  contentId,
  contentType,
  contentOwnerId,
}: DeleteButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isSignedIn, user } = useUser();

  const isOwner = contentOwnerId === user?.id;
  if (!isOwner) return null;

  const handleDelete = async () => {
    if (isDeleting || !isSignedIn) return;
    if (!window.confirm("Are you sure you want to delete this ?")) {
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      contentType === "post"
        ? await deletePost(contentId)
        : await deleteComment(contentId);
    } catch (error) {
      setError("Failed to delete. Please try again");
      console.log(`Failed to delete ${contentType}`, error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting || !isSignedIn}
      className={`flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-red-500 
        transition-colors mt-1 disabled:opacity-50 disabled:cursor-not-allowed
        `}
    >
      <Trash2 size={14} />
      <span className="hidden md:block">
        {isDeleting
          ? "Deleting..."
          : isSignedIn
            ? "Delete"
            : "Sign in to delete"}
      </span>
      {error && <span className="text-red-500 ml-2">{error}</span>}
    </button>
  );
}

export default DeleteButton;
