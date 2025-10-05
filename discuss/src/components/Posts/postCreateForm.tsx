"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "../ui/textarea";
import { useActionState } from "react";
import { createPost } from "@/actions/createPost";

type CreatePostFormProps = {
  slug: string;
};

export default function PostCreateForm({ slug }: CreatePostFormProps) {
  const [formState, formAction, isPending] = useActionState(
    createPost.bind(null, slug),
    {
      error: {},
    }
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="cursor-pointer">New Post</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Post</DialogTitle>
          <DialogDescription>
            Whats on your mind? Lets discuss !!
          </DialogDescription>
        </DialogHeader>
        <form action={formAction}>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" />
            </div>
            {formState.error?.title && (
              <p className="text-sm text-red-600 my-0.5">
                {formState.error.title[0]}
              </p>
            )}
            <div className="grid gap-3">
              <Label htmlFor="content">Content</Label>
              <Textarea id="content" name="content" />
            </div>
            {formState.error?.content && (
              <p className="text-sm text-red-600 my-0.5">
                {formState.error.content[0]}
              </p>
            )}
          </div>
          {formState.error?.formError && (
            <div className="text-sm mt-3 text-red-600 my-0.5 border border-red-400 p-0.5 bg-red-300">
              {formState.error.formError[0]}
            </div>
          )}
          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button disabled={isPending} type="submit">
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
