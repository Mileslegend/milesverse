import PostsList from "@/components/post/PostsList";
import { Button } from "@/components/ui/button";


export default function Home() {
  return (
    <>
      {/* Banner Section */}
      <section className="bg-white border-b">
        <div className="mx-auto max-w-7xl py-6 px-4">
          <div className="flex items-center">
            <div>
              <h1 className="text-2xl font-bold">Home</h1>
              <p className="text-sm text-gray-600">
                Recent Posts from all communities
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Posts Section */}
      <section className="my-8">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex flex-col gap-4">
            <PostsList />
          </div>
        </div>
      </section>
    </>
  );
}
