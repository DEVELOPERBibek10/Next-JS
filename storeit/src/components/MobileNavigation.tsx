"use client";
import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Image from "next/image";
import { Separator } from "./ui/separator";
import { navItems } from "@/constants";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import FileUploader from "./FileUploader";
import { signOutUser } from "@/actions/userActions";

interface MobileNavigationProps {
  ownerId: string;
  accountId: string;
  fullName: string;
  email: string;
  avatar: string;
}

const MobileNavigation = ({
  ownerId,
  accountId,
  fullName,
  email,
  avatar,
}: MobileNavigationProps) => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  return (
    <header className="flex h-[60px] justify-between px-5 sm:hidden">
      <Image
        src={"/assets/icons/logo-full-brand.svg"}
        width={120}
        height={52}
        alt="logo"
        className="h-auto"
      />

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger>
          <Image
            src={"/assets/icons/menu.svg"}
            alt="menu"
            width={30}
            height={30}
          />
        </SheetTrigger>
        <SheetContent className="pt-0 h-screen px-3">
          <SheetTitle>
            <div className="my-3 flex items-center gap-2 rounded-full p-1 text-light-100 sm:justify-center sm:bg-brand/10 lg:justify-start lg:p-3 ">
              <Image
                src={avatar}
                alt="avatar"
                width={44}
                height={44}
                className="aspect-square w-10 rounded-full object-cover"
              />
              <div className="sm:hidden lg:block">
                <p className="text-[14px] leading-[20px] font-semibold capitalize">
                  {fullName}
                </p>
                <p className="text-[12px] leading-[16px] font-medium">
                  {email}
                </p>
              </div>
            </div>
            <Separator className="mb-4 bg-light-200/20" />
          </SheetTitle>
          <nav className="text-[16px] leading-[24px] font-semibold text-brand">
            <ul className="flex flex-1 flex-col gap-4">
              {navItems.map(({ name, icon, url }) => {
                const active = pathname === url;

                return (
                  <Link key={name} href={url}>
                    <li
                      className={cn(
                        "flex text-light-100 gap-4 w-full justify-start items-center text-[16px] leading-[24px] font-semibold px-6 h-[52px] rounded-full",
                        active && "bg-brand text-white shadow-drop-2"
                      )}
                    >
                      <Image
                        src={icon}
                        alt={name}
                        width={24}
                        height={24}
                        className={cn(
                          "w-6 filter invert opacity-25",
                          active && "invert-0 opacity-100"
                        )}
                      />
                      <p>{name}</p>
                    </li>
                  </Link>
                );
              })}
            </ul>
          </nav>
          <Separator className="my-5 bg-light-200/20" />
          <div className="flex flex-col justify-between gap-5">
            <FileUploader accountId={accountId} ownerId={ownerId} />
            <Button
              type="submit"
              className="text-[16px] leading-[24px] font-semibold flex h-[52px] w-full items-center gap-4 rounded-full bg-brand/10 px-6 text-brand shadow-none transition-all hover:bg-brand/20"
              onClick={async () => await signOutUser()}
            >
              <Image
                src="/assets/icons/logout.svg"
                alt="logout"
                width={24}
                height={24}
              />
              <p>Logout</p>
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
};

export default MobileNavigation;
