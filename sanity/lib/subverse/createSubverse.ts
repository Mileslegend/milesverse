import { defineQuery } from "groq"
import { sanityFetch } from "../live"
import { adminClient } from "../adminClient"
import type { Subverse } from "@/sanity.types"
import { ImageData } from "@/actions/createCommunity"

export async function createSubverse(
  name: string,
  moderatorId: string,
  imageData: ImageData | null,
  customSlug?: string,
  customDescription?: string
): Promise<Subverse | { error: string }> {
  console.log(`--- Creating Subverse: ${name} ---`)
  try {

    // 1. Check by title using a $name parameter
    const checkByTitle = defineQuery(`
      *[_type == "subverse" && title == $name] { _id }
    `)
    const foundByTitle = await sanityFetch({
      query: checkByTitle,
      params: { name },
    })
    if (foundByTitle.data && foundByTitle.data.length > 0) {
      return { error: `A subverse named "${name}" already exists.` }
    }

    // 2. Determine slug & check uniqueness
    const slug = customSlug ?? name.toLowerCase().replace(/\s+/g, "-")
    const checkBySlug = defineQuery(`
      *[_type == "subverse" && slug.current == $slug] { _id }
    `)
    const foundBySlug = await sanityFetch({
      query: checkBySlug,
      params: { slug },
    })
    if (foundBySlug.data && foundBySlug.data.length > 0) {
      return { error: `The URL "/${slug}" is already taken.` }
    }

     // 3. (Optional) Upload imageAsset here…
     // ⭐️ Upload imageAsset if imageData exists
     let imageAsset = null;
     if (imageData) {
       imageAsset = await adminClient.assets.upload(
         "image",
         Buffer.from(imageData.base64.split(",")[1], "base64"),
         {
           filename: imageData.filename,
           contentType: imageData.contentType,
         }
       );
     }

    // 4. Create the document
    const newDoc: Partial<Subverse> = {
      _type: "subverse",
      title: name,
      description: customDescription ?? `Welcome to m/${name}`,
      slug: { _type: "slug", current: slug },
      moderator: { _type: "reference", _ref: moderatorId },
      createdAt: new Date().toISOString(),
      ...(imageAsset && { image: { _type: "image", asset: { _type: "reference", _ref: imageAsset._id } } })
    }
    const subverse = await adminClient.create(newDoc as Subverse)
    console.log(`--- Subverse created with ID: ${subverse._id} ---`)
    return subverse

  } catch (err) {
    console.error("Error in createSubverse:", err)
    return { error: "Failed to create subverse" }
  }
}
