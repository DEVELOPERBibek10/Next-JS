"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { z } from "zod";

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
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

type AuthFormType = "sign-in" | "sign-up";

const AuthFormSchema = (formType: AuthFormType) => {
  return z.object({
    email: z.email(),
    fullName:
      formType === "sign-up"
        ? z
            .string()
            .min(6, { message: "full name must be at least 6 characters." })
            .max(50, {
              message: "full name is can't be more than 50 characters",
            })
        : z.string().optional(),
  });
};

export default function AuthForm({ type }: { type: AuthFormType }) {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const formSchema = AuthFormSchema(type);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex max-h-[800px] w-full max-w-[580px] flex-col justify-center space-y-6 transition-all lg:h-full lg:space-y-8"
        >
          <h1 className="text-[34px] leading-[42px] font-bold text-center text-light-100 md:text-left">
            {type === "sign-in" ? "Sign In" : "Sign Up"}
          </h1>
          {type === "sign-up" && (
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <div className="flex h-[78px] flex-col justify-center rounded-xl border border-light-300 px-4 shadow-drop-1">
                    <FormLabel className="text-light-100 pt-2 body-2 w-full">
                      Full name
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="outline-none ring-offset-transparent focus:ring-transparent focus:ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 border-none shadow-none p-0 placeholder:text-light-200 text-[14px] leading-[20px] font-normal"
                        placeholder="Enter your full name"
                        {...field}
                      />
                    </FormControl>
                  </div>

                  <FormMessage className="text-[14px] leading-[20px] font-normal text-red ml-4" />
                </FormItem>
              )}
            />
          )}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <div className="flex h-[78px] flex-col justify-center rounded-xl border border-light-300 px-4 shadow-drop-1">
                  <FormLabel className="text-light-100 pt-2 body-2 w-full">
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="outline-none ring-offset-transparent focus:ring-transparent focus:ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 border-none shadow-none p-0 placeholder:text-light-200 text-[14px] leading-[20px] font-normal"
                      placeholder="Enter your email"
                      {...field}
                    />
                  </FormControl>
                </div>

                <FormMessage className="text-[14px] leading-[20px] font-normal text-red ml-4" />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-brand cursor-pointer hover:bg-brand-100 transition-all rounded-full text-[14px] leading-[20px] font-medium h-[66px]"
          >
            {type === "sign-in" ? "Sign In" : "Sign Up"}
            {isLoading && (
              <Image
                src="/assets/icons/loader.svg"
                alt="loader"
                className="ml-2 animate-spin"
                width={24}
                height={24}
              />
            )}
          </Button>
          {errorMessage && (
            <p className="text-[14px] leading-[20px] font-normal mx-auto w-fit rounded-xl bg-error/5 px-8 py-4 text-center text-error">
              {errorMessage}
            </p>
          )}
          <div className="text-[14px] leading-[20px] font-normal flex justify-center">
            <p className="text-light-100">
              {type === "sign-in"
                ? "Don't have an account?"
                : "Already have an account?"}
            </p>
            <Link
              href={type === "sign-in" ? "/sign-up" : "/sign-in"}
              className="font-medium text-brand ml-2"
            >
              {type === "sign-in" ? "Sign up" : "Sign In"}
            </Link>
          </div>
        </form>
      </Form>
      {/* OTP verifcation */}
    </>
  );
}
