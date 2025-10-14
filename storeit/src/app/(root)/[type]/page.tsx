import { getFiles } from "@/actions/fileActions";
import Card from "@/components/Card";
import Sort from "@/components/Sort";
import { convertFileSize, getTotalFileSize } from "@/lib/utils";
import { ExtendedFileRow, SearchParamProps } from "@/types";
import React from "react";

const Page = async ({ params }: SearchParamProps) => {
  const type = (await params)?.type as string;
  const files = await getFiles();

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-8">
      <section className="w-full">
        <h1 className="text-[34px] leading-[42px] font-bold capitalize">
          {type}
        </h1>

        <div className="flex mt-2 flex-col justify-between sm:flex-row sm:items-center">
          <p className="text-[16px] leading-[24px] font-normal">
            Total <span className="ml-0.5">:</span>
            <span className="text-[16px] leading-[24px] font-semibold ml-1">
              {convertFileSize(getTotalFileSize(files))}
            </span>
          </p>

          <div className="mt-5 flex items-center sm:mt-0 sm:gap-3">
            <p className="text-[16px] leading-[24px] font-normal hidden sm:block text-light-200">
              Sort by:
            </p>
            <Sort />
          </div>
        </div>
      </section>
      {files.total > 0 ? (
        <section className="grid w-full gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {(files.rows as ExtendedFileRow[]).map((file: ExtendedFileRow) => (
            <Card key={file.$id} file={file} />
          ))}
        </section>
      ) : (
        <p className="text-[16px] leading-[24px] font-normal mt-10 text-center text-light-200">
          No files uploaded
        </p>
      )}
    </div>
  );
};

export default Page;
