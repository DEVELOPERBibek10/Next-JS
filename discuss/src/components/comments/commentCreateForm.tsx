"use client";
import React, { useActionState } from "react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { createComment } from "@/actions/createComment";

interface CommentCreateFormProps {
  postId: string;
  parentId?: string;
  startOpen?: boolean;
}

const CommentCreateForm: React.FC<CommentCreateFormProps> = ({
  postId,
  parentId,
  startOpen,
}) => {
  const [open, setOpen] = React.useState(startOpen);
  const [formState, action, isPending] = useActionState(
    createComment.bind(null, { postId, parentId }),
    { errors: {} }
  );
  return (
    <div>
      <Button
        variant={"link"}
        size={"sm"}
        className="cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        Reply
      </Button>
      {open && (
        <form action={action} className="space-y-2 mt-2">
          <Textarea
            name="content"
            placeholder="Write your comment..."
            className="bg-gray-100 focus-visible:ring-0"
          />
          {formState.errors?.content && (
            <p className="text-sm text-red-600 my-0.5 py-1">
              {formState.errors.content[0]}
            </p>
          )}
          <Button
            className="cursor-pointer"
            type="submit"
            size="sm"
            variant={"secondary"}
            disabled={isPending}
          >
            Save
          </Button>

          {formState.errors?.formError && (
            <div className="text-sm mt-3 text-red-600 my-0.5 border border-red-400 p-0.5 bg-red-300 py-2">
              {formState.errors.formError[0]}
            </div>
          )}
        </form>
      )}
    </div>
  );
};

export default CommentCreateForm;
