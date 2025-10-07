"use server";
import { auth } from "@/auth";
import { Post } from "@/generated/prisma";
import { prisma } from "@/lib";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

export interface CreatePostErrorParams {
  error: {
    title?: string[];
    content?: string[];
    formError?: string[];
  };
}

const createPostSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Title should be at least 3 characters long" }),
  content: z.string().min(10, "Content should be at least 10 characters long"),
});

export const createPost = async (
  slug: string,
  prevState: CreatePostErrorParams,
  formData: FormData
): Promise<CreatePostErrorParams> => {
  const post = createPostSchema.safeParse({
    title: formData.get("title")?.toString(),
    content: formData.get("content")?.toString(),
  });

  if (!post.success) {
    const fieldErrors = z.treeifyError(post.error);
    return {
      error: {
        ...prevState.error,
        title: fieldErrors.properties?.title?.errors || [],
        content: fieldErrors.properties?.content?.errors || [],
        formError: ["Please fix the errors above and try again."],
      },
    };
  }

  const session = await auth();
  if (!session?.user || !session.user || !session.user.id) {
    return {
      error: {
        formError: ["You must be signed in to create a Post."],
      },
    };
  }

  const topic = await prisma.topic.findFirst({
    where: { slug: decodeURIComponent(slug) },
  });

  if (!topic) {
    return {
      error: {
        formError: ["Topic not found"],
      },
    };
  }

  let Post: Post;

  try {
    Post = await prisma.post.create({
      data: {
        title: post.data.title,
        content: post.data.content,
        userId: session.user.id,
        topicId: topic.id,
      },
    });

    if (!Post) {
      throw new Error("Failed to create post");
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      return {
        error: {
          formError: [
            error.message || "Something went wrong. Please try again.",
          ],
        },
      };
    }
    return {
      error: {
        formError: ["Something went wrong. Please try again."],
      },
    };
  }

  revalidatePath(`/topics/${slug}`);
  redirect(`/topics/${slug}/posts/${Post.id}`);
};
