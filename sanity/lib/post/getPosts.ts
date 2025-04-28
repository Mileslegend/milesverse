import { defineQuery } from "groq";
import { sanityFetch } from "../live";

export async function getPosts() {
    const getAllPostsQuery = defineQuery(`
        *[_type == "post" && (isDeleted == false || !defined(isDeleted))] {
            _id,
            title,
            "slug": slug.current,
            body,
            publishedAt,
            "author": author->,
            "subverse": subverse->,
            image,
            isDeleted
        } | order(publishedAt desc)
    `);

    const posts = await sanityFetch({ query: getAllPostsQuery }); //Dont forget to run npm run typegen after you make changes in sanity fetch
    return posts.data; // or just return posts if your fetch doesn't wrap data
}
