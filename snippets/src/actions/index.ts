"use server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function createSnippet(
  prevState: { message: string },
  formData: FormData
) {
  "use server";
  try {
    const title = formData.get("title");
    const code = formData.get("code");

    if (typeof title !== "string" || title.length < 4) {
      throw new Error(
        "Title is required and should be longer than 6 characters"
      );
    }

    if (typeof code !== "string" || code.length < 6) {
      throw new Error(
        "Code is required and should be longer than 6 characters"
      );
    }

    await prisma.snippet.create({
      data: {
        title,
        code,
      },
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { message: error.message };
    }
    return { message: "Somthing went wrong!" };
  }

  redirect("/");
}

export async function saveSnippet(id: number, code: string) {
  await prisma.snippet.update({
    where: {
      id,
    },
    data: {
      code,
    },
  });
  redirect(`/snippet/${id}`);
}

export async function deleteSnippet(id: number) {
  await prisma.snippet.delete({
    where: {
      id,
    },
  });
  redirect("/");
}
