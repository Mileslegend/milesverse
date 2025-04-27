"use server"

import { getSubverses } from "@/sanity/lib/subverse/getSubverses";

export type ImageData = {
    base64: string;
    filename: string;
    contentType: string;
} | null;

export async function createCommunity(
    name: string,
    imageBase64: string | null | undefined,
    imageFileName: string | null | undefined,
    imageContentType: string | null | undefined,
    slug?: string,
    description?: string
) {
    try {
        const user = await getSubverses();
        
    } catch (error) {
      console.error("Error in createCommunity ", error);
      return { error: "Failed to create a Community"}
    }
}