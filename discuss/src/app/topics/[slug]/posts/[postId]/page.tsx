import CommentCreateForm from "@/components/comments/commentCreateForm";
import CommentList from "@/components/comments/commentList";
import PostShow from "@/components/Posts/postShow";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import React, { Suspense } from "react";

interface PostShowPageProps {
  params: Promise<{ slug: string; postId: string }>;
}

const PostShowPage: React.FC<PostShowPageProps> = async ({ params }) => {
  const { slug, postId } = await params;
  return (
    <div className="space-y-4">
      <Link href={`/topics/${slug}`}>
        <Button variant={"link"}>
          <ChevronLeft />
          Back to {decodeURIComponent(slug)}
        </Button>
      </Link>
      <Suspense fallback={<p>Loading...</p>}>
        <PostShow postId={postId} />
      </Suspense>
      <CommentCreateForm postId={postId} startOpen />
      <CommentList postId={postId} />
    </div>
  );
};

export default PostShowPage;
