"use server";
import { auth } from "@/auth";
import { Topic } from "@/generated/prisma";
import { prisma } from "@/lib";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

interface CreateTopicErrorParams {
  error: {
    name?: string[];
    description?: string[];
    formError?: string[];
  };
}

const createTopicSchema = z.object({
  name: z.string().min(3, "Name should be at least 3 characters long"),
  description: z
    .string()
    .min(10, "Description should be at least 10 characters long"),
});

export const createTopic = async (
  prevState: CreateTopicErrorParams,
  formData: FormData
): Promise<CreateTopicErrorParams> => {
  const topic = createTopicSchema.safeParse({
    name: formData.get("name")?.toString(),
    description: formData.get("description")?.toString(),
  });

  if (!topic.success) {
    const fieldErrors = z.treeifyError(topic.error);
    return {
      error: {
        name: fieldErrors.properties?.name?.errors || [],
        description: fieldErrors.properties?.description?.errors || [],
        formError: ["Please fix the errors below and try again."],
      },
    };
  }
  const session = await auth();
  if (!session?.user) {
    return {
      error: {
        formError: ["You must be signed in to create a topic."],
      },
    };
  }
  let createdTopic: Topic;
  try {
    createdTopic = await prisma.topic.create({
      data: {
        slug: topic.data.name,
        description: topic.data.description,
      },
    });
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

  revalidatePath("/");
  redirect(`/topic/${createdTopic.slug}`);
};
