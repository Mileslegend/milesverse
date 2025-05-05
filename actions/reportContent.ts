"use server"

import { adminClient } from "@/sanity/lib/adminClient";
import { getUser } from "@/sanity/lib/user/getUser";

export async function reportContent(contentId: string) {
  const user = await getUser(); // ✅ FIXED: await this call

  if ("error" in user) return { error: user.error };

  try {
    const result = await adminClient
      .patch(contentId)
      .set({ isReported: true })
      .commit();

    return { result };
  } catch (error) {
    console.error("Failed to report content in Sanity:", error);
    return { error: "Failed to update content" };
  }
}
