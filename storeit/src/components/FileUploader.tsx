"use client";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "./ui/button";
import { cn, convertFileToUrl, getFileType } from "@/lib/utils";
import Image from "next/image";
import Thumbnail from "./Thumbnail";
import { MAX_FILE_SIZE } from "@/constants";
import { toast } from "sonner";
import { uploadFile } from "@/actions/fileActions";
import { usePathname } from "next/navigation";

interface FileUploaderProps {
  ownerId: string;
  accountId: string;
  className?: string;
}

function FileUploader({ ownerId, accountId }: FileUploaderProps) {
  const [files, setFiles] = useState<File[]>([]);
  const path = usePathname();
  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);

      const uploadPromises = acceptedFiles.map((file) => {
        if (file.size > MAX_FILE_SIZE) {
          setFiles((prevFiles) =>
            prevFiles.filter((f) => f.name !== file.name)
          );

          return toast.error(
            <p className="text-[14px] leading-[20px] font-normal text-white">
              <span className="font-semibold">{file.name}</span> is too large.
              Max file size is 50MB.
            </p>
          );
        }
        return uploadFile({ file, ownerId, accountId, path })
          .then((uploadedFile) => {
            if (uploadedFile) {
              setFiles((prevFiles) =>
                prevFiles.filter((f) => f.name !== file.name)
              );
            }
          })
          .catch((error) => {
            if (error) {
              toast.error(
                <p className="text-[14px] leading-[20px] font-normal text-white">
                  {error.message}
                </p>
              );
              setFiles((prevFiles) =>
                prevFiles.filter((f) => f.name !== file.name)
              );
            }
          });
      });
      await Promise.all(uploadPromises);
    },
    [ownerId, accountId, path]
  );

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const handleRemoveFile = (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>,
    fileToRemove: File
  ) => {
    e.stopPropagation();
    setFiles((prevFiles) =>
      prevFiles.filter((file) => file.name !== fileToRemove.name)
    );
  };

  return (
    <div {...getRootProps()} className="cursor-pointer">
      <input {...getInputProps()} />
      <Button
        className={cn(
          "bg-brand hover:bg-brand-100 transition-all rounded-full text-[14px] leading-[20px] font-medium h-[52px] gap-2 px-10 shadow-drop-1 cursor-pointer"
        )}
      >
        <Image
          src={"/assets/icons/upload.svg"}
          alt="upload"
          width={24}
          height={24}
        />
        <p>Upload</p>
      </Button>
      {files.length > 0 && (
        <ul className="fixed bottom-10 right-10 z-50 flex size-full h-fit max-w-[480px] flex-col gap-3 rounded-[20px] bg-white p-7 shadow-drop-3">
          <h4 className="text-light-100 text-[18px] leading-[20px] font-medium">
            Uploading
          </h4>

          {files.map((file) => {
            const { type, extension } = getFileType(file.name);

            return (
              <li
                key={`${file.name}-${file.lastModified}`}
                className="flex items-center justify-between  gap-3 rounded-xl p-3 shadow-drop-3"
              >
                <div className="flex items-center gap-3">
                  <Thumbnail
                    type={type}
                    extension={extension}
                    url={convertFileToUrl(file)}
                  />
                  <div className="text-[14px] leading-[20px] font-semibold mb-2 line-clamp-1 max-w-[300px]">
                    {file.name}
                    <Image
                      src={"/assets/icons/file-loader.gif"}
                      alt="file-loader"
                      width={80}
                      height={26}
                    />
                  </div>
                </div>
                <Image
                  src={"/assets/icons/remove.svg"}
                  width={24}
                  height={24}
                  alt="remove"
                  onClick={(e) => handleRemoveFile(e, file)}
                />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default FileUploader;
