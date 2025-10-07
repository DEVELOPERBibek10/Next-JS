import { fetchCommentsByPostId } from "@/lib/query/comment";
import { Avatar } from "../ui/avatar";
import React from "react";
import { AvatarImage } from "../ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";
import CommentCreateForm from "./commentCreateForm";

interface CommentShowProps {
  postId: string;
  commentId: string;
}

const CommentShow: React.FC<CommentShowProps> = async ({
  postId,
  commentId,
}) => {
  const comments = await fetchCommentsByPostId(postId);

  const comment = comments.find((comment) => comment.id === commentId);
  if (!comment) return null;

  const replies = comments.filter((c) => c.parentId === commentId);

  return (
    <div className="m-4 p-4 border rounded-lg">
      <div className="flex gap-3 mt-2">
        <Avatar>
          <AvatarImage
            src={
              comment.user.image ||
              "https://cdn-icons-png.flaticon.com/128/3177/3177440.png"
            }
          />
          <AvatarFallback>
            {comment.user.name ? comment.user.name.charAt(0) : "User"}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-1">
          <p className="font-semi-bold text-gray-600">
            {comment.user.name || "User"}
          </p>
          <p className="whitespace-pre-wrap text-gray-900">{comment.content}</p>
          <CommentCreateForm postId={postId} parentId={comment.id} />
        </div>
      </div>
      {replies.map((reply) => (
        <CommentShow key={reply.id} postId={postId} commentId={reply.id} />
      ))}
    </div>
  );
};

export default CommentShow;
