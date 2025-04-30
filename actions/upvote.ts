"use server";

import { getUser } from "@/sanity/lib/user/getUser";
import { upvoteComment } from "@/sanity/lib/vote/upvoteComment";
import { upvotePost } from "@/sanity/lib/vote/upvotePost";

export async function upvote(
  contentId: string,
  contentType: "post" | "comment" = "post"
) {
  //Get user
  const user = await getUser();

  if ("error" in user) {
    return { error: user.error };
  }

  if (contentType === "comment") {
    const vote = await upvoteComment(contentId, user._id);
    return { vote };
  } else {
    const vote = await upvotePost(contentId, user._id);
    return { vote };
  }
}
