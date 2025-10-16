/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { getFiles } from "@/actions/fileActions";
import { Models } from "node-appwrite";
import Thumbnail from "./Thumbnail";
import FormatedDateAndTime from "./FormatedDateAndTime";
import { useDebounce } from "use-debounce";

const Search = () => {
  const [query, setQuery] = useState("");
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("query") || "";
  const [results, setResults] = useState<Models.DefaultRow[]>([]);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const path = usePathname();
  const [debouncedQuery] = useDebounce(query, 2000);

  useEffect(() => {
    const fetchFiles = async () => {
      if (!debouncedQuery) {
        setResults([]);
        setOpen(false);
        return router.push(path.replace(searchParams.toString(), ""));
      }
      const files = await getFiles({ searchText: debouncedQuery });
      if (files) {
        setResults(files.rows);
      }
    };
    setOpen(true);
    fetchFiles();
  }, [debouncedQuery]);

  useEffect(() => {
    if (!searchQuery) {
      setQuery("");
    }
  }, [searchQuery]);

  const handleClickItem = (file: Models.DefaultRow) => {
    setOpen(false);
    setResults([]);
    router.push(
      `/${
        file.type === "video" || file.type === "audio"
          ? "media"
          : file.type + "s"
      }?query=${query}`
    );
  };

  return (
    <div className="relative w-full md:max-w-[480px]">
      <div className="flex h-[52px] flex-1 items-center gap-3 rounded-full px-4 shadow-drop-3">
        <Image
          src={"/assets/icons/search.svg"}
          alt="search"
          width={24}
          height={24}
        />
        <Input
          value={query}
          placeholder="Search..."
          onChange={(e) => setQuery(e.target.value)}
          className="text-[14px] leading-[20px] font-normal outline-none ring-offset-transparent focus:ring-transparent focus:ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0  placeholder:body-1 w-full border-none p-0 shadow-none placeholder:text-light-200"
        />
        {open && (
          <ul className="absolute left-0 top-16 z-50 flex w-full flex-col gap-3 rounded-[20px] bg-white p-4">
            {results.length > 0 ? (
              results.map((file) => (
                <li
                  key={file.$id}
                  className=" flex items-center justify-between"
                  onClick={() => handleClickItem(file)}
                >
                  <div className="flex cursor-pointer items-center gap-4">
                    <Thumbnail
                      type={file.type}
                      extension={file.extension}
                      url={file.url}
                      className="size-9 min-w-9"
                    />
                    <p className="line-clamp-1 text-light-100 text-[14px] leading-[20px] font-semibold">
                      {file.name}
                    </p>
                  </div>
                  <FormatedDateAndTime
                    date={file.$createdAt}
                    className="line-clamp-1 text-light-200 text-[12px] leading-[16px] font-normal"
                  />
                </li>
              ))
            ) : (
              <p className="text-[14px] leading-[20px] font-normal text-center text-light-100 ">
                No files found
              </p>
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Search;
