"use client";
import { useSession } from "next-auth/react";
import React from "react";
import { Button } from "./ui/button";
import { signIn } from "@/actions/sign-in";
import { signOut } from "@/actions/sign-out";
import { Avatar, AvatarImage } from "./ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Separator } from "./ui/separator";
import LogOut from "./Icons/logout";

const AuthProfile = () => {
  const session = useSession();
  let authContent: React.ReactNode;
  if (session.status === "loading") {
    return (
      <Avatar className="w-10 h-10">
        <AvatarImage
          src={"https://cdn-icons-png.flaticon.com/128/64/64572.png"}
          alt="@shadcn"
        />
      </Avatar>
    );
  }

  if (session?.data?.user) {
    authContent = (
      <Popover>
        <PopoverTrigger asChild className="cursor-pointer">
          <Avatar className="w-10 h-10">
            <AvatarImage
              src={
                session?.data.user?.image ||
                "https://cdn-icons-png.flaticon.com/128/64/64572.png"
              }
              alt="@shadcn"
            />
            <AvatarFallback
              style={{
                background: `url(https://cdn-icons-png.flaticon.com/128/64/64572.png) center/cover no-repeat`,
              }}
            />
          </Avatar>
        </PopoverTrigger>
        <PopoverContent className="flex flex-col gap-4">
          <span className="font-semibold text-lg">
            Name: {session.data.user.name}
          </span>
          <Separator />
          <form action={signOut}>
            <Button type="submit" className="cursor-pointer outline-0">
              <LogOut />
              Sign Out
            </Button>
          </form>
        </PopoverContent>
      </Popover>
    );
  } else {
    authContent = (
      <form action={signIn} className="flex gap-4">
        <Button type="submit" variant={"outline"} className="cursor-pointer">
          Sign In
        </Button>
        <Button type="submit" className="cursor-pointer">
          Sign Up
        </Button>
      </form>
    );
  }

  return authContent;
};

export default AuthProfile;
