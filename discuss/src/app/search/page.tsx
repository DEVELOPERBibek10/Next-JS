import PostList from "@/components/Posts/postList";
import { fetchPostBySearchTerm } from "@/lib/query/post";
import React from "react";

interface searchPageProps {
  searchParams: Promise<{ term: string }>;
}

const SearchPage: React.FC<searchPageProps> = async ({ searchParams }) => {
  const term = (await searchParams).term;
  return (
    <div>
      <h1 className="text-blue-600 font-medium italic">
        Search reasults for {term}
      </h1>
      <PostList fetchPosts={() => fetchPostBySearchTerm(term)} />
    </div>
  );
};

export default SearchPage;
