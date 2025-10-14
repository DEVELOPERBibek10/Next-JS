"user client";
import { ExtendedFileRow } from "@/types";
import Link from "next/link";
import React from "react";
import Thumbnail from "./Thumbnail";
import { convertFileSize } from "@/lib/utils";
import FormatedDateAndTime from "./FormatedDateAndTime";
import { getUserDocument } from "@/actions/fileActions";
import ActionsDropdown from "./ActionsDropdown";

const Card = async ({ file }: { file: ExtendedFileRow }) => {
  const user = await getUserDocument(file.owner);
  return (
    <Link
      href={file.url}
      target="_blank"
      className="flex cursor-pointer flex-col gap-6 rounded-[18px] bg-white p-5 shadow-sm transition-all hover:shadow-drop-3"
    >
      <div className="flex justify-between">
        <Thumbnail
          type={file.type}
          extension={file.extension}
          url={file.url}
          className="size-20!"
          imageClassName="size-11!"
        />
        <div className="flex flex-col items-end justify-between">
          <ActionsDropdown file={file} />
          <p className="text-[16px] leading-[24px] font-normal">
            {convertFileSize(file.size)}
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-2 text-light-100 ">
        <p className="text-[14px] leading-[20px] font-semibold line-clamp-1">
          {file.name}
        </p>
        <FormatedDateAndTime
          date={file.$createdAt}
          className="text-[14px] leading-[20px] font-normal text-light-100"
        />
      </div>
      <p className="text-[12px] leading-[16px] font-normal text-light-200">
        {user.fullName}
      </p>
    </Link>
  );
};

export default Card;
