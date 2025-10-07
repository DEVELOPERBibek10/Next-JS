import React from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { PostWithData } from "@/lib/query/post";
import Link from "next/link";

type PostListProps = {
  fetchPosts: () => Promise<PostWithData[]>;
};

const PostList: React.FC<PostListProps> = async ({ fetchPosts }) => {
  const posts = await fetchPosts();

  return (
    <ul className="flex flex-col gap-3 mt-4">
      {posts.map((post) => (
        <li key={post.id} className="">
          <Link href={`/topics/${post.topic.slug}/posts/${post.id}`}>
            <Card>
              <CardHeader className="">
                <CardTitle className="mb-2">{post.title}</CardTitle>
                <CardDescription className="flex justify-between items-center">
                  <span>By {post.user.name}</span>
                  <span>{post._count.comments} comments</span>
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default PostList;
