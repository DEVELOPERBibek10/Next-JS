import EditSnippetEditor from "@/components/editSnippetEditor";
import { prisma } from "@/lib/prisma";
import React from "react";

const EditSnippetPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const id = parseInt((await params).id);
  const snippet = await prisma.snippet.findUnique({
    where: {
      id,
    },
  });

  if (!snippet) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        Snippet not found
      </div>
    );
  }
  return (
    <>
      <EditSnippetEditor snippet={snippet} />
    </>
  );
};

export default EditSnippetPage;
