import React from "react";
import { Button } from "./ui/button";
import Image from "next/image";
import Search from "./Search";
import FileUploader from "./FileUploader";

const Header = () => {
  return (
    <>
      <div className="hidden items-center justify-between gap-5 p-5 sm:flex lg:py-7 xl:gap-10">
        <Search />
        <div className="flex items-center justify-center min-w-fit gap-4">
          <FileUploader />
          <form>
            <Button
              type="submit"
              className="flex items-center justify-center h-[52px] min-w-[54px] rounded-full bg-brand/10! p-0 text-brand shadow-none transition-all hover:bg-brand/20!"
            >
              <Image
                src="/assets/icons/logout.svg"
                alt="logout"
                width={24}
                height={24}
                className="w-6"
              />
            </Button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Header;
