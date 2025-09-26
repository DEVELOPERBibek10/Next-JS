"use server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

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
