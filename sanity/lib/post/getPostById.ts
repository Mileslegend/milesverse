import { defineQuery } from "groq";
import { sanityFetch } from "../live";

export async function getPostById(postId: string) {
  const getPostByIdQuery = defineQuery(`*[_type == "post" && _id == $postId] {
        _id,
        title,
        "slug": slug.current,
        body,
        publishedAt,
        "author": author ->,
        "subverse": subverse ->,
        image,
        isDeleted
        }[0] `);

  const post = await sanityFetch({
    query: getPostByIdQuery,
    params: { postId },
  });

  return post.data;
}
