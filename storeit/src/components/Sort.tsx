"use client";
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePathname, useRouter } from "next/navigation";
import { sortTypes } from "@/constants";

const Sort = () => {
  const path = usePathname();
  const router = useRouter();

  const handelSort = (value: string) => {
    router.push(`${path}?sort=${value}`);
  };

  return (
    <Select onValueChange={handelSort} defaultValue={sortTypes[0].value}>
      <SelectTrigger className="outline-none ring-offset-transparent focus:ring-transparent focus:ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 h-11 w-full rounded-[8px] border-transparent bg-white !shadow-sm sm:w-[210px]">
        <SelectValue placeholder={sortTypes[0].value} />
      </SelectTrigger>
      <SelectContent className="!shadow-drop-3">
        {sortTypes.map((sort) => (
          <SelectItem
            className="cursor-pointer"
            key={sort.label}
            value={sort.value}
          >
            {sort.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default Sort;
