import { fetchCommentsByPostId } from "@/lib/query/comment";
import React from "react";
import CommentShow from "./commentShow";
interface CommentListProps {
  postId: string;
}
const CommentList: React.FC<CommentListProps> = async ({ postId }) => {
    const comments = await fetchCommentsByPostId(postId);
    const toplevelComments = comments.filter(comment => !comment.parentId);

    return <div>
        <h1 className="font-bold text-lg">All 0 comments </h1>
        {
            toplevelComments.map(comment => (
                <CommentShow key={comment.id} postId={postId} commentId={comment.id} />
            ))
        }
  </div>;
};

export default CommentList;
