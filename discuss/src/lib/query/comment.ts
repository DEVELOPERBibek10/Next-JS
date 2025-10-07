import { Comment } from "@/generated/prisma";
import { prisma } from "..";

interface CommentWithUser extends Comment {
  user: { name: string | null; image: string | null };
}

export const fetchCommentsByPostId = async (
  postId: string
): Promise<CommentWithUser[]> => {
  try {
    const comments = await prisma.comment.findMany({
      where: { postId },
      include: { user: { select: { name: true, image: true } } },
    });

    if (!comments) {
      throw new Error("No comments found");
    }
    return comments;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("An unexpected error occurred");
  }
};
