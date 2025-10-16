"use client";
import React, { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import Image from "next/image";
import { ActionType } from "@/types";
import { actionsDropdownItems } from "@/constants";
import Link from "next/link";
import { constructDownloadUrl } from "@/lib/utils";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { deleteFile, renameFile, updateFileUsers } from "@/actions/fileActions";
import { usePathname } from "next/navigation";
import FileDetails, { ShareInput } from "./ActionsModelContent";
import { toast } from "sonner";
import { Models } from "node-appwrite";

const ActionsDropdown = ({
  file,
  owner,
}: {
  file: Models.DefaultRow;
  owner: string | Promise<string>;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [action, setAction] = useState<ActionType | null>(null);
  const [name, setName] = useState(file.name);
  const [isLoading, setIsLoading] = useState(false);
  const [emails, setEmails] = useState<string[]>([]);
  const pathname = usePathname();

  const closeAllModels = () => {
    setIsModalOpen(false);
    setIsDropdownOpen(false);
    setAction(null);
    setName(file.name);
    setEmails([]);
  };

  const handleAction = async () => {
    if (!action) return;
    setIsLoading(true);
    let success = null;
    const actions = {
      rename: () =>
        renameFile({
          fileId: file.$id,
          name: name,
          extension: file.extension,
          path: pathname,
        }),
      share: () =>
        updateFileUsers({ fileId: file.$id, emails: emails, path: pathname }),
      delete: () =>
        deleteFile({
          fileId: file.$id,
          bucketFileId: file.bucketFileId as string,
          path: pathname,
        }),
    };
    try {
      success = await actions[action.value as keyof typeof actions]();
      if (!success) throw new Error(`Unable to perform ${action} action`);
      closeAllModels();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
      throw new Error(error as string);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveUser = async (email: string) => {
    const updatedEmails = emails.filter((e) => e !== email);

    const success = await updateFileUsers({
      fileId: file.$id,
      emails: updatedEmails,
      path: pathname,
    });
    if (success) setEmails(updatedEmails);
  };

  const renderDialogContent = () => {
    if (!action) return null;
    const { value, label } = action;
    return (
      <DialogContent className="rounded-[26px] w-[90%] max-w-[400px] px-6 py-8 text-[14px] leading-[20px] font-medium">
        <DialogHeader className="flex flex-col gap-3">
          <DialogTitle className="text-center text-light-100">
            {label}
          </DialogTitle>
          {value === "rename" && (
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}
          {value === "details" && <FileDetails file={file} owner={owner} />}
          {value === "share" && (
            <ShareInput
              file={file}
              onInputChange={setEmails}
              onRemove={handleRemoveUser}
            />
          )}
          {value === "delete" && (
            <p className="text-center text-light-100">
              Are you sure you want to delete
              <span className="font-medium text-brand-100 ml-1">
                {file.name}
              </span>{" "}
              ?
            </p>
          )}
        </DialogHeader>
        {["rename", "delete", "share"].includes(value) && (
          <DialogFooter className="flex flex-col gap-3 md:flex-row">
            <Button
              onClick={closeAllModels}
              className="h-[52px] flex-1 rounded-full bg-white text-light-100 shadow-drop-1 hover:bg-transparent"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAction}
              className="bg-brand hover:bg-brand-100 transition-all rounded-full text-[14px] leading-[20px] font-medium !mx-0 h-[52px] w-full flex-1"
            >
              <p className="capitalize">{value}</p>
              {isLoading && (
                <Image
                  src={"/assets/icons/loader.svg"}
                  alt="loader"
                  width={24}
                  height={24}
                  className="animate-spin"
                />
              )}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    );
  };

  return (
    <>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
          <DropdownMenuTrigger className="cursor-pointer outline-none ring-offset-transparent focus:ring-transparent focus:ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0">
            <Image
              src={"/assets/icons/dots.svg"}
              alt="dots"
              width={34}
              height={34}
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel className="max-w-[200px] truncate">
              {file.name}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {actionsDropdownItems.map((actionItem) => (
              <DropdownMenuItem
                className="cursor-pointer"
                key={actionItem.value}
                onClick={() => {
                  setAction(actionItem);
                  if (
                    ["rename", "share", "delete", "details"].includes(
                      actionItem.value
                    )
                  ) {
                    setIsModalOpen(true);
                  }
                }}
              >
                {actionItem.value === "download" ? (
                  <Link
                    href={constructDownloadUrl(file.bucketFileId)}
                    download={file.name}
                    className="flex items-center gap-2"
                  >
                    <Image
                      src={actionItem.icon}
                      alt={actionItem.label}
                      width={30}
                      height={30}
                    />
                    {actionItem.label}
                  </Link>
                ) : (
                  <div className="flex items-center gap-2">
                    <Image
                      src={actionItem.icon}
                      alt={actionItem.label}
                      width={30}
                      height={30}
                    />
                    {actionItem.label}
                  </div>
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        {renderDialogContent()}
      </Dialog>
    </>
  );
};

export default ActionsDropdown;
