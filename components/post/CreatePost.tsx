"use client";
import { useUser } from "@clerk/nextjs";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";

function CreatePost() {
  const router = useRouter();
  const pathname = usePathname();
  const user = useUser();

  const handleCreatePost = () => {
    // Extract the community name from the pathname if it follows the pattern /community/(name)
    const communityName = pathname.includes("/community/")
      ? pathname.split("/community/")[1]
      : null;
  
    // Helper: Slugify the name (spaces → dashes, lowercase, remove special chars)
    const slugify = (text: string) =>
      text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '') // remove special characters
        .replace(/\s+/g, '-');     // replace spaces with -
  
    if (communityName) {
      const slug = slugify(communityName);
      router.push(`/create-post?subverse=${slug}`);
    } else {
      router.push("/create-post");
    }
  };
  
  return (
    <Button onClick={handleCreatePost} disabled={!user}>
      <Plus className="w-4 h-4 mr-2" />
      {user ? "Create Post" : "Sign in to create post"}
    </Button>
  );
}

export default CreatePost;
