"use client";
import React from "react";
import { Input } from "./ui/input";
import { search } from "@/actions/search";
import { useSearchParams } from "next/navigation";

const SearchInput = () => {
  const searchParams = useSearchParams();
  return (
    <div>
      <form action={search}>
        <Input
          defaultValue={searchParams.get("term") || ""}
          className=" h-12 w-96"
          type="text"
          name="term"
          placeholder="Search..."
        />
      </form>
    </div>
  );
};

export default SearchInput;
