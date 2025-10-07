import { Post } from "@/generated/prisma";
import { prisma } from "@/lib";

export type PostWithData = Post & {
  topic: { slug: string };
  _count: { comments: number };
  user: { name: string | null };
};

export const fetchPostsByTopicSlug = async (
  slug: string
): Promise<PostWithData[]> => {
  try {
    const posts = await prisma.post.findMany({
      where: { topic: { slug } },
      include: {
        topic: { select: { slug: true } },
        _count: { select: { comments: true } },
        user: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return posts;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("An unexpected error occurred");
  }
};

export const fetchTopPosts = async (): Promise<PostWithData[]> => {
  try {
    const post = await prisma.post.findMany({
      orderBy: [
        {
          comments: { _count: "desc" },
        },
      ],

      include: {
        topic: { select: { slug: true } },
        _count: { select: { comments: true } },
        user: { select: { name: true } },
      },
    });
    if (!post) {
      throw new Error("No posts found");
    }
    return post;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("An unexpected error occurred");
  }
};
