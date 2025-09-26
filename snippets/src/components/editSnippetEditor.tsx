"use client";
import { Editor } from "@monaco-editor/react";
import React, { useState } from "react";
import type { snippet } from "@/generated/prisma";
import { Button } from "./ui/button";
import {saveSnippet} from "@/actions";

const EditSnippetEditor = ({ snippet }: { snippet: snippet }) => {
  const [code, setCode] = useState(snippet.code);

  const saveSnippetAction = saveSnippet.bind(null, snippet.id, code);
  return (
    <div className="flex flex-col justify-center min-h-[80vh] gap-4">
      <form action={saveSnippetAction} className="flex items-center justify-between">
        <h1 className="font-bold text-2xl">Code Editor:</h1>
        <Button size="lg" type="submit" className="cursor-pointer">
          Save
        </Button>
      </form>
      <Editor
        height="60vh"
        defaultLanguage="javascript"
        theme="vs-dark"
        defaultValue={code}
        onChange={(value) => setCode(value!)}
      />
    </div>
  );
};

export default EditSnippetEditor;
