import { fetchPostsByTopicSlug } from "@/lib/query/post";
import PostCreateForm from "@/components/Posts/postCreateForm";
import PostList from "@/components/Posts/postList";
import React from "react";

export interface TopicShowPageProps {
  params: Promise<{ slug: string }>;
}

const TopicShowPage: React.FC<TopicShowPageProps> = async ({ params }) => {
  const slug = (await params).slug;

  return (
    <div className="grid grid-cols-5 gap-5 p-4">
      <div className="col-span-4 place-content-center">
        <h1 className="font-bold text-2xl mb-2">{decodeURIComponent(slug)}</h1>
        <PostList
          fetchPosts={() => fetchPostsByTopicSlug(decodeURIComponent(slug))}
        />
      </div>
      <div>
        <PostCreateForm slug={slug} />
      </div>
    </div>
  );
};

export default TopicShowPage;
