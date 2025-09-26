import { deleteSnippet } from "@/actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import React from "react";

interface SnippetDetailPageProp {
  params: Promise<{ id: string }>;
}

const SnippetDetailPage = async ({ params }: SnippetDetailPageProp) => {
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

  const lines = snippet.code.split("\n");
  const title = snippet.title;

  const deleteSnippetAction = deleteSnippet.bind(null, snippet.id);
  return (
    <Card
      className={`overflow-hidden bg-white border border-gray-200 w-3/4 mx-auto`}
    >
      <div className="flex items-center justify-between gap-2 px-4 py-2 border-b border-gray-200">
        <span className="text-lg font-medium text-gray-700">{title}</span>
        <div className="flex items-center gap-3">
          <Link href={`/snippet/${snippet.id}/edit`}>
            <Button size={"sm"} className="cursor-pointer">
              Edit
            </Button>
          </Link>
          <form action={deleteSnippetAction}>
            <Button
              type="submit"
              size={"sm"}
              className="cursor-pointer"
              variant="destructive"
            >
              Delete
            </Button>
          </form>
        </div>
      </div>

      <div className="relative">
        <pre className="overflow-x-auto p-4 bg-white text-sm">
          <code className="font-mono text-gray-800 leading-relaxed">
            <div className="flex">
              <div className="select-none text-gray-400 text-right pr-4 border-r border-gray-200 mr-4">
                {lines.map((_, index) => (
                  <div key={index} className="leading-6">
                    {index + 1}
                  </div>
                ))}
              </div>

              <div className="flex-1">
                {lines.map((line, index) => (
                  <div key={index} className="leading-6">
                    {line}
                  </div>
                ))}
              </div>
            </div>
          </code>
        </pre>
      </div>
    </Card>
  );
};

export default SnippetDetailPage;
