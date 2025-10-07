import PostList from "@/components/Posts/postList";
import TopicCreateForm from "@/components/Topic/topicCreateForm";
import { fetchTopPosts } from "@/lib/query/post";

export default async function Home() {
  return (
    <div className="grid grid-cols-5 gap-4 py-4">
      <div className="col-span-4 ">
        <h1 className="text-2xl font-semibold">Top Discussions</h1>
        <PostList fetchPosts={fetchTopPosts} />
      </div>
      <div className="">
        <div className="">
          <TopicCreateForm />
        </div>
      </div>
    </div>
  );
}
