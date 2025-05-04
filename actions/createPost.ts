"use server";
import slugify from "slugify";

import { Post } from "@/sanity.types";
import { adminClient } from "@/sanity/lib/adminClient";
import getSubverseBySlug from "@/sanity/lib/subverse/getSubverseBySlug";
import { getUser } from "@/sanity/lib/user/getUser";

export type PostImageData = {
  base64: string;
  filename: string;
  contentType: string;
} | null;

export async function createPost({
  title,
  subverseSlug,
  body,
  imageBase64,
  imageFilename,
  imageContentType,
}: {
  title: string;
  subverseSlug: string;
  body?: string;
  imageBase64?: string | null;
  imageFilename?: string | null;
  imageContentType?: string | null;
}) {
  try {
    console.log("---Starting post creation process---");
    if (!title || !subverseSlug) {
      console.log("---Missing required fields: title or subverseSlug---");
      return { error: "Title and subverse are reuired" };
    }

    console.log(
      `----Creating post with title: "${title}" in subverse: "${subverseSlug}"----`
    );

    const user = await getUser();

    if ("error" in user) {
      console.log("user authentication error:", user.error);
      return { error: user.error };
    }

    console.log("User authenticated:", user._id);

    //Find the subverse document by name
    console.log(`---Looking for subverse with slug: "${subverseSlug}"---`);
    const slug = slugify(subverseSlug, { lower: true });
    const subverse = await getSubverseBySlug(slug);
    //const subverse = await getSubverseBySlug(subverseSlug.toLowerCase());

    if (!subverse?._id) {
      console.log(`---> Subverse "${subverseSlug}" not found <---`);
      return { error: `---Subverse "${subverseSlug}" not found ---` };
    }

    console.log(`---Found subverse: ${subverse._id} ---`);

    console.log("___Image Process starts____");
    //Prepare image data if provided
    let imageAsset;
    if (imageBase64 && imageFilename && imageContentType) {
      console.log(`Image Provided: ${imageFilename} (${imageContentType})`);
      console.log(`Image base length: ${imageBase64.length} characters`);

      try {
        console.log("---> Processing image data ... <---");
        //Extract base64 data
        const base64Data = imageBase64.split(",")[1];
        console.log(
          `--> Extracted base64 data ${base64Data.length} characters `
        );

        //Covert base64 to buffer
        const buffer = Buffer.from(base64Data, "base64");
        console.log(`Converted to buffer (size: ${buffer.length} bytes) `);

        //Upload to sanity
        console.log(`---> UPLOADING image to Sanity: ${imageFilename}`);
        imageAsset = await adminClient.assets.upload("image", buffer, {
          filename: imageFilename,
          contentType: imageContentType,
        });

        console.log(`Image uploaded successfully with ID: ${imageAsset._id}`);
      } catch (error) {
        console.log("Error uploading image:", error);
        console.log("Will continue to post without image");
        //Continue with upload if image fails
      }
    } else {
      console.log("No image provided with post");
    }

    //Create the post
    console.log("Preparing post document");
    const postDoc: Partial<Post> = {
      _type: "post",
      title,
      body: body
        ? [
            {
              _type: "block",
              _key: Date.now().toString(),
              children: [
                {
                  _type: "span",
                  _key: Date.now().toString() + "1",
                  text: body,
                },
              ],
            },
          ]
        : undefined,
      author: {
        _type: "reference",
        _ref: user._id,
      },
      subverse: {
        _type: "reference",
        _ref: subverse._id,
      },
      publishedAt: new Date().toISOString(),
    };

    //Add image if available
    if (imageAsset) {
      console.log(`Adding image reference to the post: ${imageAsset._id}`);
      postDoc.image = {
        _type: "image",
        asset: {
          _type: "reference",
          _ref: imageAsset._id,
        },
      };
    }

    console.log("<--- Creating post in Sanity database --->");
    const post = await adminClient.create(postDoc as Post);
    console.log(`Post created successfully with ID: ${post._id}`);

    //Call the content moderation API
    // -----MOD STEP -----
    //TODO: Implement content moderation API call
    // END

    return { post };
  } catch (error) {
    console.error("Error creating post:", error);
    return { error: "Failed to create post" };
  }
}
