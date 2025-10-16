import Image from "next/image";
import Link from "next/link";
import { Models } from "node-appwrite";

import { Chart } from "@/components/Chart";

import { Separator } from "@/components/ui/separator";

import { convertFileSize, getUsageSummary } from "@/lib/utils";
import {
  getFiles,
  getTotalSpaceUsed,
  getUserDocument,
} from "@/actions/fileActions";
import FormatedDateAndTime from "@/components/FormatedDateAndTime";
import Thumbnail from "@/components/Thumbnail";
import ActionsDropdown from "@/components/ActionsDropdown";

const Dashboard = async () => {
  // Parallel requests
  const [files, totalSpace] = await Promise.all([
    getFiles({ types: [], limit: 10 }),
    getTotalSpaceUsed(),
  ]);

  // Get usage summary
  const usageSummary = getUsageSummary(totalSpace);
  const getOwner = async function (owner: string) {
    const ownerDoc = await getUserDocument(owner);
    return ownerDoc.fullName as string;
  };

  return (
    <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 md:grid-cols-2 xl:gap-10">
      <section>
        <Chart used={totalSpace.used} />

        {/* Uploaded file type summaries */}
        <ul className="mt-6 grid grid-cols-1 gap-4 xl:mt-10 xl:grid-cols-2 xl:gap-9">
          {usageSummary.map((summary) => (
            <Link
              href={summary.url}
              key={summary.title}
              className="relative mt-6 rounded-[20px] bg-white p-5 transition-all hover:scale-105"
            >
              <div className="space-y-4">
                <div className="flex justify-between gap-3">
                  <Image
                    src={summary.icon}
                    width={100}
                    height={100}
                    alt="uploaded-image"
                    className="absolute -left-3 top-[-25px] z-10 w-[190px] object-contain"
                  />
                  <h4 className="text-[18px] leading-[20px] font-medium relative z-20 w-full text-right">
                    {convertFileSize(summary.size) || 0}
                  </h4>
                </div>

                <h5 className="text-[16px] leading-[24px] font-semibold relative z-20 text-center">
                  {summary.title}
                </h5>
                <Separator className="bg-light-400" />
                <FormatedDateAndTime
                  date={summary.latestDate}
                  className="text-center"
                />
              </div>
            </Link>
          ))}
        </ul>
      </section>

      {/* Recent files uploaded */}
      <section className="h-full rounded-[20px] xl:h-[654px] custom-scrollbar overflow-auto bg-white p-5 xl:p-7">
        <h2 className="h3 xl:h2 text-light-100">Recent files uploaded</h2>
        {files.rows.length > 0 ? (
          <ul className="mt-5 flex flex-col gap-5">
            {files.rows.map(async (file: Models.DefaultRow) => (
              <Link
                href={file.url}
                target="_blank"
                className="flex items-center gap-3"
                key={file.$id}
              >
                <Thumbnail
                  type={file.type}
                  extension={file.extension}
                  url={file.url}
                />

                <div className="flex w-full justify-between items-center">
                  <div className="flex flex-col gap-1">
                    <p className="text-[14px] leading-[20px] font-semibold line-clamp-1 w-full text-light-100 sm:max-w-[200px] lg:max-w-[250px]">
                      {file.name}
                    </p>
                    <FormatedDateAndTime
                      date={file.$createdAt}
                      className="text-[12px] leading-[16px] font-normal"
                    />
                  </div>
                  <ActionsDropdown
                    file={file}
                    owner={await getOwner(file.owner)}
                  />
                </div>
              </Link>
            ))}
          </ul>
        ) : (
          <p className="text-[16px] leading-[24px] font-normal mt-10 text-center text-light-200">
            No files uploaded
          </p>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
