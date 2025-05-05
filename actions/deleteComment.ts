"use server";

import { adminClient } from "@/sanity/lib/adminClient";
import { getCommentById } from "@/sanity/lib/comment/getCommentById";
import { currentUser } from "@clerk/nextjs/server";

export const deleteComment = async (commentId: string) => {
  const user = await currentUser();
  if (!user) {
    return { error: "User not found" };
  }
  const comment = await getCommentById(commentId);
  if (!comment) {
    return { error: "Comment not found" };
  }

  if (comment.author?._id !== user?.id) {
    return { error: "Your not authorized to delete this comment" };
  }

  const patch = adminClient.patch(commentId);

  // Delete the comment
  patch.set({ content: "[DELETED]" });

  //Set the comemnt to be deleted
  patch.set({ isDeleted: true });

  //commit changes
  await patch.commit();

  // Return success message
  return { success: "Comment delted successfully" };
};
