"use server";
import { auth } from "@/auth";
import { Comment } from "@/generated/prisma";
import { prisma } from "@/lib";
import { revalidatePath } from "next/cache";
import z from "zod";

const createCommentSchema = z.object({
  content: z
    .string()
    .min(1, { message: "Comment is required" })
    .max(1000, { message: "Comment must be less than 1000 characters" }),
});

interface createCommentErrorState {
  errors: {
    content?: string[];
    formError?: string[];
  };
}

export const createComment = async (
  { postId, parentId }: { postId: string; parentId?: string },
  prevState: createCommentErrorState,
  formData: FormData
): Promise<createCommentErrorState> => {
  const comment = createCommentSchema.safeParse({
    content: formData.get("content"),
  });
  if (!comment.success) {
    const fieldErrors = z.treeifyError(comment.error);
    return {
      errors: {
        content: fieldErrors.properties?.content?.errors || [],
      },
    };
  }
  const session = await auth();
  if (!session?.user || !session.user || !session.user.id) {
    return {
      errors: {
        formError: ["You must be signed in to comment."],
      },
    };
  }

  try {
    const createdComment: Comment = await prisma.comment.create({
      data: {
        content: comment.data.content,
        userId: session.user.id,
        postId: postId,
        parentId: parentId || null,
      },
    });
    if (!createdComment) {
      throw new Error("Failed to create comment");
    }
  } catch (error) {
    if (error instanceof Error) {
      return {
        errors: {
          formError: [
            error.message || "Something went wrong. Please try again.",
          ],
        },
      };
    }
    return {
      errors: {
        formError: ["Something went wrong. Please try again."],
      },
    };
  }

  const topic = await prisma.topic.findFirst({
    where: { posts: { some: { id: postId } } },
  });

  if (!topic) {
    return {
      errors: {
        formError: ["Failed to revalidate path"],
      },
    };
  }

  revalidatePath(`/topic/${topic.slug}/post/${postId}`);
  return { errors: {} };
};
