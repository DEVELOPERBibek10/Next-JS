import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import React from "react";

const CreateSnippetPage = () => {
  async function createSnippet(formData: FormData) {
    "use server";
    const title = formData.get("title") as string;
    const code = formData.get("code") as string;

    await prisma.snippet.create({
      data: {
        title,
        code,
      },
    });

    redirect("/");
  }

  return (
    <form action={createSnippet} className="w-1/2 mx-auto flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label className="text-2xl font-semibold">Title</Label>
        <Input
          type="text"
          name="title"
          id="title"
          className="text-xl shadow-md h-12"
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label className="text-2xl font-semibold">Code</Label>
        <Textarea name="code" className="h-52 text-xl shadow-md" />
      </div>
      <Button type="submit" className="cursor-pointer">
        New
      </Button>
    </form>
  );
};

export default CreateSnippetPage;
