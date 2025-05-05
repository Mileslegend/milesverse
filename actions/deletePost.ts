"use server";

import { adminClient } from "@/sanity/lib/adminClient";
import { getPostById } from "@/sanity/lib/post/getPostById";
import { currentUser } from "@clerk/nextjs/server";

export const deletePost = async (postId: string) => {
  const user = await currentUser();
  if (!user) {
    return { error: "User not found" };
  }

  const post = await getPostById(postId);
  if (!post) {
    return { error: "Post not found" };
  }

  console.log(post);
  console.log(post.author?._id, user?.id);

  if (post.author?._id !== user?.id) {
    return { error: "You are not authorized to delete this post" };
  }

  const patch = adminClient.patch(postId);

  //Delete iamge from post
  if (post.image?.asset?._ref) {
    patch.set({ image: null });
  }

  // Set post to deleted
  patch.set({ isDeleted: true });

  //set body to null
  patch.set({
    body: [{ children: [{ text: "[DELETED CONTENTS 😣]" }], type: "paragraph" }],
  });

  //set title to null
  patch.set({ title: "[THIS  POST WAS DELETED 😎]"});

  //Commit changes
  const result = await patch.commit();

  if(result) {
    //Delete image from post
    //Wait for 1 second
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Deleting image from post");
    if (post.image?.asset?._ref) {
        await adminClient.delete(post.image.asset._ref);
    }
  }

  // Return success message
  return { success: "Post deleted successfully" }
};
