import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { urlFor } from "@/sanity/lib/image";
import { searchSubverses } from "@/sanity/lib/subverse/searchSubverses";
import Link from "next/link";
import React from "react";

async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ query: string }>;
}) {
  const { query } = await searchParams;

  const subverses = await searchSubverses(query);

  return (
    <>
      {/* Banner */}
      <section className="bg-white border-b">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="flex items-center">
            <div>
              <h1 className="text-2xl font-bold">
                Search Results ({subverses.length})
              </h1>
              <p className="text-sm text-gray-600">
                Communities matching &quot;{query}&quot;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Results section */}
      <section className="my-8">
        <div className="mx-auto max-w-7xl px-4">
          <ul className="flex flex-col gap-4">
            {subverses.map((subverse) => (
              <li
                key={subverse._id}
                className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden"
              >
                <Link
                  href={`/community/${subverse.slug}`}
                  className="flex items-center cursor-pointer gap-4 py-5 px-4 hover:bg-red-50 dark:hover:bg-red-900 transition-colors"
                >
                  <Avatar className="h-12 w-12 border-2 border-red-200 dark:border-red-800 shadow-sm">
                    {subverse.image && (
                      <AvatarImage
                        src={urlFor(subverse.image).url()}
                        className="object-cover"
                      />
                    )}
                    <AvatarFallback className="text-lg font-semibold bg-red-100 text-red-700 dark:bg-red-700 dark:text-red-200">
                      {subverse.title?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h2 className="text-lg font-medium">{subverse.title}</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                      {subverse.description}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
            {subverses.length === 0 && (
              <li className="py-8 text-center text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-800 rounded-lg">
                No communities found matching your search
              </li>
            )}
          </ul>
        </div>
      </section>
    </>
  );
}

export default SearchPage;
