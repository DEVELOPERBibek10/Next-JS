"use client";
import { createSnippet } from "@/actions";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { snippetFormSchema } from "@/lib/Zod/ZodSchema";
import { zodResolver } from "@hookform/resolvers/zod";

import React, { useActionState, useTransition } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

const CreateSnippetPage = () => {
  const [formState, action] = useActionState(createSnippet, { message: "" });
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof snippetFormSchema>>({
    resolver: zodResolver(snippetFormSchema),
    defaultValues: {
      title: "",
      code: "",
    },
  });

  const onSubmit = (values: z.infer<typeof snippetFormSchema>) => {
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("code", values.code);

    startTransition(() => {
      action(formData);
    });

    if (formState.message === "") {
      form.reset();
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-1/2 mx-auto flex flex-col gap-4"
      >
        <div className="flex flex-col gap-2">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold text-xl">Title</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    className="h-14 border border-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-base" />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col gap-2">
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold text-xl">Code</FormLabel>
                <FormControl>
                  <Textarea
                    className="h-48 border border-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-base" />
              </FormItem>
            )}
          />
        </div>
        {formState.message && (
          <div className="text-red-500 text-center text-xl font-medium">
            {formState.message}
          </div>
        )}
        <Button disabled={isPending} type="submit" className="cursor-pointer">
          New
        </Button>
      </form>
    </Form>
  );
};

export default CreateSnippetPage;
