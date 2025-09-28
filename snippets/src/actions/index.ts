"use server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function createSnippet(
  prevState: {
    
    message: string;
  },
  formData: FormData
) {
  "use server";
  const title = formData.get("title") as string;
  const code = formData.get("code") as string;
  try {
    const response = await prisma.snippet.create({
      data: {
        title,
        code,
      },
    });
    
    if (!response) {
      throw new Error("Something went wrong")
    }

    console.log(response);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return {
        title: title ? title : "",
        code: code ? code : "",
        message: error.message,
      };
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
