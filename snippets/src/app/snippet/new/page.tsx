"use client";
import { createSnippet } from "@/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import React, { useActionState } from "react";

const CreateSnippetPage = () => {
  const [formState, action] = useActionState(createSnippet, { message: "" });

  return (
    <form action={action} className="w-1/2 mx-auto flex flex-col gap-4">
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
      {formState.message && (
        <div className="text-red-500 text-center text-xl font-medium">
          {formState.message}
        </div>
      )}
      <Button type="submit" className="cursor-pointer">
        New
      </Button>
    </form>
  );
};

export default CreateSnippetPage;
