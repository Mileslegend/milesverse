import { defineQuery } from "groq";
import { sanityFetch } from "../live";

export async function getCommentById(commentId: string) {
  const getCommentByIdQuery =
    defineQuery(`*[_type == "comment" && _id == $commentId][0] {
        _id,
        content,
        createdAt,
        "author": author ->,
        isDeleted
        }`);

  const comment = await sanityFetch({
    query: getCommentByIdQuery,
    params: { commentId },
  });
  return comment.data;
}
