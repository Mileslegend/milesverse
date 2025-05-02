"use client";
import { useUser } from "@clerk/nextjs";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { PathnameContext } from "next/dist/shared/lib/hooks-client-context.shared-runtime";

function CreatePost() {
  const router = useRouter();
  const pathname = usePathname();
  const user = useUser();

  const handleCreatePost = () => {
    //Extract the community name from the pathname if it follows the pattern /community/(name)
    const communityName = pathname.includes("/community")
      ? pathname.split("/community")[1]
      : null;

    //if we're in a community , redirect to create post with that community pre selected
    if (communityName) {
      router.push(`/create-post?subverse=${communityName}`);
    } else {
      //otherwise just go to the create post page
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
