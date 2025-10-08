import React, { Suspense } from "react";

import AuthProfile from "./authProfile";
import SearchInput from "./searchInput";

const Header = async () => {
  return (
    <div className="grid grid-cols-3 gap-4 my-4 ">
      <div className="flex justify-start">
        <h1 className="font-bold text-xl">Discuss</h1>
      </div>
      <div className="justify-center flex w-full">
        <Suspense>
          <SearchInput />
        </Suspense>
      </div>
      <div className="flex justify-end gap-4">
        <AuthProfile />
      </div>
    </div>
  );
};

export default Header;
