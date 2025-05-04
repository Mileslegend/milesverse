import CreateCommunityButton from "@/components/header/CreateCommunityButton";
import CreatePostForm from "@/components/post/CreatePostForm";
import SubverseCombobox from "@/components/subverse/SubverseCombobox";
import { getSubverses } from "@/sanity/lib/subverse/getSubverses";
import React from "react";

async function CreatePostPage({
  searchParams,
}: {
  searchParams: Promise<{ subverse: string }>;
}) {
  const { subverse } = await searchParams;

  //Get all subverses
  const subverses = await getSubverses();

  if (subverse) {
    return (
      <>
        {/* Banner */}
        <section className="bg-white border-b">
          <div className="mx-auto max-w-7xl px-4 py-6">
            <div className="flex items-center">
              <div>
                <h1 className="text-2xl font-bold">Create Post</h1>
                <p className="text-sm text-gray-600">
                  Create a post in the{" "}
                  <span className="font-bold">{subverse}</span> community
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="my-8">
          <CreatePostForm />
        </section>
      </>
    );
  }

  return (
    <>
      {/* Banner */}
      <section className="bg-white border-b">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="flex items-center">
            <div>
              <h1 className="text-2xl font-bold">Create Post</h1>
              <p className="text-sm text-gray-600">
                Select a community for your post
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <section className="my-8">
          <div className="mx-auto max-w-7xl px-4">
            <div className="flex flex-col gap-4">
              <div className="max-3xl">
                <label htmlFor="" className="block text-sm font-medium mb-2">
                  Select a community to post in
                </label>
                <SubverseCombobox
                  subverses={subverses}
                  defaultValue={subverse}
                />
                <hr className="my-4" />
                <p className="mt-4 text-sm text-gray-600">
                  If you don&apos;t see your community , you can create it here.
                  👇
                </p>
                <div className="mt-2">
                  <CreateCommunityButton />
                </div>
              </div>
            </div>
          </div>
        </section>
      </section>
    </>
  );
}

export default CreatePostPage;
