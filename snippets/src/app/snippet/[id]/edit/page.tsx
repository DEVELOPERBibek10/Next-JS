import EditSnippetEditor from "@/components/editSnippetEditor";
import { prisma } from "@/lib/prisma";
import React from "react";
import NotFoundPage from "../../not-found";

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
    return <NotFoundPage />;
  }
  return (
    <>
      <EditSnippetEditor snippet={snippet} />
    </>
  );
};

export default EditSnippetPage;
